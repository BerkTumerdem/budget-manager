const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { exportExpensesCSV } = require("../controllers/exportController");

router.use(auth);
router.get("/expenses", exportExpensesCSV);

module.exports = router;