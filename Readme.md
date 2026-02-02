*This project has been created as part of the 42 curriculum by mhashir, aalkaisi, nmagdano, saherrer.*

---
# 🎮 MINA GAMES — ft_transcendence

## 📌 Table of Contents
- [Description](#-description)
- [Instructions](#-instructions)
    - [Prerequisites](#prerequisites)
    - [Environment Setup](#environment-setup)
    - [Run the Project](#run-the-project)
- [Team Information](#-team-information)
- [Project Management](#-project-management)
- [Technical Stack](#-technical-stack)
- [Database Schema](#-database-schema)
- [Implemented Features](#-implemented-features)
- [Modules](#-modules)
- [Individual Contributions](#-individual-contributions)
- [Resources](#-resources)
- [Notes](#-notes)

## 🧭 Description

**MINA GAMES** is a full-stack, real-time multiplayer web application developed for the **ft_transcendence (v19.x)** project.

The goal of the project is to build a modern online gaming platform that supports multiple users simultaneously, real-time gameplay, tournaments, and persistent player data.
The application currently features classic Pong (2-player, 4-player, and AI modes) and Connect 4 with matchmaking, alongside user accounts, profiles, statistics, and social interactions.

The project emphasizes real-time systems, clean architecture, security, and collaborative development.

---
## 🚀 Instructions

### Prerequisites
- Docker & Docker Compose
- Make
- Google Chrome (latest stable)

---

### Environment Setup
Create the following files:

#### Backend (`Backend/.env`)
```env
NODE_ENV=development
DATABASE_URL=file:./database/transcendence.db
JWT_SECRET=change_me
```


---

### Run the Project
```bash
make
```
This command launches:
- Fastify backend
- Frontend SPA
- SQLite database
- NGINX reverse proxy
- Seeds the database with default users

All services are started using Docker with a single command.



---
## 👥 Team Information

### mhashir — Malik Hashir
**Roles:** Product Owner (PO), Project Manager (PM), Developer
**Responsibilities:**
Defined the overall product vision and roadmap. Designed the task structure and divided responsibilities between frontend and backend. Coordinated feature priorities, validated completed work, and contributed to both frontend architecture and backend core logic. Led technical direction and ensured coherent project growth.

---

### aalkaisi — Abdul Rahman
**Roles:** Scrum Master, Developer
**Responsibilities:**
Ensured smooth team coordination and meeting flow, resolved blockers and conflicts, and supported delivery alignment. Designed and implemented the core game engines for Pong and Connect 4, including gameplay mechanics and real-time behavior.

---

### nmagdano — Natalia
**Roles:** Technical Lead/Architect Lead, Developer
**Responsibilities:**
Designed backend architecture and infrastructure. Set up Docker, NGINX, and the CI/CD pipeline. Implemented user management using Fastify and Prisma, including authentication, database schema, and persistence logic.

---

### saherrer — Santiago
**Roles:** Technical Lead/Architect Lead, Developer
**Responsibilities:**
Engineered the tournament system and matchmaking logic. Designed and implemented the statistics dashboard with proper data modeling using Prisma repositories. Developed backend routes and ensured semantic correctness and consistency across competitive systems.

---


---
## 📋 Project Management

The team followed a structured and pragmatic project management approach focused on clear task ownership, continuous collaboration, and frequent communication.

### Work Organization

Tasks were broken down into small, well-defined units and assigned to specific team members to avoid overlap and ambiguity. Each feature or module had a clear owner responsible for implementation, testing, and integration. Progress was reviewed continuously, and responsibilities were adjusted when needed to maintain momentum.

Regular coordination meetings were held to:
- Review project progress
- Identify blockers and risks
- Align on technical and design decisions
- Plan upcoming work and priorities

### Tools Used

#### ClickUp
Used as the primary project management tool for:
- Task creation and assignment
- Clear separation of responsibilities
- Tracking progress and completion status
- Maintaining visibility over parallel work streams

#### GitHub
Used for version control and collaborative development:
- Feature-based branching workflow
- Continuous integration via Pull Requests
- More than 70 Pull Requests used to review, discuss, and merge changes
- Peer review enforced before merging into shared branches

### Communication

#### WhatsApp
Initially used for quick coordination, daily updates, and early project discussions.

#### Telegram
Later adopted for better structure and scalability:
- Dedicated channels for announcements, development discussions, and coordination
- Clear separation between general communication and technical topics
- Faster asynchronous communication across the team

This workflow ensured transparency, accountability, and steady progress throughout the project lifecycle.

---


---
## 🧱 Technical Stack

### Frontend Technologies & Frameworks

* **Language:** TypeScript
* **Build Tool:** Vite
* **Styling System:** Tailwind CSS v4 with a custom design token architecture
* **Animation:** Motion One
* **Frontend Architecture:** **Reactor** — a custom-built frontend library developed specifically for this project

**Reactor** provides:

* A JSX runtime
* Hook-based state and lifecycle management
* Client-side routing with transitions
* Modal and layout orchestration
* Deterministic rendering without a Virtual DOM

#### Justification (Frontend)

This project involves **real-time games**, **state-heavy UI**, and **dynamic layouts** that require precise control over rendering order, lifecycle execution, and state propagation.

Mainstream frameworks abstract these mechanisms behind schedulers, Virtual DOM layers, and internal heuristics, which makes execution flow difficult to reason about and defend during evaluation.

Reactor was intentionally built for this project to:

* Expose the **entire SPA rendering pipeline**
* Eliminate hidden behavior (no Virtual DOM, no Fiber, no background schedulers)
* Guarantee **deterministic lifecycle execution**
* Ensure all frontend behavior is fully understood, explainable, and debuggable

This directly aligns with the ft_transcendence objective of demonstrating **mastery over tooling rather than dependency usage**, while still delivering a production-grade user interface.

---

### Backend Technologies & Frameworks

* **Language:** TypeScript (compiled to Node.js)
* **Framework:** Fastify
* **Real-time Communication:** WebSockets (Fastify WebSocket)
* **Authentication:** JWT (Fastify JWT)
* **Security:** crypto for password  hashing & avatar images hashing
* **File Handling:** Fastify Multipart & Static

#### Justification (Backend)

Fastify was chosen for its high performance, low overhead, and explicit plugin system, making it suitable for real-time multiplayer workloads.
WebSockets enable low-latency synchronization for gameplay, matchmaking, tournaments, and presence tracking.
JWT provides a stateless and scalable authentication mechanism appropriate for multi-user systems.

---

### Database System

* **Database Engine:** SQLite
* **ORM:** Prisma
* **Driver:** better-sqlite3

#### Justification (Database)

SQLite was selected for its reliability, simplicity, and ease of deployment within Docker, while still supporting relational integrity and transactional safety.
Prisma provides a strongly-typed schema, migrations, and query safety, reducing runtime errors and improving long-term maintainability.

This combination ensures predictable behavior across development, testing, and evaluation environments.

---

### Other Significant Technologies

* **Docker & Docker Compose:** Full containerized environment with single-command startup
* **NGINX:** Reverse proxy for frontend and backend services
* **Prisma Migrations & Seeding:** Automated schema evolution and demo data population
* **Custom Game Engines:** Pong (2P, 4P, AI) and Connect 4 implemented from scratch
* **Presence System:** Real-time online/offline user tracking

---

### Overall Technical Justification

All major technical choices prioritize:

* Deterministic behavior over abstraction
* Explainability over convenience
* Real-time correctness over hidden automation

The stack was deliberately selected and implemented to ensure every system—frontend, backend, database, and infrastructure—can be fully defended during evaluation and clearly understood by all team members.

---


---
## 🗄️ Database Schema

### Main Tables
- `users`
- `friends`
- `avatars`
- `matches`
- `match_players`
- `tournaments`
- `tournament_matches`
- `stats_user`

### Relationships
- **Users ↔ Matches:** Many-to-many
- **Tournaments ↔ Matches:** One-to-many
- **User ↔ StatsUser:** One-to-one
- **User ↔ Friend:** One-to-one

### Data Integrity
- **Cascade deletes** for ownership-bound entities.
- **SetNull** for historical references (winners, selected avatars).
---


---
## ✅ Implemented Features

### 🛠️ Core Infrastructure
*   **Custom Frontend Framework (Reactor)**
    *   **Functionality:** A custom JSX-based SPA framework with hook-based state/lifecycle management (`useState`, `useEffect`), file-based routing, and a deterministic rendering pipeline without a Virtual DOM.
    *   **Owner:** Malik (`mhashir`)
*   **Global Modal System**
    *   **Functionality:** Framework-level modal infrastructure featuring renderer registration, focus trapping, accessibility guarantees, and lifecycle isolation for complex UI flows.
    *   **Owner:** Malik (`mhashir`)
*   **Infrastructure & DevOps**
    *   **Functionality:** Fully containerized setup using Docker and Docker Compose, NGINX reverse proxy, and automated database migrations/seeding via Prisma.
    *   **Owner:** Natalia (`nmagdano`)

### 🔐 Authentication & Social
*   **Secure Authentication**
    *   **Functionality:** User signup, login/logout, and session management using JWT and crypto password hashing.
    *   **Owner:** Natalia (`nmagdano`)
*   **Real-Time Presence**
    *   **Functionality:** WebSocket-powered status tracking; displays real-time online/offline status indicators across the platform.
    *   **Owner:** Natalia (`nmagdano`)
*   **Social & Friends System**
    *   **Functionality:** Search users, send/receive friend requests, manage a friend list, and update personal profiles with avatar uploads.
    *   **Owners:** Natalia (`nmagdano`), Malik Hashir (`mhashir`)

### 🕹️ Games & AI
*   **Pong Engine (2P, 4P, AI)**
    *   **Functionality:** Custom physics-based engine supporting classic 2-player mode, a 4-player 2v2 "Squad" mode, and AI opponents with three difficulty tiers. Includes touch controls and pause/resume.
    *   **Owner:** Abdul Rahman (`aalkaisi`)
*   **Connect 4 & Matchmaking**
    *   **Functionality:** Turn-based strategy game with automated win-state detection, paired with a database-backed real-time matchmaking queue.
    *   **Owners:** Abdul Rahman (`aalkaisi`), Santiago (`saherrer`)
*   **Tournament System**
    *   **Functionality:** Complete tournament management for 4-8 players, featuring automatic bracket generation, player registrations, and admin-led round progression.
    *   **Owner:** Santiago (`saherrer`)

### 📊 Competitive Systems
*   **Global Leaderboards & Stats**
    *   **Functionality:** Real-time ranking of top players, searchable match history, and detailed per-user win/loss analytics.
    *   **Owner:** Santiago (`saherrer`)
*   **Gamification & Achievements**
    *   **Functionality:** A persistent achievement system tracking milestones and unlocking badges based on player performance and community interactions.
    *   **Owner:** Santiago (`saherrer`)

---


---
## 🧩 Modules

| Module | Type | Points | Owner(s) | Implementation |
| :--- | :--- | :--- | :--- | :--- |
| Custom Frontend Framework (Reactor) | Major | 2 | mhashir | Built for SPA lifecycle demo |
| User Management | Major | 2 | mhashir, nmagdano | Auth, profiles, presence, friends |
| Web-based Game (Pong) | Major | 2 | aalkaisi | Multiplayer, 4P, AI |
| Multiplayer Game (4P Pong) | Major | 2 | aalkaisi | 2v2, four paddles |
| Second Game (Connect 4) | Major | 2 | aalkaisi | Matchmaking, win detection |
| AI Opponent | Major | 2 | saherrer | AI for Pong, Connect 4 |
| Backend Framework (Fastify) | Minor | 1 | mhashir | Fast, explicit, allowed |
| Tournament System | Minor | 1 | saherrer | Bracket, registration, winner |
| Game Statistics | Minor | 1 | saherrer | Leaderboard, match history |
| Custom Design System | Minor | 1 | mhashir | Custom UI and design tokens |
| Modal System | Minor | 1 | mhashir | Framework-level infrastructure |
| Gamification System | Minor | 1 | saherrer | Achievements, badges, XP |
| Support for Additional Browsers | Minor | 1 | saherrer | Chrome, Brave, Chromium |
| Database Persistence & ORM | Minor | 1 | nmagdano | Type-safe schema via Prisma |

**Total:** 20 / 14 points

---

## 🧩 Module Justification & Implementation

This section explains **why each module was chosen** and **how it was implemented**.
Module names reflect **implementation-level naming**, while mapping directly to equivalent ft_transcendence v19.x categories and point values.

---

## 🟦 Major Modules (2 Points Each)

---

### Custom Frontend Framework (**Reactor**) — *Module of Choice*

**Why this module was chosen**

This project required deep control over rendering order, lifecycle execution, routing, and state propagation due to **real-time games**, **state-heavy UI**, and **dynamic layouts**.

Mainstream frontend frameworks abstract these mechanisms behind Virtual DOM layers, schedulers, and internal heuristics, which makes execution behavior difficult to reason about and defend during evaluation.

Reactor was chosen as a custom major module to demonstrate full architectural ownership and mastery over SPA internals rather than dependency usage.

**How it was implemented**

Reactor was built from scratch and includes:

* A custom JSX runtime with direct DOM reconciliation
* Hook-based state and lifecycle system (`useState`, `useEffect`)
* Deterministic rendering (no Virtual DOM, no Fiber, no background schedulers)
* Client-side routing with transition control
* Framework-level modal and layout orchestration

All rendering and lifecycle behavior is explicit, deterministic, and fully explainable line by line.

---

### User Management

**Why this module was chosen**

Multi-user support is mandatory for ft_transcendence.
User management is foundational for authentication, social features, statistics, matchmaking, and tournaments.

**How it was implemented**

* Secure signup and login using JWT
* Password hashing with crypto
* User profiles with editable metadata
* Avatar upload with default fallbacks
* Friends system with persistent relationships
* Real-time online/offline presence via WebSockets

All logic is implemented using Fastify services and Prisma repositories.

---

### Web-Based Game — Pong

**Why this module was chosen**

Gaming is a core evaluation axis of ft_transcendence, and Pong is a canonical real-time multiplayer reference.

**How it was implemented**

* Custom physics engine written from scratch
* Deterministic ball movement and paddle collision logic
* Real-time input handling
* Win/loss detection and score tracking
* Integration with backend match records and statistics

No external game engine or physics library was used.

---

### Multiplayer Game — 4 Player Pong

**Why this module was chosen**

Supporting more than two players demonstrates increased synchronization complexity and fairness constraints.

**How it was implemented**

* 4-player 2v2 arena with four paddles
* Shared authoritative game state
* Equalized movement rules for all players
* Real-time synchronization across all clients

This mode extends the base Pong engine with additional state handling.

---

### Second Game — Connect 4

**Why this module was chosen**

The subject explicitly rewards adding a second, distinct game to demonstrate platform extensibility.

**How it was implemented**

* Turn-based grid logic implemented from scratch
* Win-state detection (horizontal, vertical, diagonal)
* Database-backed matchmaking queue
* Persistent match history and statistics

The game reuses shared authentication, matchmaking, and stats infrastructure.

---

### AI Opponent

**Why this module was chosen**

Artificial Intelligence is a major evaluation category and complements competitive gameplay.

**How it was implemented**

* Rule-based AI logic for Pong and Connect 4
* Predictive ball tracking for Pong AI
* Difficulty tiers with controlled reaction delays
* AI follows the same rules and constraints as human players

The AI is capable of winning matches and behaves non-deterministically within defined bounds.

---

## 🟨 Minor Modules (1 Point Each)

---

### Backend Framework — Fastify

**Why this module was chosen**

Fastify is explicitly allowed and provides high performance with minimal overhead, suitable for real-time systems.

**How it was implemented**

* REST APIs for authentication, profiles, friends, stats, and tournaments
* WebSocket endpoints for presence and gameplay
* Middleware-based validation and security
* Modular service and repository architecture

---

### Tournament System

**Why this module was chosen**

Tournaments extend competitive gameplay and require structured orchestration.

**How it was implemented**

* Player registration system
* Automatic bracket generation
* Match progression tracking
* Admin-controlled round advancement
* Persistent tournament records

---

### Game Statistics

**Why this module was chosen**

Persistent statistics validate competitive systems and long-term user engagement.

**How it was implemented**

* Match result storage per user
* Win/loss tracking
* Global leaderboards
* Searchable match history

---

### Custom Design System

**Why this module was chosen**

A consistent and scalable UI was required across games, dashboards, and modals.

**How it was implemented**

* Tailwind CSS v4 with custom tokens (colors, spacing, motion)
* Reusable UI components (buttons, inputs, cards, avatars)
* Centralized styling conventions across the app

---

### Modal System

**Why this module was chosen**

Complex UI flows require controlled overlays with isolated lifecycles.

**How it was implemented**

* Framework-level modal registry
* Isolated render trees
* Safe mount/unmount lifecycles
* Keyboard and focus management

---

### Gamification System

**Why this module was chosen**

Gamification increases engagement and demonstrates persistent reward logic.

**How it was implemented**

* Achievement tracking stored in the database
* Badge unlocking rules
* XP and level progression
* Visual feedback through notifications and profile views

---

### Support for Additional Browsers

**Why this module was chosen**

The subject rewards compatibility beyond a single browser.

**How it was implemented**

* Tested and validated on Chrome, Brave, and Chromium
* Fixed layout and rendering inconsistencies
* Ensured consistent gameplay and UI behavior

---

### Database Persistence & ORM

**Why this module was chosen**

Reliable persistence is required for users, games, tournaments, and statistics.

**How it was implemented**

* Prisma schema defining all relations
* SQLite database for deterministic deployment
* Automated migrations and seeding
* Type-safe queries using Prisma Client

---

## 🔚 Final Note on Module Choices

All modules were selected to:

* Build coherently on top of each other
* Avoid superficial or overlapping features
* Demonstrate real technical complexity
* Remain fully explainable during evaluation

No module is claimed without a complete, functional implementation.
---


---
## 👤 Individual Contributions

This section provides a detailed breakdown of each team member’s contributions, including specific features, modules, components, and challenges encountered during development.

### mhashir — Malik Hashir
**Primary Roles:** Product Owner, Project Manager, Developer

**Key Contributions:**
- Defined the overall product vision and roadmap
- Designed the frontend architecture and global application structure
- Built the custom frontend framework (Reactor), including:
    - JSX runtime
    - Hook-based state and lifecycle management
    - Client-side routing system
    - Deterministic rendering pipeline
- Implemented the global modal system and layout orchestration
- Contributed to backend foundations and shared utilities
- Participated in feature planning, prioritization, and validation

**Challenges & Solutions:**
- **Challenge:** Managing complex UI state for real-time games without relying on opaque framework internals
- **Solution:** Designed Reactor with explicit lifecycle control and deterministic rendering
- **Challenge:** Coordinating multiple parallel development streams
- **Solution:** Enforced clear task ownership and continuous validation of integrated features

---

### aalkaisi — Abdul Rehman
**Primary Roles:** Scrum Master, Developer

**Key Contributions:**
- Designed and implemented the Pong game engine, including:
    - 2-player mode
    - 4-player (2v2) multiplayer mode
    - Touch and keyboard controls
- Implemented the Connect 4 game logic, including:
    - Grid handling
    - Turn management
    - Win-condition detection
- Ensured gameplay correctness, fairness, and responsiveness
- Facilitated sprint coordination and removed development blockers

**Challenges & Solutions:**
- **Challenge:** Synchronizing real-time gameplay across multiple players
- **Solution:** Built deterministic game logic with controlled state updates
- **Challenge:** Supporting different input methods (keyboard, touch)
- **Solution:** Abstracted input handling to ensure consistent gameplay behavior

---

### saherrer — Santiago
**Primary Roles:** Technical Lead, Developer

**Key Contributions:**
- Designed and implemented the tournament system, including:
    - Player registration
    - Automatic bracket generation
    - Match progression logic
- Built the matchmaking system for competitive games
- Developed the AI opponent for Pong and Connect 4
- Implemented game statistics and leaderboards
- Ensured consistency and correctness of competitive systems

**Challenges & Solutions:**
- **Challenge:** Designing AI that is challenging but not unbeatable
- **Solution:** Implemented predictive but constrained decision logic with adjustable difficulty
- **Challenge:** Maintaining data integrity across tournaments and matches
- **Solution:** Structured Prisma repositories with clear ownership and relations

---

### nmagdano — Natalia
**Primary Roles:** Technical Lead / Architect, Developer

**Key Contributions:**
- Designed the backend architecture using Fastify
- Implemented authentication and user management
- Designed and maintained the database schema with Prisma
- Set up Docker, Docker Compose, and NGINX
- Implemented database migrations, seeding, and persistence logic
- Ensured infrastructure stability and deployment reproducibility

**Challenges & Solutions:**
- **Challenge:** Ensuring consistent environments across development and evaluation
- **Solution:** Fully containerized the project with single-command startup
- **Challenge:** Maintaining schema correctness during rapid feature iteration
- **Solution:** Used Prisma migrations and strict typing to prevent regressions

---


---
## 📚 Resources

### Technical References
- Fastify Documentation
- Prisma ORM Documentation
- SQLite Documentation
- Tailwind CSS v4 Documentation
- WebSocket RFC 6455

### AI Usage
AI tools were used during development for:
- Code review assistance
- Refactoring suggestions
- Documentation drafting and structuring

All AI-generated output was reviewed, understood, and adapted by the team.
No code or documentation was included without full comprehension and ownership by the developers.

---


---
## 📝 Notes

* README reflects actual implementation
* No unimplemented modules are claimed
* Project is not yet evaluation-ready (missing 1 point)

---


---
© 2026 — **MINA GAMES** · ft_transcendence · 42 Network
