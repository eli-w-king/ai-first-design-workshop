---
name: variations
description: "Build exactly N distinct design directions plus the current version as a baseline, in the person's existing project. Use for \"make three variations\", \"explore options\", \"compare directions\", \"a lab for this screen\", or \"round two from this feedback\". Include a switcher, side-by-side comparison, real project content, and responsive and reduced-motion checks."
---

# Variations

Write short, plain sentences. Do not use em or en dashes.

The complete default workflow is here. Do not open linked plugin files to start, complete or verify it. Use optional detail only when the person explicitly asks for it. Normal approvals for their files, tools and consequential actions still apply.

## Scope and safety

Read the current project and supplied material. Set one question, audience/task, unchanged surroundings, content, count and work budget. Default to three new directions if no count is given. Name each idea first; replace near copies. A different color is not a different design approach. Do not promise unrehearsed timing.

Ask before installs, sends, publishing, spending, deletion or additional sessions. Keep existing permissions and unrelated work. Use the current stack and components; a new tiny page can use plain HTML/CSS/JS without dependencies. Use approved real content or clearly labeled fictional sample data, never invented research or testimonials. Keep upstream sync, accounts and analytics inert in every direction and baseline. Local storage does not mean local AI processing.

## Build one lab

1. Use a new agreed folder such as `labs/<question>/`, or the app's existing variant mechanism. Preserve the app's entry point. Copy/reuse today's real version as **0: Today**, separate from the N new directions. Label a screenshot-only baseline **reference image, not interactive**; never invent a working one.
2. Give each direction a stable id, name, distinct structural/interaction idea, benefit and trade-off. Keep the task, content and surrounding UI identical. Use separate `v1/`, `v2/` folders or scoped components so styles do not leak.
3. Make one review page with a named switcher, previous/next buttons, direct `?v=<id>` links, and `[` / `]` navigation that ignores typing, modified keys and embedded mode. Preserve equivalent task state when switching; label resets when flows differ.
4. Add comparison of two chosen directions at the same logical viewport and task state; stack on narrow screens. `?embed=1` hides review controls, not product controls. `?motion=off` and system reduced motion stop nonessential motion without losing content or actions.
5. Write brief notes and a manifest using this shape. Include every actual direction; missing stills and an unknown revision stay `null`.

```json
{
  "question": "The one design question",
  "baseline": "0",
  "picked": null,
  "sourceRevision": null,
  "directions": [
    {"id":"0","name":"Today","kind":"interactive","path":"v0/index.html","idea":"Unchanged baseline","desktopStill":null,"phoneStill":null},
    {"id":"1","name":"A distinct idea","kind":"interactive","path":"v1/index.html","idea":"What changes and why","desktopStill":null,"phoneStill":null}
  ]
}
```

Use `baseline: null` if absent, or `kind: reference-image` for a still. Document opening steps, content sources, assumptions, files, checks and integration steps. With screenshot markup, read the image itself, map each mark to the real component, ask about ambiguity, edit only the confirmed parts and show the markup with actual before/after captures. Do not substitute text-only feedback or a recreation.

## Parallel sessions when requested

For three directions in separate sessions, get approval for the count, model/cost and ownership. In the Agents window, start three **New Session > This Computer** sessions using the same approved folder and already selected **Branch**, not an automatic New Worktree. Inspect permissions; worktrees can use Allow all. Start all three without waiting for one to finish, and record their identities and states.

Give each the whole brief and one exclusive file set. The current coordinator owns baseline, shared data/routes and the comparison page. Shared-folder sessions do not isolate files: workers do not switch branches, stage, commit, edit dependencies/shared files or stop each other's processes. Serialize overlapping work or agree on separate source copies. Do not label sequential work or one-chat subagents as three sessions. Use the approved model, or suggest a mid-priced option; never choose the most expensive setup by default.

## Verify and iterate

Use available built-in browser tools first. Check each direction and comparison at 1440, 1280, 820 and 390 CSS pixels wide, keyboard/touch, normal and reduced motion. Check the real task, focus, wrapping, assets, console errors, direct links and shortcuts. Save and inspect desktop/phone stills when tools permit. Name unavailable checks instead of claiming a pass.

Give the local path/URL, one sentence per idea, trade-offs and verified gaps. Keep a development preview you started running while the person is still working in the session or queued follow-ups need it. Give its URL, port, owning terminal/process and how to stop it (Ctrl+C in that terminal or the host's stop control). One completed request is not the end of the session. Stop the preview when the person is done or asks, and never kill a process you did not start. Stop completed one-off checks separately. Preserve earlier rounds; new ids carry exact feedback and named picks. Integrate the chosen implementation faithfully only when asked, making that chosen change the app's default unless the person asks to keep alternatives switchable. Ask before removing anything or changing the main product.

## Optional detail

None of these files is required above. Open one only for an explicit request for extra detail. Opening it may ask to read a file outside your workspace; that is this plugin's own folder. Check the path and request only that access, never a broad exception. Do not fetch another copy to bypass a denied read.

[Lab brief examples](references/lab-brief.md), [expanded conventions](references/lab-conventions.md), [parallel-session background](references/parallel-sessions.md).
