# 🎮 ft_transcendence – Frontend

## 🧭 Overview
This is the **frontend** of the ft_transcendence project.  
Built as a **Single Page Application (SPA)** using **TypeScript** (with Tailwind CSS for styling).  
It must run flawlessly on the latest stable version of **Mozilla Firefox**.

---

## 🧱 Base Responsibilities
- SPA routing with full **Back/Forward navigation** support  
- Core **Pong game interface** (canvas + controls)  
- **Tournament** and **Matchmaking** UI  
- Integration with backend APIs (Fastify)  
- Clean console – no warnings or errors  

---

## ⚙️ Tech Stack
- **TypeScript** – main language  
- **Tailwind CSS** – frontend toolkit (minor module)  
- **Babylon.js** – 3D graphics for enhanced Pong experience  
- **WebSockets (WSS)** – for real-time gameplay and chat  
- **Docker** – full containerized deployment  

---

## 🧩 Structure

frontend/ ├─ src/ │   ├─ assets/           # images, icons │   ├─ components/       # UI components │   ├─ pages/            # SPA views (Home, Game, Tournament) │   ├─ game/             # Pong and other games logic │   ├─ styles/           # Tailwind setup │   ├─ utils/            # helpers, constants │   └─ main.tsx          # SPA entry point ├─ public/ │   └─ index.html ├─ package.json ├─ tsconfig.json └─ README.md

---

## 🚀 Development
Run locally:
```bash
npm install
npm run dev

Then open https://localhost:5173
(Use HTTPS even locally for compliance)


---

👤 Maintainers

Hashir – SPA, Tournament, Matchmaking, UI integration

Abdul Rehman – Pong gameplay logic

Natalia – Docker & HTTPS configuration



---

🧩 This frontend must integrate seamlessly with the Fastify backend (Node.js) to ensure real-time multiplayer and chat support
