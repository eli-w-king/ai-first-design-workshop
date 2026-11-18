---
name: taste
description: "Create or update a personal taste skill from notes in a chosen workspace. Use for \"set up my taste\", \"update my taste\", or the Keep my taste current automation. First runs create a local draft; later runs propose updates with note counts and dates. Never reads chat history or other folders, and never installs a personal skill without an explicit okay."
---

# Keep my taste current

Write short, plain sentences. Do not use em or en dashes.

The complete default workflow is here. Do not open linked plugin files to start, complete or verify it. Use optional detail only when the person explicitly asks for it. Normal approvals for their files, tools and consequential actions still apply.

## Boundaries

Read only the chosen workspace: `notes/`, explained screenshots in `examples/`, `draft/` and `history/`. Never read chat history, accounts, browser pages, other folders or symlinks leading outside. Notes go to the selected model; nothing is published. Use built-in file tools, not command-line setup, a repository, a scheduler or settings changes.

Keep an ordinary workspace with Manual permissions. Do not enable Autopilot, Allow all or a worktree. Ask before any install, send, publish, spend or delete. A draft request never authorizes personal installation. If a necessary approval is unavailable, stop that action without widening access.

## Draft from the notes

1. If no notes are present, return this note format and stop: **date, context without private names, what I wanted changed or kept, why, requirement or preference, optional example filename**. Do not collect material elsewhere.
2. Group the person's repeated preferences. Count distinct supporting notes, not repeated copies. Use the latest stated note date, not the current date or file time; write **undated** when necessary. Use screenshots only with the person's explanatory notes.
3. Keep one-note preferences tentative and contradictions visible. Separate accessibility/product requirements from taste. Infer no identity or personality traits. Rules contain no names, companies, client details, links or long quotes.
4. Create `draft/my-taste/SKILL.md` using the structure below. Before an approved update, preserve the complete prior draft in a new `history/<timestamp>/my-taste/SKILL.md`. Never overwrite history. Without approval to replace the draft, write a separate proposal instead.
5. Write `draft/review.md`: added/changed rules, supporting local note ids and counts, latest dates, conflicts and uncertainty. Do not reproduce the raw notes. With no supported change, say so.

```markdown
---
name: my-taste
description: Apply my approved design preferences when I ask for design feedback, a polish pass, or a review in my taste. Keep them scoped and follow my current request when it differs.
---
# My taste
Status: draft for review.
## Preferences
- [General rule and context.] Supporting notes: [count]. Latest note: [date or undated]. Confidence: [tentative or repeated].
## Requirements and limits
- [Accessibility requirements, contradictions and exceptions supported by the notes.]
These are preferences, not universal laws. Do not collect more samples or change these rules without asking.
```

Replace brackets only with supported content. Keep `name: my-taste` aligned with its folder and the description under 1024 characters. Report the two local draft paths and what remains uncertain. Do not claim installation.

## Separate installation and repetition

Only after a person reviews this exact version and says okay in a live follow-up may you inspect and copy to their personal `my-taste` folder. Standard Copilot locations are `~/.copilot/skills/my-taste/` or `%USERPROFILE%\.copilot\skills\my-taste\`. Explain those outside-workspace operations first. An existing skill needs an approved dated backup and explicit replacement consent; preserve unrelated files. Copy only approved skill files, not notes, screenshots or history, and verify discovery in a fresh session. Scheduled runs never perform this step.

The local automation template enables nothing on installation. From a template, choose the model and effort in the **New Automation** dialog. If created from chat, open it under **Automations**, set the model and effort, **Save**, then **Run now**. Check the saved choice before running; naming a model in the prompt does not select it and an unset model can use the account default. Keep the first trigger Manual. Suggest GPT-6.1 Terra at medium effort (low for simple file generation, like a deck file). Switch to GPT-6.2 Sol when the job is hard or Terra stalls. These are choices for the person, not runtime prompt settings. A weekly schedule is a later choice; local runs need the laptop awake and its host running, and a waiting approval holds back later runs. Use an approved per-run cap only if offered. Do not change models or billing without approval.

Undo requires approval: disable/delete the created automation, remove the chosen draft workspace or plugin, and separately remove an installed personal copy or restore its reviewed backup. Plugin removal does not remove a created automation or personal skill. Voice can use this pattern later; no voice template ships here.

## Optional detail

None of these files is required above. Open one only for an explicit request for extra detail. Opening it may ask to read a file outside your workspace; that is this plugin's own folder. Check the path and request only that access, never a broad exception. Do not fetch another copy to bypass a denied read.

[Folder examples](references/getting-started.md), [draft background](references/draft-shape.md), [automation template](../../automations/keep-my-taste-current.automation.md).
