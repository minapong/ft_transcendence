
import { useState, useEffect } from "../hooks";

/**
 * useLocation Hook
 * Subscribes to URL changes and forces a re-render.
 * Safe for components like Sidebar that need to update highlights.
 * WARNING: Do not use in RootLayout if it triggers layout swaps (Hook mismatch risk).
 */
export function useLocation() {
  const currentPath = typeof window !== "undefined" ? window.location.pathname : "/";
  const [location, setLocation] = useState(currentPath);

  useEffect(() => {
    const handleSync = () => {
      setLocation(window.location.pathname);
    };

    window.addEventListener("routechange", handleSync);
    window.addEventListener("popstate", handleSync);

    return () => {
      window.removeEventListener("routechange", handleSync);
      window.removeEventListener("popstate", handleSync);
    };
  }, []);

  return location;
}
