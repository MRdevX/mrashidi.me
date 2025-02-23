import "./globals.css";
import { Inter } from "next/font/google";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Your Name - Software Engineer",
  description: "Backend Developer & Software Engineer",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} relative`}>
        <div className="code-pattern fixed inset-0 z-0 opacity-50"></div>
        <div className="relative z-10">
          <header className="border-b border-gray-200 dark:border-gray-800">
            <nav className="container mx-auto px-4 py-6">
              <div className="flex items-center justify-between">
                <Link href="/" className="text-xl font-bold hover:text-indigo-600 dark:hover:text-indigo-400">
                  <span className="font-mono">&lt;</span>
                  YourName
                  <span className="font-mono">/&gt;</span>
                </Link>
                <div className="flex gap-6">
                  <Link href="/about" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                    About
                  </Link>
                  <Link href="/blog" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                    Blog
                  </Link>
                  <Link href="/projects" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                    Projects
                  </Link>
                  <Link href="/resume" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                    Resume
                  </Link>
                </div>
              </div>
            </nav>
          </header>
          <main className="container mx-auto px-4 py-8">{children}</main>
          <footer className="border-t border-gray-200 dark:border-gray-800">
            <div className="container mx-auto px-4 py-6 text-center text-sm text-gray-600 dark:text-gray-400">
              © {new Date().getFullYear()} Your Name. Built with Next.js and Tailwind CSS.
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
