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
}