const express = require('express');
const router = express.Router();
const { addSchool, getAllSchools, updateSchool } = require('../controllers/schoolController');
const { authenticate, authorize } = require('../middleware/auth');

router.post('/',      authenticate, authorize('admin'), addSchool);
router.get('/',       authenticate, getAllSchools);
router.patch('/:id',  authenticate, authorize('admin'), updateSchool);

module.exports = router;