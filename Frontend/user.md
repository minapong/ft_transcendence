list all content of tsx and ts and config files

find . -type d -name "node_modules" -prune -false -o \( -name  '*.tsx' -o -name '*.ts' -o -name 'config' \) -exec echo '=====' {} \; -exec cat {} \;

debug live output on website after compilation

npx vite --debug transform

build and output in dist folder with watching

npx vite build --watch


this comes from viteconfig jsx: "automatic"

import {jsxDEV} from "/src/reactor/jsx-dev-runtime.tsx";
function Greeting() {
    return /* @__PURE__ */
    jsxDEV("div", {
        children: /* @__PURE__ */
        jsxDEV("h1", {
            children: "jksdfklasd"
        }, void 0, false, {
            fileName: "/Users/mhashir/Desktop/Ft_Transcendence/frontend/src/components/Greeting.tsx",
            lineNumber: 11,
            columnNumber: 3
        }, this)
    }, void 0, false, {
        fileName: "/Users/mhashir/Desktop/Ft_Transcendence/frontend/src/components/Greeting.tsx",
        lineNumber: 10,
        columnNumber: 4
    }, this);
}
export default Greeting;


this comes from transform

function Greeting() {
    return /* @__PURE__ */
    createIt("div", null, /* @__PURE__ */
    createIt("h1", null, "jksdfklasd"));
}
export default Greeting;
