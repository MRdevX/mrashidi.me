export function detectDeviceCapabilities() {
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
}
