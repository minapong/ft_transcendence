# Frontend Dev Notes

Quick commands and references for debugging the frontend build and JSX output.

## List Source Files (no node_modules)

```bash
find . -type d -name "node_modules" -prune -false -o \
  \( -name "*.tsx" -o -name "*.ts" -o -name "*.config.*" \) -print
```

## Vite Transform Debug

```bash
npx vite --debug transform
```

## Build + Watch

```bash
npx vite build --watch
```

## JSX Transform Notes

Vite uses the custom JSX factory configured in `Frontend/vite.config.ts`:

```ts
esbuild: {
  jsx: "transform",
  jsxFactory: "createReactor",
  jsxFragment: "Fragment"
}
```

This means JSX compiles to calls like:

```ts
createReactor("div", null, "Hello")
```
