# ⚙️ ft_transcendence – Backend

## 🧭 Overview
This is the **backend** for the ft_transcendence project.  
It provides all API routes, authentication logic, and real-time services (chat, multiplayer, blockchain integration).

Initially, it serves the **mandatory base** (SPA hosting, Pong data, HTTPS),  
and later scales into **module integrations** such as:
- User Management  
- Live Chat  
- Blockchain (Avalanche)  
- AI / Multiplayer services  

---
## 🧱 Base Responsibilities
- Serve frontend SPA content via HTTPS  
- Provide secure WebSocket (WSS) connection  
- Manage tournament and matchmaking data  
- Ensure environment variables are used for secrets  
- No unhandled errors or insecure endpoints  

---

## 🧩 Modules Built on Top
| Module | Description |
|--------|-------------|
| **User Management** | Authentication, profile system, avatar uploads |
| **Live Chat** | Real-time messaging using WSS |
| **Blockchain** | Tournament scores stored on Avalanche via Solidity smart contracts |
| **Multiplayer** | Socket-based real-time gameplay sync |

---

## ⚙️ Tech Stack
- **Node.js + Fastify** – *(Major Module: Backend Framework)*  
- **SQLite** – *(Minor Module: Database)*  
- **TypeScript** – optional for backend logic  
- **WebSocket (WSS)** – real-time communication layer  
- **Dockerized deployment** – production-ready setup  

---

## 🚀 Development

To run locally:

```bash
npm install
npm run dev
```

---


## 👤 Maintainers

| Name             | Role                                         |
| ---------------- | -------------------------------------------- |
| **Hashir**       | SPA,  UI integration |
| **Abdul Rehman** | Pong gameplay logic                            |
| **Natalia**      | Docker & HTTPS configuration                   |
| **Santiago**     | Tournament, Matchmaking, AI Oponent, Dashboard |
---




🧩 *This backend serves as the secure core of ft_transcendence, powering real-time features, authentication, and blockchain integrations while maintaining strict compliance with HTTPS and Docker deployment requirements.*

 