---
name: workshop-setup
description: 'Set up a personal laptop for the AI-First Design Workshop, safely, in stable VS Code. Use when someone says "check my setup", "set me up for the workshop", or asks what the workshop installs and how to undo it. Checks first, shows a plan, then sets up one item at a time with the person''s okay, and writes a readiness note.'
argument-hint: 'check my setup'
---

# Workshop setup

Get a personal laptop ready for the AI-First Design Workshop, in stable VS Code, without surprises. The person owns
this laptop. Treat it that way.

## Rules

1. **Check before you change anything.** Look first, then show the plan.
2. **One item at a time, with an okay.** Say what you'll run, what it changes, and how to undo it, then wait for the
   person's go. Never chain several installs into one command.
3. **Never touch approvals or the sandbox in the unsafe direction.** Don't switch to Allow all or Autopilot, don't
   turn the terminal sandbox off, and don't add auto-approve rules.
4. **No background work.** No scheduled jobs, no automations, no sync, nothing that keeps running after setup.
5. **Never handle secrets.** The person signs in themselves, in the browser or in VS Code. Never ask for a password
   or a token, and never print one.
6. **Never use `sudo` or an administrator prompt.** If something needs one, explain it and let the person do it.
7. **Stay in plain words.** Say "a copy of the files" before "a worktree", and "the list of changes" before "a
   commit". Explain any term the first time.
8. **Keep moving.** If an item fails twice, mark it as needing help, say exactly what to show a host, and go on.

## The checklist

Check each item, then report a short list: ready, missing, or optional. Then fix the missing ones in this order.

| # | Item | How to check | How to fix |
| --- | --- | --- | --- |
| 1 | VS Code, stable, 1.146 or later | `code --version`, or **Help**, then **About** | Update from **Code**, then **Check for Updates** (macOS) or **Help**, then **Check for Updates** (Windows). |
| 2 | Signed in to GitHub with Copilot | The Copilot icon in the status bar shows a signed-in account | The person signs in from the Copilot icon. If they have a Copilot Max code from the workshop, they redeem it on github.com themselves. |
| 3 | The Agents window opens | **Open in Agents** in the title bar, or **Chat: Open Agents window** | Update VS Code (item 1). |
| 4 | Git, with a name and a private email | `git --version`, `git config --global user.name`, `git config --global user.email` | macOS: `xcode-select --install` opens Apple's installer. Windows: `winget install --id Git.Git -e`. For the email, suggest GitHub's private noreply address (GitHub, **Settings**, **Emails**) so it doesn't show on public pages. |
| 5 | The terminal sandbox | Read `chat.agent.sandbox.enabled` in user settings | Offer to set it to `"on"`. Say what it does: terminal commands the agent runs can only change files in the project folder, though they can still reach the internet. It needs macOS 15 or later, or Windows 11 with the September 2026 update. If it isn't supported, say so plainly. |
| 6 | Asking before commands | The permissions picker under the chat input shows the default (the agent asks) | Nothing to fix. If it's on Allow all, point it out and suggest the default for the workshop. |
| 7 | The built-in browser | Open `https://example.com` in VS Code's built-in browser and take a screenshot | Nothing to install. If browser tools are off, `workbench.browser.enableChatTools` turns them back on. |
| 8 | Optional: GitHub CLI | `gh --version`, `gh auth status` | macOS: `brew install gh` if Homebrew is there. Windows: `winget install --id GitHub.cli -e`. The person runs `gh auth login` and signs in in the browser. Without it, the publish step uses two clicks on github.com. |
| 9 | Optional: Node, for demo videos | `node --version` (22 or later) | Only if the person wants video files. macOS: `brew install node`. Windows: `winget install --id OpenJS.NodeJS.LTS -e`. |
| 10 | Optional: design tools | Only if they already use Figma or Notion | Point them to **Chat: Open Customizations**, then the Copilot connectors for Figma or Notion. Tell them Figma's free Starter plan allows only 20 reads a month through it, so screenshots or exports are the safer path. |

Before changing a settings file, copy it next to itself with a date in the name, and say where the copy is.

## Try it

After each item, have the person try it once, in their own words. For example: "Take a screenshot of example.com in
the built-in browser." An item is ready only after it works.

## The readiness note

When you're done, write `Workshop readiness.md` in the current folder:

- what's ready, what's optional, and anything that still needs a host
- every change you made, with how to undo it
- the date and time

## What this setup installs, and how to undo it

| What | Undo |
| --- | --- |
| The `design-workshop` plugin | **Chat: Open Customizations**, **Plugins**, **design-workshop**, **Uninstall** |
| The terminal sandbox setting | Remove `chat.agent.sandbox.enabled` from user settings, or restore the dated copy |
| Git | macOS: leave it (other apps use it). Windows: **Settings**, **Apps**, uninstall Git. |
| GitHub CLI, Node | `brew uninstall gh node`, or uninstall them from **Settings**, **Apps** on Windows |
| The git name and email | `git config --global --unset user.name` and `user.email` |
