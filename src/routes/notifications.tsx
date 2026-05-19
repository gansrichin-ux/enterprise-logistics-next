import { createFileRoute } from "@tanstack/react-router";
import { Card, PageHeader, Btn, StatusBadge } from "@/components/ui-kit/Primitives";
import { Bell, CheckCheck, Filter, AlertTriangle, Truck, FileText, MessageSquare, Wallet, MapPin } from "lucide-react";

export const Route = createFileRoute("/notifications")({
  head: () => ({ meta: [{ title: "Notifications — Logist" }] }),
  component: NotificationsPage,
});

const groups = [
  {
    label: "Today",
    items: [
      { icon: AlertTriangle, color: "text-destructive bg-destructive/10", title: "Shipment SHP-2835 delayed", body: "Brennero Cargo reports 2h delay at AT/IT border. ETA shifted to 18:10.", time: "12 min ago", unread: true, tag: "Alert" },
      { icon: Truck,         color: "text-info bg-info/10",               title: "Driver checked in — Tomas K.", body: "MAN TGX 18.500 · Saarbrücken crossing complete.", time: "1h ago", unread: true, tag: "Operations" },
      { icon: MessageSquare, color: "text-primary bg-primary/10",         title: "New offer from Aldridge Freight", body: "Rotterdam → Milan · € 3,120 · 22 t Reefer. Valid for 4h.", time: "2h ago", unread: true, tag: "Marketplace" },
      { icon: Wallet,        color: "text-success bg-success/10",         title: "Invoice paid — INV-7821", body: "TransEuro Spedition · € 8,450 received via SEPA.", time: "3h ago", unread: false, tag: "Finance" },
    ],
  },
  {
    label: "Yesterday",
    items: [
      { icon: FileText, color: "text-warning bg-warning/10", title: "Insurance certificate expires soon", body: "Document for CGO-9812 expires in 5 days. Renew to maintain coverage.", time: "Yesterday, 18:42", unread: false, tag: "Compliance" },
      { icon: MapPin,   color: "text-info bg-info/10",       title: "Delivery confirmed — Berlin", body: "Pharmaceuticals · 6.1 t. Signed by R. Hoffmann.", time: "Yesterday, 11:00", unread: false, tag: "Delivery" },
      { icon: Truck,    color: "text-primary bg-primary/10", title: "New carrier joined your network", body: "Iberia Cargo SL accepted your partnership invitation.", time: "Yesterday, 09:15", unread: false, tag: "Network" },
    ],
  },
];

function NotificationsPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Inbox"
        title="Notifications"
        description="7 unread events across operations, marketplace and finance."
        actions={
          <>
            <Btn variant="outline"><Filter className="h-3.5 w-3.5"/>Filter</Btn>
            <Btn variant="primary"><CheckCheck className="h-3.5 w-3.5"/>Mark all read</Btn>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[220px_1fr]">
        <Card className="p-2 h-fit">
          {[
            { l: "All notifications", c: 38, active: true },
            { l: "Alerts", c: 3 },
            { l: "Operations", c: 12 },
            { l: "Marketplace", c: 8 },
            { l: "Finance", c: 5 },
            { l: "Compliance", c: 4 },
            { l: "Network", c: 6 },
          ].map(t => (
            <button key={t.l} className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-[13px] ${t.active ? "bg-surface-2 text-foreground" : "text-muted-foreground hover:bg-surface-2/50"}`}>
              <span>{t.l}</span>
              <span className="font-mono text-[10px]">{t.c}</span>
            </button>
          ))}
        </Card>

        <div className="space-y-6">
          {groups.map(g => (
            <div key={g.label}>
              <div className="mb-2 flex items-center gap-3">
                <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{g.label}</div>
                <div className="h-px flex-1 bg-border"/>
              </div>
              <Card>
                <div className="divide-y divide-border">
                  {g.items.map((n, i) => {
                    const Icon = n.icon;
                    return (
                      <div key={i} className={`flex gap-4 p-4 transition-colors hover:bg-surface-2/40 ${n.unread ? "bg-surface/30" : ""}`}>
                        <div className={`h-9 w-9 shrink-0 rounded-md flex items-center justify-center ${n.color}`}>
                          <Icon className="h-4 w-4"/>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <div className="text-[13px] font-semibold truncate">{n.title}</div>
                            {n.unread && <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0"/>}
                          </div>
                          <div className="mt-0.5 text-[12px] text-muted-foreground">{n.body}</div>
                          <div className="mt-2 flex items-center gap-2 font-mono text-[10px] text-muted-foreground">
                            <span className="rounded border border-border bg-surface px-1.5 py-0.5 uppercase tracking-wider">{n.tag}</span>
                            <span>·</span>
                            <span>{n.time}</span>
                          </div>
                        </div>
                        <div className="hidden sm:flex flex-col gap-1.5">
                          <Btn variant="outline" size="sm">View</Btn>
                          <Btn variant="ghost" size="sm">Dismiss</Btn>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
