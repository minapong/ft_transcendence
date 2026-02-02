# Router Module

The router module provides file-based routing and navigation utilities for Reactor applications.

## Hooks

### `useLocation`

A custom hook that subscribes to URL changes and returns the current pathname. Automatically re-renders the component whenever navigation occurs (via browser back/forward or programmatic navigation).

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

#### Why Use It?

- **Reactive**: Component updates whenever the URL changes
- **Unified**: Works with both browser back/forward AND programmatic navigation via `navigate()`
- **Clean**: No need to manually check `window.location.pathname` or set up listeners

#### How It Works

`useLocation` listens to:
1. **`routechange` event** - Fired by programmatic navigation (`navigate()`)
2. **`popstate` event** - Fired by browser back/forward buttons

When either event fires, the component re-renders with the new pathname.

#### Example: Responsive Layout with useLocation

```tsx
import { useLocation } from "Reactor";

export default function RootLayout({ children }) {
  const pathname = useLocation();
  
  // Determine if sidebar should be hidden based on current route
  const isGameRoute = pathname.startsWith("/game");
  const hideSidebar = isGameRoute || pathname.startsWith("/auth") || pathname === "/login";

  return (
    <div className="layout">
      {!hideSidebar && <Sidebar />}
      <main>{children}</main>
    </div>
  );
}
```

The layout automatically updates when navigating between game routes and normal routes.

---

## Navigation

### `navigate(path, options?)`

Programmatically navigate to a new page. Available via the Reactor core render module.

#### Parameters

```typescript
navigate(
  path: string,
  opts?: {
    replace?: boolean;      // Use replaceState instead of pushState
    triggerLayout?: boolean; // Force layout re-render
    state?: any;            // Custom state object for history
  }
)
```

#### Usage

```tsx
import { navigate } from "Reactor";

export default function LoginForm() {
  const handleLogin = () => {
    // Navigate to dashboard after login
    navigate("/dashboard");
  };

  const goBack = () => {
    // Replace current history entry
    navigate("/home", { replace: true });
  };

  return (
    <button onClick={handleLogin}>Login</button>
  );
}
```

#### Key Behaviors

- **Automatic Layout Swap**: If navigating between a game route and a normal route, the layout automatically re-renders
- **URL Normalization**: Paths are normalized (lowercase, trailing slash removed)
- **History Management**: Uses browser history API (`pushState`/`replaceState`)
- **`routechange` Event**: Fires to notify all hooks about navigation

---

## File-Based Routing

Routes are automatically generated from the filesystem:

```
src/app/pages/
├── index.tsx              → /
├── dashboard.tsx          → /dashboard
├── auth/
│   ├── login.tsx          → /auth/login
│   └── signup.tsx         → /auth/signup
├── game/
│   └── pong.tsx           → /game/pong
└── user/
    └── [id].tsx           → /user/:id (dynamic)
```

### Dynamic Routes

Use `[param]` in filenames to create dynamic segments.

```tsx
// pages/user/[id].tsx
export default function UserProfile({ id }: { id: string }) {
  return <h1>User {id}</h1>;
}

// Visiting /user/123 passes { id: "123" } as props
```

### Layout Swap Logic

Certain routes trigger a **layout change**:

| Route | Layout | Sidebar |
|-------|--------|---------|
| `/` | Normal | Visible |
| `/dashboard` | Normal | Visible |
| `/game/pong` | Special | Hidden |
| `/auth/login` | Special | Hidden |
| `/login` | Special | Hidden |

When navigating between these two layout types, the entire layout is re-rendered (preserving sidebar state if needed).

---

## Best Practices

### Use `useLocation` Instead of `window.location.pathname`

❌ **Bad** - Static, won't update on navigation:
```tsx
const pathname = window.location.pathname;
```

✅ **Good** - Reactive, updates on every navigation:
```tsx
const pathname = useLocation();
```

### Use `navigate()` for Programmatic Navigation

❌ **Bad** - Bypasses custom navigation logic:
```tsx
window.location.href = "/dashboard";
```

✅ **Good** - Triggers all hooks and event listeners:
```tsx
navigate("/dashboard");
```

### Listen to Route Changes in Hooks

```tsx
import { useEffect } from "Reactor";

useEffect(() => {
  const handleNavigation = () => {
    // Clean up previous subscription
    // console.log("Navigation happened!");
  };

  window.addEventListener("routechange", handleNavigation);
  return () => window.removeEventListener("routechange", handleNavigation);
}, []);
```

---

## Advanced: Custom Route Detection

```tsx
import { useLocation } from "Reactor";

export default function Header() {
  const pathname = useLocation();
  
  const isInGame = pathname.startsWith("/game");
  const isInDashboard = pathname === "/dashboard";
  const isAuthPage = pathname.startsWith("/auth");

  return (
    <header>
      {isInGame && <p>🎮 Game Mode</p>}
      {isInDashboard && <p>📊 Dashboard</p>}
      {isAuthPage && <p>🔐 Auth Required</p>}
    </header>
  );
}
```
