# Rasely

Rasely is a social-messenger hybrid app. The current MVP includes a React + Vite frontend and Firebase Authentication with Google and email/password sign-in.

## Run locally

```bash
cd client
npm install
cp .env.example .env
npm run dev
```

Open the local URL printed by Vite. Restart the dev server after changing `.env` values.

## Firebase setup

1. Create a Firebase project and register a web app.
2. Copy the web app configuration into `client/.env` (use `client/.env.example` as the template).
3. In Firebase Console, open **Authentication → Sign-in method** and enable **Email/Password** and **Google**.
4. Under **Authentication → Settings → Authorized domains**, add your deployed site domain. Localhost is normally available for local development.
5. Create a Firestore database when you are ready to build profiles and messaging.

The web config values are public client identifiers, not server credentials. Never commit service account keys or other private credentials. Restrict the Firebase API key to the APIs and sites you use where applicable.

## Current scope

- Email/password account creation and sign-in
- Google sign-in popup
- Password reset email
- Authenticated welcome screen and sign-out

Messaging, profiles stored in Firestore, groups, media uploads, and notifications are not implemented yet.
