# Workshop workflow map

Computer Use needs **Interactive mode and Manual permissions**, not Autopilot. The first time it touches each app, click **Allow in the native permission panel**, not a chat card. Autopilot can cancel that request; do not keep retrying calls while the panel is unanswered. This is separate from screenshot markup and browser DOM automation.

The workshop supplies the app, brief and kit. Main workflows are inline in each skill; these reference links are optional depth and can ask for access to the plugin's own folder. This maps reusable capabilities, not a second run sheet, a replacement dataset or a promise about completion time. Keep every example product-agnostic and every independent task able to start from its provided input.

| Module | Generic path | What proves it worked |
| --- | --- | --- |
| 1. Setup and a fork | [workshop-setup](../skills/workshop-setup/SKILL.md), then [prototypes](../skills/prototypes/SKILL.md) | Reuse the person's fork/clone, make services local-only and start the dev server; no tests, lint or production builds during setup unless requested. Host controls come from Get ready. |
| 2. Work from a brief | [prototypes](../skills/prototypes/SKILL.md) | The supplied goals, scope and acceptance checks guide the change. Fictional practice evidence stays labeled. |
| 3. Fix it and prove it | [Red/green bug-fix flow](../skills/prototypes/references/fix-and-prove.md) | The actual browser reproduction, same regression test failing before and passing after, a focused diff and an explicitly requested commit on `workshop`, never directly on main. |
| 4. Make a deck file | [File-only deck workflow](../skills/prototypes/references/deck-files.md) | The requested number of supported cards, a checked tab-separated `.txt` at the requested project path, and verified imported count when the request already includes import. |
| 5. Redesign from markup | [Screenshot markup loop](markup-feedback.md) | The person's marks map to real components, with actual before/after captures, default-visible changes and a requested commit after checks pass. |
| 6. A feature and three directions | Plan/build through [prototypes](../skills/prototypes/SKILL.md), [parallel direction sessions](../skills/variations/references/parallel-sessions.md), and [pair-test](../skills/pair-test/SKILL.md) for supplied fictional notes | A reveal-safe read-aloud feature, three already-approved local sessions and one comparison page. A scheduled deployment check is read-only so it cannot collide with shipping. |
| 7. A narrated demo | [30-second capture guide](../skills/demo-walkthrough/references/thirty-second-demo.md) | A measured real video of the requested stable HTTPS deployment or frozen local build, using the outside-repo recorder and installed browser. The file contains narration, not app speech. |
| 8. Try your app | [Computer Use handoff](try-with-computer-use.md) | The approved host tools operate the actual owned app and selected input once. No substitute is mislabeled Computer Use. |
| 9. Review and publish | [Own-fork PR guide](../skills/prototypes/references/branch-and-pr.md), [publish-pages](../skills/publish-pages/SKILL.md) | The requested own-fork PR/merge and Pages site, app files only under the 1 MB limit, original credit plus the person's own dated note, and both links. Zero registered workflows stops for the manual fork opt-in. Nothing goes upstream. |
| 10. Keep taste current | [taste](../skills/taste/SKILL.md) and its template | First draft, preserved history and proposed updates from the chosen workspace only. Personal installation is separate. |
| 11. Make a habit | [Daily cards template](../automations/daily-cards.automation.md) | Ten new supported cards from workspace notes. Manual by default, with cost review and no automatic import. Return the trigger to Manual after the workshop. |
| 12. Develop a chosen direction | [variations](../skills/variations/SKILL.md) and [markup feedback](markup-feedback.md) | The named pick is integrated faithfully, then polished against new marks and real checks. |
| 13. Plan overnight work | [overnight-plan](../skills/overnight-plan/SKILL.md) | A bounded, approved research-to-variations plan with checkpoints, limits and a report. Fictional notes do not become customer evidence. |

The revised guided hour ships before recording and native app control; those can begin free work. A separately requested Cloud task is advanced work, not a hidden part of shipping.

Dictation, queueing, steering, Send Later, session creation, Computer Use and Cloud are host capabilities, not tools this plugin installs. Read [Get ready](https://eli-w-king.github.io/ai-first-design-workshop/get-ready/) and the current host documentation. The plugin never changes mode, permissions, a schedule or billing settings just to make a module proceed.
