const express = require('express');
const {
  getBookings,
  getBooking,
  createBooking,
  updateBooking,
  deleteBooking
} = require('../controllers/bookings');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(authorize('user', 'manager', 'admin'), getBookings)
  .post(authorize('user'), createBooking);

router.route('/:id')
  .get(authorize('user', 'manager', 'admin'), getBooking)
  .put(authorize('user', 'manager', 'admin'), updateBooking)
  .delete(authorize('user', 'admin'), deleteBooking);

module.exports = router;