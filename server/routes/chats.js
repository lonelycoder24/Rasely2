const express = require('express');
const router = express.Router();
const {
  listChats,
  getChat,
  createChat,
  addMessage,
} = require('../controllers/chatsController');

// GET /api/chats - list chats
router.get('/', listChats);

// GET /api/chats/:id - get chat details
router.get('/:id', getChat);

// POST /api/chats - create chat
router.post('/', createChat);

// POST /api/chats/:id/messages - add message to chat
router.post('/:id/messages', addMessage);

module.exports = router;
