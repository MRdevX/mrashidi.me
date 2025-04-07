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
                <Link href="/" className="flex items-center flex-shrink-0" aria-label="Dee M. Rashidi - Home">
                  <motion.span
                    className="text-xl font-bold text-orange-500 font-cyberpunk glow-text"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    MR
                  </motion.span>
                </Link>
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
                <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-orange-500 hover:bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-orange-500" aria-label={open ? "Close main menu" : "Open main menu"}>
                  <span className="sr-only">{open ? "Close main menu" : "Open main menu"}</span>
                  {open ? (
                    <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  ) : (
                    <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
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
                </div>
              </Disclosure.Panel>
            )}
          </AnimatePresence>
        </>
      )}
    </Disclosure>
  );
}
