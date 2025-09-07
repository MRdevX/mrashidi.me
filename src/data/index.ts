// Core configuration
export type { SiteConfig } from "./config";
export { config, coreConfig, siteConfig, siteMetadata } from "./config";

// Navigation
export type { NavigationItem } from "./navigation";
export {
  navigationItems,
  mobileNavigationItems,
  desktopNavigationItems,
  getNavigationItems,
  githubLink,
} from "./navigation";

// Profile data
export * from "./profile";

// Site data
export * from "./site";
