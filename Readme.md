# 🏓 ft_transcendence

*This project has been created as part of the 42 curriculum by Hashir, Natalia, Abdul Rehman, and Santiago.*

---

## 📑 Table of Contents

- [🧭 Overview](#-overview)
- [🧱 Core Team](#-core-team)
- [🧩 Module Status](#-module-status-sorted)
- [📊 Status (v2.0.0)](#-status-v200)
- [📊 Module Totals](#-module-totals--mvp-2)
- [⚙️ Tech Stack](#️-tech-stack)
- [🌿 Branches (Remotes)](#-branches-remotes)
- [📁 Project Structure](#-project-structure)
- [🚀 Quick Start](#-quick-start)
- [🧪 Environment](#-environment)
- [📝 Notes (Important)](#-notes-important)

---

## 🧭 Overview

**ft_transcendence** is a full-stack web application inspired by the classic **Pong** game. The project focuses on gameplay engines (Pong, Connect4), multiplayer experiences, AI opponents, matchmaking, and tournaments while following the **ft_transcendence v19.x** subject requirements.

This document reflects the v2.0.0 (MVP-2) state. See Changelog for highlights.

---

## 🧱 Core Team

| Team Member      | Role                              | Focus                                                         |
| ---------------- | --------------------------------- | ------------------------------------------------------------- |
| **Hashir**       | Product Architect & Frontend Lead | SPA architecture, custom frontend framework, backend foundation |
| **Natalia**      | Platform & Data Steward           | Docker environment, SQLite schema & persistence               |
| **Abdul Rehman** | Gameplay Systems Engineer         | Pong engines, multiplayer logic, second game                  |
| **Santiago**     | AI & Competitive Systems Strategist | AI opponent, tournament manager, statistics                   |

---

## 🧩 Module Status (Sorted)

> ✅ Completed 🚧 Ongoing 🧪 Final (planned or not started)  
> **Only ✅ modules count for points**

### ✅ Completed

| Module                     | Owner         | Type          | Notes                                |
| -------------------------- | ------------- | ------------- | ------------------------------------ |
| Reactor Frontend Framework | Hashir        | Major (2 pts) | Custom SPA framework & hooks         |
| Classic Pong               | Abdul Rehman  | Major (2 pts) | Core Pong gameplay                   |
| Multiplayer Pong (2P / 4P) | Abdul Rehman  | Major (2 pts) | Multiple paddle modes                |
| Second Game (Connect4)     | Abdul Rehman  | Major (2 pts) | Board logic & win detection          |
| AI Opponent                | Santiago      | Major (2 pts) | Pong AI decision engine              |
| Fastify Backend            | Hashir        | Major (2 pts) | API server, CORS/JWT, routes         |
| User Management (JWT)      | Natalia       | Major (2 pts) | Signup, login, auth guard            |
| Tournament System          | Santiago      | Minor (1 pt)  | Create/register/start/advance/result |
| Matchmaking (HTTP)         | Santiago      | Minor (1 pt)  | Queue + active matches (Connect4)    |

### 🚧 Ongoing

| Module            | Owner    | Type          | Notes                                |
| ----------------- | -------- | ------------- | ------------------------------------ |
| Statistics        | Santiago | Minor (1 pt)  | Routes exist; repo queries pending   |
| ORM / Database    | Natalia  | Minor (1 pt)  | Prisma + SQLite; migrations ongoing  |

### 🧪 Final

| Module               | Owner   | Type          | Notes                    |
| -------------------- | ------- | ------------- | ------------------------ |
| WebSockets           | Natalia | Major (2 pts) | Realtime gameplay/chat (planned) |
| Babylon.js Graphics  | Hashir  | Major (2 pts) | Enhanced visuals (planned)       |
| Remote Auth (Google) | Hashir  | Minor (1 pt)  | Optional OAuth (planned)         |

---

## 📊 Status (v2.0.0)

- MVP-2 shipped: backend auth, tournaments, matchmaking; frontend login and dashboard skeleton.
- Realtime (WebSockets) and production statistics remain open items.

---

## 📊 Module Totals — MVP-2

### 🔢 Points Breakdown

| Member           | Major (✅) | Minor (✅) | Points |
| ---------------- | ---------- | ---------- | ------ |
| **Hashir**       | 2          | 0          | **4**  |
| **Abdul Rehman** | 3          | 0          | **6**  |
| **Natalia**      | 1          | 0          | **2**  |
| **Santiago**     | 1          | 2          | **4**  |
| **TOTAL**        | **7**      | **2**      | **16 / 14** ✅ |

Notes:
- Totals include only modules marked ✅ in the Module Status table.
- Minimum target assumed 14; project currently exceeds the target.

---

## ⚙️ Tech Stack

**Frontend**

* TypeScript
* Custom SPA framework (Reactor)
* Tailwind CSS

**Backend**

* Node.js
* Fastify (+ @fastify/jwt, CORS)
* SQLite via Prisma (better-sqlite3 adapter)

**DevOps**

* Docker
* Docker Compose

---

## 🌿 Branches (Remotes)

| Branch                     | Author        | Last Update |
| -------------------------- | ------------- | ----------- |
| origin/2P-Pong             | Abdul Rehman  | 2025-11-11  |
| origin/4P-Pong             | Abdul Rehman  | 2025-11-29  |
| origin/Dev                 | Hashir        | 2025-12-20  |
| origin/Fixed-Natalia-PrismaDB | Hashir    | 2025-12-24  |
| origin/HEAD                | Hashir        | 2026-01-04  |
| origin/Natalia-CICD        | Natalia       | 2025-12-07  |
| origin/Natalia-DB          | Natalia        | 2025-11-23 |
| origin/Natalia-PrismaDB    | Natalia        | 2025-12-26 |
| origin/Natalia-SignUp      | Natalia       | 2025-12-25  |
| origin/Natalia-miniPrisma  | Natalia       | 2025-12-03  |
| origin/SPA-reactor         | Hashir        | 2026-01-03  |
| origin/dropdown_fix        | Hashir        | 2025-12-07  |
| origin/main                | Hashir        | 2026-01-04  |
| origin/matchmaking_addition | Santiago      | 2026-01-03 |
| origin/mvp-1               | Hashir        | 2025-11-25  |

---

## 📁 Project Structure

```bash
ft_transcendence/
├── Frontend/        # SPA (TypeScript + Reactor + Tailwind)
├── Backend/         # Fastify backend + SQLite
├── Docker/          # Docker & NGINX configs
├── Makefile
└── Readme.md
```

---

## 🚀 Quick Start

```bash
make dev
```

---

## 🧪 Environment

Backend `.env`:

```
NODE_ENV=development
PORT=3000
DATABASE_URL="file:./database/transcendence.db"
JWT_SECRET=commercial-deep-water-port
```

Frontend `.env`:

```
VITE_API_URL=http://localhost:3000
```

If/when WebSockets are added:

```
VITE_WS_URL=ws://localhost:3000
```

---

## 🧷 Changelog

- v2.0.0 — MVP-2 (2026-01-22)
	- Production JWT auth: signup, login, `/api/me`, route guards
	- Tournament flow stabilized: create/register/start/advance/result
	- Matchmaking (HTTP): queue + active match lifecycle (Connect4)
	- Profile lookup `/api/users/:id`; dashboard pages scaffolded
	- Stats routes present; repository queries pending implementation
	- WebSockets not yet implemented (planned for realtime gameplay/chat)

- v1.0.0 — MVP-1 (2026-01-04)
	- Core game integration (Pong, Connect4)
	- Basic matchmaking and tournament logic
	- Reactor SPA framework introduced

---

## 📝 Notes (Important)

* ✅ README reflects v2.0.0 implementation
* 🚧 Statistics and WebSockets are in progress/planned
* 🧪 Future modules are listed under Final

---

© 2025 ft_transcendence Team · 42 Network Project
