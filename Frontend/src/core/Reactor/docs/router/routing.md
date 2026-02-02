# Reactor Router — How Routing Works

## Overview

Reactor uses **file-based routing**. The filesystem determines your routes automatically — no config files needed.

```
pages/dashboard.tsx     →  /dashboard
pages/auth/[mode].tsx   →  /auth/:mode
pages/user/[id].tsx     →  /user/:id (dynamic)
```

---

## Route Discovery

At build time, Vite scans the pages directory:

```ts
const pages = import.meta.glob("/src/app/pages/**/*.tsx", { eager: true });
```

This returns an object like:

```ts
{
  "/src/app/pages/dashboard.tsx": { default: DashboardComponent },
  "/src/app/pages/auth/[mode].tsx": { default: AuthComponent },
  "/src/app/pages/user/[id].tsx": { default: UserComponent },
}
```

---

## Static Routes

### How They Work

1. File path → route path transformation:
   ```
   /src/app/pages/dashboard.tsx
         ↓ remove prefix
   /dashboard.tsx
         ↓ remove .tsx
   /dashboard
   ```

2. Stored in a simple lookup table:
   ```ts
  staticRoutes = {
    "/dashboard": DashboardComponent,
    "/": IndexComponent,
  }
   ```

3. Resolution is O(1) — direct key lookup (case-insensitive)

### Special Cases

| File | Route |
|------|-------|
| `pages/index.tsx` | `/` |
| `pages/auth/index.tsx` | `/auth` |
| `pages/NotFound.tsx` | `/notfound` |

---

## Dynamic Routes

### Convention

Use `[param]` in the filename:

```
pages/user/[id].tsx        →  /user/:id
pages/post/[slug].tsx      →  /post/:slug
pages/[category]/[id].tsx  →  /:category/:id
```

### How They Work

1. Detect `[` in route path
2. Extract param names and build regex:
   ```
   /user/[id]
         ↓
   pattern: ^/user/([^/]+)$
   paramNames: ["id"]
   ```

3. Store as RouteEntry:
   ```ts
   {
     component: UserComponent,
     pattern: /^\/user\/([^/]+)$/i,
     paramNames: ["id"],
     path: "/user/[id]"
   }
   ```

### Multiple Params

```
pages/[category]/[id]/edit.tsx
         ↓
pattern: ^/([^/]+)/([^/]+)/edit$
paramNames: ["category", "id"]
```

Visiting `/electronics/42/edit`:

```ts
params = { category: "electronics", id: "42" }
```

---

## Resolution Order

```ts
function resolvePage(routes, rawPath) {
  // 1. Normalize path
  path = normalize(rawPath);

  // 2. Try static routes first (fast, O(1))
  if (routes.static[path]) {
    return routes.static[path];
  }

  // 3. Try dynamic routes (regex matching)
  for (const route of routes.dynamic) {
    const match = path.match(route.pattern);
    if (match) {
      // Extract params and inject into component
      return () => route.component(params);
    }
  }

  // 4. Not found
  return routes.static["/notfound"];
}
```

**Why static first?**
- Static lookup is O(1)
- Dynamic requires iterating and regex matching
- Static routes are more common

---

## Path Normalization

Before matching, paths are normalized:

```ts
rawPath
  .replace(/\/{2,}/g, "/")    // //foo//bar → /foo/bar
  .replace(/\/+$/, "")         // /foo/ → /foo
  .split(/[?#]/)[0]            // /foo?bar → /foo
```

| Input | Normalized |
|-------|------------|
| `/user//123` | `/user/123` |
| `/dashboard/` | `/dashboard` |
| `/page?query=1` | `/page` |
| `//` | `/` |

---

## Param Injection

Dynamic components receive params as props:

```tsx
// pages/user/[id].tsx
export default function UserProfile({ id }: { id: string }) {
  return <div>User: {id}</div>;
}
```

---

## Caching

Routes are computed once and cached:

```ts
let cache: RouteMap | null = null;

function getRoutes() {
  if (cache) return cache;
  // ... build routes ...
  cache = { static, dynamic };
  return cache;
}
```

---

## Adding Routes

### Static Route

1. Create file: `pages/about.tsx`
2. Export default component
3. Visit `/about`

### Dynamic Route

1. Create file: `pages/post/[slug].tsx`
2. Accept params in component
3. Visit `/post/hello-world`

### Nested Dynamic Route

1. Create file: `pages/user/[id]/settings.tsx`
2. Accept params
3. Visit `/user/123/settings`

---

## Limitations

1. No catch-all routes (`[...slug]`)
2. No optional params (`[[id]]`)
3. No route guards (implement in components)
4. Case-insensitive matching
