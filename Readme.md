# 🏓 ft_transcendence

*This project has been created as part of the 42 curriculum by Hashir, Natalia, Abdul Rehman, and Santiago.*

---

## 📑 Table of Contents

- [🧭 Overview](#-overview)
- [🧱 Core Team](#-core-team)
- [🧩 Module Status](#-module-status-sorted)
- [📊 Module Totals](#-module-totals--current-state)
- [⚙️ Tech Stack](#️-tech-stack)
- [🌿 Branches (Remotes)](#-branches-remotes)
- [📁 Project Structure](#-project-structure)
- [🚀 Quick Start](#-quick-start)
- [🧪 Environment](#-environment)
- [📝 Notes (Important)](#-notes-important)

---

## 🧭 Overview

**ft_transcendence** is a full-stack web application inspired by the classic **Pong** game.
The project focuses on real-time gameplay logic, multiplayer experiences, AI opponents,
and tournament systems, while following the **ft_transcendence v19.x** subject requirements.

This repository reflects the **current development state**.
All modules below match their **real implementation status**.

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
| Fastify Backend            | Hashir        | Minor (1 pt)  | Core server, CORS, tournament routes |
| Tournament System          | Santiago      | Minor (1 pt)  | Tournament manager & routes          |
| Statistics                 | Santiago      | Minor (1 pt)  | stats_user aggregation table         |

### 🚧 Ongoing

| Module            | Owner    | Type          | Notes                                |
| ----------------- | -------- | ------------- | ------------------------------------ |
| User Management   | Natalia  | Major (2 pts) | SQLite schema for users              |
| ORM / Database    | Natalia  | Minor (1 pt)  | better-sqlite3 + migrations          |

### 🧪 Final

| Module               | Owner   | Type          | Notes                    |
| -------------------- | ------- | ------------- | ------------------------ |
| Babylon.js Graphics  | Hashir  | Major (2 pts) | Placeholder import only  |
| Remote Auth (Google) | Hashir  | Minor (1 pt)  | No OAuth present         |
| WebSockets           | Natalia | Major (2 pts) | No realtime layer yet    |

---

## 📊 Module Totals — Current State

### 🔢 Points Breakdown

| Member           | Major (✅) | Minor (✅) | Points        |
| ---------------- | --------- | --------- | ------------- |
| **Hashir**       | 1         | 1         | **3**         |
| **Abdul Rehman** | 3         | 0         | **6**         |
| **Natalia**      | 0         | 0         | **0**         |
| **Santiago**     | 1         | 2         | **4**         |
| **TOTAL**        | **5**     | **3**     | **13 / 14** ❌ |

**Status:** ❌ Not evaluation-ready  
**Missing:** 1 point (1 Minor)

---

## ⚙️ Tech Stack

**Frontend**

* TypeScript
* Custom SPA framework (Reactor)
* Tailwind CSS

**Backend**

* Node.js
* Fastify
* SQLite (better-sqlite3)

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

Frontend `.env` !!! while running PROD, comment VITE_API_URL:

```
VITE_API_URL=http://localhost:3000 
```

---

## 📝 Notes (Important)

* ✅ README reflects **actual implementation**, not intentions
* 🚧 Some modules are still ongoing (see status tables above)
* 🧪 Final modules are planned but **not started**

---

© 2025 ft_transcendence Team · 42 Network Project
