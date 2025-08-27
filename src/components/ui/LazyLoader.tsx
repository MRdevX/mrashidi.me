import { type ReactNode, Suspense } from "react";
import { LoadingAnimation } from "./LoadingAnimation";

interface LazyLoaderProps {
  children: ReactNode;
  loadingText?: string;
  loadingColor?: "orange" | "green" | "blue" | "white";
  fallbackClassName?: string;
  minHeight?: string;
}

export function LazyLoader({
  children,
  loadingText = "Loading...",
  loadingColor = "orange",
  fallbackClassName = "content-section p-6 flex justify-center items-center",
  minHeight = "240px",
}: LazyLoaderProps) {
  return (
    <Suspense
      fallback={
        <div className={fallbackClassName} style={{ minHeight }}>
          <LoadingAnimation text={loadingText} color={loadingColor} />
        </div>
      }
    >
      {children}
    </Suspense>
  );
}
