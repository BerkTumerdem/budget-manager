const PDFDocument = require("pdfkit");
const Expense = require("../models/Expense");
const path = require("path");
const fs = require("fs");
const User = require("../models/User");
const { buildExpenseQuery, filterByCategoryName } = require("../utils/expenseQuery");

function removeDiacritics(str) {
  if (!str) return "";
  return str.normalize("NFD").replace(/\p{Diacritic}/gu, "").replace(/[^\x00-\x7F]/g, "");
}

exports.generatePDFReport = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const userEmail = user ? user.email : "unknown";
    const filter = buildExpenseQuery(req.user.id, req.query);
    let expenses = await Expense.find(filter).populate("category");
    expenses = filterByCategoryName(expenses, req.query.category);

    const summary = {};
    let totalBalance = 0;
    let income = 0;
    let expensesTotal = 0;

    expenses.forEach((exp) => {
      const cat = exp.category?.name || "Uncategorized";
      const amount = Math.abs(Number(exp.amount) || 0);

      if (exp.type === "income") {
        income += amount;
        totalBalance += amount;
      } else {
        expensesTotal += amount;
        totalBalance -= amount;
      }

      summary[cat] = (summary[cat] || 0) + (exp.type === "income" ? amount : -amount);
    });

    const doc = new PDFDocument({ margin: 40 });
    const now = new Date();
    const dateStr = now.toISOString().split("T")[0];
    const timeStr = now.toTimeString().split(" ")[0].replace(/:/g, "-");
    const safeEmail = String(userEmail).replace(/[^a-zA-Z0-9.@_-]/g, "_");
    const filename = `budget-report_${safeEmail}_${dateStr}_${timeStr}.pdf`;

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

    doc.pipe(res);

    const logoPath = path.join(__dirname, "../assets/mchLOGO.png");
    let logoHeight = 0;
    if (fs.existsSync(logoPath)) {
      doc.image(logoPath, doc.page.width / 2 - 50, 30, { width: 100 });
      logoHeight = 100;
      doc.moveDown(5);
      doc.y = 30 + logoHeight + 20;
    } else {
      doc.moveDown(2);
    }

    doc.fontSize(22).font("Helvetica-Bold").text("Budget Report", { align: "center" });
    doc.moveDown(1.5);

    doc.fontSize(14).font("Helvetica-Bold").text("Summary", { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(12).font("Helvetica");
    doc.text(`Income:      ${income.toFixed(2)} lei`);
    doc.text(`Expenses:    ${expensesTotal.toFixed(2)} lei`);
    doc.text(`Balance:     ${totalBalance.toFixed(2)} lei`);
    doc.moveDown(1);

    doc.fontSize(14).font("Helvetica-Bold").text("Summary by Category", { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(12).font("Helvetica");

    const tableTop = doc.y;
    const col1 = 60;
    const col2 = 320;
    const col3 = 450;
    doc.font("Helvetica-Bold");
    doc.text("Category", col1, tableTop);
    doc.text("Amount", col2, tableTop);
    doc.text("Type", col3, tableTop);
    doc.moveDown(0.5);
    doc.font("Helvetica");
    doc.moveTo(col1, doc.y).lineTo(col3 + 80, doc.y).stroke();

    Object.entries(summary).forEach(([cat, total]) => {
      const y = doc.y + 4;
      doc.text(removeDiacritics(cat), col1, y);
      doc.text(`${Math.abs(total).toFixed(2)} lei`, col2, y);
      doc.text(total >= 0 ? "Income (+)" : "Expense (-)", col3, y, { continued: false });
      doc.moveDown(0.5);
    });

    doc.moveDown(2);
    doc.fontSize(10).fillColor("gray").text(`Generated on: ${new Date().toLocaleString()}`, { align: "right" });
    doc.end();
  } catch (err) {
    console.error("PDF generation failed:", err.message);
    res.status(500).send("Error generating PDF");
  }
};
