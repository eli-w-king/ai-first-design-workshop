---
name: overnight-plan
description: "Plan a bounded longer or overnight design run with a budget, checkpoint files, scoped permissions, a stop rule and a morning report. Use for \"plan an overnight run\", \"keep working while I am away\", or \"plan a Cloud task\". Planning does not start a run, change approvals, install software or create an automation."
---

# Overnight plan

Write short, plain sentences. Do not use em or en dashes.

The complete default workflow is here. Do not open linked plugin files to start, complete or verify it. Use optional detail only when the person explicitly asks for it. Normal approvals for their files, tools and consequential actions still apply.

A clear request or an explicit okay approves the named actions, targets and scope. Do not ask again for the same approval. State the plan briefly and proceed; ask only about a genuinely missing consequential detail or a changed scope. This does not bypass host/OS permission prompts, change permission levels, authorize unrelated installs or new charges, or grant access to another account.

## Plan only until approved

Use only the selected workspace and supplied feedback. This is advanced take-home planning, not permission to start a run. Keep fictional findings labeled. Write the plan in chat or the requested workspace file; do not read plugin guides to fill it in.

Ask before any install, send, publish, spend or delete. Do not change permissions, create a schedule, start a Cloud session or keep the machine awake on the strength of a plan request. Use supplied context and built-in file tools. **Do not run terminal commands while planning unless the person explicitly asks for those checks.** A missing Git revision or runtime fact stays unverified; do not run preflight commands to fill it in.

Ask **at most three essential questions**, only for missing information: the goal, the time or usage-budget limit, and what is off-limits. If those are supplied, ask none. Propose clear, labeled defaults for everything else: current workspace, one local session, a 30-minute limit if none was given, existing stack, selected inputs only, checkpoints every 15 minutes, two attempts per failing step, and no installs, accounts, publishing or deletion. The person can adjust these. Leave unknown facts marked unverified, not invented; an unapproved budget means supervised work only. Do not turn the agreement below into a question-by-question interview.

## Fill this agreement

```text
Outcome and what is out of scope:
Workspace, owned repository, base revision and working branch:
Allowed files, inputs and commands; forbidden paths/services:
Steps: each deliverable, its location and the check proving it works:
Start/stop time and time zone; maximum elapsed duration:
Model/effort, number of sessions, approved usage budget:
Host cap if offered, where usage is observed, and any separate compute cost:
Permissions and who can approve a blocked action:
Checkpoint/status path, retry limit and resumption rule:
Owned processes, preview handoff/lifetime, cleanup, reversible changes and undo:
Morning report path and the next human decision:
```

Keep steps independent where possible and verify the actual result, not a completed chat message. Defaults: no installs, uploads, services, sends, publication or deletion; two attempts at the same failing step; local commits only if separately authorized; never push as a checkpoint. Show the completed agreement and wait for approval before execution.

## Runtime, budget and permissions

Prefer the current local workspace with Manual permissions and supported sandboxing. Manual can still honor saved approvals; a sandbox is not a budget or a complete safety boundary. Do a short supervised check. If a needed approval is unavailable, pause that step and save the blocker. Never solve it with Allow all, Autopilot or broad grants.

Respect an already selected model. Otherwise suggest GPT-6.1 Terra at medium effort (low for simple file generation, like a deck file). Switch to GPT-6.2 Sol when the job is hard or Terra stalls. Long context, retries and extra agents can cost more. Included credits are usage too. If the host offers a per-run cap, use the approved one and understand in-flight-call limits. A prompt is not a billing control. Without a usable limit or observable cost, keep paid work supervised rather than promising a bounded unattended run. Never buy credits, enable overage, raise a budget or switch to separately billed access.

Local work needs the laptop awake and its host running. If explicitly approved, macOS `caffeinate -i -t 3600` prevents idle system sleep for one hour; record and stop only its own process. On other systems let the person use their power controls and preserve prior values. Do not change global sleep settings or install utilities automatically.

A one-off Cloud task is optional and separate from a Cloud automation. Explain the exact upload, repository, branch/PR effects and current usage/compute charges, then ask. Public forks are not eligible for Cloud automations; keep workshop recurring templates local. Do not provision machines or remote hosts. Without consent or access, leave a handoff draft.

## During an approved run

Update the agreed `STATUS.md` after each verified step and at least every 15 minutes while working: done, current action, next, blockers, files/commits, usage if exposed and owned process ids. Stop at the first limit: done, deadline, budget, missing approval, secret, unexpected access, or two failures of one step. Do not widen scope to stay busy.

Before resuming, read the last checkpoint and check whether the prior run or owned processes are still active. Do not start a duplicate. Preserve unrelated edits and record any deliberate assumptions.

## Finish and undo

Write the report when work ends, even if early: local paths or already-approved links, changes, real test results, unverified/unfinished work, usage or **unavailable**, cleanup and one next decision. Keep requested design changes visible by default; preserve a before screenshot/revision and show how to revert only this run's named changes after review. Use a switcher only for requested options or requested access to the old version. Stop completed one-off run helpers and the wake lock, and restore approved temporary settings. Keep a development preview you started running while the person is still working in the session or queued follow-ups need it. Give its URL, port, owning terminal/process and how to stop it (Ctrl+C in that terminal or the host's stop control). One completed request is not the end of the session. Stop the preview when the person is done or asks, and never kill a process you did not start. Paid or Cloud services still obey their approved cost and lifetime limits. Do not email, message or publish the report, leave a recurring job, or delete files without approval.

## Optional detail

None of these files is required above. Open one only for an explicit request for extra detail. Opening it may ask to read a file outside your workspace; that is this plugin's own folder. Check the path and request only that access, never a broad exception. Do not fetch another copy to bypass a denied read.

[Longer agreement examples](references/run-agreement.md), [billing background](references/budgets.md).
