# Reactor Hooks

Reactor exports its hooks from the `Reactor` alias.

```tsx
import { useState, useEffect, useMemo, useRef, useCallback, useLayoutEffect } from "Reactor";
```

## Example

```tsx
import { useState, useEffect } from "Reactor";

export default function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Runs after DOM commit
  }, [count]);

  return (
    <button onClick={() => setCount(c => c + 1)}>
      {count}
    </button>
  );
}
```

## Notes

- `useState` supports functional updates: `setCount(c => c + 1)`
- `useEventListener` is also available from `Reactor` for DOM events
- Router hook: `useLocation` from `Reactor` (see Reactor docs)
