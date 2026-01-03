
# 🏓 ft_transcendence

## 🧭 Overview
**ft_transcendence** is a full-stack web application inspired by the classic **Pong** game,
extended with real-time multiplayer, authentication, live chat, security features,
blockchain experiments, and 3D visuals.

This repository represents a **baseline integrated milestone** of the project.
Core systems are wired together, but the project is **still under active development**
and **not yet considered a production-ready release**.

Built as part of the **42 Network – Transcendence project**.



## Table of Contents
1. [🧭 Overview](#-overview)
2. [🧱 BASE (Mandatory Part)](#-base-mandatory-part)
3. [🧩 Module Ownership](#-module-ownership)
4. [📊 Module Points Summary (v19.x compliant)](#-module-points-summary-v19x-compliant)
5. [📊 Project Status](#-project-status)
6. [⚙️ Tech Stack](#️-tech-stack)
7. [🌿 Branching & Workflow Strategy](#-branching--workflow-strategy)
8. [🏷️ Versioning](#️-versioning)
9. [📁 Project Structure](#-project-structure)
10. [🚀 Quick Start](#-quick-start)
11. [🧪 Environment](#-environment)
12. [👥 Team](#-team)
13. [📝 Notes](#-notes)

---

## 🧱 BASE (Mandatory Part)
| Team Member | Responsibility | Description |
|------------|----------------|-------------|
| **Hashir** | SPA Structure + Backend (Fastify + Node.js) | TypeScript SPA architecture and backend API using Fastify. |
| **Natalia** | Docker Setup + SPA Integration | Docker environment, NGINX reverse proxy, HTTPS/TLS configuration. |
| **Abdul Rehman** | Core Pong Gameplay | Base 2-player Pong with consistent physics and paddle behavior. |
| **Santiago** | Tournament & Matchmaking + HTTPS | Tournament logic, matchmaking flow, and HTTPS integration. |

---

## 🧩 Module Ownership

### Hashir
- **Fastify** *(Major, 2 pts)* — Fastify server with CORS and tournament routes in `Backend/src/index.ts` and `Backend/src/routes/tournament.ts`.
- **Babylon** *(Major, 2 pts)* — Babylon.js canvas scene scaffold imported in `Frontend/src/pages/login.tsx`.
- **Remote Auth (Google)** *(Minor, 1 pt)* — No Google OAuth implementation present in the repository.
- **Reactor Frontend Framework** *(Major, 2 pts)* — Custom React-like SPA library and hooks in `Frontend/src/Reactor/`.

### Arehman
- **Multiplayer** *(Major, 2 pts)* — Multiplayer Pong engines including four-paddle flow in `Frontend/src/engine/pong_logic.ts` and `Frontend/src/engine/4p_pong_logic.ts`.
- **1st Game** *(Major, 2 pts)* — Classic Pong gameplay loop and scoring in `Frontend/src/engine/pong_logic.ts`.
- **2nd Game** *(Major, 2 pts)* — Connect4 board logic and win detection in `Frontend/src/engine/connect4_logic.ts`.

### Natalia
- **WebSockets** *(Major, 2 pts)* — No WebSocket server/client handlers are present; current backend exposes HTTP Fastify routes only.
- **User Management** *(Major, 2 pts)* — SQLite schema for users, sessions, friends, and avatars in `Backend/migrations/000_init.sql`.
- **ORM / Database** *(Minor, 1 pt)* — Database layer backed by `better-sqlite3` with migrations in `Backend/migrations/`.

### Santiago
- **AI Opponent** *(Major, 2 pts)* — Pong AI decision engine in `Frontend/src/engine/pong_ai.ts`.
- **Tournament** *(Minor, 1 pt)* — Tournament creation, advancement, and retrieval logic in `Backend/src/logic/tournamentManager.ts` and routes in `Backend/src/routes/tournament.ts`.
- **Statistics** *(Minor, 1 pt)* — Aggregated player stats table `stats_user` defined in `Backend/migrations/000_init.sql`.

## 📊 Module Points Summary (v19.x compliant)

| Member | Major | Minor | Total Points |
| ------ | ----- | ----- | ------------ |
| Hashir | 3 | 1 | 7 |
| Arehman | 3 | 0 | 6 |
| Natalia | 2 | 1 | 5 |
| Santiago | 1 | 2 | 4 |
| **Total** | **9** | **4** | **22** |

Points are distributed to reach and exceed the 14-point minimum; modules are implemented collaboratively, with ownership indicating primary responsibility.

---

## 📊 Project Status

🟡 **MVP-1 — Connected Baseline**

- SPA, Fastify backend, Docker/NGINX, gameplay, and tournament routes are wired end-to-end.
- Features are intentionally thin; behaviour and APIs will change while we harden the stack.
- Use this milestone as a stable reference point, **not** a production release.

---

## ⚙️ Tech Stack
- **Frontend:** TypeScript, Tailwind CSS, Babylon.js
- **Backend:** Node.js, Fastify, SQLite
- **DevOps:** Docker, NGINX, HTTPS (TLS 1.2 / 1.3)
- **Blockchain:** Avalanche, Solidity
- **Realtime:** WebSocket (WSS)

---

## 🌿 Branching & Workflow Strategy

| Branch | Purpose |
|------|---------|
| **main** | Milestone snapshots with a clean, linear project timeline |
| **dev** | Active integration branch for all ongoing development |
| **hashir** | SPA frontend & backend development |
| **natalia** | Docker, HTTPS, database, blockchain |
| **abdul** | Gameplay & second game features |
| **santiago** | AI opponent and dashboard |

Feature branches merge into **`dev`**.
Milestones are promoted from **`dev` → `main`** as **single, squashed commits**.

---

## 🏷️ Versioning

Tags (for example `v1.0.0`) mark **important development milestones**.
They should **not** be interpreted as user-facing or production releases.

Formal releases will be created only after the project reaches
feature completeness and production stability.

---

## 📁 Project Structure
```bash
ft_transcendence/
├── Frontend/              # SPA (TypeScript + Tailwind + Babylon.js)
├── Backend/               # Fastify backend + SQLite
├── Docker/                # Docker Compose + NGINX config
├── nginx/                 # NGINX configuration
├── Makefile               # Helper targets for dev/prod Docker runs
├── Contributing.md        # Development workflow guide
└── Readme.md              # This file
```

---

## 🚀 Quick Start

### Prerequisites
- Docker Engine + Docker Compose v2
- Ports `3000`, `5173`, `80`, `443` available (for dev/prod)

### Dev (hot reload)
```bash
make dev
# or:
docker compose -p game_app_dev -f Docker/docker-compose.yml -f Docker/docker-compose.dev.yml up --build
```

### Production-style (detached)
```bash
make prod
# or:
docker compose -p game_app_prod -f docker-compose.prod.yml up --build -d
```

Environment defaults live in `Backend/.env` and `Frontend/.env`; adjust ports/URLs there if needed.

---

## 🧪 Environment

Backend `.env` (default):
```
NODE_ENV=development
PORT=3000
DATABASE_URL="file:./database/transcendence.db"
```

Frontend `.env` (default):
```
NODE_ENV=development
VITE_API_URL=http://localhost:3000
```

Keep these values aligned with your local or deployed settings before running Docker or local dev.

---

## 👥 Team

| Name             | Role                         |
| ---------------- | ---------------------------- |
| **Hashir**       | Frontend & Architecture Lead |
| **Natalia**      | DevOps & Security Engineer   |
| **Abdul Rehman** | Gameplay Developer           |
| **Santiago**     | AI & Matchmaking Engineer    |

---

## 📝 Notes

* Repository includes the **mandatory base** and **initial modules**.
* All future modules must comply with **SPA**, **HTTPS**, and **Docker one-command** rules.
* Built following **ft_transcendence v19.x** subject requirements.

---

© 2025 ft_transcendence Team · 42 Network Project
