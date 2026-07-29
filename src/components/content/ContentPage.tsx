import type { ReactNode } from "react";

interface ContentPageProps {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
}

interface ContentSectionProps {
  title: string;
  children: ReactNode;
  id?: string;
}

interface NoticeProps {
  title: string;
  children: ReactNode;
  tone?: "accent" | "neutral" | "warning";
}

const noticeStyles = {
  accent: {
    border: "var(--accent)",
    background: "var(--accent-muted)",
  },
  neutral: {
    border: "var(--border-hover)",
    background: "var(--bg-subtle)",
  },
  warning: {
    border: "var(--milestone-rc)",
    background: "rgba(255, 159, 10, 0.08)",
  },
};

export function ContentPage({
  eyebrow,
  title,
  description,
  children,
}: ContentPageProps) {
  return (
    <article className="content-page">
      <header
        className="content-page__header animate-in"
        style={{ "--delay": 0 } as React.CSSProperties}
      >
        <div>
          <p className="section-kicker">{eyebrow}</p>
          <h1 className="text-display">{title}</h1>
        </div>
        <p className="content-page__description">{description}</p>
      </header>

      <div
        className="content-page__body animate-in"
        style={{ "--delay": 1 } as React.CSSProperties}
      >
        {children}
      </div>
    </article>
  );
}

export function ContentSection({
  title,
  children,
  id,
}: ContentSectionProps) {
  return (
    <section id={id} className="content-section">
      <div>
        <h2>{title}</h2>
        <div className="content-section__body">{children}</div>
      </div>
    </section>
  );
}

export function Notice({
  title,
  children,
  tone = "neutral",
}: NoticeProps) {
  const style = noticeStyles[tone];

  return (
    <aside
      className="content-notice"
      style={
        {
          "--notice-border": style.border,
          "--notice-background": style.background,
        } as React.CSSProperties
      }
    >
      <h2>{title}</h2>
      <div className="content-notice__body">{children}</div>
    </aside>
  );
}

export function OrderedSteps({ children }: { children: ReactNode }) {
  return (
    <ol className="space-y-3 list-decimal pl-5 marker:text-[var(--accent)] marker:font-mono">
      {children}
    </ol>
  );
}

export function BulletList({ children }: { children: ReactNode }) {
  return (
    <ul className="space-y-2 list-disc pl-5 marker:text-[var(--accent)]">
      {children}
    </ul>
  );
}
