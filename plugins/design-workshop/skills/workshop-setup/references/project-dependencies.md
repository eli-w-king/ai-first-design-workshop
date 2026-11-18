# Node prework and a pinned project install

Node and Git are prework for the workshop fork. The in-room dependency install is a separate approved action in the person's VS Code terminal. Do not run these commands while merely checking readiness.

## Check before installing

Use the **current LTS** from [nodejs.org](https://nodejs.org/en/download) for the person's OS and architecture. Check the project's `engines` and documented runtime too. If they disagree, report it before replacing an existing Node installation. Node is shared by other projects; deleting this fork will not uninstall it.

Open a fresh VS Code terminal and check `node --version`, `npm --version` and `npx --version`. On Windows use `npm.cmd` and `npx.cmd` if PowerShell's script policy blocks the shims; do not relax execution policy as a workaround. Keep the person's own sign-in and administrator prompts in their hands.

Inside the selected fork, inspect `package.json`, its exact `packageManager` version, the lockfile, any workspace definition, registry configuration and install/build scripts. Do not print credential values. A workspace install can affect every package in that workspace. If there is no checked pin or the folder is not the expected project, stop and ask instead of choosing `latest`.

## Explain the proposed command

For a project pinned to pnpm 10.28.2, the basic form is:

```sh
npx pnpm@10.28.2 install --frozen-lockfile
```

That version is an example of an exact pin, not a requirement for every project. Use the selected project's checked version. The command can first download pnpm, then download dependencies and run permitted package scripts. Explain both parts and ask before running it. Do not add a global package-manager install, rely on Corepack, or change global configuration.

For a fresh workshop clone, prefer project-local runner and package-content caches so cleanup is easier. Show these extra locations in the approval request:

```sh
npx --cache=.workshop-cache/npm pnpm@10.28.2 install --frozen-lockfile --store-dir=.workshop-cache/pnpm-store
```

On Windows PowerShell, use the same arguments with `npx.cmd`:

```powershell
npx.cmd --cache=.workshop-cache/npm pnpm@10.28.2 install --frozen-lockfile --store-dir=.workshop-cache/pnpm-store
```

The `--cache` flag belongs before the package name; flags after it go to pnpm. Inspect existing cache/store configuration before changing an already installed project. Ask before adding an ignore entry for `.workshop-cache/`, and do not commit caches or `node_modules`.

Do not blindly approve dependency build scripts. A skipped native-tool script is a reason to check the affected tool and ask about that exact package, not enable all scripts. A frozen-lockfile error is not permission to drop the flag, rewrite the lockfile or upgrade dependencies. The [pnpm 10 install guide](https://pnpm.io/10.x/cli/install) documents the behavior; use the documentation matching the actual pinned version.

## What changes

| Location | Contents |
| --- | --- |
| Project `node_modules/`, including pnpm's `.pnpm/` | Installed dependencies and links used by the app. |
| `.workshop-cache/pnpm-store/`, when the local-store form is used | pnpm's downloaded package-content store. Without this flag, pnpm normally uses a shared store outside the project. |
| `.workshop-cache/npm/_npx/`, when the local-cache form is used | The downloaded pinned pnpm runner used by npx. |
| The same npm cache's `_cacache/` and log folders | Cached downloads and npm logs. The tools may also keep shared metadata caches; do not promise to erase every trace by deleting a clone. |
| `package.json` and the lockfile | They should keep their reviewed versions. Inspect any unexpected change rather than committing it automatically. |

Without the local-cache flag, `npm config get cache` shows the npm cache location. Its defaults are usually `~/.npm` on macOS and `%LocalAppData%\npm-cache` on Windows. The downloaded runner is not a global pnpm installation, but its cache can remain after the project is deleted. Explain that distinction.

After an approved install, use the same pin and cache options for the project's documented scripts. Verify the actual dev and production build paths, including any skipped-script warning. Before any app launch, confirm [upstream hosted services are inert](../../prototypes/references/fork-guardrails.md). Do not test by signing in or contacting the original project's server. Stop only the server you started.

## Undo with approval

1. Stop the project's running tasks. Review and save the person's wanted changes and media first. Deleting a local folder does not remove a GitHub fork or public site.
2. With a clear okay for the exact path, move the workshop project folder to Trash or Recycle Bin. This removes its local dependencies and the project-local caches above. If keeping the code, offer to remove only its named `node_modules/` and `.workshop-cache/` directories instead. Never delete automatically.
3. If the basic command used a shared npm cache, clear only the workshop's npx entry after review. On npm versions that support these commands, list entries with `npm cache npx ls`, inspect the intended one with `npm cache npx info CACHE_KEY`, and, with approval, run `npm cache npx rm CACHE_KEY`. On Windows use `npm.cmd`. Always name the key: omitting it can remove every npx entry.
4. For a project-local cache that you are keeping, add `--cache=.workshop-cache/npm` to those npm cache commands. On older npm versions without the npx-cache subcommands, inspect the recorded `_npx` path and ask before removing only the exact workshop-created entry. Do not run a blanket shared-cache purge.
5. A plain pnpm install can also leave a shared pnpm store. Do not prune other projects' dependencies as routine cleanup. The local-store form avoids leaving the dependency payloads there. Node and Git remain installed; removing either is a separate decision with its original install route and prior state reviewed.

Sources: [npx and its cache behavior](https://docs.npmjs.com/cli/v11/commands/npx), [npm's npx-cache controls](https://docs.npmjs.com/cli/v11/commands/npm-cache), and [pnpm 10 settings](https://pnpm.io/10.x/settings#storedir). No package manager, cache or runtime is changed just by installing this plugin.
