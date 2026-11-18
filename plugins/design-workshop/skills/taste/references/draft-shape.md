# Draft shape and evidence rules

Keep the generated skill short. Use this structural example, replacing placeholders only with supported preferences:

```markdown
---
name: my-taste
description: Apply my approved design preferences when I ask for design feedback, a polish pass, or a review in my taste. Keep preferences scoped, state uncertainty, and follow my current request when it differs.
---

# My taste

Status: draft for review.

## Preferences

- [General rule and its context.] Supporting notes: [count]. Latest note: [YYYY-MM-DD or undated]. Confidence: [tentative or repeated].

## Conflicts and limits

- [A disagreement in the selected notes, or a context where a rule should not apply.]

Treat these as preferences, not universal laws. Do not use a style preference to ignore accessibility or the current task. Do not search for more samples or change these rules without asking.
```

The installed file must be named `SKILL.md` inside `my-taste/`, with matching frontmatter. Its description stays under 1024 characters. Do not leave placeholder counts in a completed draft. If there is no supported preference, report that instead of inventing one.

Count distinct notes supporting a rule, not sentences or repeated copies. A note that says the opposite is a contradiction, not support. A dated correction can supersede an earlier preference in that context; explain that change in `draft/review.md`. With only an undated note, write **undated**. Do not use a file's modification time as a claimed date of feedback.

Rules use general words. Exclude names, company or client details, links and long quotes. Do not copy raw excerpts into the generated skill. The review file can use local note ids to let the person check your reasoning, but never follows links or copies the notes elsewhere.

Before replacing a draft, copy the last version to a new `history/<timestamp>/my-taste/` directory. If that path exists, choose another suffix. Preserve all earlier history. This preservation is part of an approved draft update, not permission to delete or overwrite unrelated files.

Installation is a separate, live step. Ask before reading the destination or overwriting anything. If a personal `my-taste` already exists, preserve an approved dated backup outside the installed skill's discovered directory, and get an explicit okay before replacement. Never install a proposal automatically because a previous draft was approved.
