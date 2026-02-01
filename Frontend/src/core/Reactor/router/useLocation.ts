import { useState, useEventListener } from "Reactor";

/**
 * useLocation Hook
 * Subscribes to URL changes and forces a re-render.
 * Safe for components like Sidebar that need to update highlights.
 * WARNING: Do not use in RootLayout if it triggers layout swaps (Hook mismatch risk).
 */
export function useLocation() {
  const currentPath = typeof window !== "undefined" ? window.location.pathname : "/";
  const [location, setLocation] = useState(currentPath);

  useEventListener("routechange", () => {
    setLocation(window.location.pathname);
  });

  return location;
}
