const express = require('express');
const router = express.Router();
const {
  listUsers,
  getUser,
  createUser,
  updateUser,
} = require('../controllers/usersController');

// GET /api/users - list users
router.get('/', listUsers);

// GET /api/users/:id - get user profile
router.get('/:id', getUser);

// POST /api/users - create user (used by server-side flows if needed)
router.post('/', createUser);

// PATCH /api/users/:id - update user
router.patch('/:id', updateUser);

module.exports = router;
