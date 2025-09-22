const pool = require("../config/db");

// Get all transactions of a user (with category type)
const getTransactions = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT t.id, t.description, t.amount, t.transaction_date,
              c.id as category_id, c.name as category, c.type as category_type
       FROM transactions t
       JOIN categories c ON t.category_id = c.id
       WHERE t.user_id = $1
       ORDER BY t.transaction_date DESC`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch transactions ❌" });
  }
};

// Get filtered transactions for a user
const getFilteredTransactions = async (req, res) => {
  const { startDate, endDate, category_id, minAmount, maxAmount } = req.query;

  try {
    let query = `
      SELECT t.id, t.amount, t.description, t.transaction_date,
            c.id as category_id, c.name as category, c.type as category_type
      FROM transactions t
      JOIN categories c ON t.category_id = c.id
      WHERE t.user_id = $1
    `;

    let values = [req.user.id];
    let idx = 2;

    if (startDate) {
      query += ` AND t.transaction_date >= $${idx}`;
      values.push(startDate);
      idx++;
    }
    if (endDate) {
      query += ` AND t.transaction_date <= $${idx}`;
      values.push(endDate);
      idx++;
    }
    if (category_id) {
      query += ` AND t.category_id = $${idx}`;
      values.push(category_id);
      idx++;
    }
    if (minAmount) {
      query += ` AND t.amount >= $${idx}`;
      values.push(minAmount);
      idx++;
    }
    if (maxAmount) {
      query += ` AND t.amount <= $${idx}`;
      values.push(maxAmount);
      idx++;
    }

    query += " ORDER BY t.transaction_date DESC";

    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch filtered transactions ❌" });
  }
};

// Add a transaction
const addTransaction = async (req, res) => {
  const { amount, description, transaction_date, category_id } = req.body;
  try {
    await pool.query(
      "INSERT INTO transactions (user_id, category_id, amount, description, transaction_date) VALUES ($1, $2, $3, $4, $5)",
      [req.user.id, category_id, amount, description, transaction_date]
    );
    res.status(201).json({ message: "Transaction added ✅" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add transaction ❌" });
  }
};

// Update a transaction
const updateTransaction = async (req, res) => {
  const { id } = req.params;
  const { amount, description, transaction_date, category_id } = req.body;

  try {
    const current = await pool.query("SELECT * FROM transactions WHERE id=$1 AND user_id=$2", [id, req.user.id]);
    if (current.rows.length === 0) return res.status(404).json({ error: "Transaction not found" });

    const updated = {
      amount: amount ?? current.rows[0].amount,
      description: description ?? current.rows[0].description,
      transaction_date: transaction_date ?? current.rows[0].transaction_date,
      category_id: category_id ?? current.rows[0].category_id
    };

    await pool.query(
      "UPDATE transactions SET category_id=$1, amount=$2, description=$3, transaction_date=$4 WHERE id=$5 AND user_id=$6",
      [updated.category_id, updated.amount, updated.description, updated.transaction_date, id, req.user.id]
    );

    res.json({ message: "Transaction updated ✅", transaction: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update transaction ❌" });
  }
};

// Delete a transaction
const deleteTransaction = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM transactions WHERE id=$1 AND user_id=$2", [id, req.user.id]);
    res.json({ message: "Transaction deleted ✅" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete transaction ❌" });
  }
};

module.exports = { getTransactions, getFilteredTransactions, addTransaction, updateTransaction, deleteTransaction };

