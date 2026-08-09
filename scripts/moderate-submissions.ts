import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { containsUnsafeSubmissionCharacters } from "../src/lib/moderation/submission";

export const submissionOperatorEndpoint =
  "https://www.versionrecord.com/api/submissions/operator/";

const maximumOperatorResponseBytes = 1_048_576;
const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
const sensitiveEnvironmentName =
  /(?:^|_)(?:TOKEN|SECRET|PASSWORD|PASSPHRASE|CREDENTIALS?|PRIVATE_KEY|API_KEY)(?:$|_)/i;

const usage = `Usage:
  npm run submissions:moderate -- list
  npm run submissions:moderate -- get <submission-id>
  npm run submissions:moderate -- hold <submission-id> --confirm <submission-id>
  npm run submissions:moderate -- release-hold <submission-id> --confirm <submission-id>
  npm run submissions:moderate -- resolve <submission-id> --confirm <submission-id>

The list command prints IDs and storage metadata only. The get command can print
private submission content and therefore runs only in an interactive terminal.
Every write requires the exact canonical ID twice.`;

type OperatorRequest =
  | { action: "list" }
  | { action: "get"; id: string }
  | {
      action: "hold" | "release-hold" | "resolve";
      id: string;
      confirm: string;
    };

type FetchLike = (
  input: string | URL | Request,
  init?: RequestInit,
) => Promise<Response>;

interface ModerationCommandOptions {
  operatorSecret?: string;
  fetchRequest?: FetchLike;
  stdinIsTTY?: boolean;
  stdoutIsTTY?: boolean;
  isCI?: boolean;
  writeStdout?: (value: string) => void;
  writeStderr?: (value: string) => void;
}

export class OperatorUsageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "OperatorUsageError";
  }
}

export class OperatorRequestError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "OperatorRequestError";
  }
}

/**
 * Capture the one credential this process needs, then remove it from the
 * already-minimized environment prepared by `run-submission-operator.sh`.
 * Keeping the scrub here as a second boundary also protects direct test and
 * development invocation. The operator command starts no child process.
 */
export function captureOperatorSecret(
  environment: NodeJS.ProcessEnv,
): string | undefined {
  const secret = environment.SUBMISSION_OPERATOR_SECRET?.trim();
  for (const name of Object.keys(environment)) {
    if (
      sensitiveEnvironmentName.test(name) ||
      name === "BLOB_STORE_ID" ||
      name === "VERCEL_OIDC_TOKEN"
    ) {
      delete environment[name];
    }
  }
  return secret;
}

function requireInteractiveTerminal(
  action: string,
  { isCI, stdinIsTTY, stdoutIsTTY }: Required<
    Pick<ModerationCommandOptions, "isCI" | "stdinIsTTY" | "stdoutIsTTY">
  >,
): void {
  if (isCI || !stdinIsTTY || !stdoutIsTTY) {
    throw new OperatorUsageError(
      `${action} is allowed only in an interactive operator terminal.`,
    );
  }
}

function exactId(args: string[]): string {
  if (args.length !== 1) throw new OperatorUsageError(usage);
  if (!uuidPattern.test(args[0])) {
    throw new OperatorUsageError(
      "Use the exact lowercase UUID printed by the list command.",
    );
  }
  return args[0];
}

function confirmedId(args: string[]): string {
  if (args.length !== 3 || args[1] !== "--confirm") {
    throw new OperatorUsageError(usage);
  }
  if (!uuidPattern.test(args[0])) {
    throw new OperatorUsageError(
      "Use the exact lowercase UUID printed by the list command.",
    );
  }
  if (args[0] !== args[2]) {
    throw new OperatorUsageError("The confirmation ID must match exactly.");
  }
  return args[0];
}

function plainRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null
    ? (value as Record<string, unknown>)
    : null;
}

function hasExactKeys(
  record: Record<string, unknown>,
  expected: readonly string[],
): boolean {
  const actual = Object.keys(record).sort();
  const required = [...expected].sort();
  return (
    actual.length === required.length &&
    actual.every((key, index) => key === required[index])
  );
}

function containsForbiddenKey(value: unknown): boolean {
  if (Array.isArray(value)) return value.some(containsForbiddenKey);
  const record = plainRecord(value);
  if (!record) return false;
  return Object.entries(record).some(
    ([key, item]) =>
      /(?:path|etag|secret|token)/i.test(key) ||
      containsForbiddenKey(item),
  );
}

function containsUnsafeResponseText(value: unknown): boolean {
  if (typeof value === "string") {
    return containsUnsafeSubmissionCharacters(value);
  }
  if (Array.isArray(value)) return value.some(containsUnsafeResponseText);
  const record = plainRecord(value);
  if (!record) return false;
  return Object.values(record).some(containsUnsafeResponseText);
}

const queueMetadataKeys = [
  "id",
  "submittedOn",
  "storageUpdatedAt",
  "legalHold",
] as const;

function validQueueMetadata(value: unknown, expectedId?: string): boolean {
  const metadata = plainRecord(value);
  return Boolean(
    metadata &&
      hasExactKeys(metadata, queueMetadataKeys) &&
      typeof metadata.id === "string" &&
      uuidPattern.test(metadata.id) &&
      (expectedId === undefined || metadata.id === expectedId) &&
      typeof metadata.submittedOn === "string" &&
      /^\d{4}-\d{2}-\d{2}$/.test(metadata.submittedOn) &&
      typeof metadata.storageUpdatedAt === "string" &&
      Number.isFinite(Date.parse(metadata.storageUpdatedAt)) &&
      typeof metadata.legalHold === "boolean",
  );
}

function validStoredRecord(value: unknown, expectedId: string): boolean {
  const submission = plainRecord(value);
  if (!submission) return false;

  const requiredKeys = [
    "schemaVersion",
    "id",
    "status",
    "submittedAt",
    "retentionDeleteAfter",
    "kind",
    "platform",
    "summary",
    "details",
    "sourceUrls",
    "consentToContact",
    "consentToPublicCredit",
    "attestations",
  ];
  const optionalKeys = ["version", "pageUrl", "publicCredit", "contactEmail"];
  const keys = Object.keys(submission);
  if (
    !requiredKeys.every((key) => keys.includes(key)) ||
    !keys.every((key) => requiredKeys.includes(key) || optionalKeys.includes(key))
  ) {
    return false;
  }

  const attestations = plainRecord(submission.attestations);
  return Boolean(
    submission.schemaVersion === 1 &&
      submission.id === expectedId &&
      submission.status === "new" &&
      typeof submission.submittedAt === "string" &&
      typeof submission.retentionDeleteAfter === "string" &&
      typeof submission.kind === "string" &&
      typeof submission.platform === "string" &&
      typeof submission.summary === "string" &&
      typeof submission.details === "string" &&
      Array.isArray(submission.sourceUrls) &&
      submission.sourceUrls.every((url) => typeof url === "string") &&
      typeof submission.consentToContact === "boolean" &&
      typeof submission.consentToPublicCredit === "boolean" &&
      attestations &&
      hasExactKeys(attestations, [
        "publicEvidenceOnly",
        "rightsToSubmit",
        "noConfidentialInformation",
      ]) &&
      attestations.publicEvidenceOnly === true &&
      attestations.rightsToSubmit === true &&
      attestations.noConfidentialInformation === true,
  );
}

async function readBoundedJson(response: Response): Promise<unknown> {
  const contentType = response.headers
    .get("content-type")
    ?.split(";", 1)[0]
    .trim()
    .toLowerCase();
  if (contentType !== "application/json") {
    throw new OperatorRequestError(
      "The production operator response was invalid.",
    );
  }

  const declaredLength = Number(response.headers.get("content-length"));
  if (
    Number.isFinite(declaredLength) &&
    declaredLength > maximumOperatorResponseBytes
  ) {
    throw new OperatorRequestError(
      "The production operator response was too large.",
    );
  }
  if (!response.body) {
    throw new OperatorRequestError(
      "The production operator response was invalid.",
    );
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let byteLength = 0;
  let text = "";
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      byteLength += value.byteLength;
      if (byteLength > maximumOperatorResponseBytes) {
        await reader.cancel("response-too-large").catch(() => undefined);
        throw new OperatorRequestError(
          "The production operator response was too large.",
        );
      }
      text += decoder.decode(value, { stream: true });
    }
    text += decoder.decode();
  } finally {
    reader.releaseLock();
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(text) as unknown;
  } catch {
    throw new OperatorRequestError(
      "The production operator response was invalid.",
    );
  }
  if (containsForbiddenKey(parsed) || containsUnsafeResponseText(parsed)) {
    throw new OperatorRequestError(
      "The production operator response was invalid.",
    );
  }
  return parsed;
}

function remoteFailure(status: number): OperatorRequestError {
  if (status === 401) {
    return new OperatorRequestError(
      "The production operator credential was not accepted.",
    );
  }
  if (status === 404) {
    return new OperatorRequestError("The submission was not found.");
  }
  if (status === 409) {
    return new OperatorRequestError(
      "The submission state did not permit that action.",
    );
  }
  if (status === 429) {
    return new OperatorRequestError(
      "Too many operator requests. Try again later.",
    );
  }
  if (status === 400 || status === 413 || status === 415) {
    return new OperatorRequestError(
      "The production operator request was rejected.",
    );
  }
  return new OperatorRequestError(
    "Submission moderation is unavailable in Production.",
  );
}

function validateOperatorResponse(
  request: OperatorRequest,
  value: unknown,
): unknown {
  const record = plainRecord(value);
  if (!record) {
    throw new OperatorRequestError(
      "The production operator response was invalid.",
    );
  }

  if (request.action === "list") {
    if (!hasExactKeys(record, ["items"]) || !Array.isArray(record.items)) {
      throw new OperatorRequestError(
        "The production operator response was invalid.",
      );
    }
    for (const item of record.items) {
      if (!validQueueMetadata(item)) {
        throw new OperatorRequestError(
          "The production operator response was invalid.",
        );
      }
    }
    return record.items;
  }

  if (request.action === "get") {
    if (
      !hasExactKeys(record, ["record", "metadata"]) ||
      !validStoredRecord(record.record, request.id) ||
      !validQueueMetadata(record.metadata, request.id)
    ) {
      throw new OperatorRequestError(
        "The production operator response was invalid.",
      );
    }
    return record;
  }

  const expectedKeys =
    request.action === "resolve"
      ? ["id", "resolved"]
      : ["id", "changed", "legalHold"];
  if (!hasExactKeys(record, expectedKeys) || record.id !== request.id) {
    throw new OperatorRequestError(
      "The production operator response was invalid.",
    );
  }
  if (request.action === "resolve" && record.resolved !== true) {
    throw new OperatorRequestError(
      "The production operator response was invalid.",
    );
  }
  if (
    request.action !== "resolve" &&
    (typeof record.changed !== "boolean" ||
      record.legalHold !== (request.action === "hold"))
  ) {
    throw new OperatorRequestError(
      "The production operator response was invalid.",
    );
  }
  return record;
}

async function sendOperatorRequest(
  request: OperatorRequest,
  operatorSecret: string | undefined,
  fetchRequest: FetchLike,
): Promise<unknown> {
  if (!operatorSecret || operatorSecret.length < 24) {
    throw new OperatorUsageError(
      "SUBMISSION_OPERATOR_SECRET is not configured for Production.",
    );
  }

  let response: Response;
  try {
    response = await fetchRequest(submissionOperatorEndpoint, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${operatorSecret}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
      cache: "no-store",
      redirect: "error",
      signal: AbortSignal.timeout(30_000),
    });
  } catch {
    throw new OperatorRequestError(
      "The production operator endpoint could not be reached.",
    );
  }

  if (!response.ok) throw remoteFailure(response.status);
  return validateOperatorResponse(request, await readBoundedJson(response));
}

export async function runModerationCommand(
  argv: string[],
  {
    operatorSecret,
    fetchRequest = fetch,
    stdinIsTTY = Boolean(process.stdin.isTTY),
    stdoutIsTTY = Boolean(process.stdout.isTTY),
    isCI = Boolean(process.env.CI),
    writeStdout = (value) => process.stdout.write(value),
    writeStderr = (value) => process.stderr.write(value),
  }: ModerationCommandOptions = {},
): Promise<void> {
  const [command, ...args] = argv;
  if (!command || command === "help" || command === "--help") {
    writeStdout(`${usage}\n`);
    return;
  }

  const terminal = { isCI, stdinIsTTY, stdoutIsTTY };
  let request: OperatorRequest;
  if (command === "list") {
    if (args.length !== 0) throw new OperatorUsageError(usage);
    request = { action: "list" };
  } else if (command === "get") {
    requireInteractiveTerminal("Private record retrieval", terminal);
    request = { action: "get", id: exactId(args) };
  } else if (
    command === "hold" ||
    command === "release-hold" ||
    command === "resolve"
  ) {
    requireInteractiveTerminal(
      command === "resolve" ? "Submission resolution" : "Legal-hold changes",
      terminal,
    );
    const id = confirmedId(args);
    request = { action: command, id, confirm: id };
  } else {
    throw new OperatorUsageError(usage);
  }

  const result = await sendOperatorRequest(
    request,
    operatorSecret,
    fetchRequest,
  );
  if (request.action === "get") {
    writeStderr(
      "Private submission content follows. Keep it out of logs, issues, chat, and shared files.\n",
    );
  }
  writeStdout(`${JSON.stringify(result, null, 2)}\n`);
}

function isDirectExecution(): boolean {
  const entrypoint = process.argv[1];
  if (!entrypoint) return false;
  return import.meta.url === pathToFileURL(resolve(entrypoint)).href;
}

if (isDirectExecution()) {
  const operatorSecret = captureOperatorSecret(process.env);
  void runModerationCommand(process.argv.slice(2), { operatorSecret }).catch(
    (error: unknown) => {
      if (
        error instanceof OperatorUsageError ||
        error instanceof OperatorRequestError
      ) {
        process.stderr.write(`${error.message}\n`);
      } else {
        process.stderr.write("The moderation command failed safely.\n");
      }
      process.exitCode = 1;
    },
  );
}
