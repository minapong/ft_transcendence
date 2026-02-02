import { useState, useEventListener } from "../../core/hooks";

/**
 * useLocation Hook
 * Subscribes to URL changes and forces a re-render.
 * Safe for components like Sidebar that need to update highlights.
 * WARNING: Do not use in RootLayout if it triggers layout swaps (Hook mismatch risk).
 */
// Subscribes to window location events and forces re-render
export function useLocation() {
  const [, setTick] = useState(0);

  const forceUpdate = () => setTick(t => t + 1);

  useEventListener("routechange", forceUpdate);
  useEventListener("popstate", forceUpdate);

  // Always read strictly from the source of truth to avoid stale state during parent re-renders
  return typeof window !== "undefined" ? window.location.pathname : "/";
}
