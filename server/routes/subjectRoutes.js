const express = require('express');
const router = express.Router();
const { createSubject, getSubjects, updateSubject, deleteSubject } = require('../controllers/subjectController');
const { authenticate, authorize } = require('../middleware/auth');

router.post('/',      authenticate, authorize('admin'), createSubject);
router.get('/',       authenticate, getSubjects);
router.patch('/:id',  authenticate, authorize('admin'), updateSubject);
router.delete('/:id', authenticate, authorize('admin'), deleteSubject);

module.exports = router;