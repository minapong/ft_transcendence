export function jsx(type: any, props: any, key?: any) {
	return { type, props, key };
}

export const jsxs = jsx;
export const Fragment = (props: { children: any }) => props.children;
