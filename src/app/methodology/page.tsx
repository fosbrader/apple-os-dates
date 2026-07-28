import Link from "next/link";
import {
  BulletList,
  ContentPage,
  ContentSection,
  Notice,
  OrderedSteps,
} from "@/components/content/ContentPage";
import { JsonLd, type JsonLdValue } from "@/components/seo/JsonLd";
import { absoluteUrl, createPageMetadata, siteName } from "@/lib/site";

const pageDescription =
  "Understand how Beta Cadence turns historical beta-cycle data into estimated public-release windows, confidence labels, and backtests.";

const internalLinkClass =
  "text-[var(--accent)] hover:text-[var(--accent-hover)] underline underline-offset-4";

export const metadata = createPageMetadata({
  title: "Forecast Methodology",
  description: pageDescription,
  path: "/methodology/",
});

export default function MethodologyPage() {
  const canonical = absoluteUrl("/methodology/");
  const structuredData: JsonLdValue = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "@id": `${canonical}#article`,
    url: canonical,
    headline: "Apple Release Forecast Methodology",
    description: pageDescription,
    inLanguage: "en-US",
    isPartOf: { "@id": `${absoluteUrl("/")}#website` },
    publisher: {
      "@type": "Organization",
      name: siteName,
      url: absoluteUrl("/"),
    },
    about: [
      "Apple operating-system beta cycles",
      "Release-date forecasting",
      "Historical release analysis",
    ],
  };

  return (
    <>
      <JsonLd id="methodology-structured-data" data={structuredData} />
      <ContentPage
        eyebrow="Forecast methodology"
        title="History suggests a range—not a promise"
        description="Forecasts summarize what happened after comparable milestones in earlier release cycles. They do not use private information, leaks, or an unpublished Apple schedule."
      >
        <Notice title="Read every forecast as an estimate" tone="warning">
          <p>
            Apple can add a beta, reissue a build, delay a rollout, or release
            sooner than its recent history suggests. The displayed window is a
            descriptive historical range, not a guarantee or an official date.
          </p>
        </Notice>

        <ContentSection title="What the forecast answers">
          <p>
            For an active operating-system release, the model asks: after this
            same kind of milestone in comparable completed cycles, how many
            days passed before the public release?
          </p>
          <p>
            The result includes a central estimate, a date window, the number
            of comparable cycles, and a confidence label. Once an actual public
            release is recorded, the historical fact replaces the forecast.
          </p>
        </ContentSection>

        <ContentSection title="Calculation, step by step">
          <OrderedSteps>
            <li>
              <strong className="text-[var(--text)]">
                Identify the current stage.
              </strong>{" "}
              The model anchors the active version on its latest recorded
              milestone, normalized to a comparable beta number or release
              candidate stage.
            </li>
            <li>
              <strong className="text-[var(--text)]">
                Find eligible completed cycles.
              </strong>{" "}
              Comparisons must be from the same platform, have a public-release
              date, and contain the same normalized milestone stage.
            </li>
            <li>
              <strong className="text-[var(--text)]">
                Prefer the same release position.
              </strong>{" "}
              A version such as a <span className="font-mono">.4</span> release
              is first compared with prior{" "}
              <span className="font-mono">.4</span> releases. When fewer than
              three exist, the model falls back to the same broad major, minor,
              or patch class.
            </li>
            <li>
              <strong className="text-[var(--text)]">
                Keep the sample relevant.
              </strong>{" "}
              At most the 12 most recent eligible completed cycles are used.
            </li>
            <li>
              <strong className="text-[var(--text)]">
                Measure time remaining.
              </strong>{" "}
              For each comparison, the model calculates the calendar days from
              the matching milestone to that version’s public release.
            </li>
            <li>
              <strong className="text-[var(--text)]">
                Summarize the distribution.
              </strong>{" "}
              The median observed duration produces the central estimated date.
              The 25th and 75th percentiles produce the displayed date window.
            </li>
          </OrderedSteps>
        </ContentSection>

        <ContentSection title="Why a median and a range">
          <p>
            A mean can be pulled toward one unusually long or short beta cycle.
            The median better describes the middle historical outcome for
            small, uneven samples. The percentile window shows where the middle
            half of observed comparison cycles fell.
          </p>
          <p>
            That middle-50% range is descriptive. It is not a statistically
            calibrated probability interval, and “inside the range” should not
            be read as a 50% promise about the next release.
          </p>
        </ContentSection>

        <ContentSection title="Estimating the next milestone">
          <p>
            When at least three comparable cycles contain a later dated
            milestone, the same cohort also estimates what may come next. For
            each historical cycle, the model finds the first distinct
            milestone after the matched current stage and measures the elapsed
            calendar days.
          </p>
          <p>
            The next-milestone date window uses the median and 25th–75th
            percentile of that eligible subset. The label shown—such as Beta 4,
            RC, or Public release—is the most frequent next label in the subset,
            with ties resolved consistently. Its agreement percentage and
            actual sample size are shown separately because some cycles in the
            broader public-release cohort may not have a usable next milestone.
          </p>
        </ContentSection>

        <ContentSection title="Sample size and confidence">
          <p>
            No date estimate is shown with fewer than three eligible historical
            observations. For estimates that qualify:
          </p>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="card">
              <p className="font-semibold text-[var(--milestone-public)]">
                High
              </p>
              <p className="text-sm mt-2">
                Exact release-position cohort, at least 6 observations, and an
                interquartile range of 21 days or less.
              </p>
            </div>
            <div className="card">
              <p className="font-semibold text-[var(--milestone-rc)]">
                Medium
              </p>
              <p className="text-sm mt-2">
                At least 4 observations and an interquartile range of 28 days or
                less.
              </p>
            </div>
            <div className="card">
              <p className="font-semibold text-[#ff6b60]">Low</p>
              <p className="text-sm mt-2">
                Any other estimate that still meets the three-observation
                minimum.
              </p>
            </div>
          </div>
          <p>
            Confidence describes the quantity, relevance, and spread of the
            historical sample. It does not measure Apple’s commitment to a
            date.
          </p>
        </ContentSection>

        <ContentSection title="Freshness safeguards">
          <p>
            A date window stops being presented as upcoming when the latest
            recorded milestone is more than 60 days old or when the historical
            upper-bound date has already passed. This avoids showing an
            obviously stale countdown as if the underlying cycle were current.
          </p>
          <p>
            The estimate can resume after a newer milestone is added to the
            dataset. Until then, the paused state is a signal to verify the
            record—not evidence that a release has been cancelled.
          </p>
        </ContentSection>

        <ContentSection title="Historical backtesting">
          <p>
            Backtests simulate what the model could have forecast using only
            releases that were already completed at that point. Later releases
            are not allowed into an earlier simulation, which avoids
            look-ahead bias.
          </p>
          <p>
            When at least three simulations are available, performance is
            summarized with:
          </p>
          <BulletList>
            <li>
              <strong className="text-[var(--text)]">
                Median absolute error:
              </strong>{" "}
              the typical number of days between the median forecast and the
              actual release.
            </li>
            <li>
              <strong className="text-[var(--text)]">
                Historical range coverage:
              </strong>{" "}
              the share of simulated releases whose actual date fell inside
              the forecast’s interquartile window.
            </li>
          </BulletList>
          <p>
            Backtest results describe past performance under this method. They
            do not guarantee future accuracy.
          </p>
        </ContentSection>

        <ContentSection title="Known limitations">
          <BulletList>
            <li>
              Apple controls its release schedule and can change it without
              notice.
            </li>
            <li>
              Small cohorts make percentiles and confidence labels less stable.
            </li>
            <li>
              Major events, holidays, coordinated platform launches, urgent
              fixes, and hardware schedules are not modeled directly.
            </li>
            <li>
              A matching beta number does not guarantee matching scope or
              quality across years.
            </li>
            <li>
              Missing, revised, or misclassified historical milestones can
              change the comparison set.
            </li>
            <li>
              Calendar-day estimates do not predict an exact release time or
              account for regional rollout differences.
            </li>
          </BulletList>
        </ContentSection>

        <ContentSection title="Responsible use">
          <p>
            Use the forecast for orientation, not as the sole basis for
            production deployments, security decisions, travel, purchasing, or
            contractual commitments. Test against the current Apple
            documentation and leave room for the schedule to move.
          </p>
          <p>
            Suspect a source or milestone is wrong? Review the{" "}
            <Link href="/sources/" className={internalLinkClass}>
              editorial policy
            </Link>{" "}
            and submit a{" "}
            <Link href="/contact/" className={internalLinkClass}>
              correction
            </Link>
            .
          </p>
        </ContentSection>
      </ContentPage>
    </>
  );
}
