import { useState } from "Reactor";

type RoleNode = {
  id: string;
  title: string;
  people: string;
  initials: string;
  glyph: string;
  responsibilities: string[];
  authority: string;
  decisions: string;
  ownership: string;
};

type Signal = {
  label: string;
  status: string;
  detail: string;
};

type TimelineEvent = {
  title: string;
  date: string;
  outcome: string;
};

const roleNodes: RoleNode[] = [
  {
    id: "po",
    title: "Product Owner / PM",
    people: "Malik Hashir",
    initials: "MH",
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
    initials: "AR",
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
    title: "Technical Leads",
    people: "Santiago & Natalia",
    initials: "SN",
    glyph: "◇",
    responsibilities: [
      "Define system boundaries and architectural standards.",
      "Own AI, data integrity, and infrastructure decisions.",
      "Review critical code paths and performance risks.",
    ],
    authority: "Final technical approval for architecture and data safety.",
    decisions: "Approve structural changes and high-impact refactors.",
    ownership: "Accountable for system integrity and maintainability.",
  },
  {
    id: "devs",
    title: "Developers",
    people: "All Team Members",
    initials: "ALL",
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

const evaluationSignals: Signal[] = [
  {
    label: "Defense Passed",
    status: "Stable",
    detail: "Core systems defended under evaluation constraints.",
  },
  {
    label: "Module Coverage",
    status: "13 / 14",
    detail: "Completed modules aligned with requirement tracking.",
  },
  {
    label: "Reviewer Feedback",
    status: "Positive",
    detail: "Architecture and gameplay loop praised for clarity.",
  },
];

const timeline: TimelineEvent[] = [
  {
    title: "Project Lock",
    date: "Day 0",
    outcome: "Roles assigned, scope fixed.",
  },
  {
    title: "Defense",
    date: "Day 9",
    outcome: "Gameplay + platform demo validated.",
  },
  {
    title: "Peer Review",
    date: "Day 10",
    outcome: "Architecture reviewed, improvements queued.",
  },
  {
    title: "Final Score",
    date: "Day 11",
    outcome: "Evaluation-ready status confirmed.",
  },
];

export default function Contact() {
  const [activeRoleId, setActiveRoleId] = useState(roleNodes[0]?.id ?? "po");
  const activeRole = roleNodes.find((role) => role.id === activeRoleId) ?? roleNodes[0];

  return (
    <div className="contact-page">
      <div className="contact-shell">
        <header className="contact-hero panel-surface">
          <div className="contact-hero__heading">
            <p className="contact-eyebrow">Project Governance</p>
            <h1 className="contact-title">ft_transcendence</h1>
          </div>
          <p className="contact-subtitle">
            A live record of how this team operated, owned responsibility, and
            delivered under evaluation.
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

        <section className="contact-map" aria-label="Contributor signal map">
          <div className="contact-orbit" aria-hidden="true">
            <span className="contact-orbit__ring"></span>
            <span className="contact-orbit__ring contact-orbit__ring--inner"></span>
          </div>
          <div className="contact-center panel-surface">
            <p className="contact-center__eyebrow">Mission Core</p>
            <h2 className="contact-center__title">ft_transcendence</h2>
            <p className="contact-center__subtitle">Team signal map</p>
          </div>
          <div className="contact-nodes">
            {roleNodes.map((role) => {
              const isActive = role.id === activeRoleId;
              return (
                <button
                  key={role.id}
                  type="button"
                  className={`contact-node contact-node--${role.id}${isActive ? " contact-node--active" : ""}`}
                  onClick={() => setActiveRoleId(role.id)}
                  aria-pressed={isActive}
                >
                  <span className="contact-node__glyph" aria-hidden="true">
                    {role.glyph}
                  </span>
                  <span className="contact-node__initials">{role.initials}</span>
                  <span className="contact-node__title">{role.title}</span>
                  <span className="contact-node__people">{role.people}</span>
                </button>
              );
            })}
          </div>
          <div className="contact-detail panel-surface" role="region" aria-live="polite">
            <div className="contact-detail__header">
              <div>
                <p className="contact-detail__eyebrow">Responsibility Zone</p>
                <h3 className="contact-detail__title">{activeRole.title}</h3>
                <p className="contact-detail__people">{activeRole.people}</p>
              </div>
              <span className="contact-detail__glyph" aria-hidden="true">
                {activeRole.glyph}
              </span>
            </div>
            <div className="contact-detail__section">
              <h4>Core responsibilities</h4>
              <ul>
                {activeRole.responsibilities.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="contact-detail__meta">
              <div>
                <h5>Authority scope</h5>
                <p>{activeRole.authority}</p>
              </div>
              <div>
                <h5>Decision power</h5>
                <p>{activeRole.decisions}</p>
              </div>
              <div>
                <h5>Failure ownership</h5>
                <p>{activeRole.ownership}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="contact-signals">
          <div className="contact-section panel-surface">
            <h2 className="contact-section__title">Evaluation Signals</h2>
            <div className="contact-signal-grid">
              {evaluationSignals.map((signal) => (
                <div key={signal.label} className="contact-signal">
                  <div className="contact-signal__badge">{signal.status}</div>
                  <h3>{signal.label}</h3>
                  <p>{signal.detail}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="contact-section panel-surface">
            <h2 className="contact-section__title">Evaluation Timeline</h2>
            <ol className="contact-timeline">
              {timeline.map((event) => (
                <li key={event.title} className="contact-timeline__item">
                  <div className="contact-timeline__dot"></div>
                  <div>
                    <h3>{event.title}</h3>
                    <p className="contact-timeline__meta">{event.date}</p>
                    <p>{event.outcome}</p>
                  </div>
                </li>
              ))}
            </ol>
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
