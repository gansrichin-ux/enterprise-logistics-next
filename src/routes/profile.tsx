import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Building2, CheckCircle2, FileText, Loader2, Mail, ShieldCheck, UserCircle } from "lucide-react";
import { Card, PageHeader } from "@/components/ui-kit/Primitives";
import { useAccountData } from "@/lib/firebase/useAccountData";
import {
  formatFirestoreDate,
  getInitials,
  getProfileRoleLabel,
  getProfileStatusLabel,
} from "@/lib/firebase/profile";
import { getRoleLabel } from "@/lib/roles";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Профиль - Jük Bar" }] }),
  component: ProfilePage,
});

const tabs = ["Обзор", "Роли", "Документы", "Безопасность"] as const;

function ProfilePage() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("Обзор");
  const { loading, data, error } = useAccountData({
    includeActivity: false,
    includeCounts: true,
    requireCompleteProfile: true,
  });

  if (loading) return <PageLoading />;
  if (error || !data?.profile) {
    return <EmptyProfile message={error || "Профиль пользователя не найден в Firebase."} />;
  }

  const { profile, company, counts } = data;
  const displayName = profile.name || profile.username || profile.email;

  return (
    <div>
      <PageHeader
        eyebrow="Профиль"
        title="Профиль пользователя"
        description="Данные берутся из users/{uid}. Если поле не заполнено, оно остается пустым."
      />

      <Card className="mb-5 overflow-hidden">
        <div className="grid-bg h-28 bg-gradient-to-br from-surface-3 via-surface-2 to-surface" />
        <div className="px-6 pb-6">
          <div className="-mt-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="flex items-end gap-4">
              <div className="grid h-20 w-20 place-items-center rounded-2xl border-2 border-background bg-gradient-to-br from-primary to-primary/40 font-display text-2xl font-semibold text-primary-foreground shadow-xl">
                {getInitials(displayName)}
              </div>
              <div className="pb-1">
                <h1 className="text-2xl font-semibold tracking-tight">{displayName || "Профиль не заполнен"}</h1>
                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    {profile.email || "Email не указан"}
                  </span>
                  {profile.username && <span className="font-mono">@{profile.username}</span>}
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Pill>{getProfileRoleLabel(profile)}</Pill>
                  <Pill muted>{getProfileStatusLabel(profile.profileStatus)}</Pill>
                </div>
              </div>
            </div>
            <Link to="/company" className="inline-flex h-9 items-center justify-center rounded-md border border-border bg-surface/60 px-3.5 text-[13px] hover:bg-surface-2">
              Открыть компанию
            </Link>
          </div>
        </div>
      </Card>

      <div className="mb-5 flex gap-1 overflow-x-auto border-b border-border">
        {tabs.map((item) => (
          <button
            key={item}
            onClick={() => setTab(item)}
            className={`relative min-h-11 whitespace-nowrap px-4 text-[13px] ${tab === item ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            {item}
            {tab === item && <span className="absolute inset-x-3 bottom-0 h-[2px] bg-primary" />}
          </button>
        ))}
      </div>

      {tab === "Обзор" && (
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
          <div className="space-y-5 xl:col-span-2">
            <Card className="p-5">
              <h2 className="text-[15px] font-semibold">Основные данные</h2>
              <div className="mt-5 grid grid-cols-1 gap-x-8 gap-y-4 md:grid-cols-2">
                <Detail label="Имя" value={profile.name} />
                <Detail label="Email" value={profile.email} />
                <Detail label="Username" value={profile.username ? `@${profile.username}` : ""} />
                <Detail label="Язык" value={profile.preferredLanguage === "ru" ? "Русский" : profile.preferredLanguage} />
                <Detail label="Статус" value={getProfileStatusLabel(profile.profileStatus)} />
                <Detail label="Создан" value={formatFirestoreDate(profile.createdAt)} />
              </div>
            </Card>

            <Card className="p-5">
              <h2 className="text-[15px] font-semibold">Компания</h2>
              {company ? (
                <div className="mt-5 grid grid-cols-1 gap-x-8 gap-y-4 md:grid-cols-2">
                  <Detail label="Название" value={company.name || company.legalName} />
                  <Detail label="Город" value={company.city} />
                  <Detail label="Страна" value={company.country} />
                  <Detail label="Статус" value={company.status === "not_completed" ? "Не заполнена" : company.status} />
                </div>
              ) : (
                <EmptyLine text="Компания не заполнена." />
              )}
            </Card>
          </div>

          <div className="space-y-5">
            <Card className="p-5">
              <div className="flex items-center gap-2">
                <UserCircle className="h-4 w-4 text-primary" />
                <h2 className="text-[15px] font-semibold">Заполнение профиля</h2>
              </div>
              <div className="mt-4 text-3xl font-semibold">{profile.profileCompletenessPercent}%</div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-surface-3">
                <div className="h-full bg-gradient-to-r from-primary to-primary-glow" style={{ width: `${profile.profileCompletenessPercent}%` }} />
              </div>
              <p className="mt-3 text-[12px] text-muted-foreground">
                {profile.profileCompletenessPercent > 0 ? "Используется значение из users/{uid}." : "Профиль не заполнен."}
              </p>
            </Card>

            <Card className="p-5">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                <h2 className="text-[15px] font-semibold">Документы</h2>
              </div>
              <div className="mt-4 text-2xl font-semibold">{counts.cargoDocuments === null ? "Нет данных" : counts.cargoDocuments}</div>
              <p className="mt-2 text-[12px] text-muted-foreground">Данные читаются из cargoDocuments.</p>
            </Card>
          </div>
        </div>
      )}

      {tab === "Роли" && (
        <Card className="p-5">
          <h2 className="text-[15px] font-semibold">Доступные роли</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {(profile.roles.length ? profile.roles : profile.role ? [profile.role] : []).map((role) => (
              <div key={role} className="rounded-lg border border-border bg-surface/30 px-4 py-3">
                <div className="text-[13px] font-medium">{getRoleLabel(role)}</div>
                <div className="mt-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{role}</div>
              </div>
            ))}
            {!profile.role && <EmptyLine text="Роль не выбрана." />}
          </div>
        </Card>
      )}

      {tab === "Документы" && (
        <Card className="p-5">
          <h2 className="text-[15px] font-semibold">Документы</h2>
          <EmptyLine text="Документы не найдены." />
        </Card>
      )}

      {tab === "Безопасность" && (
        <Card className="p-5">
          <h2 className="text-[15px] font-semibold">Безопасность</h2>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            <SecurityRow icon={ShieldCheck} label="Код email" enabled={profile.emailCodeVerified} />
            <SecurityRow icon={CheckCircle2} label="Проверка email пропущена" enabled={profile.emailVerificationSkipped} />
          </div>
        </Card>
      )}
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string | number | null | undefined }) {
  return (
    <div>
      <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1 text-[13px]">{value || <span className="text-muted-foreground">Не заполнено</span>}</div>
    </div>
  );
}

function Pill({ children, muted = false }: { children: React.ReactNode; muted?: boolean }) {
  return (
    <span className={`inline-flex rounded-md border px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider ${
      muted ? "border-border bg-surface/60 text-muted-foreground" : "border-primary/30 bg-primary/10 text-primary"
    }`}>
      {children}
    </span>
  );
}

function SecurityRow({ icon: Icon, label, enabled }: { icon: typeof ShieldCheck; label: string; enabled: boolean }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border bg-surface/30 px-4 py-3 text-[13px]">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-primary" />
        {label}
      </div>
      <span className={`font-mono text-[10px] uppercase tracking-wider ${enabled ? "text-success" : "text-muted-foreground"}`}>
        {enabled ? "Да" : "Нет"}
      </span>
    </div>
  );
}

function EmptyLine({ text }: { text: string }) {
  return <div className="mt-4 rounded-lg border border-dashed border-border p-5 text-[13px] text-muted-foreground">{text}</div>;
}

function EmptyProfile({ message }: { message: string }) {
  return (
    <Card className="p-7 text-center">
      <h1 className="text-lg font-semibold">Профиль не заполнен</h1>
      <p className="mt-2 text-[13px] text-muted-foreground">{message}</p>
      <Link to="/complete-profile" className="mt-5 inline-flex rounded-md bg-primary px-4 py-2 text-[13px] font-medium text-primary-foreground">
        Заполнить профиль
      </Link>
    </Card>
  );
}

function PageLoading() {
  return (
    <div className="grid min-h-[420px] place-items-center">
      <Loader2 className="h-6 w-6 animate-spin text-primary" />
    </div>
  );
}
