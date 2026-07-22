const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { generatePDFReport } = require("../controllers/pdfController");

router.use(auth);
router.get("/report", generatePDFReport);

module.exports = router;