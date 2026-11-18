---
name: workshop-setup
description: "Check a personal laptop for the design workshop in VS Code Insiders, or another supported VS Code release. Use for \"check my setup\", \"set me up for the workshop\", \"continue my setup\", or \"what does this install?\" Check first, explain each change and its undo, and wait for approval before installing or changing settings."
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
4. **Placeholder: paste the checked workshop settings from the site's Get ready page when they are supplied.** Explain their changes and undo before the person applies them. Do not invent, duplicate or edit settings keys. Check supported sandboxing separately; sandboxing and approvals are different controls.
5. The workshop plugin shows all nine skills in a fresh session. Follow [the install guide](../../README.md), not an automatic clone or sync.
6. The built-in browser can open the person's local page and take a screenshot. Do not install an external browser server for this check.
7. Git is optional until the person wants branches or a pull request. GitHub CLI is optional; the GitHub website is a supported alternative.
8. Node and recording tools are optional until a real video is requested. Node alone cannot record one. Use [the recording guide](../demo-walkthrough/references/recording.md).

Do not guess promotional-code redemption, renewal or card requirements. A free month of GitHub Copilot Max does not mean unlimited usage. Have the person review the terms shown to them; no purchase or plan change is part of setup.

## Make one approved change

Show a short plan of only the missing items. For each item: name the official source, exact command or UI steps, download or account access involved, and how to undo it. Wait for a clear yes to that item. Keep existing tools and settings. Do not bundle installs into one command.

After an approved change, check it again. Ask the person to try one small action, such as "Open my local page in the built-in browser and take a screenshot." If it fails twice, record the error without credentials and move to an independent task.

## Leave a readiness note

With agreement on its location, save `Workshop readiness.md` in the chosen folder. Include the date, checks actually run, ready and optional items, blockers, every changed path or setting and its previous value, and each undo step. Do not overwrite an existing note without reviewing it.

On "continue my setup", read that note, recheck only unfinished items, and skip what already works. Close your test tab and stop your own test server. No background work should remain.
