"use client";

import { ResumeRequestModalRefactored } from "@/features/resume/ResumeRequestModal";
import { submitResumeRequest } from "@/features/resume/submitResumeRequest";

export function AskMrCvRequest({ onClose }: { onClose: () => void }) {
  return <ResumeRequestModalRefactored isOpen onClose={onClose} onSubmit={submitResumeRequest} />;
}
