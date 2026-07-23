const Expense = require("../models/Expense");
const getMessage = require("../utils/messages");
const {
  buildExpenseQuery,
  filterByCategoryName,
  summarizeExpenses,
} = require("../utils/expenseQuery");

exports.getReport = async (req, res) => {
  const lang = req.headers["accept-language"] || "en";

  try {
    const filter = buildExpenseQuery(req.user.id, req.query);
    let expenses = await Expense.find(filter).populate("category");
    expenses = filterByCategoryName(expenses, req.query.category);

    const { totalBalance, income, expenses: expensesTotal, categorySummary } =
      summarizeExpenses(expenses);

    res.json({
      totalBalance,
      income,
      expenses: expensesTotal,
      categorySummary,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: getMessage(lang, "serverError") });
  }
};
