---
title: Test it in the browser
short: Test it in the browser
description: Module {n}. Let the agent click through the app in the integrated browser, find what's broken, fix it and prove it.
---

## Why

An agent that can see and use the app can test it. Ask it to try the real thing in the browser next to the chat: it clicks, drags and types like a person, notices when something's off, finds the cause in the code, fixes it, and shows you it working.

## On Excalidraw

In the same chat:

```text label="Prompt 3"
Draw a few shapes in the integrated browser to test it. If something's broken, find the cause, fix it, and show me a shape drawn after the fix. Then commit the toolbar change and the fix.
```

## You should see

The agent picks tools and drags on the canvas by itself. Something isn't right, and it notices. It finds the cause in the code, fixes it, reloads, and draws a shape that stays. Then it commits your toolbar change and the fix together, so the next step starts from a working app.

## If it doesn't

- **It says everything works.** Say: "Pick the rectangle tool, drag on the canvas, and check that the rectangle stays after you let go. If it doesn't, find out why and fix it."
- **The browser isn't shared with the agent.** Say: "Open the localhost link in the integrated browser and test it there."

## On your own work

Name the flow you changed, and let it click through:

```text label="Your own work"
Click through <the flow you changed> in the integrated browser to test it. If something's broken, find the cause, fix it, and show me it working after the fix. Then commit.
```

It works best on flows you can see: forms, menus, drawing, navigation. For anything that needs a sign-in, sign in yourself in the integrated browser first.
