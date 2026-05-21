import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { JukBarLogo } from "@/components/jukbar/Logo";
import { observeAuthState } from "@/lib/firebase/auth";
import { getDb } from "@/lib/firebase/firestore";
import { ArrowRight, Loader2, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/onboarding")({
  head: () => ({ meta: [{ title: "Настройка профиля — Jük Bar" }] }),
  component: OnboardingPage,
});

function OnboardingPage() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    return observeAuthState(async (user) => {
      if (!user) {
        navigate({ to: "/login" });
        return;
      }

      const snap = await getDoc(doc(getDb(), "users", user.uid));
      const data = snap.exists() ? snap.data() : null;
      if (!data?.role || (data.profileStatus === "needs_role" && !data.onboardingCompleted)) {
        navigate({ to: "/complete-profile" });
        return;
      }

      setChecking(false);
    });
  }, [navigate]);

  if (checking) {
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
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-5 lg:px-8">
          <Link to="/"><JukBarLogo /></Link>
          <Link to="/cabinet" className="text-[12px] text-muted-foreground hover:text-foreground">В кабинет</Link>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-5xl px-5 py-16 lg:px-8">
        <div className="max-w-2xl rounded-2xl border border-border bg-card p-7 md:p-9">
          <div className="flex h-11 w-11 items-center justify-center rounded-md border border-primary/20 bg-primary/10">
            <ShieldCheck className="h-5 w-5 text-primary" />
          </div>
          <div className="mt-6 font-mono text-[10px] uppercase tracking-[0.22em] text-primary">Настройка профиля</div>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">Профиль компании будет расширен позже.</h1>
          <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
            Сейчас для доступа к кабинету нужен только минимальный профиль: имя,
            username и роль. Полная анкета компании будет подключена отдельным этапом.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              to="/complete-profile"
              className="inline-flex h-11 items-center gap-2 rounded-md bg-primary px-4 text-[13px] font-medium text-primary-foreground hover:bg-primary/90"
            >
              Проверить профиль <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/cabinet"
              className="inline-flex h-11 items-center rounded-md border border-border bg-surface/60 px-4 text-[13px] hover:bg-surface-2"
            >
              Открыть кабинет
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
