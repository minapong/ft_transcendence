// just for  the sake of intellisense
declare module "reactor/jsx-runtime" {
	export function jsx(type: any, props: any): any;
	export function jsxs(type: any, props: any): any;
}
// just for  the sake of intellisense

declare module "reactor/createReactor" {
	export function createReactor(type: any, props: any): any;
}
declare module "reactor/router" {
	export function createRouter(type: any, props: any): any;
}

//for dev mode
declare module "reactor/jsx-dev-runtime" {
	export const jsx: any;
	export const jsxs: any;
	export const jsxDEV: any;
	export const Fragment: any;
  }
  