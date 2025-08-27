"use client";

import { useId } from "react";

interface MainContentProps {
  children: React.ReactNode;
}

export function MainContent({ children }: MainContentProps) {
  const mainId = useId();

  return (
    <>
      <a
        href={`#${mainId}`}
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:p-4 focus:bg-orange-500 focus:text-black focus:outline-none focus:ring-2 focus:ring-white"
      >
        Skip to content
      </a>
      <main id={mainId} className="pt-16 relative z-10">
        {children}
      </main>
    </>
  );
}
