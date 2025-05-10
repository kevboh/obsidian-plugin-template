import { readFileSync, writeFileSync } from "node:fs";

const targetVersion = process.env.npm_package_version;
let dirty = false;

if (!targetVersion) {
  console.error("❌ Could not get version from package.json");
  process.exit(1);
}

// read minAppVersion from manifest.json and bump version to target version
const manifest = JSON.parse(readFileSync("manifest.json", "utf8"));
const { minAppVersion } = manifest;
if (manifest.version !== targetVersion) {
  manifest.version = targetVersion;
  writeFileSync("manifest.json", JSON.stringify(manifest, null, "\t"));
  console.log(`✅ Updated manifest.json to version ${targetVersion}`);
  dirty = true;
}

// update versions.json with target version and minAppVersion from manifest.json
const versions = JSON.parse(readFileSync("versions.json", "utf8"));
if (!versions[targetVersion] || versions[targetVersion] !== minAppVersion) {
  versions[targetVersion] = minAppVersion;
  writeFileSync("versions.json", JSON.stringify(versions, null, "\t"));
  console.log(
    `✅ Added ${targetVersion} with min app version of ${minAppVersion} to versions.json`,
  );
  dirty = true;
}

if (dirty) {
  console.log("Remember to add or stage these changes.");
} else {
  console.log("No new version detected; do you need to update package.json?");
}
