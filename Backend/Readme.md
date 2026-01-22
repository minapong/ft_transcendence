# ⚙️ ft_transcendence – Backend

## 🧭 Overview
This is the **backend** for the ft_transcendence project.  
It provides API routes and authentication logic for the SPA along with tournament and matchmaking services.

MVP-2 status: JWT auth, tournaments, matchmaking, and profile endpoints are available. WebSockets/chat and blockchain are planned.

---
## 🧱 Base Responsibilities
- Serve API for SPA  
- Manage tournament and matchmaking data  
- JWT authentication and route guards  
- Use environment variables for secrets  
- No unhandled errors or insecure endpoints  

---

## 🧩 Modules
| Module | Status | Description |
|--------|--------|-------------|
| **User Management** | ✅ | JWT auth (signup/login), `/api/me`, profile lookup |
| **Tournaments** | ✅ | Create/register/start/advance/result endpoints |
| **Matchmaking (HTTP)** | ✅ | Queue + active matches for Connect4 |
| **Statistics** | 🚧 | Routes present; repository queries pending |
| **WebSockets** | 🧪 | Planned realtime gameplay/chat layer |
| **Live Chat** | 🧪 | Planned, piggybacks on WebSockets |
| **Blockchain** | 🧪 | Planned (optional) |

---

## ⚙️ Tech Stack
- **Node.js + Fastify**  
- **Prisma + SQLite (better-sqlite3 adapter)**  
- **TypeScript**  
- **Dockerized deployment**  

---

## 🚀 Development

To run locally:

```bash
npm install
npm run dev
```

## 🔔 Changelog
- v2.0.0 — Added JWT auth (signup/login/me), tournaments and matchmaking routes; stats routes scaffolded; WebSockets pending.

---


## 👤 Maintainers

| Name             | Role                                         |
| ---------------- | -------------------------------------------- |
| **Hashir**       | SPA,  UI integration |
| **Abdul Rehman** | Pong gameplay logic                            |
| **Natalia**      | Docker & HTTPS configuration                   |
| **Santiago**     | Tournament, Matchmaking, AI Opponent, Dashboard |
---




🧩 *This backend serves as the secure core of ft_transcendence, powering real-time features, authentication, and blockchain integrations while maintaining strict compliance with HTTPS and Docker deployment requirements.*

 