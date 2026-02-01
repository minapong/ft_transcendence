import { useState } from "Reactor";

type Section = {
  id: string;
  iconClass: string;
  title: string;
  lead?: string;
  bullets?: string[];
};

const sections: Section[] = [
  {
    id: "information-we-collect",
    iconClass: "icon-[solar--database-bold-duotone]",
    title: "Information We Collect",
    bullets: [
      "Account data: email, username, and hashed password.",
      "Profile fields you choose to share: age, location, avatar.",
      "Gameplay data: match history, scores, rankings, tournaments, achievements.",
      "Social data: friends list, presence status, chat messages sent through our service.",
      "Technical metadata: IP address, device/browser info, timestamps, and basic logs for security/debugging (used to keep sessions stable and fight abuse).",
      "Preference signals: mode selections and matchmaking settings to improve pairing quality.",
    ],
  },
  {
    id: "how-we-use-data",
    iconClass: "icon-[solar--settings-2-bold-duotone]",
    title: "How We Use Your Data",
    bullets: [
      "Run gameplay features (matchmaking, leaderboards, tournaments, achievements) and tailor match quality.",
      "Display player identity and presence to friends, opponents, and spectators inside the platform.",
      "Secure sessions, detect abuse/cheating, and keep service reliability high.",
      "Improve UX through aggregated, non-commercial analytics (performance, bug triage).",
      "Communicate essential updates about service changes, resets, or policy updates (via in-app notice or email if provided).",
      "We do not use personal data for ads; any limited third-party sharing is only to operate logins/storage as listed below.",
    ],
  },
  {
    id: "data-protection",
    iconClass: "icon-[solar--shield-keyhole-bold-duotone]",
    title: "Data Protection",
    bullets: [
      "Passwords are hashed; access tokens are signed and time-limited.",
      "Transport is expected over HTTPS/WSS; avoid using on untrusted networks.",
      "Access to databases/logs is limited to project maintainers for operational needs.",
      "We do not sell personal data or use it for advertising.",
      "Sensitive fields (tokens, session secrets) are encrypted at rest using standard AES-based storage by our providers.",
    ],
  },
  {
    id: "your-rights",
    iconClass: "icon-[solar--checklist-bold-duotone]",
    title: "Your Rights",
    bullets: [
      "You can request access, correction, or deletion of your account data where legally permitted.",
      "You can update optional fields (age, location, avatar) at any time in profile settings.",
      "You may disable your account; gameplay records may remain in aggregated rankings for integrity.",
      "To exercise rights, use the Contact page or the in-app request flow; we respond as quickly as the project schedule allows.",
    ],
  },
  {
    id: "service-availability",
    iconClass: "icon-[solar--danger-triangle-bold-duotone]",
    title: "Service Availability (Beta)",
    bullets: [
      "ft_transcendence is an educational/portfolio project; data may reset between releases.",
      "Features can change, be rate-limited, or become unavailable; critical changes are announced in-app or via email when possible.",
      "Back up anything important before relying on the platform for long-term storage.",
    ],
  },
  {
    id: "security",
    iconClass: "icon-[solar--shield-check-bold-duotone]",
    title: "Security",
    bullets: [
      "Use a unique password and log out on shared devices.",
      "Do not share tokens or invite untrusted clients into private matches.",
      "If you suspect unauthorized access, change your password and contact the team immediately.",
      "Two-factor auth (2FA) is not yet available; it is on the roadmap for a future update.",
    ],
  },
  {
    id: "third-parties",
    iconClass: "icon-[solar--global-bold-duotone]",
    title: "Third-Party Services",
    bullets: [
      "Optional OAuth providers (e.g., 42/UID) may supply your basic profile; governed by their terms.",
      "We may use infrastructure/logging/storage providers (e.g., cloud object storage, log pipelines) for reliability; they process data under contractual safeguards.",
      "We do not sell or share data for advertising.",
    ],
  },
  {
    id: "intellectual-property",
    iconClass: "icon-[solar--copyright-bold-duotone]",
    title: "Intellectual Property & Data Ownership",
    bullets: [
      "You own your user-generated content; you grant us a license to store, display, and moderate it within the service.",
      "Platform code, visuals, and branding remain with the ft_transcendence team; open-source components keep their licenses.",
      "If you delete your account, public match summaries may remain in anonymized or aggregate form to preserve leaderboard integrity.",
    ],
  },
  {
    id: "changes",
    iconClass: "icon-[solar--refresh-bold-duotone]",
    title: "Changes & Contact",
    bullets: [
      "We may update this policy when features or legal requirements change.",
      "Material updates will be dated below; we will post an in-app notice and, when possible, email users with accounts.",
      "Questions? Use the Contact page to reach the ft_transcendence team.",
    ],
  },
];

export default function PrivacyPolicy() {
  const [tocOpen, setTocOpen] = useState(false);

  return (
    <main className="legal-page" id="legal-top">
      <div className="legal-shell">
        <nav className="legal-breadcrumb" aria-label="Breadcrumb">
          <span>Legal</span>
          <span>•</span>
          <a href="/terms_of_service" className="legal-top-link">Terms</a>
          <span>•</span>
          <strong>Privacy</strong>
        </nav>

        <header className="legal-hero panel-surface">
          <div>
            <p className="legal-eyebrow">Legal / Data</p>
            <h1 className="legal-title">Privacy Policy</h1>
            <p className="legal-subtitle">
              How ft_transcendence collects, uses, and protects player data for multiplayer Pong, Connect4,
              matchmaking, chat, and tournaments.
            </p>
            <div className="legal-badges" aria-label="policy highlights">
              <span className="legal-badge">No data selling</span>
              <span className="legal-badge">Hashed credentials</span>
              <span className="legal-badge">HTTPS / WSS expected</span>
            </div>
          </div>

          <div className="legal-meta-card">
            <p className="legal-meta-label">Scope</p>
            <p className="legal-meta-value">Account, gameplay, social, and telemetry data</p>
            <p className="legal-meta-label">Last updated</p>
            <p className="legal-meta-value">February 1, 2026</p>
          </div>
        </header>

        <div className="legal-layout">
          <aside className={`legal-toc ${tocOpen ? "" : "is-collapsed"}`}>
            <div className="legal-toc__head">
              <p className="legal-toc__title">Quick links</p>
              <button
                className="legal-toc__toggle"
                type="button"
                aria-expanded={tocOpen}
                onClick={() => setTocOpen(!tocOpen)}
              >
                {tocOpen ? "Hide" : "Show"}
              </button>
            </div>
            <ul className="legal-toc__list">
              {sections.map((section) => (
                <li key={section.id} className="legal-toc__item">
                  <a href={`#${section.id}`} onClick={() => setTocOpen(false)}>
                    {section.title}
                  </a>
                </li>
              ))}
            </ul>
          </aside>

          <section className="legal-grid" aria-label="Privacy sections">
            {sections.map((section) => (
              <article
                key={section.id}
                id={section.id}
                className="legal-section panel-surface"
                aria-label={section.title}
              >
                <h2 className="legal-section__title">
                  <span className={`legal-icon ${section.iconClass}`} aria-hidden="true" />
                  {section.title}
                </h2>
                {section.lead && <p className="legal-section__text">{section.lead}</p>}
                {section.bullets && (
                  <ul className="legal-list">
                    {section.bullets.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                )}
                <a className="legal-top-link" href="#legal-top">
                  Back to top
                </a>
              </article>
            ))}
          </section>
        </div>

        <footer className="legal-foot">
          <span>ft_transcendence is an educational / portfolio project; data may reset between releases.</span>
          <span>© 2026 ft_transcendence team · 42 Network project</span>
        </footer>

        <a className="legal-backtotop" href="#legal-top" aria-label="Back to top">
          ↑ Back to Top
        </a>
      </div>
    </main>
  );
}
