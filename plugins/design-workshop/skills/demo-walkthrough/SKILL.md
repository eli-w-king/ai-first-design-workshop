---
name: demo-walkthrough
description: "Prepare the shared recorder or record a short narrated tour of the person's real prototype or live HTTPS app. Use for 'prepare the recorder', 'record a demo', '30-second narrated tour', or 'capture before and after'. Reuse installed Chrome/Edge, keep tools and videos outside the repo, honor an up-front install okay, and never capture another browser profile or pretend narration is app audio."
---

# Demo walkthrough

Write short, plain sentences. Do not use em or en dashes.

The complete default workflow is here. Do not open linked plugin files to start, complete or verify it. Use optional detail only when the person explicitly asks for it. Normal approvals for their files, tools and consequential actions still apply.

A clear request or an explicit okay approves the named actions, targets and scope. Do not ask again for the same approval. State the plan briefly and proceed; ask only about a genuinely missing consequential detail or a changed scope. This does not bypass host/OS permission prompts, change permission levels, authorize unrelated installs or new charges, or grant access to another account.

## One plan, not repeated approval stops

Use the supplied URL, flow, duration and install okay. If the person already asks for a 30-second narrated live-app tour and approves the recorder outside the project, proceed with this scoped setup without asking again. Choose an installed system voice and a short factual script when no other voice was requested, and state that choice. Include every available requested feature; report a missing one rather than inventing it.

If approval is missing, ask **one** question covering the whole plan: the exact installs and measured sizes, source/flow, voice/script, output location and approximate time. After one yes, complete that plan without another confirmation unless it changes. The question can appear under Autopilot too, and the person must answer it. A new browser download, microphone, voice service, unexpected charge or public upload is a changed scope, not covered by a small-recorder install okay.

Use real UI and approved sample data. No borrowed cookies, signed-in profiles, simulated terminal output, screenshot recreations, painted-over errors or spliced takes. Fix errors and retake. **Only the narration is captured, not the app's own speech or system audio.** A visual tour may show a Listen control, but do not claim its sound was recorded.

## Shared tools, outside every repository

Use the per-user cache: macOS `~/Library/Caches/design-workshop`, Windows `%LOCALAPPDATA%\design-workshop`, Linux `~/.cache/design-workshop`. Put tools in `tools/`, browser scratch in `t/` and outputs in a separate `demos/<new-run>/` folder. Never install `.workshop-recording` in the app repo. Do not overwrite an existing different tool setup.

Reuse an installed browser through Playwright's **`channel: 'chrome'`** on Mac or **`channel: 'msedge'`** on Windows. Another already installed supported channel is an alternative, not a browser download. If none works, report it; measure the proposed browser archive and get a separate explicit okay before downloading. Never install both Chrome for Testing and a headless shell by default.

The checked small setup is **playwright-core 1.65.0**, **ffmpeg-static 5.3.0** and Playwright's small capture encoder. It needs no separate ffprobe download. Measured package/encoder payloads: about **24.16 MB on Mac ARM64** and **34.79 MB on Windows x64**, plus registry metadata/transport overhead. The first Mac tool install took **9.35 seconds** on the test connection; that is not a venue-Wi-Fi or full agent-task promise. Other architectures need their own size check.

For an approved setup, resolve `TOOLS` to that cache's `tools/` folder and use the person's normal npm configuration:

```text
npm install --prefix TOOLS --cache TOOLS/npm-cache --save-exact --ignore-scripts playwright-core@1.65.0 ffmpeg-static@5.3.0
```

Use `npm.cmd` on Windows if its PowerShell shim is blocked, never relax policy. Run `TOOLS/node_modules/ffmpeg-static/install.js` with Node, putting **only that child process's** HOME/LOCALAPPDATA at `TOOLS/download-home` and XDG_CACHE_HOME at `TOOLS/download-cache`. This contains its download cache; it does not change the npm process's registry or user settings. Then run `node TOOLS/node_modules/playwright-core/cli.js install ffmpeg` with process-local `PLAYWRIGHT_BROWSERS_PATH=TOOLS/browsers`. This downloads the capture encoder, not a browser. Respect existing proxy, certificate and download-host settings. On a network/registry error, explain and stop that install; never force another registry or disable a protection.

## Rehearse the requested source

Use built-in browser tools when safely available. For a **live HTTPS link**, record that actual link, not a newly built localhost substitute. Check that deployment is complete and stable, record its revision when available, and do not deploy during capture. Use an isolated browser context with no accounts; keep upstream services inert and block their destinations before navigation. Fail and retake if the document/deployment changes. A document hash alone does not prove every unversioned asset stayed fixed.

For a **local** request, use a frozen real build on an owned port without hot reload. Other work can edit independent source files, not this snapshot or its data. A new tab alone does not freeze files. Prepare harmless sample state through real controls when needed, and disclose that precondition.

Rehearse the whole tour and verify its end state. For read-aloud interactions, do not reveal or speak a hidden answer early. Capture before/after at matching viewport, theme and state when requested. A missing baseline stays missing.

## Record a continuous take

Work from the approved cache folder for each command; do not assume a prior terminal `cd` persists. Write the flow script and plan there, not in the app. A cache-local script can load Core with `createRequire(TOOLS + '/package.json')('playwright-core')`. Set the capture-encoder path and TMPDIR/TMP/TEMP to the cache's short `t/` directory, then launch the chosen existing channel headlessly with `chromiumSandbox: true` and a fresh context. Never disable browser sandboxing to get past a launch failure. Never connect to the person's Chrome/Edge process.

With pinned Core, `page.screencast.start({path: NEW_WEBM, size: {width: 1280, height: 800}, fps: 30})` starts a real recording **after** the page is ready. Use real locators and input, a visible pointer with a blue click ring, a calm lead-in and at most two focal areas. No random zoom. Keep holds for reading, not substitutes for readiness checks. Finish the real actions before the duration limit, keep the result visible, then await `page.screencast.stop()` and close the owned context/browser in `finally`. Use a finite timeout and new filenames.

Keep requests within the approved source scope, block unexpected service writes, workers, sockets, downloads, dialogs and popups, and fail on page/console errors. Preserve the raw take and truthful checks. For exactly 30 seconds, first measure the file. Trim only surplus final idle after all actions and narration, with a matching recording receipt, never meaningful content or words. Retake if the flow will not fit.

## Narration and delivery

Use the requested voice/file, or an already installed local voice for a generic narrated request. macOS `say -f narration.txt -o NEW.aiff` writes local speech. Windows PowerShell can use `System.Speech.Synthesis.SpeechSynthesizer`, `SetOutputToWaveFile`, `Speak` and `Dispose` to write WAV. Do not download voices or start a microphone automatically. Keep provided audio unchanged.

A full ffmpeg can measure durations by decoding with `-progress pipe:1`; a separate ffprobe is optional if already present. Verify a video stream, a narration stream and no existing video audio before mixing. Use the approved offset, trailing silence, H.264/AAC, `-n` to refuse overwrites, and bounded encoding. Never cut narration to fit or silently replace existing app audio. Watch/listen and fully decode the export; state any review that was unavailable.

Run bounded capture/encoding in the background only through supported host tools, verify readiness and continue independent work. Save media outside the repo by default; an in-repo alternative must already be ignored or have an approved ignore change. Check the app project's Git status before/after. Never sweep a recording, tool cache or a file over the requested limit into a commit; the workshop's app-only limit is **1 MB**. Committing media needs its own explicit inclusion approval.

Show the result in **VS Code's integrated browser/media preview, or give its file path**. Never run `open -a`, launch an external app or reuse another browser window to show it. Report the actual duration, source, narration-only limitation, checks and gaps. Close every capture browser and finished one-off helper you started, not the person's continuing dev preview. An active owned dev preview stays available across queued follow-ups, with its URL/process and stop instructions; stop it when the person is done or asks.

Undo only with approval: remove the cache's `tools/` folder after checking no capture uses it. Keep `demos/` and chosen audio until separately reviewed. Plugin removal does not remove this shared cache or the recordings. Restore any process/terminal variables you changed; do not purge shared caches or uninstall unrelated tools.

## Optional detail

None of these files is required above. Open one only for an explicit request for extra detail. Opening it may ask to read a file outside your workspace; that is this plugin's own folder. Check the path and request only that access, never a broad exception. Do not fetch another copy to bypass a denied read.

[Prework and exact commands](references/recording.md), [narration](references/narration.md), [30-second planning](references/thirty-second-demo.md), [QA](references/demo-checklist.md). The optional [standalone installer](scripts/prepare-recorder.mjs), [recorder](scripts/record-walkthrough.mjs) and [audio helper](scripts/add-narration.mjs) need their normal scoped approval; a request to use these helpers already supplies the conversational okay.
