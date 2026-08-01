import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { JSDOM } from "jsdom";

const here = dirname(fileURLToPath(import.meta.url));
const evidenceDirectory = resolve(process.argv[2] || "tmp/ios9-point-evidence");
const bundle = JSON.parse(
  readFileSync(resolve(here, "apple-ios-9-point-prerelease.json"), "utf8"),
);
const ledger = readFileSync(
  resolve(here, "apple-ios-9-point-prerelease.md"),
  "utf8",
);
const sha256 = (value) => createHash("sha256").update(value).digest("hex");
const collapse = (value) => value.replace(/\s+/g, " ").trim();
const normalizedText = (value) =>
  value
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/ﬁ/g, "fi")
    .replace(/ﬂ/g, "fl")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const artifactLockRows = [
  "9to5-ios-9-2-1-beta-1.html|157483|0f372ee0d191230bf40c4828f060e63cfcf342eb690698a0abe8bc99e5a1774e|.post-content|1479|b4b9481e6e927f1206f89a98181bd44f8dd89d01bdaab920a962d20bdbd862eb",
  "9to5-ios-9-2-1-beta-2.html|182011|f119faf37ff77e27f12d9bf302083564e740aac9299da2decdc59f3f3533defe|.post-content|1079|d2422a3f64b0c7676e4f6697f7272a3be171a2a18d3d518abf98ebf56cebd88f",
  "apple-about-ios-9-updates.html|1206612|6033be1cb520fbe88bc52fb6e153deb59e5a7907d30155b6e05502a9d1a976ee|#sections|25572|22f0e45073687e8d31de02760bf8bdd489b8c640d7f5ec00895d42564112aaa5",
  "apple-ios-sdk-9-1-final.html|15408|31dfa867d8fdd98191f8e98ca9cfc854f5832f62a31a6c9d4c5a263f62f495f4|#contents|2719|88c864ac0e4e60ef3fd5769c8bd7e4647791298755cb694a4fc9ff5e21ff9da9",
  "apple-ios-sdk-9-2-final.html|16595|78bbc26b4c92758f3d58309a21d53ab5dc23a82bc2cdba702f3e8c14fc9bc6c2|#contents|3587|68d514e5cd128012a01da6468c2c05b3d4d61cfb762b06331e5f4e7ebdcfb7a8",
  "apple-ios-sdk-9-3-final.html|15900|3a52dc18c163d6b8d1ad2c03c2c25fba590e3fb93bfc3a4c1f43ada95a687a45|#contents|3193|28ccdfc24d2307b6b1956b5c85112a4b505553d6dc7b89903d86a3ba9fb647c0",
  "idevice-ios-9-2-beta-2-notes.html|287738|c22b8ad87f37c3025618582ab7ea399ad00867324330bf7ae688090dd8e931d5|article|4709|c4e6ab44df9e49d05f06f0572854bf19955f3c93c13a51f4a72c3579cf3b128a",
  "macrumors-guide-ios-9-1.html|116110|70aec4d4f3d63148fe40ea623a2ebb39bb2c0dff7215736355bdf00f91bac58e|main|6053|52a94582bd181719695ee3bc85862ba42816cf608e53be7cdabb47207f078198",
  "macrumors-guide-ios-9-2-1.html|106827|e2352f45dd459df5cfd587d8170a54fd03dd5ba8a0fbcc14686281cbd75f171a|main|3370|9ed8dd5f5a112506db887064693bbc04604b7c69225c47ff7df686b478b75d64",
  "macrumors-guide-ios-9-2.html|114216|b5d39098517c2ff2def848ceb36c48130a64f3823cfefb74f40a5a73bf22f0ec|main|5548|9bf3422b7ccc95d6b597edf8db4ae26f32445c4b38fa0b05d5cb1f994a88fc82",
  "macrumors-guide-ios-9-3-2.html|118053|7a5e27b68cc664acf1563e43e6cfe80c98a47129d1ec6792f138d997c629f81d|main|6651|3a221776557c74d3206f4554255a279d7fbdbd9fdb31012553328e850822e021",
  "macrumors-guide-ios-9-3-3.html|110377|83bea8a491fcb474be2f9703e4a956dda289837fc971b36f957be2b6d2100141|main|4394|54479f0db3c6b5807cc6c7c1bc1b220bee1aa088185dae4e39f126cd24607612",
  "macrumors-guide-ios-9-3-page-2.html|120385|59e23eef6b13916eccbec2fb89204f88abe3dce93196a31b5c1f740dd229cabd|main|7385|182e8a6fde265e6a60991da1ee30c27224357dd99c4a46b3676b5106f2a1d046",
  "macrumors-guide-ios-9-3.html|139216|c75364c99601908e6e19b981f092f582a2708abb867134a839ebff5f276518dc|main|12913|a86674e9a9f0f13006293167a0bb1775d604d8ccff6a6543dea8b23b7e143c02",
  "mr-ios-9-1-beta-1.html|124670|8c28baafa9fac4c83836a6841f19b8c2b6ebb79c093fc088957aaebda2cdefb2|article|1645|986fad816f87629d75b8fddd00ad6a2db0a50aea71b4b79f0c6370456ce02fc1",
  "mr-ios-9-1-beta-2.html|126053|36a2795b8588ced8b1bf6e036b042af1d457d3c254eeb63c7c309a7f8c0a30e3|article|1630|479c724d57ec30391054520878f1f408a4c5f3c2b39c1aa7ae93e0841b75f8ba",
  "mr-ios-9-1-beta-3.html|123728|6e413c314e2bf555b7a9a1e39762f93da53e71a0e97c8fd46589c8ed41395d89|article|1330|133052183d29b84c2ca79d9b03bc45cc8230eb2ce28f14ce5729c5597bf7cd60",
  "mr-ios-9-1-beta-4.html|119643|99587e2af49b16ba0541ae6b527265a5372bb214991bd3c39d3f1f80d040bb0e|article|1239|cb29ca7dfd9817b3d9ae1b8ebb96b745bb270c20581e032d8f3b4def5178dfcc",
  "mr-ios-9-1-beta-5.html|124336|49c996ac23aabe3736026fdf97cf3609cccf4f786ddc6b05ef3ab937391b6a32|article|1441|81c7ad668a93473814a5ee9ea339c52d230b34e073cabc737967c088f23ce040",
  "mr-ios-9-1-public.html|126936|60eb2b2f065d41c10fcace7ffd975f57edebfdfd291b062262d8cd85ed97d80b|article|2279|6b5a5938cf6e2e6b45d6a7604e4fd969bf0f39215131f3239691dcc89e80db9b",
  "mr-ios-9-2-1-beta-1.html|125186|1c76ad6e94350294f30f451948cc6355a0900539978a7b95e1d01584cad3bc0e|article|1253|6af528f5358278833e13adafe3a1333f4de893976b491b469152dfc5b6a7efc9",
  "mr-ios-9-2-1-beta-2.html|124635|750e71af6f54d2bb2d3918c0870b984c8b5ad61cd7813f9563600fd1e3dbfc55|article|1089|9d3184cc0748455310ba49e9f72418622bc1e73abd838a78946569ad998a7b32",
  "mr-ios-9-2-1-public.html|126672|f43e61a1c5f6595f9f4601fb34281a1f7b09165ae2214798406cfb1c9f2a84c8|article|1641|e99fdef2bc380a640ecb1466ade065d71c8713353e2e06a36628c009a496fec8",
  "mr-ios-9-2-beta-1.html|126245|06b8575a95ca1b05d10a2c30322eea091722fa0ad8753ceeff06bf08ebca44f1|article|1957|c4a084b65dcb7b8f7172861e258263f99a7d721e20a14285c9cef92bcbc94974",
  "mr-ios-9-2-beta-2.html|127185|bd2a3692d12d29bf7afd8e14d73a053660c61b8093589f2b6d01060ee88a37eb|article|2311|49563fe3e433589df1f4ccdd56d20bd6a02f38295d8c50e7631e31c4cd7c5491",
  "mr-ios-9-2-beta-3.html|125718|7f7a4db040202b29c85a57ecf3fdab472aeea21055a4df777eadc2b8ed8a3458|article|1520|d96b8604b530ec7306db03d570cbfe5252b72bd95514cc2148f0e5616b6eff6b",
  "mr-ios-9-2-beta-4.html|127561|222baf2442ad8aaf451453173ed76e5d055280e4c666b35710e1b6633efbd7ba|article|1601|55ca62b9a6106728639d86c65502dc8ec53f609768cc2b1cfaa5c84c23e235cf",
  "mr-ios-9-2-public.html|132216|77ff2c4e6e34ca033b05db387a9b180935e5d589581ac57fe2e9d3a098d67e87|article|5016|e2432f96625d34e5c71cf69f93c1b088cc02279cb66c50cadb98b4f6d9e176ee",
  "mr-ios-9-3-1-public.html|127236|06a883615757025a636ce71db8656aef5851909e5558b03817878fe49ab37f5f|article|1497|20a53449a92bfad34a5d2fdcf4a45ffebdf8a234c325d35dcd893d15ddf18a80",
  "mr-ios-9-3-2-beta-1-game-center.html|126524|337378f4cd4de8f64398985e3497835d03e34f783d180fa79cd2328d114e24b4|article|2381|a433efea4b71231843275869d662f485f797b77d775d593d40c09f5db81fe4a9",
  "mr-ios-9-3-2-beta-1.html|125025|e93a4f297a16ffa8abfd6cf1c5b3208afcf64391165a5d4c3f84b4185cdb877c|article|1262|a9e20df35a5a7e95ed68ace6e855d619330c4fe56693008ab2175d6e15713cd1",
  "mr-ios-9-3-2-beta-2.html|125468|72fc751b2b285e24059b4b9d8de570feb539034664b12cd694340a8735ca051d|article|1555|9ec7d7aee5390529b71b9fe384da54ad1a4dce2641cf05e6a4b60d8cdc15d56a",
  "mr-ios-9-3-2-beta-3.html|126411|229d4221a70f5b4c1076dd3c1ffc3132ca5ec7ca52f3ae9dc300ac27e508acc4|article|1099|68c2a065f59072688d0a406aaf9726fbb5b9835f528ac95f24c0ecbaceb9ecfa",
  "mr-ios-9-3-2-beta-4.html|125077|2ee131afe91a98dba0073a84170a4d010ab89c7df1b386bba5d44a406357423a|article|1118|d778677da86f0323ddfdf5a985ded315c0c333060cd95307fed2e16245d6494e",
  "mr-ios-9-3-2-public.html|127191|32095ee90eb04e81c030c04160a7600c24db2bd73207b522c85b351615bb52b7|article|1922|e1f19d3547da4a26d2d64f7a6216fde39ab2a915861cfd38f2b30d607688ff9a",
  "mr-ios-9-3-3-beta-1.html|125336|f71b6bfbf7e17911933e3fa8ed11844a5ee4375e3cb2deef98abfd07d3027fd7|article|1111|d9b68767a16eb9122101d6a58afb34b06f4a4b492151ab619fae263b2684b17e",
  "mr-ios-9-3-3-beta-2.html|127591|148211ad04046e43b8eb0bc04d232be971fc68144c7a775ffba946d66fed6817|article|1125|535477488dad620ae4ba90da58b9ae276e116857f5d7b7130a74e7504c671789",
  "mr-ios-9-3-3-beta-3.html|125257|d67c37459e53eb4b1949fd703d500a54bab016d311c446efafc6cc75744c5ee2|article|1084|2936a1409ffcaeb4e3a52bb3ff774e1197f6aab0bb854f7162a875684e36fa8b",
  "mr-ios-9-3-3-beta-4.html|124571|4aa6f9a88422959834d43669dcb9f611fd815d8756e461b7b7b6d01698cba1b9|article|1256|894319662cdcdcc98d86279233b160229945745a3d2bdb6cbd9846da60cd14ab",
  "mr-ios-9-3-3-beta-5.html|125760|41c008cce00c57dff1dacd894979afdd97075c303e607d2169f2fed91a138e51|article|1317|dacd96f8b2f0ee58ab51877fcae4e1d8ecd3a418c8a4a4f955b8200b136c03da",
  "mr-ios-9-3-3-public.html|130159|f27d9f8e20364d5e945fd9afc3e7fa74a31807814c498fb12baea46fa723b768|article|1248|b1a89de1a02fc2c85f3c28f4030c416bacaebd39b308bee9cb9c6846cbf818df",
  "mr-ios-9-3-4-public.html|125319|24c65155afcdf9ad6de56f8879c6c8c3c2f68018b63c4c178bcf758577c5845b|article|1245|081a99e364bb584c917ec1403faef96641a8c7d48684d3cb4c274312ebd4fec3",
  "mr-ios-9-3-5-public.html|127978|06a5db221aa0bc200c76598b6b66c8362033c8aaab3375497dc7928003e3ce46|article|2112|471e4b4daf634d7ee89966ca06eb3dab0d3391f0db8be0148e497a603bf81c43",
  "mr-ios-9-3-beta-1-features.html|149560|bee7accc21a5fd168724cb3172b79d5ace4b82aef42856cf4923d668c3287d4e|article|6649|399a61b8d9c1a083f3f2be02ad16532c11718bf81d25162d9ac1ec6aaa9818c7",
  "mr-ios-9-3-beta-1.html|125072|26d0b836bceb55959e599ac2e9d7d4e2c31c705b91a455fd3474171a2cf1f5cd|article|2133|97aae4a09a4d498928351ee3006b521f1f131c482c5159e8d0b66099db648c8f",
  "mr-ios-9-3-beta-2-smart-connector.html|130241|c6261906c80efc5b9268e3b7fef524201837a8a04aabc4f428488f9afb44405c|article|1926|e56ffac4aa77b4918f6ae490697e285bfc6680fc2b3153ecd0ef4894ea6ab35d",
  "mr-ios-9-3-beta-2.html|135121|5b3fb8146df2718591b81f8a0a3909a5cc0c256be7da680f3bc7b729b1dfea03|article|3422|ee2b309848021d52d8bf088e90a128223273cba6004c174b8648d28d7a1d8500",
  "mr-ios-9-3-beta-3.html|128811|e266b69c17751b90b4290807c8a066bfc39ff19885660d3072851eed1bd2ac75|article|2175|3aaefdb9263cf242b585620bb4cc365af7a5aa307015b9214537d7a28d43eecb",
  "mr-ios-9-3-beta-4-1970-fix.html|125350|99c161f10d1cabeda55b770f99a7465990e456c0c7612a2ea82bab33fcb3d93f|article|2137|3fc3f53c3216cddbfa99f3bb2567d565ca2b08e7cabc4a93f1abd66a697b45de",
  "mr-ios-9-3-beta-4-5-night-shift.html|129171|290736c6f0b9ba011c6a775d05769123c937e5bbbc298756e1aa886edfc9ad8d|article|2282|c0b2dcf0a6d7d77c479845f9fe66a55b66dcf1ccfc3b358131135d443bda66bc",
  "mr-ios-9-3-beta-4.html|127381|83da264759f837c57643a0ed800acf2419243ba051c847030d65a0f22ee75647|article|2276|a38279be6e84ecf4371058258202d39c75fa235532237225a0a8543bdf559e8c",
  "mr-ios-9-3-beta-5.html|126449|330effcf21b28b938606c47552130238443a67940e2dcedd9414afc3e9cea16a|article|2797|9cdfb397c9231bc8c97e5557a2666c97e2ca92ed54a1599fb5d7fbd2348e5c61",
  "mr-ios-9-3-beta-6.html|126195|42ba70751137d251e119b50ee6e7d9698d9677ef18cd2180c28416df97aab330|article|2182|0de35f2c25cb8b728deadbca152af8c6ac690765308d0c4647de1c0e004367d3",
  "mr-ios-9-3-beta-7.html|129597|94ee49e8d97c7105edc06982051806d881ae8d5f5a3251749c958ef0878873a8|article|2192|d066651b90a0f9c4bfa74f515d53a478580ff66e285a8c8c3782ef58ae71e101",
  "mr-ios-9-3-public.html|144513|8c58e7551624b5ec53a62b597b6d3f3bf66513f5447eba8e2fe42f8a43775f03|article|4852|50038e82cbef6a5c75bc74282c307dc535939b9a6ee7b56f1f5fa5837a7c2208",
  "wayback-apple-education-preview-cdx.json|983|d64cb740222c568d5ac836e5fc5b986d01ebab89606e61459bf3108dcc8c3ebf|$json|982|8d924804e5deda916f0109a101c05001154344ad057d11bcee8094a2628c61b9",
  "wayback-apple-ios-9-3-education-preview-20160116.html|40476|72e4c994ddda184bf956c09733257ae576f4705996fd09823d820f49925f6c77|main|5408|05c934da14c9c26386344fca1602e4f727c6d25ed955f3dbd3409cd6c39bcb07",
  "wayback-apple-ios-9-3-preview-20160112.html|31986|ea1c9c3b98b845fd074a6ca6d419f78f9e8a5ba80c3031ff2aaae6bd6584d5f4|main|3211|b2df1164cefafa54864e09c40cecc8f066f6664d62634d9c17340b3f92fa07dc",
  "wayback-apple-ios-preview-cdx.json|826|d04b2c6afc08649300d36e929a6ceaca84879a638ab0635b48b36f74acbab1ce|$json|825|075eb7cf8b2ff37ba1c600fb521b1d96b783c044e48877c0bf7afeddd3eee5ab",
  "wayback-apple-ios-sdk-9-1-prerelease-cdx.json|3|37517e5f3dc66819f61f5a7bb8ace1921282415f10551d2defa5c3eb0985b570|$json|2|4f53cda18c2baa0c0354bb5f9a3ecbe5ed12ab4d8e11ba873c2f11161202b945",
  "wayback-apple-ios-sdk-9-1-prerelease-wildcard-cdx.json|3|37517e5f3dc66819f61f5a7bb8ace1921282415f10551d2defa5c3eb0985b570|$json|2|4f53cda18c2baa0c0354bb5f9a3ecbe5ed12ab4d8e11ba873c2f11161202b945",
  "wayback-apple-ios-sdk-9-2-prerelease-cdx.json|3|37517e5f3dc66819f61f5a7bb8ace1921282415f10551d2defa5c3eb0985b570|$json|2|4f53cda18c2baa0c0354bb5f9a3ecbe5ed12ab4d8e11ba873c2f11161202b945",
  "wayback-apple-ios-sdk-9-2-prerelease-wildcard-cdx.json|3|37517e5f3dc66819f61f5a7bb8ace1921282415f10551d2defa5c3eb0985b570|$json|2|4f53cda18c2baa0c0354bb5f9a3ecbe5ed12ab4d8e11ba873c2f11161202b945",
  "wayback-apple-ios-sdk-9-3-prerelease-cdx.json|3|37517e5f3dc66819f61f5a7bb8ace1921282415f10551d2defa5c3eb0985b570|$json|2|4f53cda18c2baa0c0354bb5f9a3ecbe5ed12ab4d8e11ba873c2f11161202b945",
  "wayback-apple-ios-sdk-9-3-prerelease-wildcard-cdx.json|3|37517e5f3dc66819f61f5a7bb8ace1921282415f10551d2defa5c3eb0985b570|$json|2|4f53cda18c2baa0c0354bb5f9a3ecbe5ed12ab4d8e11ba873c2f11161202b945",
];

const buffers = new Map();
const documents = new Map();
const normalized = new Map();
for (const row of artifactLockRows) {
  const [name, rawBytes, rawSha, selector, textBytes, textSha] = row.split("|");
  const buffer = readFileSync(resolve(evidenceDirectory, name));
  assert.equal(buffer.byteLength, Number(rawBytes), `${name} byte count`);
  assert.equal(sha256(buffer), rawSha, `${name} raw SHA-256`);

  let text;
  if (selector === "$json") {
    JSON.parse(buffer.toString("utf8"));
    text = collapse(buffer.toString("utf8"));
  } else {
    const document = new JSDOM(buffer).window.document;
    const node = document.querySelector(selector);
    assert(node, `${name} contains ${selector}`);
    text = collapse(node.textContent);
    documents.set(name, document);
  }
  assert.equal(
    Buffer.byteLength(text),
    Number(textBytes),
    `${name} text bytes`,
  );
  assert.equal(sha256(text), textSha, `${name} normalized SHA-256`);
  buffers.set(name, buffer);
  normalized.set(name, text);
}
assert.equal(buffers.size, 65, "retained artifact count");

const sourceFileByUrl = new Map([
  [
    "https://www.macrumors.com/2015/09/09/apple-seeds-first-ios-9-1-apple-tv-os-betas/",
    "mr-ios-9-1-beta-1.html",
  ],
  [
    "https://www.macrumors.com/2015/09/23/apple-seeds-second-ios-9-1-beta-developers/",
    "mr-ios-9-1-beta-2.html",
  ],
  [
    "https://www.macrumors.com/2015/10/27/ios-9-2-beta-1/",
    "mr-ios-9-2-beta-1.html",
  ],
  [
    "https://www.macrumors.com/2015/11/03/apple-seeds-second-ios-9-2-beta-to-developers/",
    "mr-ios-9-2-beta-2.html",
  ],
  [
    "https://www.macrumors.com/2016/01/11/apple-ios-9-3-first-beta/",
    "mr-ios-9-3-beta-1.html",
  ],
  [
    "https://www.macrumors.com/2016/01/25/apple-seeds-second-ios-9-3-beta/",
    "mr-ios-9-3-beta-2.html",
  ],
  [
    "https://www.macrumors.com/2016/02/08/apple-seeds-third-ios-9-3-beta/",
    "mr-ios-9-3-beta-3.html",
  ],
  [
    "https://www.macrumors.com/2016/02/22/apple-seeds-ios-9-3-beta-4/",
    "mr-ios-9-3-beta-4.html",
  ],
  [
    "https://www.macrumors.com/2016/03/01/apple-ios-9-3-beta-5-to-developers/",
    "mr-ios-9-3-beta-5.html",
  ],
  [
    "https://www.macrumors.com/2016/04/06/apple-seeds-first-ios-9-3-2-beta/",
    "mr-ios-9-3-2-beta-1.html",
  ],
  [
    "https://www.macrumors.com/2016/04/20/apple-seeds-second-ios-9-3-2-beta/",
    "mr-ios-9-3-2-beta-2.html",
  ],
  [
    "https://www.macrumors.com/2016/05/23/apple-seeds-first-beta-of-ios-9-3-3/",
    "mr-ios-9-3-3-beta-1.html",
  ],
  [
    "https://www.macrumors.com/2016/06/06/apple-ios-9-3-3-beta-2-to-developers/",
    "mr-ios-9-3-3-beta-2.html",
  ],
  [
    "https://www.macrumors.com/2015/10/21/apple-releases-ios-9-1/",
    "mr-ios-9-1-public.html",
  ],
  [
    "https://www.macrumors.com/2015/12/08/apple-releases-ios-9-2/",
    "mr-ios-9-2-public.html",
  ],
  [
    "https://www.macrumors.com/2016/03/21/apple-releases-ios-9-3/",
    "mr-ios-9-3-public.html",
  ],
  [
    "https://www.macrumors.com/2016/05/16/apple-releases-ios-9-3-2/",
    "mr-ios-9-3-2-public.html",
  ],
  [
    "https://www.macrumors.com/2016/07/18/apple-releases-ios-9-3-3/",
    "mr-ios-9-3-3-public.html",
  ],
  [
    "https://www.idevice.ro/2015/11/03/ios-9-2-beta-2/",
    "idevice-ios-9-2-beta-2-notes.html",
  ],
  [
    "https://developer.apple.com/library/archive/releasenotes/General/RN-iOSSDK-9.2/index.html",
    "apple-ios-sdk-9-2-final.html",
  ],
  [
    "https://web.archive.org/web/20160112035022/https://www.apple.com/ios/preview/",
    "wayback-apple-ios-9-3-preview-20160112.html",
  ],
  [
    "https://web.archive.org/web/20160116054816/https://www.apple.com/education/preview/",
    "wayback-apple-ios-9-3-education-preview-20160116.html",
  ],
  [
    "https://www.macrumors.com/2016/01/11/whats-new-in-ios-9-3/",
    "mr-ios-9-3-beta-1-features.html",
  ],
  [
    "https://www.macrumors.com/2016/01/28/ios-9-3-beta-2-smart-connector-accessory-firmware/",
    "mr-ios-9-3-beta-2-smart-connector.html",
  ],
  [
    "https://www.macrumors.com/2016/02/24/ios-9-3-beta-4-fixes-1970-date-bug/",
    "mr-ios-9-3-beta-4-1970-fix.html",
  ],
  [
    "https://www.macrumors.com/2016/03/02/night-shift-changes-low-power/",
    "mr-ios-9-3-beta-4-5-night-shift.html",
  ],
  [
    "https://www.macrumors.com/2016/04/12/ios-9-3-2-beta-fixes-game-center-bug/",
    "mr-ios-9-3-2-beta-1-game-center.html",
  ],
]);
assert.equal(sourceFileByUrl.size, 27, "source-map count");
assert.deepEqual(
  new Set(bundle.sources.map((source) => source.url)),
  new Set(sourceFileByUrl.keys()),
  "declared source/evidence closure",
);

const sourceProbeOverrides = new Map([
  [
    "https://developer.apple.com/library/archive/releasenotes/General/RN-iOSSDK-9.2/index.html",
    ["iOS SDK Release Notes for iOS 9.2", "Safari"],
  ],
  [
    "https://web.archive.org/web/20160112035022/https://www.apple.com/ios/preview/",
    ["A better experience every day. And night.", "Night Shift"],
  ],
  [
    "https://web.archive.org/web/20160116054816/https://www.apple.com/education/preview/",
    ["iOS in Education", "Shared iPad", "Apple School Manager"],
  ],
  [
    "https://www.macrumors.com/2016/01/11/whats-new-in-ios-9-3/",
    [
      "What's New in iOS 9.3",
      "may not be functional yet",
      "app suggestions were not available",
    ],
  ],
]);
const probesByFile = new Map();
for (const source of bundle.sources) {
  probesByFile.set(
    sourceFileByUrl.get(source.url),
    sourceProbeOverrides.get(source.url) || [source.title],
  );
}

const retainedOnlyProbes = new Map([
  [
    "9to5-ios-9-2-1-beta-1.html",
    ["first iOS 9.2.1 beta", "build number 13D11"],
  ],
  [
    "9to5-ios-9-2-1-beta-2.html",
    ["second beta of iOS 9.2.1", "build number of 13D14"],
  ],
  [
    "apple-about-ios-9-updates.html",
    ["About iOS 9 Updates", "iOS 9.3.6", "GPS location performance"],
  ],
  [
    "apple-ios-sdk-9-1-final.html",
    ["iOS SDK Release Notes for iOS 9.1", "Known Issues"],
  ],
  [
    "apple-ios-sdk-9-3-final.html",
    ["iOS SDK Release Notes for iOS 9.3", "App Store Known Issue"],
  ],
  ["macrumors-guide-ios-9-1.html", ["iOS 9.1 Articles", "Fifth iOS 9.1 Beta"]],
  [
    "macrumors-guide-ios-9-2-1.html",
    [
      "iOS 9.2.1 Articles",
      "First Beta of iOS 9.2.1",
      "Second Beta of iOS 9.2.1",
    ],
  ],
  ["macrumors-guide-ios-9-2.html", ["iOS 9.2 Articles", "Fourth iOS 9.2 Beta"]],
  [
    "macrumors-guide-ios-9-3-2.html",
    ["iOS 9.3.2 Articles", "Fourth Beta of iOS 9.3.2"],
  ],
  [
    "macrumors-guide-ios-9-3-3.html",
    ["iOS 9.3.3 Articles", "Fifth Beta of iOS 9.3.3"],
  ],
  ["macrumors-guide-ios-9-3-page-2.html", ["iOS 9.3", "First Beta of iOS 9.3"]],
  ["macrumors-guide-ios-9-3.html", ["iOS 9.3", "Seventh Beta of iOS 9.3"]],
  ["mr-ios-9-1-beta-3.html", ["Apple Seeds Third iOS 9.1 Beta"]],
  ["mr-ios-9-1-beta-4.html", ["Apple Seeds Fourth iOS 9.1 Beta"]],
  ["mr-ios-9-1-beta-5.html", ["Apple Seeds Fifth iOS 9.1 Beta"]],
  [
    "mr-ios-9-2-1-beta-1.html",
    ["First Beta of iOS 9.2.1", "Apple Developer Center"],
  ],
  ["mr-ios-9-2-1-beta-2.html", ["Second Beta of iOS 9.2.1", "13D14"]],
  [
    "mr-ios-9-2-1-public.html",
    ["Apple Releases iOS 9.2.1", "total of three betas"],
  ],
  ["mr-ios-9-2-beta-3.html", ["Apple Seeds Third iOS 9.2 Beta"]],
  ["mr-ios-9-2-beta-4.html", ["Apple Seeds Fourth iOS 9.2 Beta"]],
  ["mr-ios-9-3-1-public.html", ["Apple Releases iOS 9.3.1", "web link"]],
  ["mr-ios-9-3-2-beta-3.html", ["Third Beta of iOS 9.3.2"]],
  ["mr-ios-9-3-2-beta-4.html", ["Fourth Beta of iOS 9.3.2"]],
  ["mr-ios-9-3-3-beta-3.html", ["Third Beta of iOS 9.3.3"]],
  ["mr-ios-9-3-3-beta-4.html", ["Fourth Beta of iOS 9.3.3"]],
  ["mr-ios-9-3-3-beta-5.html", ["Fifth Beta of iOS 9.3.3"]],
  ["mr-ios-9-3-4-public.html", ["Apple Releases iOS 9.3.4", "security fix"]],
  ["mr-ios-9-3-5-public.html", ["Apple Releases iOS 9.3.5", "three critical"]],
  ["mr-ios-9-3-beta-6.html", ["Sixth Beta of iOS 9.3", "13E5231a"]],
  ["mr-ios-9-3-beta-7.html", ["Seventh Beta of iOS 9.3"]],
  [
    "wayback-apple-education-preview-cdx.json",
    ["20160112051111", "apple.com/education/preview"],
  ],
  [
    "wayback-apple-ios-preview-cdx.json",
    ["20160112003007", "apple.com/ios/preview"],
  ],
  ["wayback-apple-ios-sdk-9-1-prerelease-cdx.json", ["[]"]],
  ["wayback-apple-ios-sdk-9-1-prerelease-wildcard-cdx.json", ["[]"]],
  ["wayback-apple-ios-sdk-9-2-prerelease-cdx.json", ["[]"]],
  ["wayback-apple-ios-sdk-9-2-prerelease-wildcard-cdx.json", ["[]"]],
  ["wayback-apple-ios-sdk-9-3-prerelease-cdx.json", ["[]"]],
  ["wayback-apple-ios-sdk-9-3-prerelease-wildcard-cdx.json", ["[]"]],
]);
for (const [name, probes] of retainedOnlyProbes) {
  assert(!probesByFile.has(name), `${name} probe ownership`);
  probesByFile.set(name, probes);
}
assert.deepEqual(
  new Set(probesByFile.keys()),
  new Set(buffers.keys()),
  "every retained artifact has bounded probes",
);
for (const [name, probes] of probesByFile) {
  const text = normalizedText(normalized.get(name));
  for (const probe of probes) {
    assert(
      text.includes(normalizedText(probe)),
      `${name} contains probe: ${probe}`,
    );
  }
}

for (const source of bundle.sources) {
  const name = sourceFileByUrl.get(source.url);
  if (name.startsWith("wayback-")) continue;
  const canonical = documents
    .get(name)
    ?.querySelector('link[rel="canonical"]')?.href;
  if (canonical) {
    assert.equal(canonical, source.url, `${name} canonical source URL`);
  }
}

const expectedRoutes = [
  ["9.1", "beta-1", "2015-09-09", 1, 3, "mr-ios-9-1-beta-1.html"],
  ["9.1", "beta-2", "2015-09-23", 2, 1, "mr-ios-9-1-beta-2.html"],
  ["9.2", "beta-1", "2015-10-27", 1, 3, "mr-ios-9-2-beta-1.html"],
  ["9.2", "beta-2", "2015-11-03", 2, 10, "mr-ios-9-2-beta-2.html"],
  ["9.3", "beta-1", "2016-01-11", 1, 14, "mr-ios-9-3-beta-1.html"],
  ["9.3", "beta-2", "2016-01-25", 2, 5, "mr-ios-9-3-beta-2.html"],
  ["9.3", "beta-3", "2016-02-08", 3, 2, "mr-ios-9-3-beta-3.html"],
  ["9.3", "beta-4", "2016-02-22", 4, 3, "mr-ios-9-3-beta-4.html"],
  ["9.3", "beta-5", "2016-03-01", 5, 2, "mr-ios-9-3-beta-5.html"],
  ["9.3.2", "beta-1", "2016-04-06", 1, 2, "mr-ios-9-3-2-beta-1.html"],
  ["9.3.2", "beta-2", "2016-04-20", 2, 1, "mr-ios-9-3-2-beta-2.html"],
  ["9.3.3", "beta-1", "2016-05-23", 1, 1, "mr-ios-9-3-3-beta-1.html"],
  ["9.3.3", "beta-2", "2016-06-06", 2, 1, "mr-ios-9-3-3-beta-2.html"],
];
assert.equal(
  bundle.events.length,
  expectedRoutes.length,
  "content route count",
);
const publishedDate = (name) => {
  const match = buffers
    .get(name)
    .toString("utf8")
    .match(/"datePublished"\s*:\s*"(\d{4}-\d{2}-\d{2})/);
  assert(match, `${name} datePublished metadata`);
  return match[1];
};
const normalizedLedgerRows = new Set(
  ledger
    .split("\n")
    .filter((line) => line.startsWith("| iOS "))
    .map((line) =>
      line
        .split("|")
        .slice(1, -1)
        .map((cell) => cell.trim())
        .join("|"),
    ),
);
for (let index = 0; index < expectedRoutes.length; index += 1) {
  const [version, alias, date, sequence, changeCount, sourceFile] =
    expectedRoutes[index];
  const versionId = `version-ios-${version.replaceAll(".", "-")}`;
  const event = bundle.events[index];
  assert.equal(
    publishedDate(sourceFile),
    date,
    `${version}/${alias} source date`,
  );
  assert(
    normalizedLedgerRows.has(
      `iOS ${version} Beta ${sequence}|\`${alias}\`|${date}|${changeCount}|Approved archive`,
    ),
    `${version}/${alias} ledger row`,
  );
  assert.deepEqual(event.target, {
    releaseVersionId: versionId,
    routeAlias: alias,
  });
  assert.equal(event.identity.releaseVersionId, versionId);
  assert.equal(event.identity.platformId, "platform-ios");
  assert.equal(
    event.identity.stableEventId,
    `event:apple:ios:${version}:${alias}`,
  );
  assert.equal(event.identity.routeAlias, alias);
  assert.equal(event.identity.channel, "developerBeta");
  assert.equal(event.identity.appearanceDate, date);
  assert.equal(event.identity.sequence, sequence);
  assert.equal(event.identity.isRevision, false);
  assert.equal(event.identity.closesReleaseCycle, false);
  assert.equal(event.changes.length, changeCount);
  assert.equal(event.provenanceStatus, "editoriallyVerified");
  assert.deepEqual(event.editorialReview, {
    status: "approved",
    reviewedAt: "2026-07-30T13:06:56Z",
  });
  assert.equal(event.isIndexable, true);
}
assert.deepEqual(bundle.versions, [], "batch does not add versions");
assert.deepEqual(bundle.builds, [], "batch does not add builds");
assert(
  bundle.events.every(
    (event) =>
      event.target.routeAlias.startsWith("beta-") &&
      !["gm", "rc", "public"].includes(event.target.routeAlias),
  ),
  "content batch contains numbered developer betas only",
);

const expectedTimelineOnlyRoutes = [
  ["9.1", "beta-3", "2015-09-30", 3, "mr-ios-9-1-beta-3.html"],
  ["9.1", "beta-4", "2015-10-06", 4, "mr-ios-9-1-beta-4.html"],
  ["9.1", "beta-5", "2015-10-12", 5, "mr-ios-9-1-beta-5.html"],
  ["9.2", "beta-3", "2015-11-10", 3, "mr-ios-9-2-beta-3.html"],
  ["9.2", "beta-4", "2015-11-18", 4, "mr-ios-9-2-beta-4.html"],
  ["9.2.1", "beta-1", "2015-12-16", 1, "mr-ios-9-2-1-beta-1.html"],
  ["9.2.1", "beta-2", "2016-01-04", 2, "mr-ios-9-2-1-beta-2.html"],
  ["9.3", "beta-6", "2016-03-07", 6, "mr-ios-9-3-beta-6.html"],
  ["9.3", "beta-7", "2016-03-14", 7, "mr-ios-9-3-beta-7.html"],
  ["9.3.2", "beta-3", "2016-04-26", 3, "mr-ios-9-3-2-beta-3.html"],
  ["9.3.2", "beta-4", "2016-05-03", 4, "mr-ios-9-3-2-beta-4.html"],
  ["9.3.3", "beta-3", "2016-06-21", 3, "mr-ios-9-3-3-beta-3.html"],
  ["9.3.3", "beta-4", "2016-06-29", 4, "mr-ios-9-3-3-beta-4.html"],
  ["9.3.3", "beta-5", "2016-07-06", 5, "mr-ios-9-3-3-beta-5.html"],
];
const timelineOnlyRoutes = new Set(
  expectedTimelineOnlyRoutes.map(([version, alias]) => `${version}/${alias}`),
);
for (const [
  version,
  alias,
  date,
  sequence,
  sourceFile,
] of expectedTimelineOnlyRoutes) {
  assert.equal(
    publishedDate(sourceFile),
    date,
    `${version}/${alias} source date`,
  );
  assert(
    normalizedLedgerRows.has(
      `iOS ${version} Beta ${sequence}|\`${alias}\`|${date}|0|Timeline ledger only`,
    ),
    `${version}/${alias} ledger row`,
  );
}
assert.equal(timelineOnlyRoutes.size, 14, "timeline-only route count");
const contentRoutes = new Set(
  expectedRoutes.map(([version, alias]) => `${version}/${alias}`),
);
assert(
  [...timelineOnlyRoutes].every((route) => !contentRoutes.has(route)),
  "timeline-only routes are omitted from content",
);
assert.equal(
  new Set([...contentRoutes, ...timelineOnlyRoutes]).size,
  27,
  "all named route identities are closed without synthetic records",
);
assert(
  bundle.events.every(
    (event) =>
      ![
        "version-ios-9-2-1",
        "version-ios-9-3-1",
        "version-ios-9-3-4",
        "version-ios-9-3-5",
        "version-ios-9-3-6",
      ].includes(event.target.releaseVersionId),
  ),
  "point cycles without a substantive retained beta delta stay excluded",
);

const declaredUrls = new Set(bundle.sources.map((source) => source.url));
const usedUrls = new Set();
let citationReferences = 0;
let occurrenceCount = 0;
const definitions = new Map();
const recordCitations = (citations, path, requireNote = false) => {
  for (const citation of citations || []) {
    citationReferences += 1;
    usedUrls.add(citation.url);
    assert(declaredUrls.has(citation.url), `${path} source closure`);
    assert(citation.locator, `${path} locator`);
    if (requireNote) assert(citation.note, `${path} evidence note`);
  }
};
for (const event of bundle.events) {
  recordCitations(event.citations, `${event.identity.stableEventId} page`);
  for (const [index, block] of (event.article?.blocks || []).entries()) {
    recordCitations(
      block.citations,
      `${event.identity.stableEventId} article block ${index}`,
    );
  }
  for (const change of event.changes) {
    occurrenceCount += 1;
    assert(change.key.startsWith("ios-9-"), `${change.key} batch prefix`);
    assert(change.citations.length > 0, `${change.key} claim citations`);
    recordCitations(change.citations, change.key, true);
    const definition = {
      title: change.title,
      canonicalSummary: change.canonicalSummary,
      category: change.category,
    };
    const previous = definitions.get(change.key);
    if (previous) assert.deepEqual(definition, previous, change.key);
    else definitions.set(change.key, definition);
  }
}
assert.deepEqual(usedUrls, declaredUrls, "complete source/use closure");
assert.equal(occurrenceCount, 48, "selected occurrence count");
assert.equal(definitions.size, 46, "stable change-definition count");
assert.equal(citationReferences, 274, "citation-reference count");
assert.deepEqual(
  bundle.events.flatMap((event) =>
    event.changes
      .filter((change) => change.inheritance === "cumulative")
      .map(
        (change) =>
          `${event.target.releaseVersionId}/${event.target.routeAlias}:${change.key}`,
      ),
  ),
  [
    "version-ios-9-3/beta-1:ios-9-3-prerelease-health-app-discovery",
    "version-ios-9-3/beta-1:ios-9-3-prerelease-health-watch-activity",
  ],
  "exact cumulative preview-context inventory",
);

const recurrence = new Map();
for (const event of bundle.events) {
  for (const change of event.changes) {
    recurrence.set(change.key, [
      ...(recurrence.get(change.key) || []),
      `${event.target.releaseVersionId}/${event.target.routeAlias}:${change.action}`,
    ]);
  }
}
assert.deepEqual(
  recurrence.get("ios-9-3-prerelease-night-shift-low-power-coexistence"),
  ["version-ios-9-3/beta-4:removed", "version-ios-9-3-2/beta-2:fixed"],
  "Night Shift and Low Power transition",
);
assert.deepEqual(
  recurrence.get("ios-9-3-3-prerelease-ipad-pro-9-7-availability"),
  ["version-ios-9-3-3/beta-1:knownIssue", "version-ios-9-3-3/beta-2:fixed"],
  "9.7-inch iPad Pro availability transition",
);

const ignoredLocatorTokens = new Set(
  "a an and are as at be beta by changed developer fixed for from in into issue known notes observed of on release report state the this to update with".split(
    " ",
  ),
);
const stemLocatorToken = (token) =>
  token.length > 3 && token.endsWith("s") ? token.slice(0, -1) : token;
const locatorTokens = (value) =>
  new Set(
    normalizedText(value)
      .split(" ")
      .filter((token) => token.length > 1 && !ignoredLocatorTokens.has(token))
      .map(stemLocatorToken),
  );
const overlapCount = (left, right) =>
  [...left].filter((token) => right.has(token)).length;
const sourceTokenSets = new Map(
  [...sourceFileByUrl].map(([url, name]) => [
    url,
    locatorTokens(normalized.get(name)),
  ]),
);
let weakestLocatorOverlap = Number.POSITIVE_INFINITY;
let weakestClaimOverlap = Number.POSITIVE_INFINITY;
for (const event of bundle.events) {
  for (const change of event.changes) {
    for (const citation of change.citations) {
      const sourceTokens = sourceTokenSets.get(citation.url);
      const markerSet = locatorTokens(citation.locator);
      const claimSet = locatorTokens(
        `${change.title} ${change.canonicalSummary} ${change.summary}`,
      );
      const markerOverlap = overlapCount(markerSet, sourceTokens);
      const claimOverlap = overlapCount(claimSet, sourceTokens);
      assert(
        markerOverlap >= 1,
        `${change.key} locator resolves in ${sourceFileByUrl.get(citation.url)} (${citation.locator})`,
      );
      assert(
        claimOverlap >= 2,
        `${change.key} claim resolves in ${sourceFileByUrl.get(citation.url)}`,
      );
      weakestLocatorOverlap = Math.min(weakestLocatorOverlap, markerOverlap);
      weakestClaimOverlap = Math.min(weakestClaimOverlap, claimOverlap);
    }
  }
}

const words = (value) =>
  collapse(value)
    .toLowerCase()
    .match(/[a-z0-9][a-z0-9._:$-]*/g) || [];
const sourceTokens = new Map();
const fourGramPositions = new Map();
for (const [url, name] of sourceFileByUrl) {
  const tokens = words(normalized.get(name));
  sourceTokens.set(url, tokens);
  const positions = new Map();
  for (let index = 0; index + 4 <= tokens.length; index += 1) {
    const gram = tokens.slice(index, index + 4).join("|");
    const starts = positions.get(gram);
    if (starts) starts.push(index);
    else positions.set(gram, [index]);
  }
  fourGramPositions.set(url, positions);
}

const editorialStrings = [];
for (const event of bundle.events) {
  editorialStrings.push(event.summary);
  for (const block of event.article?.blocks || []) {
    editorialStrings.push(block.text);
  }
  for (const change of event.changes) {
    for (const field of [
      "title",
      "canonicalSummary",
      "summary",
      "verificationMethod",
    ]) {
      editorialStrings.push(change[field]);
    }
  }
}
assert(
  editorialStrings.every((value) => typeof value === "string" && value),
  "reader-facing fields are nonempty strings",
);
assert.equal(editorialStrings.length, 283, "copyright field count");

let maximumOverlapWords = 0;
let overlapPhrase = "";
let overlapSource = "";
let overlapEditorial = "";
for (const editorial of editorialStrings) {
  const editorialTokens = words(editorial);
  for (const [url, tokens] of sourceTokens) {
    const positions = fourGramPositions.get(url);
    for (let start = 0; start + 4 <= editorialTokens.length; start += 1) {
      const gram = editorialTokens.slice(start, start + 4).join("|");
      for (const sourceStart of positions.get(gram) || []) {
        let length = 4;
        while (
          start + length < editorialTokens.length &&
          sourceStart + length < tokens.length &&
          editorialTokens[start + length] === tokens[sourceStart + length]
        ) {
          length += 1;
        }
        if (length > maximumOverlapWords) {
          maximumOverlapWords = length;
          overlapPhrase = editorialTokens
            .slice(start, start + length)
            .join(" ");
          overlapSource = url;
          overlapEditorial = editorial;
        }
      }
    }
  }
}
assert(
  maximumOverlapWords <= 5,
  `copyright overlap exceeds 5 words: "${overlapPhrase}" from ${overlapSource} in "${overlapEditorial}"`,
);

const rawBytes = [...buffers.values()].reduce(
  (total, buffer) => total + buffer.byteLength,
  0,
);
assert.equal(rawBytes, 8_014_368, "evidence corpus byte count");

console.log(
  [
    "iOS 9 point-release prerelease evidence audit passed",
    `raw artifacts: ${buffers.size}`,
    `raw bytes: ${rawBytes}`,
    `normalized artifacts: ${normalized.size}`,
    "named route identities: 27",
    "content routes: 13 source-verifiable substantive milestones",
    "timeline-only routes: 14 named milestones without a fresh retained delta",
    "missing external beta cycles: iOS 9.3.1, 9.3.4, 9.3.5, and 9.3.6",
    "iOS 9.2.1 conflict: two exact named builds retained; aggregate third-beta sentence remains ledger-only",
    `selected occurrences/definitions: ${occurrenceCount}/${definitions.size}`,
    `citation references: ${citationReferences}`,
    `weakest locator/claim token overlap: ${weakestLocatorOverlap}/${weakestClaimOverlap}`,
    `copyright fields: ${editorialStrings.length}`,
    `maximum contiguous source overlap: ${maximumOverlapWords} words`,
    `longest overlap phrase: ${overlapPhrase}`,
  ].join("\n"),
);
