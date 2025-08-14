import { motion } from "framer-motion";
import ContactForm from "@/components/forms/ContactForm";

export default function ContactFormSection() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
      <ContactForm />
    </motion.div>
  );
}
