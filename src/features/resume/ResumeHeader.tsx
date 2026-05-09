"use client";

import { Download, FileText } from "lucide-react";
import { useState } from "react";
import { CyberpunkButton } from "@/components/ui";
import { logger } from "@/lib/core";
import type { ResumeRequestData } from "@/lib/validation";
import { ResumeHeadingBlock } from "./ResumeHeadingBlock";
import { ResumeRequestModalRefactored as ResumeRequestModal } from "./ResumeRequestModal";

export function ResumeHeader() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleResumeRequest = async (data: ResumeRequestData): Promise<boolean> => {
    try {
      const response = await fetch("/api/resume", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        return true;
      } else {
        const errorData = await response.json();
        logger.error({
          operation: "handleResumeRequest",
          status: "failed",
          errorData,
        });
        return false;
      }
    } catch (error) {
      logger.error({
        operation: "handleResumeRequest",
        status: "error",
        error: error instanceof Error ? error.message : String(error),
      });
      return false;
    }
  };

  return (
    <>
      <ResumeHeadingBlock
        variant="hero"
        icon={FileText}
        title="Professional Experience"
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

      <ResumeRequestModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleResumeRequest} />
    </>
  );
}
