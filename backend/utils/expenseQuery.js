const mongoose = require("mongoose");

/** Build a Mongo filter for the current user's expenses from query params. */
function buildExpenseQuery(userId, { start, end } = {}) {
  const filter = { userId };

  if (start || end) {
    filter.date = {};
    if (start) {
      const startDate = new Date(start);
      if (!Number.isNaN(startDate.getTime())) filter.date.$gte = startDate;
    }
    if (end) {
      const endDate = new Date(end);
      if (!Number.isNaN(endDate.getTime())) {
        endDate.setHours(23, 59, 59, 999);
        filter.date.$lte = endDate;
      }
    }
  }

  return filter;
}

/** After populate, optionally keep only a category name. */
function filterByCategoryName(expenses, categoryName) {
  if (!categoryName) return expenses;
  const target = String(categoryName).toLowerCase();
  return expenses.filter(
    (exp) => (exp.category?.name || "Uncategorized").toLowerCase() === target
  );
}

function normalizeType(type) {
  return String(type || "").toLowerCase() === "income" ? "income" : "expense";
}

function normalizeAmount(amount) {
  const n = Math.abs(Number(amount));
  return Number.isFinite(n) ? n : 0;
}

/** Shared totals so report / PDF / CSV stay aligned. */
function summarizeExpenses(expenses) {
  const categorySummary = {};
  let totalBalance = 0;
  let income = 0;
  let expensesTotal = 0;

  expenses.forEach((exp) => {
    const cat = exp.category?.name || "Uncategorized";
    const amount = normalizeAmount(exp.amount);
    const type = normalizeType(exp.type);

    if (type === "income") {
      income += amount;
      totalBalance += amount;
      categorySummary[cat] = (categorySummary[cat] || 0) + amount;
    } else {
      expensesTotal += amount;
      totalBalance -= amount;
      categorySummary[cat] = (categorySummary[cat] || 0) - amount;
    }
  });

  return { totalBalance, income, expenses: expensesTotal, categorySummary };
}

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

function isValidHexColor(color) {
  return typeof color === "string" && /^#[0-9A-Fa-f]{6}$/.test(color);
}

module.exports = {
  buildExpenseQuery,
  filterByCategoryName,
  normalizeType,
  normalizeAmount,
  summarizeExpenses,
  isValidObjectId,
  isValidHexColor,
};
