export function detectDeviceCapabilities() {
  if (typeof window === "undefined") {
    return { isLowEnd: false, shouldDisableEffects: false, supportsWebGL2: false };
  }

  const canvas = document.createElement("canvas");
  const gl2 = canvas.getContext("webgl2");
  const gl = gl2 ?? canvas.getContext("webgl");

  const isLowEnd =
    !gl ||
    navigator.hardwareConcurrency <= 2 ||
    /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  const shouldDisableEffects =
    isLowEnd &&
    (navigator.hardwareConcurrency <= 1 || /Android 4|iPhone OS [1-6]|iPad.*OS [1-6]/i.test(navigator.userAgent));

  gl?.getExtension("WEBGL_lose_context")?.loseContext();

  return { isLowEnd, shouldDisableEffects, supportsWebGL2: gl2 !== null };
}
