import { type RenderOptions, render } from "@testing-library/react";
import type React from "react";
import type { ReactElement } from "react";
import { ThemeProvider } from "@/context/ThemeContext";
import { ContentProvider, type SiteContent } from "@/lib/content";
import { fixtureSiteContent } from "@/lib/content/fixtures";

export const testContent: SiteContent = fixtureSiteContent;

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider>
      <ContentProvider content={testContent}>{children}</ContentProvider>
    </ThemeProvider>
  );
};

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, "wrapper">) =>
  render(ui, { wrapper: AllTheProviders, ...options });

export * from "@testing-library/react";

export { customRender as render };
