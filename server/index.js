require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const initFirebaseAdmin = require('./firebaseAdmin');
const usersRouter = require('./routes/users');
const chatsRouter = require('./routes/chats');

// Initialize Firebase Admin SDK
initFirebaseAdmin();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());

app.get('/health', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));

app.use('/api/users', usersRouter);
app.use('/api/chats', chatsRouter);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Rasely server running on port ${PORT}`);
});
