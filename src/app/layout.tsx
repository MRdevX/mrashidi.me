import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import BackgroundEffects from "@/components/BackgroundEffects";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mahdi Rashidi - Senior Backend Engineer",
  description:
    "Senior Backend Engineer and Cloud Architect with 9+ years of experience in scalable systems, cloud architecture, and DevOps practices.",
  keywords: "Backend Engineer, Cloud Architect, Node.js, TypeScript, Azure, Kubernetes, DevOps",
  authors: [{ name: "Mahdi Rashidi", url: "https://mrashidi.me" }],
  creator: "Mahdi Rashidi",
  openGraph: {
    type: "website",
    url: "https://mrashidi.me",
    title: "Mahdi Rashidi - Senior Backend Engineer",
    description: "Senior Backend Engineer and Cloud Architect with expertise in scalable systems and cloud architecture.",
    siteName: "Mahdi Rashidi",
    images: [
      {
        url: "/og-image.png", // You'll need to add this image
        width: 1200,
        height: 630,
        alt: "Mahdi Rashidi - Senior Backend Engineer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mahdi Rashidi - Senior Backend Engineer",
    description: "Senior Backend Engineer and Cloud Architect with expertise in scalable systems and cloud architecture.",
    creator: "@mrdevx",
    images: ["/og-image.png"], // You'll need to add this image
  },
  verification: {
    google: "your-google-verification-code", // Add your Google verification code
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} bg-black text-gray-100 min-h-screen relative`}>
        <BackgroundEffects />
        <Navbar />
        <main className="pt-16 relative z-10">{children}</main>
        <footer className="mt-20 py-8 relative z-10">
          <div className="max-w-4xl mx-auto px-4">
            <div className="glass-card p-8 text-center">
              <p className="text-gray-400 mb-4">© {new Date().getFullYear()} Mahdi Rashidi. All rights reserved.</p>
              <div className="flex justify-center space-x-6">
                <a
                  href="https://github.com/mrdevx"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link"
                >
                  <span className="sr-only">GitHub</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                </a>
                <a
                  href="https://linkedin.com/in/mrdevx"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link"
                >
                  <span className="sr-only">LinkedIn</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
                <a href="mailto:m8rashidi@gmail.com" className="social-link">
                  <span className="sr-only">Email</span>
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </footer>

        {/* Schema.org JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Mahdi Rashidi",
              jobTitle: "Senior Backend Engineer",
              url: "https://mrashidi.me",
              sameAs: ["https://github.com/mrdevx", "https://linkedin.com/in/mrdevx"],
              description: "Senior Backend Engineer and Cloud Architect with 9+ years of experience in scalable systems.",
              knowsAbout: [
                "Backend Development",
                "Cloud Architecture",
                "DevOps",
                "Node.js",
                "TypeScript",
                "Kubernetes",
                "Azure",
              ],
            }),
          }}
        />
      </body>
    </html>
  );
}
