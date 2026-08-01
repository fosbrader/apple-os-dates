import Foundation
import PDFKit

func normalized(_ value: String) -> String {
  value
    .replacingOccurrences(of: "\u{00A0}", with: " ")
    .replacingOccurrences(of: "\u{2011}", with: "-")
    .replacingOccurrences(of: "\u{2013}", with: "-")
    .replacingOccurrences(of: "\u{2014}", with: "-")
    .replacingOccurrences(of: #"\s+"#, with: " ", options: .regularExpression)
    .trimmingCharacters(in: .whitespacesAndNewlines)
}

func text(of document: PDFDocument) -> String {
  (0..<document.pageCount)
    .compactMap { document.page(at: $0)?.string }
    .joined(separator: "\n")
}

func semanticBody(_ value: String, betaPattern: String) -> String {
  normalized(value)
    .lowercased()
    .replacingOccurrences(
      of: betaPattern,
      with: "beta n",
      options: .regularExpression
    )
}

guard CommandLine.arguments.count == 2 else {
  fatalError(
    "Usage: apple-ios-10-point-prerelease-audit.swift EVIDENCE_DIRECTORY"
  )
}

let directory = URL(fileURLWithPath: CommandLine.arguments[1])
let files = [
  "ios102-beta5-notes.pdf",
  "ios102-beta6-notes.pdf",
  "ios102-beta7-notes.pdf",
  "ios103-beta2-notes.pdf",
  "ios103-beta3-notes.pdf",
  "ios103-beta4-notes.pdf",
  "ios103-beta5-notes.pdf",
  "ios103-beta6-notes.pdf",
  "ios103-beta7-notes.pdf",
]

var documents: [String: PDFDocument] = [:]
var texts: [String: String] = [:]
for file in files {
  let url = directory.appendingPathComponent(file)
  guard let document = PDFDocument(url: url) else {
    fatalError("Could not open \(url.path)")
  }
  guard document.pageCount == 5 else {
    fatalError("\(file) page count changed: \(document.pageCount)")
  }
  let extracted = text(of: document)
  guard !extracted.isEmpty else {
    fatalError("\(file) produced no text")
  }
  documents[file] = document
  texts[file] = extracted
}

let probes: [String: [String]] = [
  "ios102-beta5-notes.pdf": [
    "iOS SDK Release Notes for iOS 10.2 Beta 5",
    "The TV app should no longer crash or show",
    "should no longer delete TV app library content",
    "prevents using the Universal Clipboard during an assessment",
    "deprecated, but missing the deprecation notice from the public header",
    "TV app cannot be restored after it is deleted",
  ],
  "ios102-beta6-notes.pdf": [
    "iOS SDK Release Notes for iOS 10.2 Beta 6",
  ],
  "ios102-beta7-notes.pdf": [
    "iOS SDK Release Notes for iOS 10.2 Beta 7",
  ],
  "ios103-beta2-notes.pdf": [
    "iOS Release Notes for iOS 10.3 beta 2",
    "By default, iOS 10.3 beta 1 automatically sends",
    "should no longer reach the “iCloud Analytics” page",
    "Nightly backups should no longer fail",
    "users should no longer be able to override the current iCloud Document Sync setting",
    "legacy iCloud button in Settings has been removed",
    "Scrolling in the Today View should no longer crash",
    "LAN Asset Cache functionality may not work as expected",
    "Lightning video adapters may not work as expected",
    "ability to update devices from a remote server is in development",
    "Shared iPad allows users to toggle settings that are usually unavailable",
    "new SiriKit car commands are still in development",
    "Location and Play Sound currently work only from the iOS device most recently used with your AirPods",
    "before the user is signed into iCloud can cause Settings to crash",
  ],
  "ios103-beta3-notes.pdf": [
    "iOS Release Notes for iOS 10.3 beta 3",
    "Location and Play Sound should now work as expected",
    "LAN Asset Cache functionality should now work as expected",
    "Lightning video adapters should now work as expected",
    "should no longer cause Settings to crash",
    "requires user confirmation before dialing",
  ],
  "ios103-beta4-notes.pdf": [
    "iOS Release Notes for iOS 10.3 beta 4",
    "Shared iPad settings should now work as expected",
  ],
  "ios103-beta5-notes.pdf": [
    "iOS Release Notes for iOS 10.3 beta 5",
  ],
  "ios103-beta6-notes.pdf": [
    "iOS Release Notes for iOS 10.3 beta 6",
  ],
  "ios103-beta7-notes.pdf": [
    "iOS Release Notes for iOS 10.3 beta 7",
  ],
]

var locatorAssertions = 0
for (file, fileProbes) in probes {
  let extracted = normalized(texts[file]!)
  let missing = fileProbes.filter {
    extracted.range(of: normalized($0), options: [.caseInsensitive]) == nil
  }
  guard missing.isEmpty else {
    fatalError("\(file) lost locators: \(missing)")
  }
  locatorAssertions += fileProbes.count
}

let normalized102 = ["ios102-beta5-notes.pdf", "ios102-beta6-notes.pdf",
  "ios102-beta7-notes.pdf"]
  .map { semanticBody(texts[$0]!, betaPattern: #"beta [5-7]"#) }
guard Set(normalized102).count == 1 else {
  fatalError("iOS 10.2 Beta 5 through Beta 7 no longer normalize equally")
}

let normalized103 = [
  "ios103-beta4-notes.pdf",
  "ios103-beta5-notes.pdf",
  "ios103-beta6-notes.pdf",
  "ios103-beta7-notes.pdf",
]
  .map { semanticBody(texts[$0]!, betaPattern: #"beta [4-7]"#) }
guard Set(normalized103).count == 1 else {
  fatalError("iOS 10.3 Beta 4 through Beta 7 no longer normalize equally")
}

let output: [String: Any] = [
  "pdfTextByFile": texts,
  "physicalPages": documents.values.reduce(0) { $0 + $1.pageCount },
  "pdfFiles": files.count,
  "locatorAssertions": locatorAssertions,
  "ios102EquivalentDocuments": 3,
  "ios103EquivalentDocuments": 4,
]
let data = try! JSONSerialization.data(
  withJSONObject: output,
  options: [.sortedKeys]
)
print(String(decoding: data, as: UTF8.self))
