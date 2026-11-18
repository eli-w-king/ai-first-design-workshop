# Demo brief and review

## Fill in before capture

- Audience and the one outcome they should understand:
- Real page or application, owned by:
- Output requested: video, screenshots, or paired before/after:
- Local URL or file and source revision:
- Sample content, and anything simulated:
- Clean starting state and reset steps:
- Exact actions and expected visible result:
- Viewport, theme, duration, narration script and chosen voice source:
- Recorder available, or proposed install awaiting approval:
- Output folder, privacy check and usage cap:

Keep one idea in each beat: two seconds to see the starting state, an intentional action, the visible result, then time to read it. Let the final outcome sit for a few seconds. Do not record setup dialogs instead of the task.

## Before recording

- The real prototype runs and the full task works from the agreed starting state.
- No account is signed in, no personal data is visible, and notifications and unrelated windows are outside the capture.
- The main text is legible at the output size. There are no more than two areas competing for attention.
- The pointer is visible and clicks are clear. A pointer overlay is disclosed; it must never cover an error or simulate application UI.
- The script waits for actual UI states. Short deliberate holds are for reading, not substitutes for readiness checks.
- The capture is one continuous take. Do not splice a success from a different run into it.

## After export

Play the entire file with sound. Listen for correct wording, intelligibility, aligned actions and a complete ending. Check the first and last frames, every click, hover and transition, and the final outcome. A frozen or black file with a valid extension is not a demo. If something fails, fix the actual flow and record a new take; preserve earlier takes until deletion is approved.

With existing `ffprobe`, inspect duration, dimensions and codec. With existing `ffmpeg`, decode the whole file to its null output and check the exit code. Neither command replaces watching. Do not install a media tool without approval.

Record the local filenames, verified revision, tools used, actual checks, real versus simulated behavior, and whether a human or agent watched the entire export. If playback is unavailable, state that review remains open. Uploading the video, adding it to a PR and sending its link are separate approvals.
