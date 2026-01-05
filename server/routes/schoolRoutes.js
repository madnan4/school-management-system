const express = require('express');
const router = express.Router();
const { addSchool, getAllSchools } = require('../controllers/schoolController');

router.post('/', addSchool);
router.get('/', getAllSchools);

module.exports = router;