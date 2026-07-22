const Category = require("../models/Category");
const getMessage = require("../utils/messages");

exports.addCategory = async (req, res) => {
  const lang = req.headers["accept-language"] || "en";

  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ msg: getMessage(lang, "requiredFields") });
    }

    const existing = await Category.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
      userId: req.user.id,
    });

    if (existing) {
      return res.status(400).json({ msg: getMessage(lang, "categoryExists") });
    }

    const newCategory = new Category({ name, userId: req.user.id });
    const category = await newCategory.save();
    res.json({ category, msg: getMessage(lang, "categoryAdded") });
  } catch (err) {
    console.error(err.message);
    res.status(500).send(getMessage(lang, "serverError"));
  }
};

exports.getCategories = async (req, res) => {
  const lang = req.headers["accept-language"] || "en";

  try {
    const categories = await Category.find({ userId: req.user.id });
    res.json(categories);
  } catch (err) {
    console.error(err.message);
    res.status(500).send(getMessage(lang, "serverError"));
  }
};

exports.updateCategory = async (req, res) => {
  const lang = req.headers["accept-language"] || "en";

  try {
    const category = await Category.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );
    res.json(category);
  } catch (err) {
    console.error(err.message);
    res.status(500).send(getMessage(lang, "serverError"));
  }
};

exports.deleteCategory = async (req, res) => {
  const lang = req.headers["accept-language"] || "en";

  try {
    await Category.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    res.json({ msg: getMessage(lang, "categoryDeleted") });
  } catch (err) {
    console.error(err.message);
    res.status(500).send(getMessage(lang, "serverError"));
  }
};
