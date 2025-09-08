const express = require('express');
const {
  getUsers,
  createManager,
  deleteUser,
  updateUser,
} = require('../controllers/users');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(authorize('admin', 'manager'), getUsers);

router.route('/managers')
  .post(authorize('admin'), createManager);

router.route('/:id')
  .delete(authorize('admin'), deleteUser)
  .put(authorize('admin', 'manager'), updateUser);

module.exports = router;