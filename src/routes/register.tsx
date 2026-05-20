import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AuthShell, Field, Divider, GoogleIcon } from "./login";
import { registerWithEmail, signInWithGoogle } from "@/lib/firebase/auth";
import { APP_ROLES, getRoleLabel } from "@/lib/roles";
import { Loader2, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/register")({
  head: () => ({ meta: [{ title: "Create account — Jük Bar" }] }),
  component: RegisterPage,
});

const ROLES = APP_ROLES.map((role) => ({ v: role, l: getRoleLabel(role) }));

function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    full_name: "", username: "", email: "", phone: "", company_name: "", primary_role: "carrier", password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const upd = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError(null);
    try {
      await registerWithEmail({
      email: form.email,
      password: form.password,
        fullName: form.full_name,
        username: form.username,
        role: form.primary_role,
      });
      navigate({ to: "/cabinet" });
    } catch (error) {
      setError(error instanceof Error ? error.message : String(error));
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setLoading(true); setError(null);
    try {
      const result = await signInWithGoogle();
      navigate({ to: "/cabinet" });
      if (result.needsOnboarding) {
        return;
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : String(error));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell title="Create your company account" subtitle="Five minutes to onboard. Verification within 24h.">
      <form onSubmit={handleSubmit} className="space-y-3.5">
        <div className="grid gap-3.5 sm:grid-cols-2">
          <Field label="Full name">
            <input required value={form.full_name} onChange={upd("full_name")} className="auth-input" placeholder="Erik Vogel" />
          </Field>
          <Field label="Phone">
            <input required value={form.phone} onChange={upd("phone")} className="auth-input" placeholder="+49 40 1234567" />
          </Field>
        </div>
        <Field label="Username">
          <input required value={form.username} onChange={upd("username")} className="auth-input" placeholder="erik_vogel" />
        </Field>
        <Field label="Work email">
          <input type="email" required value={form.email} onChange={upd("email")} className="auth-input" placeholder="dispatch@yourcompany.eu" />
        </Field>
        <Field label="Company name">
          <input required value={form.company_name} onChange={upd("company_name")} className="auth-input" placeholder="Nordfracht GmbH" />
        </Field>
        <Field label="Role">
          <select value={form.primary_role} onChange={upd("primary_role")} className="auth-input">
            {ROLES.map((r) => <option key={r.v} value={r.v}>{r.l}</option>)}
          </select>
        </Field>
        <Field label="Password">
          <input type="password" required minLength={8} value={form.password} onChange={upd("password")} className="auth-input" placeholder="At least 8 characters" />
        </Field>

        {error && <p className="text-[12px] text-destructive">{error}</p>}
        <button type="submit" disabled={loading}
          className="mt-1 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-primary text-[14px] font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-60">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Create account <ArrowRight className="h-4 w-4" /></>}
        </button>
      </form>

      <Divider />

      <button onClick={handleGoogle} disabled={loading}
        className="inline-flex h-11 w-full items-center justify-center gap-2.5 rounded-md border border-border bg-surface/60 text-[14px] font-medium hover:bg-surface-2 disabled:opacity-60">
        <GoogleIcon /> Continue with Google
      </button>

      <p className="mt-6 text-center text-[13px] text-muted-foreground">
        Already have an account? <Link to="/login" className="text-primary hover:underline">Sign in</Link>
      </p>
      <p className="mt-3 text-center text-[10px] text-muted-foreground">
        By creating an account you agree to Jük Bar's Terms and Privacy Notice.
      </p>
    </AuthShell>
  );
}
