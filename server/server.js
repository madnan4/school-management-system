require("dotenv").config();

const express = require('express');
const cors = require('cors');
const initDB = require('./models/initDB');
const app = express();
const port = 3600;

initDB();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => res.json({ status: "ok" }));


const authRoutes         = require('./routes/authRoutes');
const schoolRoutes       = require('./routes/schoolRoutes');
const userRoutes         = require('./routes/userRoutes');
const classRoutes        = require('./routes/classRoutes');
const subjectRoutes      = require('./routes/subjectRoutes');
const classSubjectRoutes = require('./routes/classSubjectRoutes');
const enrollmentRoutes   = require('./routes/enrollmentRoutes');
const attendanceRoutes   = require('./routes/attendanceRoutes');
const gradeRoutes        = require('./routes/gradeRoutes');

app.use('/api/auth',          authRoutes);
app.use('/api/schools',       schoolRoutes);
app.use('/api/users',         userRoutes);
app.use('/api/classes',       classRoutes);
app.use('/api/subjects',      subjectRoutes);
app.use('/api/class-subjects', classSubjectRoutes);
app.use('/api/enrollments',   enrollmentRoutes);
app.use('/api/attendance',    attendanceRoutes);
app.use('/api/grades',        gradeRoutes);


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});