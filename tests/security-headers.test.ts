import assert from "node:assert/strict";
import test from "node:test";
import nextConfig from "../next.config";

test("responses use baseline security headers without framework disclosure", async () => {
  assert.equal(nextConfig.poweredByHeader, false);
  assert.equal(typeof nextConfig.headers, "function");

  const rules = await nextConfig.headers!();
  const globalRule = rules.find((rule) => rule.source === "/:path*");
  const headers = new Map(
    globalRule?.headers.map((header) => [header.key, header.value]),
  );

  assert.equal(headers.get("X-Content-Type-Options"), "nosniff");
  assert.equal(
    headers.get("Referrer-Policy"),
    "strict-origin-when-cross-origin",
  );
  assert.equal(
    headers.get("Permissions-Policy"),
    "camera=(), microphone=(), geolocation=()",
  );
});
