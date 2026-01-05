const db = require('../models/db');

exports.addSchool = (req, res) => {
  const { school_name, director_name, email, contact_number, address } = req.body;
  if (!school_name || !director_name || !email) {
    return res.status(400).json({ error: "school_name, director_name, and email are required" });
  }

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

//get all schools
exports.getAllSchools = (req, res) => {
  const query = "SELECT * FROM schools";

  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
};