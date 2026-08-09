import assert from "node:assert/strict";
import test from "node:test";
import type { ObjectDefinition, SchemaTypeDefinition } from "sanity";
import { releaseEvent } from "../src/sanity/schemas/releaseEvent";
import { releaseVersion } from "../src/sanity/schemas/releaseVersion";
import {
  validateChronologyCoverage,
  validateStatusEffectiveDate,
  type ChronologyCoverageValue,
} from "../src/sanity/schemas/schemaValidation";

interface FieldShape {
  name: string;
  type: string;
  validation?: unknown;
  fields?: FieldShape[];
  readOnly?: unknown;
}

function fieldsFor(schema: SchemaTypeDefinition): FieldShape[] {
  return ((schema as ObjectDefinition).fields ?? []) as FieldShape[];
}

test("release events record an optional first-observed timestamp", () => {
  const field = fieldsFor(releaseEvent).find(
    (candidate) => candidate.name === "firstObservedAt"
  );

  assert.equal(field?.type, "datetime");
  assert.equal(field?.validation, undefined);
  assert.equal(typeof field?.readOnly, "function");

  const initialValue = releaseEvent.initialValue;
  assert.equal(typeof initialValue, "function");
  const value = (initialValue as () => Record<string, unknown>)();
  assert.match(String(value.firstObservedAt), /^\d{4}-\d{2}-\d{2}T/);
});

test("release versions expose optional status and coverage metadata", () => {
  const fields = fieldsFor(releaseVersion);
  const statusEffectiveDate = fields.find(
    (candidate) => candidate.name === "statusEffectiveDate"
  );
  const chronologyCoverage = fields.find(
    (candidate) => candidate.name === "chronologyCoverage"
  );

  assert.equal(statusEffectiveDate?.type, "date");
  assert.equal(chronologyCoverage?.type, "object");
  assert.deepEqual(
    chronologyCoverage?.fields?.map((field) => field.name),
    [
      "status",
      "auditedChannels",
      "coverageThrough",
      "knownGapNote",
      "verifiedAt",
      "auditBatch",
    ]
  );
  assert.deepEqual(
    (releaseVersion.initialValue as Record<string, unknown>)
      .chronologyCoverage,
    { status: "unknown" }
  );
});

function validationContext(document: Record<string, unknown> = {}) {
  return {
    document,
    getClient: () => ({
      fetch: async () => ({
        status: "complete",
        editorialStatus: "approved",
        verifiedAt: "2026-08-09T16:00:00Z",
      }),
    }),
  } as never;
}

test("status effective dates follow lifecycle evidence", () => {
  assert.match(
    String(
      validateStatusEffectiveDate(
        "2026-08-09",
        validationContext({ releaseStatus: "active" })
      )
    ),
    /Active versions/
  );
  assert.match(
    String(
      validateStatusEffectiveDate(
        "2026-08-08",
        validationContext({ publicReleaseDate: "2026-08-09" })
      )
    ),
    /must match/
  );
  assert.equal(
    validateStatusEffectiveDate(
      "2026-08-09",
      validationContext({
        releaseStatus: "superseded",
        auditBatches: [{ _ref: "audit-2026" }],
      })
    ),
    true
  );
  assert.match(
    String(
      validateStatusEffectiveDate(
        "2026-08-09",
        validationContext({ releaseStatus: "superseded" })
      )
    ),
    /requires a version citation or audit-batch reference/
  );
});

test("complete chronology coverage requires approved audit evidence", async () => {
  const complete: ChronologyCoverageValue = {
    status: "complete",
    auditedChannels: ["developerBeta", "publicBeta"],
    coverageThrough: "2026-08-09",
    verifiedAt: "2026-08-09T16:00:00Z",
    auditBatch: { _ref: "audit-2026" },
  };

  assert.equal(
    await validateChronologyCoverage(complete, validationContext()),
    true
  );
  assert.match(
    String(
      await validateChronologyCoverage(
        { ...complete, auditBatch: undefined },
        validationContext()
      )
    ),
    /audit-batch reference/
  );
  assert.match(
    String(
      await validateChronologyCoverage(
        { status: "partial" },
        validationContext()
      )
    ),
    /known-gap note/
  );
  assert.match(
    String(
      await validateChronologyCoverage(
        {
          status: "partial",
          auditedChannels: ["display-label"],
          knownGapNote: "The source set is incomplete.",
        },
        validationContext()
      )
    ),
    /canonical release-event channel/
  );

  const rejectedContext = {
    document: {},
    getClient: () => ({
      fetch: async () => ({
        status: "partial",
        editorialStatus: "approved",
        verifiedAt: "2026-08-09T16:00:00Z",
      }),
    }),
  } as never;
  assert.match(
    String(await validateChronologyCoverage(complete, rejectedContext)),
    /complete, approved, and verified audit batch/
  );
});
