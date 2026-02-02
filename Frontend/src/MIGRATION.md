# Frontend Structure Migration (January 24, 2026)

## Why This Migration?

The previous structure had:
- Flat file organization making it hard to find things
- Mixed concerns (UI and logic in same directories)
- No clear "where do I put this?" answer

---

## What Moved Where

### Before → After

```
src/                          src/
├── pages/           →        ├── app/pages/
├── components/      →        │   ├── components/
├── hooks/           →        │   ├── hooks/
├── engine/          →        ├── core/engine/
├── Reactor/         →        │   ├── Reactor/
├── lib/             →        │   └── lib/
├── styles/                   ├── styles/
└── assets/                   └── assets/
```

### Detailed Moves

| Old Path | New Path |
|----------|----------|
| `src/pages/*.tsx` | `src/app/pages/**/*.tsx` |
| `src/components/` | `src/app/components/` |
| `src/hooks/` | `src/app/hooks/` |
| `src/engine/` | `src/core/engine/` |
| `src/Reactor/` | `src/core/Reactor/` |
| `src/lib/` | `src/core/lib/` |

### Pages Reorganized by Domain

| Old | New |
|-----|-----|
| `pages/login.tsx` | `pages/auth/[mode].tsx` (login/signup via `mode`) |
| `pages/signup.tsx` | `pages/auth/[mode].tsx` |
| `pages/pong.tsx` | `pages/game/pong.tsx` |
| `pages/4p_pong.tsx` | `pages/game/4p_pong.tsx` |
| `pages/connect4.tsx` | `pages/game/connect4.tsx` |
| `pages/connect4_single.tsx` | `pages/game/connect4_single.tsx` |
| `pages/me.tsx` | `pages/user/me.tsx` |
| `pages/profile.tsx` | `pages/user/[id].tsx` (dynamic route) |
| `pages/tournament/` | `pages/tournament/` (unchanged) |

---

## Dynamic Routing

The router supports **file-based dynamic routes** using `[param]` convention:

```
pages/user/[id].tsx      → matches /user/123, /user/abc
pages/post/[slug]/edit.tsx → matches /post/hello-world/edit
```

Matched params are passed as props to the component.

---

## Import Path Changes

### Old → New

```tsx
// Old
import { apiFetch } from "@/lib/api";
import { getAuth } from "@/lib/auth";
import { pongLogic } from "../engine/pong_logic";

// New
import { apiFetch } from "@/core/lib/api";
import { getAuth } from "@/core/lib/auth";
import { pongLogic } from "@/core/engine/pong_logic";
```

### Aliases Updated

Configured in `tsconfig.json` and `vite.config.ts`:

| Alias | Target |
|-------|--------|
| `@/*` | `src/*` |
| `@/app/*` | `src/app/*` |
| `@/core/*` | `src/core/*` |
| `Reactor` | `src/core/Reactor` |
| `components` | `src/app/components` |
| `pages` | `src/app/pages` |

---

## Route Changes

Routes are auto-generated from file paths. Notable changes:

| Old Route | New Route |
|-----------|-----------|
| `/login` | `/auth/login` |
| `/signup` | `/auth/signup` |
| `/pong` | `/game/pong` |
| `/connect4` | `/game/connect4` |
| `/connect4_single` | `/game/connect4_single` |
| `/me` | `/user/me` |
| `/profile/:id` | `/user/:id` |

---

## File Renames

| Old Name | New Name | Reason |
|----------|----------|--------|
| `Buton.tsx` | `Button.tsx` | Typo fix |

---

## The New Mental Model

```
src/
├── app/        # Things users SEE and TOUCH
│   ├── pages/      # Routes (organized by domain)
│   ├── components/ # Reusable UI
│   └── hooks/      # App-specific hooks
│
├── core/       # Things users DON'T see
│   ├── engine/     # Game logic
│   ├── Reactor/    # JSX framework
│   └── lib/        # API, auth, utilities
│
├── styles/     # Global CSS
└── assets/     # Static files
```

**Rule of thumb:**
- Adding a page? → `app/pages/{domain}/`
- Adding UI? → `app/components/`
- Adding game logic? → `core/engine/`
- Adding utility? → `core/lib/`

---

## Known Technical Debt

Engine files (`core/engine/*.ts`) still access DOM directly via `document.getElementById()`.

**Future refactor needed** to separate state from rendering for:
- AI training
- Replay system
- Multiplayer sync

Documented in `core/README.md`.

---

## Quick Reference

```bash
# Find a page
ls src/app/pages/

# Find game logic
ls src/core/engine/

# Find API utilities
ls src/core/lib/
```
