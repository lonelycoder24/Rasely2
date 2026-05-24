const { db } = require('../index');

// GET /api/chats - list chats for the user (simple implementation)
exports.listChats = async (req, res) => {
  const uid = req.user.uid;
  try {
    const chatsRef = db.collection('chats');
    const snapshot = await chatsRef.where('members', 'array-contains', uid).get();
    const chats = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return res.json({ chats });
  } catch (error) {
    console.error('listChats error:', error);
    return res.status(500).json({ error: 'Failed to list chats' });
  }
};

// POST /api/chats - create chat
exports.createChat = async (req, res) => {
  const uid = req.user.uid;
  const { name, members } = req.body;
  if (!members || !Array.isArray(members) || members.length === 0) {
    return res.status(400).json({ error: 'members array required' });
  }

  const data = {
    name: name || 'New Chat',
    members: Array.from(new Set([...members, uid])),
    createdAt: new Date(),
  };

  try {
    const docRef = await db.collection('chats').add(data);
    return res.status(201).json({ id: docRef.id, ...data });
  } catch (error) {
    console.error('createChat error:', error);
    return res.status(500).json({ error: 'Failed to create chat' });
  }
};

// GET /api/chats/:chatId/messages - list messages
exports.listMessages = async (req, res) => {
  const { chatId } = req.params;
  try {
    const msgsRef = db.collection('chats').doc(chatId).collection('messages').orderBy('createdAt', 'asc');
    const snapshot = await msgsRef.get();
    const messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return res.json({ messages });
  } catch (error) {
    console.error('listMessages error:', error);
    return res.status(500).json({ error: 'Failed to list messages' });
  }
};

// POST /api/chats/:chatId/messages - send message
exports.sendMessage = async (req, res) => {
  const { chatId } = req.params;
  const uid = req.user.uid;
  const { text } = req.body;
  if (!text || !text.trim()) return res.status(400).json({ error: 'text required' });

  const msg = {
    text: text.trim(),
    senderId: uid,
    createdAt: new Date(),
  };

  try {
    const msgRef = await db.collection('chats').doc(chatId).collection('messages').add(msg);
    return res.status(201).json({ id: msgRef.id, ...msg });
  } catch (error) {
    console.error('sendMessage error:', error);
    return res.status(500).json({ error: 'Failed to send message' });
  }
};
