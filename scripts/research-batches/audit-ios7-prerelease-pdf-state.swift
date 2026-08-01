import Foundation
import PDFKit

func documentText(_ document: PDFDocument) -> String {
  (0..<document.pageCount)
    .compactMap { document.page(at: $0)?.string }
    .joined(separator: "\n")
}

func normalize(_ value: String) -> String {
  value
    .replacingOccurrences(of: "\u{00A0}", with: " ")
    .replacingOccurrences(of: "\u{2011}", with: "-")
    .replacingOccurrences(of: "\u{2013}", with: "-")
    .replacingOccurrences(of: "\u{2014}", with: "-")
    .replacingOccurrences(of: #"\s+"#, with: " ", options: .regularExpression)
    .trimmingCharacters(in: .whitespacesAndNewlines)
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
      "Usage: audit-ios7-prerelease-pdf-state.swift --copyright BUNDLE SOURCE..."
    )
  }
  let bundleData = try! Data(
    contentsOf: URL(fileURLWithPath: CommandLine.arguments[2])
  )
  let bundle = try! JSONSerialization.jsonObject(with: bundleData)
  let editorial = editorialStrings(in: bundle)
  let sourceText = CommandLine.arguments.dropFirst(3).map { path -> String in
    if path.lowercased().hasSuffix(".pdf") {
      guard
        let document = PDFDocument(url: URL(fileURLWithPath: path))
      else {
        fatalError("Could not open \(path)")
      }
      return documentText(document)
    }
    return String(
      decoding: try! Data(contentsOf: URL(fileURLWithPath: path)),
      as: UTF8.self
    )
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

guard CommandLine.arguments.count == 3 else {
  fatalError(
    "Usage: audit-ios7-prerelease-pdf-state.swift BETA1_PARTIAL_PDF BETA3_PDF"
  )
}

guard
  let beta1 = PDFDocument(
    url: URL(fileURLWithPath: CommandLine.arguments[1])
  ),
  let beta3 = PDFDocument(
    url: URL(fileURLWithPath: CommandLine.arguments[2])
  )
else {
  fatalError("Could not open one or both iOS 7 PDF states")
}

let beta1Text = normalize(documentText(beta1))
let beta1MetadataTitle = String(
  describing:
    beta1.documentAttributes?[PDFDocumentAttribute.titleAttribute] ?? ""
)
let beta1CreationDate = String(
  describing:
    beta1.documentAttributes?[PDFDocumentAttribute.creationDateAttribute] ?? ""
)
let beta1Probes = [
  "iOS SDK Release Notes for iOS 7.0",
  "iOS Developer Library",
  "Introduction",
  "OS X v10.8.3",
]
let missingBeta1 = beta1Probes.filter {
  beta1Text.range(of: $0, options: [.caseInsensitive]) == nil
}

let beta3Text = normalize(documentText(beta3))
let beta3MetadataTitle = String(
  describing:
    beta3.documentAttributes?[PDFDocumentAttribute.titleAttribute] ?? ""
)
let beta3CreationDate = String(
  describing:
    beta3.documentAttributes?[PDFDocumentAttribute.creationDateAttribute] ?? ""
)
let beta2RetrospectiveProbes = [
  "AirDrop in iOS 7 Seed 2 or later is not compatible with AirDrop in iOS 7 Seed 1",
  "Passbook did not validate the back fields on passes completely",
  "Starting with Seed 2, apps default to using the new view controller-based status bar management system",
]
let beta3OccurrenceProbes = [
  "advancing to the next track may fail",
  "Audio volume may increase dramatically",
  "keyboard is not present in the iCloud Keychain approval dialog",
  "change the country associated with a phone number",
  "Reset All Contents and Settings",
  "approval request will not be displayed if their screens are off",
  "no longer supported on secondary iCloud accounts",
  "rare occasions, users might experience difficulties setting up iCloud Keychain",
  "launching Messages presents an empty message list",
  "existing Messages database may be deleted",
  "attachments on two separate threads",
  "MPMediaPickerController has been disabled",
  "Newsstand background downloads that use HTTP basic or digest authentication",
  "per-app settings are not honored",
  "CrashReporter logs will no longer be copied",
  "Passcode Lock and Auto-lock time settings",
  "duplicate push notifications or no notification",
  "app switcher does not show all of the suspended apps",
  "device without a passcode is connected to an untrusted computer",
  "UISwitchOnTintColors is always green",
  "Reminders does not work with VoiceOver",
  "iCloud Keychain in iOS 7 Seed 3 is not backward compatible",
  "startStreamWithName",
  "sendResourceAtURL",
  "tasks now start suspended rather than running",
  "PKPassLibraryDidCancelAddPasses",
  "Switzerland, France, Spain, Germany, Poland, Finland",
]
let allBeta3Probes =
  beta2RetrospectiveProbes + beta3OccurrenceProbes
let missingBeta3 = allBeta3Probes.filter {
  beta3Text.range(of: $0, options: [.caseInsensitive]) == nil
}
let fixedHeadings =
  beta3Text.components(separatedBy: "Fixed in Seed 3").count - 1

guard
  beta1.pageCount == 1,
  beta3.pageCount == 12,
  beta1MetadataTitle == "iOS 7 Release Notes:",
  beta3MetadataTitle == "iOS 7 Release Notes:",
  beta1CreationDate.hasPrefix("2013-06-11 18:57:05"),
  beta3CreationDate.hasPrefix("2013-07-08 17:21:11"),
  missingBeta1.isEmpty,
  beta3Text.localizedCaseInsensitiveContains(
    "iOS SDK Release Notes for iOS 7 Seed 3"
  ),
  beta3Text.localizedCaseInsensitiveContains("Updated: 2013-"),
  beta3Text.localizedCaseInsensitiveContains("07-07"),
  fixedHeadings == 10,
  beta2RetrospectiveProbes.count == 3,
  beta3OccurrenceProbes.count == 27,
  missingBeta3.isEmpty
else {
  fatalError(
    "iOS 7 PDF audit failed: beta1Pages=\(beta1.pageCount), beta3Pages=\(beta3.pageCount), fixedHeadings=\(fixedHeadings), missingBeta1=\(missingBeta1), missingBeta3=\(missingBeta3)"
  )
}

print("beta1_pages=\(beta1.pageCount)")
print("beta3_pages=\(beta3.pageCount)")
print("beta3_fixed_headings=\(fixedHeadings)")
print("beta2_retrospective_locators=\(beta2RetrospectiveProbes.count)")
print("beta3_occurrence_locators=\(beta3OccurrenceProbes.count)")
