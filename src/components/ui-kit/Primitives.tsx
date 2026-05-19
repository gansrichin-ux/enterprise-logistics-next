import { cn } from "@/lib/utils";
import type { ReactNode, HTMLAttributes } from "react";

export function PageHeader({
  eyebrow, title, description, actions,
}: { eyebrow?: string; title: string; description?: string; actions?: ReactNode }) {
  return (
    <div className="mb-7 flex flex-col gap-4 border-b border-border pb-6 md:flex-row md:items-end md:justify-between">
      <div>
        {eyebrow && <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-primary">{eyebrow}</div>}
        <h1 className="mt-1 text-2xl font-semibold tracking-tight md:text-[28px]">{title}</h1>
        {description && <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Card({ className, children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card hairline",
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

export function StatusBadge({ status }: { status: "in_transit" | "loading" | "delivered" | "pending" | "delayed" | "verified" | "draft" }) {
  const map = {
    in_transit: { label: "In transit", c: "bg-info/15 text-info border-info/30" },
    loading:    { label: "Loading",    c: "bg-warning/15 text-warning border-warning/30" },
    delivered:  { label: "Delivered",  c: "bg-success/15 text-success border-success/30" },
    pending:    { label: "Pending",    c: "bg-surface-3 text-muted-foreground border-border-strong" },
    delayed:    { label: "Delayed",    c: "bg-destructive/15 text-destructive border-destructive/30" },
    verified:   { label: "Verified",   c: "bg-success/15 text-success border-success/30" },
    draft:      { label: "Draft",      c: "bg-surface-3 text-muted-foreground border-border-strong" },
  } as const;
  const s = map[status];
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider", s.c)}>
      <span className="h-1.5 w-1.5 rounded-full bg-current"/>{s.label}
    </span>
  );
}

export function Btn({
  variant = "default", size = "md", className, children, ...rest
}: { variant?: "default" | "outline" | "ghost" | "primary"; size?: "sm" | "md" } & HTMLAttributes<HTMLButtonElement>) {
  const variants = {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90",
    default: "bg-surface-2 text-foreground hover:bg-surface-3 border border-border",
    outline: "border border-border bg-transparent hover:bg-surface-2",
    ghost: "hover:bg-surface-2 text-muted-foreground hover:text-foreground",
  };
  const sizes = { sm: "h-8 px-2.5 text-[12px]", md: "h-9 px-3.5 text-[13px]" };
  return (
    <button className={cn("inline-flex items-center gap-1.5 rounded-md font-medium transition-colors", variants[variant], sizes[size], className)} {...rest}>{children}</button>
  );
}

export function MapPreview({ className, label }: { className?: string; label?: string }) {
  return (
    <div className={cn("relative overflow-hidden rounded-xl border border-border map-bg", className)}>
      {/* Route line */}
      <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 400 200">
        <defs>
          <linearGradient id="route" x1="0" x2="1">
            <stop offset="0" stopColor="oklch(0.76 0.14 60)" stopOpacity="0.9"/>
            <stop offset="1" stopColor="oklch(0.70 0.12 230)" stopOpacity="0.9"/>
          </linearGradient>
        </defs>
        <path d="M30,150 C 110,30 220,180 370,50" stroke="url(#route)" strokeWidth="1.5" strokeDasharray="3 3" fill="none"/>
        <circle cx="30" cy="150" r="4" fill="oklch(0.76 0.14 60)"/>
        <circle cx="30" cy="150" r="9" fill="oklch(0.76 0.14 60)" opacity="0.2"/>
        <circle cx="370" cy="50" r="4" fill="oklch(0.70 0.12 230)"/>
        <circle cx="200" cy="100" r="3" fill="oklch(0.96 0.005 80)"/>
      </svg>
      <div className="absolute left-3 top-3 rounded-md border border-border bg-background/70 px-2 py-1 backdrop-blur">
        <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Live route</div>
        <div className="text-[12px]">{label ?? "Hamburg → Rotterdam → Madrid"}</div>
      </div>
      <div className="absolute right-3 bottom-3 flex gap-1">
        {["1×","2×","SAT"].map(x => <button key={x} className="rounded border border-border bg-background/70 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground backdrop-blur">{x}</button>)}
      </div>
    </div>
  );
}
