"use client";

import { usePathname } from "next/navigation";
import { lazy, Suspense } from "react";
import { MainContent } from "./MainContent";

const Navbar = lazy(() =>
  import("@/components/layout").then((module) => ({
    default: module.Navbar,
  }))
);

const BottomNavigation = lazy(() =>
  import("@/components/layout").then((module) => ({
    default: module.BottomNavigation,
  }))
);

const Footer = lazy(() =>
  import("@/components/layout").then((module) => ({
    default: module.Footer,
  }))
);

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");

  if (isAdminRoute) {
    // For admin routes, only render the children without any main site layout
    return <>{children}</>;
  }

  // For regular routes, render the full layout
  return (
    <>
      <Suspense fallback={null}>
        <Navbar />
      </Suspense>
      <MainContent>{children}</MainContent>
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
      <Suspense fallback={null}>
        <BottomNavigation />
      </Suspense>
    </>
  );
}
