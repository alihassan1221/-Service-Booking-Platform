const User = require('../models/User');

// Get all users
const getAllUsers = async () => {
  return await User.find().select('-password').sort({ createdAt: -1 });
};

// Get user by ID
const getUserById = async (id) => {
  return await User.findById(id);
};

// Create user
const createUser = async (userData) => {
  return await User.create(userData);
};

// Update user by ID
const updateUserById = async (id, updateData) => {
  return await User.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true
  });
};

// Delete user by ID
const deleteUserById = async (id) => {
  return await User.findByIdAndDelete(id);
};

// Check if email exists (excluding current user)
const checkEmailExists = async (email, excludeUserId = null) => {
  const query = { email };
  if (excludeUserId) {
    query._id = { $ne: excludeUserId };
  }
  return await User.findOne(query);
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUserById,
  deleteUserById,
  checkEmailExists
};