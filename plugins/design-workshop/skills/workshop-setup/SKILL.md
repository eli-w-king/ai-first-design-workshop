---
name: workshop-setup
description: "Check a personal laptop for the design workshop in VS Code Insiders, with Git, GitHub sign-in and current-LTS Node prework. Use for \"check my setup\", \"set me up for the workshop\", \"continue my setup\", or \"what does this install?\" Check first, explain each change and its undo, and wait for approval before installing or changing settings."
---

# Workshop setup

Write short, plain sentences. Do not use em or en dashes in generated copy.

Get the laptop ready without replacing the person's own setup. Use VS Code Insiders for this workshop. An existing VS Code release is fine for a task if its required features are present; do not promise feature parity from a version number alone.

## Keep control with the person

- Ask before any install, send, publish, spend, delete, sign-in or settings change. Show the exact action, its scope and its undo, then wait. "Check my setup" is not permission to install.
- Keep Manual permissions and the existing approval rules. Never select Allow all or Autopilot, disable a sandbox, add broad approvals, or change global defaults.
- Do not read passwords, tokens, unrelated folders or personal skills. Let the person complete sign-in and any administrator prompt themselves.
- Add no background jobs, sync, connectors, hooks or recurring automations. Stop only processes you started.

## Check first

Ask which operating system they use and which task they want to try. Start in a folder they chose. Use the read-only checks in [the laptop checklist](references/laptop-checklist.md). Missing command-line launchers do not prove an app is missing.

Report each item as **ready**, **needs a check**, **missing** or **optional**:

1. VS Code Insiders opens, and its Copilot chat is available.
2. The person is signed in to their own GitHub account and can see their Copilot access and usage.
3. The current session uses Manual permissions. Explain that previously approved actions may still run automatically.
4. Use the checked two-entry settings snippet on [Get ready](https://eli-w-king.github.io/ai-first-design-workshop/get-ready/). It offers Computer Use and Send Later, both experimental; it grants no tool approval and schedules nothing. Do not keep another copy in this plugin or edit the person's settings on your own. Follow the merge and undo steps below. Check supported sandboxing separately.
5. The workshop plugin shows all nine skills in a fresh session. Follow [the install guide](../../README.md), not an automatic clone or sync.
6. The built-in browser can open the person's local page and take a screenshot. Do not install an external browser server for this check.
7. Git and the GitHub sign-in are prework for the workshop fork. Check them before the session; install or change nothing without approval. GitHub CLI remains optional, with the GitHub website as the alternative.
8. Node is prework too: use the **current LTS** from [nodejs.org](https://nodejs.org/en/download), with approval and a check against the project's runtime requirements. Check `node`, `npm` and `npx` in a fresh VS Code terminal. Recording tools remain a separate opt-in; Node alone cannot record a video.
9. In the person's fork folder, use [the pinned dependency-install guide](references/project-dependencies.md). Explain the downloads, package scripts, changed directories and cleanup, then ask. Run the exact package-manager version through `npx`, with the existing lockfile, no Corepack and no global package-manager install.

Do not guess promotional-code redemption, renewal or card requirements. A free month of GitHub Copilot Max does not mean unlimited usage. Have the person review the terms shown to them; no purchase or plan change is part of setup.

## Settings, mode and permissions

Prefer the person-led settings merge on Get ready. Use the checked page as the source, not a remembered snippet. If it is unavailable, stop this step rather than inventing settings.

If the person specifically asks the agent to add the settings, show the two exact entries from that page and the merge steps first. Confirm the Default Profile user-settings file, preserve every unrelated entry, update an existing key instead of adding a duplicate, and explain the comma/braces changes. Get an explicit okay, make an approved private backup first, then edit only those two entries. Never paste or publish the full settings file or its backup. Record each key's previous value or absence. Ask before a restart. Undo also requires a reviewed scope, a backup of current settings if needed, and an explicit okay; restore only the original values and leave later edits intact.

For the Copilot harness, **Interactive**, **Plan** and **Autopilot** are modes. Interactive can carry out work; Plan proposes an approach first. Autopilot continues and auto-approves tools, so it is not the safe workshop default. **Manual**, **Assisted** and **Allow all** are permission levels. Manual follows existing approval rules, Assisted uses a model judgment that can be wrong, and Allow all skips confirmations. **New Worktree sessions always use Allow all.** Keep first practice in an ordinary workspace with Manual permissions. None of these choices is a sandbox, and the settings snippet does not choose them.

Send Later is a one-time scheduled prompt, not a recurring automation. It needs `sessions.sendLater.enabled` from the checked snippet, an awake laptop and a running local host. Local automations need the same awake-host conditions. Neither wakes a sleeping laptop, and disabling a setting does not cancel accepted schedules. Use the request's cancel controls and verify it is gone. Cloud automations are not available for public forks; a separately approved one-off Cloud task is a different workflow.

## Make one approved change

Show a short plan of only the missing items. For each item: name the official source, exact command or UI steps, download or account access involved, and how to undo it. Wait for a clear yes to that item. Keep existing tools and settings. Do not bundle installs into one command.

For project dependencies, preserve the package-manager pin and lockfile. Do not use `latest`, regenerate a lockfile, approve blocked scripts wholesale or change global package settings to make an install pass. Stop before launching an app whose upstream hosted services have not been made inert.

After an approved change, check it again. Ask the person to try one small action, such as "Open my local page in the built-in browser and take a screenshot." If it fails twice, record the error without credentials and move to an independent task.

If the person wants the agent to operate their app, follow [the Computer Use handoff](../../references/try-with-computer-use.md) and the separate Get ready activation/permission steps. Availability is not permission to drive the app.

## Leave a readiness note

With agreement on its location, save `Workshop readiness.md` in the chosen folder. Include the date, checks actually run, ready and optional items, blockers, every changed path or setting and its previous value, and each undo step. Do not overwrite an existing note without reviewing it.

On "continue my setup", read that note, recheck only unfinished items, and skip what already works. Close your test tab and stop your own test server. No background work should remain.
