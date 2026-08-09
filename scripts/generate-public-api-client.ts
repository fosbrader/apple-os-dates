import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import openapiTS, { astToString } from "openapi-typescript";
import { createPublicApiOpenApi } from "../src/lib/public-api/openapi";

const outputPath = resolve(
  process.cwd(),
  "src/lib/public-api/client.generated.ts",
);
const args = new Set(process.argv.slice(2));

if ([...args].some((argument) => argument !== "--check")) {
  throw new Error("Usage: tsx scripts/generate-public-api-client.ts [--check]");
}

async function main() {
  const document = createPublicApiOpenApi();
  const ast = await openapiTS(
    document as unknown as Parameters<typeof openapiTS>[0],
    { alphabetize: true },
  );
  const output = `${astToString(ast).trimEnd()}\n`;

  if (args.has("--check")) {
    let current = "";
    try {
      current = readFileSync(outputPath, "utf8");
    } catch {
      // The comparison below provides one stable remediation message for both
      // a missing and a stale generated file.
    }

    if (current !== output) {
      throw new Error(
        "Generated public API client types are stale. Run npm run api:client:generate and commit the result.",
      );
    }

    console.log("Generated public API client types are current.");
  } else {
    writeFileSync(outputPath, output);
    console.log(`Generated ${outputPath}.`);
  }
}

void main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
