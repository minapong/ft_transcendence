import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  esbuild: {
	jsx:"transform",
 	jsxFactory: "createReactor",
    jsxFragment: "Fragment"
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
  plugins: [tailwindcss()],

});
