const bcrypt = require("bcrypt");
const db = require('../models/db');

exports.registerUser = async(req, res) => {
  const { name, email, password, role, school_id } = req.body;
  if (!name || !email || !password || !role || !school_id) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const sql = `INSERT INTO users (name, email, password, role, school_id)
               VALUES (?, ?, ?, ?, ?)`;

  db.query(sql, [name, email, hashedPassword, role, school_id], (err, result) => {
    if (err) {
      console.error('Error registering user:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.status(201).json({ message: 'User registered successfully', id: result.insertId });
  });
};

exports.getAllUsers = (req, res) => {
  const query = "SELECT id, name, email, role, school_id FROM users";

  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
};

exports.updateUser = (req, res) => {
  const { name, role, school_id } = req.body;
  const { id } = req.params;

  const fields = {};
  if (name)      fields.name      = name;
  if (role)      fields.role      = role;
  if (school_id) fields.school_id = school_id;

  if (Object.keys(fields).length === 0) {
    return res.status(400).json({ error: 'No valid fields provided to update.' });
  }

  const sql = 'UPDATE users SET ? WHERE id = ?';
  db.query(sql, [fields, id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Database error.' });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'User not found.' });
    res.json({ message: 'User updated successfully.' });
  });
};

exports.deleteUser = (req, res) => {
  const { id } = req.params;

  if (parseInt(id) === req.user.id) {
    return res.status(400).json({ error: 'You cannot delete your own account.' });
  }

  db.query('DELETE FROM users WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Database error.' });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'User not found.' });
    res.json({ message: 'User deleted successfully.' });
  });
};