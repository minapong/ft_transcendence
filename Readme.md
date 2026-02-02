# ft_transcendence — MINA Games

A full-stack multiplayer game platform built for the 42 ft_transcendence project. It combines real-time gameplay, tournaments, matchmaking, social features, and a custom SPA framework (Reactor).

## Highlights

- Pong: 2P, 4P, AI modes, pause/resume, touch controls
- Connect 4: matchmaking + single-player
- Auth, profiles, avatars, friends, presence
- Tournaments with bracket progression
- Global stats, leaderboard, match history
- Custom JSX framework and router (Reactor)

## Tech Stack

Frontend:
- TypeScript + Vite
- Reactor (custom JSX runtime + hooks + router)
- Tailwind CSS v4 + custom design tokens
- Motion One

Backend:
- Node.js + Fastify
- Prisma + SQLite
- WebSocket presence channel

Infrastructure:
- Docker + Docker Compose
- NGINX for production/static hosting

## Quick Start (Docker)

Development:

```bash
make dev
```

Optional seed data:

```bash
make dev-seed
```

Production:

```bash
make prod
```

Local production + seed:

```bash
make prod-seed
```

Ports:
- Dev frontend: http://localhost:5173
- Dev backend: http://localhost:3000
- Prod (nginx): http://localhost:80 / https://localhost:443
- Local-prod (nginx): https://localhost:8443

## Environment Variables

Backend (`Backend/.env`):

```env
JWT_SECRET=change-me
DATABASE_URL="file:./database/transcendence.db"
```

Frontend (`Frontend/.env`):

```env
VITE_API_BASE=http://localhost:3000
# Optional override for WebSocket base:
# VITE_WS_BASE=ws://localhost:3000
```

## Repo Structure

- `Frontend/` — SPA + Reactor framework
- `Backend/` — Fastify API + Prisma
- `Docker/` — Compose files for dev
- `nginx/` — Production nginx configs
- `custom_major.md` / `custom_minor.md` — custom module writeups
- `features.md` — demoable feature checklist

## Maintainers

- Malik Hashir (mhashir)
- Abdul Rehman (aalkaisi)
- Natalia (nmagdano)
- Santiago (saherrer)
