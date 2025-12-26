import { registerModal, openModal, closeModal } from "Reactor";

type DemoPayload = {
  title: string;
  body: string;
};

registerModal<DemoPayload>("demo", (payload) => (
  <div className="space-y-3">
    <h2 className="text-xl font-semibold">{payload.title}</h2>
    <p>{payload.body}</p>
    <button className="bleed-btn px-3 py-2 rounded-md" onClick={closeModal}>
      Close
    </button>
  </div>
));

export default function PageButton() {
  const payload: DemoPayload = {
    title: "Hello",
    body: "This lives in the global slot.",
  };

  return (
    <button
      className="bleed-btn px-3 py-2 rounded-md"
      onClick={() => openModal<DemoPayload>({ type: "demo", payload, label: payload.title })}
    >
      Open demo modal
    </button>
  );
}
