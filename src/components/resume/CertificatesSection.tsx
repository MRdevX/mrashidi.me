import { motion } from "framer-motion";
import certificates from "@/data/certificates";

export default function CertificatesSection() {
  return (
    <section className="mb-16">
      <h2 className="text-3xl font-bold mb-8 text-orange-500 font-cyberpunk glow-text">Recent Certifications</h2>
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
                  <svg
                    className="w-5 h-5 text-orange-500 flex-shrink-0 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-200 hover:text-white transition-colors flex items-center">
                      {cert.name}
                      {cert.url && (
                        <svg
                          className="w-4 h-4 ml-2 text-orange-500 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                      )}
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
