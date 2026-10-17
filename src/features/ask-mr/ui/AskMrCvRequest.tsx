"use client";

import { ResumeRequestModalRefactored, submitResumeRequest } from "@/features/resume";

export function AskMrCvRequest({ onClose }: { onClose: () => void }) {
  return <ResumeRequestModalRefactored isOpen onClose={onClose} onSubmit={submitResumeRequest} />;
}
