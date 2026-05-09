"use client";

import { Download, FileText } from "lucide-react";
import { useState } from "react";
import { CyberpunkButton } from "@/components/ui";
import { useThemeConfig } from "@/hooks/useThemeConfig";
import { logger } from "@/lib/core";
import type { ResumeRequestData } from "@/lib/validation";
import { ResumeFilamentDivider } from "./ResumeFilamentDivider";
import { ResumeRequestModalRefactored as ResumeRequestModal } from "./ResumeRequestModal";

export function ResumeHeader() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { getSectionTitle } = useThemeConfig();

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
      <div className="mb-12 space-y-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <FileText className="size-8 shrink-0 text-orange-500" aria-hidden />
            <h1 className={`text-3xl font-bold sm:text-4xl ${getSectionTitle()} text-center sm:text-left`}>
              Professional Experience
            </h1>
          </div>
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
        </div>
        <ResumeFilamentDivider />
      </div>

      <ResumeRequestModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleResumeRequest} />
    </>
  );
}
