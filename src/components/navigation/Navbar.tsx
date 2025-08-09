"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Disclosure } from "@headlessui/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navigation = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Projects", href: "/projects" },
    { name: "Blog", href: "/blog" },
    { name: "Resume", href: "/resume" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <Disclosure
      as="nav"
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-black/20 backdrop-blur-md border-b border-orange-500/10" : "bg-transparent"
      }`}
      aria-label="Main Navigation"
    >
      {({ open }) => (
        <>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex justify-between w-full">
                <div className="flex items-center space-x-4">
                  <Link href="/" className="flex items-center flex-shrink-0" aria-label="Mahdi Rashidi - Home">
                    <motion.span
                      className="text-xl font-bold text-orange-500 font-cyberpunk glow-text"
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      MR
                    </motion.span>
                  </Link>
                  {/* GitHub Link */}
                  <motion.a
                    href="https://github.com/MRdevX/mrashidi.me"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hidden sm:flex items-center space-x-2 px-3 py-1 text-sm text-gray-400 hover:text-orange-500 transition-colors duration-200 focus-visible:outline-offset-4 focus-visible:outline-orange-500 border border-gray-600 hover:border-orange-500 rounded-md"
                    aria-label="View source code on GitHub"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path
                        fillRule="evenodd"
                        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>View Code</span>
                  </motion.a>
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8" role="navigation" aria-label="Main Menu">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 transition-colors duration-200 focus-visible:outline-offset-4 focus-visible:outline-orange-500 ${
                        pathname === item.href
                          ? "border-orange-500 text-orange-500"
                          : "border-transparent text-gray-400 hover:text-orange-400 hover:border-orange-400"
                      }`}
                      aria-current={pathname === item.href ? "page" : undefined}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
              <div className="-mr-2 flex items-center sm:hidden">
                <Disclosure.Button
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-orange-500 hover:bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-orange-500"
                  aria-label={open ? "Close main menu" : "Open main menu"}
                >
                  <span className="sr-only">{open ? "Close main menu" : "Open main menu"}</span>
                  {open ? (
                    <svg
                      className="block h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  ) : (
                    <svg
                      className="block h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                    </svg>
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          <AnimatePresence>
            {open && (
              <Disclosure.Panel
                static
                as={motion.div}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="sm:hidden bg-black/20 backdrop-blur-md border-b border-orange-500/10"
                id="mobile-menu"
                aria-label="Mobile Menu"
              >
                <div className="pt-2 pb-3 space-y-1">
                  {navigation.map((item) => (
                    <Disclosure.Button
                      key={item.name}
                      as={Link}
                      href={item.href}
                      className={`block py-2 pl-3 pr-4 text-base font-medium border-l-4 focus-visible:outline-offset-4 focus-visible:outline-orange-500 ${
                        pathname === item.href
                          ? "border-orange-500 text-orange-500 bg-gray-800/50"
                          : "border-transparent text-gray-400 hover:text-orange-400 hover:border-orange-400 hover:bg-gray-800/30"
                      }`}
                      aria-current={pathname === item.href ? "page" : undefined}
                    >
                      {item.name}
                    </Disclosure.Button>
                  ))}
                  {/* GitHub Link in Mobile Menu */}
                  <Disclosure.Button
                    as="a"
                    href="https://github.com/MRdevX/mrashidi.me"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center py-2 pl-3 pr-4 text-base font-medium border-l-4 border-transparent text-gray-400 hover:text-orange-400 hover:border-orange-400 hover:bg-gray-800/30 focus-visible:outline-offset-4 focus-visible:outline-orange-500"
                  >
                    <svg className="mr-3 h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path
                        fillRule="evenodd"
                        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                        clipRule="evenodd"
                      />
                    </svg>
                    View Code
                  </Disclosure.Button>
                </div>
              </Disclosure.Panel>
            )}
          </AnimatePresence>
        </>
      )}
    </Disclosure>
  );
}
