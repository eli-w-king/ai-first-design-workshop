# A 30-second demo while other work continues

Use for "record a 30-second demo with a voiceover". Deliver an actual narrated video of the working feature, not screenshots, a slideshow or a silent substitute.

## Freeze the real target first

Record the source revision or clearly labeled dirty state. With approval for the local files, make a capture snapshot of the **real built app** and its approved sample content, or use an equivalent isolated target that will not reload another session's edits. This is a copy of the running product, never a visual recreation.

Serve that frozen build from a task-owned local server and port, with no watcher or hot reload. Keep upstream services inert. A new browser tab, a branch name or a promise to avoid edits is not a frozen build. Do not record from the shared development server while another session is changing or rebuilding its files.

Keep the capture browser/context and data separate from other tasks, including app-control work. Only the planned demo actions may change its visible state. If the source, build or sample state changes unexpectedly during a take, stop and retake from a stable snapshot. If the target cannot be frozen safely, report the blocker instead of starting parallel capture.

## Plan about thirty seconds, then measure

Agree on one visible outcome, the exact flow and a short script. About 45 to 60 spoken words can be a starting point, not a timing guarantee. Generate or obtain the approved audio first and measure it with existing tools.

A useful beat plan is a brief clean start, the main action, its visible result, then time to read the outcome. Fit the narration to those beats. The [recording helper](../scripts/record-walkthrough.mjs) accepts bounded reading holds in its plan; it does not promise a fixed 30-second export automatically. Stay within its step and duration limits. Adjust planned holds and re-record after measuring the real file. If a strict 30-second limit is required, verify that limit on the final export. With approval, trim only surplus final idle after all actions and narration are complete, preserving the original take. Never trim away a required state or splice takes to fit.

Use [the recording guide](recording.md) and [the narration guide](narration.md). Do not cut off words, splice different runs together or fake an action to meet the duration. Ask before adding tools or recording a microphone.

## Let an independent task proceed

After the capture preflight passes, start the bounded recorder or encode through the host's supported background-task facility. Verify the process is running and the owned page responds. Record the process id and output path, then continue only work on independent files and processes. Do not stop or reuse the recorder's server, browser, port or output folder.

The other work can be reviewing supplied notes or editing a separate component while the capture snapshot stays unchanged. Do not launch extra paid agents or a schedule just to claim parallel work. If the host cannot continue another task while recording, state that limitation.

## Check the audio claim

The browser helper records the real viewport but **not application or system audio**. The narration helper adds a separate approved voiceover. That does not prove an audio feature itself played sound.

If the requested demo must include the app's audible output, use a separately approved and verified capture/mixing route that records the real app audio. Never substitute narration for that feature's sound. If that route is unavailable, state the limitation or mark the audible-feature demo blocked. The supplied narration helper deliberately refuses to overwrite an existing audio track; use a reviewed mixing plan instead.

## Return to the actual result

Inspect the saved file, duration, dimensions and both audio/video streams. Play the whole take with sound, checking that the right sentence lands on the right action and the result is readable. State any playback or listening check you could not perform. Keep earlier takes until deletion is approved. Stop every owned recorder, encoder, server and browser, and provide the actual file with its frozen source and any limitations.
