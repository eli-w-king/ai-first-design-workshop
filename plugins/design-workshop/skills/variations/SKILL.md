---
name: variations
description: "Build exactly N distinct design directions plus the current version as a baseline, in the person's existing project. Use for \"make three variations\", \"explore options\", \"compare directions\", \"a lab for this screen\", or \"round two from this feedback\". Include a switcher, side-by-side comparison, real project content, and responsive and reduced-motion checks."
---

# Variations

Write short, plain sentences. Do not use em or en dashes in generated copy.

Build alternatives a person can use and compare, not three colors of the same layout.

## Agree on one question

Read the current project and the material the person selected. Ask only for missing essentials: the screen, the user's task, the design question, the count and the work budget. Default to three new directions when no count is given. Do not promise a completion time you have not rehearsed.

For an annotated screenshot, use [the screenshot markup loop](../../references/markup-feedback.md): map marks to real code, ask about ambiguity, and show the markup with actual before/after captures. Do not turn visual feedback into text-only feedback.

Use [the lab brief](references/lab-brief.md) to record the question, what stays unchanged, input content, and one name and one-line idea per direction. If two ideas describe the same approach, replace one before building.

## Keep the work local

- Ask before any install, send, publish, spend or delete. A request for variations does not authorize extra paid sessions or uploads. Do not change permissions.
- Use the existing project's stack and components. For a new small page, prefer plain HTML, CSS and JavaScript with no dependencies. Never replace a working app just to make the lab easier.
- Use approved real project copy and assets. For a fictional prototype, label the supplied sample content as fictional. Never invent customer quotes, usage numbers or testimonials. Ask for safe sample content when it is missing.
- For an existing fork, use its approved local-only preparation for every direction and the baseline. Follow [the fork guardrails](../prototypes/references/fork-guardrails.md); never reconnect upstream services to show today's design.
- Keep production data, payments, accounts and outside services out of the prototype. Inputs sent to the AI still use the selected provider; local files do not mean local inference.
- Work only in a new agreed lab folder or the project's existing variant mechanism. Preserve unrelated edits. Do not start worktree sessions or other agents without approval of their cost and permissions.

## Build the set

1. Keep today's working version as **0: Today**, separate from the N new directions. Reuse its real code and surrounding UI. If the only baseline is a screenshot, label it **reference image, not interactive**. Do not invent a working baseline.
2. Give every direction a stable id, a short name and a different structural or interaction idea. Hold the task, content and surrounding UI constant.
3. Put files in `labs/<question>/v1/`, `v2/` and so on, or use scoped components in the current app. Keep the current app's entry point unchanged.
4. Build a single review page with a small named switcher, `?v=`, previous and next buttons, `[` and `]`, and a side-by-side comparison of two chosen directions. See [the lab conventions](references/lab-conventions.md).
5. Respect `?motion=off` and system reduced motion. `?embed=1` hides review controls, not product controls. Keep the full flow usable by keyboard and touch.
6. Add a short note per direction: its idea, what it helps, its trade-off and what is simulated. Add a manifest and opening instructions using the conventions reference.

For "three directions, each in its own session", follow [parallel Agents-window sessions](references/parallel-sessions.md). After the three-session scope and cost are approved, start three distinct sessions concurrently, one direction and one exclusive file set each. Keep the baseline, shared content and single comparison page in the current coordinator session. Do not quietly substitute sequential work or subagents inside one chat and call it three sessions.

Use the person's approved model or suggest a mid-priced option such as GPT-6.2 Sol if offered, not the most expensive model by default. More sessions consume more usage. Shared-folder sessions do not isolate files: workers do not switch branches, stage, commit, change shared files or stop each other's processes.

## Check before handing it over

Use the existing built-in browser tools first. Check each direction and the baseline at 1440, 1280, 820 and 390 CSS pixels wide, normal and reduced motion. Check the main task, keyboard focus, switcher, comparison, wrapping, missing assets and console errors. Save and inspect desktop and phone screenshots. If a browser check is unavailable, name it as unverified, not passed.

Give the local path or URL, one sentence per direction, the checks and gaps, and ask which direction to keep. Stop your test server unless the person explicitly asks to keep it running; give its restart command. Removing the lab later requires approval and affects only its named folder, not the original app.

## Make another round

Carry forward the person's named picks and exact feedback. Keep previous rounds reachable. Add new ids instead of overwriting them. Record what each change answers. When they choose a winner, use [prototypes](../prototypes/SKILL.md) to integrate that exact version, not a new interpretation. Ask before changing the main product or removing any alternatives.
