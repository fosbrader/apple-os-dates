import Foundation
import PDFKit

func documentText(at path: String) -> String {
  guard let document = PDFDocument(url: URL(fileURLWithPath: path)) else {
    fatalError("Could not open \(path)")
  }
  return (0..<document.pageCount)
    .compactMap { document.page(at: $0)?.string }
    .joined(separator: "\n")
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
          for key in [
            "title", "canonicalSummary", "summary", "verificationMethod",
          ] {
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
      "Usage: audit-ios8-pdf-state.swift --copyright BUNDLE SOURCE..."
    )
  }
  let bundleData = try! Data(
    contentsOf: URL(fileURLWithPath: CommandLine.arguments[2])
  )
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
        if found { break }
      }
      if found { break }
    }
  }
  print("max_overlap_words=\(bestCount)")
  print("phrase=\(bestPhrase)")
  print("editorial=\(bestEditorial)")
  exit(0)
}

guard CommandLine.arguments.count == 2 else {
  fatalError("Usage: audit-ios8-pdf-state.swift BETA5_PDF")
}
let path = CommandLine.arguments[1]
guard let document = PDFDocument(url: URL(fileURLWithPath: path)) else {
  fatalError("Could not open \(path)")
}
let text = documentText(at: path)
let normalizedText = text
  .replacingOccurrences(of: "\u{2011}", with: "-")
  .replacingOccurrences(of: "\u{2013}", with: "-")
  .replacingOccurrences(of: #"\s+"#, with: " ", options: .regularExpression)
let locators = [
  "rampToVideoZoomFactor",
  "maxBracketedCaptureStillImageCount",
  "restoration of an iCloud backup",
  "Now Playing screen",
  "CKErrorZoneBusy",
  "App icons in the document picker",
  "Document providers may hang",
  "profiled with Instruments",
  "control of location access",
  "bundle display name",
  "landscape orientation",
  "NPR HLS station",
  "approving device is locked",
  "Using the recovery option",
  "predictive text",
  "Caps Lock",
  "VoiceOverTouch",
  "Shadow samplers",
  "downloading an album",
  "launch in portrait",
  "intrinsic content size",
]
let missing = locators.filter {
  normalizedText.range(of: $0, options: [.caseInsensitive]) == nil
}
let fixedHeadings =
  text.components(separatedBy: "Fixed in beta 5").count - 1
guard
  document.pageCount == 11,
  normalizedText.contains("iOS SDK Release Notes for iOS 8.0 Beta 5"),
  normalizedText.contains("Updated: 2014-08-03"),
  fixedHeadings == 15,
  locators.count == 21,
  missing.isEmpty
else {
  fatalError(
    "Beta 5 PDF audit failed: pages=\(document.pageCount), headings=\(fixedHeadings), missing=\(missing)"
  )
}
print("pages=\(document.pageCount)")
print("fixed_headings=\(fixedHeadings)")
print("selected_locator_assertions=\(locators.count)")
