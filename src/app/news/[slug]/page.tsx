import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PortableArticle } from "@/components/editorial/PortableArticle";
import { JsonLd, type JsonLdValue } from "@/components/seo/JsonLd";
import {
  articleHasMeaningfulUpdate,
  defaultArticleByline,
  formatArticleTimestamp,
} from "@/lib/article";
import {
  absoluteUrl,
  siteName,
  siteXHandle,
} from "@/lib/site";
import type {
  CitationRecord,
  PortableTextBlock,
  SlugValue,
} from "@/lib/types";
import { client } from "@/sanity/client";

export const revalidate = 60;

interface ArticleDocument {
  _id: string;
  title: string;
  slug: SlugValue;
  summary: string;
  byline?: string;
  publishedAt?: string;
  updatedAt?: string;
  body: PortableTextBlock[];
  citations?: CitationRecord[];
  seo?: {
    title?: string;
    description?: string;
    noIndex?: boolean;
    image?: {
      asset?: {
        url?: string;
        metadata?: {
          dimensions?: {
            width?: number;
            height?: number;
          };
        };
      };
    };
  };
}

interface ArticleResult {
  page: ArticleDocument;
  isDraftPreview: boolean;
}

const articleProjection = `{
  _id,
  title,
  slug,
  summary,
  byline,
  publishedAt,
  updatedAt,
  body[]{
    ...,
    asset->{
      _id,
      url,
      metadata{dimensions}
    },
    markDefs[]{
      ...,
      source->{
        _id,
        title,
        publisher,
        author,
        canonicalUrl,
        publishedAt,
        accessedAt,
        archiveUrl,
        sourceClass
      }
    },
    sourceCitation{
      ...,
      source->{
        _id,
        title,
        publisher,
        author,
        canonicalUrl,
        publishedAt,
        accessedAt,
        archiveUrl,
        sourceClass
      }
    }
  },
  citations[]{
    ...,
    source->{
      _id,
      title,
      publisher,
      author,
      canonicalUrl,
      publishedAt,
      accessedAt,
      archiveUrl,
      sourceClass
    }
  },
  seo{
    title,
    description,
    noIndex,
    image{
      asset->{
        _id,
        url,
        metadata{dimensions}
      }
    }
  }
}`;

const draftArticleQuery = `*[
  _type == "sitePage" &&
  _id in path("drafts.**") &&
  pageKind == "article" &&
  slug.current == $slug
][0]${articleProjection}`;

const publishedArticleQuery = `*[
  _type == "sitePage" &&
  !(_id in path("drafts.**")) &&
  pageKind == "article" &&
  slug.current == $slug &&
  editorialReview.status == "approved" &&
  defined(publishedAt) &&
  defined(updatedAt)
][0]${articleProjection}`;

async function getArticle(slug: string): Promise<ArticleResult | null> {
  const previewToken = process.env.SANITY_API_TOKEN?.trim();
  const canPreviewDraft =
    process.env.NODE_ENV !== "production" && Boolean(previewToken);

  if (canPreviewDraft && previewToken) {
    const draft = await client
      .withConfig({
        token: previewToken,
        useCdn: false,
        perspective: "raw",
      })
      .fetch<ArticleDocument | null>(
        draftArticleQuery,
        { slug },
        { cache: "no-store" },
      );

    if (draft) return { page: draft, isDraftPreview: true };
  }

  const page = await client.fetch<ArticleDocument | null>(
    publishedArticleQuery,
    { slug },
    { next: { revalidate } },
  );

  return page ? { page, isDraftPreview: false } : null;
}

function articlePath(slug: string): string {
  return `/news/${slug}/`;
}

function articleByline(page: ArticleDocument): string {
  return page.byline?.trim() || defaultArticleByline;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const result = await getArticle(slug);
  if (!result) return {};

  const { page, isDraftPreview } = result;
  const canonical = absoluteUrl(articlePath(slug));
  const description = page.seo?.description ?? page.summary;
  const socialImage = page.seo?.image?.asset;
  const byline = articleByline(page);
  const shouldIndex = !isDraftPreview && page.seo?.noIndex !== true;

  return {
    title: page.seo?.title ?? page.title,
    description,
    authors: [{ name: byline, url: absoluteUrl("/") }],
    alternates: { canonical },
    robots: { index: shouldIndex, follow: shouldIndex },
    openGraph: {
      type: "article",
      title: page.title,
      description,
      url: canonical,
      siteName,
      locale: "en_US",
      publishedTime: page.publishedAt,
      modifiedTime: page.updatedAt ?? page.publishedAt,
      authors: [absoluteUrl("/")],
      images: socialImage?.url
        ? [
            {
              url: socialImage.url,
              width: socialImage.metadata?.dimensions?.width ?? 1200,
              height: socialImage.metadata?.dimensions?.height ?? 630,
              type: "image/png",
              alt: "Version Record launch article graphic",
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      site: siteXHandle,
      title: page.title,
      description,
      images: socialImage?.url
        ? [
            {
              url: socialImage.url,
              alt: "Version Record launch article graphic",
            },
          ]
        : undefined,
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const result = await getArticle(slug);
  if (!result) notFound();

  const { page, isDraftPreview } = result;
  const canonical = absoluteUrl(articlePath(slug));
  const byline = articleByline(page);
  const [hero, ...articleBody] = page.body;
  const hasHero =
    hero?._type === "editorialImage" &&
    Boolean(hero.asset?.url) &&
    Boolean(hero.alt);
  const blocks = hasHero ? articleBody : page.body;
  const heroWidth = hero?.asset?.metadata?.dimensions?.width ?? 1200;
  const heroHeight = hero?.asset?.metadata?.dimensions?.height ?? 630;
  const showUpdatedAt =
    page.publishedAt &&
    page.updatedAt &&
    articleHasMeaningfulUpdate(page.publishedAt, page.updatedAt);
  const socialImageUrl = page.seo?.image?.asset?.url ?? hero?.asset?.url;
  const structuredData: JsonLdValue = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${canonical}#article`,
    url: canonical,
    headline: page.title,
    description: page.seo?.description ?? page.summary,
    ...(page.publishedAt ? { datePublished: page.publishedAt } : {}),
    ...(page.updatedAt ? { dateModified: page.updatedAt } : {}),
    author: {
      "@type": "Organization",
      name: byline,
      url: absoluteUrl("/"),
    },
    publisher: {
      "@type": "Organization",
      name: siteName,
      url: absoluteUrl("/"),
    },
    ...(socialImageUrl ? { image: [socialImageUrl] } : {}),
    mainEntityOfPage: canonical,
    isPartOf: { "@id": `${absoluteUrl("/")}#website` },
    inLanguage: "en-US",
  };

  return (
    <>
      <JsonLd id="article-structured-data" data={structuredData} />
      <article className="content-page space-y-12">
        {isDraftPreview ? (
          <aside className="content-notice" aria-label="Preview status">
            <h2>Unpublished Sanity preview</h2>
            <div className="content-notice__body">
              <p>
                This page is rendering the current draft directly from Sanity.
                It is set to noindex and has not been published.
              </p>
            </div>
          </aside>
        ) : null}

        <header className="content-page__header animate-in">
          <div>
            <p className="section-kicker">Version Record launch</p>
            <h1 className="text-display">{page.title}</h1>
          </div>
          <div className="content-page__description space-y-4">
            <p>{page.summary}</p>
            <p className="font-mono text-xs uppercase tracking-[0.12em] text-[var(--text-secondary)]">
              <span>By {byline}</span>
              {page.publishedAt ? (
                <>
                  {" · "}
                  <time dateTime={page.publishedAt}>
                    Published {formatArticleTimestamp(page.publishedAt)}
                  </time>
                </>
              ) : (
                <> · Publication time pending</>
              )}
              {showUpdatedAt && page.updatedAt ? (
                <>
                  {" · "}
                  <time dateTime={page.updatedAt}>
                    Updated {formatArticleTimestamp(page.updatedAt)}
                  </time>
                </>
              ) : null}
            </p>
            <p className="section-kicker">
              Independent · Source-backed · Public to browse
            </p>
          </div>
        </header>

        {hasHero && hero.asset?.url && hero.alt ? (
          <figure className="article-figure mx-auto w-full max-w-[62rem] animate-in">
            <Image
              alt={hero.alt}
              height={heroHeight}
              priority
              sizes="(max-width: 1050px) 100vw, 992px"
              src={hero.asset.url}
              width={heroWidth}
            />
            {hero.caption ? (
              <figcaption>
                {hero.caption} · Image: {hero.rightsHolder ?? siteName}
              </figcaption>
            ) : null}
          </figure>
        ) : null}

        <div className="mx-auto w-full max-w-[48rem] animate-in">
          <PortableArticle
            blocks={blocks}
            citations={page.citations}
            referenceDescription="Sources are linked to the claims they support."
            referenceKicker="Article sources"
          />
        </div>

        <footer className="mx-auto w-full max-w-[48rem] border-t border-[var(--border)] pt-8 text-sm text-[var(--text-secondary)]">
          <p>
            Ready to explore? Visit the <Link href="/timeline/">release timeline</Link>
            {" · "}
            <Link href="/sources/">sources and editorial policy</Link>
            {" · "}
            <Link href="/submit/">submit a correction</Link>
          </p>
        </footer>
      </article>
    </>
  );
}
