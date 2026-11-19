---
title: Intro
short: Intro
description: Module {n}. How I work right now, on one map, and this way of working in practice, in production code.
---

## Why

Here's how I work right now, on one map, so you know where the evening is heading. Then the proof: what this way of working has shipped, in real production code, with the pull requests to show it.

## How I work right now

Each number links to the module that covers that part. Tonight we do the top of the map together, from the design context to a page for everyone. The rest is on this site for later.

```flow
alt: How I work right now. First, build the design context: sketches, a clear problem and success criteria. One main session, the orchestrator, takes a marked-up screenshot, makes the initial build and iterates on the base design, then tests it in the browser and fixes bugs. Then it starts the variations, one session each, in one lab you can switch between. The ones we like each get a branch, a demo video and a pull request, and they all come together on one page for everyone. That part is good to run overnight, on another computer or a caffeinated machine. The page goes to stakeholders. Feedback comes back from a meeting transcript, a pull request review and a feedback document, and the next round narrows the variations to one, your pick. Your pick goes to an unmoderated study. User feedback comes back, synthesis turns it into findings, and the next iteration goes back to the study. That loop is good to run on another computer or a caffeinated machine. At the end, in parallel, the final version and its pull request go to a developer, and the final video and the research insights go to stakeholders.
legend: night | Overnight, on another computer or a caffeinated machine | overnight | good for building the variations, videos and page while you sleep. They run fine during the day too.
legend: box | On another computer or a caffeinated machine | another-computer | good for the research loop, so it keeps going while you're away. Any computer that stays awake and plugged in works.
legend: day | No shade | | you and your team, during the day. Ovals are people and what they send back.
```

## This in practice

I'm a product designer on VS Code. This is how I design and ship production code now, not a side project. I open pull requests in the same repositories as the engineers I work with, and the features below are in VS Code today.

- [The VS Code homepage](https://code.visualstudio.com/)
- [My GitHub](https://github.com/eli-w-king)

### My pull requests

A snapshot of my pull requests in public repositories, newest first, taken when this site was built. Closed ones that didn't merge are left out.

```prs
show: 12
```

### What it has made

Each tile is something I made this way: features that are in VS Code now, ones in review, prototypes, and this site.

```wall
label: VS Code homepage
mark: Live
still: wall/homepage.dark.webp
still-light: wall/homepage.light.webp
alt: The VS Code homepage: "Code with precision, collaborate with or orchestrate a team of agents" above a VS Code window with code and an agent chat.
text: We shipped a new VS Code homepage, and I built its opening: one window that stays with you as you scroll.
link: https://code.visualstudio.com/ | code.visualstudio.com

label: Voice Mode
mark: In VS Code
loop: wall/voice-mode.dark.loop.mp4
poster: wall/voice-mode.dark.poster.webp
alt: Voice Mode in the chat input: the box says Listening and glows blue along its edge.
text: I designed Voice Mode's glow: cool while you talk, warm while the agent answers.
link: https://code.visualstudio.com/updates/v1_137#_voice-mode-experimental | Release notes
link: https://github.com/microsoft/vscode/pull/328455 | Pull request
credit: Clip from the VS Code release notes.

label: Dictation
mark: In VS Code
still: wall/dictation.dark.webp
fit: contain
bg: #1a1a1a
alt: The Dictation introduction above the chat input: a microphone picker and a live waveform of what it hears.
text: I added a first step to dictation: pick your microphone and see that it hears you before anything gets written.
link: https://code.visualstudio.com/updates/v1_132#_dictation-onboarding-and-customization | Release notes
link: https://github.com/microsoft/vscode/pull/327869 | Pull request
credit: Image from the VS Code release notes.

label: Compare Models
mark: In VS Code
still: wall/compare.dark.webp
alt: A Compare Models scorecard: Claude Opus 5.5 won, with each attempt's checks, time and tokens.
text: I polished Compare Models: check the models you want, and the results come back as one scorecard.
link: https://code.visualstudio.com/updates/v1_143#_compare-model-results-preview | Release notes
link: https://github.com/microsoft/vscode/pull/339642 | Pull request

label: Koi backgrounds
mark: In VS Code
still: wall/koi.dark.webp
still-light: wall/koi.light.webp
alt: The Agents window with a Koi background: koi swimming behind a new, empty chat.
text: I added Koi Light and Koi Dark as built-in chat backgrounds in the Agents window.
link: https://github.com/microsoft/vscode/pull/345942 | Pull request

label: Needs attention
mark: In VS Code
loop: wall/attention.dark.loop.mp4
poster: wall/attention.dark.poster.webp
alt: Agent sessions in the editor and the Agents window, going through Working, Attention needed, Completed and Failed.
text: Sessions that are waiting on you now say Needs attention, with a new icon to match.
link: https://github.com/microsoft/vscode/pull/340118 | Pull request

label: Image loading
mark: In VS Code
loop: wall/image-gen.dark.loop.mp4
poster: wall/image-gen.dark.poster.webp
alt: A generated image loading in chat: a square of dots grows into the finished picture, a grid of colorful pixel creatures.
text: I made generated images load in a square that only grows into the picture.
link: https://github.com/microsoft/vscode/pull/342699 | Pull request

label: Model picker motion
mark: In review
loop: wall/picker-motion.dark.loop.mp4
poster: wall/picker-motion.dark.poster.webp
alt: The model picker's details: the selection slides between effort levels, context sizes and speeds.
text: I made the effort, context and speed choices in the model picker slide the same way every time.
link: https://github.com/microsoft/vscode/pull/347216 | Pull request

label: Close Others
mark: In review
still: wall/close-others.dark.webp
alt: The chat tab menu in the Agents window, with Close Others highlighted.
text: Right-click a chat tab and choose Close Others to keep just that one open.
link: https://github.com/microsoft/vscode/pull/347990 | Pull request

label: Model picker
mark: Prototype
loop: wall/model-picker.dark.loop.mp4
poster: wall/model-picker.dark.poster.webp
alt: The model picker prototype: tabs for GitHub Copilot, ChatGPT and Claude, each with its own list of models, then a search across all of them.
text: I prototyped a model picker with a tab for each place your models come from, then tested it with three people.
link: https://github.com/eli-w-king/eli-vscode/tree/eli/agents/rebase-vscode-upstream-redesign-model-picker | Branch on GitHub

label: Bring your own key
mark: Prototype
loop: wall/byok.light.loop.mp4
poster: wall/byok.light.poster.webp
alt: The Agents window's sign-in screen, then the Bring your own key form with OpenAI picked and the API key hidden.
text: I prototyped a way to start in the Agents window with your own API key instead of signing in.
link: https://github.com/eli-w-king/eli-vscode/tree/eli/byok-ootb-signin-walkthrough | Branch on GitHub

label: This workshop site
mark: Live
size: wide
still-light: wall/site.light.webp
alt: The home page of this workshop site: "AI-First Design Workshop" with UXPA Seattle, the date and the setup button.
text: You're looking at it: agents built this site, its diagram and its checks, overnight.
link: index.html | The home page
link: https://github.com/eli-w-king/ai-first-design-workshop | Source on GitHub
```

## Next

Meet the one project we'll work on together: [Case study: Excalidraw](module:case-study).
