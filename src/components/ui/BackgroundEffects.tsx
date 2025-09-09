"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { performanceUtils } from "@/lib/utils/performance";

interface Particle {
  x: number;
  y: number;
  speed: number;
  char: string;
}

export function BackgroundEffects() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const matrixRef = useRef<Particle[]>([]);
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [isLowPerformance, setIsLowPerformance] = useState(false);
  const [shouldDisableEffects, setShouldDisableEffects] = useState(false);
  const lastFrameTime = useRef(0);
  const frameCount = useRef(0);

  const chars = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";

  useEffect(() => {
    setMounted(true);

    const { isLowEnd, shouldDisableEffects: disableEffects } = performanceUtils.detectDeviceCapabilities();
    setIsLowPerformance(isLowEnd);
    setShouldDisableEffects(disableEffects);

    const isDarkMode = document.documentElement.classList.contains("dark");
    setIsDark(isDarkMode);

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === "attributes" && mutation.attributeName === "class") {
          const isDarkMode = document.documentElement.classList.contains("dark");
          setIsDark(isDarkMode);
        }
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!mounted) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const baseParticleCount = isLowPerformance ? 20 : Math.floor(canvas.width / 100);
    const particleCount = Math.min(baseParticleCount, 60);

    matrixRef.current = Array.from({ length: particleCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      speed: 0.8 + Math.random() * 1.5,
      char: chars[Math.floor(Math.random() * chars.length)],
    }));

    let animationFrame: number;
    const targetFPS = isLowPerformance ? 20 : 30;
    const frameInterval = 1000 / targetFPS;

    const animate = (currentTime: number) => {
      if (currentTime - lastFrameTime.current < frameInterval) {
        animationFrame = requestAnimationFrame(animate);
        return;
      }

      lastFrameTime.current = currentTime;
      frameCount.current++;

      const bgColor = isDark ? "rgba(0, 0, 0, 0.02)" : "rgba(255, 255, 255, 0.02)";
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const textColor = isDark ? "#0f0" : "#006400";
      ctx.fillStyle = textColor;
      ctx.font = "11px monospace";

      for (const particle of matrixRef.current) {
        ctx.fillText(particle.char, particle.x, particle.y);
        particle.y += particle.speed;

        if (particle.y > canvas.height + 50) {
          particle.y = -20;
          particle.x = Math.random() * canvas.width;
          particle.char = chars[Math.floor(Math.random() * chars.length)];
        }
      }

      animationFrame = requestAnimationFrame(animate);
    };

    animate(0);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrame);
    };
  }, [isDark, mounted, isLowPerformance]);

  if (!mounted) {
    return null;
  }

  if (shouldDisableEffects) {
    return (
      <>
        {/* Minimal gradient overlays only */}
        <div className="fixed top-0 left-0 w-full h-32 bg-gradient-to-b from-black/10 to-transparent dark:from-black/20 pointer-events-none z-0" />
        <div className="fixed bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black/10 to-transparent dark:from-black/20 pointer-events-none z-0" />
      </>
    );
  }

  return (
    <>
      {/* Matrix animation - reduced opacity for better performance */}
      <canvas
        ref={canvasRef}
        className={`fixed top-0 left-0 w-full h-full pointer-events-none z-0 ${
          isLowPerformance ? (isDark ? "opacity-10" : "opacity-5") : isDark ? "opacity-20" : "opacity-10"
        }`}
      />

      {/* Gradient overlays */}
      <div className="fixed top-0 left-0 w-full h-32 bg-gradient-to-b from-black/20 to-transparent dark:from-black/40 pointer-events-none z-0" />
      <div className="fixed bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black/20 to-transparent dark:from-black/40 pointer-events-none z-0" />

      {/* Radial gradient effects - simplified for performance */}
      {!isLowPerformance && (
        <motion.div
          className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
          animate={{
            background: [
              "radial-gradient(circle at 0% 0%, rgba(255,95,31,0.05) 0%, transparent 40%)",
              "radial-gradient(circle at 100% 100%, rgba(255,95,31,0.05) 0%, transparent 40%)",
            ],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "linear",
          }}
        />
      )}

      {/* Scanline effect - reduced for performance */}
      {!isLowPerformance && (
        <div
          className={`scanline fixed top-0 left-0 w-full h-full pointer-events-none z-0 ${
            isDark ? "opacity-5" : "opacity-3"
          }`}
        />
      )}
    </>
  );
}
