const db = require('../models/db');

exports.createClass = (req, res) => {
  const { class_name } = req.body;
  const school_id = req.user.school_id;

  if (!class_name) {
    return res.status(400).json({ error: 'class_name is required.' });
  }

  db.query(
    'INSERT INTO classes (class_name, school_id) VALUES (?, ?)',
    [class_name, school_id],
    (err, result) => {
      if (err) return res.status(500).json({ error: 'Database error.' });
      res.status(201).json({ message: 'Class created successfully.', id: result.insertId });
    }
  );
};

exports.getClasses = (req, res) => {
  db.query(
    'SELECT * FROM classes WHERE school_id = ?',
    [req.user.school_id],
    (err, results) => {
      if (err) return res.status(500).json({ error: 'Database error.' });
      res.json(results);
    }
  );
};

exports.updateClass = (req, res) => {
  const { class_name } = req.body;

  if (!class_name) {
    return res.status(400).json({ error: 'class_name is required.' });
  }

  db.query(
    'UPDATE classes SET class_name = ? WHERE id = ? AND school_id = ?',
    [class_name, req.params.id, req.user.school_id],
    (err, result) => {
      if (err) return res.status(500).json({ error: 'Database error.' });
      if (result.affectedRows === 0) return res.status(404).json({ error: 'Class not found.' });
      res.json({ message: 'Class updated successfully.' });
    }
  );
};

exports.deleteClass = (req, res) => {
  db.query(
    'DELETE FROM classes WHERE id = ? AND school_id = ?',
    [req.params.id, req.user.school_id],
    (err, result) => {
      if (err) return res.status(500).json({ error: 'Database error.' });
      if (result.affectedRows === 0) return res.status(404).json({ error: 'Class not found.' });
      res.json({ message: 'Class deleted successfully.' });
    }
  );
};