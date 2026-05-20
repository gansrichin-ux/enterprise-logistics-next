import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { getAuthErrorMessage, sendPasswordResetLink } from "@/lib/firebase/auth";
import { AuthShell, Field } from "./login";
import { Loader2, ArrowRight, MailCheck } from "lucide-react";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({ meta: [{ title: "Сброс пароля — Jük Bar" }] }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await sendPasswordResetLink(email, window.location.origin + "/login");
      setSent(true);
    } catch (error) {
      setError(getAuthErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell title="Сброс пароля" subtitle="Firebase отправит письмо для восстановления доступа.">
      {sent ? (
        <div className="rounded-lg border border-primary/30 bg-primary/5 p-5 text-center">
          <MailCheck className="mx-auto h-8 w-8 text-primary" />
          <div className="mt-3 text-[14px] font-medium">Проверьте почту</div>
          <div className="mt-1 text-[12px] text-muted-foreground">
            Если аккаунт для {email} существует, ссылка для сброса уже отправлена.
          </div>
          <Link to="/login" className="mt-5 inline-flex text-[13px] text-primary hover:underline">
            Вернуться ко входу
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <Field label="Email">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="auth-input"
              placeholder="name@company.kz"
            />
          </Field>
          {error && <p className="text-[12px] text-destructive">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-primary text-[14px] font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Отправить ссылку <ArrowRight className="h-4 w-4" /></>}
          </button>
          <p className="mt-3 text-center text-[13px] text-muted-foreground">
            <Link to="/login" className="text-primary hover:underline">Вернуться ко входу</Link>
          </p>
        </form>
      )}
    </AuthShell>
  );
}
