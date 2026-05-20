import { createFileRoute, Link } from "@tanstack/react-router";
import { PublicNav, PublicFooter } from "@/components/jukbar/PublicNav";
import { RouteMap } from "@/components/jukbar/RouteMap";
import {
  ArrowRight, ShieldCheck, MapPin, Bell, Building2, Search,
  Truck, Package, Route as RouteIcon, Activity, CheckCircle2, Zap,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Jük Bar — The operating system for modern freight" },
      { name: "description", content: "Smart logistics platform connecting cargo owners, carriers, logisticians and forwarders. Find transport, manage cargo, track routes, verify partners." },
      { property: "og:title", content: "Jük Bar — Freight OS" },
      { property: "og:description", content: "Smart logistics platform for cargo movement across Europe and beyond." },
    ],
  }),
  component: LandingPage,
});

const features = [
  { icon: Package, h: "Cargo management", p: "Create, dispatch and track every shipment from a single console with full document trail." },
  { icon: Search, h: "Transport search", p: "Match cargo to verified carriers in seconds across 14 corridors and rising." },
  { icon: ShieldCheck, h: "Verified carriers", p: "Every partner is KYC-verified with SLA history, insurance and compliance documents." },
  { icon: RouteIcon, h: "Route tracking", p: "Live GPS, ETAs, border events and proof-of-delivery in real time." },
  { icon: Bell, h: "Smart notifications", p: "Operational, financial and compliance alerts routed to the right teammate." },
  { icon: Building2, h: "Company cabinet", p: "A polished digital cabinet for your team, documents, billing and permissions." },
  { icon: MapPin, h: "Interactive maps", p: "Real maps, real lanes — not screenshots. Plan, dispatch and trace at a glance." },
  { icon: Activity, h: "Operations console", p: "Throughput, on-time rates and fleet utilisation surfaced where decisions are made." },
];

const roles = [
  { h: "Cargo owners", p: "List freight, compare quotes, lock in verified carriers and watch it move.", t: "Post cargo · Receive bids · Track delivery" },
  { h: "Carriers", p: "Find loads that match your fleet, lanes and equipment. Get paid faster.", t: "Discover loads · Bid · Get dispatched" },
  { h: "Logisticians", p: "Coordinate complex multi-leg shipments across modes and borders.", t: "Plan · Allocate · Reconcile" },
  { h: "Forwarders", p: "Quote, book and operate as a single source of truth for your clients.", t: "Quote · Book · Operate · Invoice" },
];

function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <PublicNav />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="radial-emerald absolute inset-0" />
        <div className="grid-bg absolute inset-0 opacity-50" />
        <div className="relative mx-auto max-w-7xl px-5 pt-20 pb-24 lg:px-10 lg:pt-28 lg:pb-32">
          <div className="grid items-center gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1">
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-primary">Now onboarding partners · EU</span>
              </div>
              <h1 className="mt-6 text-[44px] font-semibold leading-[1.02] tracking-tight md:text-[64px]">
                The operating system for <span className="text-gradient-emerald">smart freight</span> movement.
              </h1>
              <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-muted-foreground md:text-base">
                Jük Bar connects cargo owners, carriers, logisticians and forwarders inside one
                premium workspace. Find transport, manage cargo, track routes and verify
                companies — without the spreadsheets.
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <Link
                  to="/register"
                  className="group inline-flex h-12 items-center gap-2 rounded-md bg-primary px-5 text-[14px] font-medium text-primary-foreground hover:bg-primary/90"
                >
                  Get started
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
                <Link
                  to="/login"
                  className="inline-flex h-12 items-center gap-2 rounded-md border border-border bg-surface/60 px-5 text-[14px] font-medium hover:bg-surface-2"
                >
                  Login
                </Link>
              </div>
              <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3">
                {["KYC verified network", "SLA tracking", "Multi-modal lanes"].map((x) => (
                  <div key={x} className="flex items-center gap-2 text-[12px] text-muted-foreground">
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary" /> {x}
                  </div>
                ))}
              </div>
            </div>

            {/* Hero card with live map */}
            <div className="lg:col-span-5">
              <div className="emerald-glow rounded-2xl border border-border bg-card p-2">
                <div className="rounded-xl border border-border bg-background/60 p-3">
                  <div className="flex items-center justify-between px-1.5 pb-2">
                    <div>
                      <div className="font-mono text-[10px] uppercase tracking-wider text-primary">Live lane · DE → ES</div>
                      <div className="text-[13px] font-medium">SHP-2841 · Hamburg → Madrid</div>
                    </div>
                    <span className="inline-flex items-center gap-1.5 rounded-md border border-primary/30 bg-primary/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-primary">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" /> In transit
                    </span>
                  </div>
                  <RouteMap height={300} />
                  <div className="mt-3 grid grid-cols-3 divide-x divide-border rounded-md border border-border bg-surface/50">
                    {[
                      { l: "Distance", v: "2,481", s: "km" },
                      { l: "ETA", v: "Apr 12", s: "14:20" },
                      { l: "Carrier", v: "TransEuro", s: "★ 4.92" },
                    ].map((s) => (
                      <div key={s.l} className="p-3">
                        <div className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">{s.l}</div>
                        <div className="mt-0.5 flex items-baseline gap-1">
                          <span className="num text-sm font-semibold">{s.v}</span>
                          <span className="text-[11px] text-muted-foreground">{s.s}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Logos / stats strip */}
      <section className="border-y border-border/60 bg-surface/40">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px bg-border md:grid-cols-4 lg:px-0">
          {[
            { v: "14,820 t", l: "Cargo moved this quarter" },
            { v: "248", l: "Active shipments" },
            { v: "96.2%", l: "On-time delivery" },
            { v: "1,400+", l: "Verified carriers" },
          ].map((s) => (
            <div key={s.l} className="bg-background px-6 py-7">
              <div className="num text-2xl font-semibold tracking-tight">{s.v}</div>
              <div className="mt-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="platform" className="mx-auto max-w-7xl px-5 py-24 lg:px-10">
        <div className="max-w-2xl">
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-primary">Platform · Freight OS</div>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
            Everything freight teams run on, in one console.
          </h2>
          <p className="mt-3 text-[15px] text-muted-foreground">
            Replace the patchwork of spreadsheets, email threads and trackers with a single,
            operationally serious platform.
          </p>
        </div>
        <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.h} className="group bg-card p-6 transition-colors hover:bg-surface-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-md border border-primary/20 bg-primary/10">
                  <Icon className="h-4.5 w-4.5 text-primary" />
                </div>
                <h3 className="mt-5 text-[15px] font-semibold">{f.h}</h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">{f.p}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ROLES */}
      <section id="roles" className="border-t border-border/60 bg-surface/30">
        <div className="mx-auto max-w-7xl px-5 py-24 lg:px-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-primary">Roles</div>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
                Built for every side of the lane.
              </h2>
            </div>
            <p className="max-w-md text-[14px] text-muted-foreground">
              Hybrid roles supported — Carrier-Forwarder, Cargo owner-Carrier, Logistician-Carrier.
              One identity, one cabinet.
            </p>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {roles.map((r, i) => (
              <div key={r.h} className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/40">
                <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">0{i + 1}</div>
                <h3 className="mt-3 text-lg font-semibold">{r.h}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">{r.p}</p>
                <div className="mt-6 border-t border-border pt-4 font-mono text-[10px] uppercase tracking-wider text-primary">
                  {r.t}
                </div>
                <div className="pointer-events-none absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OPERATIONS SHOWCASE */}
      <section id="operations" className="mx-auto max-w-7xl px-5 py-24 lg:px-10">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-primary">Operations</div>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
              Move cargo with the rigour of a Tier-1 forwarder.
            </h2>
            <p className="mt-4 text-[15px] text-muted-foreground">
              Jük Bar is engineered for operations teams running real lanes. Every shipment has a
              live state machine, every carrier has a verified record, every event has a timestamp.
            </p>
            <ul className="mt-6 space-y-3.5">
              {[
                { h: "Multi-leg routing", p: "Stitch road, rail and short-sea into one trackable shipment." },
                { h: "Document vault", p: "CMR, e-CMR, customs and proof-of-delivery stored against each load." },
                { h: "Compliance & KYC", p: "Insurance, VAT, ADR and W&I status surfaced before you book." },
                { h: "Settlement", p: "Quote → confirm → invoice — without leaving the cabinet." },
              ].map((x) => (
                <li key={x.h} className="flex gap-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <div>
                    <div className="text-[14px] font-medium">{x.h}</div>
                    <div className="text-[13px] text-muted-foreground">{x.p}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="emerald-glow rounded-2xl border border-border bg-card p-2">
            <RouteMap
              height={420}
              pickup={{ lat: 52.3676, lng: 4.9041, label: "Amsterdam, NL" }}
              dropoff={{ lat: 45.4642, lng: 9.19, label: "Milan, IT" }}
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="pricing" className="border-t border-border/60">
        <div className="mx-auto max-w-5xl px-5 py-24 text-center lg:px-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1">
            <Zap className="h-3 w-3 text-primary" />
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-primary">Free during early access</span>
          </div>
          <h2 className="mt-6 text-3xl font-semibold tracking-tight md:text-5xl">
            Start moving freight with Jük Bar today.
          </h2>
          <p className="mt-4 text-[15px] text-muted-foreground">
            Onboard your company in under five minutes. Verification typically completes within 24h.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Link to="/register" className="inline-flex h-12 items-center gap-2 rounded-md bg-primary px-6 text-[14px] font-medium text-primary-foreground hover:bg-primary/90">
              Create company account <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/login" className="inline-flex h-12 items-center gap-2 rounded-md border border-border bg-surface/60 px-6 text-[14px] font-medium hover:bg-surface-2">
              I already have an account
            </Link>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
