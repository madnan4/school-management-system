const db = require('../models/db');

exports.addSchool = (req, res) => {
  const { school_name, director_name, email, contact_number, address } = req.body;

  const sql = `INSERT INTO schools (school_name, director_name, email, contact_number, address)
               VALUES (?, ?, ?, ?, ?)`;

  db.query(sql, [school_name, director_name, email, contact_number, address], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.status(201).json({ message: 'School added successfully', id: result.insertId });
  });
};