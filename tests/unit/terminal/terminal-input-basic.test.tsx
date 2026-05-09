import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { TerminalInput } from "@/components/terminal/TerminalInput";

vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, className, ...rest }: React.HTMLAttributes<HTMLDivElement>) => (
      <div
        className={className}
        {...Object.fromEntries(Object.entries(rest).filter(([k]) => k.startsWith("data-") || k.startsWith("aria-")))}
      >
        {children}
      </div>
    ),
    span: ({ children, className, ...rest }: React.HTMLAttributes<HTMLSpanElement>) => (
      <span
        className={className}
        {...Object.fromEntries(Object.entries(rest).filter(([k]) => k.startsWith("data-") || k.startsWith("aria-")))}
      >
        {children}
      </span>
    ),
  },
}));

vi.mock("lucide-react", () => ({
  Terminal: () => <div data-testid="terminal-icon">Terminal</div>,
}));

describe("TerminalInput - Basic Functionality", () => {
  const defaultProps = {
    inputRef: { current: null },
    value: "",
    onChange: vi.fn(),
    onKeyDown: vi.fn(),
    isExecuting: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render terminal input with prompt", () => {
    render(<TerminalInput {...defaultProps} />);

    expect(screen.getByTestId("terminal-icon")).toBeInTheDocument();
    expect(screen.getByText("$")).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it.each([
    {
      isExecuting: false,
      placeholder: "Type 'help' for available commands...",
      disabled: false,
    },
    {
      isExecuting: true,
      placeholder: "Executing command...",
      disabled: true,
    },
  ])("placeholder and disabled when isExecuting=$isExecuting", ({ isExecuting, placeholder, disabled }) => {
    render(<TerminalInput {...defaultProps} isExecuting={isExecuting} />);
    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("placeholder", placeholder);
    if (disabled) {
      expect(input).toBeDisabled();
    } else {
      expect(input).not.toBeDisabled();
    }
  });

  it("should call onChange when input value changes", () => {
    const onChange = vi.fn();
    render(<TerminalInput {...defaultProps} onChange={onChange} />);

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "help" } });

    expect(onChange).toHaveBeenCalledWith("help");
  });

  it("should call onKeyDown when key is pressed", () => {
    const onKeyDown = vi.fn();
    render(<TerminalInput {...defaultProps} onKeyDown={onKeyDown} />);

    const input = screen.getByRole("textbox");
    fireEvent.keyDown(input, { key: "Enter" });

    expect(onKeyDown).toHaveBeenCalled();
  });

  it("should display input value", () => {
    render(<TerminalInput {...defaultProps} value="help" />);

    const input = screen.getByRole("textbox");
    expect(input).toHaveValue("help");
  });

  it("should have correct accessibility attributes", () => {
    render(<TerminalInput {...defaultProps} />);

    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("aria-label", "Terminal input");
    expect(input).toHaveAttribute("autocomplete", "off");
    expect(input).toHaveAttribute("autocorrect", "off");
    expect(input).toHaveAttribute("autocapitalize", "off");
    expect(input).toHaveAttribute("spellcheck", "false");
  });
});
