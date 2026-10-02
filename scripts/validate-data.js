const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const indexHtml = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");
const inlineScripts = [...indexHtml.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((match) => match[1]);
const dataScript = inlineScripts.find((script) => script.includes("const rhsPlantDatabase"));

if (!dataScript) {
  throw new Error("Could not find inlined plant data in index.html.");
}

const context = { window: {}, globalThis: {} };
vm.createContext(context);
vm.runInContext(dataScript, context);

const { focusGroupIds, hardinessDict, rhsPlantDatabase } = context.window.RHSPlantData;

const expectedFocusNames = [
  "Araucaria araucana",
  "Buxus sempervirens",
  "× Cuprocyparis leylandii",
  "Daphne bholua",
  "Ilex aquifolium",
  "Monstera deliciosa",
  "Salvia rosmarinus",
  "Sarcococca confusa",
  "Skimmia japonica",
  "Taxus baccata",
  "Viburnum davidii"
].sort();

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

const names = rhsPlantDatabase.map((plant) => plant.botanicalName);
const ids = rhsPlantDatabase.map((plant) => plant.id);
const focusNames = rhsPlantDatabase
  .filter((plant) => focusGroupIds.includes(plant.id))
  .map((plant) => plant.botanicalName)
  .sort();

assert(rhsPlantDatabase.length === 46, `Expected 46 PCA1 plants, found ${rhsPlantDatabase.length}.`);
assert(new Set(ids).size === ids.length, "Plant IDs must be unique.");
assert(JSON.stringify(focusNames) === JSON.stringify(expectedFocusNames), `Focus group mismatch: ${focusNames.join(", ")}`);
assert(!names.includes("Rosmarinus officinalis"), "Rosmarinus officinalis must not replace Salvia rosmarinus.");

rhsPlantDatabase.forEach((plant) => {
  assert(plant.sourceUrl.startsWith("https://www.rhs.org.uk/"), `${plant.botanicalName} must cite an RHS URL.`);
  assert(hardinessDict[plant.hardiness], `${plant.botanicalName} has unknown hardiness key ${plant.hardiness}.`);
  ["light", "aspect", "pH", "soil"].forEach((field) => {
    assert(plant[field] && !plant[field].startsWith("Any "), `${plant.botanicalName} has unlabelled '${plant[field]}' in ${field}.`);
  });
});

assert(!indexHtml.includes('src="./plant-data.js"'), "index.html must be standalone and not reference plant-data.js.");
assert(indexHtml.includes('<body class="dark-mode">'), "index.html must default to dark mode.");
assert(indexHtml.includes("RHS L2 PCA1 plant ID learning aid"), "index.html must use the learning aid title.");
assert(indexHtml.includes("Batch 1 (11 Plants)"), "index.html must label the current focus group as Batch 1.");
assert(indexHtml.includes("Light Exposure"), "index.html must label Light Exposure.");
assert(indexHtml.includes("Aspect"), "index.html must label Aspect.");
assert(indexHtml.includes("pH"), "index.html must label pH.");
assert(indexHtml.includes("Soil Type"), "index.html must label Soil Type.");
assert(indexHtml.includes("Moisture"), "index.html must split soil moisture into its own row.");
assert(indexHtml.includes("spec-highlight"), "index.html must keep highlight styling for specific memorisation criteria.");
assert(indexHtml.includes("isMemorisationSpecific"), "index.html must only highlight non-Any criteria values.");
assert(indexHtml.includes("normalizeAnyEquivalent"), "index.html must normalise complete RHS option sets to Any.");
assert(indexHtml.includes("splitSoilAndMoisture"), "index.html must split soil type from moisture.");

console.log("Plant data validation passed.");
