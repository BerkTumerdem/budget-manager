const Expense = require("../models/Expense");
const Category = require("../models/Category");
const getMessage = require("../utils/messages");
const { isValidObjectId } = require("../utils/expenseQuery");

const ALLOWED_TYPES = new Set(["income", "expense"]);

async function resolveOwnedCategory(categoryId, userId, lang) {
  if (!categoryId) return { ok: true, category: undefined };
  if (!isValidObjectId(categoryId)) {
    return { ok: false, status: 400, msg: getMessage(lang, "requiredFields") };
  }
  const category = await Category.findOne({ _id: categoryId, userId });
  if (!category) {
    return { ok: false, status: 400, msg: getMessage(lang, "notFound") };
  }
  return { ok: true, category: category._id };
}

function parseExpenseBody(body) {
  const amount = Number(body.amount);
  const type = String(body.type || "").toLowerCase();
  const description = body.description != null ? String(body.description) : "";
  const date = body.date;
  const category = body.category || undefined;
  return { amount, type, description, date, category };
}

function validateExpenseFields({ amount, type, date }, lang) {
  if (!date || !type) {
    return getMessage(lang, "requiredFields");
  }
  if (!Number.isFinite(amount) || amount <= 0) {
    return getMessage(lang, "requiredFields");
  }
  if (!ALLOWED_TYPES.has(type)) {
    return getMessage(lang, "requiredFields");
  }
  return null;
}

exports.addExpense = async (req, res) => {
  const lang = req.headers["accept-language"] || "en";

  try {
    const fields = parseExpenseBody(req.body);
    const validationError = validateExpenseFields(fields, lang);
    if (validationError) {
      return res.status(400).json({ msg: validationError });
    }

    const catResult = await resolveOwnedCategory(fields.category, req.user.id, lang);
    if (!catResult.ok) {
      return res.status(catResult.status).json({ msg: catResult.msg });
    }

    const expense = await new Expense({
      amount: fields.amount,
      description: fields.description,
      date: fields.date,
      type: fields.type,
      category: catResult.category,
      userId: req.user.id,
    }).save();

    const populated = await expense.populate("category");
    res.json(populated);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: getMessage(lang, "serverError") });
  }
};

exports.getExpenses = async (req, res) => {
  const lang = req.headers["accept-language"] || "en";

  try {
    const expenses = await Expense.find({ userId: req.user.id }).populate("category");
    res.json(expenses);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: getMessage(lang, "serverError") });
  }
};

exports.updateExpense = async (req, res) => {
  const lang = req.headers["accept-language"] || "en";

  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(404).json({ msg: getMessage(lang, "notFound") });
    }

    const fields = parseExpenseBody(req.body);
    const validationError = validateExpenseFields(fields, lang);
    if (validationError) {
      return res.status(400).json({ msg: validationError });
    }

    const catResult = await resolveOwnedCategory(fields.category, req.user.id, lang);
    if (!catResult.ok) {
      return res.status(catResult.status).json({ msg: catResult.msg });
    }

    const expense = await Expense.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      {
        amount: fields.amount,
        description: fields.description,
        date: fields.date,
        type: fields.type,
        category: catResult.category ?? null,
      },
      { new: true }
    ).populate("category");

    if (!expense) {
      return res.status(404).json({ msg: getMessage(lang, "notFound") });
    }

    res.json(expense);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: getMessage(lang, "serverError") });
  }
};

exports.deleteExpense = async (req, res) => {
  const lang = req.headers["accept-language"] || "en";

  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(404).json({ msg: getMessage(lang, "notFound") });
    }

    const deleted = await Expense.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!deleted) {
      return res.status(404).json({ msg: getMessage(lang, "notFound") });
    }

    res.json({ msg: getMessage(lang, "expenseDeleted") });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: getMessage(lang, "serverError") });
  }
};
