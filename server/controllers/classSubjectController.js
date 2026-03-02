const db = require('../models/db');

exports.assignTeacher = (req, res) => {
  const { class_id, subject_id, teacher_id } = req.body;

  if (!class_id || !subject_id || !teacher_id) {
    return res.status(400).json({ error: 'class_id, subject_id, and teacher_id are required.' });
  }

  db.query(
    'INSERT INTO class_subjects (class_id, subject_id, teacher_id) VALUES (?, ?, ?)',
    [class_id, subject_id, teacher_id],
    (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(409).json({ error: 'A teacher is already assigned to this subject in this class.' });
        }
        return res.status(500).json({ error: 'Database error.' });
      }
      res.status(201).json({ message: 'Teacher assigned successfully.', id: result.insertId });
    }
  );
};

exports.getClassSubjects = (req, res) => {
  const sql = `
    SELECT cs.id, cs.class_id, cs.subject_id, c.class_name, s.subject_name, u.name AS teacher_name
    FROM class_subjects cs
    JOIN classes  c ON cs.class_id   = c.id
    JOIN subjects s ON cs.subject_id = s.id
    JOIN users    u ON cs.teacher_id = u.id
    WHERE c.school_id = ?
    ORDER BY c.class_name, s.subject_name
  `;

  db.query(sql, [req.user.school_id], (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error.' });
    res.json(results);
  });
};

exports.updateAssignment = (req, res) => {
  const { teacher_id } = req.body;

  if (!teacher_id) {
    return res.status(400).json({ error: 'teacher_id is required.' });
  }

  db.query(
    'UPDATE class_subjects SET teacher_id = ? WHERE id = ?',
    [teacher_id, req.params.id],
    (err, result) => {
      if (err) return res.status(500).json({ error: 'Database error.' });
      if (result.affectedRows === 0) return res.status(404).json({ error: 'Assignment not found.' });
      res.json({ message: 'Assignment updated successfully.' });
    }
  );
};

exports.removeAssignment = (req, res) => {
  db.query(
    'DELETE FROM class_subjects WHERE id = ?',
    [req.params.id],
    (err, result) => {
      if (err) return res.status(500).json({ error: 'Database error.' });
      if (result.affectedRows === 0) return res.status(404).json({ error: 'Assignment not found.' });
      res.json({ message: 'Assignment removed successfully.' });
    }
  );
};