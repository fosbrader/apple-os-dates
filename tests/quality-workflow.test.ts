import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("quality checks do not duplicate a tested pull request after merge", async () => {
  const workflow = await readFile(
    new URL("../.github/workflows/api-contract.yml", import.meta.url),
    "utf8",
  );

  assert.match(workflow, /^  pull_request:\s*$/m);
  assert.match(
    workflow,
    /^    types: \[opened, reopened, synchronize, ready_for_review\]\s*$/m,
  );
  assert.match(workflow, /^  workflow_dispatch:\s*$/m);
  assert.doesNotMatch(workflow, /^  push:\s*$/m);
  assert.match(
    workflow,
    /^    if: \$\{\{ github\.event_name == 'workflow_dispatch' \|\| github\.event\.pull_request\.draft == false \}\}\s*$/m,
  );

  assert.equal(workflow.match(/^      - run: npm test\s*$/gm)?.length, 1);
  assert.doesNotMatch(workflow, /^      - run: npm run api:contract\s*$/m);
  assert.doesNotMatch(workflow, /^      - run: npm run data:validate\s*$/m);
  assert.match(workflow, /^      - run: npm run api:client:check\s*$/m);
  assert.match(workflow, /^      - run: npx tsc --noEmit\s*$/m);
});
