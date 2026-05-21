import { createFileRoute, Link } from "@tanstack/react-router";
import { Activity, Bell, Building2, FileText, Loader2, ShieldCheck, UserCircle } from "lucide-react";
import { Card, PageHeader } from "@/components/ui-kit/Primitives";
import { useAccountData } from "@/lib/firebase/useAccountData";
import {
  formatFirestoreDate,
  getInitials,
  getProfileRoleLabel,
  getProfileStatusLabel,
} from "@/lib/firebase/profile";

export const Route = createFileRoute("/cabinet")({
  head: () => ({ meta: [{ title: "Кабинет - Jük Bar" }] }),
  component: CabinetPage,
});

function CabinetPage() {
  const { loading, data, error } = useAccountData({
    includeActivity: true,
    includeCounts: true,
    requireCompleteProfile: true,
  });

  if (loading) return <PageLoading />;
  if (error || !data?.profile) {
    return <EmptyCard title="Профиль не найден" text={error || "Не удалось загрузить данные пользователя из Firebase."} />;
  }

  const { profile, company, activityLogs, counts } = data;
  const displayName = profile.name || profile.username || profile.email;
  const companyTitle = company?.name || company?.legalName || "Компания не заполнена";
  const metrics = [
    {
      icon: UserCircle,
      label: "Профиль",
      value: `${profile.profileCompletenessPercent}%`,
      detail: getProfileStatusLabel(profile.profileStatus),
    },
    {
      icon: Building2,
      label: "Компания",
      value: company ? "Заполнена" : "Не заполнена",
      detail: company ? companyTitle : "Профиль компании не найден",
    },
    {
      icon: FileText,
      label: "Документы",
      value: formatCount(counts.cargoDocuments),
      detail: counts.cargoDocuments === null ? "Нет доступных данных" : "cargoDocuments",
    },
    {
      icon: Bell,
      label: "Уведомления",
      value: formatCount(counts.siteNotifications),
      detail: counts.siteNotifications === null ? "Нет доступных данных" : "siteNotifications",
    },
  ];

  return (
    <div>
      <PageHeader
        eyebrow="Кабинет"
        title={`Здравствуйте, ${displayName || "пользователь"}`}
        description="Здесь отображаются данные вашего профиля и связанные записи из Firebase."
        actions={
          <>
            <Link to="/profile" className="inline-flex h-9 items-center rounded-md border border-border bg-surface/60 px-3.5 text-[13px] hover:bg-surface-2">
              Открыть профиль
            </Link>
            <Link to="/company" className="inline-flex h-9 items-center rounded-md bg-primary px-3.5 text-[13px] font-medium text-primary-foreground hover:bg-primary/90">
              Открыть компанию
            </Link>
          </>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.label} className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{item.label}</div>
                  <div className="mt-2 text-2xl font-semibold tracking-tight">{item.value}</div>
                  <div className="mt-1 text-[12px] text-muted-foreground">{item.detail}</div>
                </div>
                <div className="grid h-9 w-9 place-items-center rounded-md border border-border bg-surface/70">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="overflow-hidden">
          <div className="radial-emerald h-24" />
          <div className="-mt-10 px-6 pb-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex items-end gap-4">
                <div className="grid h-20 w-20 place-items-center rounded-2xl border-4 border-card bg-gradient-to-br from-primary to-primary-glow text-xl font-semibold text-primary-foreground emerald-glow">
                  {getInitials(displayName)}
                </div>
                <div className="pb-1">
                  <h2 className="text-xl font-semibold tracking-tight">{displayName || "Профиль не заполнен"}</h2>
                  <div className="mt-1 text-[13px] text-muted-foreground">{profile.email}</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-md border border-primary/30 bg-primary/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-primary">
                      {getProfileRoleLabel(profile)}
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface/60 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                      <ShieldCheck className="h-3 w-3" />
                      {getProfileStatusLabel(profile.profileStatus)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Компания</div>
          {company ? (
            <>
              <div className="mt-2 text-lg font-semibold">{companyTitle}</div>
              <div className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
                {company.description || "Описание компании пока не заполнено."}
              </div>
              <Link to="/company" className="mt-4 inline-flex text-[13px] text-primary hover:underline">
                Посмотреть карточку компании
              </Link>
            </>
          ) : (
            <div className="mt-5 rounded-lg border border-dashed border-border p-5 text-[13px] text-muted-foreground">
              Компания не заполнена. Карточка компании появится здесь после заполнения данных.
            </div>
          )}
        </Card>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
        <Card className="p-6">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-primary" />
            <h2 className="text-[15px] font-semibold">Активность</h2>
          </div>
          {activityLogs.length ? (
            <div className="mt-5 space-y-3">
              {activityLogs.map((item) => (
                <div key={item.id} className="border-b border-border pb-3 last:border-0 last:pb-0">
                  <div className="text-[13px] font-medium">{item.title}</div>
                  {item.description && <div className="mt-1 text-[12px] text-muted-foreground">{item.description}</div>}
                  <div className="mt-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{formatFirestoreDate(item.createdAt)}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-5 rounded-lg border border-dashed border-border p-5 text-[13px] text-muted-foreground">
              Активность пока не записана.
            </div>
          )}
        </Card>

        <Card className="map-bg min-h-[260px] p-6">
          <div className="max-w-lg">
            <div className="font-mono text-[10px] uppercase tracking-wider text-primary">Рабочая зона</div>
            <h2 className="mt-2 text-xl font-semibold">Перевозки пока не найдены</h2>
            <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
              Пока нет реальных грузов, маршруты и операционная сводка не отображаются.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}

function formatCount(value: number | null) {
  return value === null ? "Нет данных" : String(value);
}

function PageLoading() {
  return (
    <div className="grid min-h-[420px] place-items-center">
      <Loader2 className="h-6 w-6 animate-spin text-primary" />
    </div>
  );
}

function EmptyCard({ title, text }: { title: string; text: string }) {
  return (
    <Card className="p-7 text-center">
      <h1 className="text-lg font-semibold">{title}</h1>
      <p className="mt-2 text-[13px] text-muted-foreground">{text}</p>
      <Link to="/complete-profile" className="mt-5 inline-flex rounded-md bg-primary px-4 py-2 text-[13px] font-medium text-primary-foreground">
        Заполнить профиль
      </Link>
    </Card>
  );
}
