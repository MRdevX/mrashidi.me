"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SubmitHandler } from "react-hook-form";
import { resumeRequestSchema, ResumeRequestData } from "@/lib/validation/schemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInputWithValidation from "@/components/forms/FormInputWithValidation";
import StatusMessage from "@/components/forms/StatusMessage";

interface ResumeRequestModalRefactoredProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ResumeRequestData) => Promise<boolean>;
}

export default function ResumeRequestModalRefactored({ isOpen, onClose, onSubmit }: ResumeRequestModalRefactoredProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ type: "success" | "error" | null; message: string }>({
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
      downloadLink.href = "/cv/Mahdi_Rashidi_CV.pdf";
      downloadLink.download = "Mahdi_Rashidi_CV.pdf";
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
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-full max-w-md bg-gray-900 border border-gray-700 rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <h2 className="text-xl font-bold text-orange-500">Request Resume</h2>
              <button
                onClick={handleClose}
                disabled={isSubmitting}
                className="text-gray-400 hover:text-white transition-colors disabled:opacity-50"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={form.handleSubmit(handleSubmit)} className="p-6 space-y-4">
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

              {/* Download Button */}
              <motion.button
                type="submit"
                disabled={isSubmitting || !form.formState.isValid}
                className="w-full neon-button flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: isSubmitting || !form.formState.isValid ? 1 : 1.02 }}
                whileTap={{ scale: isSubmitting || !form.formState.isValid ? 1 : 0.98 }}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                    <span>Download CV</span>
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
