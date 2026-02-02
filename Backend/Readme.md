# ft_transcendence — Backend

Fastify API server for auth, profiles, social features, matchmaking, tournaments, and stats. Uses Prisma + SQLite and a WebSocket presence channel.

## Responsibilities

- Auth (login/signup), sessions, profile settings
- Friends + avatars
- Presence status + WebSocket presence stream
- Matchmaking (Connect4)
- Tournaments (Pong)
- Stats, leaderboard, match history
- Static asset serving for uploaded avatars

## Tech Stack

- Node.js + Fastify
- Prisma ORM + SQLite
- JWT auth
- @fastify/websocket for presence

## Development

```bash
npm install
npm run dev
```

Notes:
- `npm run dev` runs `tsc` then starts `dist/src/index.js`.
- `JWT_SECRET` is required for auth.

## Environment

```env
JWT_SECRET=change-me
DATABASE_URL="file:./database/transcendence.db"
```

## Maintainers

- Malik Hashir (mhashir)
- Abdul Rehman (aalkaisi)
- Natalia (nmagdano)
- Santiago (saherrer)
