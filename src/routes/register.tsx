import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AuthShell, Field, Divider, GoogleIcon } from "./login";
import { getAuthErrorMessage, registerWithEmail, signInWithGoogle } from "@/lib/firebase/auth";
import { APP_ROLES, getRoleLabel } from "@/lib/roles";
import { Loader2, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/register")({
  head: () => ({ meta: [{ title: "Регистрация — Jük Bar" }] }),
  component: RegisterPage,
});

const ROLES = APP_ROLES.map((role) => ({ v: role, l: getRoleLabel(role) }));

function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    username: "",
    email: "",
    phone: "",
    companyName: "",
    role: "carrier",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const upd = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await registerWithEmail({
        email: form.email,
        password: form.password,
        fullName: form.fullName,
        username: form.username,
        role: form.role,
      });
      navigate({ to: "/cabinet" });
    } catch (error) {
      setError(getAuthErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setLoading(true);
    setError(null);
    try {
      const result = await signInWithGoogle();
      navigate({ to: result.needsOnboarding ? "/complete-profile" : "/cabinet" });
    } catch (error) {
      setError(getAuthErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell title="Создать аккаунт Jük Bar" subtitle="Выберите роль и создайте Firebase-профиль компании.">
      <form onSubmit={handleSubmit} className="space-y-3.5">
        <div className="grid gap-3.5 sm:grid-cols-2">
          <Field label="Имя">
            <input required value={form.fullName} onChange={upd("fullName")} className="auth-input" placeholder="Ваше имя" />
          </Field>
          <Field label="Телефон">
            <input required value={form.phone} onChange={upd("phone")} className="auth-input" placeholder="+7..." />
          </Field>
        </div>
        <Field label="Username">
          <input required value={form.username} onChange={upd("username")} className="auth-input" placeholder="company_user" />
        </Field>
        <Field label="Email">
          <input type="email" required value={form.email} onChange={upd("email")} className="auth-input" placeholder="name@company.kz" />
        </Field>
        <Field label="Компания">
          <input required value={form.companyName} onChange={upd("companyName")} className="auth-input" placeholder="Название компании" />
        </Field>
        <Field label="Роль">
          <select value={form.role} onChange={upd("role")} className="auth-input">
            {ROLES.map((r) => <option key={r.v} value={r.v}>{r.l}</option>)}
          </select>
        </Field>
        <Field label="Пароль">
          <input type="password" required minLength={8} value={form.password} onChange={upd("password")} className="auth-input" placeholder="Минимум 8 символов" />
        </Field>

        {error && <p className="text-[12px] text-destructive">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="mt-1 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-primary text-[14px] font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Создать аккаунт <ArrowRight className="h-4 w-4" /></>}
        </button>
      </form>

      <Divider />

      <button
        onClick={handleGoogle}
        disabled={loading}
        className="inline-flex h-11 w-full items-center justify-center gap-2.5 rounded-md border border-border bg-surface/60 text-[14px] font-medium hover:bg-surface-2 disabled:opacity-60"
      >
        <GoogleIcon /> Продолжить через Google
      </button>

      <p className="mt-6 text-center text-[13px] text-muted-foreground">
        Уже есть аккаунт? <Link to="/login" className="text-primary hover:underline">Войти</Link>
      </p>
      <p className="mt-3 text-center text-[10px] text-muted-foreground">
        Регистрация использует Firebase Auth и создает профиль пользователя в Firestore.
      </p>
    </AuthShell>
  );
}
