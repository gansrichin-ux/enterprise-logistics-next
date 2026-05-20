import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { JukBarLogo } from "@/components/jukbar/Logo";
import { RouteMap } from "@/components/jukbar/RouteMap";
import { observeAuthState, logout } from "@/lib/firebase/auth";
import { getDb } from "@/lib/firebase/firestore";
import { getRoleLabel } from "@/lib/roles";
import {
  Loader2, ShieldCheck, MapPin, Phone, Mail, Building2, FileText,
  Settings, LogOut, Bell, Activity, Truck, Package, CheckCircle2, Plus,
} from "lucide-react";

export const Route = createFileRoute("/cabinet")({
  head: () => ({ meta: [{ title: "Cabinet — Jük Bar" }] }),
  component: CabinetPage,
});

const TABS = ["Overview", "Company", "Documents", "Activity", "Settings"] as const;
type Tab = (typeof TABS)[number];

function CabinetPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("Overview");
  const [profile, setProfile] = useState<{
    id: string; full_name: string | null; phone: string | null; email: string | null;
    company_name: string | null; company_description: string | null;
    city: string | null; region: string | null; country: string | null;
    primary_role: string | null; verification_status: string;
    completion_percent: number;
  } | null>(null);

  useEffect(() => {
    return observeAuthState(async (user) => {
      if (!user) {
        navigate({ to: "/login" });
        return;
      }

      try {
        const snap = await getDoc(doc(getDb(), "users", user.uid));
        const data = snap.exists() ? snap.data() : null;
        setProfile({
          id: user.uid,
          full_name: (data?.name as string | undefined) ?? user.displayName ?? null,
          phone: null,
          email: (data?.email as string | undefined) ?? user.email ?? null,
          company_name: null,
          company_description: null,
          city: null,
          region: null,
          country: null,
          primary_role: (data?.role as string | undefined) ?? null,
          verification_status: (data?.profileStatus as string | undefined) ?? "pending",
          completion_percent: (data?.profileCompletenessPercent as number | undefined) ?? 10,
        });
      } finally {
        setLoading(false);
      }
    });
  }, [navigate]);

  async function handleLogout() {
    await logout();
    navigate({ to: "/" });
  }

  if (loading) {
    return <div className="grid min-h-screen place-items-center bg-background"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;
  }
  if (!profile) {
    return (
      <div className="grid min-h-screen place-items-center bg-background px-4 text-center">
        <div>
          <p className="text-[14px] text-muted-foreground">No profile found.</p>
          <Link to="/onboarding" className="mt-3 inline-flex rounded-md bg-primary px-4 py-2 text-[13px] font-medium text-primary-foreground">Complete onboarding</Link>
        </div>
      </div>
    );
  }

  const initials = (profile.full_name || profile.email || "JB").split(" ").map((s) => s[0]).join("").slice(0, 2).toUpperCase();
  const roleLabel = profile.primary_role ? getRoleLabel(profile.primary_role) : "—";
  const location = [profile.city, profile.region, profile.country].filter(Boolean).join(", ");
  const verified = profile.verification_status === "verified";

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-8">
          <Link to="/"><JukBarLogo /></Link>
          <div className="flex items-center gap-2">
            <button className="rounded-md border border-border bg-surface/60 p-2 hover:bg-surface-2"><Bell className="h-4 w-4" /></button>
            <button onClick={handleLogout} className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface/60 px-3 py-2 text-[12px] hover:bg-surface-2">
              <LogOut className="h-3.5 w-3.5" /> Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
        {/* Profile header card */}
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <div className="radial-emerald h-24" />
          <div className="-mt-12 px-7 pb-7">
            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div className="flex items-end gap-5">
                <div className="grid h-24 w-24 place-items-center rounded-2xl border-4 border-card bg-gradient-to-br from-primary to-primary-glow text-2xl font-semibold text-primary-foreground emerald-glow">
                  {initials}
                </div>
                <div className="pb-1">
                  <h1 className="text-2xl font-semibold tracking-tight">{profile.full_name || "Unnamed user"}</h1>
                  <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5"><Building2 className="h-3.5 w-3.5" />{profile.company_name || "—"}</span>
                    {location && <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{location}</span>}
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-md border border-primary/30 bg-primary/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-primary">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" /> {roleLabel}
                </span>
                <span className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider ${
                  verified ? "border-success/30 bg-success/10 text-success" : "border-warning/30 bg-warning/10 text-warning"
                }`}>
                  <ShieldCheck className="h-3 w-3" /> {verified ? "Verified" : "Verification pending"}
                </span>
                <Link to="/onboarding" className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface/60 px-3 py-1.5 text-[12px] hover:bg-surface-2">
                  Edit profile
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-6 flex flex-wrap gap-1 border-b border-border">
          {TABS.map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`relative -mb-px px-4 py-2.5 text-[13px] transition-colors ${
                tab === t ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}>
              {t}
              {tab === t && <span className="absolute inset-x-2 -bottom-px h-[2px] rounded bg-primary" />}
            </button>
          ))}
        </div>

        <div className="mt-7">
          {tab === "Overview" && <OverviewTab profile={profile} />}
          {tab === "Company" && <CompanyTab profile={profile} />}
          {tab === "Documents" && <DocumentsTab />}
          {tab === "Activity" && <ActivityTab />}
          {tab === "Settings" && <SettingsTab profile={profile} />}
        </div>
      </main>
    </div>
  );
}

function OverviewTab({ profile }: { profile: { phone: string | null; email: string | null; company_description: string | null; completion_percent: number } }) {
  return (
    <div className="grid gap-5 lg:grid-cols-3">
      <div className="space-y-5 lg:col-span-2">
        {/* Stats */}
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { icon: Truck, l: "Active shipments", v: "12", s: "in motion" },
            { icon: Package, l: "Cargo this month", v: "1,840 t", s: "+12%" },
            { icon: Activity, l: "On-time rate", v: "96.2%", s: "rolling 7d" },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.l} className="rounded-xl border border-border bg-card p-5">
                <Icon className="h-4 w-4 text-primary" />
                <div className="mt-3 num text-2xl font-semibold tracking-tight">{s.v}</div>
                <div className="mt-0.5 text-[12px] text-muted-foreground">{s.l} · <span className="font-mono">{s.s}</span></div>
              </div>
            );
          })}
        </div>

        {/* Map preview */}
        <div className="rounded-2xl border border-border bg-card p-2">
          <div className="flex items-center justify-between px-4 py-3">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-wider text-primary">Last shipment</div>
              <div className="text-[14px] font-medium">SHP-2841 · Hamburg → Madrid</div>
            </div>
            <button className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface/60 px-3 py-1.5 text-[12px] hover:bg-surface-2">
              <Plus className="h-3.5 w-3.5" /> New shipment
            </button>
          </div>
          <RouteMap height={340} />
        </div>
      </div>

      <aside className="space-y-5">
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Contact</div>
          <div className="mt-3 space-y-2.5">
            <div className="flex items-center gap-2.5 text-[13px]"><Mail className="h-3.5 w-3.5 text-muted-foreground" />{profile.email ?? "—"}</div>
            <div className="flex items-center gap-2.5 text-[13px]"><Phone className="h-3.5 w-3.5 text-muted-foreground" />{profile.phone ?? "—"}</div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Profile completion</div>
          <div className="mt-2 num text-3xl font-semibold">{profile.completion_percent}%</div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-surface-3">
            <div className="h-full bg-gradient-to-r from-primary to-primary-glow" style={{ width: `${profile.completion_percent}%` }} />
          </div>
          <Link to="/onboarding" className="mt-4 inline-flex text-[12px] text-primary hover:underline">Finish onboarding →</Link>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">About</div>
          <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">
            {profile.company_description || "Add a short company description to help partners understand your operations."}
          </p>
        </div>
      </aside>
    </div>
  );
}

function CompanyTab({ profile }: { profile: { company_name: string | null; company_description: string | null; city: string | null; region: string | null; country: string | null } }) {
  const rows = [
    ["Company", profile.company_name],
    ["Country", profile.country],
    ["Region", profile.region],
    ["City", profile.city],
  ];
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <div className="rounded-2xl border border-border bg-card p-7">
        <h3 className="text-[15px] font-semibold">Company card</h3>
        <div className="mt-5 divide-y divide-border">
          {rows.map(([k, v]) => (
            <div key={k as string} className="flex items-center justify-between py-3">
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{k}</span>
              <span className="text-[13px]">{v || <span className="text-muted-foreground">—</span>}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-2xl border border-border bg-card p-7">
        <h3 className="text-[15px] font-semibold">Description</h3>
        <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">
          {profile.company_description || "No company description yet."}
        </p>
      </div>
    </div>
  );
}

function DocumentsTab() {
  return (
    <div className="rounded-2xl border border-border bg-card p-7">
      <h3 className="text-[15px] font-semibold">Documents</h3>
      <p className="mt-1 text-[13px] text-muted-foreground">Upload company and compliance documents. Storage hookup pending.</p>
      <div className="mt-5 divide-y divide-border rounded-lg border border-border">
        {["Company registration","VAT certificate","Insurance policy","Transport licence"].map((d) => (
          <div key={d} className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3"><FileText className="h-4 w-4 text-muted-foreground" /><span className="text-[13px]">{d}</span></div>
            <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Not uploaded</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ActivityTab() {
  const items = [
    { t: "Today · 09:12", e: "Profile updated", c: "text-primary" },
    { t: "Yesterday · 17:48", e: "Shipment SHP-2841 created (Hamburg → Madrid)", c: "text-foreground" },
    { t: "Yesterday · 14:05", e: "Carrier TransEuro confirmed bid", c: "text-foreground" },
    { t: "2 days ago", e: "Account created", c: "text-muted-foreground" },
  ];
  return (
    <div className="rounded-2xl border border-border bg-card p-7">
      <h3 className="text-[15px] font-semibold">Activity</h3>
      <div className="mt-5 space-y-3.5">
        {items.map((i) => (
          <div key={i.t} className="flex gap-4 border-b border-border pb-3.5 last:border-0">
            <div className="font-mono text-[11px] text-muted-foreground w-32 shrink-0">{i.t}</div>
            <div className={`text-[13px] ${i.c}`}>{i.e}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SettingsTab({ profile }: { profile: { verification_status: string } }) {
  const verified = profile.verification_status === "verified";
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <div className="rounded-2xl border border-border bg-card p-7">
        <div className="flex items-center gap-2"><Settings className="h-4 w-4 text-primary" /><h3 className="text-[15px] font-semibold">Preferences</h3></div>
        <ul className="mt-5 divide-y divide-border">
          {["Email notifications","SMS alerts","Marketing updates","Two-factor authentication"].map((p, i) => (
            <li key={p} className="flex items-center justify-between py-3">
              <span className="text-[13px]">{p}</span>
              <span className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider ${
                i % 2 === 0 ? "border-success/30 bg-success/10 text-success" : "border-border bg-surface-2 text-muted-foreground"
              }`}>
                <CheckCircle2 className="h-3 w-3" /> {i % 2 === 0 ? "Enabled" : "Disabled"}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-2xl border border-border bg-card p-7">
        <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary" /><h3 className="text-[15px] font-semibold">Verification</h3></div>
        <p className="mt-2 text-[13px] text-muted-foreground">Current status: <span className={`font-medium ${verified ? "text-success" : "text-warning"}`}>{verified ? "Verified" : "Pending review"}</span></p>
        <p className="mt-3 text-[12px] text-muted-foreground">Reviewers verify your registration, insurance and transport licence to unlock the full marketplace.</p>
      </div>
    </div>
  );
}
