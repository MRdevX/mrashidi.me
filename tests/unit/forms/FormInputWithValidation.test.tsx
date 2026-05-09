import { zodResolver } from "@hookform/resolvers/zod";
import userEvent from "@testing-library/user-event";
import { useForm } from "react-hook-form";
import { describe, expect, it } from "vitest";
import { z } from "zod";
import { FormInputWithValidation } from "@/components/forms/FormInputWithValidation";
import { render, screen } from "../../utils/test-utils";

const schema = z.object({
  email: z.string().email("Invalid email"),
});

type FormValues = z.infer<typeof schema>;

function EmailFieldHarness() {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: { email: "" },
  });
  return <FormInputWithValidation form={form} name="email" label="Email" type="email" />;
}

describe("FormInputWithValidation", () => {
  it("associates label with input id", () => {
    render(<EmailFieldHarness />);
    const input = screen.getByRole("textbox", { name: /email/i });
    expect(input).toHaveAttribute("id", "field-email");
    expect(input).toHaveAttribute("aria-required", "true");
  });

  it("sets aria-invalid and aria-describedby when validation fails on blur", async () => {
    const user = userEvent.setup();
    render(<EmailFieldHarness />);

    const input = screen.getByRole("textbox", { name: /email/i });
    await user.type(input, "not-an-email");
    await user.tab();

    expect(await screen.findByText("Invalid email")).toBeInTheDocument();
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAttribute("aria-describedby", "field-email-error");
  });
});
