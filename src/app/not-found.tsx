import Link from "next/link";

export default function NotFound() {
  return (
    <section className="not-found">
      <div className="not-found__signal" aria-hidden="true">
        <span>404</span>
      </div>
      <div>
        <p className="section-kicker">Signal not found</p>
        <h1 className="text-heading">This release record is off the dial.</h1>
        <p>
          The platform or version may have moved, or it may not exist in the
          public index.
        </p>
        <div className="not-found__actions">
          <Link href="/" className="button button--primary">
            Return to overview
          </Link>
          <Link href="/timeline/" className="button button--secondary">
            Browse the timeline
          </Link>
        </div>
      </div>
    </section>
  );
}
