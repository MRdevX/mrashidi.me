import { describe, expect, it, vi } from "vitest";
import { ProjectFilters } from "@/features/projects/ProjectFilters";
import type { TechnologyCategory } from "@/lib/core";
import { fireEvent, render, screen } from "../../utils/test-utils";

vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...rest }: React.ComponentProps<"div">) => <div {...rest}>{children}</div>,
  },
}));

const emptyCategorized = {
  frameworks: [] as string[],
  languages: [] as string[],
  databases: [] as string[],
  clouds: [] as string[],
} satisfies Record<TechnologyCategory, string[]>;

describe("ProjectFilters", () => {
  it("stack toggle buttons expose aria-pressed state", () => {
    const onToggleStack = vi.fn();
    const categorized = {
      ...emptyCategorized,
      languages: ["TypeScript"],
    };

    const { rerender } = render(
      <ProjectFilters
        categorizedStacks={categorized}
        stackUsageCount={{ TypeScript: 3 }}
        selectedStacks={new Set()}
        showOpenSourceOnly={false}
        onToggleStack={onToggleStack}
        onToggleOpenSource={vi.fn()}
        onClearAll={vi.fn()}
      />
    );

    const btn = screen.getByRole("button", { name: /TypeScript/i });
    expect(btn).toHaveAttribute("aria-pressed", "false");

    fireEvent.click(btn);
    expect(onToggleStack).toHaveBeenCalledWith("TypeScript");

    rerender(
      <ProjectFilters
        categorizedStacks={categorized}
        stackUsageCount={{ TypeScript: 3 }}
        selectedStacks={new Set(["TypeScript"])}
        showOpenSourceOnly={false}
        onToggleStack={onToggleStack}
        onToggleOpenSource={vi.fn()}
        onClearAll={vi.fn()}
      />
    );

    expect(screen.getByRole("button", { name: /TypeScript/i })).toHaveAttribute("aria-pressed", "true");
  });
});
