import { describe, expect, it } from "vitest";
import { formatDuration, formatIsoMonth } from "@/features/resume/period";

describe("period formatting", () => {
  it("formats an ISO month as a label", () => {
    expect(formatIsoMonth("2020-01")).toBe("Jan 2020");
    expect(formatIsoMonth("2025-12")).toBe("Dec 2025");
  });

  it("formats a month count in years and months", () => {
    expect(formatDuration(35)).toBe("2 yrs 11 mos");
    expect(formatDuration(12)).toBe("1 yr");
    expect(formatDuration(1)).toBe("1 mo");
  });
});
