import Foundation
import PDFKit

struct Record {
  let component: String
  let status: String
  let text: String
  let issueIds: [String]
}

func normalized(_ value: String) -> String {
  value
    .replacingOccurrences(of: "\u{00a0}", with: " ")
    .replacingOccurrences(of: #"\s+"#, with: " ", options: .regularExpression)
    .replacingOccurrences(
      of: #"\s+Page\s+of\s+\d+\s+\d+$"#,
      with: "",
      options: .regularExpression
    )
    .trimmingCharacters(in: .whitespacesAndNewlines)
}

func documentText(at path: String) -> String {
  guard let document = PDFDocument(url: URL(fileURLWithPath: path)) else {
    fatalError("Could not open \(path)")
  }
  return (0..<document.pageCount)
    .compactMap { document.page(at: $0)?.string }
    .joined(separator: "\n")
}

func records(at path: String) -> [Record] {
  let text = documentText(at: path)
  let lines = text
    .split(separator: "\n", omittingEmptySubsequences: false)
    .map { normalized(String($0)) }

  let tocPattern = try! NSRegularExpression(pattern: #"^(.+?)\s+\d+\s*\.{3,}$"#)
  var components = Set<String>()
  for line in lines {
    let range = NSRange(line.startIndex..<line.endIndex, in: line)
    guard
      let match = tocPattern.firstMatch(in: line, range: range),
      let nameRange = Range(match.range(at: 1), in: line)
    else { continue }
    components.insert(normalized(String(line[nameRange])))
  }
  components.subtract([
    "About iOS 11 beta 3",
    "About iOS 11 beta 4",
    "About iOS 11 beta 5",
    "About iOS 11 beta 6",
    "About iOS 11 beta 7",
    "About iOS 11 beta 8",
    "About iOS 11 beta 10",
    "Bug Reporting",
    "Technical Support and Learning Resources",
    "Autosubmission of Diagnostic and Usage Data",
    "Notes and Known Issues",
  ])

  let statusHeadings = Set([
    "New Features",
    "New Issues",
    "Resolved Issues",
    "Known Issues",
    "Deprecations",
  ])
  let contentMarkers = lines.indices.filter { lines[$0] == "Notes and Known Issues" }
  guard let start = contentMarkers.last else {
    fatalError("No content marker in \(path)")
  }

  let issuePattern = try! NSRegularExpression(pattern: #"\b[1-9][0-9]{7}\b"#)
  var component = ""
  var status = ""
  var current: [String] = []
  var output: [Record] = []
  var skippingWorkaround = false

  func finish() {
    guard !current.isEmpty, !component.isEmpty, !status.isEmpty else {
      current = []
      return
    }
    let value = normalized(current.joined(separator: " "))
    let nsValue = value as NSString
    let matches = issuePattern.matches(
      in: value,
      range: NSRange(location: 0, length: nsValue.length)
    )
    output.append(
      Record(
        component: component,
        status: status,
        text: value,
        issueIds: matches.map { nsValue.substring(with: $0.range) }
      )
    )
    current = []
  }

  for line in lines[(start + 1)...] {
    if line.isEmpty
      || line.hasPrefix("Copyright ©")
      || line.range(of: #"^Page\s+of\s+"#, options: .regularExpression) != nil
    {
      continue
    }
    if components.contains(line) {
      finish()
      component = line
      status = ""
      skippingWorkaround = false
      continue
    }
    if statusHeadings.contains(line) {
      finish()
      status = line
      skippingWorkaround = false
      continue
    }
    if line.hasPrefix("Workaround:") {
      finish()
      skippingWorkaround = true
      continue
    }
    if line.hasPrefix("•") {
      finish()
      skippingWorkaround = false
      current = [normalized(String(line.dropFirst()))]
      continue
    }
    if !skippingWorkaround, !current.isEmpty {
      current.append(line)
    }
  }
  finish()
  return output
}

func words(in value: String) -> [String] {
  let pattern = try! NSRegularExpression(pattern: #"[A-Za-z0-9]+"#)
  let lower = value.lowercased()
  let nsValue = lower as NSString
  return pattern
    .matches(
      in: lower,
      range: NSRange(location: 0, length: nsValue.length)
    )
    .map { nsValue.substring(with: $0.range) }
    .filter { $0.range(of: #"^[0-9]{8}$"#, options: .regularExpression) == nil }
}

func editorialStrings(in value: Any) -> [String] {
  guard let object = value as? [String: Any] else { return [] }
  var output: [String] = []
  if let events = object["events"] as? [[String: Any]] {
    for event in events {
      if let summary = event["summary"] as? String { output.append(summary) }
      if
        let article = event["article"] as? [String: Any],
        let blocks = article["blocks"] as? [[String: Any]]
      {
        output.append(contentsOf: blocks.compactMap { $0["text"] as? String })
      }
      if let changes = event["changes"] as? [[String: Any]] {
        for change in changes {
          for key in ["title", "canonicalSummary", "summary"] {
            if let text = change[key] as? String { output.append(text) }
          }
        }
      }
    }
  }
  return output
}

if CommandLine.arguments.dropFirst().first == "--copyright" {
  guard CommandLine.arguments.count >= 4 else {
    fatalError(
      "Usage: audit-ios11-pdf-states.swift --copyright BUNDLE SOURCE..."
    )
  }
  let bundleData = try! Data(contentsOf: URL(fileURLWithPath: CommandLine.arguments[2]))
  let bundle = try! JSONSerialization.jsonObject(with: bundleData)
  let editorial = editorialStrings(in: bundle)
  let sourceText = CommandLine.arguments.dropFirst(3).map { path -> String in
    if path.lowercased().hasSuffix(".pdf") {
      return documentText(at: path)
    }
    return try! String(contentsOfFile: path, encoding: .utf8)
  }.joined(separator: "\n")
  let sourceTokens = words(in: sourceText)
  let tokenizedEditorial = editorial.map { ($0, words(in: $0)) }
  var bestCount = 0
  var bestPhrase = ""
  var bestEditorial = ""
  let maximum = min(
    30,
    tokenizedEditorial.map { $0.1.count }.max() ?? 0,
    sourceTokens.count
  )
  if maximum > 0 {
    for length in stride(from: maximum, through: 1, by: -1) {
      var sourceNgrams = Set<String>()
      if sourceTokens.count >= length {
        for start in 0...(sourceTokens.count - length) {
          sourceNgrams.insert(
            sourceTokens[start..<(start + length)].joined(separator: "|")
          )
        }
      }
      var found = false
      for (text, tokens) in tokenizedEditorial where tokens.count >= length {
        for start in 0...(tokens.count - length) {
          let phrase = tokens[start..<(start + length)].joined(separator: "|")
          if sourceNgrams.contains(phrase) {
            bestCount = length
            bestPhrase = phrase.replacingOccurrences(of: "|", with: " ")
            bestEditorial = text
            found = true
            break
          }
        }
        if found {
          break
        }
      }
      if found { break }
    }
  }
  print("max_overlap_words=\(bestCount)")
  print("phrase=\(bestPhrase)")
  print("editorial=\(bestEditorial)")
  exit(0)
}

guard CommandLine.arguments.count >= 2 else {
  fatalError("Usage: audit-ios11-pdf-states.swift CURRENT [PREVIOUS]")
}

let currentPath = CommandLine.arguments[1]
let current = records(at: currentPath)
let selectedStatuses = Set(["New Features", "New Issues", "Resolved Issues", "Deprecations"])

if CommandLine.arguments.count == 2 {
  for record in current where selectedStatuses.contains(record.status) {
    print(
      [
        "CURRENT_HEADING",
        record.component,
        record.status,
        record.issueIds.joined(separator: ","),
        record.text,
      ].joined(separator: "\t")
    )
  }
  exit(0)
}

let previous = records(at: CommandLine.arguments[2])
let previousTexts = Set(previous.map { $0.text })
let previousByIssue = Dictionary(
  grouping: previous.flatMap { record in record.issueIds.map { ($0, record) } },
  by: { $0.0 }
)

for record in current where selectedStatuses.contains(record.status) {
  let sameText = previousTexts.contains(record.text)
  let priorRecords = record.issueIds
    .flatMap { previousByIssue[$0] ?? [] }
    .map { $0.1 }
  let exactPrior = priorRecords.contains {
    $0.status == record.status && $0.text == record.text
  }
  let state: String
  if exactPrior || sameText {
    state = "SAME"
  } else if !priorRecords.isEmpty {
    state = "STATUS_OR_TEXT_CHANGE"
  } else {
    state = "ADDED"
  }
  guard state != "SAME" else { continue }
  let prior = priorRecords
    .map { "\($0.component)|\($0.status)|\($0.text)" }
    .joined(separator: " || ")
  print(
    [
      state,
      record.component,
      record.status,
      record.issueIds.joined(separator: ","),
      record.text,
      prior,
    ].joined(separator: "\t")
  )
}
