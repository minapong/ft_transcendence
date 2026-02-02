*This project has been created as part of the 42 curriculum by mhashir, aalkaisi, nmagdano, saherrer.*

---
# 🎮 MINA GAMES — ft_transcendence

## 🧭 Description

**MINA GAMES** is a full-stack multiplayer web application built for the **ft_transcendence (v19.x)** project.  
It is a competitive game platform focused on real-time gameplay, tournaments, AI opponents, and player progression.

Key features:
- Classic Pong (2P, 4P, AI)
- Connect 4 with matchmaking
- User accounts, profiles, friends, and presence
- Tournaments with automatic brackets
- Global statistics and leaderboards
- Custom-built frontend SPA framework

The project emphasizes real-time systems, game logic, clean architecture, and team collaboration.

---


---
## 🚀 Instructions


### Prerequisites

- Docker & Docker Compose
- Make
- Google Chrome (latest stable)

---


### Run the Project

```bash
make dev
```

This starts:

- Fastify backend
- Frontend SPA
- SQLite database
- NGINX reverse proxy (via Docker)

---


### Environment Setup

#### Backend (`Backend/.env`)
```env
NODE_ENV=development
PORT=3000
DATABASE_URL="file:./database/transcendence.db"
JWT_SECRET=commercial-deep-water-port
```

#### Frontend (`Frontend/.env`)
```env
VITE_API_URL=http://localhost:3000
```

For production, the frontend API URL is handled by NGINX.

---


---
## 👥 Team Information

| Login      | Name         | Role(s)                | Responsibilities |
|------------|--------------|------------------------|------------------|
| mhashir    | Malik Hashir | PO, PM, Frontend Lead  | Product vision, planning, frontend architecture, backend core logic |
| aalkaisi   | Abdul Rehman | Scrum Master, Developer| Sprint coordination, gameplay logic, Pong & Connect 4, touch controls |
| nmagdano   | Natalia      | Tech Lead, Developer   | Infrastructure, Docker, NGINX, database schema, persistence |
| saherrer   | Santiago     | Tech Lead, Developer   | Tournament system, matchmaking, AI opponent, statistics |

### Product Owner / Project Manager

**Malik Hashir**

* Product vision and planning
* Feature prioritization
* Frontend architecture
* Backend core logic

### Scrum Master

**Abdul Rehman**

* Sprint coordination
* Gameplay task tracking
* Delivery alignment

### Technical Leads / Architects

**Santiago**

* Tournament system design
* Matchmaking logic
* AI opponent and competitive systems

**Natalia**

* Infrastructure design
* Docker & NGINX setup
* Database schema and persistence

### Developers

All team members contributed as developers.

---


---
## 📋 Project Management

- Task tracking: GitHub Issues
- Branching model:
	- `Dev` → integration branch
	- Feature branches → Dev
	- `main` → milestone snapshots only
- Communication: Discord
- Reviews: Pull Requests and peer review
- Meetings: Weekly standups, sprint planning, retrospectives

* Task tracking: GitHub Issues
* Branching model:

	* `Dev` → integration branch
	* Feature branches → Dev
	* `main` → milestone snapshots only
* Communication: Discord
* Reviews: Pull Requests and peer review

---


---
## ⚙️ Technical Stack

### Frontend
- TypeScript
- Custom SPA framework (**Reactor**)
- Vite
- Tailwind CSS v4
- Motion One

### Backend
- Node.js
- Fastify
- JWT authentication
- Prisma ORM

### Database
- SQLite
- Prisma
- better-sqlite3 adapter

### Infrastructure
- Docker
- Docker Compose
- NGINX (reverse proxy + static serving)

**Justification:**
Reactor was built to demonstrate SPA lifecycles, hooks, routing, and rendering without React. Fastify offers performance and explicit control. SQLite is simple and deterministic.

### Frontend

* TypeScript
* Custom SPA framework (**Reactor**)
* Vite
* Tailwind CSS v4
* Motion One

**Justification:**
Reactor was built to demonstrate understanding of SPA lifecycles, hooks, routing, and rendering without relying on React.

---

### Backend

* Node.js
* Fastify
* JWT authentication
* Prisma ORM

**Justification:**
Fastify offers performance, explicit control, and is fully allowed under ft_transcendence v19.x.

---

### Database

* SQLite
* Prisma
* better-sqlite3 adapter

**Justification:**
Simple, deterministic, and aligned with project constraints.

---

### Infrastructure

* Docker
* Docker Compose
* NGINX (reverse proxy + static serving)

---


---
## 🗄️ Database Schema

Main tables:
- `users`
- `friends`
- `avatars`
- `matches`
- `match_players`
- `tournaments`
- `tournament_matches`
- `stats_user`

Relationships:
- Users ↔ Matches (many-to-many)
- Tournaments ↔ Matches (one-to-many)
- User ↔ StatsUser (one-to-one)
- User ↔ Friend (one-to-one)

* Cascade deletes for ownership-bound entities
* SetNull for historical references (winners, selected avatars)
---


---
## 🎮 Features List

| Feature                | Description                                  | Owner(s)         |
|------------------------|----------------------------------------------|------------------|
| Authentication         | Signup, login, logout, JWT sessions          | mhashir          |
| User Profile           | Stats, achievements, avatar upload           |  nmagdano|
| User Presence          | Real-time online status, public profiles     | mhashir          |
| Pong                   | 2P, 4P, AI, touch controls, pause/resume     | aalkaisi         |
| Connect 4              | Matchmaking, turn indicators, win detection  | aalkaisi         |
| Tournament System      | Creation, registration, brackets, winner     | saherrer         |
| Statistics/Leaderboard | Global leaderboard, match history, ratios    | saherrer         |
| Social                 | Friends system (add/remove)                  |  nmagdano|

### Authentication & Accounts

* Signup, login, logout
* JWT sessions
* User profile with stats and achievements
	**Owner:** Malik Hashir

### User Presence

* Real-time online status
* Public user profiles
	**Owner:** Malik Hashir

### Pong

* Classic 2-player Pong
* AI opponent (difficulty levels)
* 4-player Pong (2v2, four paddles)
* Touch controls
* Pause / resume
	**Owner:** Abdul Rehman

### Connect 4

* Matchmaking
* Turn indicators
* Automatic win/draw detection
	**Owner:** Abdul Rehman

### Tournament System

* Tournament creation
* Player registration
* Automatic brackets
* Winner display
	**Owner:** Santiago

### Statistics & Leaderboards

* Global leaderboard
* Match history
* Win/loss ratios
* Achievements
	**Owner:** Santiago

### Social

* Friends system (add/remove)
* Avatar upload
	**Owner:** Malik Hashir, Natalia

---


---
## 🧩 Modules

| Module                              | Type  | Points | Owner(s)    | Implementation & Justification |
|--------------------------------------|-------|--------|-------------|-------------------------------|
| Custom Frontend Framework (Reactor)  | Major | 2      | mhashir     | Built for SPA lifecycle demo   |
| User Management                      | Major | 2      | mhashir, nmagdano | Authentication, profiles, presence, friends, avatar upload |
| Web-based Game (Pong)                | Major | 2      | aalkaisi    | Multiplayer, 4P, AI           |
| Multiplayer Game (4P Pong)           | Major | 2      | aalkaisi    | 2v2, four paddles              |
| Second Game (Connect 4)              | Major | 2      | aalkaisi    | Matchmaking, win detection     |
| AI Opponent                         | Major | 2      | saherrer    | AI for Pong, Connect 4         |
| Backend Framework (Fastify)          | Minor | 1      | mhashir     | Fast, explicit, allowed        |
| Tournament System                    | Minor | 1      | saherrer    | Bracket, registration, winner  |
| Game Statistics                      | Minor | 1      | saherrer    | Leaderboard, match history     |
| Custom Design System                 | Minor | 1      | mhashir     | Custom UI components and design tokens for consistent UX |
| Modal System                 | Minor | 1      | mhashir     | Centralized, framework-level modal infrastructure; accessibility, lifecycle, and rendering isolation |
| Gamification System                  | Minor | 1      | saherrer    | Achievements, badges, leaderboards, XP/level, persistent & visual |
| Support for Additional Browsers      | Minor | 1      | saherrer    | Firefox, Safari, Edge compatibility, consistent UI/UX |

**Total:** 19 / 14 points
---


---
## 👤 Individual Contributions

### mhashir
- Product ownership, frontend SPA, routing, backend foundation, presence system

### aalkaisi
- Pong engines (2P, 4P), Connect 4 logic, gameplay mechanics, touch controls

### saherrer
- Tournament architecture, matchmaking, AI opponent, statistics system

### nmagdano
- Docker & NGINX, database schema, persistence layer, infrastructure setup

### Malik Hashir

* Product ownership
* Frontend SPA framework
* Routing and lifecycle
* Backend foundation
* Presence system

### Abdul Rehman

* Pong engines (2P, 4P)
* Connect 4 logic
* Gameplay mechanics
* Touch controls

### Santiago

* Tournament architecture
* Matchmaking
* AI opponent
* Statistics system

### Natalia

* Docker & NGINX
* Database schema
* Persistence layer
* Infrastructure setup

---


---
## 📚 Resources

### Classic References
- Fastify Documentation
- Prisma ORM Docs
- SQLite Documentation
- Tailwind CSS v4
- Motion One
- WebSocket RFC 6455

### AI Usage
AI tools were used for:
- Code review assistance
- Refactoring suggestions
- Documentation drafting
All AI-generated content was reviewed, understood, and adapted by the team.

AI tools were used for:

* Code review assistance
* Refactoring suggestions
* Documentation drafting

All AI-generated content was reviewed, understood, and adapted by the team.

---

## 📚 Resources

* Fastify Documentation
* Prisma ORM Docs
* SQLite Documentation
* Tailwind CSS v4
* Motion One
* WebSocket RFC 6455

---


---
## 📝 Notes

* README reflects actual implementation
* No unimplemented modules are claimed
* Project is not yet evaluation-ready (missing 1 point)

---


---
© 2026 — **MINA GAMES** · ft_transcendence · 42 Network
