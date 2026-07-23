const Category = require("../models/Category");
const getMessage = require("../utils/messages");
const { isValidObjectId, isValidHexColor } = require("../utils/expenseQuery");

exports.addCategory = async (req, res) => {
  const lang = req.headers["accept-language"] || "en";

  try {
    const { name, color } = req.body;
    if (!name || !String(name).trim()) {
      return res.status(400).json({ msg: getMessage(lang, "requiredFields") });
    }

    const trimmed = String(name).trim();
    const existing = await Category.findOne({
      name: { $regex: new RegExp(`^${trimmed.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i") },
      userId: req.user.id,
    });

    if (existing) {
      return res.status(400).json({ msg: getMessage(lang, "categoryExists") });
    }

    const count = await Category.countDocuments({ userId: req.user.id });
    const safeColor = isValidHexColor(color) ? color : Category.nextColor(count);

    const category = await new Category({
      name: trimmed,
      color: safeColor,
      userId: req.user.id,
    }).save();

    res.json({ category, msg: getMessage(lang, "categoryAdded") });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: getMessage(lang, "serverError") });
  }
};

exports.getCategories = async (req, res) => {
  const lang = req.headers["accept-language"] || "en";

  try {
    const categories = await Category.find({ userId: req.user.id });
    res.json(categories);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: getMessage(lang, "serverError") });
  }
};

exports.updateCategory = async (req, res) => {
  const lang = req.headers["accept-language"] || "en";

  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(404).json({ msg: getMessage(lang, "notFound") });
    }

    const updates = {};
    if (req.body.name !== undefined) updates.name = String(req.body.name).trim();
    if (req.body.color !== undefined) {
      if (!isValidHexColor(req.body.color)) {
        return res.status(400).json({ msg: getMessage(lang, "requiredFields") });
      }
      updates.color = req.body.color;
    }

    if (updates.name) {
      const duplicate = await Category.findOne({
        _id: { $ne: req.params.id },
        userId: req.user.id,
        name: { $regex: new RegExp(`^${updates.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i") },
      });
      if (duplicate) {
        return res.status(400).json({ msg: getMessage(lang, "categoryExists") });
      }
    }

    const category = await Category.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      updates,
      { new: true }
    );

    if (!category) {
      return res.status(404).json({ msg: getMessage(lang, "notFound") });
    }

    res.json({ category, msg: getMessage(lang, "categoryUpdated") });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: getMessage(lang, "serverError") });
  }
};

exports.deleteCategory = async (req, res) => {
  const lang = req.headers["accept-language"] || "en";

  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(404).json({ msg: getMessage(lang, "notFound") });
    }

    const deleted = await Category.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!deleted) {
      return res.status(404).json({ msg: getMessage(lang, "notFound") });
    }

    res.json({ msg: getMessage(lang, "categoryDeleted") });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: getMessage(lang, "serverError") });
  }
};
