import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MainContent } from "@/components/layout/MainContent";

describe("MainContent", () => {
  it("renders skip link pointing at main id", () => {
    render(
      <MainContent>
        <p>Hello</p>
      </MainContent>
    );

    const skip = screen.getByRole("link", { name: "Skip to content" });
    expect(skip).toBeInTheDocument();
    const mainId = screen.getByRole("main").getAttribute("id");
    expect(mainId).toBeTruthy();
    expect(skip).toHaveAttribute("href", `#${mainId}`);
  });

  it("renders children inside main", () => {
    render(
      <MainContent>
        <p>Page body</p>
      </MainContent>
    );
    expect(screen.getByText("Page body")).toBeInTheDocument();
  });
});
