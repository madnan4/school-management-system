const express = require('express');
const router = express.Router();
const { recordGrade, getGrades } = require('../controllers/gradeController');
const { authenticate, authorize } = require('../middleware/auth');

router.post('/', authenticate, authorize('admin', 'teacher'), recordGrade);
router.get('/',  authenticate, getGrades);

module.exports = router;