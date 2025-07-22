"use client";

import { useState, FormEvent, ChangeEvent, useEffect } from "react";
import { motion } from "framer-motion";
import Script from "next/script";
import { FormData, FormErrors, SubmitStatus } from "@/types/forms";
import { validateForm } from "./validation";
import FormInput from "./FormInput";
import StatusMessage from "./StatusMessage";

declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => Promise<void>;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>({ type: null, message: "" });
  const [recaptchaLoaded, setRecaptchaLoaded] = useState(false);

  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  useEffect(() => {
    if (!siteKey) {
      console.error("reCAPTCHA site key is not configured");
      setSubmitStatus({ type: "error", message: "Contact form is temporarily unavailable" });
      return;
    }
    setRecaptchaLoaded(true);
  }, [siteKey]);

  const executeRecaptcha = async (): Promise<string> => {
    try {
      await window.grecaptcha.ready(() => {});
      const token = await window.grecaptcha.execute(siteKey!, { action: "submit" });
      return token;
    } catch (error) {
      console.error("Error executing reCAPTCHA:", error);
      throw new Error("Failed to verify reCAPTCHA");
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (errors[name as keyof FormErrors]) {
      setErrors({ ...errors, [name]: undefined });
    }
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
      const recaptchaToken = await executeRecaptcha();

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          recaptchaToken,
        }),
      });

      if (response.ok) {
        setFormData({ name: "", email: "", subject: "", message: "" });
        setSubmitStatus({
          type: "success",
          message: "Message sent successfully! I'll get back to you soon.",
        });
      } else {
        const errorData = await response.json();
        setSubmitStatus({
          type: "error",
          message: errorData.message || "Failed to send message. Please try again.",
        });
      }
    } catch (_error) {
      setSubmitStatus({
        type: "error",
        message: "Something went wrong. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!siteKey) {
    return (
      <div className="glass-card p-6">
        <p className="text-red-500">Contact form is temporarily unavailable. Please try again later.</p>
      </div>
    );
  }

  if (!recaptchaLoaded) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="loading-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    );
  }

  return (
    <>
      <Script src={`https://www.google.com/recaptcha/api.js?render=${siteKey}`} strategy="lazyOnload" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-card p-6 sm:p-8"
      >
        <StatusMessage status={submitStatus} />

        <form onSubmit={handleSubmit} noValidate className="space-y-6" aria-label="Contact form">
          <FormInput
            id="name"
            name="name"
            label="Name"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            placeholder="Your name"
          />

          <FormInput
            id="email"
            name="email"
            label="Email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            placeholder="your.email@example.com"
          />

          <FormInput
            id="subject"
            name="subject"
            label="Subject"
            value={formData.subject}
            onChange={handleChange}
            error={errors.subject}
            placeholder="What is this about?"
          />

          <FormInput
            id="message"
            name="message"
            label="Message"
            value={formData.message}
            onChange={handleChange}
            error={errors.message}
            placeholder="Your message here..."
            multiline
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className={`neon-button w-full rounded-lg ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {isSubmitting ? "Sending..." : "Send Message"}
          </button>
        </form>
      </motion.div>
    </>
  );
}
