export type Render3DConditions = {
  supportsWebGL2: boolean;
  isLowEnd: boolean;
  finePointer: boolean;
  wideViewport: boolean;
  prefersReducedMotion: boolean;
};

export function shouldRender3D({
  supportsWebGL2,
  isLowEnd,
  finePointer,
  wideViewport,
  prefersReducedMotion,
}: Render3DConditions): boolean {
  return supportsWebGL2 && !isLowEnd && finePointer && wideViewport && !prefersReducedMotion;
}
