---
name: workshop-setup
description: "Check a personal laptop for the design workshop in VS Code Insiders, with Git, GitHub sign-in and current-LTS Node prework. Use for \"check my setup\", \"set me up for the workshop\", \"continue my setup\", or \"what does this install?\" Check first, explain each change and its undo, and wait for approval before installing or changing settings."
---

# Workshop setup

Write short, plain sentences. Do not use em or en dashes.

The complete default workflow is here. Do not open linked plugin files to start, complete or verify it. Use optional detail only when the person explicitly asks for it. Normal approvals for their files, tools and consequential actions still apply.

A clear request or an explicit okay approves the named actions, targets and scope. Do not ask again for the same approval. State the plan briefly and proceed; ask only about a genuinely missing consequential detail or a changed scope. This does not bypass host/OS permission prompts, change permission levels, authorize unrelated installs or new charges, or grant access to another account.

## Check-only or an explicitly requested setup

Use the person's chosen folder and OS. A readiness check is read-only. An explicit fork/clone/install/start request approves those named actions; do not turn it into repeated confirmation questions. Ask only for an unapproved install, send, publication, charge, deletion, sign-in or settings change, and explain its scope and undo. Never handle passwords/tokens or administrator prompts. Keep permissions and sandbox protections; add no global defaults, sync, hooks or recurring jobs. Stop completed one-off diagnostics, not the person's ongoing development preview.

Report each item as ready, missing, optional or unverified:

- VS Code Insiders opens and Copilot is available. Inspect Help > About; a missing `code-insiders` launcher does not prove the app is absent.
- The person confirms their own GitHub sign-in, Copilot access and usage. Never guess code-redemption, card or renewal terms. A free month of GitHub Copilot Max is not unlimited usage.
- Git and current-LTS Node are prework. On macOS, check `xcode-select -p` before a Git stub can open an installer; then `git --version` if installed. Check `node --version`, `npm --version`, `npx --version` in a fresh terminal. On Windows use `npm.cmd`/`npx.cmd` if policy blocks the shims; do not relax policy.
- Inspect the selected project's runtime requirements before offering the current LTS from `https://nodejs.org/en/download`. Show the installer, shared runtime/PATH effects and removal limits first. Preserve existing runtimes other projects need.
- GitHub CLI and sign-in are prework for the fork-and-ship workshop: `gh --version` and `gh auth status`, never token extraction. The person runs `gh auth login` using HTTPS and approves Git authentication themselves. The person signs in themselves. GitHub's website is an alternative; do not install CLI automatically.
- Check the installed plugin and nine skills in a fresh session. In VS Code use Chat: Open Customizations > Plugins; in CLI use `copilot plugin list` and `copilot skill list`.
- Use available built-in browser tools on a harmless local page. No external browser server is needed for screenshots. Recording and desktop control are separate opt-ins, not proved by Node or a screenshot.

## Requested fork-to-preview setup

1. Use the original repository and destination the person named. Resolve a path like `Workshop/REPO` under their home folder when that is the requested workshop location, not under a chat-state folder. Reuse an existing fork after verifying its owner and upstream parent. Do not create a duplicate or substitute an unrelated same-named repository.
2. Reuse an existing clone only when its `origin` is that fork. Otherwise clone into the agreed new folder. Preserve all existing files and edits; a conflicting destination is a blocker, not permission to overwrite it. Keep the verified project root for later relative output paths and commands.
3. For workshop code work, create or reuse the `workshop` branch before edits; never commit directly to `main` or the repository's default branch. Do not switch a shared folder's branch while another session is writing. Set and verify the own-fork CLI default as described below; the explicit request to make the fork the default is already approval.
4. Inspect and make upstream sync/accounts/analytics inert before the first launch, when the request already asks for local-only behavior. Do not merely hide sign-in controls. No upstream sign-in or service probe. App storage can stay local while selected agent context still goes to its model provider; do not promise local-only AI processing.
5. Use the repository's pinned dependency install and its documented **dev** command. An explicit request to install the project approves that scoped dependency install, not unrelated system software or a registry change. Respect the person's existing npm registry, proxy, certificates and settings. On a network/registry failure, explain and stop that install; never switch to a public registry automatically.
6. **Do not run tests, lint, production builds or an extra preview build during setup unless requested.** Review install hooks so they do not silently add those tasks. Verify only the necessary install outcome and dev-server readiness, then open the owned app with built-in browser tools. Later bug-fix or shipping requests authorize their own checks.
7. Return the fork, project folder, branch and working dev URL. Keep the owned dev server running for the person and queued follow-ups, with its process/terminal and stop instructions. No commit, PR, merge or publication is implied by setup alone.

## Approved setup actions

Use official sources and one explained change at a time. VS Code's public download is `https://code.visualstudio.com/insiders/`; Git is `https://git-scm.com/downloads`. With approval, macOS `xcode-select --install` opens the shared developer-tools installer; Windows can use `winget install --id Git.Git --exact` if winget exists. Existing Homebrew can install optional `gh`; Windows can use `winget install --id GitHub.cli --exact`. Do not add package managers or remove shared tools just for convenience.

For plugin installation, prefer Configure Marketplaces, add the workshop source and review trust. Preserve existing `chat.plugins.marketplaces` entries, including `github/awesome-copilot#marketplace`; never replace the array. Current preview CLI commands are `copilot plugin marketplace add 'eli-w-king/ai-first-design-workshop#plugin/design-workshop'` and `copilot plugin install design-workshop@ai-first-design-workshop`. Use one route, then a fresh session. Uninstall through that same UI or `copilot plugin uninstall design-workshop@ai-first-design-workshop`; remove the marketplace separately if wanted. This does not remove personal skills, outputs or created automations.

## Right after cloning a fork

A fork clone's GitHub CLI can target the parent by default. Check the intended owner and `origin`. With an explicit okay, run `gh repo set-default YOUR_USERNAME/YOUR_FORK`, then check `gh repo set-default --view`. Still pass `--repo YOUR_USERNAME/YOUR_FORK` on **every write**. Never open workshop PRs, issues or comments upstream. Record the previous choice for undo; a noninteractive unset can use `gh repo set-default YOUR_USERNAME/YOUR_FORK --unset` with approval. A local branch/default is not a security boundary.

Before launch, inspect and approve a change making upstream sync/accounts/analytics inert, not just hidden. Do not sign in or probe those servers. Keep local-only protections active and verify zero attempts with destinations blocked before navigation.

## Dependencies and Windows

Read the exact package-manager pin, lockfile, workspace scope and scripts in the selected repo. After explaining downloads and script behavior and getting approval, use the pin through npx, for example `npx pnpm@10.28.2 install --frozen-lockfile` only for that pin. No Corepack or global package-manager install, silent `latest`, lockfile rewrite or blanket script approval.

For a fresh clone, approved local caches can use `npx --cache=.workshop-cache/npm pnpm@10.28.2 install --frozen-lockfile --store-dir=.workshop-cache/pnpm-store`. Dependencies live in `node_modules`, the runner in the selected npm cache's `_npx`, and content in the selected pnpm store. Without local flags, caches/stores can be shared outside the project. With approval, preserve wanted work then delete the exact project folder or named local cache/dependency folders. For a shared npx cache, inspect `npm cache npx ls`/`info KEY`, then remove only the approved key with `npm cache npx rm KEY`. Never purge others' caches; Node/Git uninstall is separate.

Preserve shared `.patch`/`.diff` bytes with `*.patch -text` and `*.diff -text` in the distributor's approved `.gitattributes`, or obtain a reviewed raw LF file. A normal Windows target clone is fine; use `git apply --check` and do not change global autocrlf or normalize the whole project. For a path-like build variable, PowerShell `$env:BASE_PATH = '/repo/'` avoids Git Bash rewriting it; alternatively prefix each affected Git Bash command with `MSYS_NO_PATHCONV=1`. Use only variables the build reads and restore prior terminal values.

## Settings, controls and readiness

The checked settings source is the site's Get ready page: `https://eli-w-king.github.io/ai-first-design-workshop/get-ready/`. Do not copy or invent its snippet. The default check does not need to fetch it. For a requested settings edit, obtain its two current entries, show the merge into the Default Profile user file, get an explicit okay, make a private backup, and change only those keys without duplicates or lost unrelated settings. Never echo/share the whole file. Ask before restart; undo likewise needs approval and restoration of only prior values or newly added entries.

Interactive, Plan and Autopilot are Copilot modes; Manual, Assisted and Allow all are permission levels. Manual honors saved approvals. Autopilot auto-approves tools; New Worktree sessions always use Allow all. None is a sandbox. Keep first practice in an ordinary folder with Manual permissions. Send Later and local automations need the laptop awake and local host running; disabling a setting does not cancel accepted schedules. Cloud automations do not run on public forks. A template enables no run itself.

For requested Computer Use, the person follows Get ready's activation, first-use download and OS permission steps. Operate only the exact owned app and selected file, import once and verify, stop on wider access, and never label markup/DOM automation native app control. Do not interfere with a recording target.

After each approved change, recheck only the requested setup behavior and have the person try it; do not add tests, lint or production builds. After two failures record the blocker and move to independent work. With permission, save `Workshop readiness.md` in the workspace: date, tested versus unverified items, changed paths/prior values, undo and blockers. Resume from that note, not a fresh global setup. Keep a development preview you started running while the person is still working in the session or queued follow-ups need it. Give its URL, port, owning terminal/process and how to stop it (Ctrl+C in that terminal or the host's stop control). One completed request is not the end of the session. Stop the preview when the person is done or asks, and never kill a process you did not start. Close only disposable diagnostic tabs/tasks that are no longer in use.

Computer Use needs **Interactive mode and Manual permissions**, not Autopilot. The first time it touches each app, click **Allow in the native permission panel**, not a chat card. Autopilot can cancel that request; do not keep retrying calls while the panel is unanswered. This is separate from screenshot markup and browser DOM automation.

## Optional detail

None of these files is required above. Open one only for an explicit request for extra detail. Opening it may ask to read a file outside your workspace; that is this plugin's own folder. Check the path and request only that access, never a broad exception. Do not fetch another copy to bypass a denied read.

[Expanded laptop checklist](references/laptop-checklist.md), [dependency/cache detail](references/project-dependencies.md), [plugin installation background](../../README.md), [desktop-control detail](../../references/try-with-computer-use.md).
