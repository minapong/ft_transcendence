import { useState } from "Reactor";

type RoleDetail = {
  id: string;
  title: string;
  people: string;
  glyph: string;
  responsibilities: string[];
  authority: string;
  decisions: string;
  ownership: string;
};

const roleDetails: RoleDetail[] = [
  {
    id: "po",
    title: "Product Owner / Project Manager (PO)",
    people: "Malik Hashir",
    glyph: "◎",
    responsibilities: [
      "Owns product scope and final feature decisions.",
      "Sets the release priority for modules and milestones.",
      "Validates integration readiness before merge.",
    ],
    authority: "Final authority on scope, timeline, and evaluation readiness.",
    decisions: "Approves or rejects feature inclusion for evaluation.",
    ownership: "Accountable for delivery promises and evaluator alignment.",
  },
  {
    id: "scrum",
    title: "Scrum Master",
    people: "Abdul Rehman",
    glyph: "△",
    responsibilities: [
      "Owns sprint planning and task decomposition.",
      "Tracks blockers and enforces delivery cadence.",
      "Ensures gameplay and platform systems stay synchronized.",
    ],
    authority: "Controls sprint execution flow and task sequencing.",
    decisions: "Escalates scope risk and rebalances sprint capacity.",
    ownership: "Accountable for iteration rhythm and cross-team alignment.",
  },
  {
    id: "leads",
    title: "Technical Leads / Architects",
    people: "Santiago & Natalia",
    glyph: "◇",
    responsibilities: [
      "Define system boundaries and architectural standards.",
      "Own AI, data integrity, and infrastructure decisions.",
      "Review critical code paths and performance risks.",
    ],
    authority: "Final technical approval for architecture and data safety.",
    decisions: "Approve structural changes and high-impact refactors.",
    ownership: "Accountable for system integrity and long-term maintainability.",
  },
  {
    id: "devs",
    title: "Developers",
    people: "All Team Members",
    glyph: "□",
    responsibilities: [
      "Deliver assigned features with acceptance criteria met.",
      "Validate behavior through manual and automated checks.",
      "Document implementation decisions for evaluation clarity.",
    ],
    authority: "Execution authority within assigned modules.",
    decisions: "Select implementation approaches within approved design.",
    ownership: "Accountable for correctness, stability, and documentation.",
  },
];

export default function Contact() {
  const [activeRoleId, setActiveRoleId] = useState(roleDetails[0]?.id ?? "po");
  const activeRole = roleDetails.find((role) => role.id === activeRoleId) ?? roleDetails[0];

  return (
    <div className="contact-page">
      <div className="contact-shell">
        <header className="contact-hero panel-surface">
          <div className="contact-hero__heading">
            <p className="contact-eyebrow">Project Governance</p>
            <h1 className="contact-title">ft_transcendence</h1>
          </div>
          <p className="contact-subtitle">
            Clear role ownership and responsibility model for the ft_transcendence
            project.
          </p>
          <div className="contact-status">
            <span className="contact-status__item">
              <span className="contact-status__dot contact-status__dot--ok"></span>
              System stable
            </span>
            <span className="contact-status__item">
              <span className="contact-status__dot contact-status__dot--locked"></span>
              Roles locked
            </span>
            <span className="contact-status__item">
              <span className="contact-status__dot contact-status__dot--ready"></span>
              Evaluation-ready
            </span>
          </div>
        </header>

        <section className="contact-matrix" aria-label="Role matrix">
          <div className="contact-nodes" role="tablist" aria-label="Role nodes">
            {roleDetails.map((role) => {
              const isActive = role.id === activeRoleId;
              return (
                <button
                  key={role.id}
                  type="button"
                  className={`contact-node${isActive ? " contact-node--active" : ""}`}
                  onClick={() => setActiveRoleId(role.id)}
                  aria-pressed={isActive}
                >
                  <span className="contact-node__glyph" aria-hidden="true">
                    {role.glyph}
                  </span>
                  <div className="contact-node__content">
                    <span className="contact-node__title">{role.title}</span>
                    <span className="contact-node__people">{role.people}</span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="contact-detail panel-surface" role="region" aria-live="polite">
            <div className="contact-detail__header">
              <div>
                <p className="contact-detail__eyebrow">Responsibility Zone</p>
                <h2 className="contact-detail__title">{activeRole.title}</h2>
                <p className="contact-detail__people">{activeRole.people}</p>
              </div>
              <span className="contact-detail__glyph" aria-hidden="true">
                {activeRole.glyph}
              </span>
            </div>

            <div className="contact-detail__section">
              <h3>Core responsibilities</h3>
              <ul>
                {activeRole.responsibilities.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="contact-detail__meta">
              <div>
                <h4>Authority scope</h4>
                <p>{activeRole.authority}</p>
              </div>
              <div>
                <h4>Decision power</h4>
                <p>{activeRole.decisions}</p>
              </div>
              <div>
                <h4>Failure ownership</h4>
                <p>{activeRole.ownership}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="contact-section panel-surface">
          <h2 className="contact-section__title">Decision Responsibility Model</h2>
          <div className="contact-copy">
            <p>Product scope and priorities are finalized by the Product Owner.</p>
            <p>Technical architecture decisions are validated by Technical Leads.</p>
            <p>Process cadence and delivery flow are enforced by the Scrum Master.</p>
            <p>Implementation is carried out collaboratively by all developers.</p>
          </div>
        </section>

        <section className="contact-section panel-surface">
          <h2 className="contact-section__title">Contribution Transparency</h2>
          <p className="contact-copy">
            Each role reflects real responsibilities held during development. Every
            member can explain and defend the system segments they delivered during
            evaluation.
          </p>
        </section>
      </div>
    </div>
  );
}
