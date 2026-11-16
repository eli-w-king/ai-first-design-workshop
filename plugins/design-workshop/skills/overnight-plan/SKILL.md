---
name: overnight-plan
description: 'Plan a longer design run that keeps going while the person sleeps: a plan they approve first, the laptop kept awake, a status file, and a morning summary, with nothing sent or published. Use when someone wants agents to keep working overnight or while they''re away from their laptop.'
argument-hint: 'plan tonight''s work on [project]'
---

# Overnight plan

Let the work keep going while the person sleeps, on their own laptop, with clear limits.

## Plan first

Work in **Plan** mode until the person approves:

1. Recap the day: what's built, what the partner test found, what's still open.
2. Propose the night's work as a short numbered list, for example: round 2 of the picked direction, a walkthrough of
   each, and the case study page updated. Each step says what it produces and where.
3. State the limits: no sending, posting or publishing; no spending; no installs; mock data only; stop at the plan's
   end.
4. Wait for the person's okay. Change the plan if they ask.

## Before they go

- **Plugged in, lid open.** Ask them to keep the laptop plugged in with the lid open.
- **Keep it awake, with their okay.** On macOS, run `caffeinate -dims` in the terminal for the run. On Windows, ask
  them to set **Settings**, **System**, **Power**, **Screen and sleep** to "Never" while plugged in for tonight, and
  to set it back in the morning.
- **Permissions.** By default the agent asks before running commands, and a run that's waiting for a click doesn't
  get anything done overnight. Explain the choice plainly: keep asking (safe, but the run may stop at the first
  command), or switch this one session to a level that approves more on its own for tonight, with the terminal
  sandbox on. Let them choose. Never change it yourself.

## During the run

Keep `STATUS.md` in the project folder current: done, in progress, next, and anything that needs the person. Commit
work as it lands, on the project's own branch, and never push.

## In the morning

When the person says good morning: a short summary of what's done and where, what didn't work and why, and what
needs them. If you ran `caffeinate`, stop it.
