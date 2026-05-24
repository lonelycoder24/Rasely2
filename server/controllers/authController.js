const admin = require('firebase-admin');

// POST /api/auth/verify - verify id token and return user info
exports.verify = async (req, res) => {
  const idToken = req.body.idToken;
  if (!idToken) return res.status(400).json({ error: 'idToken required' });

  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    const user = await admin.auth().getUser(decoded.uid);
    return res.json({ uid: user.uid, email: user.email, displayName: user.displayName, photoURL: user.photoURL });
  } catch (error) {
    console.error('Auth verify error:', error);
    return res.status(401).json({ error: 'Invalid token' });
  }
};
