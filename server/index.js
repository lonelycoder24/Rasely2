require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { initFirebase } = require('./firebaseAdmin');

// Initialize Firebase Admin
initFirebase();

const usersRouter = require('./routes/users');
const chatsRouter = require('./routes/chats');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/', (req, res) => res.json({ message: 'Rasely server is running' }));

app.use('/api/users', usersRouter);
app.use('/api/chats', chatsRouter);

// Basic error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
