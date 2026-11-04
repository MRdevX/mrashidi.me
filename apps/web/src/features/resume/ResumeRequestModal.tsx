"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { type CvRequestForm, CvRequestFormSchema } from "@mrashidi/types";
import { useState } from "react";
import { GoogleReCaptchaProvider, useGoogleReCaptcha } from "react-google-recaptcha-v3";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { FormInputWithValidation } from "@/components/forms/FormInputWithValidation";
import { StatusMessage } from "@/components/forms/StatusMessage";
import { CyberpunkButton } from "@/components/ui";
import { getEnv } from "@/lib/core";
import {
  CyberpunkDialog,
  CyberpunkDialogContent,
  CyberpunkDialogFooter,
  CyberpunkDialogHeader,
  CyberpunkDialogTitle,
} from "./CyberpunkDialog";
import { DialogDescription } from "./dialog";

interface ResumeRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CvRequestForm, recaptchaToken: string) => Promise<boolean>;
}

export function ResumeRequestModal(props: ResumeRequestModalProps) {
  const recaptchaSiteKey = getEnv("NEXT_PUBLIC_RECAPTCHA_SITE_KEY");
  if (!props.isOpen || !recaptchaSiteKey) {
    return <ResumeRequestDialog {...props} />;
  }
  return (
    <GoogleReCaptchaProvider reCaptchaKey={recaptchaSiteKey}>
      <ResumeRequestDialog {...props} />
    </GoogleReCaptchaProvider>
  );
}

function ResumeRequestDialog({ isOpen, onClose, onSubmit }: ResumeRequestModalProps) {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({
    type: null,
    message: "",
  });

  const form = useForm<CvRequestForm>({
    resolver: zodResolver(CvRequestFormSchema),
    mode: "onBlur",
    defaultValues: {
      name: "",
      email: "",
      company: "",
    },
  });

  const handleSubmit: SubmitHandler<CvRequestForm> = async (data) => {
    setSubmitStatus({ type: null, message: "" });
    setIsSubmitting(true);

    try {
      if (!executeRecaptcha) {
        throw new Error("reCAPTCHA is not available");
      }
      const success = await onSubmit(data, await executeRecaptcha("cv_request"));

      if (success) {
        form.reset();
        setSubmitStatus({
          type: "success",
          message: "Sent! Check your inbox for the download link.",
        });

        setTimeout(() => {
          onClose();
          setSubmitStatus({ type: null, message: "" });
        }, 2000);
      } else {
        setSubmitStatus({
          type: "error",
          message: "We could not send the email. Please try again.",
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
    <CyberpunkDialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          handleClose();
        }
      }}
    >
      <CyberpunkDialogContent className="w-full max-w-md">
        <CyberpunkDialogHeader>
          <CyberpunkDialogTitle>Request Resume</CyberpunkDialogTitle>
          <DialogDescription>
            Enter your details and we will email you a download link that works for 24 hours.
          </DialogDescription>
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
              {isSubmitting ? "Sending..." : "Email me the CV"}
            </CyberpunkButton>
          </CyberpunkDialogFooter>
        </form>
      </CyberpunkDialogContent>
    </CyberpunkDialog>
  );
}
