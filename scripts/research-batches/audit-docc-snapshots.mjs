import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { basename } from "node:path";

function fail(message) {
  throw new Error(message);
}

function textFromInline(value) {
  if (!value || typeof value !== "object") return "";
  if (typeof value.text === "string") return value.text;
  if (typeof value.code === "string") return value.code;
  if (Array.isArray(value.inlineContent)) {
    return value.inlineContent.map(textFromInline).join("");
  }
  return "";
}

function textFromContent(value) {
  if (!value || typeof value !== "object") return "";
  if (Array.isArray(value.inlineContent)) {
    return value.inlineContent.map(textFromInline).join("");
  }
  if (Array.isArray(value.content)) {
    return value.content.map(textFromContent).filter(Boolean).join(" ");
  }
  return "";
}

function normalizeText(value) {
  return value.replace(/\s+/g, " ").trim();
}

function issueIds(value) {
  return [
    ...new Set(value.match(/\b(?:FB\d{8,}|[1-9]\d{7,8})\b/g) || []),
  ].sort();
}

function recordKey(record) {
  if (record.issueIds.length > 0) return record.issueIds.join("|");
  return createHash("sha256")
    .update(`${record.section}|${record.status}|${record.text}`)
    .digest("hex")
    .slice(0, 20);
}

function extractRecords(payload) {
  const records = [];
  for (const contentSection of payload.primaryContentSections || []) {
    let section = "General";
    let status = "Notes";
    for (const node of contentSection.content || []) {
      if (node.type === "heading") {
        if (node.level === 3) {
          section = normalizeText(node.text || "General");
          status = "Notes";
        } else if (node.level === 4) {
          status = normalizeText(node.text || "Notes");
        }
        continue;
      }
      if (node.type !== "unorderedList") continue;
      for (const item of node.items || []) {
        const text = normalizeText(textFromContent(item));
        if (!text) continue;
        const record = {
          section,
          status,
          text,
          issueIds: issueIds(text),
        };
        records.push({ ...record, key: recordKey(record) });
      }
    }
  }
  return records;
}

function snapshot(path, payload) {
  const records = extractRecords(payload);
  return {
    path,
    file: basename(path),
    title: payload.metadata?.title || "Untitled",
    sha256: createHash("sha256").update(JSON.stringify(payload)).digest("hex"),
    records,
  };
}

function compare(before, after) {
  const beforeByKey = new Map(
    before.records.map((record) => [record.key, record]),
  );
  const afterByKey = new Map(
    after.records.map((record) => [record.key, record]),
  );
  return {
    before: {
      file: before.file,
      title: before.title,
      records: before.records.length,
    },
    after: {
      file: after.file,
      title: after.title,
      records: after.records.length,
    },
    added: after.records.filter((record) => !beforeByKey.has(record.key)),
    removed: before.records.filter((record) => !afterByKey.has(record.key)),
    changed: after.records
      .filter((record) => {
        const prior = beforeByKey.get(record.key);
        return (
          prior &&
          (prior.section !== record.section ||
            prior.status !== record.status ||
            prior.text !== record.text)
        );
      })
      .map((record) => ({
        before: beforeByKey.get(record.key),
        after: record,
      })),
  };
}

const paths = process.argv.slice(2);
if (paths.length === 0) {
  fail(
    "Pass one or more archived Apple DocC JSON paths. Adjacent paths are diffed in order.",
  );
}

const snapshots = await Promise.all(
  paths.map(async (path) =>
    snapshot(path, JSON.parse(await readFile(path, "utf8"))),
  ),
);

console.log(
  JSON.stringify(
    {
      snapshots: snapshots.map(({ records, ...item }) => ({
        ...item,
        recordCount: records.length,
      })),
      diffs: snapshots
        .slice(1)
        .map((after, index) => compare(snapshots[index], after)),
    },
    null,
    2,
  ),
);
