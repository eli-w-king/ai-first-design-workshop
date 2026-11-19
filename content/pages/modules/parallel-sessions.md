---
title: Parallel sessions
short: Parallel sessions
description: Module {n}. One session starts four more, one per design direction, all building at the same time.
---

## Why

When you want to compare really different ideas, each one needs its own session: its own branch, its own copy of the code and a chat you can talk to. One main session, the orchestrator, starts them, keeps them nested under it, and collects what they make. It uses the autonomous-variations skill from your setup.

## On Excalidraw

Open `workshop/pm-follow-up.md` in your copy. It's fictional practice material: after talking with customers, the PM team wants four very different toolbars before committing to one:

- minimal and calm
- playful and expressive
- dense for power users
- big and touch friendly

Then, in the same chat:

```text label="Prompt 4"
The PM team came back with workshop/pm-follow-up.md. Use the autonomous-variations skill to build the four toolbars it asks for. Start four sessions under this one, one per direction. Each one starts from this branch, works on its own branch, adds only its own toolbar file and keeps the canvas clear. When all four are done, put them together in one lab I can switch between in the integrated browser, and give me the link.
```

Each direction gets its own file in `src/workshop/toolbars/`, so the four never collide.

## You should see

- Four new sessions nested under this one in the Sessions list, one per direction, all working at once.
- Messages from the orchestrator marked as sent from another session, so you can tell them from your own.

As soon as they start, go on to [Variation labs](module:variation-labs): they can finish in about 3 minutes. Steer one and queue a message to another right away, then tour the Sessions list while they build.

## If it doesn't

- **No sessions start.** Say: "Run the four as parallel subagents instead, one per direction."
- **It's slow.** Steer the orchestrator with: "Keep each one to one file and one screenshot."
- **One fails.** Keep going with the other three.

## Sessions or subagents? {collapsed}

- **Subagents** split one task so it gets done faster. Each reports back to the same chat, and you can't talk to them while they work. Good for reviews and research.
- **Sessions that start sessions** are full sessions, each with its own branch and chat. You can open one, steer it and compare them. Good for variations.
- **Compare Models** runs the same prompt on 2 to 10 models side by side. Good for picking a model.

The [cheat sheets](cheat-sheets.html#ways-to-run-agents-in-parallel) have them side by side.

## On your own work

Name the part of your product and four directions that really differ:

```text label="Your own work"
Use the autonomous-variations skill to build four very different versions of <the part of your product>: <direction 1>, <direction 2>, <direction 3> and <direction 4>. Start four sessions under this one, one per direction, each on its own branch from this one. When all four are done, put them in one lab I can switch between in the integrated browser, and give me the link.
```

Other things that run well in parallel while you design: an accessibility review, a contrast check, the same screen at phone width.
