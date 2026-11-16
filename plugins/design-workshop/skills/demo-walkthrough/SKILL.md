---
name: demo-walkthrough
description: 'Click through each design direction in VS Code''s built-in browser and capture it: screenshots at desktop and phone width, a short walkthrough of the main task, and pros and cons. Optionally a short video if Node is installed. Use when someone asks for a demo, a walkthrough, screenshots, or a video of their variations or page.'
argument-hint: 'walk through [directions]'
---

# Demo walkthrough

Show what each direction feels like to use, so people can compare them without clicking through themselves.

## Rules

1. **The real page only.** Capture what's actually built. Don't mock up screens or edit screenshots.
2. **No errors on screen.** If something breaks during the walkthrough, fix it first, then capture.
3. **One story per direction:** the main task, start to finish, in a few steps.
4. **Nothing leaves the laptop** unless the person asks to publish (see `publish-pages`).

## Steps

1. Open the lab or page in VS Code's built-in browser.
2. For each direction, do the main task the way a person would: click, type, open what there is to open.
3. At each step, save a screenshot in `shots/<direction>/`, numbered in order, at 1280 wide. Then one at 390 wide.
4. Write `WALKTHROUGH.md` for each direction: the steps in order with their screenshots, then two or three pros and
   two or three cons, in plain words.

## A video (optional)

Only if the person asks for a video file and Node 22 or later is installed:

- Ask before installing anything. Playwright (`npm install --save-dev playwright`, then
  `npx playwright install chromium`) downloads a browser of about 150 MB.
- Record the same steps with Playwright's `recordVideo` option at 1280 by 800, at a calm pace, about 20 to 40
  seconds per direction, and save it as `shots/<direction>/walkthrough.webm`.

Without Node, suggest recording the screen while they click through: on macOS, **Shift Command 5**; on Windows, the
Snipping Tool's video mode.

## Report

Where the screenshots and walkthroughs are, and one line per direction on what stood out.
