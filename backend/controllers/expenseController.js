const Expense = require("../models/Expense");
const getMessage = require("../utils/messages");

exports.addExpense = async (req, res) => {
  const lang = req.headers["accept-language"] || "en";

  try {
    const { amount, date, type } = req.body;
    if (!amount || !date || !type) {
      return res.status(400).json({ msg: getMessage(lang, "requiredFields") });
    }

    const newExpense = new Expense({ ...req.body, userId: req.user.id });
    const expense = await newExpense.save();
    res.json(expense);
  } catch (err) {
    console.error(err.message);
    res.status(500).send(getMessage(lang, "serverError"));
  }
};

exports.getExpenses = async (req, res) => {
  const lang = req.headers["accept-language"] || "en";

  try {
    const expenses = await Expense.find({ userId: req.user.id }).populate("category");
    res.json(expenses);
  } catch (err) {
    console.error(err.message);
    res.status(500).send(getMessage(lang, "serverError"));
  }
};

exports.updateExpense = async (req, res) => {
  const lang = req.headers["accept-language"] || "en";

  try {
    const expense = await Expense.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    ).populate("category");

    if (!expense) {
      return res.status(404).json({ msg: getMessage(lang, "serverError") });
    }

    res.json(expense);
  } catch (err) {
    console.error(err.message);
    res.status(500).send(getMessage(lang, "serverError"));
  }
};

exports.deleteExpense = async (req, res) => {
  const lang = req.headers["accept-language"] || "en";

  try {
    await Expense.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    res.json({ msg: getMessage(lang, "expenseDeleted") });
  } catch (err) {
    console.error(err.message);
    res.status(500).send(getMessage(lang, "serverError"));
  }
};
