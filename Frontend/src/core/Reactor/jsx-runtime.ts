import { createReactor, Fragment } from "./createReactor";

export { Fragment };

export function jsx(type: any, props: any, key?: any) {
    const { children, ...rest } = props || {};
    if (key !== undefined) {
        rest.key = key;
    }

    const childList = Array.isArray(children) ? children : (children !== undefined ? [children] : []);

    return createReactor(type, rest, ...childList);
}

export const jsxs = jsx;
