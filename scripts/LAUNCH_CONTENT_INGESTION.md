# Launch content ingestion

This pipeline turns a checked-in, source-backed JSON manifest into a
deterministic Sanity mutation plan. It migrates legacy timeline milestones to
`releaseEvent` documents and can add guarded missing released versions, version
overviews, event/build articles, citations, reusable changes, and verified
builds.

It is deliberately not a scraper or publisher-text importer. Manifest prose
must be original synthesis written for Version Record. Sources support claims;
attribution does not grant permission to copy a publisher's release notes.

The command is hard-coded to the public Sanity target:

- project: `lh3yswzu`
- dataset: `production`

The manifest must repeat that exact target. A different CLI configuration or
manifest target fails before a mutation is planned.

## Operator workflow

Start from [`launch-content.example.json`](./launch-content.example.json) and
keep the working manifest inside the repository.

Run the dry run:

```sh
npx sanity exec scripts/ingest-launch-content.ts --with-user-token -- \
  --content scripts/launch-content.example.json
```

Dry run is the default. It reads the published dataset and writes two local,
gitignored files under `.migration-artifacts/`:

- `launch-content-plan-<SHA>.json`: exact creates and revision-guarded field
  patches.
- `launch-content-rollback-<SHA>.json`: IDs created by the plan and the complete
  pre-mutation documents for every patch.

The `DOCUMENTS` summary reports `releaseVersion` creates separately from
source, event, build, and change creates. A version create is therefore visible
both in the reviewed mutation list and in the operator-facing totals.

No Sanity data changes during a dry run. Review both artifacts, especially:

- project and dataset;
- every source URL and source classification;
- every piece of editorial prose;
- each inline citation and locator;
- event/build identity and relationships;
- review, provenance, and indexing states;
- the absence of an unexpected `milestones` patch.

Apply only that reviewed plan:

```sh
npx sanity exec scripts/ingest-launch-content.ts --with-user-token -- \
  --content scripts/launch-content.example.json \
  --apply \
  --confirm-production \
  --plan-sha <SHA_PRINTED_BY_DRY_RUN>
```

All three apply gates are required: `--apply`, `--confirm-production`, and the
exact SHA for a newly computed plan. If the manifest, published snapshot, or
derived migration changes, the SHA changes and the old approval cannot be
reused.

Before creating a transaction, the command verifies that:

- both artifacts exist;
- the current plan and rollback digests are valid;
- no relevant Sanity draft conflicts with the write set;
- all patches carry the source document's `_rev`;
- citation, provenance, review, identity, and indexing invariants pass.
- the serialized mutation payload remains below the guarded 3.9 MB ceiling
  (Sanity's service limit is 4 MB).

After the transaction, it fetches the published snapshot again and requires a
zero-mutation rerun. A receipt is written only after that idempotency check
passes.

Do not run an apply as part of automated content research. Preparing and
reviewing a manifest is separate from authorizing production writes.

## Manifest model

The top-level shape is:

```json
{
  "formatVersion": 1,
  "target": {
    "projectId": "lh3yswzu",
    "dataset": "production"
  },
  "accessedAt": "2026-07-29",
  "sources": [],
  "versions": [],
  "events": [],
  "builds": []
}
```

`accessedAt` is the source-access date in `YYYY-MM-DD` form. Arrays may be
empty, which makes it possible to run the legacy timeline migration before
adding editorial material.

### Sources

Every editorial citation URL must either:

- have a matching entry in `sources`; or
- already be present as a published Sanity `source`; or
- come from a legacy milestone's `sourceUrl`.

Source IDs are derived from the normalized canonical URL. Existing source
documents with that URL are reused. Missing required provenance fields on a
reused legacy source are filled without replacing intentional existing values.

Use the human-readable publisher page for `url`, `archiveUrl`, citations, and a
version's `releaseNotesUrl`.

For Apple documentation, DocC JSON is transport data only:

```json
{
  "url": "https://developer.apple.com/documentation/example/release-notes",
  "transportUrl": "https://developer.apple.com/tutorials/data/documentation/example/release-notes.json",
  "title": "Example Release Notes",
  "publisher": "Apple Developer",
  "sourceClass": "developerDocs"
}
```

`transportUrl` records how a researcher validated or prepared the checked-in
manifest. It is never written to Sanity, emitted as a public citation, or used
as an archive URL. A `/tutorials/data/*.json` URL in any public URL field is
rejected.

### Original articles and inline citations

Every article must explicitly attest:

```json
{
  "authorship": "originalSynthesis",
  "blocks": []
}
```

A factual paragraph can cite one or more sources as a whole:

```json
{
  "style": "normal",
  "text": "An original summary of the supported fact.",
  "citations": [
    {
      "url": "https://example.com/release-notes",
      "locator": "Features"
    }
  ]
}
```

Use `spans` when separate claims within one paragraph need different inline
superscripts:

```json
{
  "style": "normal",
  "spans": [
    {
      "text": "The first claim is original synthesis. ",
      "citations": [
        {
          "url": "https://example.com/source-a",
          "locator": "Section A"
        }
      ]
    },
    {
      "text": "The second claim has different evidence.",
      "citations": [
        {
          "url": "https://example.com/source-b",
          "locator": "Section B"
        }
      ]
    }
  ]
}
```

Each normal prose block needs a citation. Headings may be uncited. The pipeline
converts citations to deterministic Portable Text annotation marks and also
adds them to the owning document's source list.

Do not paste publisher paragraphs into `text`, `spans`, `summary`, or change
descriptions. Fields associated with copied, quoted, raw HTML, or upstream body
text are rejected. The `originalSynthesis` flag is an editorial attestation,
not an automated copyright determination; a human must still review the prose.

### Version content

`versions` normally overlays existing `releaseVersion` documents by ID. It
supports:

- a human-readable `releaseNotesUrl`;
- a sourced `overview`;
- version-level citations;
- provenance and editorial review state.

The patch is revision-guarded and never removes or rewrites legacy
`milestones`.

A genuinely missing, already released version may include a complete
create-or-assert identity:

```json
{
  "releaseVersionId": "version-ios-10-3-4",
  "identity": {
    "releaseTrainId": "train-ios-10",
    "platformId": "platform-ios",
    "version": "10.3.4",
    "releaseStatus": "released",
    "publicReleaseDate": "2019-07-22"
  },
  "authorship": "originalSynthesis"
}
```

This path never creates a platform or release train. Before planning a
`releaseVersion` create, it requires both parents to exist, verifies the
train's platform and major version, derives the exact document ID from the
platform slug and version, and rejects another document with the same
platform/version pair. Only `released` identities with a valid public date are
accepted. If the deterministic document already exists, its train, version,
status, and public date must match exactly; identity fields are asserted, never
patched. New version documents start with an empty legacy `milestones` array,
legacy provenance, and draft review state before any supplied editorial
overlay is applied.

### Event content

An event overlay selects exactly one existing event identity:

- `documentId`;
- `legacySourceId`, such as `version-ios-27-0:beta-1`; or
- `stableEventId`; or
- the durable public route pair `releaseVersionId` plus `routeAlias`, such as
  `{"releaseVersionId":"version-ios-27-0","routeAlias":"beta-4"}`.

Prefer the public route pair for new editorial research batches. It remains
stable when imported milestone `_key` values differ between a frozen seed and
the published dataset, while still resolving exactly one version-scoped
appearance.

It may add original summary/article content, citations, changes, and publication
state. To create an event that is not in the legacy timeline, include a complete
`identity` with its parent version, platform, stable event ID, label, route
alias, channel, and appearance date. The document ID is derived from the stable
event ID.

When the parent version is created by the same bundle, the new event is limited
to its durable public identity: target and identity must use the `public` route,
the channel must be `public`, `appearanceDate` must equal the version's
`publicReleaseDate`, and `closesReleaseCycle` must be `true`. This keeps a
historical missing-version repair from becoming an implicit prerelease-event
backfill.

The base migration projects legacy milestones into source-backed
`releaseEvent` documents while retaining the original milestones on their
version documents. Re-running the same input yields the same IDs and no
residual mutations.

### Changes and builds

An event or build can carry change occurrences. The manifest's lowercase
change `key` creates a reusable deterministic `releaseChange`; each occurrence
records what happened in that event/build and includes its own evidence.

A build requires a verified Apple build number, version, platform, and at least
one citation. Its deterministic ID is based on version plus normalized build
number. `eventTargets` can link one or more existing events to that build. A
legacy-derived build is emitted only when its related milestone has source
evidence.

## Review and indexing gates

Supported editorial states are `draft`, `needsEvidence`, `readyForReview`,
`approved`, and `rejected`. Approved or rejected content requires
`reviewedAt`.

Content cannot be approved without citations. `editoriallyVerified` content
must be approved. An event or build cannot be indexable unless it is approved,
source-linked/editorially verified, cited, and contains an article or
substantive change.

The conservative launch posture is:

```json
{
  "provenanceStatus": "sourceLinked",
  "editorialReview": {
    "status": "readyForReview"
  },
  "isIndexable": false
}
```

## Rollback artifact

The rollback file is evidence needed for a guarded recovery; it is not an
automatic destructive command. It contains:

- deterministic IDs created by the plan;
- complete before-documents for revision-guarded patches;
- the source snapshot and plan digests.

Recovery must verify current post-apply revisions before deleting created
documents or restoring fields. Never write historical `_rev`, `_createdAt`, or
`_updatedAt` values back to Sanity. Keep the artifact private because
before-documents can contain internal editorial metadata.
