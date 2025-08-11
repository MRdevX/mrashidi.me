"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ResumeRequestData, ResumeRequestErrors, SubmitStatus } from "@/types/forms";
import FormInput from "@/components/forms/FormInput";
import StatusMessage from "@/components/forms/StatusMessage";

/**
 * Resume Request Modal Component
 *
 * This component handles resume requests by:
 * 1. Collecting user's name and email
 * 2. Sending the resume via email to the user
 * 3. Notifying the admin about the request
 *
 * Note: Currently sends email without PDF attachment due to SES limitations.
 * For production, consider using S3 to host the PDF and include a download link.
 */
interface ResumeRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ResumeRequestData) => Promise<boolean>;
}

export default function ResumeRequestModal({ isOpen, onClose, onSubmit }: ResumeRequestModalProps) {
  const [formData, setFormData] = useState<ResumeRequestData>({
    name: "",
    email: "",
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
      const success = await onSubmit(formData);

      if (success) {
        setFormData({ name: "", email: "" });
        setSubmitStatus({
          type: "success",
          message: "Resume sent successfully! Check your email.",
        });
        // Close modal after 2 seconds
        setTimeout(() => {
          onClose();
          setSubmitStatus({ type: null, message: "" });
        }, 2000);
      } else {
        setSubmitStatus({
          type: "error",
          message: "Failed to send resume. Please try again.",
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
      setFormData({ name: "", email: "" });
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

              <StatusMessage status={submitStatus} />

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isSubmitting}
                className="w-full neon-button flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
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
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <span>Send Resume</span>
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
