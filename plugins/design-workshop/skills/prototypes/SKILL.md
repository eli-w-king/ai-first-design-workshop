---
name: prototypes
description: "Fork a real open-source project, clone your fork, work on a branch and build a meaningful redesign or feature in the actual code. Use for \"fork this project\", \"redesign this app\", \"change it from my marked-up screenshot\", or \"prepare a PR in my fork\". Keep attribution and before/after evidence, and ask before publishing, installing or starting a Cloud task."
---

# Prototypes in your own fork

Write short, plain sentences. Do not use em or en dashes in generated copy.

Make a meaningful change in a real open-source project, then leave the person with their own repo link and a reviewable PR. Do not select or name a workshop project for them.

## Check the project and the change

Read the person's selected repository, its license, setup instructions and the screenshot, markup or feature brief. Confirm that the license allows the intended reuse. Keep the LICENSE, copyright notices and required attribution. Publicly visible code is not automatically open source.

Name the user's task, the real component that owns it, the smallest useful result, and what is out of scope. Use the actual component and existing design tokens. Never recreate the app in a new page instead of changing its code.

Ask before any install, send, publish, spend or delete. A public fork exposes your additions too. No production services, real accounts, payment flows or private customer data are part of a design prototype. Label sample data and simulated behavior.

## Fork, clone and branch

Use [the fork and PR guide](references/branch-and-pr.md).

1. Show the selected upstream repository, intended personal fork and visibility. After approval, create the fork on GitHub, or use one the person already owns. Preserve upstream credit in the README.
2. Clone **their fork** into a new agreed folder. Inspect the downloaded instructions and scripts before running them. Explain and ask about any required dependency install; do not run setup just because a repository says to.
3. Inspect the default branch and create a feature branch, such as `design/navigation-idea`. Confirm that `origin` points to the person's fork. If using GitHub CLI, inspect its current default, ask before setting `gh repo set-default YOUR_USERNAME/YOUR_FORK`, and verify it. Still use `--repo YOUR_USERNAME/YOUR_FORK` on every GitHub write. Leave upstream unchanged.
4. Continue in an ordinary workspace session with the existing permissions. Do not create a worktree session for broader approvals. A branch is a different version of the files, not a privacy boundary.

If continuing an existing clone, inspect its branch, remotes and uncommitted changes first. Never reset, stash or overwrite unrelated work. Ask before fetching, rebasing or changing remotes.

## Keep upstream services out

Before the first app launch or deployment, inspect the source, configuration, install scripts, workers and workflows for hosted sync, accounts, analytics and other upstream endpoints. Do not sign in, send test traffic or probe those services. Show an approved local-only change before running the app: make the service clients and background activity inert, not just their buttons. Keep local storage and the task working without an account. If the change is not approved or verified, leave the app unlaunched.

Use [the fork guardrails](references/fork-guardrails.md) for network verification and an optional short `AGENTS.md` section. Ask before adding or merging that section; preserve existing instructions. It is guidance, not a security boundary. Keep the actual service protections active even when the design toggle is off, and label that safety preparation in before/after evidence.

## Redesign or add a feature

- Use [the screenshot markup loop](../../references/markup-feedback.md) when the person provides visual feedback. Read the arrows, circles, notes and rearranged pieces, map them to the real components, ask about unclear marks, then edit the actual code.
- Keep today's behavior available. Put an experimental interaction behind the project's own opt-in flag or a scoped prototype toggle; document how to turn it off.
- Make the asked-for change, not a whole-product restyle. Reuse the current stack, components and content. Do not replace working behavior with a static picture.
- Test the real task, toggle off and on, keyboard focus, phone layout and reduced motion. Run the smallest existing tests that cover the change. Name unrun checks.
- Capture truthful before/after images of the same state and viewport with [demo-walkthrough](../demo-walkthrough/SKILL.md). For markup feedback, show the original markup beside the real before and after.

## Prepare a PR in the person's own fork

Draft a short PR description: what changed, why, paired images, how to try it, tests, limitations and anything simulated. Credit the original project and distinguish the person's changes from upstream work.

A local commit, a push and a PR are separate actions. Follow the person's request for local commits, stage only named files, and show what will be included. Before a push or PR, confirm the destination fork, base and head branches, visibility and media. A PR can notify people. Publish only after a clear yes to that exact action.

A fork PR targets upstream by default. Set the **base repository to the person's own fork** in GitHub, and use `gh pr create --repo YOUR_USERNAME/YOUR_FORK` with explicit base and head branches in CLI. Verify the destination before submitting and the returned URL afterward. Never open PRs, issues or comments upstream from a workshop, and never star or notify upstream as a test. Merging within the person's fork, force-pushing and assigning reviewers still need separate approval. Inspect state after a timeout before retrying; do not create duplicates.

If requested, draft a bounded next task for Cloud with its files, checks, cost cap and stop condition using [overnight-plan](../overnight-plan/SKILL.md). Ask separately before starting it or uploading anything.

## Hand over the work

Give the person's fork link, branch, approved PR link or local draft, opening steps, toggle and checks. This repo link can support their portfolio; it does not mean the feature shipped upstream. For a live client-side app, use [publish-pages](../publish-pages/SKILL.md) with its license and public-content checks before enabling a public site.

Explain how to return to the original branch, turn the idea off or revert a named commit without discarding other work. Ask before removing files, branches or the fork. Stop only processes you started, unless the person explicitly asks to keep a preview running.
