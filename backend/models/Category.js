const mongoose = require("mongoose");

const DEFAULT_COLORS = [
  "#10b981",
  "#3b82f6",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#14b8a6",
  "#ec4899",
  "#6366f1",
];

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  color: { type: String, default: "#10b981" },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

CategorySchema.statics.nextColor = function (index) {
  return DEFAULT_COLORS[index % DEFAULT_COLORS.length];
};

module.exports = mongoose.model("Category", CategorySchema);
module.exports.DEFAULT_COLORS = DEFAULT_COLORS;
