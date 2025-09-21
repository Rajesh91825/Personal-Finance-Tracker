const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authMiddleware");
const {
  getTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction
} = require("../controllers/transactionController");

router.get("/", authenticate, getTransactions);
router.post("/", authenticate, addTransaction);
router.put("/:id", authenticate, updateTransaction);
router.delete("/:id", authenticate, deleteTransaction);

module.exports = router;
