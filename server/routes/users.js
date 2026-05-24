const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');

// GET /api/users/:id - get user profile
router.get('/:id', async (req, res, next) => {
  try {
    const uid = req.params.id;
    const db = admin.firestore();
    const userDoc = await db.collection('users').doc(uid).get();
    if (!userDoc.exists) return res.status(404).json({ error: 'User not found' });
    return res.json({ id: userDoc.id, ...userDoc.data() });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/users/:id - update user fields (bio, photoURL, etc.)
router.patch('/:id', async (req, res, next) => {
  try {
    const uid = req.params.id;
    const updates = req.body;
    const db = admin.firestore();
    await db.collection('users').doc(uid).set(updates, { merge: true });
    const updated = await db.collection('users').doc(uid).get();
    return res.json({ id: updated.id, ...updated.data() });
  } catch (err) {
    next(err);
  }
});

// GET /api/users - list users (basic pagination)
router.get('/', async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit || '50', 10);
    const db = admin.firestore();
    const snapshot = await db.collection('users').limit(limit).get();
    const users = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    res.json(users);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
