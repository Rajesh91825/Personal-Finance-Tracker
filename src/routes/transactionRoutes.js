const express = require("express");
const router = express.Router();

// Import controllers
const transactionController = require("../controllers/transactionController");

// Import auth middleware
const { authenticateToken } = require("../middleware/authMiddleware");

// Routes
router.get("/", authenticateToken, transactionController.getTransactions);
router.get("/filtered", authenticateToken, transactionController.getFilteredTransactions);
router.post("/", authenticateToken, transactionController.addTransaction);
router.put("/:id", authenticateToken, transactionController.updateTransaction);
router.delete("/:id", authenticateToken, transactionController.deleteTransaction);

module.exports = router;
