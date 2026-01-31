# App Directory

This directory contains everything users see and interact with.

## Structure

```
app/
├── pages/          # Route-based page components
│   ├── auth/       # Login, signup flows
│   ├── game/       # Pong, Connect4 game views
│   ├── tournament/ # Tournament start/active views
│   ├── user/       # Profile, settings
│   ├── dashboard.tsx
│   └── NotFound.tsx
├── components/     # Reusable UI pieces
│   ├── layout/     # Header, Sidebar, RootLayout
│   └── ui/         # Buttons, inputs, etc.
├── hooks/          # App-specific Reactor hooks
├── main.tsx        # App entry point
└── global.css      # Global styles import
```

## Routing

Routes are **file-based**. The router in `core/Reactor/router/routes.tsx` auto-discovers pages:

- `/src/app/pages/auth/login.tsx` → `/auth/login`
- `/src/app/pages/game/pong.tsx` → `/game/pong`
- `/src/app/pages/dashboard.tsx` → `/dashboard`
- `/src/app/pages/index.tsx` → `/`

**To add a new page:**
1. Create a `.tsx` file in the appropriate `pages/` subdomain
2. Export a default function component
3. Done — route is auto-registered

## Layout Rules

1. **Layout components** (`layout/`) do NOT import pages
2. **Pages** do NOT control global layout state directly
3. Pages receive layout context via props or hooks
4. `RootLayout.tsx` wraps all pages with Header + Sidebar

## Navigation

Use the `navigate()` function from Reactor:

```tsx
import { navigate } from "Reactor";

navigate("/game/pong", { state: { mode: "2p", p1: "Alice", p2: "Bob" } });
```

## Adding Components

- **Reusable across pages?** → `components/ui/`
- **Layout-specific?** → `components/layout/`
- **Page-specific?** → Keep in the page file or create a local `_components/` folder
