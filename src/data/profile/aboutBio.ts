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
  { text: "I'm a software engineer with " },
  { text: "9 years", style: "brand" },
  { text: " of experience building " },
  { text: "scalable backend systems and microservices", style: "prominent" },
  { text: ". For the past 6 years, I've specialized in " },
  { text: "Node.js and TypeScript", style: "brand" },
  { text: ", with earlier experience in " },
  { text: "Java and Python", style: "subtle" },
  {
    text: " for scripting and automation. My background spans backend development, cloud infrastructure, and DevOps, working with tools like ",
  },
  { text: "Docker, Kubernetes, and CI/CD pipelines", style: "brand" },
  { text: " on " },
  { text: "AWS and Azure", style: "brand" },
  { text: ". I've contributed to projects in " },
  { text: "e-mobility, fintech, aviation, and education", style: "subtle" },
  { text: ", always focusing on " },
  { text: "clean, maintainable code", style: "prominent" },
  { text: " and " },
  { text: "systems that grow with business needs", style: "brand" },
  { text: "." },
];

export const ABOUT_BIO_PIECES: readonly AboutBioPiece[] = Object.freeze(
  ABOUT_BIO_SEGMENTS.map((segment, index) => ({ id: `bio-${index}`, ...segment }))
);

export function getAboutBioPlainText(): string {
  return ABOUT_BIO_SEGMENTS.map((s) => s.text).join("");
}
