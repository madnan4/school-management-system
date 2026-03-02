const db = require('../models/db');

exports.createSubject = (req, res) => {
  const { subject_name } = req.body;
  const school_id = req.user.school_id;

  if (!subject_name) {
    return res.status(400).json({ error: 'subject_name is required.' });
  }

  db.query(
    'INSERT INTO subjects (subject_name, school_id) VALUES (?, ?)',
    [subject_name, school_id],
    (err, result) => {
      if (err) return res.status(500).json({ error: 'Database error.' });
      res.status(201).json({ message: 'Subject created successfully.', id: result.insertId });
    }
  );
};

exports.getSubjects = (req, res) => {
  db.query(
    'SELECT * FROM subjects WHERE school_id = ?',
    [req.user.school_id],
    (err, results) => {
      if (err) return res.status(500).json({ error: 'Database error.' });
      res.json(results);
    }
  );
};

exports.updateSubject = (req, res) => {
  const { subject_name } = req.body;

  if (!subject_name) {
    return res.status(400).json({ error: 'subject_name is required.' });
  }

  db.query(
    'UPDATE subjects SET subject_name = ? WHERE id = ? AND school_id = ?',
    [subject_name, req.params.id, req.user.school_id],
    (err, result) => {
      if (err) return res.status(500).json({ error: 'Database error.' });
      if (result.affectedRows === 0) return res.status(404).json({ error: 'Subject not found.' });
      res.json({ message: 'Subject updated successfully.' });
    }
  );
};

exports.deleteSubject = (req, res) => {
  db.query(
    'DELETE FROM subjects WHERE id = ? AND school_id = ?',
    [req.params.id, req.user.school_id],
    (err, result) => {
      if (err) return res.status(500).json({ error: 'Database error.' });
      if (result.affectedRows === 0) return res.status(404).json({ error: 'Subject not found.' });
      res.json({ message: 'Subject deleted successfully.' });
    }
  );
};