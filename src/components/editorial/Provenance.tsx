import Link from "next/link";
import type {
  AuditBatchSummary,
  EditorialReview,
  ProvenanceStatus,
} from "@/lib/types";
import { formatDate } from "@/lib/utils";

const STATUS_LABELS: Record<ProvenanceStatus, string> = {
  legacyImported: "Legacy record",
  auditVerified: "Audit verified",
  sourceLinked: "Sources linked",
  editoriallyVerified: "Editorially verified",
};

interface ProvenanceBadgeProps {
  status?: ProvenanceStatus;
}

export function ProvenanceBadge({
  status = "legacyImported",
}: ProvenanceBadgeProps) {
  return (
    <span
      className={`provenance-badge provenance-badge--${status}`}
      title={
        status === "legacyImported"
          ? "Imported from the audited timeline; claim-level sources are still being attached."
          : undefined
      }
    >
      {STATUS_LABELS[status]}
    </span>
  );
}

export function ProvenancePanel({
  status = "legacyImported",
  updatedAt,
  audits,
  review,
}: {
  status?: ProvenanceStatus;
  updatedAt?: string;
  audits?: AuditBatchSummary[] | null;
  review?: EditorialReview;
}) {
  const safeAudits = audits ?? [];

  return (
    <aside aria-label="Record provenance" className="provenance-panel">
      <div>
        <p className="section-kicker">Record status</p>
        <ProvenanceBadge status={status} />
      </div>
      <div className="provenance-panel__copy">
        <p>
          {status === "legacyImported"
            ? "This chronology is preserved from the audited legacy dataset. Claim-level citations and build grouping are added only after editorial review."
            : status === "auditVerified"
              ? "This record has been checked in a documented audit. Individual article claims may still be gaining direct citations."
              : status === "sourceLinked"
                ? "Material claims on this record are connected to source entries."
                : "This record is source-linked and has passed editorial review."}
        </p>
        <p>
          {updatedAt ? (
            <>
              Updated{" "}
              <time dateTime={updatedAt}>{formatDate(updatedAt)}</time>
              {" · "}
            </>
          ) : null}
          <Link href="/sources/">Read the sourcing policy</Link>
          {review?.status && review.status !== "approved"
            ? ` · Editorial state: ${review.status}`
            : ""}
        </p>
        {safeAudits.length > 0 ? (
          <ul>
            {safeAudits.map((audit) => (
              <li key={audit._id}>
                {audit.title}
                {audit.verifiedAt
                  ? ` · ${formatDate(audit.verifiedAt)}`
                  : ""}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </aside>
  );
}
