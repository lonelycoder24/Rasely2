# Rasely

Rasely is a friendly social-and-messaging app concept that brings a community feed and direct conversations together.

## Run locally

Requirements: Node.js 18 or newer.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. To create a production build, run `npm run build`; use `npm run preview` to preview it locally.

## What's here

- Responsive community feed with sample posts, interactive likes, and a post composer.
- Direct-message UI with conversation search and locally interactive message sending.
- Circle, profile, explore, and bookmark navigation surfaces.
- Posts are saved in browser local storage. The current app uses demo content and local browser state; it does not yet include accounts, a server, real-time delivery, or cloud media uploads.

## Project layout

- `client/src/App.jsx` — app screens and interactions
- `client/src/styles.css` — responsive visual design
- `client/index.html` — Vite entry point
