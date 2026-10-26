"use client";

import type { ReactNode } from "react";
import { useMouseTracking } from "./useMouseTracking";

interface MouseTrackingWrapperProps {
  children: ReactNode;
  selector?: string;
}

export function MouseTrackingWrapper({ children, selector = ".glitch-image" }: MouseTrackingWrapperProps) {
  useMouseTracking(selector);
  return <>{children}</>;
}
