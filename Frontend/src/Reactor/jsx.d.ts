// Provides type declarations for the custom JSX runtime.
declare module "reactor/jsx-runtime" {
	export function jsx(type: any, props: any): any;
	export function jsxs(type: any, props: any): any;
}

// Provides type declarations for the createReactor function.
declare module "reactor/createReactor" {
	export function createReactor(type: any, props: any): any;
}

// Provides type declarations for the custom router.
declare module "reactor/router" {
	export function createRouter(type: any, props: any): any;
}


