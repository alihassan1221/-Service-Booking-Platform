const userService = require('../services/userService');

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
exports.getUsers = async (req, res, next) => {
  try {
    const users = await userService.getAllUsers();

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Create manager user (admin only)
// @route   POST /api/users/managers
// @access  Private/Admin
exports.createManager = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await userService.checkEmailExists(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    const user = await userService.createUser({
      name,
      email,
      password,
      role: 'manager'
    });

    // Remove password from response
    const userResponse = await userService.getUserById(user._id);

    res.status(201).json({
      success: true,
      data: userResponse
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Prevent deleting admin accounts
    if (user.role === 'admin') {
      return res.status(400).json({ success: false, message: 'Cannot delete admin users' });
    }

    await userService.deleteUserById(req.params.id);

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
exports.updateUser = async (req, res, next) => {
  try {
    const { name, email, role } = req.body;
    const userId = req.params.id;

    // Check if user exists
    const user = await userService.getUserById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Check if email is already taken by another user
    if (email && email !== user.email) {
      const existingUser = await userService.checkEmailExists(email, userId);
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Email already taken by another user'
        });
      }
    }

    // Update user
    const updatedUser = await userService.updateUserById(userId, {
      name: name || user.name,
      email: email || user.email,
      role: role || user.role
    });

    // Remove password from response
    const userResponse = await userService.getUserById(updatedUser._id);

    res.status(200).json({
      success: true,
      data: userResponse
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};