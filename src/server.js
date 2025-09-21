const express = require("express");
const cors = require("cors");
require("dotenv").config();
const authRoutes = require("./routes/auth");
const pool = require("./config/db");
const transactionRoutes = require("./routes/transactionRoutes");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Personal Finance Tracker API running ✅");
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

app.get("/db-test", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ message: "✅ DB connected!", time: result.rows[0].now });
  } catch (err) {
    console.error("❌ DB connection error:", err);
    res.status(500).json({ error: "DB connection failed" });
  }
});

app.use("/auth", authRoutes);
app.use("/transactions", transactionRoutes);
