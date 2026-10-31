"use client";

import { useSyncExternalStore } from "react";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";
import { detectDeviceCapabilities } from "@/lib/utils/performance";
import { shouldRender3D } from "./shouldRender3D";

let capableDevice: boolean | undefined;

function isCapableDevice(): boolean {
  if (capableDevice === undefined) {
    const { supportsWebGL2, isLowEnd } = detectDeviceCapabilities();
    capableDevice = supportsWebGL2 && !isLowEnd;
  }
  return capableDevice;
}

const subscribeNever = () => () => undefined;

export function useRender3D(): boolean {
  const capable = useSyncExternalStore(subscribeNever, isCapableDevice, () => false);
  const finePointer = useMediaQuery("(pointer: fine)");
  const wideViewport = useMediaQuery("(min-width: 1024px)");
  const prefersReducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)", true);

  return shouldRender3D({
    supportsWebGL2: capable,
    isLowEnd: !capable,
    finePointer,
    wideViewport,
    prefersReducedMotion,
  });
}
