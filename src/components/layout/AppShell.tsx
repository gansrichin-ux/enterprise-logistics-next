import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, PackageSearch, Truck, Users, Bell, Building2,
  LayoutGrid, Search, Command, Plus, ChevronDown, Menu, X, Globe2,
} from "lucide-react";
import { useState } from "react";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/active-cargos", label: "Active cargos", icon: PackageSearch, badge: "24" },
  { to: "/find-transport", label: "Find transport", icon: Search },
  { to: "/carriers", label: "Carriers", icon: Truck },
  { to: "/notifications", label: "Notifications", icon: Bell, badge: "7" },
  { to: "/workspace", label: "Workspace", icon: LayoutGrid },
];

const secondary = [
  { to: "/profile", label: "Company cabinet", icon: Building2 },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);

  const isActive = (to: string) =>
    to === "/" ? path === "/" : path.startsWith(to);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-[260px] border-r border-sidebar-border bg-sidebar transition-transform lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-5">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M3 7l9-4 9 4M3 7v10l9 4 9-4V7M3 7l9 4m0 0l9-4m-9 4v10"/>
              </svg>
            </div>
            <div className="leading-tight">
              <div className="font-display text-[15px] font-semibold tracking-tight">Logist</div>
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Freight OS</div>
            </div>
          </Link>
          <button onClick={() => setOpen(false)} className="lg:hidden text-muted-foreground"><X className="h-5 w-5"/></button>
        </div>

        <div className="px-3 py-4">
          <button className="flex w-full items-center justify-between rounded-md border border-sidebar-border bg-sidebar-accent/60 px-3 py-2.5 text-left hover:bg-sidebar-accent">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="h-7 w-7 shrink-0 rounded bg-gradient-to-br from-primary/80 to-primary/30 flex items-center justify-center text-[11px] font-semibold text-primary-foreground">NF</div>
              <div className="min-w-0">
                <div className="truncate text-[13px] font-medium">Nordfracht GmbH</div>
                <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Forwarder · DE-2241</div>
              </div>
            </div>
            <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0"/>
          </button>
        </div>

        <nav className="px-3 space-y-0.5">
          <div className="px-2 pb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Operations</div>
          {nav.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`group flex items-center gap-3 rounded-md px-2.5 py-2 text-[13px] transition-colors ${
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                }`}
              >
                <Icon className={`h-4 w-4 ${active ? "text-primary" : "text-muted-foreground"}`} />
                <span className="flex-1 truncate">{item.label}</span>
                {item.badge && (
                  <span className={`font-mono text-[10px] rounded px-1.5 py-0.5 ${active ? "bg-primary/15 text-primary" : "bg-surface-3 text-muted-foreground"}`}>{item.badge}</span>
                )}
                {active && <span className="absolute left-0 h-5 w-[2px] -translate-x-3 rounded-r bg-primary"/>}
              </Link>
            );
          })}

          <div className="px-2 pb-2 pt-5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Account</div>
          {secondary.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.to);
            return (
              <Link key={item.to} to={item.to} className={`flex items-center gap-3 rounded-md px-2.5 py-2 text-[13px] ${
                active ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50"
              }`}>
                <Icon className={`h-4 w-4 ${active ? "text-primary" : "text-muted-foreground"}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute inset-x-3 bottom-3">
          <div className="rounded-lg border border-sidebar-border bg-sidebar-accent/40 p-3">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-success animate-pulse"/>
              <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Network status</div>
            </div>
            <div className="mt-1 text-[12px]">All systems operational</div>
            <div className="mt-1 font-mono text-[10px] text-muted-foreground">EU-WEST · 12ms · 99.99%</div>
          </div>
        </div>
      </aside>

      {open && <div onClick={() => setOpen(false)} className="fixed inset-0 z-30 bg-black/60 lg:hidden"/>}

      {/* Main */}
      <div className="lg:pl-[260px]">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border bg-background/85 px-4 backdrop-blur lg:px-8">
          <button onClick={() => setOpen(true)} className="lg:hidden text-muted-foreground"><Menu className="h-5 w-5"/></button>

          <div className="hidden md:flex items-center gap-2 text-[13px] text-muted-foreground">
            <Globe2 className="h-4 w-4"/>
            <span className="font-mono text-[11px] uppercase tracking-wider">EU / DE</span>
            <span className="text-border-strong">/</span>
            <span>Hamburg HQ</span>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2 rounded-md border border-border bg-surface/70 px-3 py-1.5 w-[320px]">
              <Search className="h-4 w-4 text-muted-foreground"/>
              <input className="flex-1 bg-transparent text-[13px] outline-none placeholder:text-muted-foreground" placeholder="Search lanes, cargos, carriers…"/>
              <kbd className="font-mono text-[10px] rounded border border-border bg-background px-1.5 py-0.5 text-muted-foreground flex items-center gap-0.5"><Command className="h-2.5 w-2.5"/>K</kbd>
            </div>
            <button className="relative rounded-md border border-border bg-surface/70 p-2 hover:bg-surface-2">
              <Bell className="h-4 w-4"/>
              <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-primary ring-2 ring-background"/>
            </button>
            <button className="hidden sm:inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-[13px] font-medium text-primary-foreground hover:bg-primary/90">
              <Plus className="h-4 w-4"/> New shipment
            </button>
            <div className="ml-1 flex items-center gap-2 rounded-md border border-border bg-surface/70 pl-1 pr-2 py-1">
              <div className="h-7 w-7 rounded bg-gradient-to-br from-info/80 to-primary/60 flex items-center justify-center text-[11px] font-semibold text-background">EV</div>
              <div className="hidden md:block leading-tight">
                <div className="text-[12px]">E. Vogel</div>
                <div className="font-mono text-[10px] text-muted-foreground">Carrier-Forwarder</div>
              </div>
            </div>
          </div>
        </header>

        <main className="px-4 py-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}
