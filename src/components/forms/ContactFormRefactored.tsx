"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { FormData } from "@/types/forms";
import { validateForm } from "./validation";
import { useForm } from "@/hooks/useForm";
import { Card, Button, AnimatedSection } from "@/components/ui";
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

export default function ContactFormRefactored() {
  const [recaptchaLoaded, setRecaptchaLoaded] = useState(false);
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  const {
    data: formData,
    errors,
    isSubmitting,
    submitStatus,
    handleChange,
    handleSubmit,
    reset,
  } = useForm<FormData>({
    initialData: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
    validate: validateForm,
    onSubmit: async (data) => {
      try {
        const recaptchaToken = await executeRecaptcha();
        const response = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...data, recaptchaToken }),
        });

        if (response.ok) {
          reset();
          return true;
        } else {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to send message");
        }
      } catch (error) {
        throw error;
      }
    },
    onSuccess: () => {},
  });

  useEffect(() => {
    if (!siteKey) {
      console.error("reCAPTCHA site key is not configured");
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

  if (!siteKey) {
    return (
      <Card variant="glass" padding="lg">
        <p className="text-red-500">Contact form is temporarily unavailable. Please try again later.</p>
      </Card>
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
      <AnimatedSection animation="slideUp" delay={0.3}>
        <Card variant="glass" padding="xl">
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

            <Button type="submit" variant="neon" size="lg" loading={isSubmitting} disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Sending..." : "Send Message"}
            </Button>
          </form>
        </Card>
      </AnimatedSection>
    </>
  );
}
