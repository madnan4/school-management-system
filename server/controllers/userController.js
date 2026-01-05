const db = require('../models/db');

exports.registerUser = (req, res) => {
  const { name, email, password, role, school_id } = req.body;

  const sql = `INSERT INTO users (name, email, password, role, school_id)
               VALUES (?, ?, ?, ?, ?)`;

  db.query(sql, [name, email, password, role, school_id], (err, result) => {
    if (err) {
      console.error('Error registering user:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.status(201).json({ message: 'User registered successfully', id: result.insertId });
  });
};