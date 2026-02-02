# App Directory

This directory contains the user-facing UI: pages, components, hooks, and the app entry.

## Structure

```
app/
├── pages/                  # Route-based pages
│   ├── auth/[mode].tsx     # /auth/login, /auth/signup
│   ├── game/               # Pong / 4P / AI / Connect4
│   ├── tournament/         # /tournament/start, /tournament/active
│   ├── user/               # /user/me, /user/[id], /user/settings
│   ├── dashboard.tsx
│   ├── contact.tsx
│   ├── dance.tsx
│   ├── privacy_policy.tsx
│   ├── terms_of_service.tsx
│   ├── modal.tsx
│   ├── index.tsx
│   └── NotFound.tsx
├── components/             # Reusable UI
│   ├── layout/             # Header, Sidebar, RootLayout
│   ├── ui/                 # Buttons, inputs, etc.
│   └── game/               # Game-specific UI
├── hooks/                  # App-specific hooks
├── modals.tsx              # Modal registrations
├── main.tsx                # App entry point
└── global.css              # Global styles import
```

## Routing

Routes are file-based. The router in `src/core/Reactor/features/router/routes.tsx` auto-discovers pages:

- `/src/app/pages/auth/[mode].tsx` → `/auth/:mode`
- `/src/app/pages/game/pong.tsx` → `/game/pong`
- `/src/app/pages/dashboard.tsx` → `/dashboard`
- `/src/app/pages/index.tsx` → `/`

**To add a new page:**
1. Create a `.tsx` file under `pages/`
2. Export a default function component
3. The route is registered automatically

## Navigation

Use the `navigate()` function from Reactor:

```tsx
import { navigate } from "Reactor";

navigate("/game/pong", { state: { mode: "2p", p1: "Alice", p2: "Bob" } });
```

## Component Placement

- Reusable across pages → `components/ui/`
- Layout-specific → `components/layout/`
- Game-specific → `components/game/`
