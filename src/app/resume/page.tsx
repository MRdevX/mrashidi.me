"use client";

import { ResumeHeader, WorkExperienceSection, CertificatesSection } from "@/components/features/resume";

export default function Resume() {
  return (
    <div className="min-h-screen py-12 bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w-4xl mx-auto px-4">
        <ResumeHeader />

        <div className="prose dark:prose-invert max-w-none">
          <WorkExperienceSection />
          <CertificatesSection />
        </div>
      </div>
    </div>
  );
}
