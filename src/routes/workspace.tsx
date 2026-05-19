import { createFileRoute } from "@tanstack/react-router";
import { Card, PageHeader, Btn, StatusBadge } from "@/components/ui-kit/Primitives";
import { Plus, Search, MoreHorizontal, Calendar, MessageSquare, Paperclip, TrendingUp, ArrowRight, Filter } from "lucide-react";

export const Route = createFileRoute("/workspace")({
  head: () => ({ meta: [{ title: "Workspace — Logist" }] }),
  component: WorkspacePage,
});

const columns = [
  {
    title: "Backlog",
    color: "bg-muted-foreground",
    count: 5,
    cards: [
      { id: "WS-128", title: "Q2 corridor expansion · Iberia", tag: "Strategy", route: "DE → ES", priority: "Med" },
      { id: "WS-126", title: "Reefer fleet maintenance review", tag: "Operations", priority: "Low" },
      { id: "WS-122", title: "Onboard 4 new Polish carriers", tag: "Network", priority: "Med" },
    ],
  },
  {
    title: "In planning",
    color: "bg-info",
    count: 3,
    cards: [
      { id: "WS-131", title: "Negotiate annual contract — Volkswagen Bremen", tag: "Sales", route: "DE → IT", priority: "High" },
      { id: "WS-129", title: "Customs digitalization pilot", tag: "Compliance", priority: "Med" },
    ],
  },
  {
    title: "Dispatched",
    color: "bg-warning",
    count: 4,
    cards: [
      { id: "WS-134", title: "Multi-leg shipment — Riga → Lisbon", tag: "Operations", route: "LV → PT", priority: "High" },
      { id: "WS-133", title: "ADR training for 12 drivers", tag: "HR", priority: "Med" },
      { id: "WS-132", title: "Renew toll subscriptions FR/IT", tag: "Finance", priority: "Low" },
    ],
  },
  {
    title: "Completed",
    color: "bg-success",
    count: 8,
    cards: [
      { id: "WS-119", title: "Brennero Cargo SLA review", tag: "Network", priority: "Low" },
      { id: "WS-117", title: "Q1 financial close", tag: "Finance", priority: "High" },
    ],
  },
];

const priColor = { High: "text-destructive bg-destructive/10 border-destructive/30", Med: "text-warning bg-warning/10 border-warning/30", Low: "text-muted-foreground bg-surface-3 border-border-strong" };

function WorkspacePage() {
  return (
    <div>
      <PageHeader
        eyebrow="Operations · Workspace"
        title="Logistics command board"
        description="Coordinate shipments, contracts and ops projects across your team."
        actions={
          <>
            <Btn variant="outline"><Filter className="h-3.5 w-3.5"/>Filter</Btn>
            <Btn variant="outline"><Calendar className="h-3.5 w-3.5"/>Timeline</Btn>
            <Btn variant="primary"><Plus className="h-3.5 w-3.5"/>New task</Btn>
          </>
        }
      />

      {/* Project switcher */}
      <div className="mb-5 flex flex-wrap items-center gap-2">
        {["Operations Q2", "Iberia expansion", "Fleet renewal", "Compliance 2025"].map((p, i) => (
          <button key={p} className={`rounded-md border px-3 py-1.5 text-[12px] ${i===0 ? "border-primary/40 bg-primary/10 text-primary" : "border-border bg-surface text-muted-foreground hover:bg-surface-2"}`}>
            {p}
            {i===0 && <span className="ml-2 font-mono text-[10px]">20 tasks</span>}
          </button>
        ))}
      </div>

      {/* Kanban board */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {columns.map(col => (
          <div key={col.title} className="rounded-xl border border-border bg-surface/40 p-3">
            <div className="mb-3 flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${col.color}`}/>
                <span className="text-[13px] font-semibold">{col.title}</span>
                <span className="font-mono text-[10px] rounded bg-surface-3 px-1.5 py-0.5 text-muted-foreground">{col.count}</span>
              </div>
              <button className="text-muted-foreground hover:text-foreground"><Plus className="h-4 w-4"/></button>
            </div>

            <div className="space-y-2">
              {col.cards.map(c => (
                <Card key={c.id} className="p-3.5 cursor-pointer hover:border-border-strong transition-colors bg-card">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-[10px] text-muted-foreground">{c.id}</span>
                    <span className={`rounded border px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider ${priColor[c.priority as keyof typeof priColor]}`}>{c.priority}</span>
                  </div>
                  <div className="text-[13px] font-medium leading-snug">{c.title}</div>

                  {c.route && (
                    <div className="mt-3 flex items-center gap-2 rounded-md border border-border bg-surface/60 px-2 py-1.5">
                      <span className="font-mono text-[10px] text-primary">{c.route.split(" → ")[0]}</span>
                      <ArrowRight className="h-3 w-3 text-muted-foreground"/>
                      <span className="font-mono text-[10px] text-info">{c.route.split(" → ")[1]}</span>
                    </div>
                  )}

                  <div className="mt-3 flex items-center justify-between">
                    <span className="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-muted-foreground">{c.tag}</span>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <span className="flex items-center gap-0.5 text-[10px]"><MessageSquare className="h-3 w-3"/>4</span>
                      <span className="flex items-center gap-0.5 text-[10px]"><Paperclip className="h-3 w-3"/>2</span>
                      <div className="flex -space-x-1.5">
                        {["EV","HB"].map(a => (
                          <div key={a} className="h-5 w-5 rounded-full border border-card bg-gradient-to-br from-info/60 to-primary/40 flex items-center justify-center text-[9px] font-semibold">{a}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
              <button className="w-full rounded-lg border border-dashed border-border bg-transparent py-2 text-[11px] text-muted-foreground hover:bg-surface-2/40">+ Add task</button>
            </div>
          </div>
        ))}
      </div>

      {/* Activity */}
      <Card className="mt-6 p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Team activity</div>
            <div className="text-[15px] font-semibold">Recent updates</div>
          </div>
          <Btn variant="ghost" size="sm">View all →</Btn>
        </div>
        <div className="space-y-3">
          {[
            { u: "HB", n: "Hannah Becker", a: "moved", t: "WS-134 to Dispatched", time: "8 min ago" },
            { u: "MK", n: "Marek Kowal", a: "commented on", t: "WS-131 Volkswagen Bremen", time: "1h ago" },
            { u: "EV", n: "Erik Vogel", a: "created", t: "WS-135 Madrid hub onboarding", time: "3h ago" },
            { u: "LS", n: "Lina Schäfer", a: "completed", t: "WS-117 Q1 financial close", time: "Yesterday" },
          ].map((act, i) => (
            <div key={i} className="flex items-center gap-3 border-b border-border last:border-0 pb-3 last:pb-0">
              <div className="h-8 w-8 rounded-md bg-gradient-to-br from-info/60 to-primary/40 flex items-center justify-center text-[11px] font-semibold">{act.u}</div>
              <div className="flex-1 text-[13px]">
                <span className="font-medium">{act.n}</span>
                <span className="text-muted-foreground"> {act.a} </span>
                <span className="text-primary">{act.t}</span>
              </div>
              <span className="font-mono text-[10px] text-muted-foreground">{act.time}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
