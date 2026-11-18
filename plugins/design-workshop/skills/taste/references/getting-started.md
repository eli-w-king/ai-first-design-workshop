# A folder for your taste notes

Choose a normal local workspace, for example `Taste/`, not a worktree. No repository or command-line tools are needed. Read and write only inside this workspace until a separate live approval allows a personal-skill copy.

```text
Taste/
  notes/
    2026-11-19-review.md
  examples/
    optional-screenshot.png
  draft/
    my-taste/
      SKILL.md
    review.md
  history/
    a-new-timestamp-for-each-previous-version/
      my-taste/
        SKILL.md
```

The names are examples, not files that already exist. Create folders with the host's normal file tools after the person agrees on the workspace. Do not create a scheduler, install a package or change settings.

## A useful note

Write a short note in your own words:

- Date the feedback was given:
- What you were reviewing, described without private names:
- What you wanted changed or kept:
- Why it mattered:
- Whether this is a personal preference or a requirement:
- Optional example file in this workspace:

Use your own feedback, not someone else's message collection. Remove names, employers, client details and links you do not want processed. A screenshot may contain private information too. The model sees the material you put here when the task runs; nothing is published, but this is not local-only inference.

## The first run

In **Automations > Templates from Plugins**, choose **Keep my taste current**. Installing this plugin only makes that template available. It does not create an automation.

Choose **Local**, keep **Run in the Cloud** off, and select this workspace, the model and a reasonable per-run usage cap. A mid-priced model such as GPT-6.2 Sol is a starting suggestion if available. Keep the trigger **Manual** for the first run and choose **Run now**. Use Manual permissions, not Autopilot or Allow all. Stay available for approval prompts.

Review `draft/my-taste/SKILL.md` and `draft/review.md`. Correct the source notes or request a revision if a preference is wrong or too broad. Do not accept every inferred rule just because it has a count.

## Later runs

Keep adding selected notes to `notes/`. Each run preserves the previous draft under `history/` before proposing a new version. It reads no other folders and never copies a change into your personal skill directory on a schedule.

Only after the first supervised run, if you want repetition, review and enable a weekly trigger. The template suggests Monday at 9 AM local time; choose a different time if needed. Scheduled local runs need the laptop awake and the agent running. A run waiting for approval holds back the next one. Disable the automation when you no longer want it.

Voice can use this pattern later, but there is no voice setup or voice template in this workshop plugin.
