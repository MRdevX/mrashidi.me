export {};

declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => Promise<void>;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}
