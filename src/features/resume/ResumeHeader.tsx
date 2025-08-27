"use client";

import { Download, FileText } from "lucide-react";
import { useState } from "react";
import { CyberpunkButton } from "@/components/ui";
import { useThemeConfig } from "@/hooks/useThemeConfig";
import { logger } from "@/lib/logger";
import type { ResumeRequestData } from "@/lib/validation/schemas";
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
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-12">
        <div className="flex items-center gap-3">
          <FileText className="w-8 h-8 text-orange-500" />
          <h1 className={`text-3xl sm:text-4xl font-bold ${getSectionTitle()} text-center sm:text-left`}>
            Professional Experience
          </h1>
        </div>
        <CyberpunkButton
          onClick={() => {
            logger.debug({
              operation: "ResumeHeader",
              message: "Resume request button clicked",
            });
            setIsModalOpen(true);
          }}
          variant="neon"
          icon={<Download className="w-5 h-5" />}
          className="w-full sm:w-auto"
        >
          Request CV
        </CyberpunkButton>
      </div>

      <ResumeRequestModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleResumeRequest} />
    </>
  );
}
