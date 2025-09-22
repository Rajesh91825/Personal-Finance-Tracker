const pool = require("../config/db");

// Get all categories
const getCategories = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM categories ORDER BY name");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch categories ❌" });
  }
};

// Add a new category
const addCategory = async (req, res) => {
  const name = req.body.name;
  const type = req.body.type; // 'income' or 'expense'
  if (!name) return res.status(400).json({ error: "Category name required ❌" });
  try {
    await pool.query("INSERT INTO categories (name,type) VALUES ($1,$2)", [name,type]);
    res.status(201).json({ message: "Category added ✅" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add category ❌" });
  }
};

// Update a category
const updateCategory = async (req, res) => {
  const { id } = req.params;
  const name = req.body.name;
  const type = req.body.type; // 'income' or 'expense'
  if (!name) return res.status(400).json({ error: "Category name required ❌" });
  try {
    await pool.query("UPDATE categories SET name=$1, type=$2 WHERE id=$3", [name, type, id]);
    res.json({ message: "Category updated ✅" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update category ❌" });
  }
};

// Delete a category
const deleteCategory = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM categories WHERE id=$1", [id]);
    res.json({ message: "Category deleted ✅" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete category ❌" });
  }
};

module.exports = { getCategories, addCategory, updateCategory, deleteCategory };
