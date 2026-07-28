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
    <article className="max-w-4xl mx-auto">
      <header
        className="max-w-3xl mb-12 animate-in"
        style={{ "--delay": 0 } as React.CSSProperties}
      >
        <p className="text-label mb-3">{eyebrow}</p>
        <h1 className="text-display">{title}</h1>
        <div className="gradient-line max-w-40 mt-5 mb-5" />
        <p className="text-lg text-[var(--text-secondary)] leading-relaxed">
          {description}
        </p>
      </header>

      <div
        className="space-y-10 animate-in"
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
    <section id={id} className="scroll-mt-24">
      <h2 className="text-heading mb-4">{title}</h2>
      <div className="space-y-4 text-[var(--text-secondary)] leading-relaxed">
        {children}
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
      className="rounded-xl border p-5"
      style={{
        borderColor: style.border,
        background: style.background,
      }}
    >
      <h2 className="text-subheading mb-2">{title}</h2>
      <div className="space-y-3 text-sm text-[var(--text-secondary)] leading-relaxed">
        {children}
      </div>
    </aside>
  );
}

export function OrderedSteps({
  children,
}: {
  children: ReactNode;
}) {
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
