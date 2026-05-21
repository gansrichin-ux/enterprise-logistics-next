import { Link } from "@tanstack/react-router";
import { JukBarLogo } from "./Logo";

export function PublicNav() {
  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-10">
        <Link to="/" className="flex items-center gap-2.5">
          <JukBarLogo />
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          <a href="#platform" className="text-[13px] text-muted-foreground hover:text-foreground">Платформа</a>
          <a href="#roles" className="text-[13px] text-muted-foreground hover:text-foreground">Роли</a>
          <a href="#operations" className="text-[13px] text-muted-foreground hover:text-foreground">Процессы</a>
          <a href="#pricing" className="text-[13px] text-muted-foreground hover:text-foreground">Старт</a>
        </nav>
        <div className="flex items-center gap-2">
          <Link to="/login" className="hidden md:inline-flex h-9 items-center rounded-md px-3 text-[13px] text-muted-foreground hover:text-foreground">
            Войти
          </Link>
          <Link
            to="/register"
            className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-3.5 text-[13px] font-medium text-primary-foreground hover:bg-primary/90"
          >
            Начать работу
          </Link>
        </div>
      </div>
    </header>
  );
}

export function PublicFooter() {
  return (
    <footer className="border-t border-border/60 bg-background">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 lg:grid-cols-4 lg:px-10">
        <div>
          <JukBarLogo />
          <p className="mt-4 max-w-xs text-[13px] text-muted-foreground">
            Логистическая платформа для грузовладельцев, перевозчиков, логистов, экспедиторов и юристов.
          </p>
        </div>
        {[
          { h: "Платформа", l: ["Поиск груза", "Поиск транспорта", "Тендеры", "Кабинет компании"] },
          { h: "Процессы", l: ["Документы", "Страхование", "Юридическая поддержка", "Уведомления"] },
          { h: "Роли", l: ["Грузовладельцы", "Перевозчики", "Логисты", "Экспедиторы"] },
        ].map((c) => (
          <div key={c.h}>
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">{c.h}</div>
            <ul className="mt-4 space-y-2.5">
              {c.l.map((x) => (
                <li key={x}><a className="text-[13px] text-foreground/80 hover:text-primary" href="#">{x}</a></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border/60">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-5 py-5 text-[11px] text-muted-foreground lg:flex-row lg:px-10">
          <div className="font-mono uppercase tracking-wider">© {new Date().getFullYear()} Jük Bar · Логистическая платформа</div>
          <div className="font-mono uppercase tracking-wider">Казахстан · Международные перевозки</div>
        </div>
      </div>
    </footer>
  );
}
