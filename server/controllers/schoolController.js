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

exports.updateSchool = (req, res) => {
  const { school_name, director_name, email, contact_number, address } = req.body;

  const fields = {};
  if (school_name)    fields.school_name    = school_name;
  if (director_name)  fields.director_name  = director_name;
  if (email)          fields.email          = email;
  if (contact_number) fields.contact_number = contact_number;
  if (address)        fields.address        = address;

  if (Object.keys(fields).length === 0) {
    return res.status(400).json({ error: 'No valid fields provided to update.' });
  }

  db.query('UPDATE schools SET ? WHERE id = ?', [fields, req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Database error.' });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'School not found.' });
    res.json({ message: 'School updated successfully.' });
  });
};