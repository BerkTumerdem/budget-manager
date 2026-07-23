const Expense = require("../models/Expense");
const exportToCSV = require("../utils/exportToCSV");
const User = require("../models/User");
const getMessage = require("../utils/messages");
const {
  buildExpenseQuery,
  filterByCategoryName,
  summarizeExpenses,
  normalizeType,
  normalizeAmount,
} = require("../utils/expenseQuery");

const removeDiacritics = (str) => {
  if (!str) return "";
  return str.normalize("NFD").replace(/\p{Diacritic}/gu, "").replace(/[^\x00-\x7F]/g, "");
};

exports.exportExpensesCSV = async (req, res) => {
  const lang = req.headers["accept-language"] || "en";

  try {
    const user = await User.findById(req.user.id);
    const userEmail = user ? user.email : "unknown";
    const filter = buildExpenseQuery(req.user.id, req.query);
    let expenses = await Expense.find(filter).populate("category").sort({ date: -1 });
    expenses = filterByCategoryName(expenses, req.query.category);

    const { totalBalance, income, expenses: expensesTotal } = summarizeExpenses(expenses);

    const data = expenses.map((e) => {
      const type = normalizeType(e.type);
      const amount = normalizeAmount(e.amount);
      return {
        Date: `'${e.date.toISOString().split("T")[0]}`,
        Amount: amount.toFixed(2),
        Type: type.charAt(0).toUpperCase() + type.slice(1),
        Category: removeDiacritics(e.category?.name || "Uncategorized"),
        Description: removeDiacritics(e.description || ""),
      };
    });

    data.push({
      Date: "",
      Amount: "",
      Type: "",
      Category: "--- SUMMARY ---",
      Description: "",
    });
    data.push({
      Date: "",
      Amount: income.toFixed(2),
      Type: "Total Income",
      Category: "",
      Description: "",
    });
    data.push({
      Date: "",
      Amount: expensesTotal.toFixed(2),
      Type: "Total Expenses",
      Category: "",
      Description: "",
    });
    data.push({
      Date: "",
      Amount: totalBalance.toFixed(2),
      Type: "Balance",
      Category: "",
      Description: "",
    });

    const fields = ["Date", "Amount", "Type", "Category", "Description"];
    let csv = exportToCSV(data, fields);
    csv = "\uFEFF" + csv;

    const now = new Date();
    const dateStr = now.toISOString().split("T")[0];
    const timeStr = now.toTimeString().split(" ")[0].replace(/:/g, "-");
    const safeEmail = String(userEmail).replace(/[^a-zA-Z0-9.@_-]/g, "_");
    const filename = `expenses_${safeEmail}_${dateStr}_${timeStr}.csv`;
    res.header("Content-Type", "text/csv; charset=utf-8");
    res.attachment(filename);
    return res.send(csv);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: getMessage(lang, "serverError") });
  }
};
