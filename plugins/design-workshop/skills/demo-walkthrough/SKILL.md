---
name: demo-walkthrough
description: "Record a short narrated walkthrough of the person's working prototype, or make screenshots and before/after pairs when those are requested. Use for \"record a demo\", \"make a short video\", \"walk through my prototype\", or \"capture before and after\". Rehearse with built-in browser tools first. A video requires a real recording pipeline; ask before adding tools and never substitute stills without agreement."
---

# Demo walkthrough

Write short, plain sentences. Do not use em or en dashes.

The complete default workflow is here. Do not open linked plugin files to start, complete or verify it. Use optional detail only when the person explicitly asks for it. Normal approvals for their files, tools and consequential actions still apply.

## Agree on a real result

Confirm the owned page, audience, one task, output folder, duration and video/screenshots/before-after choice. For a 30-second voiceover request, agree on the words and an installed system voice or the person's chosen recording. Do not substitute stills, a slideshow or silent video without agreement.

Ask before installs, sending, uploading, spending or deleting. Never attach to another person's browser or reuse cookies. Keep upstream services inert and block their destinations before navigation. Use real UI and approved sample data, label simulations, fix errors and retake. Never paint over faults, fake terminal output or splice different runs as one take.

## Freeze and rehearse

Use built-in browser tools first to test the actual clicks and expected end state. For pairs, capture the same viewport, theme, content and state before/after. A missing baseline stays missing.

For background capture, use an approved frozen snapshot of the **real built app**, a task-owned server/port with no watcher or hot reload, and separate browser/data/output. A new tab or branch name alone does not freeze files. Other work must use independent inputs and processes. If the target cannot be frozen, stop; if it changes unexpectedly, discard no files automatically but mark the take failed and retake.

Plan a clean lead-in, deliberate pointer/clicks, one idea per beat, visible outcome and reading holds. Use no random zoom and at most two focal areas. Write only the selected flow's script in the workspace, not a script that reads helpers from this plugin.

## Record without plugin-file reads

Prefer a verified existing recorder in the selected workspace or the host's actual recording tool. Built-in screenshots do not prove video export. If no recorder is available, a small workspace-local Playwright script can use Node and a compatible browser/encoder already installed, or separately approved downloads.

Explain downloads and undo before each install. One reviewed package example is `npm install --prefix .workshop-recording --cache .workshop-recording/npm-cache --save-exact --ignore-scripts playwright@1.65.1` (`npm.cmd` on Windows). This changes the named workspace folder, not app dependencies. Do not silently use `latest`. With separate browser/encoder approval, set `PLAYWRIGHT_BROWSERS_PATH` to that folder's `browsers` subfolder and run `node .workshop-recording/node_modules/playwright/cli.js install chromium`. Missing tools remain blocked if not approved.

Create the flow script in that local recorder folder so it can load its own package. Essential Playwright sequence:

```js
const { chromium } = require('playwright');
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1280, height: 800 },
  recordVideo: { dir: 'NEW_WORKSPACE_TAKE_FOLDER', size: { width: 1280, height: 800 } },
  serviceWorkers: 'block', acceptDownloads: false
});
// Add the approved local-origin request guard before navigation.
// Open a page, add only a pointer/click overlay driven by real input,
// perform the rehearsed controls, and assert the visible end state.
// Keep the page.video() handle. In finally, await context.close()
// and browser.close(); only then retrieve the finalized video path.
```

This is the API outline to adapt, not a ready-made flow or permission to launch. Use an async function, unique output paths, a finite timeout and `finally` cleanup. Reject unexpected dialogs, downloads, popups, page/console errors and outside or mutating service requests. Wait for actual controls, not arbitrary readiness sleeps; use short holds only for reading. Never manipulate app internals to force success. If no safe automatic route exists, report **video blocked**, not a fabricated completion.

## Add voiceover and measure

Approve the script and voice. On macOS, `say -f narration.txt -o narration.aiff` writes local speech; choose only an installed voice. In Windows PowerShell, use `System.Speech.Synthesis.SpeechSynthesizer`, `SetOutputToWaveFile`, `Speak` and `Dispose` to write WAV with an installed voice. Do not install voices, change policy or activate a microphone automatically. A provided audio file needs the person's permission and stays unchanged.

Measure the audio and video with existing media tools. If full ffmpeg/ffprobe is missing, ask before an install such as `brew install ffmpeg` or `winget install --id Gyan.FFmpeg --exact`; never install a package manager for it silently. Do not assume the capture encoder can mix audio. For an approved silent input and narration that fits, a workspace command can map the video's stream and narration, add an agreed audio delay and trailing silence, encode H.264/AAC, and stop at video length. Use `-n` to refuse overwrites and do not cut off narration. Existing video audio needs a separately reviewed mixing plan, not silent replacement.

Aim for the requested 30 seconds, then measure the export. Adjust holds and retake; with approval trim only surplus final idle after all actions and narration are complete, preserving the original. A viewport recording with voiceover does **not** capture app/system audio. If an audible feature's sound is required, use a separately approved verified real-audio route or state that part is blocked.

## Review, deliver and undo

Run bounded capture/encoding in the background only through supported host tools, verify readiness and keep its process id. Continue independent work, not edits to the recording target. Return to inspect the actual file, duration, dimensions and complete decoding. Watch and listen to the entire take for timing, pointer visibility, legibility, errors and a complete ending; mark any unavailable review honestly.

Give the real file, frozen source/state, checks and limits. Finish recorders/encoders and close the capture context to finalize the file. Clean up disposable capture-only helpers when no longer needed, but do not stop the person's ongoing development preview. Keep a development preview you started running while the person is still working in the session or queued follow-ups need it. Give its URL, port, owning terminal/process and how to stop it (Ctrl+C in that terminal or the host's stop control). One completed request is not the end of the session. Stop the preview when the person is done or asks, and never kill a process you did not start. Upload nothing. Ask before deleting takes or the newly created `.workshop-recording` folder; do not remove pre-existing tools. Restore changed terminal variables and offer only the matching uninstall for tools newly added, without broad dependency cleanup.

## Optional detail

None of these files is required above. Open one only for an explicit request for extra detail. Opening it may ask to read a file outside your workspace; that is this plugin's own folder. Check the path and request only that access, never a broad exception. Do not fetch another copy to bypass a denied read.

[Capture setup](references/recording.md), [narration examples](references/narration.md), [30-second planning](references/thirty-second-demo.md), [QA checklist](references/demo-checklist.md). [Bundled recorder](scripts/record-walkthrough.mjs) and [audio helper](scripts/add-narration.mjs) are optional too: reading or executing them needs the normal additional approval.
