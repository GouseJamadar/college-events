const express = require('express');
const router = express.Router();
const {
  createEvent,
  getAllEvents,
  getEventsByMonth,
  getEventById,
  updateEvent,
  deleteEvent,
  registerForEvent,
  unregisterFromEvent,
  getMyEvents,
  getEventsGroupedByMonth
} = require('../controllers/eventController');
const { protect, admin, verified } = require('../middleware/auth');

router.get('/', getAllEvents);
router.get('/grouped/:year', getEventsGroupedByMonth);
router.get('/month/:year/:month', getEventsByMonth);
router.get('/my-events', protect, getMyEvents);
router.get('/:id', getEventById);

router.post('/', protect, admin, createEvent);
router.put('/:id', protect, admin, updateEvent);
router.delete('/:id', protect, admin, deleteEvent);

router.post('/:id/register', protect, verified, registerForEvent);
router.post('/:id/unregister', protect, verified, unregisterFromEvent);

module.exports = router;
