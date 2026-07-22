const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { getReport } = require("../controllers/reportController");

router.use(auth);
router.get("/", getReport);

module.exports = router;