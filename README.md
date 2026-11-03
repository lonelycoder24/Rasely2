# Rasely

Rasely is a social-messenger hybrid app concept that combines profile management, messaging, group chat, notifications, and privacy controls.

## Current status

This repository has been initialized with a working React + Vite client app and Firebase-ready configuration. The app is not yet a complete messaging platform, but it is now set up as a clean MVP foundation.

## Run locally

```bash
cd client
npm install
npm run dev
```

## Firebase setup

1. Create a Firebase project.
2. Add a web app to the project and copy the configuration values.
3. Copy `client/.env.example` to `client/.env`.
4. Fill in your Firebase values.
5. In Firebase Console, enable:
   - Authentication
   - Firestore Database
   - Storage (for media sharing)

## Planned MVP features

- User profiles
- Sign in / sign up
- Messaging list and chat view
- Group chats
- Media upload support
- Notifications
- Privacy controls

## Notes

The current code is intentionally simple and focused on getting the project started. It is designed so you can add Firebase-backed features gradually without reworking the app structure.
