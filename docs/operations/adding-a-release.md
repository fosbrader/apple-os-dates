# Adding a release by hand in Sanity Studio

This is the manual counterpart to the guarded manifest pipeline in
[`scripts/LAUNCH_CONTENT_INGESTION.md`](../../scripts/LAUNCH_CONTENT_INGESTION.md).
Use Studio when you are adding a small number of records and want to see the
model directly. Use the manifest when a release day produces a dozen or more
records, or when you want a reviewable plan hash and a rollback artifact.

Both write to the same place. Neither needs a Git commit or a Vercel deploy:
`src/lib/sanity.fetch.ts` reads with `next: { revalidate: 60 }`, so published
content appears on the live site within about a minute.

## What one release day is made of

Three record types, deliberately kept separate:

| Record | What it means | When to create one |
| --- | --- | --- |
| `releaseVersion` | The version itself, iOS 27.0 | Once, when the version first exists |
| `releaseEvent` | One *appearance* in one channel: "beta 5, developer channel, Aug 10" | Every time that version shows up anywhere |
| `releaseBuild` | The binary identity: `24A5408d` | Only when a source verifies the build number |

The split matters. iOS 27.0 beta 5 and iPadOS 27.0 beta 5 ship the *same*
build string, `24A5408d`, but they are different builds on different
platforms, so they are two build records, not one. A single build can also
appear in several channels: today's `23G82` is an RC, and the same binary will
very likely become the public 26.6.1 release. That is a second *event* against
the same *build*, not a duplicate record.

## Walkthrough: add iOS 27.0 beta 5

Open <http://localhost:3000/studio/> (or `/studio/` on the deployed site).

### 1. Confirm the version already exists

**Release Versions → Active Betas.** You should see iOS 27.0. It is already
there with `releaseStatus: active` and no public date, so there is nothing to
create. You are only adding an appearance to it.

If you were recording a version that does *not* exist yet, you would create the
`releaseVersion` first, and it would need a `releaseTrain` reference. Note that
`releaseVersion` has **no platform field**. Platform is reached through the
train.

### 2. Create the event

**Release Events → All Events → the pencil/create icon → Release Event.**

Fill in the **Identity** group:

| Field | Value | Note |
| --- | --- | --- |
| Release Version | `iOS 27.0` | reference |
| Platform | `iOS` | reference. Events *do* carry platform |
| Stable Event ID | `event:apple:ios:27.0:beta-5` | see convention below |
| Label | `Beta 5` | human-facing |
| Route Alias | `beta-5` | slug, becomes `/apple/ios/27.0/beta-5/` |
| Channel | `Developer Beta` | not Public Beta; this went to developers |
| Appearance Date | `2026-08-10` | |
| Sequence | `5` | per-channel ordinal; betas 1-4 exist |
| Is Revision | unchecked | this is a new beta, not a re-release |
| Availability State | `available` | |
| Closes Release Cycle | unchecked | only the public release closes a cycle |

Then **Evidence** and **Review & Publishing**:

| Field | Value |
| --- | --- |
| Summary | `Apple made the fifth iOS 27 developer beta available on August 10, 2026, twenty-one days after beta 4.` |
| Citations | one citation → source *Releases - Apple Developer*, locator `iOS 27.0 beta 5 (24A5408d); August 10, 2026` |
| Provenance Status | `sourceLinked` |
| Editorial Review | `readyForReview` |
| Is Indexable | **unchecked** |

Leave `isIndexable` off. The schema will not let an event be indexable until it
is approved, cited, and carries an article or substantive changes, and the
sitemap only picks up records once those gates pass.

### 3. Create the build

**Release Builds → All Builds → create.**

| Field | Value |
| --- | --- |
| Release Version | `iOS 27.0` |
| Platform | `iOS` |
| Build Number | `24A5408d` |
| Event | link to the beta 5 event you just made |
| Summary | `Prerelease iOS 27.0 build distributed as developer beta 5 on August 10, 2026.` |
| Citations | same source, same locator |
| Provenance / Review / Indexable | `sourceLinked` / `readyForReview` / unchecked |

Enter the build number the way Apple writes it, `24A5408d`. The pipeline
normalizes the stored `buildNumber` to uppercase. Every existing record in
production reads `24A5355Q`, `24A5380H`, and so on, while prose keeps Apple's
original casing.

### 4. Publish

Hit **Publish** on both documents. Give it 60 seconds and check
`/apple/ios/27.0/`.

## Two conventions worth knowing

**Stable event IDs.** New records use `event:apple:<platform>:<version>:<route-alias>`.
The older `version-ios-27-0:m4` form you will see on betas 1-4 is a leftover
from the milestone migration. Match the new form. It must satisfy
`^[A-Za-z0-9._:-]{12,220}$`.

**Document IDs.** This is the one real gotcha. The manifest pipeline derives
deterministic IDs. `event:apple:ios:27.0:beta-5` always hashes to
`release-event-b883944db3cbee11e8c10f8a`. Studio does not; it assigns a random
UUID to anything you create by hand.

Nothing breaks. Routes resolve by `releaseVersion` + `routeAlias`, so a
hand-made event still renders and still accepts a build link. But it means:

- a hand-made record and a manifest record for the same appearance will
  **not** collide, they will **duplicate**;
- so never hand-create something that is also sitting in a pending manifest.

If you have already created a record in Studio, drop it from the manifest
before applying, or the apply will add a second copy.

## Two agents on one document

Publishing a draft in Sanity is `createOrReplace`, a whole-document swap, not a
merge. So if one pass patches fields onto the **published** document while
another has a **draft** in flight, publishing that draft silently discards the
first pass's work.

An `ifRevisionID` guard does not save you here. It stops your patch from
overwriting someone else, not their publish from overwriting you.

When a concurrent editorial pass may hold drafts, patch **every live copy** of
the document:

```ts
for (const id of [baseId, `drafts.${baseId}`]) { /* revision-guarded patch */ }
```

Keep each pass to the fields it owns: chronology and evidence in one, article
prose in another, so the two never contend for the same key.

Sequencing matters too. If the other pass merges its drafts into the published
documents *after* you computed indexability, the published copies can satisfy
the gate while still carrying `isIndexable: false`. Re-run a gate-aware pass
once the other side reports finished.

## Validation does not run on API writes

The `validateIndexable` rule in `src/sanity/schemas/schemaValidation.ts` is
**Studio-side**. A script writing through the HTTP API can happily create an
indexable document with no article, no changes, or an uncited change, and
nothing will complain until a human opens it in Studio.

Any script that sets `isIndexable` must therefore re-implement the gate itself:

- editorial review is `approved`;
- provenance is `sourceLinked` or `editoriallyVerified`;
- at least one page-level citation;
- at least one change **or** a non-empty `articleBody`;
- every change carries its own citation.

Compute it per document. A draft carrying an article and its published
counterpart without one do not get the same answer.

## Which credential writes

`SANITY_API_TOKEN` in `.env.local` is the **frontend read token**. It answers
queries and nothing else. A write returns
`Insufficient permissions; permission "update" required`.

Every write path in this repo instead runs under your Sanity CLI login:

```sh
npx sanity exec <script> --with-user-token
npx sanity documents delete <id>
```

So an agent can read production freely with the env token, but cannot mutate
anything without the CLI session. Do not add a long-lived write token to
`.env.local` to work around this. Note that the CLI session can expire
mid-task; `npx sanity login --provider <google|github|sanity>` restores it.

## When to use the manifest instead

```sh
npx sanity exec scripts/ingest-launch-content.ts --with-user-token -- \
  --content scripts/<manifest>.json
```

Dry run is the default and changes nothing. It writes a plan and a rollback
snapshot to `.migration-artifacts/` and prints a plan SHA. Applying needs all
three gates: `--apply`, `--confirm-production`, and that exact SHA. The
SHA changes whenever the manifest or the dataset does, so a stale approval
cannot be replayed.
