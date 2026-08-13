import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
  CopyCodeButton,
  copyStatusAnnouncement,
} from "../src/app/api/CopyCodeButton";
import { Footer } from "../src/components/layout/Footer";
import {
  readThemePreference,
  storeThemePreference,
} from "../src/components/layout/ThemeToggle";

function source(path: string): string {
  return readFileSync(new URL(path, import.meta.url), "utf8");
}

test("news surfaces use defined design tokens", () => {
  const css = `${source("../src/app/globals.css")}\n${source("../src/app/ledger.css")}`;
  const definitions = new Set(
    [...css.matchAll(/--([a-z][a-z\d-]*)\s*:/gi)].map((match) => match[1]),
  );
  const newsSource = [
    source("../src/app/news/page.tsx"),
    source("../src/app/news/[slug]/page.tsx"),
  ].join("\n");
  const uses = [
    ...newsSource.matchAll(/var\(--([a-z][a-z\d-]*)\)/gi),
  ].map((match) => match[1]);

  assert.ok(uses.length > 0);
  for (const token of uses) {
    assert.ok(definitions.has(token), `--${token} must be defined`);
  }
});

test("footer explains build metadata and links to site news", () => {
  const previousVersion = process.env.NEXT_PUBLIC_SITE_VERSION;
  const previousUpdatedAt = process.env.NEXT_PUBLIC_SITE_UPDATED_AT;
  process.env.NEXT_PUBLIC_SITE_VERSION = "2026.08.12.1234";
  process.env.NEXT_PUBLIC_SITE_UPDATED_AT = "2026-08-12T16:34:00.000Z";

  try {
    const html = renderToStaticMarkup(createElement(Footer));

    assert.match(html, /href="\/news\/?"[^>]*>Site news</);
    assert.match(html, /Build version/);
    assert.match(html, /2026\.08\.12\.1234/);
    assert.match(html, />Built /);
    assert.match(html, /not content freshness/);
  } finally {
    if (previousVersion === undefined) {
      delete process.env.NEXT_PUBLIC_SITE_VERSION;
    } else {
      process.env.NEXT_PUBLIC_SITE_VERSION = previousVersion;
    }
    if (previousUpdatedAt === undefined) {
      delete process.env.NEXT_PUBLIC_SITE_UPDATED_AT;
    } else {
      process.env.NEXT_PUBLIC_SITE_UPDATED_AT = previousUpdatedAt;
    }
  }
});

test("footer keeps its mobile call-to-action spacing", () => {
  const css = source("../src/app/globals.css");
  const mediaStart = css.indexOf("@media (max-width: 700px)");
  const mediaEnd = css.indexOf("@media", mediaStart + 1);
  const mobileRules = css.slice(mediaStart, mediaEnd);

  assert.ok(mediaStart >= 0 && mediaEnd > mediaStart);
  assert.match(
    mobileRules,
    /\.site-footer__lead \.text-link\s*\{[\s\S]*?margin-top:/,
  );
  assert.doesNotMatch(mobileRules, /\.site-footer__lead \.button\s*\{/);
});

test("theme preferences fall back when browser storage is unavailable", () => {
  let stored: string | null = "dark";
  const storage = {
    getItem: () => stored,
    setItem: (_key: string, value: string) => {
      stored = value;
    },
  };

  assert.deepEqual(readThemePreference(storage), {
    storageAvailable: true,
    theme: "dark",
  });
  stored = "invalid";
  assert.deepEqual(readThemePreference(storage, "light"), {
    storageAvailable: true,
    theme: "system",
  });
  assert.equal(storeThemePreference(storage, "light"), true);
  assert.equal(stored, "light");

  const blockedStorage = {
    getItem: () => {
      throw new Error("Storage blocked");
    },
    setItem: () => {
      throw new Error("Storage blocked");
    },
  };
  assert.deepEqual(readThemePreference(blockedStorage, "light"), {
    storageAvailable: false,
    theme: "light",
  });
  assert.equal(storeThemePreference(blockedStorage, "dark"), false);
});

test("copy controls expose polite assistive feedback", () => {
  const html = renderToStaticMarkup(
    createElement(CopyCodeButton, {
      value: "curl https://www.versionrecord.com/api/v1/",
      label: "request example",
      className: "copy-button",
    }),
  );

  assert.match(html, /role="status"/);
  assert.match(html, /aria-live="polite"/);
  assert.match(html, /aria-atomic="true"/);
  assert.equal(copyStatusAnnouncement("idle", "request example"), "");
  assert.equal(
    copyStatusAnnouncement("copied", "request example"),
    "Copied request example.",
  );
  assert.equal(
    copyStatusAnnouncement("failed", "request example"),
    "Could not copy request example.",
  );
});
