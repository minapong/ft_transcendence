# 🎮 ft_transcendence – Frontend

## 🧭 Overview
This is the **frontend** of the ft_transcendence project.  
Built as a **Single Page Application (SPA)** using **TypeScript**, with **Tailwind CSS** for styling.  
It targets the latest stable **Mozilla Firefox**.

---

## 🧱 Base Responsibilities
- SPA routing with **Back/Forward navigation**  
- Core **Pong** and **Connect4** game screens  
- **Tournament** and **Matchmaking** UI (HTTP-based)  
- Integration with backend APIs (Fastify + JWT)  
- Clean console — no warnings or errors  

---

## ⚙️ Tech Stack
- **TypeScript** – main language  
- **Tailwind CSS** – frontend toolkit *(Minor Module)*  
- **Reactor** – custom SPA runtime  
- **Docker** – full containerized deployment  

Planned/Optional:
- **Babylon.js** – enhanced visuals (planned)
- **WebSockets (WSS)** – realtime gameplay/chat (planned)

---

## 🧩 Folder Structure
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

## 🚀 Development

To run locally:

```bash
npm install
npm run dev
```

Then open 👉 **[https://localhost:5173](https://localhost:5173)**
(Use HTTPS locally if required by your setup)

---

## 👤 Maintainers

| Name             | Role                                         |
| ---------------- | -------------------------------------------- |
| **Hashir**       | SPA, Tournament, Matchmaking, UI integration |
| **Abdul Rehman** | Pong gameplay logic                          |
| **Natalia**      | Docker & HTTPS configuration                 |
| **Santiago**     | JWT + 2FA & GDPR / Account Deletion          |
---

🧩 *This frontend forms the visual layer of ft_transcendence, integrating directly with the Fastify backend and planned real-time WebSocket services for gameplay and chat.*

## 🔔 Changelog
- v2.0.0 — Added login page and JWT wiring, dashboard skeleton (leaderboard/history consuming stats routes), and tournament/pong integration (client-side).

```
