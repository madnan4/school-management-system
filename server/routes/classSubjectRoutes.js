const express = require('express');
const router = express.Router();
const { assignTeacher, getClassSubjects, updateAssignment, removeAssignment } = require('../controllers/classSubjectController');
const { authenticate, authorize } = require('../middleware/auth');

router.post('/',      authenticate, authorize('admin'), assignTeacher);
router.get('/',       authenticate, getClassSubjects);
router.patch('/:id',  authenticate, authorize('admin'), updateAssignment);
router.delete('/:id', authenticate, authorize('admin'), removeAssignment);

module.exports = router;