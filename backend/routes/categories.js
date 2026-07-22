const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {
    addCategory, getCategories, updateCategory, deleteCategory
} = require("../controllers/categoryController");

router.use(auth);
router.post("/", addCategory);
router.get("/", getCategories);
router.put("/:id", updateCategory);
router.delete("/:id", deleteCategory);

module.exports = router;