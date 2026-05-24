# Rasely Server

This directory contains a minimal Express server scaffold for Rasely that uses the Firebase Admin SDK to interact with Firestore.

Important: Do NOT commit your Firebase service account into version control. Instead, populate environment variables or use GitHub Secrets for CI.

## Setup

1. cd server
2. cp .env.example .env
3. Fill in the environment variables in `.env` (see .env.example). For FIREBASE_PRIVATE_KEY you may need to replace newlines with `\\n` when setting the value in environment variables.
4. npm install
5. npm run dev (requires nodemon) or npm start

## Available endpoints (examples)
- GET /health
- GET /api/users
- GET /api/users/:id
- PATCH /api/users/:id
- GET /api/chats?userId=<uid>
- POST /api/chats { name, participants }
- GET /api/chats/:id/messages
- POST /api/chats/:id/messages { senderId, senderName, text }

## Environment
See .env.example for required variables.
