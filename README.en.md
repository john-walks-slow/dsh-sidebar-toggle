# dsh-sidebar-toggle

<p align="center">
  <a href="./README.md"><strong>简体中文</strong></a> ·
  <a href="./README.en.md"><strong>English</strong></a>
</p>

Quickly toggle the [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) (DSH) Web GUI sidebar grouping between **workspace** (`工作区`) and **flat session list** (`会话`) — either via the **`Alt+R` keyboard shortcut** or by **clicking the sidebar section header title** (`Sessions` / `Workspaces` / `会话` / `工作区`), without opening the view-options menu.

## Features & Usage

1. **Global Shortcut `Alt+R`**:
   - Press `Alt+R` from anywhere in the Web UI to toggle sidebar grouping (`workspace` ↔ `flat`).
   - Ignores keystrokes while an IME composition is active (`e.isComposing || e.keyCode === 229`).
2. **Click Sidebar Header Title**:
   - Adds a pointer cursor (`cursor: pointer; user-select: none;`) and subtle hover feedback (`opacity: 0.8`) to the sidebar section header label (`[class*="sectionHeader"] [class*="sectionLabel"]`, showing `Sessions` / `Workspaces` in English or `会话` / `工作区` in Chinese).
   - Click the header label directly to toggle between grouped workspaces and the flat session list (ignores clicks when the label carries `sectionLabelHidden`).

On each toggle, the plugin invokes the native `setGroupBy` action on the `sidebar.workspaces` slot store and logs the transition in the browser console:

```text
[dsh-sidebar-toggle] groupBy: workspace -> flat
[dsh-sidebar-toggle] groupBy: flat -> workspace
```

## Install

From npm (pre-built, zero extra configuration):

```bash
dsh plugin --profile web add dsh-sidebar-toggle
```

The bundled `cordis.patch.yml` mounts automatically; refresh the Web UI after installing.

From GitHub (source install — runs the `prepare` build script; pnpm ≥ 10 requires approving the build script on first install):

```bash
dsh plugin --profile web add github:john-walks-slow/dsh-sidebar-toggle
# If pnpm blocks the build script, run `pnpm approve-builds` or add dsh-sidebar-toggle
# to allowBuilds / onlyBuiltDependencies in ~/.dsh/profiles/web/pnpm-workspace.yaml, then re-run
```

## Permissions & Compatibility

- **Pure client plugin**: The host-side `apply` is an empty stub with **zero npm runtime dependencies**; all logic runs in the browser bundle (`lib/client.js`).
- **Zero external permissions**: No external services, no network requests, no filesystem reads or writes, and no access to session content.
- **Native store integration**: Resolves the `WorkspaceViewStoreHandle` from the `sidebar.workspaces` slot via the Cordis `slots` service and calls the host's own `getSnapshot().groupBy` and `actions.setGroupBy()`, staying fully in sync with the built-in view menu.
- **Clean lifecycle**: Disposes event listeners and the injected `<style>` element automatically on plugin unload or hot reload via `ctx.effect` and `window.__dshSidebarToggle.dispose()`.
- **Safe degradation**: Store lookups are wrapped in `try/catch`; if the sidebar slot is not mounted, toggling is a silent no-op.

## Local Development

```bash
npm run build     # wraps src/client.js into lib/client.js and syntax-checks lib/index.js + lib/client.js
```

Link a local checkout into the web profile:

```bash
dsh plugin --profile web add link:/path/to/dsh-sidebar-toggle
```

## Release a New Version

One command bumps the version and packs (`npm version` automatically commits and tags):

```bash
npm run release        # patch; for bigger changes: npm version minor or major
```

Then publish with the WebAuthn fingerprint flow and push:

```bash
node ~/.agents/skills/npm-publish/scripts/publish-webauthn.cjs /tmp/dsh-sidebar-toggle-<newver>.tgz
git push --follow-tags
```

Verify with `npm view dsh-sidebar-toggle version`.

## License

MIT

## Community

- Thanks to the [LINUX DO](https://linux.do/) community for providing the discussion environment.
