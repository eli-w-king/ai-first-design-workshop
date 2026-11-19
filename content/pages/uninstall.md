---
title: Uninstall
key: uninstall
eyebrow: Take it all back out
video: uninstall
description: How to remove everything the workshop setup added, on a Mac or Windows, with one prompt or by hand.
---

Everything the setup added lives in one folder, `ai-first-workshop` in your home folder, plus a few small things it put elsewhere: the workshop skills, the setup checklist, one line that lets your computer find the tools, and (if you turned it on) a weekly automation. The setup kept a list of exactly what it added, so you can take it all back out.

Nothing you had before the workshop gets removed. If you already had Git, Node.js or the GitHub CLI, the setup used yours and left them alone, and these steps leave them alone too.

## Ask an agent to do it

In VS Code Insiders, start a new chat in the Agents window and paste:

```text label="The uninstall prompt"
Uninstall my AI-First Design Workshop setup. Follow https://github.com/eli-w-king/autonomous-output-skills/blob/main/autonomous-setup/references/ai-first-uninstall.md and show me the list before you remove anything.
```

The agent reads the setup's list, shows you everything it will remove, and waits for your okay. It doesn't touch your VS Code settings, delete your GitHub repo or cancel your subscription. Those are yours to do when it's finished: [steps 5, 7 and 8](#5-remove-the-workshop-settings) below.

## Or do it yourself

Eight steps, about 10 minutes.

**First, look at the list.** The setup wrote down what it added in `ai-first-workshop/.setup/installed.md`.

- **Mac:** in Finder, press <kbd>Shift</kbd>+<kbd>Command</kbd>+<kbd>G</kbd>, type `~/ai-first-workshop/.setup` and press <kbd>Return</kbd>. Open `installed.md`.
- **Windows:** in File Explorer, type `%USERPROFILE%\ai-first-workshop\.setup` in the address bar and press <kbd>Enter</kbd>. Open `installed.md`.

Keep it open. It says which tools the setup installed, which skills it replaced (and where it saved your old ones), and the name of your Excalidraw repo.

## 1. Delete the workshop folder

This removes your local copy of Excalidraw, the skills download, the workshop resources, and the tools the setup installed (Git, Node.js and the GitHub CLI when the setup added them, and the demo video tools).

- **Mac:** in Finder, go to your home folder (<kbd>Shift</kbd>+<kbd>Command</kbd>+<kbd>H</kbd>) and drag `ai-first-workshop` to the Trash. Empty the Trash.
- **Windows:** in File Explorer, go to `%USERPROFILE%`, right-click `ai-first-workshop` and choose **Delete**.

Anything you made and pushed to GitHub is still on GitHub. Anything you didn't push is gone, so push or copy out what you want to keep first.

## 2. Remove the workshop skills

The workshop skills are folders in your personal skills folder:

- **Mac:** `~/.copilot/skills`
- **Windows:** `%USERPROFILE%\.copilot\skills`

Delete the folders `installed.md` lists. Always these four: `autonomous-variations`, `autonomous-prototypes`, `autonomous-demos` and `autonomous-computer-use`, and any you chose: `autonomous-runs`, `autonomous-research`, `my-taste`.

If you had a skill with the same name before the workshop, the setup saved your copy first, in `~/.copilot/skills-backup/ai-first-workshop/` (Windows: `%USERPROFILE%\.copilot\skills-backup\ai-first-workshop\`). Move it back into the skills folder.

## 3. Remove the setup checklist

Delete these two folders:

- **Mac:** `~/.copilot/extensions/setup-checklist` and `~/.copilot/extension-data/autonomous-setup-checklist`
- **Windows:** `%USERPROFILE%\.copilot\extensions\setup-checklist` and `%USERPROFILE%\.copilot\extension-data\autonomous-setup-checklist`

## 4. Delete the weekly taste automation

Only if you turned it on. In the Agents window, open **Automations** in the side bar, select **Weekly taste update**, and delete it.

## 5. Remove the workshop settings

In VS Code Insiders, open the Command Palette (<kbd>Cmd</kbd>+<kbd>Shift</kbd>+<kbd>P</kbd> on a Mac, <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>P</kbd> on Windows), run **Preferences: Open User Settings (JSON)**, and delete the [16 lines](setup.html#settings) you pasted at the workshop. They start with `"sessions.chat.experimental.workspaceOptOut"` and `"chat.agentHost.computerUse.enabled"`, and end with `"chat.automations.enabled"` and `"chat.artifactTools.enabled"`.

Save the file and restart VS Code Insiders.

## 6. Remove the tools, if the setup installed them

Only if `installed.md` says the setup installed Git, Node.js or the GitHub CLI. The tools themselves went away with the folder in step 1. Two small things point at them.

**The line that lets your computer find them.**

- **Mac:** open the file `~/.zprofile` (in Finder, <kbd>Shift</kbd>+<kbd>Command</kbd>+<kbd>G</kbd>, type `~/.zprofile`; open it with TextEdit) and delete the lines from `# >>> ai-first-workshop >>>` to `# <<< ai-first-workshop <<<`, including those two. Save.
- **Windows:** press Start, type `environment`, and open **Edit environment variables for your account**. Select **Path**, click **Edit**, and delete each line with `ai-first-workshop` in it. Click **OK** twice.

**Git's sign-in through the GitHub CLI.** In a terminal, run:

```sh
git config --global --remove-section credential.https://github.com
git config --global --remove-section credential.https://gist.github.com
```

If Git itself is gone now, there's nothing to run: you can skip this.

**Optional: your GitHub sign-in for the GitHub CLI.**

- **Mac:** open Keychain Access, search for `gh:github.com`, and delete it. Then delete the folder `~/.config/gh` if the setup created it (`installed.md` says).
- **Windows:** open Credential Manager, choose **Windows Credentials**, and remove `gh:github.com`. Then delete `%APPDATA%\GitHub CLI` if the setup created it.

## 7. Optional: delete your Excalidraw repo on GitHub

Your copy is `https://github.com/<your-username>/excalidraw-case-study` (the exact name is in `installed.md`). It's yours: keep it as a portfolio piece, or delete it. To delete it, open the repo on GitHub, go to **Settings**, scroll to the bottom, and click **Delete this repository**.

## 8. Cancel the free month before it renews

The free month of GitHub Copilot renews on its own. To avoid a charge, cancel before the month is up: on GitHub, open your profile picture, then **Settings**, **Billing and licensing**, **Licensing**, and cancel the Copilot plan. [After the course](after.html#cancel-the-free-month) has the steps. If you already had Copilot before the workshop, keep the plan you had.

## What the setup never changed

- Apps and tools you had before the workshop.
- Your other skills, your other VS Code settings, and your other repos.
- Anything outside your home folder. The setup never asks for your computer's password.
