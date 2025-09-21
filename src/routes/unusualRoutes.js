const express = require("express");
const router = express.Router();
const { getUnusualTransactions } = require("../controllers/unusualController");
const { authenticateToken } = require("../middleware/authMiddleware");

router.get("/", authenticateToken, getUnusualTransactions);

module.exports = router;
