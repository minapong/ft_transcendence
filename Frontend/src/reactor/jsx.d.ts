declare module "reactor/jsx-runtime" {
	export function jsx(type: any, props: any): any;
	export function jsxs(type: any, props: any): any;
  }
  
  declare module "reactor/jsx-dev-runtime" {
	export function jsxDEV(type: any, props: any): any;
  }
  