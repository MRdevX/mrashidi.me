import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { NewTabSrOnly } from "@/lib/a11y/new-tab-hint";

describe("NewTabSrOnly", () => {
  it("renders visually hidden text for screen readers", () => {
    const { container } = render(<NewTabSrOnly />);
    const span = container.querySelector(".sr-only");
    expect(span).toBeInTheDocument();
    expect(screen.getByText("(opens in new tab)", { exact: false })).toBeInTheDocument();
  });
});
