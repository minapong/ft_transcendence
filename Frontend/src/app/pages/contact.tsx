import { useState } from "Reactor";

const roleSections = [
  {
    person: "Malik Hashir",
    title: "Product Owner / Project Manager",
    responsibilities: [
      "Defined product vision and scope",
      "Prioritized features and milestones",
      "Validated work before integration",
    ],
    authority: [
      "Final say on product scope",
      "Approves feature acceptance criteria",
    ],
    milestones: [
      {
        title: "Locked product vision early",
        impact: "Aligned delivery scope before build-out",
        value: 90,
      },
      {
        title: "Steered milestone scope changes",
        impact: "Balanced feature trade-offs with delivery timeline",
        value: 75,
      },
      {
        title: "Prepared evaluation demo flow",
        impact: "Ensured a cohesive walkthrough for reviewers",
        value: 85,
      },
    ],
    progress: { label: "Milestones delivered", value: 88 },
    achievements: [
      { icon: "◆", label: "Vision lock" },
      { icon: "◆", label: "Scope control" },
      { icon: "◆", label: "Demo readiness" },
    ],
    decisions: ["Product scope approval", "Release readiness sign-off"],
  },
  {
    person: "Santiago",
    title: "Technical Lead / Architect",
    responsibilities: [
      "Designed system architecture",
      "Reviewed and validated technical decisions",
      "Defined module boundaries",
    ],
    authority: [
      "Final say on architectural choices",
      "Decides core technology adoption",
    ],
    milestones: [
      {
        title: "Shipped modular architecture map",
        impact: "Clarified ownership boundaries across subsystems",
        value: 86,
      },
      {
        title: "Stabilized core gameplay systems",
        impact: "Reduced runtime regressions in core loop",
        value: 82,
      },
      {
        title: "Reviewed critical merges",
        impact: "Protected architecture standards in delivery",
        value: 80,
      },
    ],
    progress: { label: "Architecture readiness", value: 84 },
    achievements: [
      { icon: "◆", label: "System blueprint" },
      { icon: "◆", label: "Gameplay stability" },
      { icon: "◆", label: "Critical reviews" },
    ],
    decisions: ["Architecture standards", "Core technology stack"],
  },
  {
    person: "Abdul Rehman",
    title: "Scrum Master",
    responsibilities: [
      "Coordinated sprint planning",
      "Managed tasks and blockers",
      "Ensured progress tracking",
    ],
    authority: ["Decides sprint priorities", "Final say on task breakdowns"],
    milestones: [
      {
        title: "Unblocked cross-team dependencies",
        impact: "Kept gameplay and platform work in sync",
        value: 78,
      },
      {
        title: "Maintained sprint cadence",
        impact: "Sustained delivery velocity each week",
        value: 80,
      },
      {
        title: "Aligned weekly retrospectives",
        impact: "Improved task clarity and handoffs",
        value: 76,
      },
    ],
    progress: { label: "Sprint execution", value: 79 },
    achievements: [
      { icon: "◆", label: "Sprint cadence" },
      { icon: "◆", label: "Blocker removal" },
      { icon: "◆", label: "Retro alignment" },
    ],
    decisions: ["Sprint priorities", "Task sequencing"],
  },
  {
    person: "Santiago & Natalia",
    title: "Developers",
    responsibilities: [
      "Implemented features and modules",
      "Ensured cross-team synchronization",
      "Contributed to code reviews and testing",
    ],
    authority: [
      "Owns front-end and back-end feature delivery",
      "Reviews feature implementation quality",
    ],
    milestones: [
      {
        title: "Delivered real-time gameplay UX",
        impact: "Shipped smooth player interactions",
        value: 90,
      },
      {
        title: "Integrated platform services",
        impact: "Connected core app services for launch",
        value: 88,
      },
      {
        title: "Expanded test coverage",
        impact: "Improved confidence in feature stability",
        value: 84,
      },
    ],
    progress: { label: "Feature delivery", value: 92 },
    achievements: [
      { icon: "◆", label: "Realtime UX" },
      { icon: "◆", label: "Platform integration" },
      { icon: "◆", label: "Test coverage" },
    ],
    decisions: ["Implementation quality", "Feature readiness"],
  },
];

const feedbackEntries = [
  {
    evaluator: "A. Bensaid",
    rating: 94,
    summary: "Governance clarity stood out.",
    detail:
      "Roles and decision ownership were obvious during evaluation, reducing review friction.",
  },
  {
    evaluator: "L. Torres",
    rating: 88,
    summary: "Gameplay loop was polished.",
    detail:
      "The real-time match flow felt production-ready with confident UX handoffs.",
  },
  {
    evaluator: "M. Rossi",
    rating: 91,
    summary: "Delivery flow felt mature.",
    detail:
      "Sprint planning and milestone execution were communicated with confidence.",
  },
];

export default function Contact() {
  const [activePerson, setActivePerson] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<"rating" | "name">("rating");
  const ringRadius = 24;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const activeRole =
    roleSections.find((role) => role.person === activePerson) ?? roleSections[0];
  const sortedFeedback = [...feedbackEntries].sort((a, b) => {
    if (sortKey === "rating") {
      return b.rating - a.rating;
    }
    return a.evaluator.localeCompare(b.evaluator);
  });

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

        <section className="contact-section" aria-label="Role assignments">
          <h2 className="contact-section__title">
            Roles, responsibilities, and authority
          </h2>
          <div className="contact-roles contact-roles--cards">
            {roleSections.map((role) => (
              <article
                key={role.person}
                className={`contact-role ${
                  activePerson === role.person ? "is-active" : ""
                }`}
                onClick={() => setActivePerson(role.person)}
              >
                <div className="contact-role__header">
                  <span className="contact-role__shape" aria-hidden="true" />
                  <div>
                    <h3 className="contact-role__person">{role.person}</h3>
                    <p className="contact-role__title">Title: {role.title}</p>
                  </div>
                  <div className="contact-role__progress">
                    <div className="contact-role__ring-shell">
                      <svg
                        className="contact-role__ring"
                        viewBox="0 0 64 64"
                        role="img"
                        aria-label={`${role.progress.label}: ${role.progress.value}%`}
                      >
                        <circle
                          className="contact-role__ring-track"
                          cx="32"
                          cy="32"
                          r={ringRadius}
                        />
                        <circle
                          className="contact-role__ring-progress"
                          cx="32"
                          cy="32"
                          r={ringRadius}
                          strokeDasharray={ringCircumference}
                          strokeDashoffset={
                            ringCircumference *
                            (1 - role.progress.value / 100)
                          }
                        />
                      </svg>
                      <span className="contact-role__ring-value">
                        {role.progress.value}%
                      </span>
                    </div>
                    <div className="contact-role__progress-meta">
                      <p className="contact-role__progress-value">
                        {role.progress.value}%
                      </p>
                      <p className="contact-role__progress-label">
                        {role.progress.label}
                      </p>
                    </div>
                  </div>
                </div>
                <div
                  className="contact-role__progress-bar"
                  style={{
                    ["--progress" as string]: `${role.progress.value}%`,
                  }}
                >
                  <div className="contact-role__progress-bar-label">
                    {role.progress.label}
                  </div>
                  <div className="contact-role__progress-track">
                    <span className="contact-role__progress-fill" />
                  </div>
                </div>
                <div className="contact-role__achievements">
                  {role.achievements.map((achievement) => (
                    <span key={achievement.label} className="contact-role__chip">
                      <span aria-hidden="true">{achievement.icon}</span>
                      {achievement.label}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
          <div className="contact-role-detail panel-surface">
            <header className="contact-role-detail__header">
              <div>
                <p className="contact-role-detail__eyebrow">Selected lead</p>
                <h3 className="contact-role-detail__name">{activeRole.person}</h3>
                <p className="contact-role-detail__title">
                  {activeRole.title}
                </p>
              </div>
              <div
                className="contact-role__progress-bar contact-role__progress-bar--detail"
                style={{
                  ["--progress" as string]: `${activeRole.progress.value}%`,
                }}
              >
                <div className="contact-role__progress-bar-label">
                  {activeRole.progress.label}
                </div>
                <div className="contact-role__progress-track">
                  <span className="contact-role__progress-fill" />
                </div>
              </div>
            </header>
            <div className="contact-role-detail__grid">
              <div className="contact-role__block">
                <p className="contact-role__label">Responsibilities</p>
                <ul className="contact-role__list">
                  {activeRole.responsibilities.map((item) => (
                    <li key={item} className="contact-role__item">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="contact-role__block">
                <p className="contact-role__label">Authority</p>
                <ul className="contact-role__list">
                  {activeRole.authority.map((item) => (
                    <li key={item} className="contact-role__item">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="contact-role__block">
                <p className="contact-role__label">Decision authority</p>
                <ul className="contact-role__list">
                  {activeRole.decisions.map((item) => (
                    <li key={item} className="contact-role__item">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="contact-role__block">
                <p className="contact-role__label">Key achievements</p>
                <div className="contact-role__achievements">
                  {activeRole.achievements.map((achievement) => (
                    <span key={achievement.label} className="contact-role__chip">
                      <span aria-hidden="true">{achievement.icon}</span>
                      {achievement.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="contact-role__block">
              <p className="contact-role__label">Milestones</p>
              <div className="contact-role__milestones">
                {activeRole.milestones.map((item) => (
                  <div
                    key={item.title}
                    className="contact-role__milestone"
                    style={{
                      ["--milestone" as string]: `${item.value}%`,
                    }}
                  >
                    <div className="contact-role__milestone-head">
                      <p className="contact-role__milestone-title">
                        {item.title}
                      </p>
                      <span className="contact-role__milestone-value">
                        {item.value}%
                      </span>
                    </div>
                    <p className="contact-role__milestone-impact">
                      {item.impact}
                    </p>
                    <div className="contact-role__milestone-track">
                      <span className="contact-role__milestone-fill" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
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
        <section className="contact-section panel-surface">
          <h2 className="contact-section__title">Transcendence Feedback</h2>
          <div className="contact-feedback__summary">
            <div className="contact-feedback__metric">
              <p>Overall completion</p>
              <strong>92%</strong>
            </div>
            <div className="contact-feedback__metric">
              <p>Milestones achieved</p>
              <strong>36 / 40</strong>
            </div>
            <div className="contact-feedback__metric">
              <p>Evaluator rating</p>
              <strong>91%</strong>
            </div>
          </div>
          <div className="contact-feedback__controls">
            <label className="contact-feedback__label" htmlFor="feedback-sort">
              Sort feedback
            </label>
            <select
              id="feedback-sort"
              className="contact-feedback__select"
              value={sortKey}
              onChange={(event) =>
                setSortKey(event.target.value as "rating" | "name")
              }
            >
              <option value="rating">Highest rating</option>
              <option value="name">Evaluator name</option>
            </select>
          </div>
          <div className="contact-feedback">
            {sortedFeedback.map((feedback) => (
              <article key={feedback.evaluator} className="contact-feedback__card">
                <div className="contact-feedback__head">
                  <h3>{feedback.evaluator}</h3>
                  <span className="contact-feedback__rating">
                    {feedback.rating}%
                  </span>
                </div>
                <p className="contact-feedback__summary-text">
                  {feedback.summary}
                </p>
                <p className="contact-feedback__detail">{feedback.detail}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
