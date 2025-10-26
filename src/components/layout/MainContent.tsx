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
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-orange-500 focus:text-white focus:rounded-md focus:font-medium focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
      >
        Skip to content
      </a>
      <main id={mainId} className="pt-16 pb-8 relative z-10">
        {children}
      </main>
    </>
  );
}
