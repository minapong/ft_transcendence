// ==========================================
// Minimal Hook System
// ==========================================

// Track which component is rendering right now
let currentComponent: any = null;

// Store hooks per component function
const componentHooks = new WeakMap<any, any[]>();

export function withHooks(componentFn: Function) {
  return function wrapped(props: any = {}) {
    // Store latest props so we can re-render later
    (wrapped as any).lastProps = props;
    
    currentComponent = wrapped;
    
    if (!componentHooks.has(wrapped)) componentHooks.set(wrapped, []);
    (wrapped as any).hooks = componentHooks.get(wrapped);
    (wrapped as any).index = 0;
    
    const result = componentFn(props);
    
    currentComponent = null;
    
    return result;
  };
}

// --------------------------
// useState
// --------------------------
export function useState<T>(initial: T): [T, (newVal: T | ((prev: T) => T)) => void] {
  if (!currentComponent) {
    throw new Error("useState must be called during component render");
  }
  
  const component = currentComponent; // Capture the component reference
  const hooks = component.hooks;
  const idx = component.index++;
  
  if (hooks[idx] === undefined) hooks[idx] = initial;
  
  const setState = (newVal: T | ((prev: T) => T)) => {
    // Use the captured component reference, not currentComponent
    hooks[idx] =
      typeof newVal === "function" ? (newVal as any)(hooks[idx]) : newVal;
    
    const root = document.getElementById("spa-root");
    if (root && component.lastProps !== undefined) {
      // Re-render by calling the wrapped component
      root.replaceChildren(component(component.lastProps));
    }
  };
  
  return [hooks[idx] as T, setState];
}

// --------------------------
// useEffect
// --------------------------
export function useEffect(fn: Function, deps: any[]) {
  if (!currentComponent) {
    throw new Error("useEffect must be called during component render");
  }
  
  const hooks = currentComponent.hooks;
  const idx = currentComponent.index++;
  const prevDeps = hooks[idx];
  
  let changed = true;
  if (prevDeps) {
    changed = deps.some((d, i) => d !== prevDeps[i]);
  }
  
  if (changed) {
    setTimeout(() => {
      const cleanup = fn();
      // Store cleanup function if returned
      if (typeof cleanup === "function") {
        hooks[idx + "_cleanup"] = cleanup;
      }
    }, 0); // async like React
    hooks[idx] = deps;
  }
}