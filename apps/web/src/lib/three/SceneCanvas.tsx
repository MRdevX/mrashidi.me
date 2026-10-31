"use client";

import { Canvas, type CanvasProps } from "@react-three/fiber";
import { useRef } from "react";
import { useInView } from "./useInView";

type SceneCanvasProps = Omit<CanvasProps, "dpr" | "frameloop" | "gl">;

export function SceneCanvas({ className, style, children, ...props }: SceneCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef);

  return (
    <div ref={containerRef} className={className} style={style}>
      <Canvas
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: true, powerPreference: "low-power" }}
        frameloop={inView ? "always" : "never"}
        {...props}
      >
        {children}
      </Canvas>
    </div>
  );
}
