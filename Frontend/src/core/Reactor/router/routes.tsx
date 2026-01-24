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
    let route = filePath
      .replace("/src/app/pages", "")
      .replace(/index\.tsx$/, "")
      .replace(/\.tsx$/, "");
    
    // Normalize trailing slash
    if (route.endsWith("/")) route = route.slice(0, -1);
    if (route === "") route = "/";

    const component = (pages[filePath] as any).default;

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
  
  console.log("🧭 static routes:", Object.keys(staticRoutes));
  console.log("🧭 dynamic routes:", dynamicRoutes.map(r => r.path));
  
  return cache;
}

/**
 * Resolves a URL path to a component.
 * Static routes checked first, then dynamic patterns.
 */
export function resolvePage(routes: RouteMap, rawPath: string) {
  const original = rawPath;
  
  // Normalize: collapse slashes, remove trailing slash, strip query/hash
  let path = rawPath.replace(/\/{2,}/g, "/").replace(/\/+$/, "") || "/";
  if (original !== path) history.replaceState({}, "", path);
  path = path.split(/[?#]/)[0];

  // 1. Try static route (case-insensitive lookup)
  const staticComponent = routes.static[path.toLowerCase()];
  if (staticComponent) {
    return staticComponent;
  }

  // 2. Try dynamic routes
  for (const route of routes.dynamic) {
    const match = path.match(route.pattern);
    if (match) {
      // Extract params from capture groups
      const params: Record<string, string> = {};
      route.paramNames.forEach((name, i) => {
        params[name] = match[i + 1];
      });
      
      // Return component with params injected
      return () => route.component(params);
    }
  }

  // 3. Not found
  return routes.static["/notfound"];
}
