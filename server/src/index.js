import bcrypt from 'bcryptjs';
import { createHash, randomBytes } from 'node:crypto';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { db, publicUser } from './db.js';

const app = express();
const port = Number(process.env.PORT || 3001);
const production = process.env.NODE_ENV === 'production';
const cookieName = 'rasely_session';
const sessionLifetime = 30 * 24 * 60 * 60 * 1000;
const here = dirname(fileURLToPath(import.meta.url));
const hashToken = (token) => createHash('sha256').update(token).digest('hex');
const clean = (value) => typeof value === 'string' ? value.trim() : '';
const safeUser = (row) => ({ id: row.id, name: row.name, handle: row.handle });

app.disable('x-powered-by');
app.use(helmet());
app.use(express.json({ limit: '16kb' }));

// State-changing browser requests must originate from the same origin as the API.
app.use('/api', (req, res, next) => {
  if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) return next();
  const origin = req.get('origin');
  if (origin && origin !== `${req.protocol}://${req.get('host')}`) {
    return res.status(403).json({ error: 'Request origin was not accepted.' });
  }
  next();
});

const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 30, standardHeaders: true, legacyHeaders: false });
const requireAuth = (req, res, next) => {
  const token = req.cookies?.[cookieName] || req.headers.cookie?.split(';').map((part) => part.trim()).find((part) => part.startsWith(`${cookieName}=`))?.slice(cookieName.length + 1);
  if (!token) return res.status(401).json({ error: 'Please sign in to continue.' });
  const session = db.prepare(`SELECT users.id, users.name, users.handle, users.email, users.created_at
    FROM sessions JOIN users ON users.id = sessions.user_id
    WHERE sessions.token_hash = ? AND sessions.expires_at > ?`).get(hashToken(decodeURIComponent(token)), Date.now());
  if (!session) return res.status(401).json({ error: 'Your session has expired. Please sign in again.' });
  req.user = session;
  next();
};

function issueSession(userId, res) {
  const token = randomBytes(32).toString('base64url');
  const expiresAt = Date.now() + sessionLifetime;
  db.prepare('INSERT INTO sessions (token_hash, user_id, expires_at) VALUES (?, ?, ?)').run(hashToken(token), userId, expiresAt);
  res.cookie(cookieName, token, { httpOnly: true, secure: production, sameSite: 'lax', path: '/', maxAge: sessionLifetime });
}

app.post('/api/auth/register', authLimiter, (req, res) => {
  const name = clean(req.body?.name);
  const email = clean(req.body?.email).toLowerCase();
  const password = typeof req.body?.password === 'string' ? req.body.password : '';
  if (name.length < 2 || name.length > 60) return res.status(400).json({ error: 'Name must be between 2 and 60 characters.' });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) return res.status(400).json({ error: 'Enter a valid email address.' });
  if (password.length < 10 || password.length > 128) return res.status(400).json({ error: 'Password must be between 10 and 128 characters.' });
  const baseHandle = (name.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '').slice(0, 18) || 'friend');
  let handle = baseHandle;
  while (db.prepare('SELECT 1 FROM users WHERE handle = ?').get(handle)) handle = `${baseHandle.slice(0, 14)}${randomBytes(2).toString('hex')}`;
  try {
    const result = db.prepare('INSERT INTO users (name, handle, email, password_hash) VALUES (?, ?, ?, ?)').run(name, handle, email, bcrypt.hashSync(password, 12));
    const user = db.prepare('SELECT id, name, handle, email, created_at FROM users WHERE id = ?').get(result.lastInsertRowid);
    issueSession(user.id, res);
    res.status(201).json({ user: publicUser(user) });
  } catch (error) {
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') return res.status(409).json({ error: 'An account with that email already exists.' });
    throw error;
  }
});

app.post('/api/auth/login', authLimiter, (req, res) => {
  const email = clean(req.body?.email).toLowerCase();
  const password = typeof req.body?.password === 'string' ? req.body.password : '';
  const row = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!row || !bcrypt.compareSync(password, row.password_hash)) return res.status(401).json({ error: 'Email or password is incorrect.' });
  issueSession(row.id, res);
  res.json({ user: publicUser(row) });
});

app.get('/api/auth/me', requireAuth, (req, res) => res.json({ user: publicUser(req.user) }));
app.post('/api/auth/logout', (req, res) => {
  const token = req.headers.cookie?.split(';').map((part) => part.trim()).find((part) => part.startsWith(`${cookieName}=`))?.slice(cookieName.length + 1);
  if (token) db.prepare('DELETE FROM sessions WHERE token_hash = ?').run(hashToken(decodeURIComponent(token)));
  res.clearCookie(cookieName, { httpOnly: true, secure: production, sameSite: 'lax', path: '/' });
  res.status(204).end();
});

app.patch('/api/profile', requireAuth, (req, res) => {
  const name = clean(req.body?.name);
  if (name.length < 2 || name.length > 60) return res.status(400).json({ error: 'Name must be between 2 and 60 characters.' });
  db.prepare('UPDATE users SET name = ? WHERE id = ?').run(name, req.user.id);
  const user = db.prepare('SELECT id, name, handle, email, created_at FROM users WHERE id = ?').get(req.user.id);
  res.json({ user: publicUser(user) });
});

app.get('/api/posts', requireAuth, (req, res) => {
  const rows = db.prepare(`SELECT posts.id, posts.text, posts.created_at, users.id AS user_id, users.name, users.handle,
      (SELECT COUNT(*) FROM likes WHERE likes.post_id = posts.id) AS likes,
      EXISTS(SELECT 1 FROM likes WHERE likes.post_id = posts.id AND likes.user_id = ?) AS liked
    FROM posts JOIN users ON users.id = posts.user_id ORDER BY posts.id DESC LIMIT 100`).all(req.user.id);
  res.json({ posts: rows.map((row) => ({ id: row.id, text: row.text, createdAt: row.created_at, likes: row.likes, liked: Boolean(row.liked), author: { id: row.user_id, name: row.name, handle: row.handle } })) });
});

app.post('/api/posts', requireAuth, (req, res) => {
  const text = clean(req.body?.text);
  if (!text || text.length > 1000) return res.status(400).json({ error: 'Post must contain 1 to 1000 characters.' });
  const result = db.prepare('INSERT INTO posts (user_id, text) VALUES (?, ?)').run(req.user.id, text);
  res.status(201).json({ post: { id: result.lastInsertRowid, text, createdAt: new Date().toISOString(), likes: 0, liked: false, author: safeUser(req.user) } });
});

app.post('/api/posts/:id/like', requireAuth, (req, res) => {
  const postId = Number(req.params.id);
  if (!Number.isSafeInteger(postId)) return res.status(400).json({ error: 'Invalid post.' });
  if (!db.prepare('SELECT 1 FROM posts WHERE id = ?').get(postId)) return res.status(404).json({ error: 'Post not found.' });
  const existing = db.prepare('SELECT 1 FROM likes WHERE user_id = ? AND post_id = ?').get(req.user.id, postId);
  if (existing) db.prepare('DELETE FROM likes WHERE user_id = ? AND post_id = ?').run(req.user.id, postId);
  else db.prepare('INSERT INTO likes (user_id, post_id) VALUES (?, ?)').run(req.user.id, postId);
  const likes = db.prepare('SELECT COUNT(*) AS count FROM likes WHERE post_id = ?').get(postId).count;
  res.json({ liked: !existing, likes });
});

app.get('/api/people', requireAuth, (req, res) => {
  const query = clean(req.query.q).slice(0, 60);
  const users = db.prepare(`SELECT id, name, handle FROM users WHERE id != ? AND (name LIKE ? OR handle LIKE ?) ORDER BY name LIMIT 30`).all(req.user.id, `%${query}%`, `%${query}%`);
  res.json({ people: users });
});

app.get('/api/messages/:userId', requireAuth, (req, res) => {
  const otherId = Number(req.params.userId);
  if (!Number.isSafeInteger(otherId) || otherId === req.user.id) return res.status(400).json({ error: 'Invalid conversation.' });
  const other = db.prepare('SELECT id, name, handle FROM users WHERE id = ?').get(otherId);
  if (!other) return res.status(404).json({ error: 'Person not found.' });
  const messages = db.prepare(`SELECT id, sender_id, recipient_id, text, created_at FROM messages
    WHERE (sender_id = ? AND recipient_id = ?) OR (sender_id = ? AND recipient_id = ?) ORDER BY id ASC LIMIT 200`).all(req.user.id, otherId, otherId, req.user.id);
  res.json({ person: other, messages: messages.map((message) => ({ id: message.id, from: message.sender_id === req.user.id ? 'me' : 'them', text: message.text, createdAt: message.created_at })) });
});

app.post('/api/messages/:userId', requireAuth, (req, res) => {
  const otherId = Number(req.params.userId);
  const text = clean(req.body?.text);
  if (!Number.isSafeInteger(otherId) || otherId === req.user.id || !db.prepare('SELECT 1 FROM users WHERE id = ?').get(otherId)) return res.status(404).json({ error: 'Person not found.' });
  if (!text || text.length > 2000) return res.status(400).json({ error: 'Message must contain 1 to 2000 characters.' });
  const result = db.prepare('INSERT INTO messages (sender_id, recipient_id, text) VALUES (?, ?, ?)').run(req.user.id, otherId, text);
  res.status(201).json({ message: { id: result.lastInsertRowid, from: 'me', text, createdAt: new Date().toISOString() } });
});

const clientDist = resolve(here, '../../client/dist');
app.use(express.static(clientDist));
app.get('*', (req, res, next) => req.path.startsWith('/api/') ? next() : res.sendFile(resolve(clientDist, 'index.html'), (error) => error && next(error)));
app.use((error, req, res, next) => {
  console.error(error);
  if (res.headersSent) return next(error);
  res.status(500).json({ error: 'Something went wrong. Please try again.' });
});

app.listen(port, () => console.log(`Rasely API listening on http://localhost:${port}`));
