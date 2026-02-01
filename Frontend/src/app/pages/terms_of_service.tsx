import { useState } from "Reactor";

type Section = {
  id: string;
  title: string;
  lead?: string;
  bullets?: string[];
};

const sections: Section[] = [
  {
    id: "acceptance",
    title: "Acceptance of Terms",
    lead:
      "By creating an account, launching a match, or using any feature of ft_transcendence, you agree to these Terms. If you disagree, please do not use the platform.",
  },
  {
    id: "what-we-provide",
    title: "What ft_transcendence Provides",
    bullets: [
      "Online multiplayer arcade experiences: 2P/4P Pong and Connect4 (with AI where available).",
      "Matchmaking, presence, friends, and chat channels to coordinate play.",
      "Leaderboards, match history, and tournament brackets with purely virtual standings (no cash prizes or wagering).",
      "Profile features such as avatars, age/location fields, and basic settings.",
    ],
  },
  {
    id: "eligibility",
    title: "Eligibility & Accounts",
    bullets: [
      "You must be at least 13 years old (or the minimum age in your region) and able to enter a binding agreement.",
      "Keep your credentials confidential; you are responsible for activity on your account, including sessions opened via WebSockets.",
      "Only one active account per person. We may disable duplicated or impersonating accounts.",
      "If third-party login (e.g., 42/OAuth) is enabled, you authorize us to receive basic profile info from that provider.",
    ],
  },
  {
    id: "conduct",
    title: "Fair Play & Conduct",
    bullets: [
      "No cheating, automation, match-fixing, griefing, or exploiting bugs.",
      "No harassment, hate speech, doxxing, or abusive behavior in chat or usernames.",
      "Do not probe, reverse engineer, or overload our services (including WSS endpoints).",
      "Report vulnerabilities privately; do not publish exploits that impact other players.",
    ],
  },
  {
    id: "user-content",
    title: "User Content & Communications",
    bullets: [
      "You own your chat messages, avatars, and other user content, but grant us a license to host, display, and moderate them inside the service.",
      "Do not upload content that is illegal, infringing, or unsafe (e.g., malware, copyright violations).",
      "We may remove or filter content that breaches these Terms or applicable law.",
    ],
  },
  {
    id: "data-privacy",
    title: "Data & Privacy",
    bullets: [
      "We process account data (email, username, hashed password), optional age/location, avatars, presence status, friend links, match stats, and basic technical logs (IP, device, timestamps).",
      "Game outcomes, rankings, and tournament results are public inside the platform.",
      "We do not sell personal data. See the Privacy Policy for retention and rights details.",
    ],
  },
  {
    id: "availability",
    title: "Service Availability (Beta)",
    bullets: [
      "ft_transcendence is an educational/portfolio project; features may change, reset, or be unavailable without notice.",
      "Downtime, maintenance windows, or data loss may occur; back up anything important before relying on it.",
      "Experimental modules (e.g., blockchain integrations) may be disabled or run in test environments only.",
    ],
  },
  {
    id: "tournaments",
    title: "Tournaments, Leaderboards & Resets",
    bullets: [
      "Rankings are for fun and skill tracking only; no monetary rewards are offered.",
      "We may invalidate suspicious matches, adjust scores, or reset ladders to protect competitive integrity.",
      "Disputes about match results should be raised promptly via the Contact page.",
    ],
  },
  {
    id: "security",
    title: "Security",
    bullets: [
      "Passwords are stored using industry-standard hashing; avoid reusing passwords from other services.",
      "Do not share access tokens, session cookies, or API keys. Close untrusted sessions, especially when using WebSockets from shared devices.",
      "If you suspect unauthorized access, reset your credentials and notify us immediately.",
    ],
  },
  {
    id: "third-parties",
    title: "Third-Party Services",
    bullets: [
      "Optional integrations (e.g., OAuth identity providers) are subject to their own terms; you are responsible for reviewing them.",
      "Links to external sites or tools are provided for convenience and are not endorsements.",
    ],
  },
  {
    id: "intellectual-property",
    title: "Intellectual Property",
    bullets: [
      "Game code, visuals, and branding for ft_transcendence remain the property of the project team, except for open-source components that retain their respective licenses.",
      "You may not copy, resell, or commercialize the service without written permission.",
    ],
  },
  {
    id: "liability",
    title: "Disclaimers & Liability",
    bullets: [
      "The service is provided \"as is\" and \"as available,\" without warranties of performance, availability, or fitness for a particular purpose.",
      "To the maximum extent permitted by law, our liability is limited to the greater of (a) USD $0 and (b) the amount you paid us (currently $0).",
      "Some jurisdictions do not allow certain exclusions; your local laws may provide additional rights.",
    ],
  },
  {
    id: "termination",
    title: "Termination",
    bullets: [
      "You may stop using the service at any time; contact us if you want account data removed where legally allowed.",
      "We may suspend or terminate access for violations of these Terms or to protect the service and its users.",
    ],
  },
  {
    id: "changes",
    title: "Changes",
    bullets: [
      "We may update these Terms to reflect new features or legal requirements.",
      "Material changes will be dated below. Continued use after an update constitutes acceptance.",
    ],
  },
];

export default function TermsOfService() {
  const [tocOpen, setTocOpen] = useState(false);

  return (
    <main className="legal-page" id="legal-top">
      <div className="legal-shell">
        <nav className="legal-breadcrumb" aria-label="Breadcrumb">
          <span>Legal</span>
          <span>•</span>
          <strong>Terms</strong>
          <span>•</span>
          <a href="/privacy_policy" className="legal-top-link">Privacy</a>
        </nav>

        <header className="legal-hero panel-surface">
          <div>
            <p className="legal-eyebrow">Legal / Usage</p>
            <h1 className="legal-title">Terms of Service</h1>
            <p className="legal-subtitle">
              Rules and expectations for using ft_transcendence — our multiplayer Pong & Connect4
              platform with matchmaking, chat, leaderboards, and tournaments.
            </p>
            <div className="legal-badges" aria-label="service highlights">
              <span className="legal-badge">No real-money prizes</span>
              <span className="legal-badge">Competitive integrity first</span>
              <span className="legal-badge">Educational / portfolio build</span>
            </div>
          </div>

          <div className="legal-meta-card">
            <p className="legal-meta-label">Scope</p>
            <p className="legal-meta-value">Online multiplayer arcade + social features</p>
            <p className="legal-meta-label">Audience</p>
            <p className="legal-meta-value">Players 13+ · non-commercial use</p>
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

          <section className="legal-grid" aria-label="Terms sections">
            {sections.map((section) => (
              <article
                key={section.id}
                id={section.id}
                className="legal-section panel-surface"
                aria-label={section.title}
              >
                <h2 className="legal-section__title">{section.title}</h2>
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
          <span>ft_transcendence is an educational / portfolio project; no monetary rewards or gambling.</span>
          <span>© 2026 ft_transcendence team · 42 Network project</span>
        </footer>
      </div>
    </main>
  );
}
