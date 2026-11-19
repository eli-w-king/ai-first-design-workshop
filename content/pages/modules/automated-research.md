---
title: Automated research
short: Automated research
description: Module {n}. Draft an unmoderated study for the design you picked. Hypothetical tonight: the study stays a draft.
---

## Why

```callout
A hypothetical for this cohort
Tonight, nobody has research tool accounts, so this module stops at the draft. Nothing is launched, recruited or paid for.
With accounts: the same prompts create the study in a tool like Outset and recruit through a panel like User Interviews, then stop at the approval.
```

Once you've picked a design, you can hear what people think of it without leaving the loop. The agent drafts an unmoderated study from your brief and the research skill's question rules: the goal, a short screener, the tasks and the questions.

```callout
Before you automate research
Good for: comparing alternatives, first impressions, messaging and terminology.
Be careful with: what people pay attention to, what they choose to do and what motivates them. Those need a researcher and real conversations.
It's a way to improve designs inside the loop, not a replacement for talking with customers.
```

You installed the autonomous-research skill in setup if you checked it. If not, paste the [setup prompt](setup.html#setup-prompt) again in a new chat and check it in the list.

## On Excalidraw

In your orchestrator, after shipping your favorite:

```text label="Prompt 13.1"
Use the autonomous-research skill to draft an unmoderated study of my favorite toolbar against Excalidraw's original. Six participants who draw diagrams at least weekly. Two tasks: draw a simple flowchart, then find and use a tool you haven't used yet. Write the screener, the tasks and the questions to workshop/practice/study-draft.md. Don't launch or recruit anything.
```

## You should see

A study draft in `workshop/practice/study-draft.md`: the goal, a short screener, two tasks with what success looks like, and a few open questions that don't lead.

## With research tools {collapsed}

With accounts and API keys, the light research skill can go further, and still stops before anything goes out:

1. It creates the study as a draft in your research tool, like Outset.
2. It sets up recruiting through a panel, like User Interviews: the screener, the number of people and the incentive.
3. It stops at the approval, with any message to your research team drafted and not sent.
4. Optionally, an automation checks the study every hour and starts the synthesis when results are in ([Module {n:synthesis}](module:synthesis)).

Keys stay in a file on your laptop, never in the chat.

## On your own work

```text label="Prompt 13.2"
Use the autonomous-research skill to draft an unmoderated study of <the design I picked>. Who: <the people to recruit>. What I want to learn: <one or two questions>. Write the screener, the tasks and the questions to a file in this repo. Don't launch or recruit anything.
```

Work with your researcher first, so the questions are worth asking.
