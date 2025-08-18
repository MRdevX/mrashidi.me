import { logger } from "./logger";

interface CacheMetrics {
  hits: number;
  misses: number;
  hitRate: number;
  averageResponseTime: number;
}

class CachePerformanceMonitor {
  private metrics: CacheMetrics = {
    hits: 0,
    misses: 0,
    hitRate: 0,
    averageResponseTime: 0,
  };

  private responseTimes: number[] = [];

  recordHit(responseTime: number) {
    this.metrics.hits++;
    this.responseTimes.push(responseTime);
    this.updateMetrics();
  }

  recordMiss(responseTime: number) {
    this.metrics.misses++;
    this.responseTimes.push(responseTime);
    this.updateMetrics();
  }

  private updateMetrics() {
    const total = this.metrics.hits + this.metrics.misses;
    this.metrics.hitRate = total > 0 ? (this.metrics.hits / total) * 100 : 0;

    if (this.responseTimes.length > 0) {
      const sum = this.responseTimes.reduce((a, b) => a + b, 0);
      this.metrics.averageResponseTime = sum / this.responseTimes.length;
    }

    if (this.responseTimes.length > 100) {
      this.responseTimes = this.responseTimes.slice(-100);
    }
  }

  getMetrics(): CacheMetrics {
    return { ...this.metrics };
  }

  logMetrics() {
    logger.info(
      {
        hitRate: `${this.metrics.hitRate.toFixed(2)}%`,
        averageResponseTime: `${this.metrics.averageResponseTime.toFixed(2)}ms`,
        totalRequests: this.metrics.hits + this.metrics.misses,
      },
      "Cache Performance Metrics"
    );
  }
}

export const cachePerformanceMonitor = new CachePerformanceMonitor();
