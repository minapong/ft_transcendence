import { registerModal, openModal, closeModal } from "Reactor";

registerModal("demo", (payload) => (
  <div className="space-y-3">
    <h2 className="text-xl font-semibold">{payload.title}</h2>
    <p>{payload.body}</p>
    <button className="bleed-btn px-3 py-2 rounded-md" onClick={closeModal}>
      Close
    </button>
  </div>
));

export default function PageButton() {
  return (
    <button
      className="bleed-btn px-3 py-2 rounded-md"
      onClick={() => openModal({ type: "demo", payload: { title: "Hello", body: "This lives in the global slot." } })}
    >
      Open demo modal
    </button>
  );
}