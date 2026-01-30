import { useState, useEffect } from "../hooks";

/**
 * useLocation Hook
 * Subscribes to URL changes and forces a re-render in components
 * that need to react to the current pathname.
 * 
 * Listens for both:
 * - Browser back/forward buttons (popstate)
 * - Custom programmatic navigation (routechange event)
 */
export function useLocation() {
  const currentPath = typeof window !== "undefined" ? window.location.pathname : "/";

  // Initialize state with the current browser path
  const [location, setLocation] = useState(currentPath);

  // Sync state if it's stale (next tick)
  // This replaces the direct setLocation during render which caused infinite recursion and hook mismatches.
  useEffect(() => {
    if (location !== currentPath) {
      setLocation(currentPath);
    }
  }, [location, currentPath]);

  useEffect(() => {
    const handleSync = () => {
      setLocation(window.location.pathname);
    };

    // Listen for custom programmatic navigation event
    window.addEventListener("routechange", handleSync);

    // Listen for browser Back/Forward button clicks
    window.addEventListener("popstate", handleSync);

    // Cleanup listeners on component unmount
    return () => {
      window.removeEventListener("routechange", handleSync);
      window.removeEventListener("popstate", handleSync);
    };
  }, []);

  return location;
}
