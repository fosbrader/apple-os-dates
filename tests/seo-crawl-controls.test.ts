import assert from "node:assert/strict";
import test from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import { metadata as searchMetadata } from "../src/app/search/page";
import robots from "../src/app/robots";
import { TimelineView } from "../src/components/timeline/TimelineView";

test("internal search is crawlable but excluded from the search index", () => {
  assert.deepEqual(searchMetadata.robots, {
    index: false,
    follow: true,
    googleBot: {
      index: false,
      follow: true,
    },
  });
});

test("robots output advertises the sitemap without a non-standard host directive", () => {
  assert.equal(robots().host, undefined);
  assert.match(robots().sitemap?.toString() ?? "", /\/sitemap\.xml$/);
});

test("timeline ships a lightweight status shell before loading interactive data", () => {
  const html = renderToStaticMarkup(createElement(TimelineView));

  assert.match(html, /Loading the full release timeline/);
  assert.match(html, /archive summary and platform links remain available/i);
});
