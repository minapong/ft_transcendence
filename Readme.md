# 🏓 ft_transcendence

## 🧭 Overview
**ft_transcendence** is a full-stack web application inspired by the legendary **Pong** game —  
reimagined with real-time multiplayer, authentication, live chat, blockchain integration, and 3D visuals.  
Built as part of the **42 Network Transcendence project**, this repository includes the complete base setup and modular expansions.

---

## 🧱 BASE (Mandatory Part)
| Team Member | Responsibility | Description |
|--------------|----------------|--------------|
| **Hashir** | SPA Frontend + Tournament / Matchmaking | Builds the TypeScript single-page app, and implements tournament & matchmaking systems. |
| **Natalia** | Docker + HTTPS | Manages Docker environment, NGINX reverse proxy, and SSL/TLS configuration. |
| **Abdul Rehman** | Core Pong Game | Implements the base 2-player local Pong with consistent paddle speed and clean gameplay. |

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

## ⚙️ Tech Stack
- **Frontend:** TypeScript, Tailwind CSS, Babylon.js  
- **Backend:** Node.js + Fastify, SQLite  
- **DevOps:** Docker, NGINX, HTTPS (TLS v1.2/1.3)  
- **Blockchain:** Avalanche + Solidity  
- **Communication:** WebSocket (WSS) for chat and real-time gameplay  

---

## 🌿 Branching Strategy

| Branch | Purpose |
|--------|----------|
| **main** | ✅ **Production / stable branch** — always deployable, clean, and tested. |
| **dev** | Integration branch — new features are merged here before production. |
| **hashir** | SPA frontend, matchmaking, Fastify backend work. |
| **natalia** | Docker, HTTPS, database, blockchain modules. |
| **abdul** | Pong gameplay and multiplayer systems. |

> Only **tested, production-ready code** is merged into `main`.
---

## 📁 Project Structure
```bash
Ft_Transcendence/
├── Frontend/     # SPA (TypeScript + Tailwind + Babylon.js)
├── Backend/      # Fastify backend + SQLite + WSS
├── Docker/       # Docker + NGINX + HTTPS setup
└── README.md     # Root overview (this file)

```
---

🚀 Quick Start

To run the full project:

docker compose up --build

Then open 👉 https://localhost


---

👥 Team

Name	Role

Hashir	Frontend & Architecture Lead
Natalia	DevOps & Security Engineer
Abdul Rehman	Gameplay Developer



---

🧩 Notes

This repository defines the mandatory base and initial modules.

Future modules (AI, 2FA, Analytics, Accessibility, etc.) will be introduced gradually.

All development follows the 42 project constraints:

SPA behavior

HTTPS enforced

Docker one-command execution




---

© 2025 ft_transcendence Team · A 42 Network Project

---
