const db = require('../models/db');

exports.enrollStudent = (req, res) => {
  const { student_id, class_id } = req.body;

  if (!student_id || !class_id) {
    return res.status(400).json({ error: 'student_id and class_id are required.' });
  }

  db.query(
    'INSERT INTO student_classes (student_id, class_id) VALUES (?, ?)',
    [student_id, class_id],
    (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(409).json({ error: 'Student is already enrolled in this class.' });
        }
        return res.status(500).json({ error: 'Database error.' });
      }
      res.status(201).json({ message: 'Student enrolled successfully.', id: result.insertId });
    }
  );
};

exports.getEnrollments = (req, res) => {
  const { class_id } = req.query;

  let sql = `
    SELECT sc.id, sc.student_id, u.name AS student_name, sc.class_id, c.class_name, sc.enrolled_at
    FROM student_classes sc
    JOIN users   u ON sc.student_id = u.id
    JOIN classes c ON sc.class_id   = c.id
    WHERE c.school_id = ?
  `;
  const params = [req.user.school_id];

  if (class_id) { sql += ' AND sc.class_id = ?'; params.push(class_id); }

  sql += ' ORDER BY c.class_name, u.name';

  db.query(sql, params, (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error.' });
    res.json(results);
  });
};

exports.unenrollStudent = (req, res) => {
  db.query(
    'DELETE FROM student_classes WHERE id = ?',
    [req.params.id],
    (err, result) => {
      if (err) return res.status(500).json({ error: 'Database error.' });
      if (result.affectedRows === 0) return res.status(404).json({ error: 'Enrollment not found.' });
      res.json({ message: 'Student unenrolled successfully.' });
    }
  );
};