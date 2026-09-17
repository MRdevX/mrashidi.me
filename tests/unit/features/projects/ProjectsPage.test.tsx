import { beforeEach, describe, expect, it, vi } from "vitest";
import { ProjectsPage } from "@/features/projects";
import { projects } from "@/features/projects/infrastructure/projectData";
import { fireEvent, render, screen, within } from "../../../utils/test-utils";

vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, className }: React.ComponentProps<"div">) => <div className={className}>{children}</div>,
  },
  useReducedMotion: () => false,
}));

vi.mock("@/lib/services/github", () => ({
  githubService: { getLatestCommitInfo: vi.fn().mockResolvedValue(null) },
}));

const status = () => screen.getByRole("status");
const filterBar = () => screen.getByRole("region", { name: "Filter projects" });

describe("ProjectsPage", () => {
  beforeEach(() => {
    window.history.replaceState(null, "", "/projects");
    window.localStorage.clear();
  });

  it("shows the first page of projects and loads more on demand", () => {
    render(<ProjectsPage />);

    expect(status()).toHaveTextContent(`${projects.length} projects`);
    expect(screen.getAllByRole("article")).toHaveLength(Math.min(9, projects.length));

    fireEvent.click(screen.getByRole("button", { name: /Show \d+ more/ }));
    expect(screen.getAllByRole("article")).toHaveLength(Math.min(18, projects.length));
  });

  it("filters by stack, disables dead-end technologies and syncs the URL", () => {
    render(<ProjectsPage />);

    fireEvent.click(within(filterBar()).getByRole("button", { name: /^NestJS/ }));

    const nestCount = projects.filter((p) => p.stack.includes("NestJS")).length;
    expect(status()).toHaveTextContent(`${nestCount} of ${projects.length} projects`);
    expect(within(filterBar()).getByRole("button", { name: /^NestJS/ })).toHaveAttribute("aria-pressed", "true");
    expect(window.location.search).toBe("?stack=NestJS");

    fireEvent.click(within(filterBar()).getByRole("button", { name: /All \d+ technologies/ }));
    expect(within(filterBar()).getByRole("button", { name: /^Rust/ })).toBeDisabled();

    fireEvent.click(screen.getByRole("button", { name: "Remove NestJS filter" }));
    expect(status()).toHaveTextContent(`${projects.length} projects`);
  });

  it("restores filters from the URL and offers a way out of empty results", () => {
    window.history.replaceState(null, "", "/projects?q=zzz-no-match");
    render(<ProjectsPage />);

    expect(screen.getByText("No project matches all of these filters")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Clear all filters" }));
    expect(status()).toHaveTextContent(`${projects.length} projects`);
  });

  it("opens project details and steps to the next project", () => {
    render(<ProjectsPage />);

    const [first, second] = screen
      .getAllByRole("article")
      .map((card) => within(card).getByRole("heading", { level: 3 }).textContent ?? "");
    fireEvent.click(screen.getByRole("button", { name: `Details for ${first}` }));

    const dialog = screen.getByRole("dialog");
    expect(within(dialog).getByRole("heading", { name: first })).toBeInTheDocument();
    expect(within(dialog).getByText("Highlights")).toBeInTheDocument();

    fireEvent.click(within(dialog).getByRole("button", { name: `Next project: ${second}` }));
    expect(within(screen.getByRole("dialog")).getByRole("heading", { name: second })).toBeInTheDocument();
  });
});
