const Expense = require("../models/Expense");
const getMessage = require("../utils/messages");

exports.getReport = async (req, res) => {
  const lang = req.headers["accept-language"] || "en";

  try {
    const expenses = await Expense.find({ userId: req.user.id }).populate("category");

    const summary = {};
    let totalBalance = 0;
    let income = 0;
    let expensesTotal = 0;

    expenses.forEach((exp) => {
      const cat = exp.category?.name || "Uncategorized";
      const amount = Math.abs(exp.amount);
      const type = (exp.type || "").toLowerCase();

      if (type === "income") {
        income += amount;
        totalBalance += amount;
        summary[cat] = (summary[cat] || 0) + amount;
      } else if (type === "expense") {
        expensesTotal += amount;
        totalBalance -= amount;
        summary[cat] = (summary[cat] || 0) - amount;
      }
    });

    res.json({
      totalBalance,
      income,
      expenses: expensesTotal,
      categorySummary: summary,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send(getMessage(lang, "serverError"));
  }
};
