const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] as const;

export function formatIsoMonth(isoMonth: string): string {
  const [year, month] = isoMonth.split("-");
  return `${MONTHS[Number(month) - 1]} ${year}`;
}

export function formatDuration(totalMonths: number): string {
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  const parts: string[] = [];
  if (years > 0) {
    parts.push(`${years} ${years === 1 ? "yr" : "yrs"}`);
  }
  if (months > 0) {
    parts.push(`${months} ${months === 1 ? "mo" : "mos"}`);
  }
  return parts.join(" ");
}
