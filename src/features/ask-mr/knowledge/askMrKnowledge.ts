/**
 * Extra facts for Ask MR that the site pages don't show.
 *
 * The assistant answers ONLY from the site data plus this file, so anything left empty here
 * becomes "I don't know — ask Mahdi directly". Empty strings and empty arrays are omitted
 * from the prompt.
 *
 * Write in third person ("Mahdi …"), keep each entry to one or two sentences, and only add
 * what you are happy for any visitor to read: this repo is open source, so the whole file is
 * public. Never add contact details beyond the site's, residence/visa status, compensation or
 * anything else that could be misused.
 */

export interface AskMrRoleNotes {
  /** Must match `company` in `src/data/profile/workExperience.ts` to be merged into that role. */
  company: string;
  highlights: string[];
}

export interface AskMrExtraProject {
  title: string;
  year: string;
  summary: string;
  stack: string[];
}

export interface AskMrFaqEntry {
  question: string;
  answer: string;
}

export interface AskMrKnowledge {
  /** Achievements for roles whose `achievements` are still empty on the site. */
  roleNotes: AskMrRoleNotes[];
  /** Companies from `workExperience` to leave out of the work history (FAQ can still explain them). */
  hiddenRoles: string[];
  /** e.g. "Open to senior backend roles". Leave empty to deflect availability questions to contact. */
  availability: string;
  /** e.g. "Prefers remote or hybrid work". */
  remote: string;
  /** e.g. "Not planning to relocate". */
  relocation: string;
  /** Leave empty: residence and visa details stay private. */
  workAuthorization: string;
  /** Roles he is most interested in. */
  preferredRoles: string[];
  /** Areas he is most interested in. */
  interests: string[];
  /** How he likes to work. */
  workingStyle: string[];
  /** Light, public personal facts. */
  funFacts: string[];
  /** Projects from the CV that aren't on the projects page (no cards or deep links). */
  extraProjects: AskMrExtraProject[];
  /** Skills from the CV that aren't listed on the about page. */
  extraSkills: string[];
  /** Anything else visitors often ask. */
  faq: AskMrFaqEntry[];
}

export const askMrKnowledge: AskMrKnowledge = {
  // Details of the current MindDoc role are intentionally not published.
  roleNotes: [],
  hiddenRoles: ["Notable Nomads"],
  availability: "",
  remote: "Prefers remote or hybrid work.",
  relocation: "Not planning to relocate.",
  workAuthorization: "",
  preferredRoles: ["Senior Backend Engineer", "Platform / Cloud Engineer", "Tech Lead"],
  interests: [
    "Privacy- and security-sensitive systems: encryption, access control and compliance (e.g. health and payments)",
    "Edge and serverless architectures on Cloudflare Workers and Durable Objects",
    "AI-backed products: LLM features, evals and AI tooling for engineering teams",
  ],
  workingStyle: [],
  funFacts: [],
  extraProjects: [
    {
      title: "Targela",
      year: "2026",
      summary:
        "Live AI planning SaaS where Mahdi is the sole engineer: a Hono API on Cloudflare Workers backed by Supabase Postgres through Hyperdrive, plus a Nuxt PWA, a Flutter app and an operator dashboard in one Turborepo monorepo, with infrastructure in Terraform.",
      stack: ["Hono", "Cloudflare Workers", "Supabase", "Drizzle", "Nuxt", "Flutter", "Terraform"],
    },
    {
      title: "R4zzle",
      year: "2026",
      summary:
        "Live real-time multiplayer party games in English and Persian, co-built with one other engineer; Android and iOS builds via Capacitor are ahead of store release. Mahdi wrote the backend: server-authoritative game rooms on Durable Objects, WebSocket push with a polling fallback, per-player rate limiting, and CI/CD that deploys on release.",
      stack: ["Hono", "Cloudflare Workers", "Durable Objects", "D1", "Next.js", "Capacitor"],
    },
  ],
  extraSkills: [
    "gRPC / Protobuf, OpenAPI, WebSockets, webhooks",
    "Stripe, Resend, Firebase Cloud Messaging integrations",
    "Security: JWT, RBAC, OAuth 2.0, passkeys (WebAuthn), envelope encryption, mTLS, GDPR",
    "Data: TypeORM, Drizzle, Supabase, Bull queues",
    "Architecture: multi-tenancy, monorepos, domain-driven design",
    "Frontend: Vue.js 3 and Nuxt",
    "Testing: Supertest, pytest, Playwright",
    "GCP: GKE, Cloud SQL, Cloud Storage, KMS, Secret Manager, Cloud Armor; Cloudflare: Workers, Durable Objects, D1, R2",
    "Platform: Helm, Terraform, Linkerd, nginx, GitHub Actions, Trivy, canary releases",
    "Observability: Loki and Cloud Monitoring alongside Sentry, Prometheus and Grafana",
    "AI: Anthropic API, Workers AI, AI Gateway, LLM evals, WhisperX",
  ],
  faq: [
    {
      question: "What is Notable Nomads?",
      answer:
        "A fully remote software team Mahdi co-founded that builds cloud-native backends, web and mobile apps (notablenomads.com).",
    },
  ],
};
