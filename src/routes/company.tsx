import { createFileRoute, Link } from "@tanstack/react-router";
import { Building2, Loader2, Mail, MapPin, Phone, ShieldCheck } from "lucide-react";
import { Card, PageHeader } from "@/components/ui-kit/Primitives";
import { useAccountData } from "@/lib/firebase/useAccountData";
import { formatFirestoreDate } from "@/lib/firebase/profile";

export const Route = createFileRoute("/company")({
  head: () => ({ meta: [{ title: "Компания - Jük Bar" }] }),
  component: CompanyPage,
});

function CompanyPage() {
  const { loading, data, error } = useAccountData({
    includeActivity: false,
    includeCounts: false,
    requireCompleteProfile: true,
  });

  if (loading) return <PageLoading />;
  if (error || !data?.profile) {
    return <EmptyCompany title="Профиль не найден" text={error || "Не удалось загрузить пользователя из Firebase."} />;
  }

  const company = data.company;

  return (
    <div>
      <PageHeader
        eyebrow="Компания"
        title="Профиль компании"
        description="Страница показывает данные из companyProfiles. Если карточки компании нет, отображается пустое состояние."
        actions={
          <Link to="/profile" className="inline-flex h-9 items-center rounded-md border border-border bg-surface/60 px-3.5 text-[13px] hover:bg-surface-2">
            Открыть профиль
          </Link>
        }
      />

      {!company ? (
        <EmptyCompany
          title="Компания не заполнена"
          text="В companyProfiles не найден профиль компании для текущего пользователя."
        />
      ) : (
        <div className="grid gap-5 xl:grid-cols-[1fr_0.7fr]">
          <Card className="overflow-hidden">
            <div className="radial-emerald h-24" />
            <div className="-mt-8 px-6 pb-6">
              <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                <div className="flex items-end gap-4">
                  <div className="grid h-16 w-16 place-items-center rounded-2xl border-4 border-card bg-gradient-to-br from-primary to-primary-glow text-xl font-semibold text-primary-foreground">
                    <Building2 className="h-7 w-7" />
                  </div>
                  <div className="pb-1">
                    <h1 className="text-2xl font-semibold tracking-tight">{company.name || company.legalName || "Компания"}</h1>
                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-muted-foreground">
                      {company.city && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {[company.city, company.region, company.country].filter(Boolean).join(", ")}
                        </span>
                      )}
                      {company.bin && <span className="font-mono">{company.bin}</span>}
                    </div>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface/60 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  <ShieldCheck className="h-3 w-3" />
                  {company.status === "not_completed" ? "Не заполнена" : company.status}
                </span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Заполнение компании</div>
            <div className="mt-3 text-3xl font-semibold">{company.completenessPercent === null ? "Нет данных" : `${company.completenessPercent}%`}</div>
            {company.completenessPercent !== null && (
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-surface-3">
                <div className="h-full bg-gradient-to-r from-primary to-primary-glow" style={{ width: `${company.completenessPercent}%` }} />
              </div>
            )}
          </Card>

          <Card className="p-6 xl:col-span-2">
            <h2 className="text-[15px] font-semibold">Данные компании</h2>
            <div className="mt-5 grid grid-cols-1 gap-x-8 gap-y-4 md:grid-cols-2 xl:grid-cols-3">
              <Detail label="Название" value={company.name} />
              <Detail label="Юридическое название" value={company.legalName} />
              <Detail label="БИН / регистрационный номер" value={company.bin} />
              <Detail label="Страна" value={company.country} />
              <Detail label="Регион" value={company.region} />
              <Detail label="Город" value={company.city} />
              <Detail label="Адрес" value={company.address} />
              <Detail label="Создана" value={formatFirestoreDate(company.createdAt)} />
              <Detail label="Обновлена" value={formatFirestoreDate(company.updatedAt)} />
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-[15px] font-semibold">Контакты</h2>
            <div className="mt-5 space-y-3">
              <Contact icon={Mail} value={company.email} fallback="Email не заполнен" />
              <Contact icon={Phone} value={company.phone} fallback="Телефон не заполнен" />
              <Contact icon={Building2} value={company.website} fallback="Сайт не заполнен" />
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-[15px] font-semibold">Описание</h2>
            <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">
              {company.description || "Описание компании не заполнено."}
            </p>
          </Card>
        </div>
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

function Contact({ icon: Icon, value, fallback }: { icon: typeof Mail; value: string; fallback: string }) {
  return (
    <div className="flex items-center gap-2.5 text-[13px]">
      <Icon className="h-4 w-4 text-muted-foreground" />
      {value || <span className="text-muted-foreground">{fallback}</span>}
    </div>
  );
}

function EmptyCompany({ title, text }: { title: string; text: string }) {
  return (
    <Card className="p-7 text-center">
      <Building2 className="mx-auto h-8 w-8 text-primary" />
      <h1 className="mt-3 text-lg font-semibold">{title}</h1>
      <p className="mx-auto mt-2 max-w-md text-[13px] text-muted-foreground">{text}</p>
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
