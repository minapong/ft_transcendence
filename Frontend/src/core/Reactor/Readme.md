# Reactor Library

Reactor is a lightweight, React-like library for building web applications with JSX. It provides basic functionality for creating components, managing state, and handling routing.

## Capabilities

### Core Features
- **JSX Runtime**: Allows the use of JSX syntax to create DOM elements and components.
- **Fragment Support**: Group multiple elements without adding extra DOM nodes using `<Fragment>` or the shorthand `<>...</>` syntax.
- **Custom Hooks**:
  - `useState`: Manage state within components.
  - `useEffect`: Run side effects based on dependencies.
  - `useMemo`: Memoize values to optimize performance.
  - `useRef`: Create mutable references that persist across renders.
- **Routing**:
  - File-based routing from `/src/app/pages` directory.
  - **Static routes**: `pages/dashboard.tsx` → `/dashboard`
  - **Dynamic routes**: `pages/user/[id].tsx` → `/user/:id`
  - Handles navigation using `history.pushState` and `popstate` events.
  - Route normalization (slashes, trailing slash removal).
  - Fallback for not found pages.
- **Rendering**:
  - Renders components dynamically based on the current route.
  - Updates the DOM efficiently by replacing children elements.

### Utility Functions
- `resetHooks`: Reset hook index and clear stored hooks when the route changes.
- `flushEffects`: Executes all pending side effects.
- `runPendingRefs`: Updates all pending references.

## Limitations

- **No Virtual DOM**: Reactor directly manipulates the DOM.

## Usage

1. **Create Components**:
   Use the `createReactor` function to define components with JSX.

2. **Manage State**:
   Use `useState` and other hooks to manage state and side effects.

3. **Set Up Routing**:
   Define pages in the `/src/app/pages` directory and use `initRouter` to enable navigation.

4. **Render Application**:
   Use `renderRoute` to render the application based on the current route.

---

## Router

### File-Based Routing

Routes are automatically generated from the filesystem:

```
src/app/pages/
├── index.tsx          → /
├── dashboard.tsx      → /dashboard
├── auth/
│   ├── login.tsx      → /auth/login
│   └── signup.tsx     → /auth/signup
├── game/
│   └── pong.tsx       → /game/pong
└── user/
    ├── me.tsx         → /user/me
    └── [id].tsx       → /user/:id (dynamic)
```

### Dynamic Routes

Use `[param]` in filenames for dynamic segments:

| File | Route | Example Match |
|------|-------|---------------|
| `pages/user/[id].tsx` | `/user/:id` | `/user/123` |
| `pages/post/[slug].tsx` | `/post/:slug` | `/post/hello-world` |
| `pages/[category]/[id].tsx` | `/:category/:id` | `/tech/42` |

### Receiving Route Params

Dynamic route params are passed as props to the component:

```tsx
// pages/user/[id].tsx
export default function UserProfile({ id }: { id: string }) {
  // Visiting /user/123 → id = "123"
  return <div>User ID: {id}</div>;
}
```

```tsx
// pages/post/[slug]/edit.tsx
export default function EditPost({ slug }: { slug: string }) {
  // Visiting /post/hello-world/edit → slug = "hello-world"
  return <div>Editing: {slug}</div>;
}
```

### Navigation

```tsx
import { navigate } from "Reactor";

// Static route
navigate("/dashboard");

// Dynamic route - just use the actual path
navigate("/user/123");

// With state
navigate("/game/pong", { state: { mode: "2p" } });
```

### How It Works

1. `getRoutes()` scans `pages/` at startup
2. Files with `[param]` become regex patterns: `[id]` → `([^/]+)`
3. `resolvePage()` tries static routes first, then matches dynamic patterns
4. Matched params are extracted and passed as component props

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

### Using Fragment

```tsx
import { Fragment } from "Reactor";

// Explicit Fragment
function List() {
  return (
    <Fragment>
      <li>Item 1</li>
      <li>Item 2</li>
      <li>Item 3</li>
    </Fragment>
  );
}

// Shorthand syntax
function Header() {
  return (
    <>
      <h1>Title</h1>
      <p>Subtitle</p>
    </>
  );
}
```

```
renderSubtree() performs the full lifecycle:
  1.Reset context for hooks
  2.Render component → run hooks → collect DOM
  3.Write DOM into container
  4.Assign refs
  5.Execute effects
```