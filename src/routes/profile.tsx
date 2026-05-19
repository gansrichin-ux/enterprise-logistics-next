import { createFileRoute } from "@tanstack/react-router";
import { Card, PageHeader, Btn, StatusBadge } from "@/components/ui-kit/Primitives";
import { Building2, MapPin, Globe, Phone, Mail, Shield, Truck, FileText, Settings, CreditCard, Users, KeyRound, Camera, Edit3 } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Company cabinet — Logist" }] }),
  component: ProfilePage,
});

const tabs = ["Overview", "Fleet & assets", "Team", "Documents", "Billing", "API & integrations", "Security"];

function ProfilePage() {
  const [tab, setTab] = useState(0);

  return (
    <div>
      {/* Company header */}
      <Card className="mb-5 overflow-hidden">
        <div className="h-28 grid-bg bg-gradient-to-br from-surface-3 via-surface-2 to-surface relative">
          <button className="absolute right-3 top-3 rounded-md border border-border bg-background/70 px-2.5 py-1 text-[11px] backdrop-blur"><Camera className="inline h-3 w-3 mr-1"/>Cover</button>
        </div>
        <div className="px-6 pb-6">
          <div className="-mt-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div className="flex items-end gap-4">
              <div className="h-20 w-20 rounded-2xl border-2 border-background bg-gradient-to-br from-primary to-primary/40 flex items-center justify-center font-display text-2xl font-semibold text-primary-foreground shadow-xl">NF</div>
              <div className="pb-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-semibold tracking-tight">Nordfracht GmbH</h1>
                  <StatusBadge status="verified"/>
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-muted-foreground">
                  <span className="font-mono">DE-2241-7702</span>
                  <span>·</span>
                  <span className="flex items-center gap-1"><MapPin className="h-3 w-3"/>Hamburg, Germany</span>
                  <span>·</span>
                  <span>Founded 2008</span>
                </div>
                <div className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-primary">Forwarder · Carrier-Forwarder</div>
              </div>
            </div>
            <div className="flex gap-2">
              <Btn variant="outline"><Edit3 className="h-3.5 w-3.5"/>Edit profile</Btn>
              <Btn variant="primary"><Settings className="h-3.5 w-3.5"/>Settings</Btn>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4 border-t border-border pt-5 md:grid-cols-5">
            {[
              { l: "Trust score", v: "98", s: "/100", c: "text-success" },
              { l: "Active fleet", v: "142", s: "vehicles" },
              { l: "Jobs completed", v: "12,480" },
              { l: "On-time rate", v: "97.4", s: "%" },
              { l: "Avg rating", v: "4.91", s: "/ 5" },
            ].map(s => (
              <div key={s.l}>
                <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{s.l}</div>
                <div className="mt-0.5 flex items-baseline gap-1">
                  <span className={`num text-xl font-semibold ${s.c ?? ""}`}>{s.v}</span>
                  {s.s && <span className="text-[11px] text-muted-foreground">{s.s}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <div className="mb-5 flex gap-1 overflow-x-auto border-b border-border">
        {tabs.map((t, i) => (
          <button key={t} onClick={() => setTab(i)}
            className={`relative whitespace-nowrap px-4 py-3 text-[13px] ${tab===i ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
            {t}
            {tab===i && <span className="absolute inset-x-3 bottom-0 h-[2px] bg-primary"/>}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className="xl:col-span-2 space-y-5">
          <Card className="p-5">
            <div className="text-[15px] font-semibold mb-4">Company information</div>
            <div className="grid grid-cols-1 gap-x-8 gap-y-4 md:grid-cols-2">
              {[
                { k: "Legal name", v: "Nordfracht Spedition GmbH" },
                { k: "Tax ID (USt-ID)", v: "DE 287 449 102" },
                { k: "License", v: "GZ 4711-EU" },
                { k: "Registered address", v: "Speicherstadt 17, 20457 Hamburg" },
                { k: "Phone", v: "+49 40 226 18 200" },
                { k: "Email", v: "ops@nordfracht.de" },
                { k: "Website", v: "nordfracht.de" },
                { k: "Insurance limit", v: "€ 1,500,000" },
              ].map(r => (
                <div key={r.k}>
                  <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{r.k}</div>
                  <div className="mt-1 text-[13px]">{r.v}</div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <div className="text-[15px] font-semibold mb-4">Role permissions</div>
            <div className="space-y-2.5">
              {[
                { r: "Carrier", a: true, d: "Operate own fleet and accept cargo orders" },
                { r: "Forwarder", a: true, d: "Manage shipments on behalf of cargo owners" },
                { r: "Carrier-Forwarder", a: true, d: "Combined operator + broker role (active)" },
                { r: "Logistician", a: false, d: "Plan multi-leg routes for clients" },
                { r: "Cargo owner", a: false, d: "Post cargo and book carriers" },
              ].map(r => (
                <div key={r.r} className="flex items-center justify-between rounded-lg border border-border bg-surface/30 px-4 py-3">
                  <div>
                    <div className="text-[13px] font-medium">{r.r}</div>
                    <div className="text-[11px] text-muted-foreground">{r.d}</div>
                  </div>
                  <button className={`h-5 w-9 rounded-full transition-colors ${r.a ? "bg-primary" : "bg-surface-3"} relative`}>
                    <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-background transition-all ${r.a ? "left-[18px]" : "left-0.5"}`}/>
                  </button>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-5">
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <div className="text-[15px] font-semibold">Verification</div>
              <StatusBadge status="verified"/>
            </div>
            <div className="mt-4 space-y-3">
              {[
                { l: "Business registration", s: true },
                { l: "VAT number", s: true },
                { l: "Transport license", s: true },
                { l: "Insurance certificate", s: true },
                { l: "Bank account (SEPA)", s: true },
                { l: "Beneficial owner KYC", s: false },
              ].map(v => (
                <div key={v.l} className="flex items-center justify-between text-[13px]">
                  <span>{v.l}</span>
                  <span className={`font-mono text-[10px] ${v.s ? "text-success" : "text-warning"}`}>{v.s ? "VERIFIED" : "PENDING"}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <div className="text-[15px] font-semibold mb-4">Team</div>
            <div className="space-y-3">
              {[
                { n: "Erik Vogel", r: "Owner · Admin", e: "EV" },
                { n: "Hannah Becker", r: "Operations lead", e: "HB" },
                { n: "Marek Kowal", r: "Dispatcher", e: "MK" },
                { n: "Lina Schäfer", r: "Finance", e: "LS" },
              ].map(t => (
                <div key={t.n} className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-md bg-gradient-to-br from-info/60 to-primary/40 flex items-center justify-center text-[11px] font-semibold">{t.e}</div>
                  <div className="flex-1">
                    <div className="text-[13px] font-medium">{t.n}</div>
                    <div className="font-mono text-[10px] text-muted-foreground">{t.r}</div>
                  </div>
                </div>
              ))}
              <Btn variant="outline" size="sm" className="w-full justify-center"><Users className="h-3 w-3"/>Invite member</Btn>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
