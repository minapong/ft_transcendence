# Reactor Features — Complete Technical Reference

> **Reactor** is a custom, lightweight JSX framework built from scratch. No React, no Preact, no dependencies. Pure DOM manipulation with React-like ergonomics.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [JSX Runtime](#jsx-runtime)
3. [Hooks System](#hooks-system)
4. [Routing](#routing)
5. [Modal System](#modal-system)
6. [Rendering Pipeline](#rendering-pipeline)
7. [State Management](#state-management)
8. [Performance Characteristics](#performance-characteristics)
9. [API Reference](#api-reference)

---

## Architecture Overview

```
Reactor/
├── createReactor.tsx   # JSX factory + Fragment
├── hooks.ts            # useState, useEffect, useMemo, useRef
├── render.tsx          # renderRoute, initRouter, navigate
├── modal.ts            # Modal state management
├── ModalRoot.tsx       # Modal UI component
├── router/
│   └── routes.tsx      # File-based routing engine
├── index.tsx           # Public exports
└── jsx.d.ts            # TypeScript declarations
```

### Design Principles

1. **No Virtual DOM** — Direct DOM manipulation
2. **File-based routing** — Filesystem = routes
3. **Isolated hook contexts** — Each page has its own state
4. **Minimal API surface** — Only what's needed

---

## JSX Runtime

### How It Works

Reactor implements its own JSX factory that Vite/esbuild calls at build time:

```ts
// vite.config.ts
esbuild: {
  jsx: "transform",
  jsxFactory: "createReactor",
  jsxFragment: "Fragment"
}
```

When you write:
```tsx
<div className="box">Hello</div>
```

It compiles to:
```ts
createReactor("div", { className: "box" }, "Hello")
```

### `createReactor(tag, props, ...children)`

**For HTML tags:**
```tsx
<div id="app" className="container">
  <span>Text</span>
</div>
```
Creates real DOM elements via `document.createElement()`.

**For function components:**
```tsx
function Button({ label }) {
  return <button>{label}</button>;
}
<Button label="Click me" />
```
Calls the function, merges props, returns DOM.

### Property Handling

| Prop Type | Behavior |
|-----------|----------|
| `style={{ color: "red" }}` | `Object.assign(el.style, value)` |
| `onClick={fn}` | `el.addEventListener("click", fn)` |
| `ref={refObj}` | Queued, assigned after render |
| `className="x"` | `el.className = "x"` |
| `data-*`, `aria-*` | `el.setAttribute(key, value)` |
| DOM properties | Direct assignment: `el[key] = value` |

### Fragment Support

```tsx
// Explicit
<Fragment>
  <li>One</li>
  <li>Two</li>
</Fragment>

// Shorthand
<>
  <li>One</li>
  <li>Two</li>
</>
```

Returns `DocumentFragment` — no wrapper element.

---

## Hooks System

### Context Isolation

**Key innovation:** Each page gets its own hook storage.

```ts
const contextMap = new Map<string, HookContext>();

type HookContext = {
  hooks: HookEntry[];      // useState, useMemo, useRef
  effects: EffectEntry[];  // useEffect
  pendingEffects: Array<() => void>;
};
```

When navigating:
1. Previous page's effects are cleaned up
2. New page gets fresh or cached context
3. Hook index resets to 0

This prevents state collision between pages.

### `useState<T>(initial: T)`

```tsx
const [count, setCount] = useState(0);

// Update with value
setCount(5);

// Update with function
setCount(prev => prev + 1);
```

**Internals:**
```ts
type StateEntry = { kind: "state"; value: any };
```

- Stored by index in page's hook array
- `setState` triggers `renderRoute(pageKey)`
- Same-page renders preserve state

### `useEffect(callback, deps?)`

```tsx
// Run once on mount
useEffect(() => {
  console.log("mounted");
  return () => console.log("cleanup");
}, []);

// Run when deps change
useEffect(() => {
  fetchUser(userId);
}, [userId]);

// Run once ever (no deps array)
useEffect(() => {
  initOnce();
});
```

**Lifecycle:**
1. Queued during render (not executed immediately)
2. `flushEffects()` runs after DOM is written
3. Cleanup runs before next effect or on unmount

**Internals:**
```ts
type EffectEntry = { 
  deps?: any[]; 
  cleanup: (() => void) | null;
};
```

### `useRef<T>(initial: T)`

```tsx
const inputRef = useRef<HTMLInputElement>(null);

// In JSX
<input ref={inputRef} />

// Access later
inputRef.current?.focus();
```

**Internals:**
```ts
type RefEntry = { kind: "ref"; current: any };
```

- Refs are assigned via `pendingRefSetters` queue
- Executed after DOM write, before effects

### `useMemo<T>(fn, deps)`

```tsx
const expensive = useMemo(() => {
  return computeHeavyThing(data);
}, [data]);
```

**Internals:**
```ts
type MemoEntry = { kind: "memo"; value: any; deps: any[] };
```

- Recomputes only when deps change
- Uses shallow comparison

### Dependency Comparison

```ts
function depsChanged(prev: any[] | undefined, next: any[]) {
  if (!prev || prev.length !== next.length) return true;
  for (let i = 0; i < next.length; i++) {
    if (next[i] !== prev[i]) return true;  // Strict equality
  }
  return false;
}
```

---

## Routing

### File-Based Route Discovery

```ts
const pages = import.meta.glob("/src/app/pages/**/*.tsx", { eager: true });
```

Vite scans filesystem at build time. Routes are derived automatically.

### Route Types

**Static Routes:**
```
pages/dashboard.tsx     → /dashboard
pages/auth/login.tsx    → /auth/login
pages/index.tsx         → /
```

**Dynamic Routes:**
```
pages/user/[id].tsx           → /user/:id
pages/post/[slug]/edit.tsx    → /post/:slug/edit
```

### Dynamic Route Matching

```ts
// File: pages/user/[id].tsx
// Pattern: ^/user/([^/]+)$

type RouteEntry = {
  component: any;
  pattern: RegExp;
  paramNames: string[];  // ["id"]
  path: string;
};
```

Resolution order:
1. Try exact static match (case-insensitive)
2. Try dynamic patterns in order
3. Fall back to `/notfound`

### Route Parameters

```tsx
// pages/user/[id].tsx
export default function UserProfile({ id }: { id: string }) {
  // /user/123 → id = "123"
  return <div>User: {id}</div>;
}
```

Multiple params:
```tsx
// pages/[category]/[id].tsx
export default function Item({ category, id }) {
  // /electronics/42 → category="electronics", id="42"
}
```

### Navigation

```tsx
import { navigate } from "Reactor";

// Basic
navigate("/dashboard");

// With state (accessible via history.state)
navigate("/game/pong", { state: { mode: "2p" } });

// Replace (no back button entry)
navigate("/auth/login", { replace: true });

// Trigger layout re-render
navigate("/", { triggerLayout: true });
```

### URL Normalization

```ts
// Applied to all paths:
path
  .replace(/\/{2,}/g, "/")     // Collapse multiple slashes
  .replace(/\/+$/, "")         // Remove trailing slash
  .split(/[?#]/)[0]            // Strip query/hash
```

---

## Modal System

### Opening Modals

```tsx
import { openModal, closeModal } from "Reactor";

// With inline renderer
openModal({
  type: "confirm",
  payload: { message: "Delete item?" },
  render: ({ message }) => (
    <div>
      <p>{message}</p>
      <button onClick={closeModal}>Cancel</button>
    </div>
  )
});

// With registered renderer
openModal({ type: "settings", payload: { tab: "audio" } });
```

### Registering Modal Types

```tsx
import { registerModal } from "Reactor";

registerModal("settings", (payload) => (
  <SettingsPanel initialTab={payload.tab} />
));
```

### Modal Features

**Focus Trap:**
- Tab cycles within modal
- Shift+Tab goes backwards
- Focus returns to trigger on close

**Scroll Lock:**
- `document.body.style.overflow = "hidden"` when open
- Restored on close

**Keyboard:**
- `Escape` closes modal

**Accessibility:**
- `role="dialog"`
- `aria-modal="true"`
- `aria-label` from modal type/label
- Focus management

### Modal API

```ts
type ModalDescriptor<T> = {
  type: string;           // Identifier
  payload?: T;            // Data for renderer
  render?: (payload: T) => HTMLElement;  // Inline renderer
  label?: string;         // Accessible label
};

openModal(descriptor)     // Open modal
closeModal()              // Close current modal
getCurrentModal()         // Get current modal state
registerModal(type, fn)   // Register reusable renderer
```

---

## Rendering Pipeline

### Full Render Cycle

```
renderRoute(triggerKey?)
    │
    ├─→ Resolve page component from URL
    │
    ├─→ If layout needed: renderSubtree(RootLayout, #app, "__layout__")
    │
    └─→ renderSubtree(Page, #spa-root, "page:/current/path")
```

### `renderSubtree(renderFn, container, key)`

```
1. resetHooks(key)           ← Set active context, cleanup old effects
2. const el = renderFn()     ← Execute component, run hooks, build DOM
3. container.replaceChildren(el)  ← Write to DOM
4. runPendingRefs()          ← Assign ref.current values
5. flushEffects()            ← Execute queued effects
```

### Layout vs Page Rendering

```ts
const LAYOUT_KEY = "__layout__";

// Layout renders once, persists across navigation
// Pages render on every route change
// Layout re-renders only when triggerKey === LAYOUT_KEY
```

---

## State Management

### Page-Scoped State

```tsx
// pages/counter.tsx
export default function Counter() {
  const [count, setCount] = useState(0);
  // This state is isolated to /counter
  // Other pages have their own useState(0)
}
```

### Cross-Page State

For shared state, use:
1. **URL state:** `navigate("/page", { state: data })`
2. **Module-level:** Export from a shared module
3. **LocalStorage:** For persistence

### State Persistence

- **Within same page:** State persists across re-renders
- **Navigation away:** Effects cleanup, state cached
- **Navigation back:** State restored from cache
- **Hard refresh:** All state lost

---

## Performance Characteristics

### What's Fast

- No diffing algorithm (direct DOM writes)
- No virtual DOM overhead
- Eager route loading (no code splitting overhead at runtime)
- Simple hook index lookup O(1)

### What's Not Optimized

- Full page re-render on any state change
- No component-level memoization
- No concurrent rendering
- All routes loaded upfront

### Memory

- Hook contexts persist in `contextMap`
- Effects cleanup on navigation
- No automatic garbage collection of old pages

---

## API Reference

### Exports from "Reactor"

```tsx
// JSX
export { createReactor, Fragment }

// Routing
export { renderRoute, initRouter, navigate }

// Hooks
export { useState, useEffect, useMemo, useRef, resetHooks }

// Modals
export { openModal, closeModal, getCurrentModal, registerModal, resolveModalRenderer }
```

### Type Definitions

```ts
// Hooks
function useState<T>(initial: T): [T, (v: T | ((prev: T) => T)) => void]
function useEffect(cb: () => void | (() => void), deps?: any[]): void
function useRef<T>(initial: T): { current: T }
function useMemo<T>(fn: () => T, deps: any[]): T

// Routing
function navigate(path: string, opts?: {
  replace?: boolean;
  triggerLayout?: boolean;
  state?: any;
}): void

function initRouter(): void
function renderRoute(triggerKey?: string): void

// Modals
function openModal<T>(modal: ModalDescriptor<T>): void
function closeModal(): void
function registerModal<T>(type: string, renderer: (payload: T) => HTMLElement): void
```

---

## Comparison with React

| Feature | React | Reactor |
|---------|-------|---------|
| Virtual DOM | ✅ | ❌ |
| Fiber reconciler | ✅ | ❌ |
| Concurrent mode | ✅ | ❌ |
| Hooks | ✅ | ✅ (subset) |
| Context API | ✅ | ❌ |
| Suspense | ✅ | ❌ |
| File-based routing | ❌ (Next.js) | ✅ |
| Bundle size | ~40kb | ~3kb |
| Learning curve | Medium | Low |

---

## When to Use Reactor

**Good for:**
- Small to medium SPAs
- Learning how frameworks work
- Maximum control over rendering
- Minimal bundle size requirements

**Not ideal for:**
- Large applications with complex state
- Apps needing fine-grained updates
- Server-side rendering
- Large teams (no ecosystem)
