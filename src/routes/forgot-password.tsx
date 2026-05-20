import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { sendPasswordResetLink } from "@/lib/firebase/auth";
import { AuthShell, Field } from "./login";
import { Loader2, ArrowRight, MailCheck } from "lucide-react";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({ meta: [{ title: "Reset password — Jük Bar" }] }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError(null);
    try {
      await sendPasswordResetLink(email, window.location.origin + "/login");
      setSent(true);
    } catch (error) {
      setError(error instanceof Error ? error.message : String(error));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell title="Forgot your password?" subtitle="We'll email you a secure reset link.">
      {sent ? (
        <div className="rounded-lg border border-primary/30 bg-primary/5 p-5 text-center">
          <MailCheck className="mx-auto h-8 w-8 text-primary" />
          <div className="mt-3 text-[14px] font-medium">Check your inbox</div>
          <div className="mt-1 text-[12px] text-muted-foreground">
            If an account exists for {email}, a reset link is on its way.
          </div>
          <Link to="/login" className="mt-5 inline-flex text-[13px] text-primary hover:underline">
            Back to login
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <Field label="Work email">
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="auth-input" placeholder="dispatch@yourcompany.eu" />
          </Field>
          {error && <p className="text-[12px] text-destructive">{error}</p>}
          <button type="submit" disabled={loading}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-primary text-[14px] font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-60">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Send reset link <ArrowRight className="h-4 w-4" /></>}
          </button>
          <p className="mt-3 text-center text-[13px] text-muted-foreground">
            <Link to="/login" className="text-primary hover:underline">Back to login</Link>
          </p>
        </form>
      )}
    </AuthShell>
  );
}
