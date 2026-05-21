import { createFileRoute, Link } from "@tanstack/react-router";
import { Activity, CheckCircle2, Clock, Inbox, Loader2 } from "lucide-react";
import { Card, PageHeader } from "@/components/ui-kit/Primitives";
import { useAccountData } from "@/lib/firebase/useAccountData";
import { formatFirestoreDate } from "@/lib/firebase/profile";

export const Route = createFileRoute("/workspace")({
  head: () => ({ meta: [{ title: "Рабочее пространство - Jük Bar" }] }),
  component: WorkspacePage,
});

const boardColumns = [
  { title: "Входящие", icon: Inbox },
  { title: "В работе", icon: Clock },
  { title: "Завершено", icon: CheckCircle2 },
];

function WorkspacePage() {
  const { loading, data, error } = useAccountData({
    includeActivity: true,
    includeCounts: false,
    requireCompleteProfile: true,
  });

  if (loading) return <PageLoading />;
  if (error || !data?.profile) {
    return <EmptyState title="Рабочее пространство недоступно" text={error || "Не удалось загрузить профиль пользователя."} />;
  }

  return (
    <div>
      <PageHeader
        eyebrow="Рабочее пространство"
        title="Операционная панель"
        description="Раздел показывает реальные события из Firebase. Если событий нет, отображается пустое состояние."
        actions={
          <Link to="/cabinet" className="inline-flex h-9 items-center rounded-md border border-border bg-surface/60 px-3.5 text-[13px] hover:bg-surface-2">
            Вернуться в кабинет
          </Link>
        }
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {boardColumns.map((column) => {
          const Icon = column.icon;
          return (
            <Card key={column.title} className="min-h-[220px] p-4">
              <div className="flex items-center gap-2">
                <div className="grid h-8 w-8 place-items-center rounded-md border border-border bg-surface/70">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <div className="text-[13px] font-semibold">{column.title}</div>
                  <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Нет задач</div>
                </div>
              </div>
              <div className="mt-5 rounded-lg border border-dashed border-border p-5 text-[13px] text-muted-foreground">
                Реальные задачи появятся здесь после создания рабочих процессов в Firebase.
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="mt-6 p-5">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-primary" />
          <div>
            <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">activityLogs</div>
            <div className="text-[15px] font-semibold">Последняя активность</div>
          </div>
        </div>

        {data.activityLogs.length ? (
          <div className="mt-5 space-y-3">
            {data.activityLogs.map((item) => (
              <div key={item.id} className="flex flex-col gap-1 border-b border-border pb-3 last:border-0 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="text-[13px] font-medium">{item.title}</div>
                  {item.description && <div className="mt-1 text-[12px] text-muted-foreground">{item.description}</div>}
                </div>
                <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  {formatFirestoreDate(item.createdAt)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-5 rounded-lg border border-dashed border-border p-5 text-[13px] text-muted-foreground">
            Активность пока не записана.
          </div>
        )}
      </Card>
    </div>
  );
}

function EmptyState({ title, text }: { title: string; text: string }) {
  return (
    <Card className="p-7 text-center">
      <h1 className="text-lg font-semibold">{title}</h1>
      <p className="mt-2 text-[13px] text-muted-foreground">{text}</p>
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
