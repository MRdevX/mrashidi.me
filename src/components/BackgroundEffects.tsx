"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface Particle {
  x: number;
  y: number;
  speed: number;
  char: string;
}

export default function BackgroundEffects() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const matrixRef = useRef<Particle[]>([]);
  const chars = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";

  useEffect(() => {
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

    // Initialize matrix particles
    const particleCount = Math.floor(canvas.width / 20);
    matrixRef.current = Array.from({ length: particleCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      speed: 1 + Math.random() * 3,
      char: chars[Math.floor(Math.random() * chars.length)],
    }));

    // Animation loop
    let animationFrame: number;
    const animate = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#0f0";
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
  }, []);

  return (
    <>
      <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full pointer-events-none opacity-20 z-0" />
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
      <div className="scanline fixed top-0 left-0 w-full h-full pointer-events-none opacity-10 z-0" />
    </>
  );
}
