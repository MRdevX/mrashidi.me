"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Disclosure } from "@headlessui/react";
import { usePathname } from "next/navigation";
import { useScrollPosition } from "@/hooks";
import { navigation } from "@/data";
import { BrandLogo } from "./BrandLogo";
import { NavigationItem } from "./NavigationItem";
import { MobileNavigationItem } from "./MobileNavigationItem";
import { GitHubLink } from "./GitHubLink";
import { MobileMenuButton } from "./MobileMenuButton";

export default function Navbar() {
  const isScrolled = useScrollPosition();
  const pathname = usePathname();

  const getNavbarClasses = () => {
    return `fixed w-full z-50 transition-all duration-300 ${
      isScrolled ? "bg-black/20 backdrop-blur-md border-b border-orange-500/10" : "bg-transparent"
    }`;
  };

  return (
    <Disclosure as="nav" className={getNavbarClasses()} aria-label="Main Navigation">
      {({ open }) => (
        <>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex justify-between w-full">
                <div className="flex items-center space-x-4">
                  <BrandLogo />
                  <GitHubLink variant="desktop" />
                </div>

                <div className="hidden sm:ml-6 sm:flex sm:space-x-8" role="navigation" aria-label="Main Menu">
                  {navigation.map((item) => (
                    <NavigationItem key={item.name} item={item} isActive={pathname === item.href} />
                  ))}
                </div>
              </div>

              <div className="-mr-2 flex items-center sm:hidden">
                <MobileMenuButton isOpen={open} />
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
                    <MobileNavigationItem key={item.name} item={item} isActive={pathname === item.href} />
                  ))}
                  <GitHubLink variant="mobile" />
                </div>
              </Disclosure.Panel>
            )}
          </AnimatePresence>
        </>
      )}
    </Disclosure>
  );
}
