---
title: Mark Up a screenshot
short: Mark Up a screenshot
description: Module {n}. Screenshot the toolbar in the integrated browser, mark up what confused people, and make one small change from it.
---

## Why

Designers think in pictures. Instead of describing a problem in a paragraph, circle it. VS Code has **Mark Up** built in: screenshot the real app, draw on it, and send it to the agent with your note. Then ask for a small change, from the problem, not a solution, and watch it land in the browser right away.

## On Excalidraw

**The brief.** Open `workshop/brief.md` in your copy, if you haven't yet. It's fictional practice material: what testers said about the toolbar, as problems, with short quotes.

**The screenshot:**

1. In the integrated browser's toolbar, open **Add to Chat** and choose **Add Area Screenshot to Chat**.
2. Drag a box around Excalidraw's toolbar. The screenshot lands in the chat input.
3. Click the screenshot's thumbnail in the chat input. In **Images Preview**, choose **Mark Up**.
4. Mark it up:
   - **Ellipse** or **Draw** to circle what confused testers
   - **Arrow** to point at it
   - **Text** for a short note with your idea
   - **Crop** to trim it to the toolbar
5. Choose **Done**. Your marked-up screenshot is attached. (<kbd>Esc</kbd> also keeps your marks; it doesn't throw them away.)

**The quick change.** With the screenshot attached:

```text label="Prompt 2"
Here's my marked-up screenshot. Use it and the user testing notes in workshop/brief.md to fix what confused people about the toolbar. Make the change on a new branch, and keep it small so I can see it right away.
```

## You should see

The agent reads the brief and your marks, changes the toolbar on a new branch, and the browser next to the chat shows the change within a minute or so.

## If it doesn't

- **No Mark Up in Images Preview.** Send the screenshot as it is, and say what you'd mark in the prompt.
- **The change doesn't show.** Reload the integrated browser.
- **It changed too much.** Say: "Undo that and make the smallest change that fixes the top problem in the brief."

## Mark Up's tools {collapsed}

| Tool | What it does |
|---|---|
| Draw | Freehand marks |
| Arrow | Points at something |
| Rectangle, Ellipse | Boxes and circles around things |
| Text | A note on the image |
| Eraser | Removes a mark |
| Crop | Trims the image |
| Select / Move | Moves your marks (not the screenshot itself) |
| Undo, Redo | Steps back and forward |

## On your own work

Screenshot any screen of your app the same way, mark up what's wrong, and give the problem:

```text label="Your own work"
Here's my marked-up screenshot. <One line on what's wrong, from your research or your own eye.> Fix it on a new branch, and keep it small so I can see it right away.
```

Not in the integrated browser? **Add Context (+)** can also take a screenshot of another app's window.
