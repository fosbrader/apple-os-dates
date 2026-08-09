import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd, type JsonLdValue } from "@/components/seo/JsonLd";
import {
  articleHasMeaningfulUpdate,
  defaultArticleByline,
  formatArticleTimestamp,
} from "@/lib/article";
import { getPublishedArticleSummaries } from "@/lib/articles";
import { absoluteUrl, siteName } from "@/lib/site";

const pageTitle = "Site News";
const pageDescription =
  "Announcements about Version Record, its source-backed release archive, methodology, and major project updates.";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: { canonical: absoluteUrl("/news/") },
  openGraph: {
    type: "website",
    title: `${pageTitle} | ${siteName}`,
    description: pageDescription,
    url: absoluteUrl("/news/"),
    siteName,
    locale: "en_US",
  },
};

export default async function NewsPage() {
  const articles = await getPublishedArticleSummaries();
  if (articles.length === 0) notFound();

  const canonical = absoluteUrl("/news/");
  const structuredData: JsonLdValue = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${canonical}#webpage`,
    url: canonical,
    name: `${siteName} ${pageTitle}`,
    description: pageDescription,
    inLanguage: "en-US",
    isPartOf: { "@id": `${absoluteUrl("/")}#website` },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: articles.map((article, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: absoluteUrl(`/news/${article.slug.current}/`),
        name: article.title,
      })),
    },
  };

  return (
    <>
      <JsonLd id="news-structured-data" data={structuredData} />
      <div className="content-page space-y-12">
        <header className="content-page__header animate-in">
          <div>
            <p className="section-kicker">From Version Record</p>
            <h1 className="text-display">Site news</h1>
          </div>
          <div className="content-page__description space-y-3">
            <p>{pageDescription}</p>
            <p className="text-sm text-[var(--text-tertiary)]">
              This is a focused project log, not a general technology-news
              feed.
            </p>
          </div>
        </header>

        <ol className="mx-auto grid w-full max-w-[68rem] gap-8">
          {articles.map((article) => {
            const href = `/news/${article.slug.current}/`;
            const byline = article.byline?.trim() || defaultArticleByline;
            const showUpdatedAt = articleHasMeaningfulUpdate(
              article.publishedAt,
              article.updatedAt,
            );

            return (
              <li key={article._id}>
                <article className="grid overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] md:grid-cols-[minmax(17rem,0.8fr)_minmax(0,1.2fr)]">
                  {article.image?.url ? (
                    <Link
                      aria-label={`Read ${article.title}`}
                      className="block border-b border-[var(--border)] md:border-b-0 md:border-r"
                      href={href}
                    >
                      <Image
                        alt={article.imageAlt || article.title}
                        className="h-full min-h-52 w-full object-cover"
                        height={
                          article.image.metadata?.dimensions?.height ?? 630
                        }
                        sizes="(max-width: 768px) 100vw, 40vw"
                        src={article.image.url}
                        width={
                          article.image.metadata?.dimensions?.width ?? 1200
                        }
                      />
                    </Link>
                  ) : null}
                  <div className="flex flex-col justify-between gap-8 p-6 sm:p-8">
                    <div className="space-y-4">
                      <p className="section-kicker">Project update</p>
                      <h2 className="font-serif text-3xl leading-tight tracking-[-0.025em] text-[var(--text-primary)]">
                        <Link className="hover:text-[var(--accent)]" href={href}>
                          {article.title}
                        </Link>
                      </h2>
                      <p className="leading-7 text-[var(--text-secondary)]">
                        {article.summary}
                      </p>
                    </div>
                    <div className="space-y-3">
                      <p className="font-mono text-xs uppercase tracking-[0.1em] text-[var(--text-tertiary)]">
                        By {byline} · Published{" "}
                        <time dateTime={article.publishedAt}>
                          {formatArticleTimestamp(article.publishedAt)}
                        </time>
                        {showUpdatedAt ? (
                          <>
                            {" · "}Updated{" "}
                            <time dateTime={article.updatedAt}>
                              {formatArticleTimestamp(article.updatedAt)}
                            </time>
                          </>
                        ) : null}
                      </p>
                      <Link className="text-link" href={href}>
                        Read the update →
                      </Link>
                    </div>
                  </div>
                </article>
              </li>
            );
          })}
        </ol>
      </div>
    </>
  );
}
