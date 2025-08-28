"use client";

import { useCallback, useRef } from "react";

interface SwipeGestureOptions {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  threshold?: number;
  velocity?: number;
}

export function useSwipeGesture(options: SwipeGestureOptions = {}) {
  const { onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, threshold = 50, velocity = 0.3 } = options;

  const touchStart = useRef<{ x: number; y: number; time: number } | null>(null);
  const touchEnd = useRef<{ x: number; y: number; time: number } | null>(null);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    touchStart.current = {
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
      time: Date.now(),
    };
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    touchEnd.current = {
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
      time: Date.now(),
    };
  }, []);

  const onTouchEnd = useCallback(() => {
    if (!touchStart.current || !touchEnd.current) return;

    const distanceX = touchStart.current.x - touchEnd.current.x;
    const distanceY = touchStart.current.y - touchEnd.current.y;
    const timeDiff = touchEnd.current.time - touchStart.current.time;
    const velocityX = Math.abs(distanceX) / timeDiff;
    const velocityY = Math.abs(distanceY) / timeDiff;

    const isHorizontalSwipe = Math.abs(distanceX) > Math.abs(distanceY);
    const isFastEnough = velocityX > velocity || velocityY > velocity;
    const isLongEnough = Math.abs(distanceX) > threshold || Math.abs(distanceY) > threshold;

    if (isFastEnough && isLongEnough) {
      if (isHorizontalSwipe) {
        if (distanceX > 0 && onSwipeLeft) {
          onSwipeLeft();
        } else if (distanceX < 0 && onSwipeRight) {
          onSwipeRight();
        }
      } else {
        if (distanceY > 0 && onSwipeUp) {
          onSwipeUp();
        } else if (distanceY < 0 && onSwipeDown) {
          onSwipeDown();
        }
      }
    }

    // Reset
    touchStart.current = null;
    touchEnd.current = null;
  }, [onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, threshold, velocity]);

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
  };
}
