# ft_transcendence — Frontend

This is the single-page app (SPA) for ft_transcendence. It uses the custom Reactor framework (JSX runtime + hooks + router) and a Tailwind v4 + tokens-based design system.

## Tech Stack

- TypeScript + Vite
- Reactor (custom JSX runtime, hooks, router)
- Tailwind CSS v4 + custom CSS tokens
- Motion One
- Babylon dependencies are installed but not yet wired into the UI

## Development

```bash
npm install
npm run dev
```

Frontend runs on `http://localhost:5173` by default.

## Environment

```env
VITE_API_BASE=http://localhost:3000
# Optional override:
# VITE_WS_BASE=ws://localhost:3000
```

## Folder Structure

```
src/
├── app/                     # User-facing UI
│   ├── components/          # Layout + UI building blocks
│   │   ├── layout/
│   │   ├── ui/
│   │   └── game/
│   ├── hooks/               # App-specific hooks
│   ├── pages/               # File-based routes
│   │   ├── auth/[mode].tsx   # /auth/login, /auth/signup
│   │   ├── game/             # Pong / 4P / AI / Connect4
│   │   ├── tournament/       # start/active views
│   │   └── user/             # /user/me, /user/[id], /user/settings
│   ├── modals.tsx            # Modal registrations
│   ├── main.tsx              # App entry
│   └── global.css            # Global styles import
│
├── core/                    # Framework + pure logic
│   ├── Reactor/             # JSX runtime + hooks + router
│   ├── engine/              # Game logic (Pong/Connect4)
│   └── lib/                 # API/auth/presence helpers
│
├── styles/                  # Design system + tokens
└── assets/                  # Bundled static assets
```

## Notes

- Routes are auto-generated from `src/app/pages` via Reactor.
- Use `navigate()` from `Reactor` for programmatic navigation.
