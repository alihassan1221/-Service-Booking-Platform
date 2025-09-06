const Booking = require('../models/Booking');

// @desc    Get all bookings
// @route   GET /api/bookings
// @access  Private
exports.getBookings = async (req, res, next) => {
  try {
    let query;
    
    // Users can only see their own bookings
    if (req.user.role === 'user') {
      query = Booking.find({ user: req.user.id });
    } else {
      // Managers and admins can see all bookings
      query = Booking.find().populate({
        path: 'user',
        select: 'name email'
      });
    }

    const bookings = await query.sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
exports.getBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id).populate({
      path: 'user',
      select: 'name email'
    });

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Make sure user is booking owner or admin/manager
    if (booking.user._id.toString() !== req.user.id && req.user.role === 'user') {
      return res.status(401).json({ success: false, message: 'Not authorized to view this booking' });
    }

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
exports.createBooking = async (req, res, next) => {
  try {
    // Add user to req.body
    req.body.user = req.user.id;

    const booking = await Booking.create(req.body);

    res.status(201).json({
      success: true,
      data: booking
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Update booking
// @route   PUT /api/bookings/:id
// @access  Private
exports.updateBooking = async (req, res, next) => {
  try {
    let booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Make sure user is booking owner or manager/admin
    if (booking.user.toString() !== req.user.id && req.user.role === 'user') {
      return res.status(401).json({ success: false, message: 'Not authorized to update this booking' });
    }

    // Only managers and admins can update status
    if (req.body.status && req.user.role === 'user') {
      return res.status(401).json({ success: false, message: 'Not authorized to update booking status' });
    }

    booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Delete booking
// @route   DELETE /api/bookings/:id
// @access  Private
exports.deleteBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Make sure user is booking owner or admin
    if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Not authorized to delete this booking' });
    }

    await Booking.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};