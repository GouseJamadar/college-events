const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  deleteUser,
  getDashboardStats,
  getEventRegistrations,
  verifyUserManually
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/auth');

router.use(protect, admin);

router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.delete('/users/:id', deleteUser);
router.patch('/users/:id/verify', verifyUserManually);

router.get('/dashboard', getDashboardStats);
router.get('/events/:eventId/registrations', getEventRegistrations);

module.exports = router;
