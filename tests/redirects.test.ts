import assert from "node:assert/strict";
import test from "node:test";
import nextConfig from "../next.config";

const DOTTED_LEAF_SOURCE = "/ios/:path*/:leaf([^/]+\\.[^/]+)";

test("legacy hosts permanently redirect to Version Record canonical routes", async () => {
  assert.equal(typeof nextConfig.redirects, "function");
  const redirects = await nextConfig.redirects!();

  for (const host of [
    "apple-os-dates.vercel.app",
  ]) {
    const catchAll = redirects.find(
      (redirect) =>
        redirect.source === "/:path*" &&
        redirect.has?.some(
          (condition) =>
            condition.type === "host" && condition.value === host,
        ),
    );

    assert.deepEqual(catchAll, {
      source: "/:path*",
      has: [{ type: "host", value: host }],
      destination: "https://www.versionrecord.com/:path*",
      permanent: true,
    });

    const hostRules = redirects.filter((redirect) =>
      redirect.has?.some(
        (condition) =>
          condition.type === "host" && condition.value === host,
      ),
    );
    const dottedIndex = hostRules.findIndex(
      (redirect) => redirect.source === DOTTED_LEAF_SOURCE,
    );
    const platformIndex = hostRules.findIndex(
      (redirect) => redirect.source === "/ios/:path*",
    );

    assert.deepEqual(hostRules[dottedIndex], {
      source: DOTTED_LEAF_SOURCE,
      has: [{ type: "host", value: host }],
      destination:
        "https://www.versionrecord.com/apple/ios/:path*/:leaf",
      permanent: true,
    });
    assert.deepEqual(hostRules[platformIndex], {
      source: "/ios/:path*",
      has: [{ type: "host", value: host }],
      destination: "https://www.versionrecord.com/apple/ios/:path*/",
      permanent: true,
    });
    assert.ok(
      dottedIndex !== -1 &&
        platformIndex !== -1 &&
        dottedIndex < platformIndex,
      "dotted-leaf rule must precede the platform catch-all",
    );
  }
});

test("legacy same-host platform routes redirect without trailing-slash chains", async () => {
  const redirects = await nextConfig.redirects!();
  const sameHostRules = redirects.filter((redirect) => !redirect.has);

  const dottedIndex = sameHostRules.findIndex(
    (redirect) => redirect.source === DOTTED_LEAF_SOURCE,
  );
  const catchAllIndex = sameHostRules.findIndex(
    (redirect) => redirect.source === "/ios/:path*",
  );

  assert.deepEqual(sameHostRules[dottedIndex], {
    source: DOTTED_LEAF_SOURCE,
    destination: "/apple/ios/:path*/:leaf",
    permanent: true,
  });
  assert.deepEqual(sameHostRules[catchAllIndex], {
    source: "/ios/:path*",
    destination: "/apple/ios/:path*/",
    permanent: true,
  });
  assert.ok(
    dottedIndex !== -1 &&
      catchAllIndex !== -1 &&
      dottedIndex < catchAllIndex,
    "dotted-leaf rule must precede the platform catch-all",
  );
});
