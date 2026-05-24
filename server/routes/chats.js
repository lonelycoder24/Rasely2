const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

// List chats for authenticated user
router.get('/', chatController.listChats);

// Create chat
router.post('/', chatController.createChat);

// Messages
router.get('/:chatId/messages', chatController.listMessages);
router.post('/:chatId/messages', chatController.sendMessage);

module.exports = router;
