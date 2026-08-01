const monomaniac = (
  key,
  postId,
  pageUrl,
  candidateId,
) => [
  {
    rawId: `monomaniac-${key}-html`,
    publisher: "Monomaniac Garage",
    publisherFamily: "Monomaniac Garage",
    url: pageUrl,
    mediaType: "text/html",
    captureKind: "publisherArticleHtml",
    candidateId,
  },
  {
    rawId: `monomaniac-${key}-api`,
    publisher: "Monomaniac Garage",
    publisherFamily: "Monomaniac Garage",
    url: `https://www.monomaniacgarage.com/wp-json/wp/v2/posts/${postId}`,
    mediaType: "application/json",
    captureKind: "publisherWordPressApiRecord",
    candidateId,
  },
];

export const sourceSpecs = [
  ...monomaniac(
    "151-pb3",
    53035,
    "https://www.monomaniacgarage.com/macos-15-1-sequoia-public-beta-3-24b5070a/",
    "candidate:apple:macos:15.1:public-beta-3",
  ),
  ...monomaniac(
    "153-pb3",
    53933,
    "https://www.monomaniacgarage.com/macos-15-3-sequoia-public-beta-3-24d5055b/",
    "candidate:apple:macos:15.3:public-beta-3",
  ),
  {
    rawId: "macerkopf-154-pb1-html",
    publisher: "Macerkopf",
    publisherFamily: "Macerkopf",
    url: "https://www.macerkopf.de/2025/02/24/public-betas-ios18-ipados18-macos15/",
    mediaType: "text/html",
    captureKind: "publisherArticleHtmlWithEmbeddedMetadata",
    candidateId: "candidate:apple:macos:15.4:public-beta-1",
  },
  ...monomaniac(
    "154-pb4",
    54366,
    "https://www.monomaniacgarage.com/macos-sequoia-15-4-public-beta-4-24e5238a/",
    "candidate:apple:macos:15.4:public-beta-4",
  ),
  ...monomaniac(
    "155-pb3",
    54767,
    "https://www.monomaniacgarage.com/macos-sequoia-15-5-public-beta-3-24f5068b/",
    "candidate:apple:macos:15.5:public-beta-3",
  ),
  ...monomaniac(
    "264-pb4",
    58779,
    "https://www.monomaniacgarage.com/macos-tahoe-26-4-public-beta-4-25e5233c/",
    "candidate:apple:macos:26.4:public-beta-4",
  ),
  ...monomaniac(
    "265-pb3",
    59442,
    "https://www.monomaniacgarage.com/macos-tahoe-26-5-public-beta-3-25f5068a/",
    "candidate:apple:macos:26.5:public-beta-3",
  ),
  ...monomaniac(
    "266-pb3",
    60130,
    "https://www.monomaniacgarage.com/macos-tahoe-26-6-public-beta-3-25g5052e/",
    "candidate:apple:macos:26.6:public-beta-3",
  ),
];

