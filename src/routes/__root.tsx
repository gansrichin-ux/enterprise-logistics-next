import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  useNavigate,
  Link,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import appCss from "../styles.css?url";
import { AppShell } from "@/components/layout/AppShell";
import { observeAuthState } from "@/lib/firebase/auth";
import { getDb } from "@/lib/firebase/firestore";

const PUBLIC_PREFIXES = ["/login", "/register", "/forgot-password", "/complete-profile", "/onboarding", "/cabinet"];
const LANDING_PATH = "/";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">Ошибка 404</p>
        <h1 className="mt-3 text-3xl font-semibold">Страница не найдена</h1>
        <p className="mt-2 text-sm text-muted-foreground">Такого раздела нет в текущем прототипе.</p>
        <Link to="/" className="mt-6 inline-flex rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">На главную</Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  console.error(error);
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold">Что-то пошло не так</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
        <button
          onClick={() => { router.invalidate(); reset(); }}
          className="mt-6 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >Повторить</button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Jük Bar — поиск грузов, транспорта и управление перевозками" },
      { name: "description", content: "Jük Bar помогает грузовладельцам, перевозчикам, логистам, экспедиторам и юристам работать с перевозками в одном кабинете." },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "stylesheet", href: "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css", crossOrigin: "" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className="dark">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isPublic = pathname === LANDING_PATH || PUBLIC_PREFIXES.some((p) => pathname.startsWith(p));

  return (
    <QueryClientProvider client={queryClient}>
      {isPublic ? (
        <Outlet />
      ) : (
        <ProtectedAppShell>
          <Outlet />
        </ProtectedAppShell>
      )}
    </QueryClientProvider>
  );
}

function ProtectedAppShell({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    return observeAuthState(async (user) => {
      if (!user) {
        navigate({ to: "/login" });
        return;
      }

      try {
        const snap = await getDoc(doc(getDb(), "users", user.uid));
        const data = snap.exists() ? snap.data() : null;
        const needsRole = !data || !data.role || (data.profileStatus === "needs_role" && !data.onboardingCompleted);
        if (needsRole) {
          navigate({ to: "/complete-profile" });
          return;
        }
        setBlocked(false);
      } finally {
        setChecking(false);
      }
    });
  }, [navigate]);

  if (checking) {
    return (
      <div className="grid min-h-screen place-items-center bg-background text-[13px] text-muted-foreground">
        Проверяем сессию...
      </div>
    );
  }

  if (blocked) {
    return (
      <div className="grid min-h-screen place-items-center bg-background px-4 text-center">
        <div className="max-w-md">
          <p className="text-[15px] font-medium">Завершите профиль</p>
          <p className="mt-2 text-[13px] text-muted-foreground">
            Сессия активна, но роль или профиль еще не готовы для рабочего пространства.
          </p>
          <button
            onClick={async () => {
              navigate({ to: "/complete-profile" });
            }}
            className="mt-4 inline-flex rounded-md border border-border bg-surface/60 px-4 py-2 text-[13px] hover:bg-surface-2"
          >
            Завершить профиль
          </button>
        </div>
      </div>
    );
  }

  return <AppShell>{children}</AppShell>;
}
