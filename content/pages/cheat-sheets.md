---
title: Cheat sheets
key: cheat-sheets
eyebrow: Keep this open
toc: true
description: Workspace and worktree, the ways to run agents in parallel, modes and permissions, steering and queuing, the integrated browser and Mark Up, models and credits, and keeping work going overnight.
---

The terms and controls that come up most, on one page.

## Workspace, repository, branch and worktree

| | What it is | Where you see it |
|---|---|---|
| Workspace | The folder a session works in. **Chat** means no folder yet. | The Workspace picker above the prompt. |
| Repository | A project tracked with Git, with its history. Your Excalidraw copy is one. | On GitHub, and in the Workspace picker. |
| Branch | A named line of work inside a repository. `main` is the one that gets published. | The branch picker in the session options. |
| Worktree | A second folder for the same repository, on its own branch, so a session can change files without touching your main folder. | **New Worktree** in the session options. **Branch** works in the copy already on your laptop. |
| Pull request | A proposed change from one branch into another, with the code to review. Merging it applies it. | On GitHub, in your repo. |

## Ways to run agents in parallel

| | What happens | Use it when |
|---|---|---|
| Subagents | One chat hands parts of a task to helpers, which report back to it. You can't talk to them while they work. | You want one combined answer, faster. |
| Sessions that start sessions | An orchestrator starts full sessions, each with its own branch and chat, nested under it in the Sessions list. | The parts are big, need their own copy of the code, or you want to steer and compare them, like variations. |
| Compare Models | The same prompt runs on 2 to 10 models side by side, with an optional judge. Each attempt costs credits. | You want to see which model does a task best. |

## Modes and permissions

Mode and permissions are one split button in the prompt box.

| Mode | What it does |
|---|---|
| Interactive | Step by step, with you. |
| Plan | Writes a plan first, and does it when you're ready. |
| Autopilot | Keeps going on its own, within its permissions. |

| Permissions | What it does |
|---|---|
| Manual permissions | Asks you when no setting covers it. |
| Assisted permissions | Checks the risk before running each tool. |
| Allow all | Runs tools without asking. |

**Sandboxing for terminal**, in the same menu, fences the agent's terminal commands in. Tonight it's off.

## Steering and queuing

Once a session is running, the **Send** button's menu has:

- **Steer with Message:** reaches the session after its next step. Use it to change direction.
- **Add to Queue:** waits until the current work is done. Queued messages go in order.
- **Stop and Send:** stops the current work and starts on your message.
- **Ask in Side Chat:** asks a question without interrupting.

When a session is already done, plain **Send** sends your message as its next step.

## The integrated browser and Mark Up

| You want to | Do this |
|---|---|
| Show the agent your running app | Ask it to open the localhost link in the integrated browser. |
| Screenshot part of the page | **Add to Chat > Add Area Screenshot to Chat**, then drag a box. |
| Screenshot what you see | **Add to Chat > Add Screenshot to Chat**. |
| Point at one element | **Add to Chat > Add Element to Chat**, or comment on elements. |
| Mark up a screenshot | Click its thumbnail in the chat input, choose **Mark Up**, then **Done**. |
| Screenshot another app | **Add Context (+) > Screenshot App Window...** |

## Playwright, the integrated browser and Computer Use

| Tool | What it reaches | Good for |
|---|---|---|
| The integrated browser | Web pages next to the chat, that you and the agent share. | Your running app: clicking through, testing, screenshots. |
| Playwright | A browser the agent drives on its own. | Recording demo videos, checks at different sizes. |
| Computer Use | Desktop apps, after you approve each one. | Apps without a web version, like Notes. On a Mac, it needs two permissions first. |

## Models and credits

| | |
|---|---|
| Tonight's model | GPT-6.2 Sol at High effort (or GPT-6.1 Sol, the same price). |
| Credits | 1 credit is 1 cent. Copilot Max comes with 20,000 a month. |
| GPT-6.2 Sol | 200 credits per million tokens in, 1,000 out. |
| GPT-6.1 Terra | Half that: 100 in, 500 out. |
| Effort | Higher thinks longer: better on hard problems, slower, more credits. |
| Context | Bigger holds more of a long session, and costs more past 272K tokens. |
| Your usage | Click your picture at the top right of the Agents window. |

## Keeping work going overnight

- Keep your laptop plugged in, with the lid open. Closing a Mac's lid still puts it to sleep.
- On a Mac, run `caffeinate -d` in Terminal, or ask the agent to keep it awake. <kbd>Control</kbd>+<kbd>C</kbd> stops it.
- On Windows, set **Make my device sleep after** to **Never** under **Plugged in** in Power settings.
- Turn on anything the run needs first, like `/computer on`. An unattended chat can't turn it on.
- Or use [another computer](module:another-computer) that stays on.
