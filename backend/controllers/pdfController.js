const PDFDocument = require("pdfkit");
const Expense = require("../models/Expense");
const path = require("path");
const fs = require("fs");
const User = require("../models/User");

// Utility to remove diacritics
function removeDiacritics(str) {
  if (!str) return '';
  return str.normalize('NFD').replace(/\p{Diacritic}/gu, '').replace(/[^\x00-\x7F]/g, '');
}

exports.generatePDFReport = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const userEmail = user ? user.email : "unknown";
    const expenses = await Expense.find({ userId: req.user.id }).populate("category");

    // Prepare summary per category
    const summary = {};
    let totalBalance = 0;
    let income = 0;
    let expensesTotal = 0;

    expenses.forEach((exp) => {
      const cat = exp.category?.name || "Uncategorized";
      const amount = exp.amount;

      if (exp.type === "income") {
        income += amount;
        totalBalance += amount;
      } else {
        expensesTotal += amount;
        totalBalance -= amount;
      }

      summary[cat] = (summary[cat] || 0) + (exp.type === "income" ? amount : -amount);
    });

    // Generate PDF
    const doc = new PDFDocument({ margin: 40 });
    const now = new Date();
    const dateStr = now.toISOString().split("T")[0];
    const timeStr = now.toTimeString().split(" ")[0];
    const filename = `${userEmail}, ${timeStr}, ${dateStr}, exported with MCH by Berk.pdf`;

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=\"${filename}\"`);

    doc.pipe(res);

    // Add logo if available
    const logoPath = path.join(__dirname, "../../frontend/public/mchLOGO.png");
    let logoHeight = 0;
    if (fs.existsSync(logoPath)) {
      // Draw logo at the top center
      doc.image(logoPath, doc.page.width / 2 - 50, 30, { width: 100 });
      logoHeight = 100; // approximate height
      doc.moveDown(5); // Add more space after logo
      doc.y = 30 + logoHeight + 20; // Ensure text starts below logo
    } else {
      doc.moveDown(2);
    }

    // Header
    doc.fontSize(22).font('Helvetica-Bold').text("Budget Report", { align: "center" });
    doc.moveDown(1.5);

    // Summary Section
    doc.fontSize(14).font('Helvetica-Bold').text("Summary", { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(12).font('Helvetica');
    doc.text(`Income:      ${income.toFixed(2)} lei`);
    doc.text(`Expenses:    ${expensesTotal.toFixed(2)} lei`);
    doc.text(`Balance:     ${totalBalance.toFixed(2)} lei`);
    doc.moveDown(1);

    // Category Summary Table
    doc.fontSize(14).font('Helvetica-Bold').text("Summary by Category", { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(12).font('Helvetica');

    // Table header
    const tableTop = doc.y;
    const col1 = 60, col2 = 320, col3 = 450;
    doc.font('Helvetica-Bold');
    doc.text("Category", col1, tableTop);
    doc.text("Amount", col2, tableTop);
    doc.text("Type", col3, tableTop);
    doc.moveDown(0.5);
    doc.font('Helvetica');
    doc.moveTo(col1, doc.y).lineTo(col3 + 80, doc.y).stroke();

    // Table rows
    Object.entries(summary).forEach(([cat, total], idx) => {
      const y = doc.y + 4;
      const cleanCat = removeDiacritics(cat);
      doc.text(cleanCat, col1, y);
      doc.text(`${Math.abs(total).toFixed(2)} lei`, col2, y);
      doc.text(total >= 0 ? "Income (+)" : "Expense (-)", col3, y, { continued: false });
      doc.moveDown(0.5);
    });

    // Footer
    doc.moveDown(2);
    doc.fontSize(10).fillColor('gray').text(`Generated on: ${new Date().toLocaleString()}`, { align: 'right' });

    // Finalize PDF
    doc.end();

  } catch (err) {
    console.error("PDF generation failed:", err.message);
    res.status(500).send("Error generating PDF");
  }
};
