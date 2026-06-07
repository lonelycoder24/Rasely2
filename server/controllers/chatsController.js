const { db, admin } = require('../firebaseAdmin')();

async function listChats(req, res, next) {
  try {
    const chatsRef = db.collection('chats').limit(100);
    const snapshot = await chatsRef.get();
    const chats = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.json(chats);
  } catch (err) {
    next(err);
  }
}

async function getChat(req, res, next) {
  try {
    const id = req.params.id;
    const doc = await db.collection('chats').doc(id).get();
    if (!doc.exists) return res.status(404).json({ error: 'Chat not found' });

    // Fetch latest messages (limit 200)
    const messagesSnap = await db.collection('chats').doc(id).collection('messages').orderBy('createdAt', 'asc').limit(500).get();
    const messages = messagesSnap.docs.map(d => ({ id: d.id, ...d.data() }));

    res.json({ id: doc.id, ...doc.data(), messages });
  } catch (err) {
    next(err);
  }
}

async function createChat(req, res, next) {
  try {
    const { name, members = [] } = req.body;
    const ref = await db.collection('chats').add({
      name: name || 'New Chat',
      members,
      createdAt: new Date(),
    });
    const doc = await ref.get();
    res.status(201).json({ id: ref.id, ...doc.data() });
  } catch (err) {
    next(err);
  }
}

async function addMessage(req, res, next) {
  try {
    const chatId = req.params.id;
    const { text, senderId, senderName } = req.body;
    if (!text) return res.status(400).json({ error: 'Message text is required' });

    const messagesRef = db.collection('chats').doc(chatId).collection('messages');
    const newMsgRef = await messagesRef.add({
      text,
      senderId: senderId || null,
      senderName: senderName || null,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    const newDoc = await newMsgRef.get();
    res.status(201).json({ id: newMsgRef.id, ...newDoc.data() });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  listChats,
  getChat,
  createChat,
  addMessage,
};
