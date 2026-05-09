"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { FileText, Mail, MessageSquare, Send, User } from "lucide-react";
import { useState } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { CyberpunkButton } from "@/components/ui";
import { useThemeConfig } from "@/hooks/useThemeConfig";
import { logger } from "@/lib/core";
import { type ContactFormData, contactFormSchema } from "@/lib/validation";
import { FormInputWithValidation } from "./FormInputWithValidation";
import { StatusMessage } from "./StatusMessage";

export function ContactFormRefactored() {
  const { getCardPattern } = useThemeConfig();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({
    type: null,
    message: "",
  });

  const { executeRecaptcha } = useGoogleReCaptcha();

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

  const onSubmit: SubmitHandler<ContactFormData> = async (data) => {
    setSubmitStatus({ type: null, message: "" });
    setIsSubmitting(true);

    try {
      if (!executeRecaptcha) {
        throw new Error("reCAPTCHA is not available");
      }

      const recaptchaToken = await executeRecaptcha("submit");

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`${getCardPattern()} relative isolate z-0 p-6 sm:p-8`}
    >
      <div className="relative z-10">
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
            icon={<User className="w-4 h-4" aria-hidden />}
          />

          <FormInputWithValidation
            form={form}
            name="email"
            label="Email"
            type="email"
            placeholder="your.email@example.com"
            icon={<Mail className="w-4 h-4" aria-hidden />}
          />

          <FormInputWithValidation
            form={form}
            name="subject"
            label="Subject"
            placeholder="What is this about?"
            icon={<FileText className="w-4 h-4" aria-hidden />}
          />

          <div>
            <FormInputWithValidation
              form={form}
              name="message"
              label="Message"
              placeholder="Your message here..."
              multiline
              rows={5}
              icon={<MessageSquare className="w-4 h-4" aria-hidden />}
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
            icon={<Send className="w-4 h-4" aria-hidden />}
            className="w-full"
            variant="neon"
          >
            {isSubmitting ? "Sending..." : "Send Message"}
          </CyberpunkButton>
        </form>
      </div>
    </motion.div>
  );
}
