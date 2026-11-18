---
name: demo-walkthrough
description: "Record a short narrated walkthrough of the person's working prototype, or make screenshots and before/after pairs when those are requested. Use for \"record a demo\", \"make a short video\", \"walk through my prototype\", or \"capture before and after\". Rehearse with built-in browser tools first. A video requires a real recording pipeline; ask before adding tools and never substitute stills without agreement."
---

# Demo walkthrough

Write short, plain sentences. Do not use em or en dashes in generated copy.

Show one useful task from a clean start to a visible result in the real running prototype.

## Choose the output

Confirm the page, the audience, the task, the output folder, and whether the person wants a **video**, **screenshots**, or **before and after**. For a workshop video, make it short and narrated. Agree on duration, the words and whether to use an installed system voice or the person's own recorded audio. A silent clip is only an explicitly chosen fallback, not the narrated-video goal. Do not promise a three-minute turnaround without a tested route.

Use [the demo brief and review checklist](references/demo-checklist.md). A screenshot sequence, animated webpage or slideshow is not a recorded demo video.

## Keep it honest and private

- Ask before any install, send, publish, spend or delete. Recording permission is not upload permission. Use only a page and sample content the person owns or can show.
- Use the actual interface, from start to finish. Label fictional data and simulated behavior. Never paint over errors, splice different sessions into a fake continuous flow, or show a recreation as the product.
- Keep a visible pointer and clear clicks, a calm lead-in and ending, no random zoom, and at most two areas competing for attention.
- Fix errors and retake. Do not present failed states, sign-in prompts, notifications or personal details as a finished demo.
- Use a new isolated tab or browser context. Never attach to someone else's browser, reuse their cookies, or drive their desktop without a separate explicit request.

For a forked app, confirm [upstream hosted services are inert](../prototypes/references/fork-guardrails.md) before opening it for rehearsal or capture. A fresh browser profile is not a network boundary. Do not load an unprepared app or sign in to upstream services to get a before image.

## Rehearse first

1. Inspect the built-in browser tools the host actually offers. In VS Code, use them to open the local page, reset the flow, click through it, and inspect screenshots and errors. No external browser server is required for these checks.
2. Write the exact clicks, input and expected final state. Use visible labels rather than fragile coordinates. Keep the screen readable at the intended recording size.
3. For before/after pairs, capture the same viewport, theme, content and state on both sides. A missing baseline stays missing; do not fabricate one.

## A 30-second voiceover request

Use [the 30-second demo guide](references/thirty-second-demo.md) for "record a 30-second demo with a voiceover". Capture a frozen copy of the real built app or another isolated immutable target, never a shared hot-reloading page that another session is editing. Keep its browser, data, server and output separate from other work. If it cannot be frozen, stop rather than recording a changing target. Measure the final duration instead of claiming the helper guarantees thirty seconds.

## Record a video

Built-in interaction and screenshot tools do not, by themselves, establish that video export is available. If this host exposes a recorder, verify its actual saved video and limitations before using it. Otherwise follow [the local recording guide](references/recording.md).

That guide includes a small [recording helper](scripts/record-walkthrough.mjs), a [plan example](references/recording-plan.example.json), exact opt-in installation and removal steps for Playwright, and optional MP4 conversion. Prefer existing tools. If tools are missing, explain the downloads, changed folder and undo, ask, and wait. Never install on the strength of the word "demo" alone.

Record one continuous take. The helper adds only a pointer and click indicator to the page; it does not change application state to fake success. It stops on page errors, unexpected dialogs, popups or outside requests. Close the recording context to finish writing the video.

If automatic recording is unavailable or declined, say **video blocked**, give the specific missing capability, and offer manual screen recording as a separate fallback. Do not claim that a fallback met an automatic-video request.

## Add narration and use the wait well

Follow [the narration guide](references/narration.md): an installed system voice or the person's own chosen audio file, a short approved script, measured timing, and a real audio/video export. macOS system speech and Windows speech synthesis need no new account; check the actual installed voice rather than downloading one silently. Ask before any microphone recording or media-tool install. Never substitute a silent clip without agreement.

Start a bounded capture or encode with the host's existing background-task tools when available, verify that it is running, and keep the process id and output path. Another independent task can use a different folder while it finishes. Freeze the app and recording inputs as described above so that later edits cannot change the interface mid-take. Stop and retake if they change unexpectedly. Do not start extra paid agents or a schedule to achieve this.

The supplied browser recorder does not capture app/system audio. A voiceover is not proof that an audio feature actually played; if that sound must be in the demo, require a separately approved real-audio capture and mixing route. Never fake it with narration.

## Review and hand over

Play the entire exported video with its narration, not just its first frame. Listen for intelligible speech, correct timing and a complete ending. Check that the pointer, text, transitions and outcome are visible, with no error state or missing frames. Use existing media tools for duration, dimensions and decoding checks when available. If you cannot watch it, mark it **recorded, visual review needed**.

Deliver the actual `.webm` or `.mp4`, the screenshots if requested, and a short note: what is real or simulated, the source revision if known, checks completed and limitations. Keep prior takes until the person approves deletion. Stop every recorder, browser and server you started. Upload nothing.
