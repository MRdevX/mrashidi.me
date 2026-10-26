import type { TestingLibraryMatchers } from "@testing-library/jest-dom/matchers";

// jest-dom's bundled "vitest" augmentation targets the vitest 4 `Assertion<T>` signature;
// vitest 5 exposes custom matchers through `Matchers<R, T>` instead.
declare module "vitest" {
  interface Matchers<R extends void | Promise<void> = void | Promise<void>, T = unknown>
    extends TestingLibraryMatchers<unknown, R> {}
}
