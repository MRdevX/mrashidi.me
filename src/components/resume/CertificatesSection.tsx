import { motion } from "framer-motion";
import { Award, CheckCircle, ExternalLink } from "lucide-react";
import { certificates } from "@/data";

export default function CertificatesSection() {
  return (
    <section className="mb-16">
      <div className="flex items-center gap-3 mb-8">
        <Award className="w-8 h-8 text-orange-500" />
        <h2 className="text-3xl font-bold text-orange-500 font-cyberpunk glow-text">Recent Certifications</h2>
      </div>
      <div className="space-y-8">
        {certificates.map((category, categoryIndex) => (
          <motion.div
            key={category.category}
            className="feature-card group"
            whileHover={{ scale: 1.01 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * categoryIndex }}
          >
            <h3 className="text-2xl font-semibold mb-6 text-orange-500 group-hover:text-orange-400 transition-colors border-b border-gray-700 pb-2">
              {category.category}
            </h3>
            <div className="space-y-2">
              {category.certificates.map((cert, i) => (
                <motion.div
                  key={i}
                  className={`flex items-center p-3 rounded-lg border border-gray-700 hover:border-orange-500 transition-all duration-300 relative z-10 ${
                    cert.url ? "cursor-pointer hover:bg-gray-800/50" : ""
                  }`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * i }}
                  onClick={() => cert.url && window.open(cert.url, "_blank")}
                >
                  <CheckCircle className="w-5 h-5 text-orange-500 flex-shrink-0 mr-3" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-200 hover:text-white transition-colors flex items-center">
                      {cert.name}
                      {cert.url && <ExternalLink className="w-4 h-4 ml-2 text-orange-500 flex-shrink-0" />}
                    </div>
                  </div>
                  <div className="text-sm text-gray-400 text-right ml-4">
                    <div>{cert.year}</div>
                    <div className="text-xs text-gray-500">{cert.provider}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
