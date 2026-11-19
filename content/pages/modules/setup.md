---
title: Setup
short: Setup
out: setup.html
description: Module {n}. Set up VS Code Insiders for the workshop in about 25 minutes, together in the room. Redeem, sign in, paste the settings and the setup prompt, then try Computer Use and dictation.
---

## Why

We do this together, in the room, in about 25 minutes. Follow along one step at a time. If something gets stuck, raise your hand: it's almost always a quick fix.

## 1. Redeem your free month {#redeem}

Go to **[github.com/redeem](https://github.com/redeem)** and type the code that's on the screen. It's only on the screen in the room, never on this site.

- **You need a GitHub account.** No account yet? Make one at [github.com/signup](https://github.com/signup) first.
- **You add a valid payment method when you redeem.**
- **It renews on its own.** Set a reminder on your phone to cancel tomorrow or next week, so you don't get charged next month. [After the course](after.html#cancel-the-free-month) shows how to cancel.
- **Already have Copilot?** Use the plan you have, and skip this step.

On the page: type the code, click **Redeem**, sign in, click **Choose** next to your personal account, check the plan under **Your new plan**, then click **Redeem**.

<!-- collapsed: Avoid charges for extra usage -->

The free month comes with 20,000 AI credits. If you want a hard stop when they run out, set a budget of $0 for extra usage: on GitHub, open [Billing](https://github.com/settings/billing), create or edit the **Bundled AI credits** budget, set it to $0 and turn on **Stop usage when budget limit is reached**. ([GitHub's docs](https://docs.github.com/en/copilot/reference/copilot-billing/models-and-pricing))

## 2. Open VS Code Insiders and sign in {#sign-in}

1. Open **VS Code Insiders**. Don't have it? [Download it](https://code.visualstudio.com/insiders/). Already have it? Update it: **Code - Insiders > Check for Updates...** on a Mac, **Help > Check for Updates...** on Windows, until it says there are none.
2. Sign in with the GitHub account you just redeemed with: **Sign In** at the top right.
3. Open the **Agents window**: click **Agents** in the title bar (it says **Open in Agents** when you point at it). Or open the Command Palette (<kbd>Cmd</kbd>+<kbd>Shift</kbd>+<kbd>P</kbd> on a Mac, <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>P</kbd> on Windows) and run **Open Agents Window**.
4. **Check your plan:** click your picture at the top right of the Agents window. Under **Copilot account**, it should say **Copilot Max** (or the plan you already had), with your credits used and when they reset.

The plan has to be on the account VS Code is signed in with. If it shows the wrong plan, sign out and sign in with the account you redeemed on.

## 3. Paste the workshop settings {#settings}

1. In the **Agents window**, open the Command Palette and run **Preferences: Open User Settings (JSON)**.
2. Paste these 16 lines inside the outer braces `{ }`. If there are settings there already, put a comma after the last one first.
3. Save the file.

```jsonc file=data/workshop-settings.jsonc label="The 16 workshop settings"
```

Open the file from the Agents window. Eight of these settings only exist there, so in the regular editor window they look faded, with "Unknown Configuration Setting". That's expected, and they still work. You can also [download the settings](downloads/workshop-settings.jsonc).

<!-- collapsed: What each setting does -->

| Setting | What it does |
|---|---|
| `sessions.chat.experimental.workspaceOptOut` | Adds **Chat without a workspace**, so you can start a chat before you pick a folder. |
| `chat.agentHost.computerUse.enabled` | Lets the agent use desktop apps, like Notes, after you approve each app. Needs a restart. |
| `chat.remoteSessions.tools.enabled` | Lets agents find your other connected computers, start sessions there and message other sessions. |
| `chat.agent.sandbox.enabled` | `"off"`: agent terminal commands run without the sandbox (see step 6). |
| `chat.canvases.enabled` | Lets sessions open panels next to the chat, like the setup checklist. |
| `dictation.model` | `"mai"`: the microphone uses Microsoft's cloud speech service instead of a downloaded model. |
| `workbench.experimental.modernUI` | Gives the editor window the Agents window's rounded look. |
| `sessions.chat.experimental.newSessionComposerOptionsExpanded` | Starts with the session options open above the prompt. |
| `sessions.chat.experimental.environmentPicker` | Shows the **Environment** picker: this computer, the cloud, or another machine. |
| `sessions.chat.experimental.environmentPickerManageRemotes` | Adds **Manage Remote Environments...** to that picker. |
| `chat.agentHost.moveChats.enabled` | Lets a chat move into another session, history and all. |
| `sessions.chat.compareAgents.enabled` | Adds **Compare Models**: the same prompt on 2 to 10 models side by side. Each one costs credits. |
| `sessions.list.agentTools.enabled` | Lets agents group, pin, archive and sort your Sessions list. |
| `chat.customizations.marketplace.enabled` | Adds a **Browse** page for plugins, skills and MCP servers. |
| `chat.automations.enabled` | Turns on **Automations**: sessions that run on a schedule. |
| `chat.artifactTools.enabled` | Lets agents pin what they made (pull requests, files, links) above the chat input. |

## 4. Restart {#restart}

Quit VS Code Insiders completely (<kbd>Cmd</kbd>+<kbd>Q</kbd> on a Mac; on Windows, close every window) and open it again. Computer Use only turns on after a full restart.

## 5. The composer {#composer}

This is where every session starts: the box at the center of the Agents window and the controls around it. From left to right:

**Above the prompt**

- **Environment:** where the session runs. **This Computer** is your laptop. It can also run in the **Cloud** on GitHub, or on another computer you connect. **Manage Remote Environments...** is at the bottom of the list.
- **Workspace:** the folder or repo the session works in. **Chat** means no folder yet. Point at the picker to see **Chat without a workspace**.
- **Session options** (for a Git repo):
  - **Branch** works in the copy already on your laptop. **New Worktree** makes a separate copy for the session, so sessions running at the same time don't step on each other.
  - The **branch** the session starts from.
  - The **harness**: **Copilot** (the default), or **Claude** or **Codex**.
- **Hide Session Options** tucks that row away.

**The prompt box**

- **Pitch your idea:** type what you want, in your own words.

**Inside the box**

- **Add Context (+):** attach files, folders and images.
- **Mode and Permissions:** one split button. The left half is the **mode**: **Interactive** (step by step with you), **Plan** (writes a plan first) or **Autopilot** (keeps going on its own). The right half is **permissions**: **Manual** asks you, **Assisted** checks the risk first, **Allow all** runs without asking. Under them is the **Sandboxing for terminal** switch.
- **Model:** which model answers, with its effort and context size. The **>** next to a model opens **Effort Level** and **Context Size**. **Compare Models** and **Manage Models...** are here too.
- **Dictate:** the microphone. Click to start and stop, or hold it while you talk.
- **Send:** <kbd>Enter</kbd> sends. <kbd>Option</kbd>+<kbd>Enter</kbd> (<kbd>Alt</kbd>+<kbd>Enter</kbd> on Windows) sends in the background.

Once a session is running, the Send button's menu adds **Add to Queue**, **Steer with Message**, **Stop and Send** and **Ask in Side Chat**. You'll use the first two in [Module {n:variation-labs}](module:variation-labs).

## 6. Interactive, Allow all, no sandbox {#permissions}

1. Click the left half of **Mode and Permissions** and choose **Interactive**.
2. Click the right half and choose **Allow all**. The first time, it asks: click **Enable**.
3. In the same menu, check that **Sandboxing for terminal** is off. The settings turned it off already.

```callout
What this means on your laptop
Allow all: the agent runs its tools without asking you first.
Sandbox off: its terminal commands can reach your files and the internet the same way you can.
Together: it's fast, and it's why we use a fresh workshop folder and our own copy of Excalidraw. Use the same care on your own laptop that you would with any app you let run commands.
Still asks: Computer Use asks before it uses each app, and nothing in this workshop sends a message or buys anything.
```

## 7. Pick the model {#model}

Open the model picker and choose **GPT-6.2 Sol**. Click the **>** next to it and set **Effort Level** to **High**.

Don't see GPT-6.2 Sol yet? It's rolling out gradually, so pick **GPT-6.1 Sol** at High instead. It costs the same.

## 8. Models, explained {#models}

**What's on offer.** Copilot Max has models from OpenAI, Anthropic, Google, xAI and others, side by side in one picker. Pick per session, or run the same prompt on several with **Compare Models**. [GitHub's list of supported models](https://docs.github.com/en/copilot/reference/ai-models/supported-models)

**Other subscriptions.** You don't have to use Copilot for everything:

- **ChatGPT:** in the Agents window, click your picture and choose **Sign in to ChatGPT**. Even a free ChatGPT account works. Its models show up in the picker under ChatGPT. ([VS Code docs](https://code.visualstudio.com/docs/agents/run/agent-harnesses))
- **Claude:** the **Claude** harness runs on your Copilot plan or a Claude API key. Anthropic's own Claude Code extension signs in with a Claude plan.

**Bring your own key.** Open the model picker, choose **Manage Models...**, then **Add Models**, pick a provider, give it a name and paste your API key. **OpenRouter** is built in, along with OpenAI, Anthropic, Google, xAI and a custom endpoint. The provider bills you for those calls, and models need tool calling to work as agents. ([VS Code docs](https://code.visualstudio.com/docs/agent-customization/language-models))

**Effort.** How hard the model thinks before it answers, from **Low** up to **Max**. Higher effort is better on hard problems, slower and uses more credits. Each model remembers the last effort you picked.

**Context size.** How much the model can hold in one session. Each model offers its default and a larger size for longer sessions. For GPT-6.2 Sol, the larger size goes up to 1M tokens, and everything past 272K is billed at a higher rate.

**Prices.** Everything costs **AI credits**, and 1 credit is 1 cent. Copilot Max comes with 20,000 credits a month. Prices are per million tokens: what you send (input) and what comes back (output).

| Model | Input | Output | Past 272K tokens |
|---|---|---|---|
| GPT-6.2 Sol | 200 credits | 1,000 credits | input 400, output 1,500 |
| GPT-6.1 Sol | 200 credits | 1,000 credits | input 400, output 1,500 |
| GPT-6.1 Terra | 100 credits | 500 credits | input 200, output 750 |

Text the model has already seen in the session (cached input) costs much less. We planned tonight's hands-on hour to use well under a fifth of your month. To see what you've used, click your picture in the Agents window. ([GitHub's prices](https://docs.github.com/en/copilot/reference/copilot-billing/models-and-pricing), [how credits work](https://docs.github.com/en/copilot/concepts/billing-and-usage/individuals/billing))

## 9. Paste the setup prompt {#setup-prompt}

Start a new session with **Chat** as the workspace, **Interactive**, **Allow all** and **GPT-6.2 Sol** at **High**. Paste this and press <kbd>Enter</kbd>:

```text file=data/setup-prompt.txt label="The setup prompt"
```

It makes a folder called `ai-first-workshop` in your home folder, downloads the workshop skills into it, and opens the setup checklist in the same chat. It doesn't install anything else until you say so.

## 10. Walk through the checklist {#canvas}

The checklist opens as a panel next to the chat:

1. **The welcome.**
2. **Pick your workshop:** choose **AI-First Design (External)**.
3. **Let's get your computer ready for the workshop.**
4. **What we'll install,** with the size of each. The essentials are locked on: Git, Node.js and the GitHub CLI (only if you're missing them), the four workshop skills, your Excalidraw case study, the workshop resources, the demo video tools, Computer Use and dictation. The optional skills and a weekly taste automation are up to you; the automation stays off unless you turn it on. The total is at the bottom.
5. **How to uninstall,** with a link to [the uninstall guide](uninstall.html).
6. **What happens after you click Confirm:** it installs what you checked, opens a browser so you can sign in to GitHub, asks for two permissions on a Mac, makes your copy of Excalidraw on GitHub, and tells you when it's done.
7. **Confirm.**

Then the checklist shows each item as it installs, with a **Try it** for each.

## 11. Try Computer Use and dictation {#try-it}

**Computer Use.** Paste the one for your computer:

```text label="On a Mac"
Use Computer Use to write a short joke in a new note in Notes.
```

```text label="On Windows"
Use Computer Use to write a short joke in a new note in Notepad.
```

- **On a Mac,** the first time, a card asks for permission. Click **Set Up Computer Use**, then **Allow in Settings** for **Accessibility** and for **Screen Recording**. In System Settings, switch on **Copilot Computer Use** for each, then click **Check Again** until both say **Granted**.
- **On Windows,** there's no permissions dialog. The first time the agent wants an app, it asks: choose **Allow** or **Always allow**.
- If the agent says Computer Use is off, type `/computer on` and send it.

**Dictation.** Click the microphone in the chat box, say "Dictation works", then send it.

With these settings, dictation sends your voice to Microsoft's cloud speech service, signed in with your GitHub account. If it can't connect, delete the `dictation.model` line from your settings: VS Code then downloads a model and runs dictation on your laptop instead.

## You're set up

Next, we open Excalidraw: [Open it on localhost](module:open-on-localhost).

<!-- collapsed: If you get stuck -->

- **VS Code asks to restart.** Click **Restart**. If the setup was running, open its chat from the Sessions list and say **continue my setup**.
- **The checklist doesn't open.** The setup keeps going in the chat with the same list.
- **The setup stops and waits for you.** A few things only you can do: sign in, allow a permission or restart. Do it, then say **continue my setup**.
- **A Mac asks to install command line developer tools.** Click **Install**, wait for it to finish, then say **continue my setup**.
- **Windows won't run `npm`** because scripts are disabled: the setup offers to fix it, or run `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` in PowerShell once.
- **You want to check everything again, or add something you skipped.** Paste the setup prompt again in a new chat. It picks up where it left off.
