const roleSections = [
  {
    title: "Product Owner / Project Manager (PO)",
    person: "Malik Hashir",
    responsibilities: [
      "Defined product vision and scope",
      "Prioritized features and modules",
      "Validated work before integration",
      "Represented the project during evaluation",
    ],
  },
  {
    title: "Scrum Master",
    person: "Abdul Rehman",
    responsibilities: [
      "Planned sprints and task breakdown",
      "Tracked progress and blockers",
      "Coordinated between gameplay and platform work",
    ],
  },
  {
    title: "Technical Leads / Architects",
    person: "Santiago & Natalia",
    responsibilities: [
      "Designed system architecture",
      "Defined module boundaries",
      "Owned data, AI, and infrastructure decisions",
      "Reviewed critical code paths",
    ],
  },
  {
    title: "Developers",
    person: "All Team Members",
    responsibilities: [
      "Implemented assigned features",
      "Tested and validated components",
      "Contributed to documentation",
    ],
  },
];

export default function Contact() {
  return (
    <div className="contact-page">
      <div className="contact-shell">
        <header className="contact-hero panel-surface">
          <p className="contact-eyebrow">ft_transcendence Submission</p>
          <h1 className="contact-title">Project Governance & Team Structure</h1>
          <p className="contact-subtitle">
            Clear role ownership and responsibility model for the ft_transcendence
            project.
          </p>
        </header>

        <section className="contact-section" aria-label="Role hierarchy">
          <h2 className="contact-section__title">Role hierarchy</h2>
          <div className="contact-roles">
            {roleSections.map((role) => (
              <article key={role.title} className="contact-role">
                <div className="contact-role__header">
                  <h3 className="contact-role__title">{role.title}</h3>
                  <p className="contact-role__person">{role.person}</p>
                </div>
                <ul className="contact-role__list">
                  {role.responsibilities.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="contact-section panel-surface">
          <h2 className="contact-section__title">Decision Responsibility Model</h2>
          <div className="contact-copy">
            <p>
              Product scope and priorities were finalized by the Product Owner.
            </p>
            <p>
              Technical architecture decisions were validated by Technical Leads.
            </p>
            <p>Process and sprint flow were enforced by the Scrum Master.</p>
            <p>
              Implementation was carried out collaboratively by all developers.
            </p>
          </div>
        </section>

        <section className="contact-section panel-surface">
          <h2 className="contact-section__title">Contribution Transparency</h2>
          <p className="contact-copy">
            Each role reflects real responsibilities held during development. All
            team members are able to explain and defend the parts of the system
            they worked on during evaluation.
          </p>
        </section>
      </div>
    </div>
  );
}
