---
title: Synthesis
short: Synthesis
description: Module {n}. Turn study results and feedback into findings with real quotes, the next iteration and a draft pull request.
---

## Why

When the results are in, the agent reads every response, pulls out themes with real quotes, says what to change, builds the next iteration and opens a draft pull request. It follows three rules:

- Real quotes only, never made up.
- Say where each number came from, and out of how many.
- "No data found" when there's none. Never invent numbers.

Tonight, use the practice results in your copy. They're **fictional practice material for this workshop**, written to practice on, not real interviews.

## On Excalidraw

Your copy has three practice files in `workshop/practice/`:

- `study-results.md`: an unmoderated study of a toolbar direction, six participants
- `design-review-transcript.md`: a short design review meeting
- `feedback.md`: a feedback document

In your orchestrator, or a new chat on your copy:

```text label="Prompt 14.1"
Synthesize the practice research in workshop/practice/: the study results, the design review transcript and the feedback document. Give me the top findings, each with real quotes and how many of the six participants it came from. Then build the next iteration of my favorite toolbar on a new branch, open a draft pull request in my repo, and add a short findings page to review/. Don't merge it.
```

## You should see

- Findings with quotes from the files and counts out of six, plus "no data found" where the files don't say.
- The next iteration on its own branch, with a draft pull request in your repo.
- A short findings page next to your page for everyone.

## On your own work

Attach or point to your own results, and say what you want to decide:

```text label="Prompt 14.2"
Synthesize <my study results and feedback, attached or in this folder>. I'm deciding <the decision>. Give me the top findings with real quotes and counts, say "no data found" where there isn't any, then build the next iteration on a new branch and open a draft pull request. Keep it private: don't publish anything.
```

Real interviews stay private. Never put them on a public site.
