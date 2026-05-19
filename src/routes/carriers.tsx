import { createFileRoute } from "@tanstack/react-router";
import { Card, PageHeader, Btn, StatusBadge } from "@/components/ui-kit/Primitives";
import { Star, Truck, MapPin, Shield, Phone, Mail, Plus, Search } from "lucide-react";

export const Route = createFileRoute("/carriers")({
  head: () => ({ meta: [{ title: "Carriers — Logist" }] }),
  component: CarriersPage,
});

const carriers = [
  { name: "TransEuro Spedition", code: "TE", country: "DE · Hamburg", fleet: 142, rating: 4.9, jobs: 1240, role: "Carrier-Forwarder", verified: true, color: "from-primary/60 to-primary/20" },
  { name: "Aldridge Freight Ltd.", code: "AL", country: "UK · Manchester", fleet: 88, rating: 4.7, jobs: 890, role: "Carrier", verified: true, color: "from-info/60 to-info/20" },
  { name: "Vostok Logistik", code: "VL", country: "PL · Gdańsk", fleet: 64, rating: 4.6, jobs: 540, role: "Carrier", verified: true, color: "from-success/60 to-success/20" },
  { name: "Brennero Cargo", code: "BC", country: "IT · Verona", fleet: 110, rating: 4.8, jobs: 980, role: "Carrier-Forwarder", verified: true, color: "from-warning/60 to-warning/20" },
  { name: "Iberia Cargo SL", code: "IC", country: "ES · Madrid", fleet: 76, rating: 4.8, jobs: 620, role: "Carrier", verified: false, color: "from-destructive/50 to-destructive/10" },
  { name: "Mediterraneo Logistik", code: "ML", country: "FR · Marseille", fleet: 52, rating: 4.6, jobs: 412, role: "Cargo owner-Carrier", verified: true, color: "from-chart-5/60 to-chart-5/20" },
];

function CarriersPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Network · Partners"
        title="Carriers"
        description="Manage and discover verified transport partners across Europe."
        actions={
          <>
            <Btn variant="outline"><Search className="h-3.5 w-3.5"/>Search network</Btn>
            <Btn variant="primary"><Plus className="h-3.5 w-3.5"/>Invite carrier</Btn>
          </>
        }
      />

      <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          { l: "Network size", v: "284" },
          { l: "Verified", v: "248" },
          { l: "Active this week", v: "92" },
          { l: "Avg rating", v: "4.78" },
        ].map(s => (
          <Card key={s.l} className="p-4">
            <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{s.l}</div>
            <div className="num mt-1 text-2xl font-semibold">{s.v}</div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {carriers.map(c => (
          <Card key={c.code} className="overflow-hidden group hover:border-border-strong transition-colors">
            <div className={`h-20 bg-gradient-to-br ${c.color} relative grid-bg`}>
              <div className="absolute right-3 top-3">
                {c.verified && <StatusBadge status="verified"/>}
              </div>
            </div>
            <div className="px-5 pb-5">
              <div className="-mt-7 mb-3 flex items-end justify-between">
                <div className="h-14 w-14 rounded-xl border border-border-strong bg-surface-2 flex items-center justify-center font-display text-lg font-semibold">{c.code}</div>
                <div className="flex items-center gap-1 rounded-md border border-border bg-surface px-2 py-1 font-mono text-[11px]">
                  <Star className="h-3 w-3 fill-warning text-warning"/>{c.rating}
                </div>
              </div>
              <div className="text-[15px] font-semibold">{c.name}</div>
              <div className="mt-0.5 flex items-center gap-1.5 text-[12px] text-muted-foreground">
                <MapPin className="h-3 w-3"/>{c.country}
              </div>
              <div className="mt-1 font-mono text-[10px] uppercase tracking-wider text-primary">{c.role}</div>

              <div className="mt-4 grid grid-cols-3 gap-2 border-t border-border pt-4">
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Fleet</div>
                  <div className="num mt-0.5 text-[14px] font-semibold">{c.fleet}</div>
                </div>
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Jobs</div>
                  <div className="num mt-0.5 text-[14px] font-semibold">{c.jobs}</div>
                </div>
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">SLA</div>
                  <div className="num mt-0.5 text-[14px] font-semibold text-success">98%</div>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <Btn variant="outline" size="sm" className="flex-1 justify-center"><Phone className="h-3 w-3"/>Contact</Btn>
                <Btn variant="primary" size="sm" className="flex-1 justify-center">View profile</Btn>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
