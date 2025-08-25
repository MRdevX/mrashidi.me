"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";

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
  const { resolvedTheme } = useTheme();
  const chars = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const particleCount = Math.floor(canvas.width / 20);
    matrixRef.current = Array.from({ length: particleCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      speed: 1 + Math.random() * 3,
      char: chars[Math.floor(Math.random() * chars.length)],
    }));

    let animationFrame: number;
    const animate = () => {
      const bgColor = resolvedTheme === "dark" ? "rgba(0, 0, 0, 0.05)" : "rgba(255, 255, 255, 0.05)";
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const textColor = resolvedTheme === "dark" ? "#0f0" : "#006400";
      ctx.fillStyle = textColor;
      ctx.font = "14px monospace";

      matrixRef.current.forEach((particle) => {
        ctx.fillText(particle.char, particle.x, particle.y);
        particle.y += particle.speed;

        if (particle.y > canvas.height) {
          particle.y = 0;
          particle.x = Math.random() * canvas.width;
          particle.char = chars[Math.floor(Math.random() * chars.length)];
        }
      });

      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrame);
    };
  }, [resolvedTheme, mounted]);

  if (!mounted) {
    return null;
  }

  return (
    <>
      {/* Matrix animation - more prominent in header/footer areas */}
      <canvas
        ref={canvasRef}
        className={`fixed top-0 left-0 w-full h-full pointer-events-none z-0 ${
          resolvedTheme === "dark" ? "opacity-30" : "opacity-15"
        }`}
      />

      {/* Gradient overlays for header and footer areas */}
      <div className="fixed top-0 left-0 w-full h-32 bg-gradient-to-b from-black/20 to-transparent dark:from-black/40 pointer-events-none z-0" />
      <div className="fixed bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black/20 to-transparent dark:from-black/40 pointer-events-none z-0" />

      {/* Subtle radial gradient effects */}
      <motion.div
        className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
        animate={{
          background: [
            "radial-gradient(circle at 0% 0%, rgba(255,95,31,0.1) 0%, transparent 50%)",
            "radial-gradient(circle at 100% 100%, rgba(255,95,31,0.1) 0%, transparent 50%)",
            "radial-gradient(circle at 0% 100%, rgba(255,95,31,0.1) 0%, transparent 50%)",
            "radial-gradient(circle at 100% 0%, rgba(255,95,31,0.1) 0%, transparent 50%)",
          ],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />

      {/* Scanline effect */}
      <div
        className={`scanline fixed top-0 left-0 w-full h-full pointer-events-none z-0 ${
          resolvedTheme === "dark" ? "opacity-10" : "opacity-5"
        }`}
      />
    </>
  );
}
