export type AboutBioStyle = "prominent" | "subtle" | "brand";

export interface AboutBioPiece {
  readonly id: string;
  readonly text: string;
  readonly style?: AboutBioStyle;
}

type BioSegmentDef = Pick<AboutBioPiece, "text"> & { readonly style?: AboutBioStyle };

/**
 * Plain rows: concatenate `text` for terminal/metadata; Bio maps rows to `<span>`s with stable ids.
 * Styles: `prominent` — main emphasis; `subtle` — lighter italic; `brand` — accent highlight (e.g. keywords).
 */
const ABOUT_BIO_SEGMENTS: readonly BioSegmentDef[] = [
  { text: "I'm a backend engineer with " },
  { text: "11 years", style: "brand" },
  { text: " of experience building and running " },
  { text: "production services and microservices", style: "prominent" },
  {
    text: ". I work across the whole lifecycle, from API and schema design through deployment, observability and on-call, mostly in ",
  },
  { text: "Node.js, NestJS, TypeScript and PostgreSQL", style: "brand" },
  { text: ", with " },
  { text: "Python", style: "subtle" },
  { text: " for processing pipelines. I ship with " },
  { text: "Docker, Kubernetes and CI/CD", style: "brand" },
  { text: " on " },
  { text: "GCP, Azure and Cloudflare", style: "brand" },
  { text: ". I've worked in " },
  { text: "digital health, e-mobility, aviation and payments", style: "subtle" },
  { text: ", and I care most about " },
  { text: "clean, maintainable code", style: "prominent" },
  { text: " and systems that grow with business needs." },
];

export const ABOUT_BIO_PIECES: readonly AboutBioPiece[] = Object.freeze(
  ABOUT_BIO_SEGMENTS.map((segment, index) => ({ id: `bio-${index}`, ...segment }))
);

export function getAboutBioPlainText(): string {
  return ABOUT_BIO_SEGMENTS.map((s) => s.text).join("");
}
