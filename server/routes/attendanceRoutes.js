const express = require('express');
const router = express.Router();
const { recordAttendance, getAttendance } = require('../controllers/attendanceController');
const { authenticate, authorize } = require('../middleware/auth');

router.post('/', authenticate, authorize('admin', 'teacher'), recordAttendance);
router.get('/',  authenticate, getAttendance);

module.exports = router;