import { describe, expect, it } from "vitest";
import { type Render3DConditions, shouldRender3D } from "@/lib/three/shouldRender3D";

const capableDesktop: Render3DConditions = {
  supportsWebGL2: true,
  isLowEnd: false,
  finePointer: true,
  wideViewport: true,
  prefersReducedMotion: false,
};

describe("shouldRender3D", () => {
  it("renders 3D on a capable desktop", () => {
    expect(shouldRender3D(capableDesktop)).toBe(true);
  });

  it.each([
    ["without WebGL2", { supportsWebGL2: false }],
    ["on a low-end device", { isLowEnd: true }],
    ["with a coarse pointer", { finePointer: false }],
    ["below 1024px", { wideViewport: false }],
    ["when the visitor prefers reduced motion", { prefersReducedMotion: true }],
  ])("falls back to 2D %s", (_, override) => {
    expect(shouldRender3D({ ...capableDesktop, ...override })).toBe(false);
  });
});
