export const performanceUtils = {
  trackBundleSize: () => {
    if (typeof window !== "undefined" && "performance" in window) {
      const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming;
      if (navigation) {
        console.log("Bundle size metrics:", {
          transferSize: navigation.transferSize,
          encodedBodySize: navigation.encodedBodySize,
          decodedBodySize: navigation.decodedBodySize,
        });
      }
    }
  },

  trackRenderTime: (componentName: string) => {
    const start = performance.now();
    return () => {
      const end = performance.now();
      console.log(`${componentName} render time:`, end - start, "ms");
    };
  },

  preloadCriticalResources: () => {
    if (typeof window !== "undefined") {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "font";
      link.crossOrigin = "anonymous";
      link.href = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap";
      document.head.appendChild(link);
    }
  },

  optimizeImages: () => {
    if (typeof window !== "undefined") {
      const images = document.querySelectorAll("img");
      for (const img of images) {
        if (!img.loading) {
          img.loading = "lazy";
        }
      }
    }
  },

  detectDeviceCapabilities: () => {
    if (typeof window === "undefined") {
      return { isLowEnd: false, shouldDisableEffects: false };
    }

    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

    const isLowEnd =
      !gl ||
      navigator.hardwareConcurrency <= 2 ||
      /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    const shouldDisableEffects =
      isLowEnd &&
      (navigator.hardwareConcurrency <= 1 || /Android 4|iPhone OS [1-6]|iPad.*OS [1-6]/i.test(navigator.userAgent));

    return { isLowEnd, shouldDisableEffects };
  },

  monitorFrameRate: (callback: (fps: number) => void) => {
    if (typeof window === "undefined") {
      return;
    }

    let lastTime = performance.now();
    let frameCount = 0;

    const measureFPS = () => {
      frameCount++;
      const currentTime = performance.now();

      if (currentTime - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        callback(fps);
        frameCount = 0;
        lastTime = currentTime;
      }

      requestAnimationFrame(measureFPS);
    };

    requestAnimationFrame(measureFPS);
  },
};

export const usePerformanceMonitoring = () => {
  if (typeof window !== "undefined") {
    performanceUtils.trackBundleSize();
    performanceUtils.preloadCriticalResources();
    performanceUtils.optimizeImages();
  }
};
