import { cn } from "@/lib/utils";

const SIZE_CLASSES = {
  md: "size-11 rounded-[10px] text-sm",
  lg: "size-14 rounded-xl text-lg",
} as const;

const initials = (title: string) => {
  const [first = "?", second] = title
    .replace(/[^A-Za-z0-9 ]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
  return `${first.charAt(0)}${second?.charAt(0) ?? first.charAt(1)}`.toUpperCase();
};

export function ProjectMonogram({ title, size = "md" }: { title: string; size?: keyof typeof SIZE_CLASSES }) {
  return (
    <span
      aria-hidden
      className={cn(
        SIZE_CLASSES[size],
        "flex shrink-0 items-center justify-center border border-gray-200 bg-gray-50 font-terminal font-semibold text-orange-700 dark:border-white/10 dark:bg-white/[0.04] dark:text-orange-400"
      )}
    >
      {initials(title)}
    </span>
  );
}
