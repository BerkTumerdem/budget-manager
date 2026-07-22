const User = require("../models/User");

// GET /settings/savings-goal
exports.getSavingsGoal = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ goal: user.savingsGoal || 0 });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// POST /settings/savings-goal
exports.setSavingsGoal = async (req, res) => {
  try {
    const { goal } = req.body;
    if (typeof goal !== "number" || goal < 0)
      return res.status(400).json({ message: "Invalid savings goal" });
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { savingsGoal: goal },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ goal: user.savingsGoal });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
}; 