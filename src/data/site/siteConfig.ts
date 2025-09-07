export interface SiteConfig {
  themeColor: string;
  msTileColor: string;
  appName: string;
  appTitle: string;
  appleMobileWebAppTitle: string;
  mobileWebAppCapable: boolean;
  appleMobileWebAppCapable: boolean;
  appleMobileWebAppStatusBarStyle: string;
}

import { config } from "../config";

const siteConfig: SiteConfig = {
  themeColor: config.ui.themeColor,
  msTileColor: config.ui.msTileColor,
  appName: config.ui.appName,
  appTitle: config.ui.appTitle,
  appleMobileWebAppTitle: config.ui.appleMobileWebAppTitle,
  mobileWebAppCapable: config.ui.mobileWebAppCapable,
  appleMobileWebAppCapable: config.ui.appleMobileWebAppCapable,
  appleMobileWebAppStatusBarStyle: config.ui.appleMobileWebAppStatusBarStyle,
};

export default siteConfig;
