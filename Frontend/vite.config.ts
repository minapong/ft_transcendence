import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
	appType: "spa",
	esbuild: {
		jsx: "transform",
		jsxFactory: "createReactor",
		jsxFragment: "Fragment"
	},
	resolve: {
		alias: {
			Reactor: "/src/core/Reactor",
			components: "/src/app/components",
			pages: "/src/app/pages",
			layouts: "/src/app/components/layout",
			"@/app": "/src/app",
			"@/core": "/src/core",
			"@":"/src",
		},
	},
	server: {
		port: 5173,
		open: false,
		proxy: {
		   "/static": {
			target: "http://backend:3000",
			changeOrigin: true,
		   },
		},
	},
	build: {
		outDir: "dist",
		emptyOutDir: true,
	},
	plugins: [tailwindcss()],

});
