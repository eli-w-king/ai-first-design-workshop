---
title: "Case study: Excalidraw"
short: "Case study: Excalidraw"
description: Module {n}. Excalidraw, the open-source whiteboard we redesign together tonight, and what we'll do to its toolbar.
---

## Why

Excalidraw is the one project we work on together tonight. It's real, open-source code that people use every day, it's small enough to run on a laptop, and it has a toolbar everyone has an opinion about.

## What Excalidraw is

[Excalidraw](https://github.com/excalidraw/excalidraw) is an open-source whiteboard with a hand-drawn look. You draw boxes, arrows and notes that look like a quick sketch, and it all runs in the browser. It's under the MIT license, so anyone can copy it, change it and share what they made.

## The toolbar we'll redesign

```figure
still: intro/excalidraw-toolbar.png
alt: Excalidraw's toolbar: a lock, the hand and the selection arrow, then the shape, arrow, line, pencil, text and sticky note tools and the eraser, each with a small letter shortcut, and a menu at the end. Under it: "To move canvas, hold Scroll wheel or Space while dragging, or use the hand tool".
caption: The toolbar in your copy, at the top of the canvas.
```

It's the row of tools at the top of the canvas. It does a lot in a small space: the lock, the hand, selection, a row of drawing tools with letter shortcuts, and a menu. In our practice brief, people testing it got stuck in a few places. You'll read their notes, mark up a screenshot of what confused them, and fix it.

## Your own copy

During setup, you make your own copy of a trimmed Excalidraw on GitHub, `excalidraw-case-study`, and download it to the workshop folder on your laptop. It's yours: your changes, your pull requests, your live link.

To keep it small and quick on venue Wi-Fi, we took out what we don't need tonight:

- live collaboration, share links and cloud storage
- the AI features and Mermaid
- Excalidraw+ links and sign-in
- error reporting and analytics
- the offline app install
- every language but English

Drawing, the shape library, the command palette, undo and redo, saving in your browser, and PNG and SVG export all still work. It looks and feels like Excalidraw.

## The practice brief

Your copy has two short documents in its `workshop` folder. Both are **fictional practice material for this workshop, not Excalidraw's roadmap or research.**

- `workshop/brief.md`: we're the team that owns Excalidraw, and user testing found problems with the toolbar. It's written as problems, with short quotes, not solutions, plus what success looks like.
- `workshop/pm-follow-up.md`: after talking with customers, the PM team wants to see four very different toolbars before committing to one.

## What we'll do

In about an hour, all on your own laptop:

1. [Open it on localhost](module:open-on-localhost), in the browser inside VS Code.
2. [Mark up a screenshot](module:mark-up) of the toolbar, and make a quick change from it.
3. [Test it in the browser](module:test-in-the-browser): the agent draws, finds a bug and fixes it.
4. [Start four sessions at once](module:parallel-sessions), one per direction from the PM team.
5. [Switch between them in a lab](module:variation-labs), and steer them while they build.
6. [Record a demo video](module:demo-videos) of your favorite.
7. [Ship it](module:page-for-everyone): a pull request, merged, live on GitHub Pages, with a page for everyone.

## Credit

Based on [Excalidraw](https://github.com/excalidraw/excalidraw) (MIT). We're not affiliated with the Excalidraw team, and nothing we do tonight goes to their repository. Every pull request goes to your own copy.
