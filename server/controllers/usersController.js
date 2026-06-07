const { db } = require('../firebaseAdmin')();

// List users (limited)
async function listUsers(req, res, next) {
  try {
    const usersRef = db.collection('users').limit(100);
    const snapshot = await usersRef.get();
    const users = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.json(users);
  } catch (err) {
    next(err);
  }
}

async function getUser(req, res, next) {
  try {
    const id = req.params.id;
    const doc = await db.collection('users').doc(id).get();
    if (!doc.exists) return res.status(404).json({ error: 'User not found' });
    res.json({ id: doc.id, ...doc.data() });
  } catch (err) {
    next(err);
  }
}

async function createUser(req, res, next) {
  try {
    const data = req.body;
    const ref = await db.collection('users').add({
      ...data,
      createdAt: new Date(),
    });
    const doc = await ref.get();
    res.status(201).json({ id: ref.id, ...doc.data() });
  } catch (err) {
    next(err);
  }
}

async function updateUser(req, res, next) {
  try {
    const id = req.params.id;
    const updates = req.body;
    await db.collection('users').doc(id).set(updates, { merge: true });
    const doc = await db.collection('users').doc(id).get();
    res.json({ id: doc.id, ...doc.data() });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  listUsers,
  getUser,
  createUser,
  updateUser,
};
