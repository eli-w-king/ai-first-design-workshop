---
name: prototypes
description: "Fork a real open-source project and build, fix or review a change in its actual code, or make a plain input/deck file without coding. Use for \"fork this project\", \"fix it and prove it\", \"redesign from my markup\", \"make an importable flashcard deck\", or \"prepare a PR in my fork\". Keep approvals, upstream isolation, attribution and real test evidence."
---

# Prototypes in your own fork

Write short, plain sentences. Do not use em or en dashes.

The complete default workflow is here. Do not open linked plugin files to start, complete or verify it. Use optional detail only when the person explicitly asks for it. Normal approvals for their files, tools and consequential actions still apply.

## Pick the requested path

For a **file-only deck request**, use the inline deck steps below and skip Git, installs and app changes. For a **bug**, use the red/green path. For a redesign or feature, use the real project and code path. If asked to plan first, stop at the proposal until approved. Use the supplied brief/kit, not an invented replacement or upstream roadmap.

Ask before installs, sends, publication, spending or deletion. Keep permissions, unrelated edits and original license/notices intact. A public repo alone is not a reuse license. Label fictional data and simulated behavior. Read only the chosen project/inputs; do not sign in to upstream services or contact its maintainers.

## Fork and prepare code

1. Confirm the selected original, allowed reuse, the person's intended fork and visibility. After approval, create or use **their fork**, then clone into an agreed new folder. Inspect scripts before an approved pinned dependency install. Do not choose a workshop app for them.
2. Check branch, remotes and uncommitted changes. Create the agreed feature branch; do not reset, stash or overwrite others' work. Confirm `origin` is their fork. Right after cloning, with an okay, run `gh repo set-default YOUR_USERNAME/YOUR_FORK`, check `gh repo set-default --view`, and still use an explicit `--repo` on every GitHub write. Record the previous default for undo.
3. Before launch, inspect config, client initialization, workers and workflows for upstream sync, accounts and analytics. Propose and approve a local-only change that makes clients/background traffic inert, not merely hidden buttons. Block service destinations before the first navigation, then require zero attempted upstream requests. Keep protection active in baseline and new design; do not probe the upstream server.
4. Offer, never silently add, an `AGENTS.md` section: own-fork writes only; no upstream contact/services; local sample data; ask before installs/publishing/spending/deletion; preserve license and source credit. Merge into existing instructions with approval. This is guidance, not a security boundary.

## Fix it and prove it

Reproduce the exact failure in the real app with built-in browser tools and approved sample data. Record expected/observed behavior and trace the event/state/data flow to its cause. If not reproduced, say so rather than inventing a fix.

Add the smallest existing unit/component/browser regression test that asserts the intended behavior. Run it **before the fix** and confirm failure is caused by the bug, not missing tools or broken syntax. Record **Red** with the exact command, assertion and exit status. Make the smallest repair without unrelated redesign, upgrades or a new feature flag. Run the same command **Green**, keep its meaningful assertion, then repeat the original browser steps and relevant neighboring checks.

Show real red/green output, source state, changed files and the browser result. Never fabricate output or reset a shared folder to manufacture a red run. If a prior fix prevents replay, use an approved disposable baseline copy or state that before-fix proof is unavailable.

## Redesign or add a feature

Turn the brief into task, scope and acceptance checks. Locate the real component and reuse its stack, tokens and content. Apply the requested change as the app's default behavior at its normal URL, with no hidden flag or query switch. Preserve a before screenshot and the base branch/revision or an approved reversible change. Add a switcher or flag only when the person asks for options/alternatives or asks to keep the old version available. Do not recreate the app as an image or unrelated page.

For markup, read the supplied image, map arrows/circles/notes/crops to actual components, ask about unclear marks, then edit only confirmed parts. Capture the actual before and after at the same viewport/state and show them beside the original markup. Manual markup is not Computer Use, and text-only feedback is not a substitute for this visual loop.

Test the requested behavior at the normal app URL, plus keyboard focus, phone layout and reduced motion. Test switches only when they were explicitly requested. Use the smallest relevant existing tests and built-in browser checks; name what was not tested. If desktop control is explicitly requested, use only supported approved Computer Use tools on the exact owned app/window and selected file. Import once and verify; stop on sign-in or wider access. Do not touch another session's recording target or call DOM automation native control.

## Make an input or deck file only

Confirm the requested count and the actual import format. Use supplied notes or explicitly approved sources, not invented facts. A notes-only automation reads only workspace notes and earlier decks for duplicate checks, with no browser, accounts or outside folders. Explain model processing. If there are too few supported new cards, report the gap rather than pad or lower the count silently.

Write one clear recall question and concise supported answer per card. Default to UTF-8 CSV with **two fields per record, front/back, no header** unless the importer requires one. Quote comma-containing fields, double quotes inside quoted fields, keep one card per line, and include no fences or prose in CSV. Markdown needs the importer's specified Q/A structure. Save a new `decks/cards-<timestamp>.csv` and a separate review with count, source ids, caveats and import status. Check record/field counts, blanks, quoting and duplicates. Preserve notes and older decks. Writing is not permission to import; with an explicit request, use the approved local-only app's picker, inspect preview and verify once without blindly retrying.

## Review, share and undo

Draft a PR with what/why, actual before/after evidence, opening/toggle steps, tests, limits and upstream credit. Stage only reviewed files and follow the person's request for local commits. A fork PR defaults upstream: choose **their fork as base repository** and use `gh pr create --repo YOUR_USERNAME/YOUR_FORK --draft --base BASE --head BRANCH --title TITLE --body-file FILE` only after approval. Verify the destination and returned URL. Never create workshop PRs, issues, comments, stars or notifications upstream. `--dry-run` may still push; do not use it as a harmless check.

Merging inside their fork, publishing media/Pages, assigning reviewers or starting a Cloud task each needs its exact scope approved. Check real results before reporting. Give local paths, fork/approved PR links, checks and gaps. Undo only named changes after review; never reset/clean unrelated work or delete branches automatically. Restore a changed CLI default with approval, or use `gh repo set-default YOUR_USERNAME/YOUR_FORK --unset` when removing this clone's stored choice. Stop one-off checks when finished, not a preview still in use.

## Keep the preview available

Keep a development preview you started running while the person is still working in the session or queued follow-ups need it. Give its URL, port, owning terminal/process and how to stop it (Ctrl+C in that terminal or the host's stop control). One completed request is not the end of the session. Stop the preview when the person is done or asks, and never kill a process you did not start. Use the host's persistent task/background mechanism when needed so ending a turn does not kill the preview or block the queued follow-up. If the host cannot keep it available, say so and give the exact restart command instead of claiming it is still running.

## Optional detail

None of these files is required above. Open one only for an explicit request for extra detail. Opening it may ask to read a file outside your workspace; that is this plugin's own folder. Check the path and request only that access, never a broad exception. Do not fetch another copy to bypass a denied read.

[Fork/PR detail](references/branch-and-pr.md), [service safeguards](references/fork-guardrails.md), [red/green examples](references/fix-and-prove.md), [deck-file detail](references/deck-files.md), [markup options](../../references/markup-feedback.md), [desktop-control handoff](../../references/try-with-computer-use.md).
