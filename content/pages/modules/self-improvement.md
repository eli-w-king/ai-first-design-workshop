---
title: Self-improvement and automations
short: Self-improvement
description: Module {n}. Keep my-taste current every week with an automation, so your skills keep up with you.
---

## Why

Your taste keeps changing, so your skills have to keep up. An **automation** is a session that runs on a schedule. Set one up to read your week's sessions and update my-taste, and you never have to remember to do it.

If you turned on the weekly taste automation in the setup checklist, you already have one. Open **Automations** in the Agents window's side bar to see it.

## On Excalidraw

In your taste chat from [Module {n:taste}](module:taste):

```text label="Prompt 12.1"
/automate Create a weekly automation that keeps my-taste current. Every Monday morning, it reads the past week's sessions here, where I corrected an agent or asked for something different, adds anything new to my-taste, and shows me what changed. Set it to Autopilot with Allow all, so it never waits for me.
```

It shows you the automation as a draft first. Check it, then reply **Create it**.

## You should see

A weekly automation in **Automations**, on Autopilot with Allow all. Click it to check its schedule, model, mode and permissions. While your laptop is on, it runs in the background.

## Good to know

- An automation made from a chat might not have a model set. Open it and pick one, like **GPT-6.2 Sol**.
- Each run costs credits, like any session. Weekly is plenty.
- To stop it, open **Automations**, select it and delete it.

## On your own work

Any task you repeat can be an automation:

```text label="Prompt 12.2"
/automate Every Friday at 4 PM, look at what changed in <my repo> this week, check the main screens at phone width in the integrated browser, and write me a short list of anything that looks off. Don't change any files.
```
