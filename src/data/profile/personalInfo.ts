import { getAboutBioPlainText } from "./aboutBio";

export interface Language {
  language: string;
  level: string;
  progress: number;
}

export interface PersonalInfo {
  languages: Language[];
  bio: string;
  contactCta: string;
  contactDescription: string;
}

const personalInfo: PersonalInfo = {
  languages: [
    { language: "Persian", level: "Native Proficiency", progress: 100 },
    { language: "English", level: "Fluent (C1)", progress: 90 },
    { language: "German", level: "Pre-Intermediate (A2)", progress: 40 },
    { language: "Turkish", level: "Elementary (A1)", progress: 20 },
  ],
  bio: getAboutBioPlainText(),
  contactCta: "Feel Free to Reach Out",
  contactDescription:
    "I'm open to discussing new opportunities. If you think I might be a good fit for what you're building, feel free to reach out and we can chat about it.",
};

export default personalInfo;
