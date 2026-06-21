const express = require('express');
const router = express.Router();
const { getAllUsers, updateUserStatus, deleteUser } = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', protect, admin, getAllUsers);
router.put('/:id', protect, admin, updateUserStatus);
router.delete('/:id', protect, admin, deleteUser);

module.exports = router;
