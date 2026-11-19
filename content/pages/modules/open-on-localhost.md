---
title: Open it on localhost
short: Open it on localhost
description: Module {n}. Move the setup chat into your Excalidraw copy, run it on your laptop, and open it in the browser inside VS Code.
---

## Why

You don't have to decide where work lives before you start. A chat can begin with no folder at all, like your setup chat, and move into a repo when you're ready, history and all. Then the agent runs the app on your laptop and opens it in the browser built into VS Code, right next to the chat, so you both look at the same thing.

## On Excalidraw

In the **setup chat**, the one where you pasted the setup prompt:

```text label="Prompt 1"
Now open my Excalidraw case study. Move this chat there, run it on localhost and show it to me in the integrated browser.
```

While it starts, open `workshop/brief.md` in your copy and read it. It's the practice brief for the next module: fictional user testing on the toolbar, written as problems, not solutions.

## You should see

- The chat moves out of **Chats** and into your `excalidraw-case-study` workspace, with its history. That's a session moving.
- The agent runs `npm start`, which prints a link like `http://127.0.0.1:3000/`.
- Excalidraw opens in the browser next to the chat, with its toolbar at the top.

## If it doesn't

- **The chat didn't move.** Start a new session with `excalidraw-case-study` as the workspace and **Branch** picked, then paste Prompt 1 again.
- **No browser opened.** Say: "Open the localhost link in the integrated browser." The link is also in `.workshop/server.json` in your copy.
- **It says packages are missing.** Say: "Run npm ci, then npm start."

## On your own work

Any repo you can run on your laptop works the same way. Start in a chat, then move it:

```text label="Your own work"
Now open my <repo name> repo. Move this chat there, run it on localhost and show it to me in the integrated browser.
```

New to the words here? Workspace, repository, branch and worktree are side by side on the [cheat sheets](cheat-sheets.html#workspace-repository-branch-and-worktree).
