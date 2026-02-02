# Features List

Direct map of what we actually built. If it's here, it's testable.

---

## ✅ Implemented Features

### 🛠️ Core Infrastructure
- **Custom Frontend Framework (Reactor)** — JSX-based SPA framework with hook-based state/lifecycle management and deterministic rendering. (Owner: Malik)
- **Global Modal System** — Framework-level modal infrastructure with accessibility focus and lifecycle isolation. (Owner: Malik)
- **Infrastructure & DevOps** — Docker Compose, NGINX reverse proxy, and Prisma-backed migrations/seeding. (Owner: Natalia)

### 🔐 Authentication & Social
- **Secure Authentication** — JWT sessions + Bcrypt hashing. Covers signup, login, and secure logout. (Owner: Natalia)
- **Real-Time Presence** — WebSocket status stream; see who's online/offline instantly. (Owner: Natalia)
- **Social & Friends System** — Handle friend requests, manage lists, and profile settings (including avatar uploads). (Owners: Natalia, Malik)

### 🕹️ Games & AI
- **Pong Engine (2P, 4P, AI)** — Custom physics engine for classic 2P, 4P (2v2 Squads), and AI with multiple difficulty levels. (Owner: Abdul Rehman)
- **Connect 4 & Matchmaking** — Turn-based logic with a real-time matchmaking queue. (Owners: Abdul Rehman, Santiago)
- **Tournament System** — 4-8 player tournament management with auto-brackets and admin progression. (Owner: Santiago)

### 📊 Competitive Systems
- **Global Leaderboards & Stats** — Real-time rankings, match history, and win/loss analytics. (Owner: Santiago)
- **Gamification & Achievements** — Persistent milestone tracking and badge unlocks. (Owner: Santiago)

---

## 👋 Post-Evaluation / Planned

These were deprioritized to focus on code quality and engine stability:
- **Live chat** (Using presence system instead)
- **Game invites** (Using public matchmaking instead)
- **OAuth** (Manual auth prioritized for security mastery)
