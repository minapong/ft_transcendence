
# 🏓 ft_transcendence

## 🧭 Overview
**ft_transcendence** is a full-stack web application inspired by the legendary **Pong** game —  
reimagined with real-time multiplayer, authentication, live chat, blockchain integration, cybersecurity, and 3D visuals.  
Built as part of the **42 Network Transcendence project**, this repository includes the complete base setup and modular expansions.

---

## 🧱 BASE (Mandatory Part)
| Team Member | Responsibility | Description |
|--------------|----------------|--------------|
| **Hashir** | SPA Structure + Backend (Fastify + Node.js) | Builds the TypeScript single-page app and backend API with Fastify integration. |
| **Natalia** | Docker Setup + SPA Integration | Creates Docker environment, NGINX reverse proxy, and TLS certificates, assisting SPA deployment. |
| **Abdul Rehman** | Core Pong Gameplay | Implements the base 2-player local Pong with equal paddle speed and stable physics. |
| **Santiago** | Tournament & Matchmaking Systems + HTTPS (SSL/TLS)| Develops tournament logic, alias reset, and dynamic matchmaking UI integration. |

---

## 💻 HASHIR – Modules
1️⃣ **Babylon.js 3D Graphics** *(Major)*  
2️⃣ **Fastify with Node.js** *(Major – Backend Framework)*  
3️⃣ **Tailwind CSS** *(Minor – Frontend Styling)*  

---

## 💬 NATALIA – Modules
1️⃣ **Live Chat** *(Major)*  
2️⃣ **User Management + SQLite Database** *(Major + Minor)*  
3️⃣ **Blockchain (Avalanche + Solidity)** *(Major)*  

---

## 🎮 ABDUL REHMAN – Modules
1️⃣ **Multiplayer Pong** *(Major)*  
2️⃣ **Second Game with Matchmaking & History** *(Major)*  

---

## 🧠 SANTIAGO – Modules
1️⃣ **AI Oponent** *(Major)*  
2️⃣ **Dashboard** *(Minor)*  

---

## ✅ Total Progress
- **Base foundation complete** (SPA + Backend + Docker + Gameplay + Tournament).  
- **7+ Major equivalents achieved** → 100% project coverage.  
- **Future modules** (AI, Analytics, Accessibility) will be integrated progressively.  

---

## ⚙️ Tech Stack
- **Frontend:** TypeScript, Tailwind CSS, Babylon.js  
- **Backend:** Node.js + Fastify, SQLite  
- **DevOps:** Docker, NGINX, HTTPS (TLS 1.2/1.3)  
- **Blockchain:** Avalanche + Solidity  
- **Communication:** WebSocket (WSS) for chat and gameplay  

---

## 🌿 Branching Strategy
| Branch | Purpose |
|--------|----------|
| **main** | ✅ Production / Stable release – deployable and tested |
| **dev** | Integration branch for merging all modules before production |
| **hashir** | SPA frontend + backend (Fastify) |
| **natalia** | Docker, HTTPS, blockchain, and database integration |
| **abdul** | Pong gameplay and second game features |
| **santiago** | AI Oponent and Dashboard |

> All Pull Requests merge into `dev` → then into `main` only after review and testing.  

---

## 📁 Project Structure
```bash
src/
├── app/                    # App entry & global setup
│   ├── index.css           # Global styles
│   └── main.tsx            # Root entry, mounts the app
│
├── assets/                 # Imported images, icons, fonts (bundled by Vite)
│   └── a.jpg
│
├── components/             # Reusable building blocks
│   ├── layout/             # Page structure (header, nav, footer, sidebar)
│   │   ├── Header.tsx
│   │   ├── Nav.tsx
│   │   ├── Side.tsx
│   │   └── footer.tsx
│   ├── ui/                 # Small reusable UI parts (buttons, inputs, etc.)
│   │   ├── Buton.tsx
│   │   └── Greeting.tsx
│   └── main.tsx            # (Temp) — consider moving or removing
│
├── layouts/                # Page wrappers combining layout parts
│   └── MainLayout.tsx
│
├── pages/                  # Route-level views
│   ├── contact.tsx
│   ├── index.tsx
│   ├── login.tsx
│   ├── notfound.tsx
│   ├── santiago.tsx
│   └── tournament/         # Feature-specific routes
│       ├── active.tsx
│       └── start.tsx
│
├── reactor/                # Custom JSX/React-like runtime
│   ├── createReactor.md
│   ├── createReactor.tsx
│   ├── index.tsx
│   ├── jsx-dev-runtime.ts
│   ├── jsx.d.ts
│   └── router.tsx
│
└── styles/                 # CSS modules & global style definitions
    └── abc.css

````

---

## 🚀 Quick Start

```bash
docker compose up --build
```
---

## 👥 Team

| 👤 Name          | 🧭 Role                                 |
| :--------------- | :-------------------------------------- |
| **Hashir**       | 🎨 Frontend & Architecture Lead         |
| **Natalia**      | 🐳 DevOps & Security Engineer           |
| **Abdul Rehman** | 🕹️ Gameplay Developer                  |
| **Santiago**     | 🔐 AI & Matchmaking Engineer 			|

---

## 🧩 Notes

* Repository includes both **mandatory base** and **initial modules**.
* All future modules will comply with **SPA**, **HTTPS**, and **Docker one-command** rules.
* Built following **ft_transcendence v16.1** subject compliance.

---

© 2025 ft_transcendence Team · A 42 Network Project