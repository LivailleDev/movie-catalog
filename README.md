# CineFinder — Movie Catalog

[![CI](https://github.com/LivailleDev/movie-catalog/actions/workflows/ci.yml/badge.svg)](https://github.com/LivailleDev/movie-catalog/actions/workflows/ci.yml)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-online-brightgreen)](https://calm-cendol-e2c842.netlify.app)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6)
![React](https://img.shields.io/badge/React-18-61DAFB)
![Vite](https://img.shields.io/badge/Vite-5-646CFF)

A movie catalog built with **React + TypeScript**: browse trending films, search the
**TMDB** database, and open a details view — with fully typed API models, debounced
search, and graceful states.

**🔗 Live demo:** https://calm-cendol-e2c842.netlify.app

![CineFinder](docs/screenshot.png)

## What this project demonstrates

- **TypeScript end to end** — typed API models (`Movie`, `MovieDetails`, TMDB responses),
  typed components, props and a generic `useDebounce<T>` hook.
- **Consuming a third-party REST API** (TMDB) with `fetch`, loading and error states.
- **Debounced search**, a responsive poster grid, and an accessible details modal
  (close on Escape or backdrop click, lazy-loaded images).
- **Graceful degradation** — with no API key the app runs in demo mode on bundled
  sample data, so it always works; with a key it fetches live data and posters.
- **Tested + CI** — unit tests (Vitest + Testing Library) for the debounce hook, the
  API layer and the components, run on every push via GitHub Actions.

## Features

- Trending movies grid
- Debounced movie search
- Details modal: rating, release year, runtime, genres, tagline, overview
- Demo-mode fallback (no backend, no key required)

## Tech

React 18 · TypeScript · Vite · Tailwind CSS · TMDB API

## Run locally

```bash
npm install
npm run dev      # http://localhost:5175
```

For **live data** (optional), get a free [TMDB API key](https://www.themoviedb.org/settings/api),
then copy `.env.example` to `.env.local` and set it:

```bash
VITE_TMDB_KEY=your_key_here
```

Type-check and build:

```bash
npm run typecheck
npm run build
```

## Tests

```bash
npm test          # run the suite once (Vitest)
npm run test:watch  # watch mode
```

22 tests cover the `useDebounce` hook (with fake timers), the API/demo-mode layer
(`posterUrl`, search, details, error paths) and the `MovieCard` / `SearchBar`
components. Tests run offline against sample data — no API key needed.

## Attribution

This product uses the TMDB API but is not endorsed or certified by
[TMDB](https://www.themoviedb.org/).
