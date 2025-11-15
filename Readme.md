
# 🏓 ft_transcendence

## 🧭 Overview
**ft_transcendence** is a full-stack web application inspired by the classic **Pong** game,
extended with real-time multiplayer, authentication, live chat, security features,
blockchain experiments, and 3D visuals.

This repository represents a **baseline integrated milestone** of the project.
Core systems are wired together, but the project is **still under active development**
and **not yet considered a production-ready release**.

Built as part of the **42 Network – Transcendence project**.

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

### 💻 Hashir
- **Babylon.js 3D Graphics** *(Major)*
- **Fastify + Node.js Backend** *(Major)*
- **Tailwind CSS Styling** *(Minor)*

### 💬 Natalia
- **Live Chat System** *(Major)*
- **User Management + SQLite** *(Major + Minor)*
- **Blockchain (Avalanche + Solidity)** *(Major)*

### 🎮 Abdul Rehman
- **Multiplayer Pong** *(Major)*
- **Second Game with Matchmaking & History** *(Major)*

### 🧠 Santiago
- **AI Opponent** *(Major)*
- **Dashboard** *(Minor)*

---

## 📊 Project Status

🟡 **Baseline Integrated Milestone**

- Core SPA, backend, Docker, gameplay, and tournament systems are connected.
- Features may be incomplete, experimental, or subject to change.
- APIs, UX, and infrastructure are **not yet finalized**.

This milestone exists to establish a stable reference point for future development.

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
├── Contributing.md        # Development workflow guide
└── Readme.md              # This file
```

---

## 🚀 Quick Start

```bash
docker compose up --build
```

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
* Built following **ft_transcendence v16.1** subject requirements.

---

© 2025 ft_transcendence Team · 42 Network Project
