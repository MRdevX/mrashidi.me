import { Heart } from "lucide-react";
import { describe, expect, it, vi } from "vitest";
import { SocialButton } from "@/components/ui/SocialButton";
import { render, screen } from "../../utils/test-utils";

vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...rest }: React.ComponentProps<"div">) => <div {...rest}>{children}</div>,
  },
  useReducedMotion: () => false,
}));

describe("SocialButton", () => {
  it("adds target _blank and new-tab hint for external links", () => {
    render(
      <SocialButton href="https://example.com" icon={Heart}>
        Example
      </SocialButton>
    );

    const link = screen.getByRole("link", { name: /example/i });
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
    expect(link.textContent).toContain("opens in new tab");
  });

  it("does not open new tab for mailto when isExternal is false", () => {
    render(
      <SocialButton href="mailto:a@b.com" icon={Heart} isExternal={false}>
        Email
      </SocialButton>
    );
    const link = screen.getByRole("link", { name: /email/i });
    expect(link).not.toHaveAttribute("target");
    expect(link.textContent).not.toContain("opens in new tab");
  });
});
