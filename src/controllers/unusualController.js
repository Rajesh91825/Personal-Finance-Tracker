// backend/controllers/unusualController.js
const pool = require("../config/db");

// Get unusual transactions
const getUnusualTransactions = async (req, res) => {
  const { period, multiplier } = req.query; // e.g., period=monthly, multiplier=2
  const factor = parseFloat(multiplier) || 2; // default 2x

  let startDate;
  const today = new Date();

  if (period === "weekly") {
    startDate = new Date();
    startDate.setDate(today.getDate() - 7);
  } else if (period === "monthly") {
    startDate = new Date();
    startDate.setMonth(today.getMonth() - 1);
  } else {
    return res.status(400).json({ error: "Invalid period. Use 'weekly' or 'monthly' ❌" });
  }

  try {
    // Get average expense amount
    const avgResult = await pool.query(
      `SELECT AVG(t.amount) AS avg_amount
       FROM transactions t
       JOIN categories c ON t.category_id = c.id
       WHERE t.user_id=$1
         AND t.transaction_date >= $2
         AND c.type = 'expense'`,
      [req.user.id, startDate]
    );

    const avgAmount = parseFloat(avgResult.rows[0].avg_amount || 0);
    const threshold = avgAmount * factor;

    // Get unusual expenses (only expense categories)
    const result = await pool.query(
      `SELECT t.id, t.amount, t.description, t.transaction_date, c.name AS category
       FROM transactions t
       JOIN categories c ON t.category_id = c.id
       WHERE t.user_id=$1
         AND t.transaction_date >= $2
         AND c.type = 'expense'
         AND t.amount > $3
       ORDER BY t.amount DESC`,
      [req.user.id, startDate, threshold]
    );

    res.json({
      threshold,
      unusual_transactions: result.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch unusual transactions ❌" });
  }
};

module.exports = { getUnusualTransactions };
