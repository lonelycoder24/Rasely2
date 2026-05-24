const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');

// GET /api/chats - list chats (optionally by userId)
router.get('/', async (req, res, next) => {
  try {
    const userId = req.query.userId;
    const db = admin.firestore();
    let q = db.collection('chats');
    if (userId) q = q.where('participants', 'array-contains', userId);
    const snapshot = await q.get();
    const chats = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    res.json(chats);
  } catch (err) {
    next(err);
  }
});

// POST /api/chats - create a new chat
router.post('/', async (req, res, next) => {
  try {
    const { name, participants = [] } = req.body;
    const db = admin.firestore();
    const chatRef = await db.collection('chats').add({
      name: name || null,
      participants,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    const chatDoc = await chatRef.get();
    res.status(201).json({ id: chatDoc.id, ...chatDoc.data() });
  } catch (err) {
    next(err);
  }
});

// GET /api/chats/:id/messages - list messages in a chat
router.get('/:id/messages', async (req, res, next) => {
  try {
    const chatId = req.params.id;
    const limit = parseInt(req.query.limit || '100', 10);
    const db = admin.firestore();
    const snapshot = await db.collection('chats').doc(chatId).collection('messages').orderBy('createdAt', 'asc').limit(limit).get();
    const messages = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    res.json(messages);
  } catch (err) {
    next(err);
  }
});

// POST /api/chats/:id/messages - add a message
router.post('/:id/messages', async (req, res, next) => {
  try {
    const chatId = req.params.id;
    const { senderId, senderName, text } = req.body;
    const db = admin.firestore();
    const msgRef = await db.collection('chats').doc(chatId).collection('messages').add({
      senderId,
      senderName,
      text,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    const msgDoc = await msgRef.get();
    res.status(201).json({ id: msgDoc.id, ...msgDoc.data() });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
