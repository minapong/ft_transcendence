# 🎮 ft_transcendence – Frontend

## 🧭 Overview
This is the **frontend** of the ft_transcendence project.  
Built as a **Single Page Application (SPA)** using **TypeScript**, with **Tailwind CSS** for styling.  
It must run flawlessly on the latest stable version of **Mozilla Firefox**.

---

## 🧱 Base Responsibilities
- SPA routing with full **Back/Forward navigation** support  
- Core **Pong game interface** (canvas + controls)  
- **Tournament** and **Matchmaking** UI  
- Integration with backend APIs (Fastify)  
- Clean console — no warnings or errors  

---

## ⚙️ Tech Stack
- **TypeScript** – main language  
- **Tailwind CSS** – frontend toolkit *(Minor Module)*  
- **Babylon.js** – 3D graphics for enhanced Pong experience  
- **WebSockets (WSS)** – for real-time gameplay and chat  
- **Docker** – full containerized deployment  

---

## 🧩 Folder Structure
```bash
frontend/
├── src/
│   ├── assets/           # images, icons
│   ├── components/       # UI components
│   ├── pages/            # SPA views (Home, Game, Tournament)
│   ├── game/             # Pong and other games logic
│   ├── styles/           # Tailwind setup
│   ├── utils/            # helpers, constants
│   └── main.tsx          # SPA entry point
│
├── public/
│   └── index.html
│
├── package.json
├── tsconfig.json
└── README.md
````

---

## 🚀 Development

To run locally:

```bash
npm install
npm run dev
```

Then open 👉 **[https://localhost:5173](https://localhost:5173)**
(Use HTTPS even locally for compliance)

---

## 👤 Maintainers

| Name             | Role                                         |
| ---------------- | -------------------------------------------- |
| **Hashir**       | SPA, Tournament, Matchmaking, UI integration |
| **Abdul Rehman** | Pong gameplay logic                          |
| **Natalia**      | Docker & HTTPS configuration                 |
| **Santiago**     | JWT + 2FA & GDPR / Account Deletion          |
---

🧩 *This frontend forms the visual layer of ft_transcendence, integrating directly with the Fastify backend and real-time WebSocket services for gameplay and chat.*

```
