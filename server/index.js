require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const admin = require('firebase-admin');

// Initialize Firebase Admin
let serviceAccount = {};
if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  try {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  } catch (e) {
    console.error('Invalid FIREBASE_SERVICE_ACCOUNT JSON.');
    process.exit(1);
  }
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users');
const chatsRoutes = require('./routes/chats');
const { verifyFirebaseToken } = require('./middleware/firebaseAuth');

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Public routes
app.use('/api/auth', authRoutes);

// Protected routes
app.use('/api/users', verifyFirebaseToken, usersRoutes);
app.use('/api/chats', verifyFirebaseToken, chatsRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));

module.exports = { app, db, admin };
