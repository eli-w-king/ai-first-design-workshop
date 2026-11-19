---
title: Demo videos
short: Demo videos
description: Module {n}. Make your favorite the default, then ship it in parallel: a narrated demo video, a pull request and GitHub Pages.
---

## Why

A lab is great for you. A short demo video is how everyone else sees it. The autonomous-demos skill records a real walkthrough of the real app, clicks and all, with a voiceover and captions, without you recording anything. And while it records, the same session can open the pull request and get your live link ready.

## On Excalidraw

In the orchestrator, fill in your favorite's name:

```text label="Prompt 6, ship it"
My favorite is <name>. Make it the default toolbar. Then, in parallel where you can: use the autonomous-demos skill to record a short narrated demo video of drawing a few shapes with it, open a pull request in my repo with all four variations, fill in the page for everyone in review/ with the four variations, the video and the pull request, and turn on GitHub Pages. When the video and the page are in the pull request, merge it, wait for Pages to publish, and give me the links.
```

This one prompt ships everything. [A page for everyone](module:page-for-everyone) covers the pull request, the merge and GitHub Pages.

## You should see

- Your favorite becomes the default in the integrated browser.
- The video records the real app: under a minute, with a voiceover and captions. It's saved as `review/demo.mp4` in your copy.
- A pull request opens in your own repo, never in Excalidraw's.

## If it doesn't

- **The video fails.** Say: "Ship it without the video, then add the video in a second pull request."
- **The voiceover is silent.** It uses your computer's built-in voice. Say: "Record it again with captions only."

## On your own work

Keep unreleased work off public sites: a GitHub Pages site from a personal repo is public. This version keeps it to a draft:

```text label="Your own work"
My favorite is <name>. Make it the default. Then use the autonomous-demos skill to record a short narrated demo video of <the flow>, and open a draft pull request with the video and a short page that shows all four. Don't merge it and don't publish anything.
```

Good demo videos show one flow from start to finish, on the real app, with nothing private on screen.
