import { render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { TypingAnimation } from "@/components/ui/TypingAnimation";

function mockMatchMedia(matchesReducedMotion: boolean) {
  return vi.spyOn(window, "matchMedia").mockImplementation((query: string) => ({
    matches: matchesReducedMotion && query === "(prefers-reduced-motion: reduce)",
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}

describe("TypingAnimation", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns null when strings is empty", () => {
    const { container } = render(<TypingAnimation strings={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it("shows only the first string when prefers-reduced-motion is reduce", async () => {
    mockMatchMedia(true);
    render(<TypingAnimation strings={["Static role", "Other"]} />);

    await waitFor(() => {
      expect(document.querySelector('[aria-live="polite"]')).not.toBeInTheDocument();
    });

    expect(screen.getByText("Static role")).toBeInTheDocument();
    expect(screen.queryByText("Other")).not.toBeInTheDocument();
  });

  it("exposes aria-live region and hides animated text from the accessibility tree by default", () => {
    mockMatchMedia(false);
    render(<TypingAnimation strings={["First", "Second"]} />);

    const live = document.querySelector('[aria-live="polite"]');
    expect(live).toHaveAttribute("aria-atomic", "true");
    expect(live).toHaveTextContent("First");

    const hidden = document.querySelector('[aria-hidden="true"]');
    expect(hidden).toBeInTheDocument();
  });
});
