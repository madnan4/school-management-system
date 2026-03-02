const express = require('express');
const router = express.Router();
const { registerUser, getAllUsers, updateUser, deleteUser } = require('../controllers/userController');
const { authenticate, authorize } = require('../middleware/auth');

router.post('/',     authenticate, authorize('admin'), registerUser);
router.get('/',      authenticate, authorize('admin'), getAllUsers);
router.patch('/:id', authenticate, authorize('admin'), updateUser);
router.delete('/:id', authenticate, authorize('admin'), deleteUser);

module.exports = router;