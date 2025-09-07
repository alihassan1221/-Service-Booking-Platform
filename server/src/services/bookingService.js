const Booking = require('../models/Booking');

// Get all bookings with optional user filter
const getAllBookings = async (userId = null) => {
  let query = Booking.find();
  
  if (userId) {
    query = query.where('user').equals(userId);
  }
  
  return await query.populate({
    path: 'user',
    select: 'name email'
  }).sort({ createdAt: -1 });
};

// Get single booking by ID
const getBookingById = async (id) => {
  return await Booking.findById(id).populate({
    path: 'user',
    select: 'name email'
  });
};

// Create new booking
const createBooking = async (bookingData) => {
  return await Booking.create(bookingData);
};

// Update booking by ID
const updateBookingById = async (id, updateData) => {
  return await Booking.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true
  });
};

// Delete booking by ID
const deleteBookingById = async (id) => {
  return await Booking.findByIdAndDelete(id);
};

// Check if user is booking owner
const isBookingOwner = (booking, userId) => {
  return booking.user._id.toString() === userId;
};

module.exports = {
  getAllBookings,
  getBookingById,
  createBooking,
  updateBookingById,
  deleteBookingById,
  isBookingOwner
};