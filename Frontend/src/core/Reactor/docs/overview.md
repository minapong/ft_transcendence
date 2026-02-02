# Reactor Library

Reactor is a lightweight, React-like library for building web applications with JSX. It provides a custom JSX runtime, hooks, and file-based routing.

## Capabilities

### Core Features
- **JSX Runtime**: Allows the use of JSX syntax to create DOM elements and components.
- **Fragment Support**: Group multiple elements without adding extra DOM nodes using `<Fragment>` or `<>...</>`.
- **forwardRef**: Pass refs to child components using `forwardRef((props, ref) => ...)` for advanced DOM access.
- **Custom Hooks**:
  - `useState`, `useEffect`, `useMemo`, `useRef`, `useCallback`, `useLayoutEffect`
  - `useLocation` (Router)
- **Routing**:
  - File-based routing from `/src/app/pages`
  - **Static routes**: `pages/dashboard.tsx` → `/dashboard`
  - **Dynamic routes**: `pages/user/[id].tsx` → `/user/:id`
  - Handles navigation via History API
  - Fallback for not found pages
- **Rendering**:
  - Renders components dynamically based on the current route
  - Updates the DOM by replacing subtree contents

### Utility Functions
- `resetHooks` — Reset hook index and context
- `flushEffects` — Execute pending effects
- `runPendingRefs` — Assign refs after DOM commit

## Limitations

- **No Virtual DOM**: Reactor directly manipulates the DOM.

## Usage

1. **Create Components**: Use the `createReactor` JSX factory.
2. **Manage State**: Use Reactor hooks.
3. **Set Up Routing**: Define pages in `/src/app/pages` and call `initRouter()`.
4. **Render Application**: `renderRoute()` handles route resolution + DOM updates.

---

## Router

**[→ Full Router Documentation](./router/routing.md)**

The router module provides:
- `useLocation` for reactive URL subscriptions
- `navigate()` for programmatic navigation
- Layout swaps for special routes (game/auth)

### Quick Example

```tsx
import { useLocation, navigate } from "Reactor";

function MyComponent() {
  const pathname = useLocation();

  return (
    <div>
      <p>Current: {pathname}</p>
      <button onClick={() => navigate("/dashboard")}>Go to Dashboard</button>
    </div>
  );
}
```

### File-Based Routing

```
src/app/pages/
├── index.tsx          → /
├── dashboard.tsx      → /dashboard
├── auth/[mode].tsx    → /auth/:mode
├── game/pong.tsx      → /game/pong
└── user/[id].tsx      → /user/:id
```

### Dynamic Routes

Use `[param]` in filenames for dynamic segments:

| File | Route | Example Match |
|------|-------|---------------|
| `pages/user/[id].tsx` | `/user/:id` | `/user/123` |
| `pages/post/[slug].tsx` | `/post/:slug` | `/post/hello-world` |

### Receiving Route Params

```tsx
// pages/user/[id].tsx
export default function UserProfile({ id }: { id: string }) {
  return <div>User ID: {id}</div>;
}
```

### Navigation

```tsx
import { navigate } from "Reactor";

navigate("/dashboard");
navigate("/user/123");

// With state
navigate("/game/pong", { state: { mode: "2p" } });
```

---

## Example

```tsx
import { createReactor, useState, initRouter } from "Reactor";

function App() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <h1>Counter: {count}</h1>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}

initRouter();
```
