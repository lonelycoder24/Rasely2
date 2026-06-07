const admin = require('firebase-admin');

function initFirebase() {
  if (admin.apps && admin.apps.length) return admin.app();

  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    // FIREBASE_SERVICE_ACCOUNT should be a JSON string (escape newlines when setting in env/secrets)
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: process.env.FIREBASE_DATABASE_URL || undefined,
    });
    console.log('Firebase Admin initialized using FIREBASE_SERVICE_ACCOUNT');
  } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    // Use application default credentials (path to service account JSON file)
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      databaseURL: process.env.FIREBASE_DATABASE_URL || undefined,
    });
    console.log('Firebase Admin initialized using GOOGLE_APPLICATION_CREDENTIALS');
  } else {
    console.warn('No Firebase credentials found in env. Set FIREBASE_SERVICE_ACCOUNT or GOOGLE_APPLICATION_CREDENTIALS');
  }

  return admin.app();
}

module.exports = {
  initFirebase,
  admin,
  db: () => admin.firestore(),
  auth: () => admin.auth(),
};
