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
      images.forEach((img) => {
        if (!img.loading) {
          img.loading = "lazy";
        }
      });
    }
  },
};

export const usePerformanceMonitoring = () => {
  if (typeof window !== "undefined") {
    performanceUtils.trackBundleSize();

    performanceUtils.preloadCriticalResources();

    performanceUtils.optimizeImages();
  }
};
