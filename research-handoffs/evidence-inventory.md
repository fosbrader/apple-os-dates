# Offline release chronology evidence inventory

This checked-in inventory is generated solely from `scripts/seed-data.json`. It does not fetch sources, read or write Sanity, or alter historical chronology.

## Inputs and identity boundary

- Input: `scripts/seed-data.json`
- Legacy source SHA-256: `f232ef60d0c763142a27f3789d40322f0d063ca75a32be9cdd8b6cbc7ade351c`
- Migration-plan SHA-256: `10081be95a7c07151968c780ce8d2f76c10afcd764ba5db1b7a22e51a35e538f`
- Release-event record IDs are the planner's stable legacy source IDs. A seed milestone without a live Sanity key is explicitly marked synthetic; a supplied live key remains live-key identity.
- Each source carries a machine-readable source-date and access-date state. The checked-in seed has no observed source or access dates, so those states are explicitly unknown rather than inferred.

## Exact counts

| Item | Count |
| --- | ---: |
| Release versions | 410 |
| Legacy milestones / event records | 2021 |
| Observed source URLs | 120 |
| Source-linked event records | 191 |
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
