---
title: Tonight's run of show
layout: agenda
noindex: true
eyebrow: Agenda · unlisted
description: Eli's run of show for the AI-First Design Workshop.
---

Thursday, Nov 19 · 5:30 to 8:30 PM. Slide numbers are the deck's. The coupon code is only on slide 8. Prompts copy exactly as on the site.

## 5:30 · Food + hello

**Slide:** 1, the title.

**Say:** "Grab food and a seat, get your laptop out and plugged in."

**Do:** eat, open laptops, join the Wi-Fi.

**Watch for:** anyone without a GitHub account: [github.com/signup](https://github.com/signup) now, it saves time at 6:10. Low batteries: seat them near outlets.

**How long:** 20 min.

## 5:50 · Say hi

**Slides:** 2, Tonight. Then 3, Say hi.

**Say:** "Quick round: your name, what you design, and where you are in your AI journey."

**Do:** about 30 seconds each.

**Watch for:** the clock. 16 people at 30 seconds is 8 minutes.

**How long:** 10 min.

## 6:00 · Level set

**Slides:** 4, Where I'm coming from. 5, A shorter path to shipping. 6, How I work right now. 7, There's no right way.

**Say:** "A year ago I designed cloud products. Now I design in code on VS Code and ship it. Here's how I work right now, and there's no one right way to do this."

**Do:** listen. The map on slide 6 is also on the site's [Intro](module-01.html).

**How long:** 10 min.

## 6:10 · Redeem

**Slide:** 8, the code on screen.

**Say:** "Go to github.com/redeem and type the code on the screen. You'll add a payment method, and it renews on its own, so set a reminder on your phone to cancel tomorrow or next week. Already have Copilot? Use the plan you have."

**Do:** redeem, choose their personal account, check **Your new plan**, redeem.

**Watch for:** someone already paying for Pro or Pro+: don't redeem (GitHub can't refund). Wrong account picked.

**If it fails:** they use the plan they have and carry on. Come back to it after.

**How long:** 3 min.

## 6:13 · Sign in and check the plan

**Slide:** 9, the QR code to the setup page. From here, the site: [Setup](setup.html#sign-in).

**Say:** "Open VS Code Insiders, sign in with the same GitHub account, open the Agents window, and click your picture at the top right. It should say Copilot Max."

**Watch for:** Insiders not installed (download it now, about 2 minutes). The wrong GitHub account in VS Code.

**How long:** 3 min.

## 6:16 · Settings and restart

**Say:** "In the Agents window, Command Palette, Preferences: Open User Settings (JSON). Paste the 16 lines inside the braces, save, then quit and reopen."

**Do:** copy from [Setup step 3](setup.html#settings), paste, save, <kbd>Cmd</kbd>+<kbd>Q</kbd>, reopen.

**Watch for:** red squiggles from a missing comma or pasting outside the braces. Faded lines in the editor window are fine.

**How long:** 3 min.

## 6:19 · The composer

**Say:** "Left to right: Environment, Workspace, session options, the prompt box, Add Context, Mode and Permissions, the model, the mic, Send."

**Do:** follow along on [Setup step 5](setup.html#composer). Point at each one.

**How long:** 3 min.

## 6:22 · Permissions and the model

**Say:** "Mode: Interactive. Permissions: Allow all, click Enable. Sandboxing for terminal stays off. Model: GPT-6.2 Sol, effort High."

**Say, the risk line:** "Allow all with no sandbox means it runs commands as you, without asking. That's why we use a fresh folder and our own copy of Excalidraw."

**If it fails:** no GPT-6.2 Sol yet (gradual rollout): GPT-6.1 Sol at High, same price.

**How long:** 2 min.

## 6:24 · Models, explained

**Say:** "You're not locked in. Sign in to ChatGPT from your picture, or bring your own key, OpenRouter is built in. Effort is how hard it thinks. Context is how much it holds. One credit is one cent, you have 20,000 this month, and Sol is 200 credits per million tokens in, 1,000 out."

**Do:** open the model picker, the **>** next to GPT-6.2 Sol, and **Manage Models...** to see it.

**How long:** 3 min.

## 6:27 · The setup prompt and the canvas

**Do:** new chat, **Chat** as the workspace, Interactive, Allow all, GPT-6.2 Sol High. Paste:

```text label="The setup prompt" file=data/setup-prompt.txt
```

**Say:** "Pick AI-First Design (External). Read what it'll install and the sizes, then Confirm."

**Watch for:** the browser sign-in for the GitHub CLI, the two Mac permissions, PowerShell refusing `npm` on Windows (the setup offers the fix), a Mac asking for developer tools.

**If it fails:** after any restart, reopen the chat and say "continue my setup". Still stuck: paste the setup prompt again in a new chat.

**How long:** 5 min, installs keep going in the background.

## 6:32 · Computer Use and dictation

**Do:** paste the one for their computer:

```text label="On a Mac"
Write a short joke in a new note in Notes.
```

```text label="On Windows"
Write a short joke in a new note in Notepad.
```

Then click the mic, say a sentence, click again.

**Watch for:** Mac: **Set Up Computer Use**, **Allow in Settings** for Accessibility and Screen Recording, then **Check Again**. Computer Use off: `/computer on`.

**If it fails:** dictation errors: delete the `dictation.model` line to use the on-device model.

**How long:** 3 min.

## 6:35 · Open it on localhost

**Module:** [4](module-04.html).

**Say:** "Same chat. Watch it move into your Excalidraw copy and open in the browser next to the chat."

```text label="Prompt 1"
Now open my Excalidraw case study. Move this chat there, run it on localhost and show it to me in the integrated browser.
```

**While it loads:** "Open workshop/brief.md. It's fictional user testing on the toolbar, written as problems, not solutions."

**Watch for:** the chat moving out of Chats, `npm start` printing a 127.0.0.1 link, Excalidraw next to the chat.

**If it fails:** new session on `excalidraw-case-study` with Branch, same prompt. No browser: "Open the localhost link in the integrated browser."

**How long:** 5 min.

## 6:40 · Mark Up and the quick change

**Module:** [5](module-05.html).

**Say:** "Add to Chat, Add Area Screenshot to Chat, box the toolbar. Click the thumbnail, Mark Up. Circle what confused testers, an arrow, a note with your idea, crop. Done."

```text label="Prompt 2"
Here's my marked-up screenshot. Use it and the user testing notes in workshop/brief.md to fix what confused people about the toolbar. Make the change on a new branch, and keep it small so I can see it right away.
```

**Watch for:** the change showing in the browser within a minute or so.

**If it fails:** no Mark Up: send the screenshot and say the marks in words. Too big a change: "Undo that and make the smallest change that fixes the top problem in the brief."

**How long:** 12 min.

## 6:52 · Test it in the browser

**Module:** [6](module-06.html).

**Say:** "Now let it test its own work, in the browser, like a person would."

```text label="Prompt 3"
Draw a few shapes in the integrated browser to test it. If something's broken, find the cause, fix it, and show me a shape drawn after the fix. Then commit the toolbar change and the fix.
```

**Watch for:** it notices shapes don't stay after a drag, fixes the cause, draws one that stays, and commits.

**If it fails:** "Pick the rectangle tool, drag on the canvas, and check that a rectangle appears. If it doesn't, find out why and fix it."

**How long:** 8 min.

## 7:00 · Four directions at once

**Module:** [7](module-07.html).

**Say:** "The PM team talked to customers. Open workshop/pm-follow-up.md: four very different toolbars. Minimal and calm, playful and expressive, dense for power users, big and touch friendly. One session starts four."

```text label="Prompt 4"
The PM team came back with workshop/pm-follow-up.md. Use the autonomous-variations skill to build the four toolbars it asks for. Start four sessions under this one, one per direction. Each one starts from this branch, works on its own branch and adds only its own toolbar file. When all four are done, put them together in one lab I can switch between in the integrated browser, and give me the link.
```

**Watch for:** four sessions nested under the orchestrator.

**If it fails:** "Run the four as parallel subagents instead, one per direction."

**How long:** 3 min to start.

## 7:03 · While they build

**Module:** [8](module-08.html).

**Do:** open one of the four, type, Send menu, **Steer with Message**:

```text label="Prompt 5a, steer"
Give every button a tooltip with its name and keyboard shortcut.
```

Open another, Send menu, **Add to Queue**:

```text label="Prompt 5b, queue"
When you're done, tell me in three bullets what makes this toolbar different.
```

**Tour:** the Sessions list: four nested under the orchestrator, status on each, pin and archive.

### Q&A ideas while they build

- What would you run in parallel at work? An accessibility review, a contrast check, phone width, a copy pass.
- Sessions, subagents or Compare Models: when is each one right?
- How do you know what it costs? Your picture, credits used.
- Critique a direction as it lands. What makes a toolbar feel calm? Steer your own idea into one.
- How does this land with engineers? Small pull requests in the same repo.
- What would you never hand off? Talking to real people, and the final call.

**If it fails:** a stuck session: "What's left? Finish the smallest version that works." Slow overall: steer the orchestrator, "Keep each one to one file and one screenshot."

**How long:** 12 min.

## 7:15 · The lab

**Say:** "When the orchestrator gives you the link, open it, press [ and ] to switch, and pick your favorite."

**If it fails:** "Give me the lab link and open it in the integrated browser." Or add `?toolbar=<name>` to the localhost link.

**How long:** 5 min.

## 7:20 · Ship it

**Modules:** [9](module-09.html) and [10](module-10.html).

**Say:** "Name your favorite. One prompt: the default, a narrated demo video, a pull request, the page for everyone, GitHub Pages, merged."

```text label="Prompt 6, ship it"
My favorite is <name>. Make it the default toolbar. Then, in parallel where you can: use the autonomous-demos skill to record a short narrated demo video of drawing a few shapes with it, open a pull request in my repo with all four variations, fill in the page for everyone in review/ with the four variations, the video and the pull request, and turn on GitHub Pages. When the video and the page are in the pull request, merge it, wait for Pages to publish, and give me the links.
```

**Watch for:** the pull request in their own repo, never Excalidraw's.

**If it fails:** video fails: "Ship it without the video, then add the video in a second pull request." Sign-in: `gh auth login`. Pages: "Check the Pages workflow run, fix what failed and run it again."

**How long:** 10 min.

## 7:30 · Open everything

```text label="Prompt 7"
Open the pull request, the video, my live Excalidraw and the page for everyone.
```

**Say:** "Share your review link with the person next to you."

**If it fails:** a 404 right after the merge: Pages is still publishing. Wait a minute.

**How long:** 5 min.

## 7:35 · Applying what we learned to your personal work

**Say:** "Bring it to your own work. Every module page has an 'On your own work' prompt. No repo handy? Keep going on Excalidraw with Modules 11 to 14."

**Do:** start in a chat, move into their repo, Mark Up a screen, four directions.

**Watch for:** unreleased work going onto a public Pages site. Draft pull requests only.

**How long:** 25 min.

## 8:00 · Show and tell

**Do:** three or four volunteers show their page for everyone on the screen.

**Skip it** if we're running late.

**How long:** 20 min.

## 8:20 · Wrap up

**Slide:** 9, the site.

**Say:** "Set the reminder to cancel the free month. The site stays up with every prompt from tonight, and the uninstall guide is there too. Thank you."

**How long:** 10 min.
