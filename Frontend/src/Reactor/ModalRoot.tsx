import { closeModal, getCurrentModal, resolveModalRenderer } from "./modal";
import { useEffect } from "./hooks";
import type { ModalDescriptor } from "./modal";

// Renders the single global modal slot backed by Reactor's modal state.
export default function ModalRoot() {
  const modal = getCurrentModal();
  const renderer = resolveModalRenderer(modal);

  useEffect(() => {
    if (!modal) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeModal();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [modal]);

  const isOpen = Boolean(modal);
  const layerClass = isOpen ? "modal-layer modal-layer--open" : "modal-layer";

  if (!isOpen) {
    return <div id="modal-root" className={layerClass} aria-hidden="true" />;
  }

  const content = renderer
    ? renderer(modal!.payload ?? {})
    : renderFallback(modal!);

  return (
    <div id="modal-root" className={layerClass} role="presentation">
      <div className="modal-backdrop" onClick={closeModal}></div>
      <div
        className="modal-panel panel-surface"
        role="dialog"
        aria-modal="true"
        aria-label={modal.type}
      >
        <button
          type="button"
          className="modal-close"
          aria-label="Close modal"
          onClick={closeModal}
        >
            x
        </button>
        {content}
      </div>
    </div>
  );
}

function renderFallback(modal: ModalDescriptor) {
  return (
    <div className="flex flex-col gap-2 text-sm">
      <p className="font-semibold">Missing modal renderer</p>
      <p className="text-slate-300">Type: {modal.type}</p>
    </div>
  );
}
