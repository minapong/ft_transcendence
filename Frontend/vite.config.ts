// vite.config.ts
import { defineConfig } from "vite";

export default defineConfig({
  server: {
    port: 5173,
    open: true,
  },
  esbuild: {
    jsx: "transform",
    jsxFactory: "jsx",
    jsxFragment: "Fragment",
    jsxImportSource: "reactor",
    // jsxInject: `import { jsx } from "reactor/jsx-runtime"`,
  },
  resolve: {
    alias: {
      reactor: "/src/reactor",
      components: "/src/components",
    },
  },
});
