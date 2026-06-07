# Rasely Server

This folder contains a simple Express server used to provide REST endpoints for the Rasely application. It is designed to interact with Firebase (Firestore) via the Firebase Admin SDK.

Important: Do not commit service account JSON or secrets to the repository. Use environment variables or GitHub Secrets.

Setup

1. Copy the example env to a local .env file:

   cp .env.example .env

2. Provide Firebase credentials. There are two supported options:

   - FIREBASE_SERVICE_ACCOUNT: Paste the full service account JSON as a single-line JSON string. When adding to an environment file, escape newlines or use a secret manager.
   - GOOGLE_APPLICATION_CREDENTIALS: Path to a local service account JSON file (not recommended in repos).

3. Install dependencies:

   cd server
   npm install

4. Run the server (development):

   npm run dev

API endpoints

- GET /api/users
- GET /api/users/:id
- POST /api/users
- PATCH /api/users/:id

- GET /api/chats
- GET /api/chats/:id
- POST /api/chats
- POST /api/chats/:id/messages

Notes

- This scaffold uses Firestore. The client app (in client/) currently expects Firestore collections named `users`, `chats`, and `chats/{chatId}/messages`.
- For deployment, set environment variables securely in your hosting platform or use GitHub Actions with repository secrets.
