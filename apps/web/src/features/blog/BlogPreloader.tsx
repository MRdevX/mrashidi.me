"use client";

import { useEffect } from "react";
import { preloadFirstBlogPage } from "./fetchBlogPage";

export function BlogPreloader() {
  useEffect(() => {
    const timer = setTimeout(() => {
      preloadFirstBlogPage();
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return null;
}
