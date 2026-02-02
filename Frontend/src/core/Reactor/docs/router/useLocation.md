# Router Module

The router module provides file-based routing and navigation utilities for Reactor applications.

## Hooks

### `useLocation`

A custom hook that subscribes to URL changes and returns the current pathname. Automatically re-renders the component whenever navigation occurs.

#### Usage

```tsx
import { useLocation } from "Reactor";

export default function MyComponent() {
  const pathname = useLocation();

  return (
    <div>
      Current page: {pathname}
      {pathname.startsWith("/game") && <p>In game mode</p>}
    </div>
  );
}
```

#### How It Works

`useLocation` listens to:
1. `routechange` (programmatic navigation via `navigate()`)
2. `popstate` (browser back/forward)

---

## Navigation

### `navigate(path, options?)`

Programmatically navigate to a new page.

#### Parameters

```ts
navigate(
  path: string,
  opts?: {
    replace?: boolean;       // Use replaceState instead of pushState
    triggerLayout?: boolean; // Force layout re-render
    state?: any;             // Custom history state
  }
)
```

#### Usage

```tsx
import { navigate } from "Reactor";

navigate("/dashboard");
navigate("/user/123");

navigate("/dashboard", { replace: true });
```

#### Layout Swap Logic

Certain routes trigger a **layout change** (game/auth):

| Route Pattern | Layout | Sidebar |
|--------------|--------|---------|
| `/game/*` | Special | Hidden |
| `/auth/*` | Special | Hidden |
| everything else | Normal | Visible |

---

## File-Based Routing

Routes are generated from the filesystem:

```
src/app/pages/
├── index.tsx              → /
├── dashboard.tsx          → /dashboard
├── auth/[mode].tsx        → /auth/:mode
├── game/pong.tsx          → /game/pong
└── user/[id].tsx           → /user/:id
```

### Dynamic Routes

Use `[param]` in filenames to create dynamic segments.

```tsx
// pages/user/[id].tsx
export default function UserProfile({ id }: { id: string }) {
  return <h1>User {id}</h1>;
}
```

---

## Best Practices

- Use `useLocation()` instead of `window.location.pathname`
- Use `navigate()` for programmatic navigation
