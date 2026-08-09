import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import {
  captureOperatorSecret,
  OperatorRequestError,
  OperatorUsageError,
  runModerationCommand,
  submissionOperatorEndpoint,
} from "../scripts/moderate-submissions";

const operatorSecret = "operator-secret-at-least-24-characters";
const id = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";

test("operator bootstrap reads one fixed Keychain item and sanitizes before Node starts", () => {
  const packageJson = JSON.parse(
    readFileSync(new URL("../package.json", import.meta.url), "utf8"),
  ) as { scripts: Record<string, string> };
  const bootstrap = readFileSync(
    new URL("../scripts/run-submission-operator.sh", import.meta.url),
    "utf8",
  );
  const provisioner = readFileSync(
    new URL("../scripts/provision-submission-operator.exp", import.meta.url),
    "utf8",
  );

  assert.equal(
    packageJson.scripts["submissions:moderate"],
    "/usr/bin/env -u BASH_ENV -u ENV -u SHELLOPTS -u BASHOPTS -u PS4 /bin/bash --noprofile --norc -p scripts/run-submission-operator.sh",
  );
  assert.equal(
    packageJson.scripts["submissions:operator:provision"],
    "/usr/bin/expect scripts/provision-submission-operator.exp",
  );
  assert.doesNotMatch(
    packageJson.scripts["submissions:moderate"],
    /npx|vercel|env run|SUBMISSION_OPERATOR_SECRET/i,
  );
  const bootstrapService = bootstrap.match(/vr_keychain_service="([^"]+)"/);
  const provisionerService = provisioner.match(/set service "([^"]+)"/);
  assert.equal(bootstrapService?.[1], "com.versionrecord.submission-operator.v1");
  assert.equal(provisionerService?.[1], bootstrapService?.[1]);
  assert.match(bootstrap, /set \+x/);
  assert.match(bootstrap, /vr_keychain_account=\$\(\/usr\/bin\/id -un/);
  assert.match(bootstrap, /\/usr\/bin\/security login-keychain/);
  assert.match(bootstrap, /\/usr\/bin\/security find-generic-password/);
  assert.match(bootstrap, /-a "\$vr_keychain_account"/);
  assert.match(bootstrap, /-s "\$vr_keychain_service"/);
  assert.match(bootstrap, /-w \\\n    "\$vr_keychain_path" 2>\/dev\/null/);
  assert.doesNotMatch(bootstrap, /security (?:add|delete)-generic-password/);
  assert.doesNotMatch(bootstrap, /\$\{SUBMISSION_OPERATOR_SECRET-/);
  assert.doesNotMatch(bootstrap, /\bnpx\b|\bvercel\b/);
  assert.match(bootstrap, /for vr_environment_name in \$\(compgen -e\)/);
  assert.match(bootstrap, /unset "\$vr_environment_name"/);
  assert.match(
    bootstrap,
    /export SUBMISSION_OPERATOR_SECRET="\$vr_operator_secret"/,
  );
  assert.doesNotMatch(
    bootstrap,
    /exec [\s\S]*SUBMISSION_OPERATOR_SECRET=/,
  );
  assert.doesNotMatch(bootstrap, /\/usr\/bin\/env -i/);
  assert.doesNotMatch(bootstrap, /BLOB_READ_WRITE_TOKEN=/);
  assert.doesNotMatch(bootstrap, /VERCEL_OIDC_TOKEN=/);
  assert.doesNotMatch(bootstrap, /SANITY_API_TOKEN=/);
  assert.ok(
    bootstrap.indexOf("find-generic-password") <
      bootstrap.indexOf("for vr_environment_name"),
  );
  assert.ok(
    bootstrap.indexOf("for vr_environment_name") <
      bootstrap.indexOf('exec "$vr_node_binary"'),
  );
});

test("operator provisioner keeps the generated credential out of argv and files", () => {
  const provisioner = readFileSync(
    new URL("../scripts/provision-submission-operator.exp", import.meta.url),
    "utf8",
  );
  const commandBlock = provisioner.match(
    /set command \[list \\([\s\S]*?)\]\n\nset update_failed/,
  )?.[0];

  assert.ok(commandBlock);
  assert.match(provisioner, /exec \/usr\/bin\/openssl rand -base64 48/);
  assert.match(provisioner, /\[string length \$secret\] < 64/);
  assert.match(provisioner, /log_user 0/);
  assert.match(provisioner, /\/opt\/homebrew\/bin\/npx/);
  assert.match(provisioner, /\/usr\/local\/bin\/npx/);
  assert.doesNotMatch(provisioner, /set path \$env\(PATH\)/);
  assert.match(provisioner, /exec \/usr\/bin\/dscl/);
  assert.match(provisioner, /exec \/usr\/bin\/security login-keychain/);
  assert.match(provisioner, /exec \/usr\/bin\/security default-keychain/);
  assert.match(provisioner, /\$default_keychain ne \$keychain/);
  assert.match(provisioner, /expected_link_digest "[0-9a-f]{64}"/);
  assert.match(provisioner, /exec \/usr\/bin\/plutil -extract projectId raw/);
  assert.match(provisioner, /exec \/usr\/bin\/plutil -extract orgId raw/);
  assert.doesNotMatch(provisioner, /prj_|team_/);
  assert.match(provisioner, /set temporary_directory "\/private\/tmp"/);
  assert.doesNotMatch(provisioner, /env\((?:HOME|PATH|TMPDIR)\)/);
  assert.match(provisioner, /vercel@58\.9\.0/);
  assert.match(commandBlock, /\/usr\/bin\/env \\\n  -i/);
  assert.match(commandBlock, /\/usr\/bin\/perl \\\n  -e \\\n  \{alarm 180; exec @ARGV or exit 127\}/);
  assert.match(commandBlock, /\$npx_path/);
  assert.match(commandBlock, /env \\\n  add \\\n  SUBMISSION_OPERATOR_SECRET \\\n  production/);
  assert.match(commandBlock, /--sensitive/);
  assert.match(commandBlock, /--force/);
  assert.match(commandBlock, /--yes/);
  assert.match(commandBlock, /--no-color/);
  assert.doesNotMatch(commandBlock, /\$(?:secret|previous)/);
  assert.doesNotMatch(commandBlock, /SUBMISSION_OPERATOR_SECRET=/);
  assert.doesNotMatch(commandBlock, /env (?:run|pull)/);
  assert.match(
    provisioner,
    /set pipeline \[linsert \$command 0 \|\][\s\S]*lappend pipeline >@ \$null_channel 2>@1[\s\S]*open \$pipeline w[\s\S]*puts -nonewline \$channel "\$value\\n"/,
  );
  assert.match(provisioner, /printf output && printf error >&2/);
  assert.match(
    provisioner,
    /spawn -noecho \/usr\/bin\/security add-generic-password[\s\S]*?-T \/usr\/bin\/security \\\n    -w\n/,
  );
  assert.doesNotMatch(provisioner, /add-generic-password \\\n    -U/);
  assert.match(provisioner, /send -- "\$value\\r"/);
  assert.match(provisioner, /retype password for new item:/);
  assert.equal(provisioner.match(/send -- "\$value\\r"/g)?.length, 2);
  assert.match(provisioner, /restore_keychain/);
  assert.match(provisioner, /security delete-generic-password/);
  assert.match(provisioner, /proc delete_keychain_item/);
  assert.match(
    provisioner,
    /store_keychain \$account \$service \$label \$previous/,
  );
  assert.match(provisioner, /set secret ""[\s\S]*set previous ""[\s\S]*log_user 1/);
  assert.match(provisioner, /Do not redeploy; rerun the provision command first/);
  assert.match(provisioner, /The Vercel update did not complete/);
  assert.doesNotMatch(provisioner, /--value/);
  assert.doesNotMatch(provisioner, /-w\s+\$(?:secret|value)/);
  assert.doesNotMatch(
    provisioner,
    /SUBMISSION_OPERATOR_SECRET=\$(?:secret|value)/,
  );
  assert.doesNotMatch(provisioner, /mktemp|temporary.*(?:secret|credential)/i);
});

function jsonResponse(body: unknown, status = 200): Response {
  return Response.json(body, { status });
}

test("operator CLI captures only its credential and scrubs inherited secrets", () => {
  const environment: NodeJS.ProcessEnv = {
    NODE_ENV: "test",
    SUBMISSION_OPERATOR_SECRET: ` ${operatorSecret} `,
    SUBMISSION_MONITOR_SECRET: "monitor-secret",
    CRON_SECRET: "cron-secret",
    TURNSTILE_SECRET_KEY: "turnstile-secret",
    SANITY_API_TOKEN: "sanity-token",
    VERCEL_OIDC_TOKEN: "oidc-token",
    BLOB_READ_WRITE_TOKEN: "blob-token",
    BLOB_STORE_ID: "store_identifier",
    ORDINARY_SETTING: "retained",
  };

  assert.equal(captureOperatorSecret(environment), operatorSecret);
  assert.deepEqual(environment, {
    NODE_ENV: "test",
    ORDINARY_SETTING: "retained",
  });
});

test("operator CLI posts the safe list action to the fixed HTTPS endpoint", async () => {
  const items = [
    {
      id,
      submittedOn: "2026-08-08",
      storageUpdatedAt: "2026-08-08T20:40:00.000Z",
      legalHold: false,
    },
  ];
  const output: string[] = [];
  let requestUrl = "";
  let requestInit: RequestInit | undefined;

  await runModerationCommand(["list"], {
    operatorSecret,
    fetchRequest: async (input, init) => {
      requestUrl = String(input);
      requestInit = init;
      return jsonResponse({ items });
    },
    writeStdout: (value) => output.push(value),
  });

  assert.equal(requestUrl, submissionOperatorEndpoint);
  assert.equal(new URL(requestUrl).protocol, "https:");
  assert.equal(requestInit?.method, "POST");
  assert.equal(requestInit?.redirect, "error");
  assert.equal(requestInit?.cache, "no-store");
  assert.deepEqual(JSON.parse(String(requestInit?.body)), { action: "list" });
  const headers = new Headers(requestInit?.headers);
  assert.equal(headers.get("authorization"), `Bearer ${operatorSecret}`);
  assert.equal(headers.get("content-type"), "application/json");
  assert.doesNotMatch(requestUrl, new RegExp(operatorSecret));
  assert.doesNotMatch(String(requestInit?.body), new RegExp(operatorSecret));
  assert.deepEqual(JSON.parse(output.join("")), items);
});

test("operator CLI blocks private reads and writes before the network outside a TTY", async () => {
  let requests = 0;
  const options = {
    operatorSecret,
    fetchRequest: async () => {
      requests += 1;
      return jsonResponse({});
    },
    stdinIsTTY: false,
    stdoutIsTTY: true,
    isCI: false,
  };

  await assert.rejects(
    runModerationCommand(["get", id], options),
    OperatorUsageError,
  );
  await assert.rejects(
    runModerationCommand(["resolve", id, "--confirm", id], options),
    OperatorUsageError,
  );
  assert.equal(requests, 0);
});

test("operator CLI requires canonical IDs and byte-identical confirmation", async () => {
  let requests = 0;
  const options = {
    operatorSecret,
    fetchRequest: async () => {
      requests += 1;
      return jsonResponse({});
    },
    stdinIsTTY: true,
    stdoutIsTTY: true,
    isCI: false,
  };

  await assert.rejects(
    runModerationCommand(["get", id.toUpperCase()], options),
    /exact lowercase UUID/,
  );
  await assert.rejects(
    runModerationCommand(
      ["hold", id, "--confirm", id.toUpperCase()],
      options,
    ),
    /must match exactly/,
  );
  assert.equal(requests, 0);
});

test("operator CLI keeps private get output interactive and explicit", async () => {
  const output: string[] = [];
  const warnings: string[] = [];
  const response = {
    record: {
      schemaVersion: 1,
      id,
      status: "new",
      submittedAt: "2026-08-08T20:40:00.000Z",
      retentionDeleteAfter: "2027-02-04",
      kind: "correction",
      platform: "iOS",
      summary: "Private report",
      details: "Private report detail that is available only to the operator.",
      sourceUrls: ["https://support.apple.com/example"],
      consentToContact: false,
      consentToPublicCredit: false,
      attestations: {
        publicEvidenceOnly: true,
        rightsToSubmit: true,
        noConfidentialInformation: true,
      },
    },
    metadata: {
      id,
      submittedOn: "2026-08-08",
      storageUpdatedAt: "2026-08-08T20:40:00.000Z",
      legalHold: false,
    },
  };

  await runModerationCommand(["get", id], {
    operatorSecret,
    fetchRequest: async (_input, init) => {
      assert.deepEqual(JSON.parse(String(init?.body)), { action: "get", id });
      return jsonResponse(response);
    },
    stdinIsTTY: true,
    stdoutIsTTY: true,
    isCI: false,
    writeStdout: (value) => output.push(value),
    writeStderr: (value) => warnings.push(value),
  });

  assert.deepEqual(JSON.parse(output.join("")), response);
  assert.match(warnings.join(""), /Private submission content follows/);
});

test("operator CLI never prints terminal or bidi controls from a response", async () => {
  const unsafeCharacters = [
    "\u009b",
    "\u061c",
    "\u200e",
    "\u200f",
    "\u2028",
    "\u2029",
    "\u202a",
    "\u202b",
    "\u202c",
    "\u202d",
    "\u202e",
    "\u2066",
    "\u2067",
    "\u2068",
    "\u2069",
  ];

  for (const character of unsafeCharacters) {
    const output: string[] = [];
    const warnings: string[] = [];
    await assert.rejects(
      runModerationCommand(["get", id], {
        operatorSecret,
        fetchRequest: async () =>
          jsonResponse({
            record: {
              id,
              summary: `Private report${character}`,
            },
            metadata: {
              id,
              submittedOn: "2026-08-08",
              storageUpdatedAt: "2026-08-08T20:40:00.000Z",
              legalHold: false,
            },
          }),
        stdinIsTTY: true,
        stdoutIsTTY: true,
        isCI: false,
        writeStdout: (value) => output.push(value),
        writeStderr: (value) => warnings.push(value),
      }),
      /response was invalid/,
    );
    assert.deepEqual(output, []);
    assert.deepEqual(warnings, []);
  }
});

test("operator CLI sends repeated confirmation but never returns it", async () => {
  const output: string[] = [];
  await runModerationCommand(["hold", id, "--confirm", id], {
    operatorSecret,
    fetchRequest: async (_input, init) => {
      assert.deepEqual(JSON.parse(String(init?.body)), {
        action: "hold",
        id,
        confirm: id,
      });
      return jsonResponse({ id, changed: true, legalHold: true });
    },
    stdinIsTTY: true,
    stdoutIsTTY: true,
    isCI: false,
    writeStdout: (value) => output.push(value),
  });

  assert.deepEqual(JSON.parse(output.join("")), {
    id,
    changed: true,
    legalHold: true,
  });
  assert.doesNotMatch(output.join(""), /confirm/);
});

test("operator CLI rejects unconfigured access and redacts remote error bodies", async () => {
  let requests = 0;
  await assert.rejects(
    runModerationCommand(["list"], {
      fetchRequest: async () => {
        requests += 1;
        return jsonResponse({ items: [] });
      },
    }),
    /SUBMISSION_OPERATOR_SECRET is not configured/,
  );
  assert.equal(requests, 0);

  await assert.rejects(
    runModerationCommand(["list"], {
      operatorSecret,
      fetchRequest: async () =>
        new Response(
          "moderation/submissions/private@example.com/private-record.json",
          { status: 503, headers: { "Content-Type": "text/plain" } },
        ),
    }),
    (error: unknown) => {
      assert.ok(error instanceof OperatorRequestError);
      assert.equal(
        error.message,
        "Submission moderation is unavailable in Production.",
      );
      assert.doesNotMatch(
        error.message,
        /moderation\/submissions|private@example|record\.json/i,
      );
      return true;
    },
  );
});

test("operator CLI rejects forbidden storage fields and oversized responses", async () => {
  await assert.rejects(
    runModerationCommand(["list"], {
      operatorSecret,
      fetchRequest: async () =>
        jsonResponse({
          items: [
            {
              id,
              submittedOn: "2026-08-08",
              storageUpdatedAt: "2026-08-08T20:40:00.000Z",
              legalHold: false,
              pathname: "moderation/submissions/private.json",
            },
          ],
        }),
    }),
    /response was invalid/,
  );

  await assert.rejects(
    runModerationCommand(["get", id], {
      operatorSecret,
      stdinIsTTY: true,
      stdoutIsTTY: true,
      isCI: false,
      fetchRequest: async () =>
        jsonResponse({
          record: {
            schemaVersion: 1,
            id,
            status: "new",
            operatorSecret: "must-not-print",
          },
          metadata: {
            id,
            submittedOn: "2026-08-08",
            storageUpdatedAt: "2026-08-08T20:40:00.000Z",
            legalHold: false,
          },
        }),
    }),
    /response was invalid/,
  );

  await assert.rejects(
    runModerationCommand(["list"], {
      operatorSecret,
      fetchRequest: async () =>
        new Response("{}", {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Content-Length": "1048577",
          },
        }),
    }),
    /response was too large/,
  );
});
