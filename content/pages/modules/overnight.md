---
title: Overnight
short: Overnight
description: Module {n}. Plan a long run with the session you've used all day, keep your laptop awake, and check it in the morning.
---

## Why

There's no special overnight feature. Overnight is everything you've seen, stacked: skills, automations and sessions that start other sessions, running while you sleep. Your laptop keeps them going as long as it stays awake and plugged in.

The big part happens during the day: keep your decisions and feedback flowing into the session, so the agent has that context when it decides things overnight.

You installed the autonomous-runs skill in setup if you checked it. If not, paste the [setup prompt](setup.html#setup-prompt) again in a new chat and check it in the list.

## First, keep it awake

On a Mac, run this in Terminal and leave the window open:

```sh
caffeinate -d
```

It keeps the screen and the Mac awake until you press <kbd>Control</kbd>+<kbd>C</kbd>. Keep it plugged in, with the lid open: closing the lid still puts a Mac to sleep.

On Windows, plug in your laptop, open **Settings > System > Power & battery > Screen, sleep, & hibernate timeouts**, and set **Make my device sleep after** to **Never** under **Plugged in**.

## On Excalidraw

In your orchestrator, the session with tonight's decisions in it:

```text label="Prompt 15.1"
Use the autonomous-runs skill to plan an overnight run: three new versions of my favorite toolbar from the practice findings in workshop/practice/, a demo video of each, and the page for everyone updated as a draft pull request. Keep a status file up to date as you go. Show me the plan first.
```

Read the plan. At bedtime, switch to **Autopilot** with **Allow all**, then:

```text label="Prompt 15.2"
I'm going to sleep. Keep my laptop awake, start the plan, and run at most two sessions at once. Don't merge or publish anything.
```

In the morning, in the same session:

```text label="Prompt 15.3"
Good morning. What happened overnight? Show me the summary, the videos and the draft pull request.
```

## Before you go

- Give it any answers it will need before you leave. On Autopilot it can't ask you, so it stops or makes its best guess.
- If the plan needs Computer Use, type `/computer on` first: an unattended chat can't turn it on.
- Fewer sessions at once is kinder to a laptop overnight.
- Overnight runs use credits like any session. Check what's left before you start.

## You should see

A status file that keeps updating, and new sessions doing the work. In the morning: a summary of what happened, the videos and a draft pull request. Nothing goes out until you say so.

## On your own work

```text label="Prompt 15.4"
Use the autonomous-runs skill to plan tonight's work on <my project>: <what you want waiting in the morning>. Keep a status file up to date, and don't send, merge or publish anything. Show me the plan first.
```

To close your laptop and keep going, run it on [another computer](module:another-computer).
