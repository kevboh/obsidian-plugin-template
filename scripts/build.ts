import { join } from "node:path";
import chokidar from "chokidar";
import { exists, rm } from "node:fs/promises";

const DIST_DIR = "dist";
const IS_DEV = process.argv.includes("--dev");
let devBuild: NodeJS.Timeout | null = null;

async function build() {
  const packageFile = Bun.file("./package.json");
  const packageJSON = await packageFile.json();
  const pluginName = packageJSON["name"];
  const pluginDir = join(DIST_DIR, pluginName);

  console.log("🔨 Building plugin...");

  const banner = `/*
This is the bundled version of ${pluginName}.
For more information about this plugin, [look it up in Obsidian](obsidian://show-plugin?id=${pluginName}) or find it on GitHub.
*/
`;

  // Build main plugin file
  const result = await Bun.build({
    entrypoints: ["./src/main.ts"],
    outdir: pluginDir,
    minify: !IS_DEV,
    sourcemap: IS_DEV ? "external" : "none",
    external: [
      "obsidian",
      "electron",
      "@codemirror/autocomplete",
      "@codemirror/collab",
      "@codemirror/commands",
      "@codemirror/language",
      "@codemirror/lint",
      "@codemirror/search",
      "@codemirror/state",
      "@codemirror/view",
      "@lezer/common",
      "@lezer/highlight",
      "@lezer/lr",
    ],
    format: "cjs",
    naming: {
      entry: "main.js",
    },
    banner,
  });

  if (!result.success) {
    console.error("❌ Build failed", result.logs);
    process.exit(1);
  }

  // Copy manifest
  await Bun.write(join(pluginDir, "manifest.json"), Bun.file("manifest.json"));

  // Copy styles if they exist
  try {
    await Bun.write(join(pluginDir, "styles.css"), Bun.file("styles.css"));
  } catch {
    console.log("No styles.css found, skipping...");
  }

  // Touch .hotreload
  await Bun.write(join(pluginDir, ".hotreload"), "");

  console.log("✅ Build complete!");
  devBuild = null;
}

build();

if (IS_DEV) {
  chokidar
    .watch(["./src/", "manifest.json", "styles.css"])
    .on("change", async (path) => {
      console.log(`🔄 File changed: ${path}`);
      if (devBuild) {
        clearTimeout(devBuild);
      }
      devBuild = setTimeout(build, 0);
    });
}
