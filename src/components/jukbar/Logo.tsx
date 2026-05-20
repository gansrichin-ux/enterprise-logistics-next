export function JukBarLogo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sz = size === "lg" ? "h-10 w-10" : size === "sm" ? "h-7 w-7" : "h-9 w-9";
  const ts = size === "lg" ? "text-[18px]" : size === "sm" ? "text-[13px]" : "text-[15px]";
  return (
    <div className="flex items-center gap-2.5">
      <div className={`relative ${sz} grid place-items-center rounded-lg bg-gradient-to-br from-primary to-primary-glow text-primary-foreground`}>
        <svg viewBox="0 0 24 24" className="h-1/2 w-1/2" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 7l9-4 9 4M3 7v10l9 4 9-4V7M3 7l9 4m0 0l9-4m-9 4v10"/>
        </svg>
        <span className="absolute -inset-1 -z-10 rounded-xl bg-primary/30 blur-md" />
      </div>
      <div className="leading-tight">
        <div className={`font-display ${ts} font-semibold tracking-tight`}>Jük Bar</div>
        <div className="font-mono text-[9px] uppercase tracking-[0.22em] text-muted-foreground">Freight OS</div>
      </div>
    </div>
  );
}
