"use client";

import { ResumeRequestModal, submitResumeRequest } from "@/features/resume";

export function AskMrCvRequest({ onClose }: { onClose: () => void }) {
  return <ResumeRequestModal isOpen onClose={onClose} onSubmit={submitResumeRequest} />;
}
