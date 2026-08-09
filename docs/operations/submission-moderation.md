# Submission moderation monitor

The submission monitor converts one private queue state into one generic public
GitHub issue. It does not copy submission data into GitHub.

## Production contract

The workflow sends this request every six hours and when an operator dispatches
it manually:

```text
GET https://www.versionrecord.com/api/submissions/status/
Authorization: Bearer <SUBMISSION_MONITOR_SECRET>
Accept: application/json
```

The endpoint must return HTTP `200` and exactly one Boolean field:

```json
{"pending": true}
```

The endpoint must not return submission contents, counts, submitter details,
record identifiers, source URLs, moderation paths, or other private metadata.
It must use `Cache-Control: no-store` and reject missing or incorrect secrets.

BotID Basic protects only browser submissions to `POST /api/submissions/`.
Do not add the authenticated status route or retention cron route to the BotID
client protection list: they are deliberate server-to-server callers and use
independent bearer secrets.

The workflow does not follow redirects. This prevents the authorization header
from being forwarded to another location. A redirect, non-`200` response,
oversized response, malformed JSON document, or unexpected field fails the run
without changing an issue.

The Production firewall has one fixed-window rule scoped exactly to
`POST /api/submissions/`: five requests per IP per 900 seconds. The status and
retention routes use bearer secrets and their own application controls; do not
widen the one Hobby-plan firewall rule to all API reads.

## Private Blob access

The moderation store is private and connected only to Production. Production
functions use Vercel OIDC. Do not create or restore a long-lived
`BLOB_READ_WRITE_TOKEN`. Do not connect the private queue to Preview or
Development.

The Production function at `/api/submissions/operator/` uses Production OIDC to
access Blob. It accepts only bounded `POST` JSON actions for list, get, hold,
release-hold, and resolve. IDs never appear in the URL. The route requires the
independent `SUBMISSION_OPERATOR_SECRET`, checks it in constant time, and is
unavailable outside Production.

The local operator command reads its credential from the macOS login keychain.
A minimal shell bootstrap reduces the environment to that one secret before
Node or any JavaScript dependency starts. The client captures the secret and
removes it from its process environment before it sends one HTTPS request to
the fixed Production route. Routine moderation does not download the Production
environment, invoke Vercel CLI, access Blob directly, use local OIDC, or start a
helper process. Run it only from a trusted checkout on an authorized operator's
terminal.

Credential provisioning and rotation use the pinned Vercel CLI version
`58.9.0`. Routine moderation does not use Vercel CLI. Review the provisioner,
bootstrap, and security tests before changing the pin. Do not replace it with
`latest`.

Provision or rotate the operator credential:

1. Use an authorized macOS account with an unlocked login keychain set as the
   account's default keychain.
2. Authenticate Vercel CLI as an authorized project member.
3. Link this checkout to the correct Vercel project.
4. Confirm that exactly one private Blob store is linked only to Production.
5. Confirm that the deployed operator route is from the reviewed release.
6. Run `npm run submissions:operator:provision`.
7. Redeploy Production before running a moderation command.
8. Run `npm run submissions:moderate -- list` to verify access.

The provisioner generates a new high-entropy credential, stores it in the macOS
login keychain, and streams the same value to Vercel as a Sensitive
Production-only variable. It does not print the value or place it in an
argument, file, child environment, or deployment log. If Vercel rejects the
update or its result cannot be confirmed, treat the remote state as unknown and
rerun the provisioner before deployment. After initial setup, routine moderation
requires neither Vercel authentication nor a Production environment download.

If provisioning is interrupted, do not redeploy or run moderation. The remote
and local updates can have different outcomes. Rerun the provision command to
establish one new matching value, then redeploy Production.

The first moderation command after provisioning or rotation can display a
macOS Keychain access dialog. Confirm that the request is for the Version Record
submission operator item and `/usr/bin/security`, then enter the login-keychain
password yourself and select **Always Allow**. The command never receives or
stores that password. Do not approve a differently named item or requester.

List queue records with safe metadata only:

```sh
npm run submissions:moderate -- list
```

The list contains only a UUID, the date encoded when the record was received,
the last Blob update time, and a legal-hold Boolean. It does not read or print
the report, sources, credit, contact email, or object pathname.

Retrieve one record only when review requires its private content:

```sh
npm run submissions:moderate -- get <submission-id>
```

`get` requires an interactive terminal and an explicit UUID. It refuses pipes,
CI, and redirected output. Do not paste its output into GitHub, chat, tickets,
shared documents, or logs.

Resolve and delete one reviewed record by repeating the exact UUID:

```sh
npm run submissions:moderate -- resolve <submission-id> --confirm <submission-id>
```

Resolution uses the object's current ETag and deletes only the path derived
from that UUID. It refuses wildcard paths and refuses to delete a held record.

Place or release a legal hold with the same repeated-ID safeguard:

```sh
npm run submissions:moderate -- hold <submission-id> --confirm <submission-id>
npm run submissions:moderate -- release-hold <submission-id> --confirm <submission-id>
```

A hold moves the immutable record from `moderation/submissions/` to
`moderation/legal-holds/`. Both paths contain only the received date and UUID.
The status monitor treats held records as pending, while automatic retention
scans only the normal submission prefix. Therefore, a held record keeps the
generic GitHub review issue open. Release the hold before resolution. After a
release, retention still uses the original date encoded in the path, so the move
cannot restart the retention period.

Do not use generic Blob delete, copy, or rename commands for moderation. If an
operator command reports a duplicate state or concurrency failure, stop and
inspect the private store; do not delete either object speculatively.

## Repository setup

Generate two independent, high-entropy values of at least 32 random bytes for
`SUBMISSION_MONITOR_SECRET` and `CRON_SECRET`. Set both as Sensitive Production
variables in Vercel. Provision `SUBMISSION_OPERATOR_SECRET` separately with
`npm run submissions:operator:provision`; do not create a second local copy
manually. Keep all three values out of Preview and Development, then redeploy
Production. Add only `SUBMISSION_MONITOR_SECRET` as a repository Actions secret:

1. Open **Settings → Secrets and variables → Actions**.
2. Select **New repository secret**.
3. Set the name to `SUBMISSION_MONITOR_SECRET`.
4. Set its value to the same secret that protects the production status route.

Do not store any secret in a repository variable, workflow file, issue, comment,
runbook, `.env` file, or deployment log. Rotate the monitor's Production value
and Actions secret together. Rotate the cron secret independently. Rotate the
operator credential by rerunning `npm run submissions:operator:provision`, then
redeploy Production immediately. Avoid operator rotation while an urgent queue
review depends on the currently deployed credential.

The workflow uses the built-in `GITHUB_TOKEN`. Its only explicit permission is
`issues: write`; it does not check out repository contents and it has no
pull-request trigger.

The job uses a standard `ubuntu-latest` runner and uploads no artifacts or
caches. GitHub currently provides standard hosted-runner use at no charge for
public repositories; larger runners and private-repository billing have
different terms. See [GitHub Actions billing][actions-billing].

## Issue lifecycle

The monitor owns one issue with this exact title and hidden body marker:

```text
Submission review queue needs attention
<!-- version-record-submission-monitor:v1 -->
```

- If `pending` is `true` and the issue does not exist, the workflow opens it.
- If `pending` is `true` and the issue is closed, the workflow reopens it.
- If `pending` is `true` and the issue is open, the workflow makes no change.
- If `pending` is `false` and the issue is open, the workflow closes it.
- If `pending` is `false` and the issue is absent or closed, the workflow makes
  no change.

The title and visible body are intentionally generic because the repository is public.
Do not add submission contents, counts, paths, evidence, names, email addresses,
IP addresses, or other review details to the issue. Do the review only in the
private moderation system.

Concurrent runs are serialized. The workflow manages only issues authored by
the GitHub Actions app that have both the exact title and hidden marker. Public
issues that imitate the title or marker are ignored. If more than one trusted,
marked issue exists in any state, the workflow fails without selecting or
modifying one. Rename a duplicate or remove its marker before the next run.
Closing it alone does not resolve the conflict.

## Operation

GitHub schedules the workflow for 00:17, 06:17, 12:17, and 18:17 UTC. Scheduled
runs can start later during GitHub service load; the schedule is polling, not
an exact alerting deadline. The scheduled trigger runs only from the default
branch.

An open issue is a queue-attention signal, not a per-submission notification.
Before closing the work, run the safe `list` command again so a report that
arrived during review is not overlooked. The next monitor run closes the issue
only after no active or held records remain.

GitHub automatically disables scheduled workflows in a public repository after
60 days without repository activity. If that occurs, re-enable **Submission
monitor** in the Actions interface and run it manually once.

To make a manual check, open **Actions → Submission monitor → Run workflow**.
The run reports only generic success or failure messages. Do not add diagnostic
commands that print the response file, request headers, secret, issue result, or
submission metadata.

On a failed run:

1. Confirm that the production status route is available.
2. Confirm that the Actions secret and production secret match.
3. Confirm that the route returns the exact Boolean response contract.
4. Check for duplicate managed issues.
5. Run the workflow manually after the problem is corrected.

Do not paste the endpoint response or authorization header into GitHub logs or
issues while troubleshooting.

## Retention and rollback

The Production cron runs `/api/cron/submission-retention/` once each day. It
deletes unheld records after the cleanup threshold and uses conditional deletes
to avoid removing an object that changed after listing. Held records remain
until an authorized operator releases the hold.

An application rollback does not roll back Blob data, OIDC linkage, the GitHub
workflow, or the Vercel firewall rule. During rollback:

1. Keep the private Blob store and its objects.
2. Keep the Production OIDC store connection and all three queue secrets.
3. Disable the GitHub monitor temporarily if the rolled-back status route is
   unavailable.
4. Verify the deployed cron list; the cron from the active Production
   deployment can differ from the checked-out `vercel.json`.
5. Restore a release that can read the existing queue before accepting new
   submissions.

Do not restore a static Blob token as a rollback shortcut. Do not delete queue
objects until the application rollback and operator access are both verified.

After each production change to submission protection, send one synthetic
report through the rendered `/submit/` form. Confirm that it appears in the
private Blob store and that the generic review issue opens, then delete the test
object and confirm that the next monitor run closes the issue. A direct `curl`
POST must be rejected by BotID in production. Local development intentionally
treats requests as human unless BotID development overrides are used.

## Security limitations

- The presence of an open issue publicly reveals only that the private review
  queue needs attention. It must reveal nothing about a submission.
- A maintainer who can change workflows can attempt to misuse repository
  secrets. Protect the default branch and require review for workflow changes.
- The monitor secret authenticates only the narrow polling request. It is not a
  Sanity token and must not grant read or write access to moderation records.
- The independent operator secret grants access to private moderation actions.
  Keep it only as a Sensitive Production variable and as the matching
  login-keychain item on an authorized operator Mac. Rotate it with the
  provisioner after suspected exposure, then redeploy Production immediately.
- The login-keychain item is encrypted at rest. While that keychain is unlocked,
  another process running as the operator's macOS account can invoke the trusted
  system Keychain client and retrieve it. Treat that local account as privileged,
  lock the Mac when unattended, and do not run untrusted software in the account.
- BotID must remain configured at the free `basic` check level in both
  `src/instrumentation-client.ts` and the server route. A mismatch fails
  verification. Turnstile remains optional defense in depth when both of its
  keys are configured.
- The status and operator endpoints must apply bounded execution, constant-time
  secret comparison, and rate limiting for failed authentication attempts.
- GitHub Actions and the production host are separate failure domains. A failed
  poll leaves the existing issue state unchanged, so operators must review
  failed runs rather than treating issue absence as proof of an empty queue.

[actions-billing]: https://docs.github.com/en/billing/concepts/product-billing/github-actions
