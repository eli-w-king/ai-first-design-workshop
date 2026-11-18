# Laptop checklist

Computer Use needs **Interactive mode and Manual permissions**, not Autopilot. The first time it touches each app, click **Allow in the native permission panel**, not a chat card. Autopilot can cancel that request; do not keep retrying calls while the panel is unanswered. This is separate from screenshot markup and browser DOM automation.

Use this as a menu, not an installer. Check only what the selected task needs. Reuse approval for explicitly requested actions; ask only about an unapproved change and show its undo. During setup, do not add tests, lint, production builds or an extra preview build unless requested. Do not remove a tool that was already present.

## Read-only checks

| Item | Check | If it is missing |
| --- | --- | --- |
| VS Code Insiders | Ask the person to open it and inspect **Help > About**. If the launcher exists, `code-insiders --version` is another check. | Offer the official [download](https://code.visualstudio.com/insiders/). Keep their existing VS Code installation and profile. |
| GitHub and Copilot | Ask the person to check the signed-in account and usage from the Copilot UI. | They sign in themselves through the app. Never request a password, token or payment card in chat. |
| Manual permissions | Inspect the session's permissions picker, or ask them to read it. | Explain the difference between Manual, Assisted and Allow all. Do not change their settings yourself. Manual still honors existing approvals. |
| Terminal sandbox | Inspect the session's **Sandboxing for terminal** control and effective policy where available. | Use the checked [Get ready instructions](https://eli-w-king.github.io/ai-first-design-workshop/get-ready/). Explain missing sandbox support without changing settings on your own. |
| Plugin | Open **Chat: Open Customizations > Plugins**, then inspect `design-workshop`. In CLI, `copilot plugin list` and `copilot skill list`. | Use the [plugin installation guide](../../../README.md). Start a new session afterward. |
| Browser tools | Open a harmless local HTML file in an agent-owned browser tab and take a screenshot. | Check **Configure Tools > Built-in > Browser** if available. Use the checked Get ready instructions; do not add another settings block. An unsupported host remains unsupported. |
| Git, prework | On macOS, check `xcode-select -p` first so a Git stub does not unexpectedly open an installer. Then `git --version` if installed. On Windows, `Get-Command git` then `git --version`. | Offer a supported installer, not an automatic download. |
| GitHub CLI, workshop prework | `gh --version`, then `gh auth status` without printing tokens. The person completes `gh auth login` with HTTPS and Git authentication. | Offer the official CLI install for the fork-and-ship workshop; file-only tasks do not need it. |
| Node, prework | `node --version`, `npm --version` and `npx --version` in a fresh VS Code terminal. Compare with the current LTS on the official download page and the project's runtime requirements. | Offer the [current LTS](https://nodejs.org/en/download), with approval; preserve other projects' runtime needs. |
| Project dependencies, in the fork | Read the package-manager pin, lockfile, scripts and workspace scope. | Use the [pinned npx guide](project-dependencies.md) only after explaining and approving the install. |
| Video tools, optional | Inspect whether the approved recording runtime, browser and video encoder already exist. | Follow the [video guide](../../demo-walkthrough/references/recording.md). Do not infer recording readiness from Node alone. |

## Install only the item they approve

Explain the source and scope before running the relevant command. On Windows, run one PowerShell command at a time; `npm.cmd` and `npx.cmd` avoid changing execution policy. Do not install a package manager just to install one small optional tool.

| Item | Approved installation route | Undo after checking shared use |
| --- | --- | --- |
| VS Code Insiders | Download the correct macOS or Windows installer from the official page above. The person handles OS prompts. | Remove that app through the OS app manager. Keep settings, projects and the other VS Code app unless separately asked. |
| Git on macOS | If the developer tools are missing, `xcode-select --install` opens the official installer after approval. | The developer tools are shared by other apps. Do not delete their directory automatically; explain this before installation. Use a supervised uninstall only if the person later wants it. |
| Git on Windows | `winget install --id Git.Git --exact`, if winget is already present. Otherwise use [git-scm.com](https://git-scm.com/downloads). | **Settings > Apps > Installed apps > Git > Uninstall**. Keep repository folders. |
| GitHub CLI on macOS | `brew install gh`, only if Homebrew is already present. Otherwise use the [official instructions](https://cli.github.com/). | `brew uninstall gh` only for this newly installed package, or the matching installer removal. |
| GitHub CLI on Windows | `winget install --id GitHub.cli --exact`. | `winget uninstall --id GitHub.cli --exact`, or the app manager. |
| Node, prework | Use the **current LTS** from the [official download page](https://nodejs.org/en/download), not an unreviewed newer release or a Corepack bootstrap. Explain its shared runtime/PATH changes and ask first. | Use that installer's removal route only after checking other projects. On macOS, leaving a shared runtime installed can be safer than manual file removal. Do not remove pre-existing versions or shared packages. |
| Copilot CLI, optional | Follow [the official CLI installation guide](https://docs.github.com/en/copilot/how-tos/copilot-cli/cli-getting-started). Prefer VS Code if the person does not want another tool. | Use the matching package manager or installer's removal command. Removing CLI is separate from canceling a Copilot plan. |

After an approved CLI sign-in, `gh auth logout --hostname github.com --user USERNAME` removes that CLI account's local sign-in. Ask before running it; it does not sign the person out everywhere. Never use `gh auth token` to verify setup.

The project dependency install is separate from installing Node. It uses a pinned package manager through `npx`, not Corepack or a global install. [Its guide](project-dependencies.md) lists project files, runner/cache locations and an approved undo that preserves work the person wants.

## Settings and identity

Use the two-entry snippet on the site's [Get ready page](https://eli-w-king.github.io/ai-first-design-workshop/get-ready/), not a copy in this plugin. It enables the availability of Computer Use and Send Later, both experimental. It does not activate app access, approve actions or create a schedule. Checked source and schema are not a clean-account runtime test.

The default route is for the person to follow that page's backed-up merge in the Default Profile, which the Agents window uses. Keep their existing settings, profile choice and sign-in intact. Do not replace the file or promise that a separate editor profile isolates plugin permissions.

Only if the person asks the agent to make the edit: show the two lines from Get ready, the exact file and the proposed merge. Ask for an explicit okay to the backup and edit. Make the private backup first, keep it outside repositories, then update only those keys. Add no duplicate keys or extra outer braces. Check commas, syntax and unknown-setting warnings. Do not echo the full file or share the backup. Record previous values or missing keys. Ask before restarting the app.

For undo, first review active runs and pending schedules. With the person's okay, cancel accepted Send Later requests and disable the created automation separately; turning a setting off does not cancel them. Follow Get ready's Computer Use deactivation and OS-permission steps if that access was enabled. Show the proposed settings restoration, back up current settings when needed, obtain an explicit okay, then restore only changed values or remove only keys newly added. Do not overwrite unrelated changes made since the original backup.

Explain controls separately from settings. Interactive, Plan and Autopilot are Copilot modes; Manual, Assisted and Allow all are permission levels. Autopilot auto-approves tools, and Manual can still honor saved approvals. New Worktree sessions always use Allow all, so keep the first practice in an ordinary folder with Manual permissions. The terminal sandbox is separate; check current [platform support](https://code.visualstudio.com/docs/agents/run/agent-sandboxing) and state any limitation. Do not edit policies or bypass managed restrictions.

For a Git project, read repository-local `user.name` and `user.email` before changes. With approval, set only local values. Ask the person to copy the noreply address from [GitHub email settings](https://github.com/settings/emails); never guess it. Undo by restoring the previous local value, or unsetting only a local key you added when it was absent. Do not change global identity or credential helpers.

## Readiness note

Record each check with date, actual result, version if relevant, what changed, prior value, undo and whether the person's try-it succeeded. Do not call an item tested because it merely installed. A browser screenshot proves screenshots, not video export. Leave unsupported or blocked steps visible.
