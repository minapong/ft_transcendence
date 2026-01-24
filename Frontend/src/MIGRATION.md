# Frontend Structure Migration (January 24, 2026)

## Why This Migration?

The previous structure had:
- Flat file organization making it hard to find things
- Mixed concerns (UI and logic in same directories)
- No clear "where do I put this?" answer

**Goal:** A new dev answers "where do I edit?" in 3 seconds.

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
| `pages/login.tsx` | `pages/auth/login.tsx` |
| `pages/signup.tsx` | `pages/auth/signup.tsx` |
| `pages/pong.tsx` | `pages/game/pong.tsx` |
| `pages/4p_pong.tsx` | `pages/game/4p_pong.tsx` |
| `pages/connect4.tsx` | `pages/game/connect4.tsx` |
| `pages/connect4_single.tsx` | `pages/game/connect4_single.tsx` |
| `pages/single_game.tsx` | `pages/game/single_game.tsx` |
| `pages/me.tsx` | `pages/user/me.tsx` |
| `pages/profile.tsx` | `pages/user/[id].tsx` (dynamic route) |
| `pages/tournament/` | `pages/tournament/` (unchanged) |

---

## Dynamic Routing

The router now supports **file-based dynamic routes** using `[param]` convention:

### Convention

```
pages/user/[id].tsx      → matches /user/123, /user/abc
pages/post/[slug]/edit.tsx → matches /post/hello-world/edit
```

### How It Works

1. Files with `[param]` in name become dynamic routes
2. Router converts `[id]` → regex capture group `([^/]+)`
3. Matched params are passed as props to the component

### Example

```tsx
// pages/user/[id].tsx
export default function UserPage({ id }: { id: string }) {
  // id = "123" when visiting /user/123
  return <div>User: {id}</div>;
}
```

### Adding a New Dynamic Route

1. Create file: `pages/post/[slug].tsx`
2. Accept params: `export default function Post({ slug }) { ... }`
3. Done — `/post/anything` now works

**No router edits needed.**

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

In `tsconfig.json` and `vite.config.ts`:

| Alias | Old Target | New Target |
|-------|------------|------------|
| `@/*` | `src/*` | `src/*` (unchanged) |
| `@/app/*` | — | `src/app/*` (new) |
| `@/core/*` | — | `src/core/*` (new) |
| `Reactor` | `src/Reactor` | `src/core/Reactor` |
| `components` | `src/components` | `src/app/components` |
| `pages` | `src/pages` | `src/app/pages` |

---

## Route Changes

Routes are auto-generated from file paths. New routes:

| Old Route | New Route |
|-----------|-----------|
| `/login` | `/auth/login` |
| `/signup` | `/auth/signup` |
| `/pong` | `/game/pong` |
| `/connect4` | `/game/connect4` |
| `/connect4_single` | `/game/connect4_single` |
| `/me` | `/user/me` |
| `/profile/:id` | `/user/profile/:id` |

**Navigation calls updated throughout codebase.**

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
│   ├── engine/     # Pure game logic
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
