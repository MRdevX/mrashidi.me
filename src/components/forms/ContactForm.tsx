"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { FileText, Mail, MessageSquare, Send, User } from "lucide-react";
import Script from "next/script";
import { useEffect, useState } from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { CyberpunkButton } from "@/components/ui";
import { logger } from "@/lib/core";
import { type ContactFormData, contactFormSchema } from "@/lib/validation";
import { FormInputWithValidation } from "./FormInputWithValidation";
import { StatusMessage } from "./StatusMessage";

declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => Promise<void>;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

export function ContactFormRefactored() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({
    type: null,
    message: "",
  });
  const [recaptchaLoaded, setRecaptchaLoaded] = useState(false);

  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    mode: "onBlur",
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  useEffect(() => {
    if (!siteKey) {
      logger.error("reCAPTCHA site key is not configured");
      setSubmitStatus({
        type: "error",
        message: "Contact form is temporarily unavailable",
      });
      return;
    }

    if (window.grecaptcha) {
      setRecaptchaLoaded(true);
      return;
    }

    const fallbackTimeout = setTimeout(() => {
      logger.warn("reCAPTCHA script failed to load, enabling form without reCAPTCHA");
      setRecaptchaLoaded(true);
    }, 5000);

    return () => clearTimeout(fallbackTimeout);
  }, [siteKey]);

  const handleRecaptchaLoad = () => {
    setRecaptchaLoaded(true);
  };

  const handleRecaptchaError = () => {
    logger.error("reCAPTCHA script failed to load");
    setRecaptchaLoaded(true);
  };

  const executeRecaptcha = async (): Promise<string> => {
    if (!siteKey) {
      throw new Error("reCAPTCHA site key is not configured");
    }

    if (!window.grecaptcha) {
      logger.warn("reCAPTCHA not available, skipping verification");
      return "no-recaptcha";
    }

    try {
      await window.grecaptcha.ready(() => {});
      const token = await window.grecaptcha.execute(siteKey, {
        action: "submit",
      });
      return token;
    } catch (error) {
      logger.error({ error }, "Error executing reCAPTCHA");
      throw new Error("Failed to verify reCAPTCHA");
    }
  };

  const onSubmit: SubmitHandler<ContactFormData> = async (data) => {
    setSubmitStatus({ type: null, message: "" });
    setIsSubmitting(true);

    try {
      const recaptchaToken = await executeRecaptcha();

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          recaptchaToken,
        }),
      });

      if (response.ok) {
        form.reset();
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
    } catch (error) {
      logger.error({ error }, "Contact form submission error");
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
      <div className="flex flex-col justify-center items-center min-h-[400px] space-y-4">
        <div className="loading-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <p className="text-sm text-gray-500 animate-pulse">Initializing secure form...</p>
      </div>
    );
  }

  return (
    <>
      <Script
        src={`https://www.google.com/recaptcha/api.js?render=${siteKey}`}
        strategy="lazyOnload"
        onLoad={handleRecaptchaLoad}
        onError={handleRecaptchaError}
      />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-card p-6 sm:p-8"
      >
        <StatusMessage status={submitStatus} />

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          noValidate
          className="space-y-6 focus-within:ring-2 focus-within:ring-orange-500/20 focus-within:ring-offset-2 rounded-lg p-1"
          aria-label="Contact form"
        >
          <FormInputWithValidation
            form={form}
            name="name"
            label="Name"
            placeholder="Your name"
            icon={<User className="w-4 h-4" />}
          />

          <FormInputWithValidation
            form={form}
            name="email"
            label="Email"
            type="email"
            placeholder="your.email@example.com"
            icon={<Mail className="w-4 h-4" />}
          />

          <FormInputWithValidation
            form={form}
            name="subject"
            label="Subject"
            placeholder="What is this about?"
            icon={<FileText className="w-4 h-4" />}
          />

          <div>
            <FormInputWithValidation
              form={form}
              name="message"
              label="Message"
              placeholder="Your message here..."
              multiline
              rows={5}
              icon={<MessageSquare className="w-4 h-4" />}
            />
            <div className="flex justify-between items-center mt-1">
              <p className="text-xs text-gray-500">Tell me about your project, question, or how I can help you</p>
              <p className="text-xs text-gray-500">{form.watch("message")?.length || 0}/1000</p>
            </div>
          </div>

          <CyberpunkButton
            type="submit"
            disabled={isSubmitting || !form.watch("message") || form.watch("message").length < 10}
            loading={isSubmitting}
            icon={<Send className="w-4 h-4" />}
            className="w-full"
            variant="neon"
          >
            {isSubmitting ? "Sending..." : "Send Message"}
          </CyberpunkButton>
        </form>
      </motion.div>
    </>
  );
}
