import type { ReactNode } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  Bell,
  Building2,
  LayoutDashboard,
  LayoutGrid,
  LogOut,
  MessageSquare,
  MoreHorizontal,
  PackageSearch,
  Search,
  Truck,
  UserCircle,
  X,
} from "lucide-react";
import { useState } from "react";
import { logout } from "@/lib/firebase/auth";
import { useAccountData } from "@/lib/firebase/useAccountData";
import { getInitials, getProfileRoleLabel } from "@/lib/firebase/profile";

const primaryNav = [
  { to: "/cabinet", label: "Кабинет", icon: LayoutDashboard },
  { to: "/active-cargos", label: "Грузы", icon: PackageSearch },
  { to: "/find-transport", label: "Транспорт", icon: Search },
  { to: "/carriers", label: "Перевозчики", icon: Truck },
  { to: "/workspace", label: "Рабочее пространство", icon: LayoutGrid },
  { to: "/notifications", label: "Уведомления", icon: Bell },
];

const accountNav = [
  { to: "/company", label: "Компания", icon: Building2 },
  { to: "/profile", label: "Профиль", icon: UserCircle },
];

const mobileNav = [
  { to: "/cabinet", label: "Кабинет", icon: LayoutDashboard },
  { to: "/active-cargos", label: "Грузы", icon: PackageSearch },
  { to: "/find-transport", label: "Транспорт", icon: Truck },
];

export function AppShell({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [moreOpen, setMoreOpen] = useState(false);
  const { data } = useAccountData({
    includeActivity: false,
    includeCounts: false,
    requireCompleteProfile: true,
  });

  const profile = data?.profile;
  const company = data?.company;
  const displayName = profile?.name || profile?.username || data?.user.email || "Профиль";
  const companyName = company?.name || company?.legalName || "Компания не заполнена";
  const roleLabel = getProfileRoleLabel(profile);
  const initials = getInitials(displayName);

  const isActive = (to: string) => path === to || path.startsWith(`${to}/`);

  async function handleLogout() {
    await logout();
    navigate({ to: "/" });
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[260px] flex-col border-r border-sidebar-border bg-sidebar md:flex">
        <div className="flex h-16 items-center border-b border-sidebar-border px-5">
          <Link to="/cabinet" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <span className="font-display text-[15px] font-semibold">J</span>
            </div>
            <div className="leading-tight">
              <div className="font-display text-[15px] font-semibold tracking-tight">Jük Bar</div>
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Freight OS</div>
            </div>
          </Link>
        </div>

        <nav className="flex-1 px-3 py-4">
          <div className="px-2 pb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Работа</div>
          <div className="space-y-0.5">
            {primaryNav.map((item) => (
              <SidebarLink key={item.to} item={item} active={isActive(item.to)} />
            ))}
          </div>

          <div className="px-2 pb-2 pt-6 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Аккаунт</div>
          <div className="space-y-0.5">
            {accountNav.map((item) => (
              <SidebarLink key={item.to} item={item} active={isActive(item.to)} />
            ))}
          </div>
        </nav>

        <div className="border-t border-sidebar-border px-5 py-4">
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Текущая компания</div>
          <div className="mt-1 truncate text-[13px] font-medium">{companyName}</div>
        </div>
      </aside>

      <div className="md:pl-[260px]">
        <header className="sticky top-0 z-30 hidden h-16 items-center gap-3 border-b border-border bg-background/85 px-6 backdrop-blur md:flex lg:px-8">
          <div className="min-w-0">
            <div className="text-[13px] font-medium">{companyName}</div>
            <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{roleLabel}</div>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <div className="hidden items-center gap-2 rounded-md border border-border bg-surface/70 px-3 py-1.5 lg:flex lg:w-[300px]">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                className="flex-1 bg-transparent text-[13px] outline-none placeholder:text-muted-foreground"
                placeholder="Поиск по разделам"
              />
            </div>
            <Link to="/notifications" className="relative rounded-md border border-border bg-surface/70 p-2 hover:bg-surface-2">
              <Bell className="h-4 w-4" />
            </Link>
            <Link to="/profile" className="ml-1 flex items-center gap-2 rounded-md border border-border bg-surface/70 py-1 pl-1 pr-3 hover:bg-surface-2">
              <div className="grid h-7 w-7 place-items-center rounded bg-gradient-to-br from-info/80 to-primary/60 text-[11px] font-semibold text-background">
                {initials}
              </div>
              <div className="max-w-[180px] leading-tight">
                <div className="truncate text-[12px]">{displayName}</div>
                <div className="truncate font-mono text-[10px] text-muted-foreground">{profile?.username || "username не указан"}</div>
              </div>
            </Link>
            <button onClick={handleLogout} className="rounded-md border border-border bg-surface/70 p-2 hover:bg-surface-2" title="Выйти">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </header>

        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-background/90 px-4 backdrop-blur md:hidden">
          <Link to="/cabinet" className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-md bg-primary text-primary-foreground">
              <span className="font-display text-[15px] font-semibold">J</span>
            </div>
            <div className="leading-tight">
              <div className="font-display text-[14px] font-semibold">Jük Bar</div>
              <div className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground">Кабинет</div>
            </div>
          </Link>
          <Link to="/profile" className="grid h-9 w-9 place-items-center rounded-md border border-border bg-surface/70 text-[11px] font-semibold">
            {initials}
          </Link>
        </header>

        <main className="px-4 pb-24 pt-5 md:px-6 md:pb-8 md:pt-8 lg:px-8">{children}</main>
      </div>

      {moreOpen && (
        <div className="fixed inset-0 z-40 bg-black/55 md:hidden" onClick={() => setMoreOpen(false)}>
          <div
            className="absolute inset-x-3 bottom-20 rounded-xl border border-border bg-card p-3 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-2 flex items-center justify-between px-1">
              <div className="text-[13px] font-medium">Ещё</div>
              <button onClick={() => setMoreOpen(false)} className="rounded-md p-2 text-muted-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="grid gap-1">
              {[...accountNav, { to: "/workspace", label: "Рабочее пространство", icon: LayoutGrid }, { to: "/notifications", label: "Уведомления", icon: Bell }].map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMoreOpen(false)}
                  className="flex min-h-11 items-center gap-3 rounded-md px-3 text-[13px] text-muted-foreground hover:bg-surface-2 hover:text-foreground"
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="flex min-h-11 items-center gap-3 rounded-md px-3 text-left text-[13px] text-muted-foreground hover:bg-surface-2 hover:text-foreground"
              >
                <LogOut className="h-4 w-4" />
                Выйти
              </button>
            </div>
          </div>
        </div>
      )}

      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 px-2 pb-2 pt-1 backdrop-blur md:hidden">
        <div className="grid grid-cols-5 gap-1">
          {mobileNav.map((item) => (
            <MobileLink key={item.to} item={item} active={isActive(item.to)} />
          ))}
          <button
            onClick={() => setMoreOpen(true)}
            className="flex min-h-11 flex-col items-center justify-center gap-0.5 rounded-md px-1 text-[10px] text-muted-foreground"
          >
            <MessageSquare className="h-4 w-4" />
            Чаты
          </button>
          <button
            onClick={() => setMoreOpen(true)}
            className="flex min-h-11 flex-col items-center justify-center gap-0.5 rounded-md px-1 text-[10px] text-muted-foreground"
          >
            <MoreHorizontal className="h-4 w-4" />
            Ещё
          </button>
        </div>
      </nav>
    </div>
  );
}

function SidebarLink({
  item,
  active,
}: {
  item: { to: string; label: string; icon: typeof LayoutDashboard };
  active: boolean;
}) {
  const Icon = item.icon;
  return (
    <Link
      to={item.to}
      className={`relative flex items-center gap-3 rounded-md px-2.5 py-2 text-[13px] transition-colors ${
        active
          ? "bg-sidebar-accent text-sidebar-accent-foreground"
          : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
      }`}
    >
      <Icon className={`h-4 w-4 ${active ? "text-primary" : "text-muted-foreground"}`} />
      <span className="flex-1 truncate">{item.label}</span>
      {active && <span className="absolute left-0 h-5 w-[2px] -translate-x-3 rounded-r bg-primary" />}
    </Link>
  );
}

function MobileLink({
  item,
  active,
}: {
  item: { to: string; label: string; icon: typeof LayoutDashboard };
  active: boolean;
}) {
  const Icon = item.icon;
  return (
    <Link
      to={item.to}
      className={`flex min-h-11 flex-col items-center justify-center gap-0.5 rounded-md px-1 text-[10px] ${
        active ? "bg-primary/10 text-primary" : "text-muted-foreground"
      }`}
    >
      <Icon className="h-4 w-4" />
      {item.label}
    </Link>
  );
}
