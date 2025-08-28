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

import coreConfig from "../core";

const siteConfig: SiteConfig = {
  themeColor: "#f97316",
  msTileColor: "#f97316",
  appName: coreConfig.site.name,
  appTitle: coreConfig.site.name,
  appleMobileWebAppTitle: coreConfig.site.name,
  mobileWebAppCapable: true,
  appleMobileWebAppCapable: true,
  appleMobileWebAppStatusBarStyle: "black-translucent",
};

export default siteConfig;
