const admin = require('firebase-admin');

module.exports = function initFirebaseAdmin() {
  if (admin.apps.length) return admin.app();

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  let privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKey) {
    console.warn('Missing Firebase Admin credentials in environment. Firebase Admin will not initialize.');
    return null;
  }

  // Replace escaped newlines (if set via env) with actual newlines
  privateKey = privateKey.replace(/\\n/g, '\n');

  const credential = {
    projectId,
    clientEmail,
    privateKey,
  };

  admin.initializeApp({
    credential: admin.credential.cert(credential),
  });

  console.log('Firebase Admin initialized');
  return admin.app();
};
