const express = require('express');
const router = express.Router();
const { enrollStudent, getEnrollments, unenrollStudent } = require('../controllers/enrollmentController');
const { authenticate, authorize } = require('../middleware/auth');

router.post('/',      authenticate, authorize('admin'), enrollStudent);
router.get('/',       authenticate, getEnrollments);
router.delete('/:id', authenticate, authorize('admin'), unenrollStudent);

module.exports = router;