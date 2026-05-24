const admin = require('firebase-admin');

// Middleware: verify Firebase ID token from Authorization header
exports.verifyFirebaseToken = async (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const match = authHeader.match(/^Bearer\s+(.*)$/i);
  const idToken = match ? match[1] : null;

  if (!idToken) return res.status(401).json({ error: 'No ID token provided' });

  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    req.user = { uid: decoded.uid, email: decoded.email }; // minimal user
    next();
  } catch (error) {
    console.error('Token verify error:', error);
    return res.status(401).json({ error: 'Invalid ID token' });
  }
};
