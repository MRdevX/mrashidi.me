export interface SocialLinks {
  github: string;
  linkedin: string;
  email: string;
  website: string;
}

export interface Language {
  language: string;
  level: string;
  progress: number;
}

export interface PersonalInfo {
  name: string;
  title: string;
  location: string;
  email: string;
  website: string;
  social: SocialLinks;
  languages: Language[];
}

const personalInfo: PersonalInfo = {
  name: "Mahdi Rashidi",
  title: "Senior Backend Engineer & Cloud Architect",
  location: "Berlin, Germany",
  email: "contact@mrashidi.me",
  website: "https://mrashidi.me",
  social: {
    github: "https://github.com/mrdevx",
    linkedin: "https://linkedin.com/in/deerashidi",
    email: "contact@mrashidi.me",
    website: "https://mrashidi.me",
  },
  languages: [
    { language: "Persian", level: "Native Proficiency", progress: 100 },
    { language: "English", level: "Fluent (C1)", progress: 90 },
    { language: "German", level: "Pre-Intermediate (A2)", progress: 40 },
    { language: "Turkish", level: "Elementary (A1)", progress: 20 },
  ],
};

export default personalInfo;
