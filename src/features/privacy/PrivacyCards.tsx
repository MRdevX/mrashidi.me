import { ExternalLink } from "lucide-react";

export function DateBadge({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/40 px-3 py-1 text-xs text-muted-foreground">
      {icon}
      <span className="font-medium text-foreground">{label}:</span> {value}
    </span>
  );
}

export function SummaryCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="glass-card flex flex-col gap-2 p-4">
      <div className="flex items-center gap-2 text-orange-500">{icon}</div>
      <p className="text-sm font-semibold text-foreground">{title}</p>
      <p className="text-xs leading-relaxed text-muted-foreground">{desc}</p>
    </div>
  );
}

export function PolicyCard({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="glass-card p-6">
      <div className="mb-4 flex items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-orange-500/10 text-orange-500">
          {icon}
        </span>
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      </div>
      <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">{children}</div>
    </div>
  );
}

export function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-2">
      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-500" aria-hidden />
      <span>{children}</span>
    </li>
  );
}

export function ProviderCard({ name: providerName, desc, href }: { name: string; desc: string; href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col gap-1 rounded-lg border border-border bg-muted/30 p-3 transition-colors hover:border-orange-500/40 hover:bg-orange-500/5"
    >
      <span className="flex items-center gap-1.5 text-sm font-medium text-foreground group-hover:text-orange-500">
        {providerName}
        <ExternalLink className="h-3 w-3 opacity-50" aria-hidden />
      </span>
      <span className="text-xs text-muted-foreground">{desc}</span>
    </a>
  );
}

export function RightCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="flex gap-3 rounded-lg border border-border bg-muted/20 p-3">
      <span className="mt-0.5 shrink-0 text-orange-500">{icon}</span>
      <div>
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{desc}</p>
      </div>
    </div>
  );
}
