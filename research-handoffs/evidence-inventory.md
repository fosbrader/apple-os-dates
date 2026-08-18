# Offline release chronology evidence inventory

This checked-in inventory is generated solely from `scripts/seed-data.json`. It does not fetch sources, read or write Sanity, or alter historical chronology.

## Inputs and identity boundary

- Input: `scripts/seed-data.json`
- Legacy source SHA-256: `705f659e21d756d91626374b9980d867b69e3be167ba38679a0b33893f463704`
- Migration-plan SHA-256: `554043a263041bbbf98063de939677f2042ce641678ebe1a08843a8e0a7a6fe9`
- Release-event record IDs are the planner's stable legacy source IDs. A seed milestone without a live Sanity key is explicitly marked synthetic; a supplied live key remains live-key identity.
- Each source carries a machine-readable source-date and access-date state. The checked-in seed has no observed source or access dates, so those states are explicitly unknown rather than inferred.

## Exact counts

| Item | Count |
| --- | ---: |
| Release versions | 410 |
| Legacy milestones / event records | 1991 |
| Observed source URLs | 107 |
| Source-linked event records | 161 |
| Missing-evidence event records | 1830 |
| Conflicting-evidence event records | 0 |
| Quarantined event records | 1830 |
| Quarantined version records | 360 |
| Source metadata conflicts | 0 |
| Review batches | 180 |
| Batch targets | 1830 |

## Review contract

Every batch in [evidence-inventory-batches.json](./evidence-inventory-batches.json) is capped at 12 exact event record IDs. Missing or conflicting evidence stays quarantined until a reviewer records source-backed findings; no batch authorizes a chronology correction, Sanity mutation, or publication.

Regenerate: `npm run evidence:inventory`
Verify checked-in artifacts: `npm run evidence:inventory:check`
