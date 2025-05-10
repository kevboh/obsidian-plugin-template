# Obsidian Plugin Template

This is a template for Obsidian plugins based on the first-party [Obsidian sample plugin](https://github.com/obsidianmd/obsidian-sample-plugin) that aims to be a modern, slimmer replacement with as little impact to your dev setup as possible. Specifically, its goals are to:

- Use fewer tools, replacing `node`, `tsc` and `esbuild` with [`bun`](https://bun.sh/) and removing the `git` dependency in version bumping for those who use [`jj`](https://github.com/jj-vcs/jj) or other VCS tools.
- Make getting started with plugin development as low-friction as possible by adding a test vault with [hot reload](https://github.com/pjeby/hot-reload) and a script to symlink your plugin into it.
- Add version determinism via [mise](https://mise.jdx.dev/).

> [!TIP]
> If you’d like a way to sync, share your Obsidian vaults/notes with others, and edit them on the web check out my other project, [screen.garden](https://screen.garden).

## Initial Setup

Follow these steps to get your local dev loop going:

1. [Install mise](https://mise.jdx.dev/getting-started.html)
2. `mise install` (to install bun)
3. `bun install` (to install deps)
4. Edit `package.json`, `manifest.json`, `main.ts` to rename the plugin.

After that you can `bun run dev` to build and watch your source, which should go in `src/`.

To test your plugin in Obsidian with hot-reloading:

1. `bun run link` to symlink your built plugin into the test vault.
2. Add `./test-vault` to Obsidian as a new vault.
3. In your test vault, enable community plugins and enable your plugin.

After that any changes to your plugin source will cause it to reload in Obsidian.

The rest of this README is identical to [the sample template’s](https://github.com/obsidianmd/obsidian-sample-plugin/blob/master/README.md) with small changes and deletions to reflect the new tooling.

## Releasing new releases

- Update your `manifest.json` with your new version number, such as `1.0.1`, and the minimum Obsidian version required for your latest release.
- Update your `versions.json` file with `"new-plugin-version": "minimum-obsidian-version"` so older versions of Obsidian can download an older version of your plugin that's compatible.
- Create new GitHub release using your new version number as the "Tag version". Use the exact version number, don't include a prefix `v`. See here for an example: https://github.com/obsidianmd/obsidian-sample-plugin/releases
- Upload the files `manifest.json`, `main.js`, `styles.css` as binary attachments. Note: The manifest.json file must be in two places, first the root path of your repository and also in the release.
- Publish the release.

> You can simplify the version bump process by running `bun run verson` after updating your version in package.json.
> The command will bump version in `manifest.json` and add the entry for the new version to `versions.json`

## Adding your plugin to the community plugin list

- Check the [plugin guidelines](https://docs.obsidian.md/Plugins/Releasing/Plugin+guidelines).
- Publish an initial version.
- Make sure you have a `README.md` file in the root of your repo.
- Make a pull request at https://github.com/obsidianmd/obsidian-releases to add your plugin.

## Manually installing the plugin

- Copy over `main.js`, `styles.css`, `manifest.json` to your vault `VaultFolder/.obsidian/plugins/your-plugin-id/`.

## Improve code quality with eslint (optional)

- [ESLint](https://eslint.org/) is a tool that analyzes your code to quickly find problems. You can run ESLint against your plugin to find common bugs and ways to improve your code.
- To use eslint with this project, `bun run lint`.

## Funding URL

You can include funding URLs where people who use your plugin can financially support it.

The simple way is to set the `fundingUrl` field to your link in your `manifest.json` file:

```json
{
  "fundingUrl": "https://buymeacoffee.com"
}
```

If you have multiple URLs, you can also do:

```json
{
  "fundingUrl": {
    "Buy Me a Coffee": "https://buymeacoffee.com",
    "GitHub Sponsor": "https://github.com/sponsors",
    "Patreon": "https://www.patreon.com/"
  }
}
```

## API Documentation

See https://github.com/obsidianmd/obsidian-api
