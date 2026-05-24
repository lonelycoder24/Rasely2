# Rasely server

This server provides a small Express API that integrates with Firebase (Firestore + Authentication) via the Firebase Admin SDK.

Quick start
1. Create a Firebase project and a service account (Project Settings -> Service Accounts -> Generate new private key).
2. Store the service account JSON in an environment variable called FIREBASE_SERVICE_ACCOUNT. For example:

   export FIREBASE_SERVICE_ACCOUNT='{"type":"service_account","project_id":"...",...}'

   (On Windows PowerShell use: $env:FIREBASE_SERVICE_ACCOUNT = '...')

3. Install dependencies and start the server:

   cd server
   npm install
   npm run dev

Endpoints
- POST /api/auth/verify - verify an ID token (body: { idToken })
- GET /api/users - list users
- GET /api/users/:id - get user
- GET /api/chats - list chats for authenticated user
- POST /api/chats - create chat
- GET /api/chats/:chatId/messages - list messages
- POST /api/chats/:chatId/messages - send message

Notes
- Protected endpoints require an Authorization: Bearer <ID_TOKEN> header. The ID token is obtained from the client using Firebase client SDK (auth.currentUser.getIdToken()).
- This is a minimal starter. Add validation, rate-limiting, pagination, and security rules before production.
