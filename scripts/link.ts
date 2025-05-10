import { symlink, mkdir, exists } from "node:fs/promises";
import { join } from "node:path";

const DIST_DIR = "dist";
const VAULT_PLUGINS_DIR = "test-vault/.obsidian/plugins";

async function linkPlugin() {
  const packageFile = Bun.file("./package.json");
  const packageJSON = await packageFile.json();
  const pluginName = packageJSON["name"];
  const pluginDir = join(DIST_DIR, pluginName);

  // Ensure build directory exists
  await mkdir(pluginDir, { recursive: true });

  const targetPath = join(VAULT_PLUGINS_DIR, pluginName);

  // Only create symlink if it doesn't exist
  const linkExists = await exists(targetPath);
  if (!linkExists) {
    try {
      const absolutePath = join(process.cwd(), pluginDir);
      console.log(`Creating symlink from ${absolutePath} to ${targetPath}`);
      await symlink(absolutePath, targetPath, "junction");
      console.log("✅ Symlink created successfully");
    } catch (error) {
      console.error("❌ Failed to create symlink:", error);
    }
  } else {
    console.log("✅ Symlink already exists");
  }
}

linkPlugin();
