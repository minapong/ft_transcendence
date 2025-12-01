# Reactor Library

Reactor is a lightweight, React-like library for building web applications with JSX. It provides basic functionality for creating components, managing state, and handling routing.

## Capabilities

### Core Features
- **JSX Runtime**: Allows the use of JSX syntax to create DOM elements and components.
- **Custom Hooks**:
  - `useState`: Manage state within components.
  - `useEffect`: Run side effects based on dependencies.
  - `useMemo`: Memoize values to optimize performance.
  - `useRef`: Create mutable references that persist across renders.
- **Routing**:
  - Dynamically imports and resolves routes from the `/src/pages` directory.
  - Handles navigation using `history.pushState` and `popstate` events.
  - Supports route normalization and fallback for not found pages.
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
   Define pages in the `/src/pages` directory and use `initRouter` to enable navigation.

4. **Render Application**:
   Use `renderRoute` to render the application based on the current route.

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

## Future Improvements

- Add support for a virtual DOM to improve performance.
  
