import rootLayout from "@/app/components/layout/RootLayout";
import { resetHooks, flushEffects, runPendingRefs, cleanupContext } from "./hooks";
import { getRoutes, resolvePage, isSpecialLayout } from "./router/routes";
import { startTransition, endTransition } from "./router/transition";

// Shared key so layout-level state (including modals) can trigger a shell re-render.
export const LAYOUT_KEY = "__layout__";

// Track navigation state for animated transitions
let hasNavigated = false;
let isTransitioning = false;

// Track the last known path for layout swap detection
let lastKnownPath = "";


// Renders the current route by resolving the page component and updating the DOM.
export function renderRoute(triggerKey?: string) {
  const rawPath = window.location.pathname;
  const normalizedPath = normalizePath(rawPath);

  // Detect layout swap BEFORE updating lastKnownPath
  const prevIsSpecial = lastKnownPath ? isSpecialLayout(lastKnownPath) : null;
  const nextIsSpecial = isSpecialLayout(normalizedPath);
  const layoutNeedsUpdate = prevIsSpecial !== null && prevIsSpecial !== nextIsSpecial;

  lastKnownPath = normalizedPath;
  document.title = getPageTitle(normalizedPath);
  window.dispatchEvent(new Event("routechange"));

  const { component, params } = resolvePage(getRoutes(), rawPath);
  const root = document.getElementById("app");
  if (!root) return;

  try {
    const layoutKey = nextIsSpecial ? "__layout__:special" : "__layout__:normal";
    let inner = document.getElementById("spa-root");

    // Re-render layout if type changed, if missing, or if explicitly requested (including via hooks)
    if (!inner || layoutNeedsUpdate || triggerKey?.startsWith(LAYOUT_KEY)) {
      if (layoutNeedsUpdate) {
        cleanupContext(prevIsSpecial ? "__layout__:special" : "__layout__:normal");
      }
      renderSubtree(() => rootLayout({ children: null }), root, layoutKey, { track: false });
      inner = document.getElementById("spa-root");
    }

    if (inner) renderSubtree(() => component(params), inner, `page:${normalizedPath}`);
  } catch (err) {
    console.error("⚠️ renderRoute error:", err);
  }
}

// Initializes the router
export function initRouter() {
  document.addEventListener("click", (e) => {
    if (e.defaultPrevented) return;
    const link = (e.target as HTMLElement).closest("a");
    if (link && link.getAttribute("href")?.startsWith("/") && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      navigate(link.getAttribute("href")!);
    }
  });

  window.addEventListener("popstate", async () => {
    // Notify reactive components immediately so they can update icons/visibility
    window.dispatchEvent(new Event("routechange"));

    if (isTransitioning) return;
    isTransitioning = true;
    try {
      // Popstate is spatially backward
      await startTransition({
        direction: "backward",
        weight: isHeavyRoute(window.location.pathname) ? "heavy" : "normal"
      });
      renderRoute();
      await endTransition();
    } finally {
      isTransitioning = false;
    }
  });

  renderRoute();
  hasNavigated = true;
}

function normalizePath(rawPath: string) {
  let path = rawPath.toLowerCase().replace(/\/{2,}/g, "/").replace(/\/+$/, "") || "/";
  return path.split(/[?#]/)[0];
}

// Generates a human-readable page title from the route path
function getPageTitle(path: string): string {
  const normalized = normalizePath(path);

  // Handle homepage
  if (normalized === "/") return "Mina - Home";

  // Split path into segments and capitalize each
  const segments = normalized.split("/").filter(Boolean);

  // Convert segments to title case and join
  const title = segments
    .map(segment => {
      // Handle common abbreviations
      if (segment === "4p") return "4P";

      // Replace underscores with spaces and capitalize
      return segment
        .replace(/_/g, " ")
        .split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    })
    .join(" - ");

  return `Mina - ${title}`;
}

function renderSubtree(renderFn: () => HTMLElement, container: HTMLElement, key: string, opts?: { track?: boolean }) {
  resetHooks(key, opts); //reset context on every page switch
  const el = renderFn(); //call the components funcs to make tree
  container.replaceChildren(el); //replace the content of page and add new
  runPendingRefs(); // after all dom is made now run ref.current = elemtent for every queued ref
  flushEffects(); // at last after ref flush all the effects execute all effect callback
}

// Programmatic navigation helper
export async function navigate(path: string, opts?: { replace?: boolean; triggerLayout?: boolean; state?: any }) {
  const target = normalizePath(path);
  const current = normalizePath(window.location.pathname);
  const shouldUpdate = opts?.replace || target !== current;

  if (isTransitioning) return;
  isTransitioning = true;

  try {
    // Spatial forward + Route weight detection
    await startTransition({
      direction: "forward",
      weight: isHeavyRoute(target) ? "heavy" : "normal"
    });

    if (shouldUpdate) history[opts?.replace ? "replaceState" : "pushState"](opts?.state ?? {}, "", target);
    window.dispatchEvent(new Event("routechange"));
    renderRoute(opts?.triggerLayout ? LAYOUT_KEY : undefined);
    await endTransition();
  } finally {
    isTransitioning = false;
  }
}

/**
 * Determines if a route is "heavy" (e.g. game or tournament) 
 * to trigger a more deliberate signature move.
 */
function isHeavyRoute(path: string): boolean {
  const p = normalizePath(path);
  return p.startsWith("/game") || p.startsWith("/tournament");
}
