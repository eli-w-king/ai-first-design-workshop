---
version: 1
id: keep-my-taste-current
name: Keep my taste current
description: "Create a first taste-skill draft from notes in this workspace, then propose later updates. Nothing is installed or enabled automatically. Use a Manual trigger and Run now for the first supervised run."
schedule:
  kind: cron
  expression: "0 9 * * 1"
  timeZone: local
---
Use the taste skill. This one prompt handles both the first run and later updates. Run locally in this workspace; keep Run in the Cloud off. Cloud automations are not available for public forks.

Read only this automation's workspace: notes/ in my own words, optional examples/ screenshots, the draft and history here. Never read chat history, email, messaging services, design services, the browser, other folders, or links and symlinks leading outside this workspace. Use only built-in file tools. Require no repository, command-line tools, external schedulers or settings changes.

If there are no notes, return the short note format and stop. Do not search elsewhere or build a profile from assumptions. Explain that selected notes and images go to the chosen model during this run. Nothing is published.

On the first run, create draft/my-taste/SKILL.md. On later runs, preserve the last draft in a new timestamped history/ folder, then propose a new draft and a short draft/review.md. Do not overwrite an existing draft without the needed approval; if approval is unavailable, leave a separate proposal or record the blocker. Keep previous history intact.

Use general words for each rule, with the number of distinct supporting notes and the latest stated date. Mark undated notes as undated and one-note preferences as tentative. Keep disagreements visible. Include no names, companies, client details, links or long quotes. Do not infer preferences from screenshots without my explanatory notes.

Stop after writing the local draft and review. Never read, copy to, or overwrite my personal skills folder during an automation run. I review the exact version and approve a separate live copy step. An existing my-taste requires an approved backup and an explicit okay before replacement.

Use Manual permissions and an ordinary workspace, never Autopilot, Allow all or a worktree. Suggest a mid-priced model such as GPT-6.2 Sol if it is available; do not change models or billing settings yourself. If the host offers a per-run usage cap, use the one I approved. If approval is unavailable, stop rather than broadening permissions. A blocked run holds back the next run.

The person keeps the trigger Manual and presses Run now for the first run. A weekly schedule is an optional later choice, not something this prompt enables. Local scheduled runs happen only while the laptop is awake and the agent is running. Report the draft path, the proposed changes, actual usage if available, and any blocker. Never install, send, publish, buy anything or delete files.

Use short, plain wording with no em or en dashes.
