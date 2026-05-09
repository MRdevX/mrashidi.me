"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface TypingAnimationProps {
  strings: string[];
  typeSpeed?: number;
  deleteSpeed?: number;
  pauseAtEnd?: number;
  className?: string;
  cursor?: boolean;
  cursorClassName?: string;
}

export function TypingAnimation({
  strings,
  typeSpeed = 100,
  deleteSpeed = 50,
  pauseAtEnd = 1000,
  className,
  cursor = true,
  cursorClassName,
}: TypingAnimationProps) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [currentStringIndex, setCurrentStringIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [liveMessage, setLiveMessage] = useState(() => strings[0] ?? "");

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);
    const onChange = () => setPrefersReducedMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion || strings.length === 0) {
      return;
    }

    const currentString = strings[currentStringIndex];

    if (isPaused) {
      const pauseTimer = setTimeout(() => {
        setIsPaused(false);
        setIsDeleting(true);
      }, pauseAtEnd);
      return () => clearTimeout(pauseTimer);
    }

    const timer = setTimeout(
      () => {
        if (!isDeleting) {
          if (currentText.length < currentString.length) {
            setCurrentText(currentString.slice(0, currentText.length + 1));
          } else {
            setIsPaused(true);
          }
        } else {
          if (currentText.length > 0) {
            setCurrentText(currentText.slice(0, -1));
          } else {
            setIsDeleting(false);
            setCurrentStringIndex((prev) => (prev + 1) % strings.length);
          }
        }
      },
      isDeleting ? deleteSpeed : typeSpeed
    );

    return () => clearTimeout(timer);
  }, [
    currentText,
    currentStringIndex,
    isDeleting,
    isPaused,
    strings,
    typeSpeed,
    deleteSpeed,
    pauseAtEnd,
    prefersReducedMotion,
  ]);

  useEffect(() => {
    if (prefersReducedMotion || strings.length === 0) {
      return;
    }
    const full = strings[currentStringIndex];
    if (isPaused && currentText === full && full.length > 0) {
      setLiveMessage(full);
    }
  }, [isPaused, currentText, currentStringIndex, strings, prefersReducedMotion]);

  if (strings.length === 0) {
    return null;
  }

  if (prefersReducedMotion) {
    return <span className={cn("inline-block", className)}>{strings[0]}</span>;
  }

  return (
    <>
      <span className={cn("inline-block", className)} aria-hidden="true">
        {currentText}
        {cursor && (
          <span className={cn("inline-block w-0.5 h-[1em] bg-current ml-0.5 animate-pulse", cursorClassName)} />
        )}
      </span>
      <span className="sr-only" aria-live="polite" aria-atomic="true">
        {liveMessage}
      </span>
    </>
  );
}
