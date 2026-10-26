import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MainContent } from "@/components/layout/MainContent";

describe("MainContent", () => {
  it("skip link targets main landmark and renders children", () => {
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
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });
});
