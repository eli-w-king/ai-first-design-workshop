# Three directions in parallel sessions

Use this route when the person asks for three directions in separate Agents-window sessions. Make three genuinely different ideas, not three near copies. Today's version remains a fourth, uncounted baseline.

## Prepare once in the current session

1. Name the one design question, stable input content, baseline and three different structural or interaction ideas. Use [the lab brief](lab-brief.md).
2. Show the three-session plan, model choices, usage implications and file ownership. Get approval for those sessions and their scope before starting them. Use the person's selected model or suggest a mid-priced option; never choose the most expensive configuration automatically.
3. Assign one folder or component set to each direction, such as `labs/question/v1/`, `v2/` and `v3/`. The current session owns the baseline, shared data, route wiring and comparison page. Do not create another coordinator session unnecessarily.
4. Prepare any shared contract or scaffold before workers start. Treat the shared inputs as read-only. If another feature task is running, give it independent files too; serialize changes that need the same router, package file or shared component.

## Start three real sessions

In the [Agents window](https://code.visualstudio.com/docs/agents/run/agents-window), choose **New Session**, **This Computer**, and the approved project folder. Use **Branch** with the same already selected branch, not **New Worktree**. Inspect the displayed permissions and keep Manual unless the person explicitly chooses otherwise. The approval guide warns that New Worktree sessions use Allow all; do not promise Manual approvals there.

Create **Direction 1**, **Direction 2** and **Direction 3**, each with its own complete brief and exclusive files. If approved session-creation tools are available, use their actual supported arguments; otherwise guide the person through New Session. Start all three without waiting for one to finish, then check that each is working or clearly report which is blocked.

Separate sessions in the same folder do **not** isolate files. Workers must not switch branches, commit, stage files, change dependencies, edit shared files, publish or stop each other's processes. The coordinator handles shared integration after review. If folder boundaries cannot make the tasks independent, ask about separate approved source copies or serialize the conflicting part. Never silently broaden permissions to obtain isolation.

A subagent inside one chat is not three independent Agents-window sessions. If that is the only supported route, explain the difference and get agreement rather than claiming the requested session setup was used.

## Give every session the full brief

Include the question, actual surrounding UI and content, that direction's distinct idea, its allowed files, the shared interface, responsive and reduced-motion requirements, the work budget and check commands. Repeat the local-only service safeguards and no-install, no-publish and no-delete limits. Name the expected output and when to stop. A worker should not need another worker's unfinished result.

Record each session's name or link, folder and state. Send a correction only to the intended active session. Use the visible session list or Open to the Side to monitor work; a side-by-side grid alone does not prove that three tasks are running.

## One comparison page

Collect the three real results into the coordinator-owned page using [the lab conventions](lab-conventions.md). Include Today's baseline, direct `?v=` links, a named switcher and side-by-side comparison at matching viewports and task states. Keep incomplete directions labeled as incomplete rather than filling the gap with a screenshot recreation.

Check every direction and the comparison page before presenting them. Preserve previous rounds. Ask which one to integrate, and port the selected implementation rather than building a different interpretation. Finish completed worker tasks and one-off checks, but do not stop the user-facing comparison/dev preview just because one worker finished. Keep a development preview you started running while the person is still working in the session or queued follow-ups need it. Give its URL, port, owning terminal/process and how to stop it (Ctrl+C in that terminal or the host's stop control). One completed request is not the end of the session. Stop the preview when the person is done or asks, and never kill a process you did not start. The coordinator records ownership; workers never stop one another's services.

An explicit okay to start the three local sessions is already approval. Do not ask again for the same count and scope; keep the chosen model, permissions and exclusive file ownership. A queued Pages-status request is read-only and must not edit files or write Git while the coordinator ships.
