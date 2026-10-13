/**
 * Extra facts for Ask MR that the site pages don't show.
 *
 * The assistant answers ONLY from the site data plus this file, so anything left empty here
 * becomes "I don't know — ask Mahdi directly". Empty strings and empty arrays are omitted
 * from the prompt, so it is safe to leave a TODO blank until you have an answer.
 *
 * Write in third person ("Mahdi …"), keep each entry to one or two sentences, and only add
 * what you are happy for any visitor to read: the whole file is effectively public.
 */

export interface AskMrRoleNotes {
  /** Must match `company` in `src/data/profile/workExperience.ts` to be merged into that role. */
  company: string;
  highlights: string[];
}

export interface AskMrFaqEntry {
  question: string;
  answer: string;
}

export interface AskMrKnowledge {
  /** Achievements for roles whose `achievements` are still empty on the site. */
  roleNotes: AskMrRoleNotes[];
  /** e.g. "Open to senior backend roles from Q1 2027" or "Not looking, but happy to chat". */
  availability: string;
  /** e.g. "Prefers remote or hybrid in Berlin". */
  remote: string;
  /** e.g. "Not planning to relocate outside Germany". */
  relocation: string;
  /** e.g. "Holds a German residence permit that allows full-time work". Leave empty to deflect. */
  workAuthorization: string;
  /** Roles he is most interested in. */
  preferredRoles: string[];
  /** Stack/domains he would most like to work with next. */
  interests: string[];
  /** How he likes to work: team setup, communication, ownership. */
  workingStyle: string[];
  /** Personal-but-public facts: hobbies, side interests. Keep it light. */
  funFacts: string[];
  /** Anything else visitors often ask. */
  faq: AskMrFaqEntry[];
}

export const askMrKnowledge: AskMrKnowledge = {
  roleNotes: [
    {
      company: "MindDoc GmbH",
      // TODO(Mahdi): 2–5 highlights of your work at MindDoc (what you build, stack, impact).
      highlights: [],
    },
    {
      company: "Notable Nomads",
      // TODO(Mahdi): 2–5 highlights as co-founder (services, products shipped, clients you can name).
      highlights: [],
    },
  ],
  // TODO(Mahdi): current availability / openness to new opportunities.
  availability: "",
  // TODO(Mahdi): remote / hybrid / on-site preference.
  remote: "",
  // TODO(Mahdi): relocation stance.
  relocation: "",
  // TODO(Mahdi): work authorization in Germany/EU (or leave empty so the bot deflects to contact).
  workAuthorization: "",
  // TODO(Mahdi): e.g. ["Senior Backend Engineer", "Tech Lead", "Platform Engineer"].
  preferredRoles: [],
  // TODO(Mahdi): e.g. ["Distributed systems", "Developer tooling", "AI-backed products"].
  interests: [],
  // TODO(Mahdi): e.g. ["Writes design docs before big changes", "Likes owning services end to end"].
  workingStyle: [],
  // TODO(Mahdi): hobbies or light personal facts you're comfortable sharing publicly.
  funFacts: [],
  // TODO(Mahdi): extra Q&A pairs, e.g. { question: "Does he do freelance work?", answer: "…" }.
  faq: [],
};
