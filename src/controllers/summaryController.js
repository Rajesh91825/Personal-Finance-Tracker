const pool = require("../config/db");

// Get spending summary
const getSummary = async (req, res) => {
  const { period } = req.query; // 'weekly' or 'monthly'
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
    // Total spending
    const totalResult = await pool.query(
      "SELECT COALESCE(SUM(amount),0) AS total FROM transactions WHERE user_id=$1 AND transaction_date >= $2",
      [req.user.id, startDate]
    );

    // Spending per category
    const perCategoryResult = await pool.query(
      "SELECT c.name AS category, COALESCE(SUM(t.amount),0) AS total " +
      "FROM transactions t JOIN categories c ON t.category_id = c.id " +
      "WHERE t.user_id=$1 AND t.transaction_date >= $2 " +
      "GROUP BY c.name ORDER BY total DESC",
      [req.user.id, startDate]
    );

    res.json({
      total_spending: totalResult.rows[0].total,
      per_category: perCategoryResult.rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch summary ❌" });
  }
};

module.exports = { getSummary };
