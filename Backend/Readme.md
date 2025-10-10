🖥️ backend/README.md

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
| **2FA + JWT** | Advanced auth (Cybersecurity module) |

---

## ⚙️ Tech Stack
- **Node.js + Fastify** (major module – backend framework)  
- **SQLite** (minor module – database)  
- **TypeScript** (optional for backend)  
- **WebSocket / WSS** (real-time communication)  
- **Dockerized deployment**  

---

## 📁 Folder Structure

backend/ ├─ src/ │   ├─ server.ts              # Fastify entry │   ├─ routes/                # API endpoints │   ├─ services/              # Business logic (chat, game, blockchain) │   ├─ database/              # SQLite setup + queries │   ├─ sockets/               # WSS connections │   ├─ middleware/            # Auth, security filters │   ├─ utils/                 # Helpers, env loaders │   └─ config/                # Env, constants ├─ package.json ├─ .env.example ├─ Dockerfile └─ README.md

---

## 🔐 Environment Variables
Example `.env`:

PORT=443 NODE_ENV=development DB_PATH=./database/db.sqlite JWT_SECRET=your_secret_here SSL_KEY_PATH=./certs/key.pem SSL_CERT_PATH=./certs/cert.pem

---

## 🚀 Development
```bash
npm install
npm run dev

Then visit your HTTPS endpoint: 👉 https://localhost:443


---

👤 Maintainers

Hashir – Fastify API, integration with frontend

Natalia – Docker + HTTPS setup, database config, blockchain logic

Abdul Rehman – Game data API, multiplayer sync endpoints



