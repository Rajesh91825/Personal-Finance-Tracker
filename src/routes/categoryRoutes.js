const express = require("express");
const router = express.Router();
const {
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory
} = require("../controllers/categoryController");
const { authenticateToken } = require("../middleware/authMiddleware");

router.get("/", authenticateToken, getCategories);
router.post("/", authenticateToken, addCategory);
router.put("/:id", authenticateToken, updateCategory);
router.delete("/:id", authenticateToken, deleteCategory);

module.exports = router;
