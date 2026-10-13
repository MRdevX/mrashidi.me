"use client";

import { Download } from "lucide-react";
import { useState } from "react";
import { CyberpunkButton, PageHeader } from "@/components/ui";
import { ResumeRequestModalRefactored as ResumeRequestModal } from "./ResumeRequestModal";
import { submitResumeRequest } from "./submitResumeRequest";

export function ResumeHeader() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <PageHeader
        iconName="FileText"
        title="Resume"
        actions={
          <CyberpunkButton
            onClick={() => {
              setIsModalOpen(true);
            }}
            variant="neon"
            icon={<Download className="size-5" aria-hidden />}
            className="w-full sm:w-auto"
          >
            Request CV
          </CyberpunkButton>
        }
      />

      <ResumeRequestModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={submitResumeRequest} />
    </>
  );
}
