import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, PageHeader, StatusBadge, Btn, MapPreview } from "@/components/ui-kit/Primitives";
import { Filter, Download, Plus, Search, ArrowUpDown, MoreHorizontal, MapPin, Truck, Weight, Calendar } from "lucide-react";

export const Route = createFileRoute("/active-cargos")({
  head: () => ({ meta: [{ title: "Active cargos — Logist" }] }),
  component: ActiveCargosPage,
});

const rows = [
  { id: "CGO-9821", desc: "Industrial machinery", origin: "Hamburg, DE", dest: "Madrid, ES", weight: "24.8 t", vol: "82 m³", carrier: "TransEuro", eta: "Apr 12", price: "€ 8,450", status: "in_transit" as const },
  { id: "CGO-9819", desc: "Refrigerated goods", origin: "Rotterdam, NL", dest: "Milan, IT", weight: "18.2 t", vol: "64 m³", carrier: "Aldridge", eta: "Apr 11", price: "€ 6,120", status: "loading" as const },
  { id: "CGO-9815", desc: "Auto parts", origin: "Gdańsk, PL", dest: "Lyon, FR", weight: "12.4 t", vol: "44 m³", carrier: "Vostok", eta: "Apr 13", price: "€ 4,980", status: "in_transit" as const },
  { id: "CGO-9812", desc: "Construction steel", origin: "Antwerp, BE", dest: "Vienna, AT", weight: "32.0 t", vol: "28 m³", carrier: "Brennero", eta: "Apr 10", price: "€ 9,200", status: "delayed" as const },
  { id: "CGO-9808", desc: "Pharmaceuticals", origin: "Riga, LV", dest: "Berlin, DE", weight: "6.1 t", vol: "22 m³", carrier: "Nordfracht", eta: "Apr 09", price: "€ 3,400", status: "delivered" as const },
  { id: "CGO-9802", desc: "Bulk grain", origin: "Odessa, UA", dest: "Marseille, FR", weight: "28.5 t", vol: "92 m³", carrier: "Pending", eta: "Apr 14", price: "€ 7,800", status: "pending" as const },
];

function ActiveCargosPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Operations · Live"
        title="Active cargos"
        description="124 cargos currently being moved across your network."
        actions={
          <>
            <Btn variant="outline"><Download className="h-3.5 w-3.5"/>Export CSV</Btn>
            <Btn variant="primary"><Plus className="h-3.5 w-3.5"/>New cargo</Btn>
          </>
        }
      />

      {/* Summary strip */}
      <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-5">
        {[
          { l: "Total active", v: "124", c: "text-foreground" },
          { l: "In transit", v: "68", c: "text-info" },
          { l: "Loading", v: "21", c: "text-warning" },
          { l: "Delayed", v: "9", c: "text-destructive" },
          { l: "Delivered (24h)", v: "26", c: "text-success" },
        ].map(s => (
          <Card key={s.l} className="px-4 py-3">
            <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{s.l}</div>
            <div className={`num mt-1 text-2xl font-semibold ${s.c}`}>{s.v}</div>
          </Card>
        ))}
      </div>

      {/* Filter bar */}
      <Card>
        <div className="flex flex-wrap items-center gap-2 border-b border-border p-3">
          <div className="flex items-center gap-2 rounded-md border border-border bg-surface px-2.5 py-1.5 flex-1 min-w-[240px]">
            <Search className="h-4 w-4 text-muted-foreground"/>
            <input className="flex-1 bg-transparent text-[13px] outline-none placeholder:text-muted-foreground" placeholder="Cargo ID, route, carrier…"/>
          </div>
          {["All status", "Corridor", "Carrier", "Weight", "Date"].map(f => (
            <Btn key={f} variant="outline" size="sm"><Filter className="h-3 w-3"/>{f}</Btn>
          ))}
          <div className="ml-auto flex gap-1 rounded-md border border-border bg-surface p-0.5">
            {["Table","Cards","Map"].map((v,i) => (
              <button key={v} className={`px-2.5 py-1 text-[12px] rounded ${i===0 ? "bg-surface-3 text-foreground" : "text-muted-foreground"}`}>{v}</button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-surface/40 text-left font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                {["Cargo","Route","Weight / Vol","Carrier","ETA","Price","Status",""].map(h => (
                  <th key={h} className="px-4 py-2.5 font-normal">
                    <span className="inline-flex items-center gap-1">{h}{h && h !== "" && <ArrowUpDown className="h-2.5 w-2.5 opacity-50"/>}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.id} className="border-b border-border last:border-0 transition-colors hover:bg-surface-2/40">
                  <td className="px-4 py-3.5">
                    <Link to="/cargo-details" className="block">
                      <div className="font-mono text-[11px] text-muted-foreground">{r.id}</div>
                      <div className="text-[13px] font-medium">{r.desc}</div>
                    </Link>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1.5 text-[12px]">
                      <MapPin className="h-3 w-3 text-muted-foreground"/>{r.origin}
                    </div>
                    <div className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
                      <span className="ml-[3px] w-3 border-t border-dashed border-border-strong"/>{r.dest}
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="num text-[13px]">{r.weight}</div>
                    <div className="num text-[11px] text-muted-foreground">{r.vol}</div>
                  </td>
                  <td className="px-4 py-3.5 text-[13px]">{r.carrier}</td>
                  <td className="px-4 py-3.5"><div className="text-[13px]">{r.eta}</div><div className="font-mono text-[10px] text-muted-foreground">14:20 CET</div></td>
                  <td className="px-4 py-3.5 num text-[13px] font-medium">{r.price}</td>
                  <td className="px-4 py-3.5"><StatusBadge status={r.status}/></td>
                  <td className="px-4 py-3.5"><button className="text-muted-foreground hover:text-foreground"><MoreHorizontal className="h-4 w-4"/></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-border px-4 py-3 text-[12px] text-muted-foreground">
          <div className="font-mono">Showing 1–6 of 124</div>
          <div className="flex gap-1">
            {["←","1","2","3","…","21","→"].map((p,i) => (
              <button key={i} className={`h-7 min-w-7 rounded border border-border px-2 text-[11px] ${p==="1" ? "bg-primary/10 text-primary border-primary/30" : "bg-surface hover:bg-surface-2"}`}>{p}</button>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
