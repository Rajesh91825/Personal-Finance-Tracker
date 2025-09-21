const express = require("express");
const router = express.Router();
const { getSummary } = require("../controllers/summaryController");
const { authenticateToken } = require("../middleware/authMiddleware");

router.get("/", authenticateToken, getSummary);

module.exports = router;
