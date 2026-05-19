import { createFileRoute } from "@tanstack/react-router";
import { Card, PageHeader, Btn, StatusBadge, MapPreview } from "@/components/ui-kit/Primitives";
import { Search, SlidersHorizontal, MapPin, Truck, Weight, Box, Clock, Star, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/find-transport")({
  head: () => ({ meta: [{ title: "Find transport — Logist" }] }),
  component: FindTransportPage,
});

const offers = [
  { id: "OFR-4421", route: "Hamburg → Madrid", company: "TransEuro Spedition", rating: 4.9, jobs: 1240, truck: "Tilt 13.6m · 24 t", price: "€ 2,840", eta: "48h", verified: true },
  { id: "OFR-4418", route: "Hamburg → Madrid", company: "Aldridge Freight Ltd.", rating: 4.7, jobs: 890, truck: "Reefer · 22 t", price: "€ 3,120", eta: "52h", verified: true },
  { id: "OFR-4415", route: "Hamburg → Barcelona", company: "Iberia Cargo SL", rating: 4.8, jobs: 620, truck: "Flatbed · 28 t", price: "€ 2,640", eta: "46h", verified: false },
  { id: "OFR-4411", route: "Hamburg → Valencia", company: "Mediterraneo Logistik", rating: 4.6, jobs: 412, truck: "Tilt 13.6m · 24 t", price: "€ 2,980", eta: "54h", verified: true },
];

function FindTransportPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Marketplace"
        title="Find transport"
        description="Search verified carriers across 38 countries. Negotiate, book, dispatch."
      />

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[340px_1fr]">
        {/* Filters panel */}
        <Card className="p-5 h-fit xl:sticky xl:top-20">
          <div className="flex items-center justify-between">
            <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Search criteria</div>
            <button className="text-[11px] text-primary">Reset</button>
          </div>

          <div className="mt-4 space-y-4">
            <div>
              <label className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Origin</label>
              <div className="mt-1.5 flex items-center gap-2 rounded-md border border-border bg-surface px-2.5 py-2">
                <MapPin className="h-3.5 w-3.5 text-primary"/>
                <input defaultValue="Hamburg, DE" className="flex-1 bg-transparent text-[13px] outline-none"/>
              </div>
            </div>
            <div>
              <label className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Destination</label>
              <div className="mt-1.5 flex items-center gap-2 rounded-md border border-border bg-surface px-2.5 py-2">
                <MapPin className="h-3.5 w-3.5 text-info"/>
                <input defaultValue="Madrid, ES" className="flex-1 bg-transparent text-[13px] outline-none"/>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Weight</label>
                <div className="mt-1.5 rounded-md border border-border bg-surface px-2.5 py-2 text-[13px]">24 t</div>
              </div>
              <div>
                <label className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Volume</label>
                <div className="mt-1.5 rounded-md border border-border bg-surface px-2.5 py-2 text-[13px]">82 m³</div>
              </div>
            </div>

            <div>
              <label className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Truck type</label>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {["Tilt","Reefer","Flatbed","Tanker","Container","Mega"].map((t,i) => (
                  <button key={t} className={`rounded-md border px-2.5 py-1 text-[12px] ${i<2 ? "border-primary/40 bg-primary/10 text-primary" : "border-border bg-surface text-muted-foreground"}`}>{t}</button>
                ))}
              </div>
            </div>

            <div>
              <label className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Pickup window</label>
              <div className="mt-1.5 grid grid-cols-2 gap-2">
                <div className="rounded-md border border-border bg-surface px-2.5 py-2 text-[12px]">Apr 09</div>
                <div className="rounded-md border border-border bg-surface px-2.5 py-2 text-[12px]">Apr 12</div>
              </div>
            </div>

            <div>
              <label className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Price range (€)</label>
              <div className="mt-2">
                <div className="h-1 rounded-full bg-surface-3"><div className="h-1 w-3/5 rounded-full bg-primary"/></div>
                <div className="mt-1.5 flex justify-between font-mono text-[10px] text-muted-foreground"><span>2,400</span><span>4,200</span></div>
              </div>
            </div>

            <label className="flex items-center gap-2 text-[12px]">
              <input type="checkbox" defaultChecked className="accent-primary"/>
              Verified carriers only
            </label>

            <Btn variant="primary" className="w-full justify-center"><Search className="h-3.5 w-3.5"/>Search offers</Btn>
          </div>
        </Card>

        {/* Results */}
        <div>
          <MapPreview className="h-[200px] mb-4" label="Hamburg → Madrid · 2,140 km · 4 corridors"/>

          <div className="mb-3 flex items-center justify-between">
            <div className="text-[13px] text-muted-foreground">
              <span className="text-foreground font-medium">42 offers</span> matching · sorted by <span className="text-primary">best value</span>
            </div>
            <Btn variant="outline" size="sm"><SlidersHorizontal className="h-3 w-3"/>Sort</Btn>
          </div>

          <div className="space-y-3">
            {offers.map(o => (
              <Card key={o.id} className="p-5 hover:border-border-strong transition-colors">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_auto] md:items-center">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="h-9 w-9 rounded-md bg-gradient-to-br from-surface-3 to-surface-2 border border-border flex items-center justify-center text-[11px] font-semibold">{o.company.slice(0,2).toUpperCase()}</div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[14px] font-semibold">{o.company}</span>
                          {o.verified && <StatusBadge status="verified"/>}
                        </div>
                        <div className="flex items-center gap-2.5 text-[11px] text-muted-foreground">
                          <span className="flex items-center gap-1"><Star className="h-3 w-3 fill-warning text-warning"/>{o.rating}</span>
                          <span>·</span>
                          <span className="font-mono">{o.jobs.toLocaleString()} jobs</span>
                          <span>·</span>
                          <span className="font-mono">{o.id}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-primary"/>
                        <span className="text-[13px] font-medium">{o.route.split("→")[0]}</span>
                      </div>
                      <div className="relative flex-1 h-px bg-border-strong">
                        <Truck className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 top-1/2 h-3.5 w-3.5 bg-card px-0.5 text-muted-foreground"/>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] font-medium">{o.route.split("→")[1]}</span>
                        <div className="h-2 w-2 rounded-full bg-info"/>
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-[12px] text-muted-foreground">
                      <span className="flex items-center gap-1.5"><Box className="h-3 w-3"/>{o.truck}</span>
                      <span className="flex items-center gap-1.5"><Clock className="h-3 w-3"/>{o.eta} transit</span>
                      <span className="flex items-center gap-1.5"><Weight className="h-3 w-3"/>Insurance €500k</span>
                    </div>
                  </div>

                  <div className="flex md:flex-col items-end gap-3 md:border-l md:border-border md:pl-5">
                    <div className="text-right">
                      <div className="num text-2xl font-semibold">{o.price}</div>
                      <div className="font-mono text-[10px] text-muted-foreground">€ 1.32 / km</div>
                    </div>
                    <Btn variant="primary" size="sm">Book <ChevronRight className="h-3 w-3"/></Btn>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
