const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  vehicleType: {
    type: String,
    required: [true, 'Please select a vehicle type'],
    enum: ['car', 'motorcycle', 'truck', 'suv']
  },
  issueDescription: {
    type: String,
    required: [true, 'Please describe the issue'],
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  preferredDate: {
    type: Date,
    required: [true, 'Please select a preferred date']
  },
  location: {
    type: String,
    required: [true, 'Please add a location'],
    maxlength: [100, 'Location cannot be more than 100 characters']
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'completed'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Booking', bookingSchema);