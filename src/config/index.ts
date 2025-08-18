export { APP_CONFIG } from "./app.config";
export { THEME_CONFIG } from "./theme.config";

export { API_CONSTANTS, UI_CONSTANTS, ANIMATION_CONSTANTS, TERMINAL_CONSTANTS, CACHE_CONSTANTS } from "./constants";

export { API_CONFIG } from "@/lib/config/api";

import { APP_CONFIG } from "./app.config";
import { THEME_CONFIG } from "./theme.config";
import { API_CONFIG } from "@/lib/config/api";
import { API_CONSTANTS, UI_CONSTANTS, ANIMATION_CONSTANTS, TERMINAL_CONSTANTS, CACHE_CONSTANTS } from "./constants";

export const CONFIG = {
  app: APP_CONFIG,
  theme: THEME_CONFIG,
  api: API_CONFIG,
  constants: {
    api: API_CONSTANTS,
    ui: UI_CONSTANTS,
    animation: ANIMATION_CONSTANTS,
    terminal: TERMINAL_CONSTANTS,
    cache: CACHE_CONSTANTS,
  },
} as const;
