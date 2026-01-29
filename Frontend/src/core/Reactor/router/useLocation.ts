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
  // Initialize state with the current browser path
  const [location, setLocation] = useState(window.location.pathname);

  // CRITICAL: If the cached state doesn't match the current URL (e.g. after a layout swap),
  // we must return the fresh URL immediately to prevent rendering stale UI during the transition.
  const currentPath = window.location.pathname;
  if (location !== currentPath) {
    // We can't call setLocation during render directly without a guard in some frameworks,
    // but in our Reactor, we just want to ensure the next render is correct and this one returns the truth.
    setLocation(currentPath);
    return currentPath;
  }

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
