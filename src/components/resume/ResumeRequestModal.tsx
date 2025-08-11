"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ResumeRequestData, ResumeRequestErrors, SubmitStatus } from "@/types/forms";
import FormInput from "@/components/forms/FormInput";
import StatusMessage from "@/components/forms/StatusMessage";

interface ResumeRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ResumeRequestData) => Promise<boolean>;
}

export default function ResumeRequestModal({ isOpen, onClose, onSubmit }: ResumeRequestModalProps) {
  const [formData, setFormData] = useState<ResumeRequestData>({
    name: "",
    email: "",
    company: "",
  });
  const [errors, setErrors] = useState<ResumeRequestErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>({ type: null, message: "" });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (errors[name as keyof ResumeRequestErrors]) {
      setErrors({ ...errors, [name]: undefined });
    }
  };

  const validateForm = (data: ResumeRequestData): ResumeRequestErrors => {
    const errors: ResumeRequestErrors = {};

    if (!data.name?.trim()) {
      errors.name = "Name is required";
    }

    if (!data.email?.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.email = "Invalid email format";
    }

    return errors;
  };

  const isFormValid = (): boolean => {
    const errors = validateForm(formData);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitStatus({ type: null, message: "" });

    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const downloadLink = document.createElement("a");
      downloadLink.href = "/cv/Mahdi_Rashidi_CV.pdf";
      downloadLink.download = "Mahdi_Rashidi_CV.pdf";
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      const success = await onSubmit(formData);

      if (success) {
        setFormData({ name: "", email: "", company: "" });
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
      setFormData({ name: "", email: "", company: "" });
      setErrors({});
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
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <FormInput
                id="resume-name"
                name="name"
                label="Full Name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
                placeholder="Enter your full name"
                required
              />

              <FormInput
                id="resume-email"
                name="email"
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                placeholder="Enter your email address"
                required
              />

              <FormInput
                id="resume-company"
                name="company"
                label="Company (Optional)"
                type="text"
                value={formData.company || ""}
                onChange={handleChange}
                error={errors.company}
                placeholder="Enter your company name"
                required={false}
              />

              <StatusMessage status={submitStatus} />

              {/* Download Button */}
              <motion.button
                type="submit"
                disabled={isSubmitting || !isFormValid()}
                className="w-full neon-button flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: isSubmitting || !isFormValid() ? 1 : 1.02 }}
                whileTap={{ scale: isSubmitting || !isFormValid() ? 1 : 0.98 }}
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
