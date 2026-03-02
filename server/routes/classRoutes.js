const express = require('express');
const router = express.Router();
const { createClass, getClasses, updateClass, deleteClass } = require('../controllers/classController');
const { authenticate, authorize } = require('../middleware/auth');

router.post('/',      authenticate, authorize('admin'), createClass);
router.get('/',       authenticate, getClasses);
router.patch('/:id',  authenticate, authorize('admin'), updateClass);
router.delete('/:id', authenticate, authorize('admin'), deleteClass);

module.exports = router;