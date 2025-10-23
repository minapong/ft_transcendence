import { defineConfig } from "vite";

export default defineConfig({
  esbuild: {
	jsx:"automatic",
  	jsxImportSource: "reactor"
  },
  resolve: {
    alias: {
      reactor: "/src/reactor",
      components: "/src/components",
    },
  },
  server: {
    port: 5173,
    open: true,
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
});
