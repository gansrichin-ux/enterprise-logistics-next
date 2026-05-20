import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { JukBarLogo } from "@/components/jukbar/Logo";
import { signInWithEmail, signInWithGoogle } from "@/lib/firebase/auth";
import { Loader2, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Login — Jük Bar" }] }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError(null);
    try {
      await signInWithEmail(email, password);
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
    <AuthShell title="Welcome back" subtitle="Sign in to your Jük Bar cabinet.">
      <form onSubmit={handleSubmit} className="space-y-3.5">
        <Field label="Work email">
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
            className="auth-input" placeholder="dispatch@yourcompany.eu" />
        </Field>
        <Field label="Password" right={<Link to="/forgot-password" className="text-[11px] text-primary hover:underline">Forgot?</Link>}>
          <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)}
            className="auth-input" placeholder="••••••••" />
        </Field>
        {error && <p className="text-[12px] text-destructive">{error}</p>}
        <button type="submit" disabled={loading}
          className="mt-2 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-primary text-[14px] font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-60">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Sign in <ArrowRight className="h-4 w-4" /></>}
        </button>
      </form>

      <Divider />

      <button onClick={handleGoogle} disabled={loading}
        className="inline-flex h-11 w-full items-center justify-center gap-2.5 rounded-md border border-border bg-surface/60 text-[14px] font-medium hover:bg-surface-2 disabled:opacity-60">
        <GoogleIcon /> Continue with Google
      </button>

      <p className="mt-7 text-center text-[13px] text-muted-foreground">
        New to Jük Bar? <Link to="/register" className="text-primary hover:underline">Create an account</Link>
      </p>
    </AuthShell>
  );
}

export function AuthShell({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="radial-emerald absolute inset-0" />
      <div className="grid-bg absolute inset-0 opacity-40" />
      <div className="relative mx-auto flex min-h-screen max-w-md flex-col px-5 py-10">
        <Link to="/" className="self-start"><JukBarLogo /></Link>
        <div className="my-auto">
          <div className="emerald-glow rounded-2xl border border-border bg-card/95 p-7 backdrop-blur md:p-9">
            <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
            {subtitle && <p className="mt-1.5 text-[13px] text-muted-foreground">{subtitle}</p>}
            <div className="mt-7">{children}</div>
          </div>
          <p className="mt-6 text-center font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            Protected by Jük Bar · Freight OS
          </p>
        </div>
      </div>
      <style>{`
        .auth-input {
          width: 100%; height: 42px; border-radius: 8px;
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          padding: 0 12px; font-size: 14px; color: var(--color-foreground);
          outline: none; transition: border .15s, box-shadow .15s;
        }
        .auth-input:focus { border-color: var(--color-primary); box-shadow: 0 0 0 3px oklch(0.74 0.18 158 / 0.18); }
        .auth-input::placeholder { color: var(--color-muted-foreground); }
      `}</style>
    </div>
  );
}

export function Field({ label, right, children }: { label: string; right?: React.ReactNode; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="mb-1.5 flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{label}</span>
        {right}
      </div>
      {children}
    </label>
  );
}

export function Divider() {
  return (
    <div className="my-5 flex items-center gap-3">
      <div className="h-px flex-1 bg-border" />
      <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">or</span>
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}

export function GoogleIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.46c-.28 1.5-1.13 2.78-2.41 3.63v3.02h3.89c2.28-2.1 3.55-5.2 3.55-8.89z"/>
      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.94-2.93l-3.89-3.02c-1.08.72-2.46 1.15-4.05 1.15-3.12 0-5.76-2.11-6.71-4.94H1.27v3.1C3.25 21.3 7.31 24 12 24z"/>
      <path fill="#FBBC05" d="M5.29 14.26c-.24-.72-.38-1.49-.38-2.26s.14-1.54.38-2.26V6.64H1.27C.46 8.26 0 10.08 0 12s.46 3.74 1.27 5.36l4.02-3.1z"/>
      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.81l3.45-3.45C17.95 1.17 15.24 0 12 0 7.31 0 3.25 2.7 1.27 6.64l4.02 3.1C6.24 6.86 8.88 4.75 12 4.75z"/>
    </svg>
  );
}
