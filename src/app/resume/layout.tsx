import type { Metadata } from "next";
import { coreConfig, personalInfo } from "@/data";

export const metadata: Metadata = {
  title: `Resume - ${personalInfo.name} | Professional Experience`,
  description: `Download ${personalInfo.name}'s professional resume and CV. View work experience, skills, and qualifications as a ${personalInfo.title} based in ${personalInfo.location}.`,
  keywords: `${personalInfo.name}, resume, cv, professional experience, ${personalInfo.title}, ${personalInfo.location}, software engineer, backend developer`,
  openGraph: {
    title: `Resume - ${personalInfo.name}`,
    description: `Download ${personalInfo.name}'s professional resume and view work experience.`,
    url: `${coreConfig.site.url}/resume`,
    type: "website",
    images: [
      {
        url: `${coreConfig.site.url}/og-resume.jpg`,
        width: 1200,
        height: 630,
        alt: `${personalInfo.name} - Resume`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `Resume - ${personalInfo.name}`,
    description: `Download ${personalInfo.name}'s professional resume and view work experience.`,
    images: [`${coreConfig.site.url}/og-resume.jpg`],
  },
  alternates: {
    canonical: `${coreConfig.site.url}/resume`,
  },
};

export default function ResumeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
