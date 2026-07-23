/** Build a Mongo filter for the current user's expenses from query params. */
function buildExpenseQuery(userId, { start, end } = {}) {
  const filter = { userId };

  if (start || end) {
    filter.date = {};
    if (start) filter.date.$gte = new Date(start);
    if (end) {
      const endDate = new Date(end);
      endDate.setHours(23, 59, 59, 999);
      filter.date.$lte = endDate;
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

module.exports = { buildExpenseQuery, filterByCategoryName };
