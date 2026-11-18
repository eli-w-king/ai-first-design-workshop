# Laptop checklist

Use this as a menu, not an installer. Check only what the selected task needs. Ask before changing anything, show its undo, and wait. Do not remove a tool that was already present.

## Read-only checks

| Item | Check | If it is missing |
| --- | --- | --- |
| VS Code Insiders | Ask the person to open it and inspect **Help > About**. If the launcher exists, `code-insiders --version` is another check. | Offer the official [download](https://code.visualstudio.com/insiders/). Keep their existing VS Code installation and profile. |
| GitHub and Copilot | Ask the person to check the signed-in account and usage from the Copilot UI. | They sign in themselves through the app. Never request a password, token or payment card in chat. |
| Manual permissions | Inspect the session's permissions picker, or ask them to read it. | Explain the difference between Manual, Assisted and Allow all. Do not change their settings yourself. Manual still honors existing approvals. |
| Terminal sandbox | Inspect the session's **Sandboxing for terminal** control and effective policy where available. | Use only the checked workshop settings supplied on Get ready. Until then, leave a visible placeholder. Explain any missing sandbox support without changing settings. |
| Plugin | Open **Chat: Open Customizations > Plugins**, then inspect `design-workshop`. In CLI, `copilot plugin list` and `copilot skill list`. | Use the [plugin installation guide](../../../README.md). Start a new session afterward. |
| Browser tools | Open a harmless local HTML file in an agent-owned browser tab and take a screenshot. | Check **Configure Tools > Built-in > Browser** if available. Refer to the checked Get ready settings when supplied. An unsupported host remains unsupported. |
| Git, optional | On macOS, check `xcode-select -p` first so a Git stub does not unexpectedly open an installer. Then `git --version` if installed. On Windows, `Get-Command git` then `git --version`. | Offer a supported installer, not an automatic download. |
| GitHub CLI, optional | `gh --version`, then `gh auth status` without printing tokens. | Use the website instead, or offer the official CLI install. |
| Video tools, optional | `node --version`; inspect the chosen project's dependencies and whether its browser and video encoder already exist. | Follow the [video guide](../../demo-walkthrough/references/recording.md). Do not infer recording readiness from Node alone. |

## Install only the item they approve

Explain the source and scope before running the relevant command. On Windows, run one PowerShell command at a time; `npm.cmd` avoids changing execution policy. Do not install a package manager just to install one small optional tool.

| Item | Approved installation route | Undo after checking shared use |
| --- | --- | --- |
| VS Code Insiders | Download the correct macOS or Windows installer from the official page above. The person handles OS prompts. | Remove that app through the OS app manager. Keep settings, projects and the other VS Code app unless separately asked. |
| Git on macOS | If the developer tools are missing, `xcode-select --install` opens the official installer after approval. | The developer tools are shared by other apps. Do not delete their directory automatically; explain this before installation. Use a supervised uninstall only if the person later wants it. |
| Git on Windows | `winget install --id Git.Git --exact`, if winget is already present. Otherwise use [git-scm.com](https://git-scm.com/downloads). | **Settings > Apps > Installed apps > Git > Uninstall**. Keep repository folders. |
| GitHub CLI on macOS | `brew install gh`, only if Homebrew is already present. Otherwise use the [official instructions](https://cli.github.com/). | `brew uninstall gh` only for this newly installed package, or the matching installer removal. |
| GitHub CLI on Windows | `winget install --id GitHub.cli --exact`. | `winget uninstall --id GitHub.cli --exact`, or the app manager. |
| Node, only for recording | Use the [current LTS installer](https://nodejs.org/en/download). With an existing package manager, inspect its exact package first and show the proposed command. | Use that installer's removal steps. Do not remove a pre-existing Node version or shared package directory. |
| Copilot CLI, optional | Follow [the official CLI installation guide](https://docs.github.com/en/copilot/how-tos/copilot-cli/cli-getting-started). Prefer VS Code if the person does not want another tool. | Use the matching package manager or installer's removal command. Removing CLI is separate from canceling a Copilot plan. |

After an approved CLI sign-in, `gh auth logout --hostname github.com --user USERNAME` removes that CLI account's local sign-in. Ask before running it; it does not sign the person out everywhere. Never use `gh auth token` to verify setup.

## Settings and identity

**Placeholder: the checked workshop settings snippet will be linked from Get ready on the [workshop site](https://eli-w-king.github.io/ai-first-design-workshop/).** The settings worker owns that file. Do not write your own keys, substitute a settings snippet, or change global defaults. Once supplied, explain what it changes, ask the person to paste it, and follow its own backup and undo instructions.

Explain mode and permissions separately. Use an ordinary workspace session with Manual permissions, not a worktree or Autopilot. Manual can still honor existing approvals. The terminal sandbox is a separate protection; check current [platform support](https://code.visualstudio.com/docs/agents/run/agent-sandboxing) and state any limitation. Sandboxing can allow network access and does not cover every tool. Do not edit policies or bypass managed restrictions.

For a Git project, read repository-local `user.name` and `user.email` before changes. With approval, set only local values. Ask the person to copy the noreply address from [GitHub email settings](https://github.com/settings/emails); never guess it. Undo by restoring the previous local value, or unsetting only a local key you added when it was absent. Do not change global identity or credential helpers.

## Readiness note

Record each check with date, actual result, version if relevant, what changed, prior value, undo and whether the person's try-it succeeded. Do not call an item tested because it merely installed. A browser screenshot proves screenshots, not video export. Leave unsupported or blocked steps visible.
