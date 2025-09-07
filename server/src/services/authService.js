const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// Send token response
const sendTokenResponse = (user, statusCode, res) => {
  const token = generateToken(user);
  
  res.status(statusCode).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt
    }
  });
};

// Check if user exists by email
const checkUserExists = async (email) => {
  return await User.findOne({ email });
};

// Create new user
const createUser = async (userData) => {
  return await User.create(userData);
};

// Find user by email with password
const findUserByEmailWithPassword = async (email) => {
  return await User.findOne({ email }).select('+password');
};

// Find user by ID
const findUserById = async (id) => {
  return await User.findById(id);
};

// Verify password
const verifyPassword = async (user, password) => {
  return await user.matchPassword(password);
};

module.exports = {
  generateToken,
  sendTokenResponse,
  checkUserExists,
  createUser,
  findUserByEmailWithPassword,
  findUserById,
  verifyPassword
};