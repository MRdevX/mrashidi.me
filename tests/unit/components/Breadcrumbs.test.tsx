import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Breadcrumbs from "@/components/SEO/Breadcrumbs";

describe("Breadcrumbs", () => {
  it("exposes navigation landmark and current page", () => {
    render(
      <Breadcrumbs
        items={[
          { label: "Projects", href: "/projects" },
          { label: "Detail", href: "/projects/x", current: true },
        ]}
      />
    );

    expect(screen.getByRole("navigation", { name: "Breadcrumb" })).toBeInTheDocument();
    const current = screen.getByText("Detail");
    expect(current).toHaveAttribute("aria-current", "page");
  });

  it("links to homepage with accessible name", () => {
    render(<Breadcrumbs items={[{ label: "Blog", href: "/blog", current: true }]} />);
    expect(screen.getByRole("link", { name: "Go to homepage" })).toHaveAttribute("href", "/");
  });
});
