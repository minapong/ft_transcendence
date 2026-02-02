# Core Directory

This directory contains framework code, game logic, and infrastructure — nothing users directly see.

## Structure

```
core/
├── engine/     # Game logic (Pong/Connect4)
├── Reactor/    # Custom JSX framework
└── lib/        # API, auth, presence, input utils
```

## Engine

The `engine/` folder contains game logic helpers:

- `pong_logic.ts`, `4p_pong_logic.ts` — Pong logic
- `pong_ai.ts` — AI opponent
- `connect4_logic.ts` — Connect4 logic
- `match_config.ts`, `match_intent.ts` — match setup helpers

### Current State (Technical Debt)

Some engine functions still access DOM directly via `document.getElementById()`.

**Future refactor:** separate state updates from rendering so the engine can be reused for:
- AI training
- Replays
- Multiplayer sync

## Reactor

Custom JSX framework with:

- `runtime/` — JSX factory + runtime
- `core/` — hooks + render pipeline
- `features/router/` — file-based routing
- `features/modal/` — modal system
- `types/` — JSX type declarations

Use Reactor hooks and navigation:

```tsx
import { useState, useEffect, navigate } from "Reactor";
```

## lib

Utilities for external communication:

- `api.ts` — `apiFetch()` wrapper for backend calls
- `auth.ts` — token storage + logout
- `presence.ts` — WebSocket presence connection
- `useAuth.ts` — auth state hook
- `input/` — validation helpers

## Import Aliases

Configured in `tsconfig.json` and `vite.config.ts`:

- `@/core/engine/...` → game logic
- `@/core/lib/...` → utilities
- `Reactor` → framework entry
- `Reactor/...` → framework internals
