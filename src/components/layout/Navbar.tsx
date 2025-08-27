"use client";

import { Disclosure } from "@headlessui/react";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/ui";
import { navigation } from "@/data";
import { useScrollPosition } from "@/hooks";
import { BrandLogo } from "./BrandLogo";
import { MobileMenuButton } from "./MobileMenuButton";
import { MobileNavigationItem } from "./MobileNavigationItem";
import { NavigationItem } from "./NavigationItem";
import { VersionBadge } from "./VersionBadge";

export default function Navbar() {
  const isScrolled = useScrollPosition();
  const pathname = usePathname();

  const getNavbarClasses = () => {
    return `fixed w-full z-50 transition-all duration-300 ${
      isScrolled ? "glass-card border-b border-gray-200/20 dark:border-gray-700/20" : "bg-transparent"
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
                  <VersionBadge variant="desktop" />
                </div>

                <nav className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-8" aria-label="Main Menu">
                  {navigation.map((item) => (
                    <NavigationItem key={item.name} item={item} isActive={pathname === item.href} />
                  ))}
                  <ThemeToggle size="sm" />
                </nav>
              </div>

              <div className="-mr-2 flex items-center space-x-2 sm:hidden">
                <ThemeToggle size="sm" />
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
                className="sm:hidden glass-card border-b border-gray-200/20 dark:border-gray-700/20"
                id="mobile-menu"
                aria-label="Mobile Menu"
              >
                <div className="pt-2 pb-3 space-y-1">
                  {navigation.map((item) => (
                    <MobileNavigationItem key={item.name} item={item} isActive={pathname === item.href} />
                  ))}
                  <VersionBadge variant="mobile" />
                </div>
              </Disclosure.Panel>
            )}
          </AnimatePresence>
        </>
      )}
    </Disclosure>
  );
}
