"use client";

import { useEffect } from "react";
import { useBlogPreload } from "@/hooks";

export function BlogPreloader() {
  const { preloadFirstPage } = useBlogPreload();

  useEffect(() => {
    const timer = setTimeout(() => {
      preloadFirstPage();
    }, 2000);

    return () => clearTimeout(timer);
  }, [preloadFirstPage]);

  return null;
}
