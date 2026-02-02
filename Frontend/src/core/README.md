# Core Directory

This directory contains framework code, pure logic, and infrastructure — nothing users directly see.

## Structure

```
core/
├── engine/     # Pure game logic (no UI)
├── Reactor/    # Custom JSX framework (React-like)
└── lib/        # API, auth, presence utilities
```

## Engine Philosophy

The `engine/` folder contains **pure game logic**:

- `pong_logic.ts` — Pong game state and physics
- `pong_ai.ts` — AI opponent logic
- `connect4_logic.ts` — Connect4 game state
- `pong_parameters.ts` — Game constants

### Current State (⚠️ Technical Debt)

The engine currently accesses DOM directly via `document.getElementById()`. 

**Future refactor:** Separate state from rendering:
- Engine returns state updates
- UI layer handles DOM manipulation
- Enables: AI training, replays, multiplayer sync

### Rules for Engine Code

1. ❌ No React/Reactor imports
2. ❌ No direct DOM manipulation (future goal)
3. ✅ Pure functions where possible
4. ✅ Export state + callbacks, not DOM side effects

## Reactor

Custom JSX framework with:

- `runtime/` — JSX factory + JSX runtime
- `core/` — hooks + render pipeline
- `features/router/` — File-based routing
- `features/modal/` — Modal system
- `types/` — JSX type declarations
- `docs/` — Reactor documentation

**Do not use React.** Use Reactor hooks:

```tsx
import { useState, useEffect, navigate } from "Reactor";
```

## Lib

Utilities for external communication:

- `api.ts` — `apiFetch()` wrapper for backend calls
- `auth.ts` — Token storage, `getAuth()`, `setAuth()`, `logout()`
- `presence.ts` — WebSocket presence connection
- `useAuth.ts` — Auth state hook

### API Usage

```tsx
import { apiFetch } from "@/core/lib/api";

const data = await apiFetch("/api/users/me");
```

### Auth Usage

```tsx
import { getAuth, setAuth, logout } from "@/core/lib/auth";

const auth = getAuth(); // { token, user }
setAuth({ token, user });
logout();
```

## Import Aliases

Configured in `tsconfig.json` and `vite.config.ts`:

- `@/core/engine/...` → Game logic
- `@/core/lib/...` → Utilities  
- `Reactor` → Framework (direct alias)
- `Reactor/...` → Framework internals
