# Release research handoff for parallel agents

This guide is the contract between release-research agents and the agents that
will later build Version Record pages. It is written for a multi-agent research
team working in this repository, including Claude Code agents.

The research team’s job is to deliver a closed, source-backed evidence packet.
The page-building team should be able to turn that packet into Sanity content
without searching the web, rediscovering dates, deciding what a source proves,
or untangling conflicts.

Apple is the current catalog, but the evidence format is intentionally
vendor-neutral so it can later support Tesla, Rivian, and other software
release tracks.

## The handoff contract

A research packet is complete only when it:

- covers every target in its exact assignment, with no unassigned targets;
- records a clear outcome even when no substantive notes survive;
- gives every factual claim and change occurrence at least one precise
  citation;
- distinguishes vendor documentation, reporting, observation, inference, and
  negative evidence;
- preserves source metadata, local evidence paths, byte counts, and SHA-256
  hashes;
- documents conflicts, gaps, exclusions, and failed source searches instead
  of hiding them;
- uses original factual summaries and passes the copyright checks below;
- separates a reusable change concept from what happened in one particular
  release;
- gives the page builder a cited article outline and recurrence history;
- parses as JSON and passes the packet checklist; and
- makes no Sanity writes, publication decisions, or deployments.

“No reliable release notes found” is an acceptable researched result.
Inventing content, silently borrowing a later release’s notes, or padding a
page is not.

## Roles and parallel-work rules

### Coordinator

The coordinator owns the master target list and gives each agent an exact
assignment file. Assignments must be disjoint unless two agents are explicitly
performing an independent audit of the same target.

The coordinator should:

1. Export the current incomplete production events.
2. Group them into bounded batches, normally one platform/version family or
   8–20 appearances.
3. Create one assignment file per agent from
   [`research-assignment-template.json`](./research-assignment-template.json).
4. Record the agent name and lock the target IDs before research begins.
5. Reject results that silently add, drop, rename, or move targets.
6. Reconcile concepts that may recur across separate batches before page
   building starts.

Do not let agents choose targets from a broad instruction such as “research
iOS 14.” That creates overlap and leaves gaps.

### Research agent

The research agent works only on the assigned targets and produces the
required packet. The agent may identify a chronology problem, but must record
it as a conflict rather than changing the target identity or historical data.

### Evidence reviewer

When staffing permits, a second agent should independently check:

- target closure;
- source identity and source class;
- every locator against the retained evidence;
- evidence hashes and byte counts;
- inheritance and evidence-state labels;
- recurrence histories;
- copyright similarity; and
- the final research outcome for each target.

The reviewer records their name and result in `report.md` and `findings.json`.
Review is not the same as Sanity editorial approval.

### Page-building agent

The page-building agent consumes only packets marked
`readyForEditorialReview`. It may compose original prose, deduplicate concepts
against the existing change library, and build the guarded Sanity manifest.
It should not have to research facts. If a packet has a material evidence gap,
the target returns to research rather than being solved during page building.

## Where work is delivered

Each batch uses:

```text
research-handoffs/<batch-id>/
  assignment.json
  findings.json
  report.md

tmp/research-evidence/<batch-id>/
  raw source captures, PDFs, extracted text, and internal renders
```

Copy the templates:

```sh
mkdir -p research-handoffs/<batch-id>
mkdir -p tmp/research-evidence/<batch-id>
cp docs/research-assignment-template.json research-handoffs/<batch-id>/assignment.json
cp docs/research-findings-template.json research-handoffs/<batch-id>/findings.json
```

The templates are illustrative, not valid completed research. Replace every
placeholder, remove unused example objects, and never deliver zero-byte or
dummy-hash evidence records.

`research-handoffs/` is intended to be reviewed and committed.
`tmp/research-evidence/` is ignored and must not be committed. Raw publisher
pages, Apple-authored PDFs, screenshots, cookies, authentication data, and
large extracted texts do not belong in Git.

If the later page-building environment will not share this workspace, transfer
the ignored evidence directory separately through an approved private channel.
Do not put raw copyrighted evidence into a public pull request merely to make
it portable.

## Selecting exact targets

The production coverage report gives current totals:

```sh
npm run sanity:coverage:report -- --json
```

The coordinator can use this GROQ query in Sanity Vision or an equivalent
read-only export to obtain incomplete event identities:

```groq
*[
  _type == "releaseEvent" &&
  !(
    editorialReview.status == "approved" &&
    length(coalesce(pt::text(articleBody), "")) >= 80 &&
    count(citations) > 0
  )
] | order(
  platform->sortOrder asc,
  releaseVersion->version asc,
  appearanceDate asc,
  sequence asc
) {
  _id,
  stableEventId,
  label,
  "routeAlias": routeAlias.current,
  channel,
  appearanceDate,
  sequence,
  isRevision,
  availabilityState,
  closesReleaseCycle,
  "releaseVersionId": releaseVersion._ref,
  "version": releaseVersion->version,
  "platformId": platform._ref,
  "platform": platform->name,
  "platformSlug": platform->slug.current,
  "reviewStatus": editorialReview.status,
  "articleLength": length(coalesce(pt::text(articleBody), "")),
  "citationCount": count(citations),
  "changeCount": count(changes)
}
```

The assignment file, not a search result, is authoritative for:

- platform and version;
- release-version document ID;
- stable event ID;
- label and route alias;
- channel;
- appearance date and sequence;
- revision status;
- availability state; and
- current coverage class.

If evidence contradicts the assignment, keep the assigned identity in the
packet and add an `identityConflict`. Do not silently “fix” chronology.

## Research workflow

### 1. Establish the release boundary

Before collecting features, verify exactly which appearance is being
researched:

- developer beta versus public beta;
- beta versus revised beta;
- RC/GM versus public release;
- version label at that date, including renamed cycles;
- platform and device scope;
- availability, withdrawal, replacement, or re-release state; and
- build number only when the evidence directly supports it.

A release appearance and a build are separate facts. Do not merge events
because they appear to share a build. Do not create a build finding from a
filename, search snippet, free-text note, or another site’s unsupported table.
Only a `confirmed` build finding is eligible for a later build document.
`reported` or `unverified` build information stays research context.

### 2. Search first-party material first

Search in this order:

1. Vendor release notes, developer documentation, security notes, support
   documents, newsroom posts, and official release feeds.
2. A preserved vendor-authored document from the vendor’s archive, Internet
   Archive, or a contemporaneous mirror.
3. Contemporaneous independent journalism with a clear publication date and
   byline.
4. Developer documentation or reproducible technical artifacts.
5. Community observations, only under the stricter undocumented-change rules
   below.

For Apple research, useful starting classes include:

- Apple Developer release notes and archived developer-library pages;
- Apple Support release and security notes;
- Apple Newsroom and Apple Developer News releases;
- Apple-authored PDFs retained by Internet Archive or a contemporaneous
  attachment archive; and
- contemporaneous reporting that identifies the exact seed.

Search-engine snippets, AI answers, Wikipedia, modern recap articles, and
unsourced release databases may help locate evidence. They are not evidence.

Respect temporal boundaries. A final-release document can establish final
state, but cannot prove that a change first appeared in an earlier beta. A
later retrospective can suggest a lead, but the occurrence date still needs
contemporaneous or version-specific support.

### 3. Preserve evidence and provenance

For every cited source:

- save the canonical HTTPS URL without tracking parameters;
- record the displayed title, publisher, byline/author, and publication date;
- distinguish publication time from modification time;
- do not invent a time or timezone when only a date is visible;
- record the access date and link state;
- save an archive URL when one exists;
- capture the source into the batch’s ignored evidence directory when legally
  and technically reasonable;
- record the exact byte count and SHA-256 of the raw capture;
- record a selected-text hash when locators are validated against extracted
  text; and
- record how the capture was obtained.

Never store access tokens, cookies, request headers, private account
information, or personal contact/payment data. Do not evade authentication,
paywalls, robots controls, DRM, or anti-bot challenges. Record an inaccessible
source as inaccessible and find another source.

An archived Apple-authored PDF hosted by a third party must be described
honestly:

- author: Apple;
- publisher/host: the attachment or archive host;
- source class: `archive`; and
- archive/provenance URL: the page that establishes where and when the
  document was posted.

The host page can prove provenance. It is not a second independent source for
the PDF’s technical claims.

### 4. Extract atomic claims

Break evidence into small facts. A claim should say one thing that can be
supported by its own citations.

Examples of separate claims:

- the seed appeared on a specific date;
- the seed introduced a feature;
- a limitation applied only to one device family;
- a known issue persisted from an earlier seed;
- the release fixed a previously documented problem; and
- the vendor’s retained document contains no “new in this release” section.

Do not combine several differently sourced facts into one uncitable sentence.
Preserve qualifications for region, language, model, audience, build, and
channel.

### 5. Model reusable concepts and release occurrences

`concepts[]` describe the reusable idea, matching the project’s
`releaseChange` model:

- `title`: concise canonical name;
- `canonicalSummary`: vendor-neutral, version-neutral original description;
- `category`: one allowed category; and
- aliases/topics/deduplication hints.

`targets[].occurrences[]` describe what happened in this exact appearance:

- action;
- inheritance;
- original release-specific summary;
- documentation status;
- evidence state;
- verification method;
- applicability; and
- claim-level citations.

Use the same `conceptId` across appearances when a feature, issue, regression,
or fix recurs. A typical history might be:

```text
Beta 1: knownIssue
Beta 2: knownIssue + cumulative
Beta 3: fixed
```

Do not create three unrelated concepts for that sequence.

### 6. Build a cited article outline

The research agent does not need to write final page prose, but must provide an
outline that makes page composition mechanical. Each section contains only
claim IDs and occurrence IDs already present in the packet.

A useful outline generally covers:

1. Release identity and evidence boundary.
2. Important documented changes.
3. Known issues, fixes, or repeated state.
4. Applicability and unresolved evidence gaps.

Do not add an SEO angle, marketing language, or unsupported “why it matters”
claim. The page builder will write fresh prose from the cited facts.

### 7. Record negative evidence honestly

Negative evidence is scoped, not universal. Record:

- the exact question searched;
- which first-party archives and contemporaneous sources were checked;
- the date range or document boundary;
- what was and was not found; and
- the narrow conclusion the evidence permits.

Good:

> The retained Beta 5, Beta 6, and Beta 7 PDFs normalize to the same
> substantive note body, so Beta 5 owns the state and the later routes are not
> padded with duplicate occurrences.

Bad:

> Nothing changed in Beta 6.

The first statement describes reviewed documents. The second makes an
unsupported claim about the binary.

### 8. Close the assignment

Every assigned target must end as one of:

- `complete`: sufficient evidence for page composition;
- `partial`: useful evidence exists, but material claims or boundaries remain
  unresolved;
- `noSubstantiveNotesFound`: the search was completed and its narrow negative
  result is documented;
- `blocked`: required evidence cannot be accessed or a material conflict
  cannot be resolved.

The corresponding coverage recommendation is:

- `fullArticle`;
- `sourceLinked`; or
- `timelineOnly`.

Do not recommend a full article simply because an identity source exists.

## Source-quality and claim rules

### Source independence

Two URLs are not necessarily two independent sources.

Treat these as one evidence lineage:

- syndicated copies of one article;
- an article and a recap that cites only that article;
- a PDF and the forum post whose only role is hosting the PDF;
- a press release and a publication that merely republishes it; and
- several pages generated from the same underlying firmware feed.

Record lineage in source notes and do not use it to inflate corroboration.

### Evidence-state meanings

Use:

- `reported`: one credible secondary source reports the claim;
- `corroborated`: two genuinely independent sources agree, or one source is
  paired with a retained, reproducible editorial verification method;
- `confirmed`: a first-party or primary artifact directly establishes the
  claim.

A vendor-authored document surviving only through an unverified third-party
mirror is normally `corroborated`, not automatically `confirmed`.

### Documentation status

Use:

- `documented`: the vendor’s release material explicitly documents the fact;
- `partiallyDocumented`: vendor material supports part of the claim and other
  evidence supports the rest;
- `undocumented`: the observation is credibly supported but absent from the
  specifically reviewed vendor-note corpus;
- `unknown`: documentation status cannot be established.

“Undocumented” never means “I did not see it in one page.” State exactly which
vendor documents were reviewed.

### Undocumented and community-sourced changes

Undocumented claims must be rare and must have either:

- two independent contemporaneous sources; or
- one credible source plus reproducible retained evidence and a written
  verification method.

Forum speculation, a single social post, an anonymous comment, or a modern
memory is not enough. Separate observation from attribution: a source may show
that behavior existed without proving which beta introduced it.

Do not automatically publish a community username as contributor credit.
Record a public byline or handle only as source metadata. Public contributor
credit is a separate editorial/privacy decision.

### Inheritance meanings

Use:

- `delta`: evidence establishes that the item is new, changed, fixed, removed,
  or regressed in this exact appearance;
- `inherited`: an earlier occurrence continues and the current source does not
  re-document it;
- `cumulative`: the current document repeats prior state, or this is the first
  retained baseline and no earlier comparison is available.

A first retained beta document is not automatically a delta. A heading such as
“Fixed in this Release” can support a delta; a general “Known Issues” section
may be cumulative. Never infer diff semantics merely from document order.

### Allowed controlled values

Use the project schema values exactly.

Channels:

```text
developerBeta
publicBeta
releaseCandidate
goldenMaster
public
securityResponse
recovery
other
```

Actions:

```text
introduced
changed
fixed
removed
regression
knownIssue
```

Inheritance:

```text
delta
inherited
cumulative
```

Documentation status:

```text
documented
partiallyDocumented
undocumented
unknown
```

Evidence state:

```text
reported
corroborated
confirmed
```

Change categories:

```text
feature
enhancement
behavior
bugFix
regression
security
developerApi
compatibility
removal
knownIssue
other
```

Source classes:

```text
firstPartyDocumentation
firstPartyAnnouncement
government
journalism
developerDocs
community
archive
other
```

Research-only controlled values:

```text
packet status:
  inProgress | needsEvidenceReview | readyForEditorialReview | returned

target outcome:
  complete | partial | noSubstantiveNotesFound | blocked

coverage recommendation:
  fullArticle | sourceLinked | timelineOnly

identity status:
  confirmed | conflict | unverified

build verification:
  confirmed | reported | unverified

confidence:
  high | medium | low

gap severity:
  material | nonMaterial

publication date precision:
  datetime | date | unknown
```

## Citation rules

Every claim and occurrence needs at least one citation object with:

- `sourceId`;
- a precise `locator`; and
- a short `supports` note explaining the citation’s job.

Good locators:

```text
Fixed in this Release > Messages; page 4
Release notes > Known Issues > AirDrop
Paragraph beginning “Apple today seeded…”
00:42–00:58
Table row for build 21A123
```

Bad locators:

```text
article
release notes
homepage
search result
```

Prefer headings, page numbers, table rows, and timestamps over quotations. A
locator may include a brief identifying phrase, but must not reproduce a whole
release-note bullet. Use `shortQuote` only when exact language is materially
important, and keep it to 15 words or fewer. A short quote in the research
packet is not automatic permission to publish it.

## Copyright, attribution, and trademark rules

Version Record publishes original synthesis of facts, not copies of publisher
articles or vendor release-note bodies.

Research agents must:

- write concept summaries, occurrence summaries, claims, and outline notes in
  original language;
- avoid pasting long passages into committed findings;
- keep raw evidence only in the ignored evidence directory;
- use brief locators instead of copied bullets;
- keep deliberate quotations exceptional, attributed, and at most 15 words;
- check reader-facing research text for source similarity, with no more than
  five consecutive normalized source words outside a marked short quotation;
- never commit publisher screenshots or logos as page assets;
- record image evidence internally only unless rights are separately cleared;
- use vendor and product names only for factual, nominative identification;
  and
- never imply that Version Record is official, endorsed, or affiliated with
  Apple or another vendor.

Attribution is required, but attribution alone is not permission to copy.

## Required `findings.json` structure

Start from
[`research-findings-template.json`](./research-findings-template.json).
The required top-level sections are:

- `batch`: ownership, timestamps, status, and scope;
- `assignment`: an exact copy of the assignment closure;
- `sources`: complete source and evidence custody;
- `concepts`: reusable change definitions;
- `targets`: identity, claims, occurrences, outlines, negative findings, and
  gaps;
- `excludedSources`: sources found but deliberately not used;
- `disagreements`: competing evidence and the recommended boundary;
- `batchGaps`: cross-target limitations; and
- `qualityChecks`: explicit completion gates.

Use local packet IDs such as `source-001`, `concept-airdrop-reliability`, and
`ios-14-2-beta-3-occurrence-airdrop`. Do not invent Sanity document IDs.

Research packet status values:

```text
inProgress
needsEvidenceReview
readyForEditorialReview
returned
```

Only the evidence reviewer or coordinator changes a packet to
`readyForEditorialReview`.

## Required `report.md` structure

Use this human-readable companion:

```md
# <Batch name> research handoff

Status: readyForEditorialReview
Researcher: <agent>
Evidence reviewer: <agent or “pending”>
Assignment SHA-256: <hash>
Findings SHA-256: <hash>
Evidence directory: tmp/research-evidence/<batch-id>/

## Scope closure

| Target | Outcome | Recommendation | Sources | Claims | Occurrences | Material gaps |
| ------ | ------- | -------------- | ------: | -----: | ----------: | ------------- |

## What page builders can safely say

- <cited high-level finding>

## Recurring concepts and histories

- <concept ID>: <appearance sequence>

## Source ledger

| ID  | Class | Publisher | Published | Raw bytes | SHA-256 | Role |
| --- | ----- | --------- | --------- | --------: | ------- | ---- |

## Conflicts and decisions

- <conflict, competing evidence, and narrow recommendation>

## Negative findings

- <question, sources checked, and permitted conclusion>

## Evidence gaps

- <gap and which target/claim it affects>

## Excluded sources

- <URL and reason>

## Validation

- [ ] Exact target closure
- [ ] Every claim and occurrence cited
- [ ] Every locator independently resolved
- [ ] Source metadata and timestamps checked
- [ ] Raw and selected-text hashes reproduced
- [ ] Recurrence and inheritance reviewed
- [ ] Copyright similarity passed
- [ ] JSON parsed and controlled values validated
- [ ] No Sanity write, apply, approval, or deployment performed
```

## Validation before delivery

At minimum, run:

```sh
node -e 'JSON.parse(require("node:fs").readFileSync(process.argv[1], "utf8"))' \
  research-handoffs/<batch-id>/assignment.json

node -e 'JSON.parse(require("node:fs").readFileSync(process.argv[1], "utf8"))' \
  research-handoffs/<batch-id>/findings.json

shasum -a 256 \
  research-handoffs/<batch-id>/assignment.json \
  research-handoffs/<batch-id>/findings.json
```

The reviewer must additionally establish:

1. Assignment target IDs equal findings target IDs exactly.
2. All local IDs are unique.
3. Every citation’s `sourceId` exists.
4. Every declared source is used, or its non-use is explained.
5. Every exact locator resolves in the retained source evidence.
6. Every `corroborated` item has two independent sources or a reproducible
   verification method.
7. Every `confirmed` item has direct primary support.
8. Every undocumented claim passes the stricter community rule.
9. Repeated concepts have an explicit recurrence history and correct
   inheritance.
10. Build numbers, regions, devices, languages, and audiences retain their
    source qualifications.
11. Reader-facing summaries do not exceed the five-word source-overlap limit
    outside marked short quotations.
12. The packet contains no placeholder prose, secret, cookie, credential,
    private contact data, or raw copyrighted document.
13. No production Sanity write or deployment occurred.

If any check fails, keep the packet out of `readyForEditorialReview`.

## Copy-paste kickoff prompt for a research agent

Replace the batch path before sending:

```text
You are a research-only agent for Version Record.

Read docs/research-agent-handoff.md completely, then read:
research-handoffs/<batch-id>/assignment.json

Research only the exact assigned target IDs. Do not add, remove, rename, or
move targets. Do not edit production chronology, page code, existing
scripts/research-batches manifests, or Sanity content. Do not run any apply,
publish, or deployment command.

Deliver:
1. research-handoffs/<batch-id>/findings.json, following
   docs/research-findings-template.json;
2. research-handoffs/<batch-id>/report.md, following the required report
   structure in the handoff guide; and
3. raw evidence, extracted text, hashes, and internal renders under
   tmp/research-evidence/<batch-id>/ only.

Prioritize first-party sources. Give every claim and occurrence a precise
locator. Preserve source metadata, byte counts, SHA-256 hashes, temporal and
device/region qualifications, conflicts, negative findings, and material gaps.
Use original synthesis; do not copy release-note bodies or publisher prose.
Do not mark the packet readyForEditorialReview unless every applicable quality
gate in the guide is true. A documented partial or noSubstantiveNotesFound
outcome is better than unsupported content.
```

## What the page-building phase should receive

For a target recommended as `fullArticle`, the packet should give the next
agent everything needed to:

- identify the exact existing release event;
- create or reuse source documents;
- create or reuse canonical change concepts;
- attach release-specific occurrences with correct action and inheritance;
- compose an original article from a cited outline;
- preserve applicability and evidence qualifications;
- keep unresolved builds or claims out of the page;
- generate a guarded, reversible Sanity plan; and
- validate rendered routes without doing new research.

The page builder may still reject or return a claim during editorial review.
That is quality control, not an invitation to improvise new research while
building pages.

## Project references

Before beginning, agents should read:

- [`README.md`](../README.md), especially “Adding a release in Sanity” and
  “Sources, citations, and reuse”;
- [`releaseEvent.ts`](../src/sanity/schemas/releaseEvent.ts);
- [`releaseChange.ts`](../src/sanity/schemas/releaseChange.ts);
- [`source.ts`](../src/sanity/schemas/source.ts);
- [`editorialTypes.ts`](../src/sanity/schemas/editorialTypes.ts); and
- [`LAUNCH_CONTENT_INGESTION.md`](../scripts/LAUNCH_CONTENT_INGESTION.md) for
  context on the later guarded publication phase.

Useful examples of evidence-led batch work include:

- [`apple-ios-10-point-prerelease.md`](../scripts/research-batches/apple-ios-10-point-prerelease.md);
- [`apple-ios-8-point-prerelease.md`](../scripts/research-batches/apple-ios-8-point-prerelease.md);
- [`apple-ios-11-point-prerelease.md`](../scripts/research-batches/apple-ios-11-point-prerelease.md); and
- [`apple-other-2024.md`](../scripts/research-batches/apple-other-2024.md).

Those files demonstrate the project’s audit depth. New research agents should
deliver the neutral packet defined here rather than directly editing existing
launch manifests or copying an older generator.
