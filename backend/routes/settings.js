const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const settingsController = require("../controllers/settingsController");

// Get savings goal
router.get("/savings-goal", auth, settingsController.getSavingsGoal);
// Set savings goal
router.post("/savings-goal", auth, settingsController.setSavingsGoal);

module.exports = router; 