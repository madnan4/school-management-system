const db = require('../models/db');

exports.recordAttendance = (req, res) => {
  const { student_id, class_id, date, status } = req.body;
  const recorded_by = req.user.id;

  if (!student_id || !class_id || !date || !status) {
    return res.status(400).json({ error: 'student_id, class_id, date, and status are required.' });
  }

  const validStatuses = ['present', 'absent', 'late'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'status must be present, absent, or late.' });
  }

  // Upsert — re-recording overwrites the previous entry for that day
  const sql = `
    INSERT INTO attendance (student_id, class_id, date, status, recorded_by)
    VALUES (?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE status = VALUES(status), recorded_by = VALUES(recorded_by)
  `;

  db.query(sql, [student_id, class_id, date, status, recorded_by], (err) => {
    if (err) return res.status(500).json({ error: 'Database error.' });
    res.status(201).json({ message: 'Attendance recorded successfully.' });
  });
};

exports.getAttendance = (req, res) => {
  const { class_id, date } = req.query;
  let { student_id } = req.query;

  // Students can only view their own attendance
  if (req.user.role === 'student') student_id = req.user.id;

  let sql = `
    SELECT a.id, u.name AS student_name, c.class_name, a.date, a.status, r.name AS recorded_by
    FROM attendance a
    JOIN users   u ON a.student_id  = u.id
    JOIN classes c ON a.class_id    = c.id
    JOIN users   r ON a.recorded_by = r.id
    WHERE c.school_id = ?
  `;
  const params = [req.user.school_id];

  if (class_id)   { sql += ' AND a.class_id = ?';   params.push(class_id); }
  if (student_id) { sql += ' AND a.student_id = ?'; params.push(student_id); }
  if (date)       { sql += ' AND a.date = ?';        params.push(date); }

  sql += ' ORDER BY a.date DESC, u.name';

  db.query(sql, params, (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error.' });
    res.json(results);
  });
};