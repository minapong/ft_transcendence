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
