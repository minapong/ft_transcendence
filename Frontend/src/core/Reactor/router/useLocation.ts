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
