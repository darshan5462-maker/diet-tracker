const express = require('express');
const router = express.Router();
const { getStats, getUsers, updateUser, deleteUser, getUserGrowth } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect, authorize('admin'));
router.get('/stats', getStats);
router.get('/users', getUsers);
router.get('/user-growth', getUserGrowth);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

module.exports = router;
