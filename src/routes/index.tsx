import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, PageHeader, StatusBadge, Btn, MapPreview } from "@/components/ui-kit/Primitives";
import {
  ArrowUpRight, ArrowDownRight, Truck, Package, Wallet, Activity,
  MoreHorizontal, ArrowRight, MapPin, Clock, Fuel, ChevronRight,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "Dashboard — Logist" }, { name: "description", content: "Logistics operations overview." }] }),
  component: DashboardPage,
});

const kpis = [
  { label: "Active shipments", value: "248", delta: "+12.4%", up: true, icon: Truck, sub: "vs. last 30d" },
  { label: "Cargo volume", value: "14,820", suffix: "t", delta: "+3.1%", up: true, icon: Package, sub: "this quarter" },
  { label: "Gross revenue", value: "€ 2.84M", delta: "+18.7%", up: true, icon: Wallet, sub: "MTD" },
  { label: "On-time rate", value: "96.2", suffix: "%", delta: "-0.6%", up: false, icon: Activity, sub: "rolling 7d" },
];

const shipments = [
  { id: "SHP-2841", route: "Hamburg → Madrid", carrier: "TransEuro Spedition", eta: "Apr 12, 14:20", status: "in_transit" as const, progress: 64 },
  { id: "SHP-2840", route: "Rotterdam → Milan", carrier: "Aldridge Freight", eta: "Apr 11, 09:00", status: "loading" as const, progress: 12 },
  { id: "SHP-2837", route: "Gdańsk → Lyon", carrier: "Vostok Logistik", eta: "Apr 13, 22:40", status: "in_transit" as const, progress: 41 },
  { id: "SHP-2835", route: "Antwerp → Vienna", carrier: "Brennero Cargo", eta: "Apr 10, 16:10", status: "delayed" as const, progress: 78 },
  { id: "SHP-2832", route: "Riga → Berlin", carrier: "Nordfracht GmbH", eta: "Apr 09, 11:00", status: "delivered" as const, progress: 100 },
];

const volumeBars = [42, 58, 51, 64, 70, 49, 73, 81, 68, 92, 84, 95, 88, 110, 102, 121];

function Sparkline() {
  return (
    <svg viewBox="0 0 100 30" className="h-8 w-full">
      <polyline fill="none" stroke="oklch(0.76 0.14 60)" strokeWidth="1.5"
        points="0,22 8,18 16,20 24,12 32,16 40,8 48,14 56,6 64,11 72,4 80,9 88,3 100,7"/>
      <polyline fill="oklch(0.76 0.14 60 / 0.12)" stroke="none"
        points="0,22 8,18 16,20 24,12 32,16 40,8 48,14 56,6 64,11 72,4 80,9 88,3 100,7 100,30 0,30"/>
    </svg>
  );
}

function DashboardPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Workspace · Operations"
        title="Good morning, Erik"
        description="Real-time overview of your freight network. 248 shipments in motion across 14 corridors."
        actions={
          <>
            <Btn variant="outline">Export report</Btn>
            <Btn variant="primary">Dispatch shipment <ArrowRight className="h-3.5 w-3.5"/></Btn>
          </>
        }
      />

      {/* KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((k) => {
          const Icon = k.icon;
          return (
            <Card key={k.label} className="p-5">
              <div className="flex items-start justify-between">
                <div className="rounded-md bg-surface-2 p-2"><Icon className="h-4 w-4 text-primary"/></div>
                <span className={`flex items-center gap-1 font-mono text-[11px] ${k.up ? "text-success" : "text-destructive"}`}>
                  {k.up ? <ArrowUpRight className="h-3 w-3"/> : <ArrowDownRight className="h-3 w-3"/>}
                  {k.delta}
                </span>
              </div>
              <div className="mt-4 flex items-baseline gap-1">
                <div className="num text-[28px] font-semibold tracking-tight">{k.value}</div>
                {k.suffix && <div className="text-sm text-muted-foreground">{k.suffix}</div>}
              </div>
              <div className="mt-1 text-xs text-muted-foreground">{k.label} · <span className="font-mono">{k.sub}</span></div>
              <div className="mt-3"><Sparkline/></div>
            </Card>
          );
        })}
      </div>

      {/* Map + Volume */}
      <div className="mt-5 grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2 overflow-hidden">
          <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Live network</div>
              <div className="text-[15px] font-semibold">Fleet map · 248 vehicles</div>
            </div>
            <div className="flex gap-1">
              {["EU","NA","ASIA"].map((r,i) => (
                <button key={r} className={`rounded-md border px-2.5 py-1 font-mono text-[11px] ${i===0 ? "border-primary/40 bg-primary/10 text-primary" : "border-border bg-surface-2 text-muted-foreground"}`}>{r}</button>
              ))}
            </div>
          </div>
          <MapPreview className="h-[320px] rounded-none border-0 border-t border-border" />
          <div className="grid grid-cols-3 divide-x divide-border border-t border-border">
            {[
              { l: "Avg speed", v: "78", s: "km/h" },
              { l: "Idle fleet", v: "12", s: "vehicles" },
              { l: "Fuel index", v: "1.62", s: "€/L" },
            ].map(s => (
              <div key={s.l} className="px-5 py-3.5">
                <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{s.l}</div>
                <div className="mt-0.5 flex items-baseline gap-1"><span className="num text-lg font-semibold">{s.v}</span><span className="text-xs text-muted-foreground">{s.s}</span></div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Last 16 weeks</div>
              <div className="text-[15px] font-semibold">Cargo throughput</div>
            </div>
            <button className="text-muted-foreground"><MoreHorizontal className="h-4 w-4"/></button>
          </div>
          <div className="mt-5 flex h-[180px] items-end gap-1.5">
            {volumeBars.map((h, i) => (
              <div key={i} className="group relative flex-1">
                <div className="w-full rounded-sm bg-gradient-to-t from-primary/30 to-primary transition-all group-hover:from-primary/50 group-hover:to-primary" style={{ height: `${h}%` }}/>
              </div>
            ))}
          </div>
          <div className="mt-3 flex justify-between font-mono text-[10px] text-muted-foreground">
            <span>W01</span><span>W08</span><span>W16</span>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3 border-t border-border pt-4">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Inbound</div>
              <div className="num mt-0.5 text-base font-semibold">8,240 t</div>
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Outbound</div>
              <div className="num mt-0.5 text-base font-semibold">6,580 t</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent shipments + side */}
      <div className="mt-5 grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Operations queue</div>
              <div className="text-[15px] font-semibold">Recent shipments</div>
            </div>
            <Link to="/active-cargos" className="flex items-center gap-1 text-[12px] text-primary hover:underline">View all <ChevronRight className="h-3.5 w-3.5"/></Link>
          </div>
          <div className="divide-y divide-border">
            {shipments.map(s => (
              <Link key={s.id} to="/cargo-details" className="flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-surface-2/50">
                <div className="font-mono text-[11px] text-muted-foreground w-20">{s.id}</div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[13px] font-medium">{s.route}</div>
                  <div className="truncate text-[11px] text-muted-foreground">{s.carrier}</div>
                </div>
                <div className="hidden md:flex w-32 items-center gap-2">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-3">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${s.progress}%` }}/>
                  </div>
                  <span className="num font-mono text-[10px] text-muted-foreground w-8 text-right">{s.progress}%</span>
                </div>
                <div className="hidden sm:block">
                  <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">ETA</div>
                  <div className="text-[12px]">{s.eta}</div>
                </div>
                <StatusBadge status={s.status}/>
              </Link>
            ))}
          </div>
        </Card>

        <div className="space-y-4">
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <div className="text-[15px] font-semibold">Today's dispatch</div>
              <span className="font-mono text-[10px] text-muted-foreground">Apr 09</span>
            </div>
            <div className="mt-4 space-y-3">
              {[
                { t: "07:40", e: "Loading complete · SHP-2840", c: "bg-warning" },
                { t: "09:12", e: "Border crossing AT/IT", c: "bg-info" },
                { t: "11:08", e: "Delivery confirmed · Berlin", c: "bg-success" },
                { t: "13:30", e: "Driver rest stop — A2 km 412", c: "bg-muted-foreground" },
              ].map((e, i) => (
                <div key={i} className="flex gap-3">
                  <div className="font-mono text-[11px] text-muted-foreground w-10">{e.t}</div>
                  <div className="relative pt-1.5">
                    <div className={`h-2 w-2 rounded-full ${e.c}`}/>
                    {i !== 3 && <div className="absolute left-1/2 top-3 h-6 w-px -translate-x-1/2 bg-border"/>}
                  </div>
                  <div className="flex-1 text-[13px]">{e.e}</div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <div className="text-[15px] font-semibold">Top corridors</div>
            <div className="mt-4 space-y-3">
              {[
                { r: "DE → ES", v: 92, n: "42 active" },
                { r: "NL → IT", v: 68, n: "31 active" },
                { r: "PL → FR", v: 54, n: "24 active" },
                { r: "LV → DE", v: 38, n: "18 active" },
              ].map(c => (
                <div key={c.r}>
                  <div className="flex justify-between text-[12px]">
                    <span className="font-medium">{c.r}</span>
                    <span className="font-mono text-muted-foreground">{c.n}</span>
                  </div>
                  <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-surface-3">
                    <div className="h-full bg-primary" style={{ width: `${c.v}%` }}/>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
