---
name: variations
description: 'Build a few really different design directions of one screen or flow, side by side, in plain HTML with mock data, and a switcher page to step through them. Use when someone asks for variations, directions, options, alternatives, or a lab for a screen, a case study, or a redesign. Also makes round 2 from partner notes.'
argument-hint: '[how many] directions of [the screen], for [who]'
---

# Variations

Explore a design question by building a few really different directions of one screen or flow, in real code, so the
person can click through them side by side and pick.

## Before you start

Get a short brief. Ask for anything that's missing, in one message:

- **The screen or flow:** for example "the checkout page in my case study".
- **Who it's for, and the job they're doing.**
- **The question:** what should the directions answer? For example "how do we make the plan comparison easier to
  scan?"
- **How many:** default to 3. Build exactly that many.
- **Their material:** the case study, screenshots, a PDF or an old page, in this folder. Read it first.

## Rules

1. **Really different ideas, not near copies.** Each direction takes a different approach to the question (layout,
   structure, interaction), not a different color.
2. **A design prototype, not a product.** Use mock data. Don't build a backend, a database, sign-in, or real
   payments. No calls to outside services.
3. **Plain HTML, CSS and JavaScript.** No build step, no installs, no packages. It must open from the file.
4. **Each direction in its own folder:** `v1/`, `v2/`, `v3/`. If there's a current version (a screenshot or an old
   page), rebuild it as `v0/` so people can compare. Never edit another direction's folder.
5. **Finish in about 10 minutes.** Pick a smaller scope rather than run long. Say what you cut.
6. **Work in this session.** If you can run helpers in parallel, give each one direction and its own folder. Don't
   start other sessions.
7. **Nothing leaves the laptop.** Don't publish, push or send anything. That's the `publish-pages` skill, with the
   person's okay.
8. **Respect the person's taste and voice files** if they have them (see `voice-and-taste`).

## What to build

For each direction, in its folder:

- `index.html`, a complete flow someone can click through for one task, not a static picture.
- It works at desktop width (1280) and phone width (390), and with reduced motion.
- `NOTES.md`: the idea in one line, what it's good at, and what it gives up.

Then a lab page at the top, `index.html`:

- It shows one direction at a time, full size, with its name in a small label.
- `?v=1` opens direction 1. The `[` and `]` keys step back and forward, and so do two small buttons.
- `?v=0` is the current version, if there is one.

## Check your work

1. Open the lab in VS Code's built-in browser.
2. Step through every direction at 1280 and at 390 wide. Fix anything broken, cut off, or unreadable.
3. Save a screenshot of each at both widths in `shots/`.

## Report

In a few lines: the lab's path (or its local address), and one line per direction with its idea. Then ask which ones
they want to keep.

## Round 2

When the person shares notes (from a partner test, or their own), make the next round in new folders (`v4/`, and
so on). Never overwrite an earlier direction: the history is part of their story. Note in each new `NOTES.md` which
feedback it answers, quoting the notes word for word.
