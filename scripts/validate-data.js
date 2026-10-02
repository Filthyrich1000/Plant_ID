const fs = require("node:fs");
const path = require("node:path");
const { focusGroupIds, hardinessDict, rhsPlantDatabase } = require("../plant-data");

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

const indexHtml = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");
assert(indexHtml.includes("Light Exposure"), "index.html must label Light Exposure.");
assert(indexHtml.includes("Aspect"), "index.html must label Aspect.");
assert(indexHtml.includes("pH"), "index.html must label pH.");
assert(indexHtml.includes("Soil Type"), "index.html must label Soil Type.");

console.log("Plant data validation passed.");
