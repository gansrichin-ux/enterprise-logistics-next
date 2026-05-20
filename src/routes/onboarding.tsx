import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { JukBarLogo } from "@/components/jukbar/Logo";
import { CheckCircle2, Loader2, ArrowRight, ShieldCheck, FileText, Upload } from "lucide-react";

export const Route = createFileRoute("/onboarding")({
  head: () => ({ meta: [{ title: "Onboarding — Jük Bar" }] }),
  component: OnboardingPage,
});

const ROLES = [
  { v: "carrier", l: "Carrier", d: "I move freight with my own fleet" },
  { v: "logistician", l: "Logistician", d: "I plan and coordinate shipments" },
  { v: "cargo_owner", l: "Cargo owner", d: "I have cargo that needs moving" },
  { v: "forwarder", l: "Forwarder", d: "I broker freight for clients" },
  { v: "carrier_forwarder", l: "Carrier-Forwarder", d: "Hybrid · fleet + brokerage" },
  { v: "cargo_owner_carrier", l: "Cargo owner-Carrier", d: "Hybrid · shipper + own fleet" },
  { v: "logistician_carrier", l: "Logistician-Carrier", d: "Hybrid · planning + fleet" },
];

const STEPS = ["Personal", "Company", "Role & Region", "Documents", "Review"];

type FormState = {
  full_name: string; phone: string;
  company_name: string; company_description: string;
  primary_role: string; city: string; region: string; country: string;
};

function OnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [f, setF] = useState<FormState>({
    full_name: "", phone: "",
    company_name: "", company_description: "",
    primary_role: "carrier", city: "", region: "", country: "Germany",
  });

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) { navigate({ to: "/login" }); return; }
      setUserId(data.user.id);
      const { data: prof } = await supabase.from("profiles").select("*").eq("id", data.user.id).maybeSingle();
      if (prof) {
        setF((p) => ({
          ...p,
          full_name: prof.full_name ?? p.full_name,
          phone: prof.phone ?? p.phone,
          company_name: prof.company_name ?? p.company_name,
          company_description: prof.company_description ?? p.company_description,
          primary_role: prof.primary_role ?? p.primary_role,
          city: prof.city ?? p.city,
          region: prof.region ?? p.region,
          country: prof.country ?? p.country,
        }));
      }
      setLoading(false);
    })();
  }, [navigate]);

  const upd = <K extends keyof FormState>(k: K) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setF((p) => ({ ...p, [k]: e.target.value }));

  const completion = Math.min(100, Math.round(
    (Number(!!f.full_name) + Number(!!f.phone) + Number(!!f.company_name) +
     Number(!!f.company_description) + Number(!!f.city) + Number(!!f.country) + Number(!!f.primary_role)) / 7 * 100
  ));

  async function save(finish = false) {
    if (!userId) return;
    setSaving(true); setError(null);
    const { error } = await supabase.from("profiles").upsert({
      id: userId,
      full_name: f.full_name, phone: f.phone,
      company_name: f.company_name, company_description: f.company_description,
      primary_role: f.primary_role as never,
      city: f.city, region: f.region, country: f.country,
      completion_percent: completion,
    });
    if (!error) {
      await supabase.from("user_roles").upsert({ user_id: userId, role: f.primary_role as never }, { onConflict: "user_id,role" });
    }
    setSaving(false);
    if (error) { setError(error.message); return; }
    if (finish) navigate({ to: "/cabinet" });
  }

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-background">
      <div className="radial-emerald pointer-events-none absolute inset-x-0 top-0 h-[420px]" />
      <header className="relative z-10 border-b border-border/60">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 lg:px-8">
          <Link to="/"><JukBarLogo /></Link>
          <Link to="/cabinet" className="text-[12px] text-muted-foreground hover:text-foreground">Skip for now →</Link>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-6xl px-5 py-10 lg:px-8">
        <div className="mb-8">
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-primary">Step {step + 1} of {STEPS.length}</div>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">Set up your company cabinet</h1>
          <p className="mt-1.5 text-[14px] text-muted-foreground">A complete profile gets verified ~3× faster.</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
          {/* Form */}
          <div className="rounded-2xl border border-border bg-card p-7 md:p-9">
            {/* Stepper */}
            <div className="mb-7 flex flex-wrap gap-1.5">
              {STEPS.map((s, i) => (
                <button key={s} onClick={() => setStep(i)}
                  className={`rounded-md px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider transition-colors ${
                    i === step ? "bg-primary text-primary-foreground"
                      : i < step ? "bg-primary/15 text-primary"
                      : "bg-surface-2 text-muted-foreground"
                  }`}>
                  {i + 1}. {s}
                </button>
              ))}
            </div>

            {step === 0 && (
              <Section title="Personal information" desc="How carriers and partners reach you.">
                <Grid2>
                  <FormField label="Full name"><input className="auth-input" value={f.full_name} onChange={upd("full_name")} placeholder="Erik Vogel" /></FormField>
                  <FormField label="Phone"><input className="auth-input" value={f.phone} onChange={upd("phone")} placeholder="+49 40 1234567" /></FormField>
                </Grid2>
              </Section>
            )}

            {step === 1 && (
              <Section title="Company information" desc="What appears on contracts, CMR and invoices.">
                <FormField label="Company name"><input className="auth-input" value={f.company_name} onChange={upd("company_name")} placeholder="Nordfracht GmbH" /></FormField>
                <FormField label="Company description">
                  <textarea className="auth-input" style={{ height: 110, padding: 12 }} value={f.company_description} onChange={upd("company_description")}
                    placeholder="Short description of your operations, lanes, equipment…" />
                </FormField>
              </Section>
            )}

            {step === 2 && (
              <Section title="Role & region" desc="Choose how you operate on the network.">
                <FormField label="Primary role">
                  <div className="grid gap-2 md:grid-cols-2">
                    {ROLES.map((r) => (
                      <button key={r.v} type="button" onClick={() => setF((p) => ({ ...p, primary_role: r.v }))}
                        className={`rounded-lg border p-3 text-left transition-colors ${
                          f.primary_role === r.v
                            ? "border-primary bg-primary/10"
                            : "border-border bg-surface/60 hover:bg-surface-2"
                        }`}>
                        <div className="text-[13px] font-medium">{r.l}</div>
                        <div className="text-[11px] text-muted-foreground">{r.d}</div>
                      </button>
                    ))}
                  </div>
                </FormField>
                <Grid2>
                  <FormField label="City"><input className="auth-input" value={f.city} onChange={upd("city")} placeholder="Hamburg" /></FormField>
                  <FormField label="Region / State"><input className="auth-input" value={f.region} onChange={upd("region")} placeholder="HH" /></FormField>
                </Grid2>
                <FormField label="Country">
                  <select className="auth-input" value={f.country} onChange={upd("country")}>
                    {["Germany","Netherlands","Poland","Spain","Italy","France","Estonia","Latvia","Lithuania","Other"].map((c) => <option key={c}>{c}</option>)}
                  </select>
                </FormField>
              </Section>
            )}

            {step === 3 && (
              <Section title="Documents" desc="Optional now, required for verification.">
                <div className="space-y-2.5">
                  {["Company registration", "VAT certificate", "Insurance policy", "Transport licence"].map((d) => (
                    <div key={d} className="flex items-center justify-between rounded-lg border border-border bg-surface/60 px-4 py-3">
                      <div className="flex items-center gap-3">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="text-[13px]">{d}</span>
                      </div>
                      <button type="button" className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface-2 px-2.5 py-1 text-[11px] hover:bg-surface-3">
                        <Upload className="h-3 w-3" /> Upload
                      </button>
                    </div>
                  ))}
                  <p className="pt-2 text-[11px] text-muted-foreground">Document upload is a placeholder in this prototype. Files will be stored once enabled.</p>
                </div>
              </Section>
            )}

            {step === 4 && (
              <Section title="Review & finish" desc="We'll move you to your cabinet.">
                <div className="rounded-lg border border-border bg-surface/60 p-5">
                  <div className="grid gap-4 sm:grid-cols-2">
                    {[
                      ["Full name", f.full_name],
                      ["Phone", f.phone],
                      ["Company", f.company_name],
                      ["Role", ROLES.find((r) => r.v === f.primary_role)?.l ?? f.primary_role],
                      ["Location", [f.city, f.region, f.country].filter(Boolean).join(", ")],
                      ["Completion", `${completion}%`],
                    ].map(([k, v]) => (
                      <div key={k as string}>
                        <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{k}</div>
                        <div className="mt-0.5 text-[13px]">{v || <span className="text-muted-foreground">—</span>}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2 rounded-lg border border-primary/25 bg-primary/5 px-4 py-3 text-[12px]">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  <span><span className="font-medium">Verification pending</span> · A reviewer will check your details within 24 hours.</span>
                </div>
              </Section>
            )}

            {error && <p className="mt-4 text-[12px] text-destructive">{error}</p>}

            <div className="mt-7 flex justify-between border-t border-border pt-5">
              <button onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}
                className="rounded-md border border-border bg-surface/60 px-4 py-2 text-[13px] disabled:opacity-50">Back</button>
              {step < STEPS.length - 1 ? (
                <button onClick={async () => { await save(false); setStep((s) => s + 1); }} disabled={saving}
                  className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-[13px] font-medium text-primary-foreground hover:bg-primary/90">
                  {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <>Save & continue <ArrowRight className="h-3.5 w-3.5" /></>}
                </button>
              ) : (
                <button onClick={() => save(true)} disabled={saving}
                  className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-[13px] font-medium text-primary-foreground hover:bg-primary/90">
                  {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <>Finish & open cabinet <ArrowRight className="h-3.5 w-3.5" /></>}
                </button>
              )}
            </div>
          </div>

          {/* Side: progress + verification */}
          <aside className="space-y-4">
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Profile completion</div>
              <div className="mt-2 flex items-baseline gap-2">
                <div className="num text-3xl font-semibold">{completion}</div>
                <div className="text-sm text-muted-foreground">%</div>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-surface-3">
                <div className="h-full bg-gradient-to-r from-primary to-primary-glow transition-all" style={{ width: `${completion}%` }} />
              </div>
              <ul className="mt-5 space-y-2.5 text-[12px]">
                {[
                  ["Personal info", !!f.full_name && !!f.phone],
                  ["Company info", !!f.company_name && !!f.company_description],
                  ["Role & region", !!f.city && !!f.country],
                  ["Documents", false],
                ].map(([l, ok]) => (
                  <li key={l as string} className="flex items-center gap-2">
                    <CheckCircle2 className={`h-3.5 w-3.5 ${ok ? "text-primary" : "text-muted-foreground/40"}`} />
                    <span className={ok ? "" : "text-muted-foreground"}>{l}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-primary" />
                <span className="font-mono text-[10px] uppercase tracking-wider text-primary">Verification</span>
              </div>
              <div className="mt-2 text-[13px]">Status: <span className="font-medium">Pending</span></div>
              <p className="mt-1.5 text-[12px] text-muted-foreground">
                Reviewers check identity, registration, insurance and licensing.
              </p>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

function Section({ title, desc, children }: { title: string; desc?: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-[18px] font-semibold tracking-tight">{title}</h2>
      {desc && <p className="mt-1 text-[13px] text-muted-foreground">{desc}</p>}
      <div className="mt-5 space-y-4">{children}</div>
    </div>
  );
}
function Grid2({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-4 sm:grid-cols-2">{children}</div>;
}
function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="mb-1.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      {children}
    </label>
  );
}
