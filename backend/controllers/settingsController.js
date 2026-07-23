const User = require("../models/User");
const getMessage = require("../utils/messages");

exports.getSavingsGoal = async (req, res) => {
  const lang = req.headers["accept-language"] || "en";
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: getMessage(lang, "notFound") });
    res.json({ goal: user.savingsGoal || 0 });
  } catch (err) {
    res.status(500).json({ msg: getMessage(lang, "serverError") });
  }
};

exports.setSavingsGoal = async (req, res) => {
  const lang = req.headers["accept-language"] || "en";
  try {
    const goal = Number(req.body.goal);
    if (Number.isNaN(goal) || goal < 0) {
      return res.status(400).json({ msg: getMessage(lang, "requiredFields") });
    }
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { savingsGoal: goal },
      { new: true }
    );
    if (!user) return res.status(404).json({ msg: getMessage(lang, "notFound") });
    res.json({ goal: user.savingsGoal, msg: getMessage(lang, "savingsGoalSaved") });
  } catch (err) {
    res.status(500).json({ msg: getMessage(lang, "serverError") });
  }
};
