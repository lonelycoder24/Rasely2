# Rasely

Rasely is a social and messaging app with a React client and an Express + SQLite backend.

## Requirements

Use Node.js 20.19+ or 22.12+, and npm.

## Run in development

```bash
npm install
npm run dev
```

Open the Vite URL shown in the terminal (usually http://localhost:5173). The API runs on http://localhost:3001 and Vite proxies `/api` requests to it. SQLite data is stored in `server/data/rasely.sqlite` by default; set `RASELY_DB_PATH` to choose another location.

## Production build and run

```bash
npm run build
NODE_ENV=production npm start
```

The server serves the built client and API from one origin on port 3001. Set `PORT` as needed. Use HTTPS in production; the session cookie is Secure when `NODE_ENV=production`.

## Accounts and app features

- Register with a name, email, and password (10–128 characters); sign in and sign out.
- Passwords are bcrypt-hashed. Opaque random session tokens are stored as SHA-256 hashes in SQLite and sent only in HttpOnly, SameSite=Lax cookies.
- Authenticated users can publish posts, view the community feed, like/unlike posts, search members, and exchange direct messages.
- Account data and sessions persist in SQLite. Posts and messages are limited to authenticated users.

## API overview

- `POST /api/auth/register` `{ name, email, password }`
- `POST /api/auth/login` `{ email, password }`
- `GET /api/auth/me`; `POST /api/auth/logout`
- `PATCH /api/profile` `{ name }`
- `GET /api/posts`; `POST /api/posts` `{ text }`; `POST /api/posts/:id/like`
- `GET /api/people?q=...`
- `GET /api/messages/:userId`; `POST /api/messages/:userId` `{ text }`

The backend is a small single-instance MVP. For deployment at scale, use managed database backups, HTTPS, observability, email verification/password recovery, and a production session-store strategy. No real-time transport or media upload is included yet.
