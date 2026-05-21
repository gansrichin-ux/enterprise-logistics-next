import { createFileRoute, Link } from "@tanstack/react-router";
import { PublicNav, PublicFooter } from "@/components/jukbar/PublicNav";
import { RouteMap } from "@/components/jukbar/RouteMap";
import {
  ArrowRight,
  ShieldCheck,
  MapPin,
  Search,
  Truck,
  Package,
  Route as RouteIcon,
  FileText,
  Scale,
  MessageSquare,
  Umbrella,
  Gavel,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Jük Bar — поиск грузов, транспорта и управление перевозками" },
      {
        name: "description",
        content:
          "Jük Bar помогает грузовладельцам, перевозчикам, логистам, экспедиторам и юристам работать с перевозками в одном защищенном кабинете.",
      },
      { property: "og:title", content: "Jük Bar — Freight OS" },
      {
        property: "og:description",
        content:
          "Платформа для поиска груза и транспорта, тендеров, документов, страхования, юридической поддержки и коммуникаций.",
      },
    ],
  }),
  component: LandingPage,
});

const heroRoute = {
  pickup: { lat: 43.2389, lng: 76.8897, label: "Пункт отправки" },
  dropoff: { lat: 51.1694, lng: 71.4491, label: "Пункт назначения" },
};

const features = [
  {
    icon: Package,
    h: "Грузы",
    p: "Публикуйте заявки, собирайте отклики и ведите историю перевозок без разрозненных таблиц.",
  },
  {
    icon: Truck,
    h: "Транспорт",
    p: "Перевозчики управляют доступным транспортом, направлениями, документами и откликами на грузы.",
  },
  {
    icon: Search,
    h: "Поиск",
    p: "Грузовладельцы находят транспорт, перевозчики находят подходящие грузы, команды работают из одного кабинета.",
  },
  {
    icon: RouteIcon,
    h: "Маршруты",
    p: "Маршрутная карточка собирает точки, статусы, документы и коммуникации вокруг одной перевозки.",
  },
  {
    icon: FileText,
    h: "Документы",
    p: "Договоры, транспортные документы, счета и подтверждения хранятся рядом с заявкой.",
  },
  {
    icon: Umbrella,
    h: "Страхование",
    p: "Страховые запросы и подтверждения можно вести как часть операционного процесса.",
  },
  {
    icon: Gavel,
    h: "Юридическая поддержка",
    p: "Юристы получают отдельный поток заявок по договорам, претензиям и сопровождению сделок.",
  },
  {
    icon: MessageSquare,
    h: "Чаты и уведомления",
    p: "Команды видят важные события по заявкам и обсуждают детали в контексте перевозки.",
  },
];

const roles = [
  {
    h: "Грузовладельцы",
    p: "Размещают грузы, получают отклики, выбирают исполнителей и контролируют документы.",
    t: "Грузы · Тендеры · Документы",
  },
  {
    h: "Перевозчики",
    p: "Публикуют транспорт, находят грузы и управляют операционной работой по рейсам.",
    t: "Транспорт · Отклики · Кабинет",
  },
  {
    h: "Логисты и экспедиторы",
    p: "Собирают заявки, координируют участников и ведут перевозку от запроса до закрытия.",
    t: "Планирование · Маршруты · Коммуникации",
  },
  {
    h: "Юристы",
    p: "Подключаются к договорным, страховым и претензионным вопросам внутри платформы.",
    t: "Договоры · Претензии · Поддержка",
  },
];

const capabilityStrip = [
  { h: "Поиск груза", p: "Для перевозчиков и гибридных ролей." },
  { h: "Поиск транспорта", p: "Для грузовладельцев и логистов." },
  { h: "Тендеры", p: "Для сложных перевозок и конкурентных предложений." },
  { h: "Проверка компании", p: "Для безопасной работы с партнерами." },
];

function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <PublicNav />

      <section className="relative overflow-hidden">
        <div className="radial-emerald absolute inset-0" />
        <div className="grid-bg absolute inset-0 opacity-50" />
        <div className="relative mx-auto max-w-7xl px-5 pt-20 pb-24 lg:px-10 lg:pt-28 lg:pb-32">
          <div className="grid items-center gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1">
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-primary">
                  Казахстан · Международные перевозки
                </span>
              </div>
              <h1 className="mt-6 text-[44px] font-semibold leading-[1.02] tracking-tight md:text-[64px]">
                Платформа для <span className="text-gradient-emerald">поиска грузов и транспорта</span>.
              </h1>
              <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-muted-foreground md:text-base">
                Единое рабочее пространство для грузовладельцев, перевозчиков, логистов,
                экспедиторов и юристов. Поиск груза и транспорта, тендеры, документы,
                страхование, юридическая поддержка, чаты и уведомления в одном кабинете.
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <Link
                  to="/register"
                  className="group inline-flex h-12 items-center gap-2 rounded-md bg-primary px-5 text-[14px] font-medium text-primary-foreground hover:bg-primary/90"
                >
                  Начать работу
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
                <Link
                  to="/login"
                  className="inline-flex h-12 items-center gap-2 rounded-md border border-border bg-surface/60 px-5 text-[14px] font-medium hover:bg-surface-2"
                >
                  Войти
                </Link>
              </div>
              <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3">
                {["Кабинет компании", "Роли и доступы", "Документы и уведомления"].map((x) => (
                  <div key={x} className="flex items-center gap-2 text-[12px] text-muted-foreground">
                    <ShieldCheck className="h-3.5 w-3.5 text-primary" /> {x}
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="emerald-glow rounded-2xl border border-border bg-card p-2">
                <div className="rounded-xl border border-border bg-background/60 p-3">
                  <div className="flex items-center justify-between gap-3 px-1.5 pb-2">
                    <div>
                      <div className="font-mono text-[10px] uppercase tracking-wider text-primary">
                        Предпросмотр маршрута
                      </div>
                      <div className="text-[13px] font-medium">Планирование перевозки</div>
                    </div>
                    <span className="inline-flex items-center gap-1.5 rounded-md border border-primary/30 bg-primary/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-primary">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" /> Черновик
                    </span>
                  </div>
                  <RouteMap height={300} pickup={heroRoute.pickup} dropoff={heroRoute.dropoff} />
                  <div className="mt-3 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-3">
                    {[
                      { l: "Заявка", v: "Описание груза" },
                      { l: "Исполнитель", v: "Выбор партнера" },
                      { l: "Документы", v: "Контроль статуса" },
                    ].map((s) => (
                      <div key={s.l} className="bg-surface/50 p-3">
                        <div className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">{s.l}</div>
                        <div className="mt-1 text-[12px] font-medium">{s.v}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border/60 bg-surface/40">
        <div className="mx-auto grid max-w-7xl gap-px bg-border md:grid-cols-4 lg:px-0">
          {capabilityStrip.map((s) => (
            <div key={s.h} className="bg-background px-6 py-7">
              <div className="text-[15px] font-semibold tracking-tight">{s.h}</div>
              <div className="mt-1 text-[12px] leading-relaxed text-muted-foreground">{s.p}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="platform" className="mx-auto max-w-7xl px-5 py-24 lg:px-10">
        <div className="max-w-2xl">
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-primary">Платформа</div>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
            Рабочее пространство для перевозок без лишних таблиц.
          </h2>
          <p className="mt-3 text-[15px] text-muted-foreground">
            Команды работают с заявками, ролями, документами и коммуникациями в одном кабинете.
            Никаких показательных метрик без реальных данных.
          </p>
        </div>
        <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.h} className="group bg-card p-6 transition-colors hover:bg-surface-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-md border border-primary/20 bg-primary/10">
                  <Icon className="h-4.5 w-4.5 text-primary" />
                </div>
                <h3 className="mt-5 text-[15px] font-semibold">{f.h}</h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">{f.p}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section id="roles" className="border-t border-border/60 bg-surface/30">
        <div className="mx-auto max-w-7xl px-5 py-24 lg:px-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-primary">Роли</div>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
                Платформа для всех участников перевозки.
              </h2>
            </div>
            <p className="max-w-md text-[14px] text-muted-foreground">
              Поддерживаются отдельные и гибридные роли: перевозчик-экспедитор,
              грузовладелец-перевозчик, логист-перевозчик. Один аккаунт, один кабинет.
            </p>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {roles.map((r, i) => (
              <div key={r.h} className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/40">
                <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">0{i + 1}</div>
                <h3 className="mt-3 text-lg font-semibold">{r.h}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">{r.p}</p>
                <div className="mt-6 border-t border-border pt-4 font-mono text-[10px] uppercase tracking-wider text-primary">
                  {r.t}
                </div>
                <div className="pointer-events-none absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="operations" className="mx-auto max-w-7xl px-5 py-24 lg:px-10">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-primary">Рабочее пространство</div>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
              От заявки до закрывающих документов.
            </h2>
            <p className="mt-4 text-[15px] text-muted-foreground">
              Jük Bar собирает участников перевозки вокруг одного процесса: запрос, подбор
              транспорта, тендер, документы, страхование, юридическая поддержка и уведомления.
            </p>
            <ul className="mt-6 space-y-3.5">
              {[
                { h: "Поиск и подбор", p: "Заявки на груз и транспорт живут в одном интерфейсе." },
                { h: "Тендерный процесс", p: "Сложные перевозки можно вести через структурированные предложения." },
                { h: "Документальный контур", p: "Файлы и статусы привязаны к компании, заявке и перевозке." },
                { h: "Поддержка сделки", p: "Страховые и юридические запросы не выпадают из операционного потока." },
              ].map((x) => (
                <li key={x.h} className="flex gap-3">
                  <Scale className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <div>
                    <div className="text-[14px] font-medium">{x.h}</div>
                    <div className="text-[13px] text-muted-foreground">{x.p}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="emerald-glow rounded-2xl border border-border bg-card p-2">
            <RouteMap
              height={420}
              pickup={{ lat: 43.65, lng: 51.2, label: "Западный коридор" }}
              dropoff={{ lat: 49.8, lng: 73.1, label: "Центральный коридор" }}
            />
          </div>
        </div>
      </section>

      <section id="pricing" className="border-t border-border/60">
        <div className="mx-auto max-w-5xl px-5 py-24 text-center lg:px-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1">
            <MapPin className="h-3 w-3 text-primary" />
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-primary">
              Кабинет Jük Bar
            </span>
          </div>
          <h2 className="mt-6 text-3xl font-semibold tracking-tight md:text-5xl">
            Начните работу с перевозками в Jük Bar.
          </h2>
          <p className="mt-4 text-[15px] text-muted-foreground">
            Создайте аккаунт компании, выберите роль и продолжите настройку кабинета в следующих этапах миграции.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Link to="/register" className="inline-flex h-12 items-center gap-2 rounded-md bg-primary px-6 text-[14px] font-medium text-primary-foreground hover:bg-primary/90">
              Начать работу <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/login" className="inline-flex h-12 items-center gap-2 rounded-md border border-border bg-surface/60 px-6 text-[14px] font-medium hover:bg-surface-2">
              Войти в аккаунт
            </Link>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
