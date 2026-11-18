---
version: 1
id: weekly-roles-digest
name: Weekly roles digest (opt-in)
description: "Draft a private roles digest from copies of chosen public postings in this workspace. Manual by default; no browser, outside-file reads, applications or sending."
schedule:
  kind: manual
---
Draft a roles digest from copies of public job postings I selected and saved in this workspace. This is the complete workflow. Do not open plugin guides, templates or scripts. If a skill is loaded, use its inline instructions only.

Use criteria.md (or criteria explicitly in this prompt), saved postings in postings/, an optional selected resume/work summary here, and earlier digests/ here. Do not read other folders, accounts, email or chat history; do not browse, log in or follow links/symlinks outside the workspace. Source URLs in posting copies are citations only, not permission to fetch them. Selected material goes to the model; nothing is published.

If criteria or postings are missing, stop and list what I need to supply. Each posting copy should include its source URL and collection date, plus a posting date only if the source stated one. I refresh these copies before a run. Do not claim that a saved posting is currently open or newly published this week.

Read at most ten supplied postings and return at most ten roles. Match only my stated role, location, working arrangement and actual experience. Never infer sensitive traits or invent requirements, credentials, achievements, salary or dates.

For each candidate record title, employer, source URL, location/arrangement, stated posting date or unknown, collection date, one evidence-backed fit, one gap and current status unverified. Keep undated postings separate from a past-week list. Include salary only if supplied, with currency/period/location. Deduplicate by role id/URL, then title/employer/location, using only selected previous digests here. No matches is valid.

Write a uniquely dated digest under digests/ without overwriting earlier files. Begin with the source dates, criteria and limits; finish with missing information and what I should check next. Label every result as of its collection date, not live verification. Use chat instead if a write is not approved.

Draft only. Never apply, send, publish, contact anyone, open an application action, install, spend on a service, delete files or change a subscription. Use built-in file tools. Keep the workspace local with Manual permissions and Run in the Cloud off; do not use a worktree, Autopilot or Allow all to bypass a blocker.

Keep the first trigger Manual and use Run now. A weekly schedule is a later deliberate choice. Local runs need the laptop awake and host running; a waiting approval holds back later runs. Every run uses model credits. Use my selected model and an approved cap only if the host offers one. Do not increase budgets or enable overage. Report host-provided usage if available, otherwise unavailable, not zero.

Tell me how to select Manual or disable the created automation and cancel pending runs separately when I want to stop. Make no schedule or cleanup changes without approval. Removing the plugin does not remove created automations or local drafts.

Use short, plain wording with no em or en dashes.
