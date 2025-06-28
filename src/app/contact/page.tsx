"use client";

import { motion } from "framer-motion";
import ContactForm from "@/components/forms/ContactForm";

export default function Contact() {
  return (
    <div className="min-h-screen py-12 bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w-4xl mx-auto px-4">
        <motion.h1
          className="text-4xl font-bold mb-8 text-orange-500 font-cyberpunk glow-text"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Get In Touch
        </motion.h1>

        <motion.p
          className="text-gray-400 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Have a question or want to discuss a potential project? Feel free to reach out using the form below. I&apos;ll get
          back to you as soon as possible.
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <ContactForm />
        </motion.div>

        <motion.div
          className="mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold mb-6 text-orange-500 font-cyberpunk glow-text">Book a Mentorship Session</h2>
          <p className="text-gray-400 mb-6">
            Interested in career guidance or technical mentorship? Book a free session with me through ADPList.
          </p>
          <div className="flex justify-center">
            <section
              style={{
                height: "600px",
                boxShadow: "rgba(142, 151, 158, 0.15) 0px 4px 19px 0px",
                borderRadius: "16px",
                overflow: "hidden",
                width: "100%",
                maxWidth: "650px",
              }}
            >
              <iframe
                src="https://adplist.org/widgets/booking?src=mahdi-rashidi"
                title="ADPList Mentorship Calendar"
                width="100%"
                height="100%"
                loading="lazy"
                style={{ border: "0px" }}
              />
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
