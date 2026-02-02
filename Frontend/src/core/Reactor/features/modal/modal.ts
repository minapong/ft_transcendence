// registry definition moved here to avoid circular dependency issues
export type ModalRenderer<T = unknown> = (payload: T) => any;
var registry: Map<string, ModalRenderer<any>> | undefined;

function getRegistry() {
  if (!registry) registry = new Map<string, ModalRenderer<any>>();
  return registry;
}


const LAYOUT_KEY = "__layout__";

export type ModalDescriptor<T = unknown> = {
  type: string;
  payload?: T;
  render?: ModalRenderer<T>;
  label?: string;
  className?: string;
};



let currentModal: ModalDescriptor | null = null;
// registry imported above
let requestRerender: (triggerKey?: string) => void = () => { };

export function getCurrentModal() {
  return currentModal;
}

export function openModal<T>(modal: ModalDescriptor<T>) {
  if (!modal || !modal.type) return;
  currentModal = modal;
  const registryMap = getRegistry();
  if (!modal.render && !registryMap.has(modal.type)) {
    console.warn(`[modal] Missing renderer for type "${modal.type}"`);
  }
  requestRerender(LAYOUT_KEY);
  window.dispatchEvent(new Event("pong:pause"));
}

export function closeModal() {
  if (!currentModal) return;
  currentModal = null;
  requestRerender(LAYOUT_KEY);
}

export function registerModal<T>(type: string, renderer: ModalRenderer<T>) {
  getRegistry().set(type, renderer as ModalRenderer<any>);
}

export function resolveModalRenderer(modal: ModalDescriptor | null) {
  if (!modal) return null;
  if (typeof modal.render === "function") return modal.render;
  return getRegistry().get(modal.type) ?? null;
}

// Allow tests (or advanced hosts) to control how a re-render is requested.
export function setModalRerender(fn: (triggerKey?: string) => void) {
  requestRerender = fn;
}
