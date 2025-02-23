"use client";

import { useState, useEffect } from "react";
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
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [recaptchaLoaded, setRecaptchaLoaded] = useState(false);

  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  useEffect(() => {
    if (!siteKey) {
      console.error("reCAPTCHA site key is not configured");
      setErrorMessage("Contact form is temporarily unavailable");
      return;
    }
    setRecaptchaLoaded(true);
  }, [siteKey]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!siteKey) {
      setErrorMessage("Contact form is temporarily unavailable");
      return;
    }

    setStatus("loading");
    setErrorMessage("");

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

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send message");
      }

      setStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
      
      // Reset success message after 5 seconds
      setTimeout(() => setStatus("idle"), 5000);
    } catch (error) {
      console.error("Error sending message:", error);
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Failed to send message");
      
      // Reset error message after 5 seconds
      setTimeout(() => {
        setStatus("idle");
        setErrorMessage("");
      }, 5000);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
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
        className="glass-card p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-orange-500 mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-gray-900/50 border border-orange-500/20 rounded-lg px-4 py-2 text-gray-300 focus:outline-none focus:border-orange-500/40 transition-colors"
                placeholder="Your name"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-orange-500 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-gray-900/50 border border-orange-500/20 rounded-lg px-4 py-2 text-gray-300 focus:outline-none focus:border-orange-500/40 transition-colors"
                placeholder="your@email.com"
              />
            </div>
          </div>

          <div>
            <label htmlFor="subject" className="block text-orange-500 mb-2">
              Subject
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              required
              value={formData.subject}
              onChange={handleChange}
              className="w-full bg-gray-900/50 border border-orange-500/20 rounded-lg px-4 py-2 text-gray-300 focus:outline-none focus:border-orange-500/40 transition-colors"
              placeholder="Message subject"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-orange-500 mb-2">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              required
              value={formData.message}
              onChange={handleChange}
              rows={5}
              className="w-full bg-gray-900/50 border border-orange-500/20 rounded-lg px-4 py-2 text-gray-300 focus:outline-none focus:border-orange-500/40 transition-colors resize-none"
              placeholder="Your message..."
            />
          </div>

          <div className="flex items-center justify-between">
            <motion.button
              type="submit"
              className="neon-button px-6 py-2 relative"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={status === "loading"}
            >
              {status === "loading" ? (
                <div className="flex items-center">
                  <div className="loading-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              ) : (
                "Send Message"
              )}
            </motion.button>

            {status === "success" && (
              <motion.p
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-green-500"
              >
                Message sent successfully!
              </motion.p>
            )}

            {status === "error" && (
              <motion.p
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-red-500"
              >
                {errorMessage}
              </motion.p>
            )}
          </div>
        </form>
      </motion.div>
    </>
  );
} 