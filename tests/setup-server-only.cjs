// eslint-disable-next-line @typescript-eslint/no-require-imports -- Node preload must populate the CommonJS module cache before tests load.
const Module = require("node:module");

// Next aliases this marker during its build. The native Node test runner does
// not, so mirror Next's documented test mapping without changing React exports.
const markerPath = require.resolve("server-only");
const markerModule = new Module(markerPath, module);
markerModule.filename = markerPath;
markerModule.loaded = true;
markerModule.exports = {};
require.cache[markerPath] = markerModule;
