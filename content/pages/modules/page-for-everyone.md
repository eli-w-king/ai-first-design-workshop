---
title: A page for everyone
short: A page for everyone
description: Module {n}. A pull request, merged, and GitHub Pages publishing your Excalidraw and a page with all four variations, the video and the pull request.
---

## Why

Not everyone will open a lab or read a pull request. One simple page gives everyone the same view: each variation with a live link, the demo video and the pull request. For developers, the pull request has the code. And GitHub Pages publishes your app itself, so anyone can try it.

## On Excalidraw

Prompt 6 from [Demo videos](module:demo-videos) does all of this. Here's what it did:

1. **The pull request.** All four toolbars, your favorite as the default, and the page for everyone, in a pull request in your own repo.
2. **The page for everyone.** `review/review.json` in your copy fills the page: each variation's name, idea, screenshot and live link, your favorite, the video and the pull request.
3. **GitHub Pages.** It turned on Pages for your repo, set to publish with GitHub Actions.
4. **The merge.** Merging the pull request into `main` starts the publish.

When it says it's done, in the same chat:

```text label="Prompt 7"
Open the pull request, the video, my live Excalidraw and the page for everyone.
```

## You should see

- The merged pull request on GitHub.
- Your Excalidraw, live at `https://<your-username>.github.io/excalidraw-case-study/`, with your favorite toolbar.
- The page for everyone at `https://<your-username>.github.io/excalidraw-case-study/review/`, with all four variations, the video and the pull request.

Share the review link with the person next to you, and open theirs.

## If it doesn't

- **A 404 right after the merge.** Pages is still publishing. Wait a minute and reload.
- **GitHub asks you to sign in.** Run `gh auth login` in the terminal, then say "Try again."
- **Pages failed.** Say: "Check the Pages workflow run, fix what failed and run it again."

## On your own work

Host the page somewhere only your team can open, like your team's internal site, or a GitHub Pages site your organization publishes privately. A Pages site from a personal repo is public, even if the repo is private. Never put unreleased work on a public site.

```text label="Your own work"
Build one simple page for everyone about the variations we made. For each one: its name, a screenshot, a short write-up and its branch, plus the demo video and the pull request. Publish it at <somewhere only my team can open>, and put nothing on it that isn't fine to share there.
```

That's the end of the use case. Next, [apply what we learned to your own work](module:taste), or keep going with the rest of the course on your own time.
