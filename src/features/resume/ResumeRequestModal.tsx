"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { FormInputWithValidation } from "@/components/forms/FormInputWithValidation";
import { StatusMessage } from "@/components/forms/StatusMessage";
import {
  CyberpunkButton,
  CyberpunkDialog,
  CyberpunkDialogContent,
  CyberpunkDialogFooter,
  CyberpunkDialogHeader,
  CyberpunkDialogTitle,
} from "@/components/ui";
import { type ResumeRequestData, resumeRequestSchema } from "@/lib/validation";

interface ResumeRequestModalRefactoredProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ResumeRequestData) => Promise<boolean>;
}

export function ResumeRequestModalRefactored({ isOpen, onClose, onSubmit }: ResumeRequestModalRefactoredProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({
    type: null,
    message: "",
  });

  const form = useForm<ResumeRequestData>({
    resolver: zodResolver(resumeRequestSchema),
    mode: "onBlur",
    defaultValues: {
      name: "",
      email: "",
      company: "",
    },
  });

  const handleSubmit: SubmitHandler<ResumeRequestData> = async (data) => {
    setSubmitStatus({ type: null, message: "" });
    setIsSubmitting(true);

    try {
      const downloadLink = document.createElement("a");
      downloadLink.href = "/api/cv/download";
      downloadLink.download = "Dee_Rashidi_CV.pdf";
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      const success = await onSubmit(data);

      if (success) {
        form.reset();
        setSubmitStatus({
          type: "success",
          message: "CV downloaded! Check your email for confirmation.",
        });

        setTimeout(() => {
          onClose();
          setSubmitStatus({ type: null, message: "" });
        }, 2000);
      } else {
        setSubmitStatus({
          type: "error",
          message: "CV downloaded but email failed. Please try again.",
        });
      }
    } catch (_error) {
      setSubmitStatus({
        type: "error",
        message: "An error occurred. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      form.reset();
      setSubmitStatus({ type: null, message: "" });
      onClose();
    }
  };

  return (
    <CyberpunkDialog open={isOpen} onOpenChange={handleClose}>
      <CyberpunkDialogContent className="w-full max-w-md">
        <CyberpunkDialogHeader>
          <CyberpunkDialogTitle>Request Resume</CyberpunkDialogTitle>
        </CyberpunkDialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormInputWithValidation form={form} name="name" label="Full Name" placeholder="Enter your full name" />

          <FormInputWithValidation
            form={form}
            name="email"
            label="Email Address"
            type="email"
            placeholder="Enter your email address"
          />

          <FormInputWithValidation
            form={form}
            name="company"
            label="Company (Optional)"
            placeholder="Enter your company name"
            required={false}
          />

          <StatusMessage status={submitStatus} />

          <CyberpunkDialogFooter>
            <CyberpunkButton
              type="submit"
              disabled={isSubmitting || !form.formState.isValid}
              loading={isSubmitting}
              variant="neon"
              className="w-full"
            >
              {isSubmitting ? "Processing..." : "Download CV"}
            </CyberpunkButton>
          </CyberpunkDialogFooter>
        </form>
      </CyberpunkDialogContent>
    </CyberpunkDialog>
  );
}
