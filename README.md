# Blackjack Live Helper

A mobile-first Progressive Web App (PWA) that helps track a live blackjack table using Hi-Lo card counting, true count, deck penetration, betting suggestions, basic strategy, and live table mode.

Everything runs locally in your browser — no database, no backend, no external APIs.

## Features

- **Hi-Lo counting** — Running count and true count with deck penetration tracking
- **Betting ramp** — Suggestions from MINIMUM to AGGRESSIVE based on true count
- **Basic strategy engine** — Hard/soft hands, pairs, doubles, splits, and count deviations
- **Live Table Mode** — Lock a preliminary decision and watch it update as more cards appear
- **Multi-player support** — Track 1–5 players, mark which seat is yours
- **Round management** — Save rounds, start new rounds, undo, reset shoe
- **Offline PWA** — Installable on Android Chrome with offline app shell
- **localStorage persistence** — State survives page refresh

## Tech Stack

- React + TypeScript
- Vite
- Tailwind CSS
- vite-plugin-pwa
- localStorage (no database)

## Install

```bash
npm install
```

## Run (Development)

```bash
npm run dev
```

Open the URL shown in the terminal (typically `http://localhost:5173`).

## Build

```bash
npm run build
```

## Preview Production Build

```bash
npm run preview
```

## PWA Install (Android Chrome)

1. Run `npm run build` and `npm run preview`, or deploy the `dist/` folder to any static host.
2. Open the app in **Chrome on Android**.
3. Tap the menu (⋮) → **Install app** or **Add to Home screen**.
4. The app launches in standalone mode with offline support.

The service worker caches the app shell. All game state is stored in localStorage on your device.

## No Database Design

This app intentionally avoids any server-side storage:

- **Deck count, players, hands, and count history** → `localStorage`
- **Strategy and counting logic** → pure TypeScript functions in `src/lib/`
- **Offline support** → service worker caches static assets only

Your data never leaves your device.

## Project Structure

```
src/
  components/     # UI components
  lib/            # Counting, strategy, and storage logic
  types/          # TypeScript types
  App.tsx         # Main app
  main.tsx        # Entry point
```

## Disclaimer

This tool is educational and does not guarantee profit. Casino rules, table limits, penetration, mistakes, and variance affect results.
