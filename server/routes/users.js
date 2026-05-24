const express = require('express');
const router = express.Router();
const { db } = require('../index');

// GET /api/users/:id - get public user profile
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const userDoc = await db.collection('users').doc(id).get();
    if (!userDoc.exists) return res.status(404).json({ error: 'User not found' });
    return res.json({ id: userDoc.id, ...userDoc.data() });
  } catch (error) {
    console.error('getUser error:', error);
    return res.status(500).json({ error: 'Failed to get user' });
  }
});

// GET /api/users - list users (basic)
router.get('/', async (req, res) => {
  try {
    const snapshot = await db.collection('users').limit(100).get();
    const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return res.json({ users });
  } catch (error) {
    console.error('listUsers error:', error);
    return res.status(500).json({ error: 'Failed to list users' });
  }
});

module.exports = router;
