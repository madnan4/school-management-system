const db = require('../models/db');

exports.recordGrade = (req, res) => {
  const { student_id, subject_id, class_id, grade, term } = req.body;
  const recorded_by = req.user.id;

  if (!student_id || !subject_id || !class_id || grade === undefined || !term) {
    return res.status(400).json({ error: 'student_id, subject_id, class_id, grade, and term are required.' });
  }

  // Upsert — re-recording overwrites the grade for that term
  const sql = `
    INSERT INTO grades (student_id, subject_id, class_id, grade, term, recorded_by)
    VALUES (?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE grade = VALUES(grade), recorded_by = VALUES(recorded_by)
  `;

  db.query(sql, [student_id, subject_id, class_id, grade, term, recorded_by], (err) => {
    if (err) return res.status(500).json({ error: 'Database error.' });
    res.status(201).json({ message: 'Grade recorded successfully.' });
  });
};

exports.getGrades = (req, res) => {
  const { class_id, term } = req.query;
  let { student_id } = req.query;

  // Students can only view their own grades
  if (req.user.role === 'student') student_id = req.user.id;

  let sql = `
    SELECT g.id, u.name AS student_name, s.subject_name, c.class_name, g.grade, g.term, r.name AS recorded_by
    FROM grades g
    JOIN users    u ON g.student_id  = u.id
    JOIN subjects s ON g.subject_id  = s.id
    JOIN classes  c ON g.class_id    = c.id
    JOIN users    r ON g.recorded_by = r.id
    WHERE c.school_id = ?
  `;
  const params = [req.user.school_id];

  if (student_id) { sql += ' AND g.student_id = ?'; params.push(student_id); }
  if (class_id)   { sql += ' AND g.class_id = ?';   params.push(class_id); }
  if (term)       { sql += ' AND g.term = ?';        params.push(term); }

  sql += ' ORDER BY u.name, s.subject_name';

  db.query(sql, params, (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error.' });
    res.json(results);
  });
};