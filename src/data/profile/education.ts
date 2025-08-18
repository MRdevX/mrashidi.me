export interface Education {
  degree: string;
  institution: string;
  period: string;
  location: string;
  details?: string[];
  url?: string;
}

const education: Education[] = [
  {
    degree: "B.Sc. in Computer Software Engineering",
    institution: "Bu-Ali Sina University",
    location: "Hamedan, Iran",
    period: "Sep 2011 – Sep 2015",
    url: "https://en.wikipedia.org/wiki/Bu-Ali_Sina_University",
  },
];

export default education;
