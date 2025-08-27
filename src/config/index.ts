export { API_CONFIG } from "@/lib/config/api";
export { APP_CONFIG } from "./app.config";

export {
  ANIMATION_CONSTANTS,
  API_CONSTANTS,
  CACHE_CONSTANTS,
  TERMINAL_CONSTANTS,
  UI_CONSTANTS,
} from "./constants";
export { THEME_CONFIG } from "./theme.config";

import { API_CONFIG } from "@/lib/config/api";
import { APP_CONFIG } from "./app.config";
import { ANIMATION_CONSTANTS, API_CONSTANTS, CACHE_CONSTANTS, TERMINAL_CONSTANTS, UI_CONSTANTS } from "./constants";
import { THEME_CONFIG } from "./theme.config";

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
