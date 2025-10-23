export function jsxDEV(type: any, props: any) {
	if (typeof type === "function") {
	  return type(props || {});
	}
  
	const el = document.createElement(type);
	console.log("jsx called with:", type, props);

	if (props) {
	  for (const [k, v] of Object.entries(props)) {
		if (k === "children") {
		  if (Array.isArray(v)) v.forEach((c) => append(el, c));
		  else append(el, v);
		} else if (k === "style" && typeof v === "object") {
		  Object.assign(el.style, v);
		} else {
		  (el as any)[k] = v;
		}
	  }
	}
  
	return el;
  }
  
  function append(parent: HTMLElement, child: any) {
	if (child == null) return;
	if (typeof child === "string" || typeof child === "number") {
	  parent.append(document.createTextNode(String(child)));
	} else if (child instanceof Node) {
	  parent.append(child);
	}
  }
  