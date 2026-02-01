const pages = import.meta.glob("/src/app/pages/**/*.tsx", { eager: true });

type RouteEntry = {
  component: any;
  pattern: RegExp;
  paramNames: string[];
  path: string;
};

type RouteMap = {
  static: Record<string, any>;
  dynamic: RouteEntry[];
};

let cache: RouteMap | null = null;

/**
 * Builds routes from file system.
 * 
 * Convention:
 *   - pages/dashboard.tsx      → /dashboard (static)
 *   - pages/user/[id].tsx      → /user/:id  (dynamic)
 *   - pages/post/[slug]/edit.tsx → /post/:slug/edit (dynamic)
 */
export function getRoutes(): RouteMap {
  if (cache) return cache;

  const staticRoutes: Record<string, any> = {};
  const dynamicRoutes: RouteEntry[] = [];

  for (const filePath in pages) {
    // Robustly extract the path following ".../pages"
    const parts = filePath.split("/pages");
    let route = parts[parts.length - 1];

    if (!route) continue;

    // Remove file extension
    route = route.replace(/\.tsx$/, "");

    // Handle "index" convention (e.g., /user/index -> /user)
    if (route.endsWith("/index")) {
      route = route.slice(0, -6);
    } else if (route === "index") {
      route = "/";
    }

    // Normalize: ensure leading slash, remove trailing slash
    if (!route.startsWith("/")) route = "/" + route;
    if (route.length > 1 && route.endsWith("/")) route = route.slice(0, -1);
    if (route === "") route = "/";

    const component = (pages[filePath] as any).default;
    if (!component) continue;

    // Check for dynamic segments: [param]
    if (route.includes("[")) {
      const paramNames: string[] = [];

      // Convert [param] to named capture groups
      // /user/[id] → ^/user/([^/]+)$
      const patternStr = route.replace(/\[([^\]]+)\]/g, (_, paramName) => {
        paramNames.push(paramName);
        return "([^/]+)";
      });

      dynamicRoutes.push({
        component,
        pattern: new RegExp(`^${patternStr}$`, "i"),
        paramNames,
        path: route,
      });
    } else {
      staticRoutes[route.toLowerCase()] = component;
    }
  }

  cache = { static: staticRoutes, dynamic: dynamicRoutes };


  return cache;
}

/**
 * Resolves a URL path to a component.
 * Static routes checked first, then dynamic patterns.
 */
export function resolvePage(routes: RouteMap, rawPath: string) {
  // Normalize: collapse slashes, remove trailing slash, strip query/hash
  let path = rawPath.replace(/\/{2,}/g, "/").replace(/\/+$/, "") || "/";
  path = path.split(/[?#]/)[0];

  //try static route (case-insensitive lookup)
  const staticComponent = routes.static[path.toLowerCase()];
  if (staticComponent) {
    return { component: staticComponent, params: {} };
  }

  //try dynamic routes
  for (const route of routes.dynamic) {
    const match = path.match(route.pattern);
    if (match) {
      const params: Record<string, string> = {};
      route.paramNames.forEach((name, i) => {
        params[name] = match[i + 1];
      });
      return { component: route.component, params: params };
    }
  }

  // 3. Fallback: NotFound or Error
  const NotFound = routes.static["/notfound"];
  if (NotFound) return { component: NotFound, params: {} };

  // Terminal fallback if even /notfound is missing
  return {
    component: () => {
      const el = document.createElement("div");
      el.innerHTML = `<div style="padding: 40px; text-align: center; color: white;">
        <h1>404</h1>
        <p>Route not found and no NotFound page de   fined.</p>
        <a href="/" style="color: cyan;">Return Home</a>
      </div>`;
      return el;
    },
    params: {}
  };
}

// Define which paths require a different layout look
export const isSpecialLayout = (p: string) => {
  const path = p.toLowerCase().split(/[?#]/)[0].replace(/\/+$/, "") || "/";
  const isSpecial = path.startsWith("/game") || path.startsWith("/auth") || path === "/login";
  console.log(`[Router] isSpecialLayout check: "${p}" -> normalized: "${path}" -> result: ${isSpecial}`);
  return isSpecial;
};
