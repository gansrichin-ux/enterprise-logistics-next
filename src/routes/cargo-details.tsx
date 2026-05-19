import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, PageHeader, Btn, StatusBadge, MapPreview } from "@/components/ui-kit/Primitives";
import { ArrowLeft, Download, MessageSquare, Truck, Package, MapPin, Calendar, FileText, Phone, Mail, Star, Shield, Thermometer, Weight, Box } from "lucide-react";

export const Route = createFileRoute("/cargo-details")({
  head: () => ({ meta: [{ title: "Cargo CGO-9821 — Logist" }] }),
  component: CargoDetailsPage,
});

const timeline = [
  { t: "Apr 08, 06:20", e: "Order created by Erik Vogel", d: "Nordfracht GmbH · Hamburg HQ", s: "done" },
  { t: "Apr 08, 09:48", e: "Carrier assigned · TransEuro Spedition", d: "Driver: Tomas Kowalski · MAN TGX 18.500", s: "done" },
  { t: "Apr 08, 14:15", e: "Loading complete at Hamburg port", d: "24.8 t / 82 m³ verified", s: "done" },
  { t: "Apr 09, 11:02", e: "Crossed DE/FR border at Saarbrücken", d: "Customs cleared · CMR endorsed", s: "active" },
  { t: "Apr 11, ETA", e: "Transit through Lyon corridor", d: "Expected fuel stop · A6 km 240", s: "pending" },
  { t: "Apr 12, 14:20", e: "Delivery to Madrid distribution hub", d: "Calle Industria 42, 28906", s: "pending" },
];

function CargoDetailsPage() {
  return (
    <div>
      <Link to="/active-cargos" className="inline-flex items-center gap-1.5 text-[12px] text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft className="h-3.5 w-3.5"/>Back to active cargos
      </Link>

      <div className="mb-6 flex flex-col gap-4 border-b border-border pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">CGO-9821</span>
            <StatusBadge status="in_transit"/>
            <span className="font-mono text-[11px] text-muted-foreground">· Priority: standard</span>
          </div>
          <h1 className="mt-1 text-[26px] font-semibold tracking-tight">Industrial machinery · CNC modules</h1>
          <div className="mt-1 flex items-center gap-2 text-[13px] text-muted-foreground">
            <MapPin className="h-3.5 w-3.5"/>
            Hamburg, DE
            <span className="text-border-strong">→</span>
            Madrid, ES
            <span className="text-border-strong">·</span>
            <span className="font-mono">2,140 km</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Btn variant="outline"><Download className="h-3.5 w-3.5"/>CMR PDF</Btn>
          <Btn variant="outline"><MessageSquare className="h-3.5 w-3.5"/>Message driver</Btn>
          <Btn variant="primary">Track live</Btn>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className="xl:col-span-2 space-y-5">
          {/* Map */}
          <Card className="overflow-hidden">
            <MapPreview className="h-[280px] rounded-none border-0"/>
            <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-border border-t border-border">
              {[
                { l: "Progress", v: "64%", c: "text-primary" },
                { l: "Distance left", v: "770 km", c: "" },
                { l: "Driver hours", v: "6h 12m", c: "" },
                { l: "ETA Madrid", v: "Apr 12 · 14:20", c: "text-success" },
              ].map(s => (
                <div key={s.l} className="px-4 py-3">
                  <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{s.l}</div>
                  <div className={`num mt-0.5 text-[15px] font-semibold ${s.c}`}>{s.v}</div>
                </div>
              ))}
            </div>
          </Card>

          {/* Timeline */}
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Event log</div>
                <div className="text-[15px] font-semibold">Shipment timeline</div>
              </div>
              <Btn variant="ghost" size="sm">All events →</Btn>
            </div>
            <div className="mt-5 space-y-0">
              {timeline.map((ev, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`mt-1 h-2.5 w-2.5 rounded-full border-2 ${
                      ev.s === "done" ? "bg-success border-success" :
                      ev.s === "active" ? "bg-primary border-primary animate-pulse" :
                      "bg-background border-border-strong"
                    }`}/>
                    {i !== timeline.length - 1 && <div className="w-px flex-1 bg-border my-1"/>}
                  </div>
                  <div className="flex-1 pb-5">
                    <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{ev.t}</div>
                    <div className="mt-0.5 text-[13px] font-medium">{ev.e}</div>
                    <div className="text-[12px] text-muted-foreground">{ev.d}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Documents */}
          <Card className="p-5">
            <div className="text-[15px] font-semibold mb-4">Documents</div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {[
                { n: "CMR Waybill", s: "PDF · 240 KB", c: "verified" as const },
                { n: "Commercial Invoice", s: "PDF · 180 KB", c: "verified" as const },
                { n: "Customs declaration", s: "PDF · 92 KB", c: "verified" as const },
                { n: "Insurance certificate", s: "PDF · 124 KB", c: "pending" as const },
              ].map(d => (
                <div key={d.n} className="flex items-center gap-3 rounded-lg border border-border bg-surface/40 p-3">
                  <div className="rounded bg-surface-3 p-2"><FileText className="h-4 w-4 text-primary"/></div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[13px] font-medium truncate">{d.n}</div>
                    <div className="font-mono text-[10px] text-muted-foreground">{d.s}</div>
                  </div>
                  <StatusBadge status={d.c}/>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          <Card className="p-5">
            <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Cargo details</div>
            <dl className="mt-3 divide-y divide-border">
              {[
                { k: "Type", v: "Industrial machinery" },
                { k: "Weight", v: "24,800 kg" },
                { k: "Volume", v: "82 m³" },
                { k: "Packaging", v: "8 wooden crates" },
                { k: "Temperature", v: "Ambient" },
                { k: "Dangerous goods", v: "No" },
                { k: "Declared value", v: "€ 184,000" },
              ].map(r => (
                <div key={r.k} className="flex justify-between py-2.5">
                  <dt className="text-[12px] text-muted-foreground">{r.k}</dt>
                  <dd className="text-[13px] font-medium num">{r.v}</dd>
                </div>
              ))}
            </dl>
          </Card>

          <Card className="p-5">
            <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Carrier</div>
            <div className="mt-3 flex items-center gap-3">
              <div className="h-11 w-11 rounded-lg bg-gradient-to-br from-primary/60 to-primary/20 flex items-center justify-center font-display font-semibold">TE</div>
              <div className="flex-1">
                <div className="text-[14px] font-semibold">TransEuro Spedition</div>
                <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                  <Star className="h-3 w-3 fill-warning text-warning"/>4.9
                  <span>· 1,240 jobs</span>
                </div>
              </div>
              <StatusBadge status="verified"/>
            </div>
            <div className="mt-4 rounded-lg border border-border bg-surface/40 p-3">
              <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Driver</div>
              <div className="mt-1 text-[13px] font-medium">Tomas Kowalski</div>
              <div className="font-mono text-[11px] text-muted-foreground">MAN TGX 18.500 · HH-TE 4421</div>
              <div className="mt-3 flex gap-2">
                <Btn variant="outline" size="sm" className="flex-1 justify-center"><Phone className="h-3 w-3"/>Call</Btn>
                <Btn variant="outline" size="sm" className="flex-1 justify-center"><Mail className="h-3 w-3"/>Message</Btn>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Financials</div>
            <div className="mt-3 space-y-2.5">
              {[
                { k: "Freight rate", v: "€ 7,800.00" },
                { k: "Fuel surcharge", v: "€ 420.00" },
                { k: "Tolls", v: "€ 230.00" },
              ].map(f => (
                <div key={f.k} className="flex justify-between text-[13px]">
                  <span className="text-muted-foreground">{f.k}</span>
                  <span className="num font-medium">{f.v}</span>
                </div>
              ))}
              <div className="mt-2 flex justify-between border-t border-border pt-3">
                <span className="text-[13px] font-semibold">Total</span>
                <span className="num text-[15px] font-semibold text-primary">€ 8,450.00</span>
              </div>
            </div>
            <Btn variant="primary" className="mt-4 w-full justify-center">Approve invoice</Btn>
          </Card>
        </div>
      </div>
    </div>
  );
}
