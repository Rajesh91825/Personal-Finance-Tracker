const express = require("express");
const router = express.Router();
const { exportCSV, exportPDF } = require("../controllers/exportController");
const { authenticateToken } = require("../middleware/authMiddleware");

router.get("/csv", authenticateToken, exportCSV);
router.get("/pdf", authenticateToken, exportPDF);

module.exports = router;
