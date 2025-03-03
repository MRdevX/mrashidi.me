"use client";

import { useState, FormEvent, ChangeEvent, useEffect } from "react";
import { motion } from "framer-motion";
import Script from "next/script";

declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => Promise<void>;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    subject?: string;
    message?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });
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

  // Uncomment and implement the reCAPTCHA execution
  const executeRecaptcha = async (): Promise<string> => {
    try {
      await window.grecaptcha.ready(() => {});
      const token = await window.grecaptcha.execute(siteKey!, { action: 'submit' });
      return token;
    } catch (error) {
      console.error('Error executing reCAPTCHA:', error);
      throw new Error('Failed to verify reCAPTCHA');
    }
  };

  const validateForm = () => {
    const newErrors: {
      name?: string;
      email?: string;
      subject?: string;
      message?: string;
    } = {};
    
    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Subject validation
    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    }

    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message should be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors({ ...errors, [name]: undefined });
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Reset status
    setSubmitStatus({ type: null, message: "" });
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Execute reCAPTCHA and get token
      const recaptchaToken = await executeRecaptcha();
      
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          recaptchaToken
        }),
      });

      if (response.ok) {
        // Reset form on success
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
      // We use _error with underscore prefix to indicate it's intentionally unused
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
      <Script
        src={`https://www.google.com/recaptcha/api.js?render=${siteKey}`}
        strategy="lazyOnload"
      />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-card p-6 sm:p-8"
      >
        {submitStatus.type && (
          <div
            className={`mb-6 p-4 rounded-md ${
              submitStatus.type === "success"
                ? "bg-green-900/20 text-green-400 border border-green-500/30"
                : "bg-red-900/20 text-red-400 border border-red-500/30"
            }`}
            role="alert"
          >
            {submitStatus.message}
          </div>
        )}
        
        <form onSubmit={handleSubmit} noValidate className="space-y-6" aria-label="Contact form">
          <div>
            <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-200">
              Name <span className="text-orange-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full p-3 bg-gray-900/50 border rounded-md focus:ring-2 focus:outline-none ${
                errors.name 
                  ? "border-red-500 focus:ring-red-500/50" 
                  : "border-gray-700 focus:ring-orange-500/50 focus:border-orange-500"
              }`}
              placeholder="Your name"
              aria-required="true"
              aria-invalid={errors.name ? "true" : "false"}
              aria-describedby={errors.name ? "name-error" : undefined}
            />
            {errors.name && (
              <p id="name-error" className="mt-1 text-sm text-red-500">
                {errors.name}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-200">
              Email <span className="text-orange-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full p-3 bg-gray-900/50 border rounded-md focus:ring-2 focus:outline-none ${
                errors.email 
                  ? "border-red-500 focus:ring-red-500/50" 
                  : "border-gray-700 focus:ring-orange-500/50 focus:border-orange-500"
              }`}
              placeholder="your.email@example.com"
              aria-required="true"
              aria-invalid={errors.email ? "true" : "false"}
              aria-describedby={errors.email ? "email-error" : undefined}
            />
            {errors.email && (
              <p id="email-error" className="mt-1 text-sm text-red-500">
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="subject" className="block mb-2 text-sm font-medium text-gray-200">
              Subject <span className="text-orange-500">*</span>
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className={`w-full p-3 bg-gray-900/50 border rounded-md focus:ring-2 focus:outline-none ${
                errors.subject 
                  ? "border-red-500 focus:ring-red-500/50" 
                  : "border-gray-700 focus:ring-orange-500/50 focus:border-orange-500"
              }`}
              placeholder="What's this about?"
              aria-required="true"
              aria-invalid={errors.subject ? "true" : "false"}
              aria-describedby={errors.subject ? "subject-error" : undefined}
            />
            {errors.subject && (
              <p id="subject-error" className="mt-1 text-sm text-red-500">
                {errors.subject}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-200">
              Message <span className="text-orange-500">*</span>
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={5}
              className={`w-full p-3 bg-gray-900/50 border rounded-md focus:ring-2 focus:outline-none ${
                errors.message 
                  ? "border-red-500 focus:ring-red-500/50" 
                  : "border-gray-700 focus:ring-orange-500/50 focus:border-orange-500"
              }`}
              placeholder="Your message here..."
              aria-required="true"
              aria-invalid={errors.message ? "true" : "false"}
              aria-describedby={errors.message ? "message-error" : undefined}
            ></textarea>
            {errors.message && (
              <p id="message-error" className="mt-1 text-sm text-red-500">
                {errors.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`neon-button w-full py-3 px-6 flex justify-center items-center disabled:opacity-70 disabled:cursor-not-allowed ${isSubmitting ? 'opacity-80' : ''}`}
            aria-busy={isSubmitting ? "true" : "false"}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending...
              </>
            ) : (
              "Send Message"
            )}
          </button>
        </form>
      </motion.div>
    </>
  );
} 