import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StatusMessage } from "@/components/forms/StatusMessage";

describe("StatusMessage", () => {
  it("renders nothing when type is null", () => {
    const { container } = render(<StatusMessage status={{ type: null, message: "" }} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders success alert with message", () => {
    render(<StatusMessage status={{ type: "success", message: "Done" }} />);
    const alert = screen.getByRole("alert");
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveTextContent("Success!");
    expect(alert).toHaveTextContent("Done");
  });

  it("renders error alert with message", () => {
    render(<StatusMessage status={{ type: "error", message: "Failed" }} />);
    const alert = screen.getByRole("alert");
    expect(alert).toHaveTextContent("Error");
    expect(alert).toHaveTextContent("Failed");
  });
});
