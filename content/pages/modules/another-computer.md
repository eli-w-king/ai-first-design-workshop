---
title: Another computer
short: Another computer
description: Module {n}. The same Agents window, skills and sessions on another machine you connect with a tunnel, so you can close your laptop. A hypothetical tonight.
---

## Why

```callout
A hypothetical for this cohort
You don't need a second computer tonight. This is how it works when you have one: an old laptop, a desktop at home or a machine in the cloud.
```

Everything overnight works on your laptop, as long as it stays awake. To close your laptop and keep going, run the work on another computer that's always on. It's the same Agents window, skills and sessions, on a machine that doesn't sleep, and its sessions report back to your laptop.

## Connect another computer

On the other computer:

1. Install [VS Code Insiders](https://code.visualstudio.com/insiders/) and sign in with the same GitHub account.
2. Paste the same [workshop settings](setup.html#settings) and restart.
3. In the Agents window, click the radio tower at the top right (**Remote Connections**) and choose **Dev Tunnels**. Leave VS Code Insiders open: the tunnel runs while it's open.
4. Do the same setup as on your laptop, so it has the skills and your copy of the repo.

On your laptop:

1. In the Agents window, click the radio tower and choose **Dev Tunnels**.
2. Open the **Environment** picker in the composer and choose **Manage Remote Environments...**. The other computer shows up there.
3. Start a new session, click **This Computer** in the Environment picker and pick the other computer, then a folder on it.

Dev tunnels are how VS Code reaches a machine securely, signed in with your account. [VS Code's guide to tunnels](https://code.visualstudio.com/docs/remote/tunnels)

## On Excalidraw

With your Excalidraw copy on both computers, in a session on your laptop:

```text label="Prompt 16.1"
Start this work on my other computer, and have it report back here.
```

Or to run Module {n:overnight}'s plan there:

```text label="Prompt 16.2"
Start the overnight plan on my other computer, and have its sessions report back here.
```

## You should see

The other computer in the composer's list of environments, and sessions on it that report back to your laptop. Group the Sessions list by **Environment** to see where each one runs. Then you can close your laptop, and the other computer keeps going.

## Good to know

- The other computer needs to stay on, awake and online. Plugged in, with sleep turned off.
- It uses the same Copilot plan and credits as your laptop.
- It can't see your laptop's files, only its own. Keep your repo on GitHub, so both can get it.

## On your own work

The prompts above work with any repo that's on both computers. VS Code on another machine also works in the browser, in Chrome, through the same tunnel.
