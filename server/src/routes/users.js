const express = require('express');
const {
  getUsers,
  createManager,
  deleteUser
} = require('../controllers/users');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.use(authorize('admin'));

router.route('/')
  .get(getUsers);

router.route('/managers')
  .post(createManager);

router.route('/:id')
  .delete(deleteUser);

module.exports = router;