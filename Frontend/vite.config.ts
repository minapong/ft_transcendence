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
			reactor: "/src/reactor",
			components: "/src/components",
			pages: "/src/pages",
			layouts: "/src/layouts",
			"@":"/src",
		},
	},
	server: {
		port: 5173,
		open: false,
	},
	build: {
		outDir: "dist",
		emptyOutDir: true,
	},
	plugins: [tailwindcss()],

});
