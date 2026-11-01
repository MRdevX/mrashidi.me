/// <reference lib="webworker" />
import { defaultCache } from "@serwist/turbopack/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { CacheFirst, ExpirationPlugin, Serwist } from "serwist";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

const googleFonts = {
  matcher: /^https:\/\/(fonts\.googleapis\.com|fonts\.gstatic\.com)\/.*/i,
  handler: new CacheFirst({
    cacheName: "google-fonts",
    plugins: [new ExpirationPlugin({ maxEntries: 5, maxAgeSeconds: 60 * 60 * 24 * 30 })],
  }),
};

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: [googleFonts, ...defaultCache],
});

serwist.addEventListeners();
