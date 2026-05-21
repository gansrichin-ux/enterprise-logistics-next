import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { AuthShell, Field } from "./login";
import {
  completeProfileWithRole,
  getAuthErrorMessage,
  logout,
  observeAuthState,
} from "@/lib/firebase/auth";
import { getDb } from "@/lib/firebase/firestore";
import { APP_ROLES, getRoleLabel } from "@/lib/roles";
import { ArrowRight, Loader2, LogOut } from "lucide-react";

export const Route = createFileRoute("/complete-profile")({
  head: () => ({ meta: [{ title: "Завершить профиль — Jük Bar" }] }),
  component: CompleteProfilePage,
});

const ROLES = APP_ROLES.map((role) => ({ value: role, label: getRoleLabel(role) }));

function CompleteProfilePage() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [existingRole, setExistingRole] = useState<string | null>(null);
  const [existingUsername, setExistingUsername] = useState("");
  const [form, setForm] = useState({
    fullName: "",
    username: "",
    role: "carrier",
  });

  const roleLocked = Boolean(existingRole);
  const roleHint = useMemo(() => {
    if (!roleLocked) return "Выберите роль для кабинета Jük Bar.";
    return "Роль уже сохранена в профиле. На этом шаге можно завершить имя и username.";
  }, [roleLocked]);

  useEffect(() => {
    return observeAuthState(async (user) => {
      if (!user) {
        navigate({ to: "/login" });
        return;
      }

      const snap = await getDoc(doc(getDb(), "users", user.uid));
      const data = snap.exists() ? snap.data() : null;

      if (data?.role && (data?.profileStatus !== "needs_role" || data?.onboardingCompleted)) {
        navigate({ to: "/cabinet" });
        return;
      }

      const savedUsername = typeof data?.username === "string" ? data.username : "";
      const savedRole = typeof data?.role === "string" ? data.role : "";
      setExistingRole(savedRole || null);
      setExistingUsername(savedUsername);
      setForm({
        fullName:
          (typeof data?.name === "string" && data.name) ||
          user.displayName ||
          "",
        username: savedUsername || user.email?.split("@")[0]?.replace(/[^a-zA-Z0-9_]+/g, "_") || "",
        role: savedRole || "carrier",
      });
      setChecking(false);
    });
  }, [navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await completeProfileWithRole({
        fullName: form.fullName,
        username: form.username,
        role: form.role,
      });
      navigate({ to: "/cabinet" });
    } catch (error) {
      setError(getAuthErrorMessage(error));
    } finally {
      setSaving(false);
    }
  }

  async function handleLogout() {
    await logout();
    navigate({ to: "/login" });
  }

  if (checking) {
    return (
      <AuthShell title="Проверяем профиль" subtitle="Проверяем аккаунт и данные профиля.">
        <div className="grid place-items-center py-8">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell title="Завершите профиль" subtitle="Выберите роль и username, чтобы открыть кабинет.">
      <form onSubmit={handleSubmit} className="space-y-3.5">
        <Field label="Имя">
          <input
            required
            value={form.fullName}
            onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
            className="auth-input"
            placeholder="Ваше имя"
          />
        </Field>
        <Field label="Username">
          <input
            required
            disabled={Boolean(existingUsername)}
            value={form.username}
            onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
            className="auth-input disabled:opacity-70"
            placeholder="company_user"
          />
        </Field>
        <Field label="Роль">
          <select
            value={form.role}
            disabled={roleLocked}
            onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
            className="auth-input disabled:opacity-70"
          >
            {ROLES.map((role) => (
              <option key={role.value} value={role.value}>{role.label}</option>
            ))}
          </select>
        </Field>
        <p className="text-[11px] leading-relaxed text-muted-foreground">{roleHint}</p>
        {error && <p className="text-[12px] text-destructive">{error}</p>}
        <button
          type="submit"
          disabled={saving}
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-primary text-[14px] font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Сохранить профиль <ArrowRight className="h-4 w-4" /></>}
        </button>
      </form>
      <button
        onClick={handleLogout}
        className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-md border border-border bg-surface/60 text-[13px] hover:bg-surface-2"
      >
        <LogOut className="h-3.5 w-3.5" /> Выйти
      </button>
    </AuthShell>
  );
}
