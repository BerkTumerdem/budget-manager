const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {
    addExpense, getExpenses, updateExpense, deleteExpense
} = require("../controllers/expenseController");

router.use(auth);
router.post("/", addExpense);
router.get("/", getExpenses);
router.put("/:id", updateExpense);
router.delete("/:id", deleteExpense);

module.exports = router;