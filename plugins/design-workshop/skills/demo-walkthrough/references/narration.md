# Add narration without a voice account

The workshop goal is a short narrated video, not a silent fallback. Use a local system voice or an audio file the person chooses. Use a voice/file already requested. For a generic narrated tour with an up-front okay, choose an installed local voice and state it rather than stopping for another question. Never clone a voice, start a microphone recording, download a voice, or send text to a speech service without separate approval.

## Plan the words against the real flow

Draft two or three short spoken sentences about the outcome. Use only behavior the prototype really demonstrates. Reuse approval for the requested narrated tour; ask once only if the voice, script scope or recording action is not covered. Save `narration.txt` in the agreed folder, without overwriting an earlier script.

Generate or obtain audio before the final capture so its duration is known. Add deliberate reading holds to the recording plan where needed. Keep the final outcome visible while the last sentence finishes. Do not speak over an unrelated state, speed speech up to hide a mismatch or cut words off to fit.

## Local system voice

These routes write a file; they do not play through the speakers or require a speech-service account. Available voices vary. Use an already installed voice. If a voice is missing or the OS asks to download one, stop and ask instead of adding it.

**macOS:** the built-in `say` command can write AIFF. With an approved script and a new filename:

```sh
say -f narration.txt -o narration.aiff
```

To inspect installed voice choices, `say -v '?'` lists them. If the person chooses one, pass its exact listed name with `-v "VOICE_NAME"`. This changes only this invocation, not the system's voice preference. Do not promise that a voice on one Mac exists on another.

**Windows:** use the built-in Windows PowerShell, not a new PowerShell installation. This uses the installed speech synthesis engine and writes WAV:

```powershell
if (Test-Path -LiteralPath narration.wav) { throw 'Choose a new audio filename.' }
Add-Type -AssemblyName System.Speech
$speech = New-Object System.Speech.Synthesis.SpeechSynthesizer
try {
    $speech.SetOutputToWaveFile((Join-Path $PWD 'narration.wav'))
    $speech.Speak((Get-Content -Raw -Encoding UTF8 -LiteralPath narration.txt))
} finally {
    $speech.Dispose()
}
```

It uses the default installed voice. If the assembly or voice is unavailable, report the limitation and offer a supplied audio file. Do not change execution policy or install a language pack automatically. The API is documented under [SpeechSynthesizer.SetOutputToWaveFile](https://learn.microsoft.com/en-us/dotnet/api/system.speech.synthesis.speechsynthesizer.setoutputtowavefile?view=netframework-4.8.1).

## The person's recorded voice

Use an existing audio file they explicitly choose, or let them record one with an app already on the laptop. For example, macOS has QuickTime Player's **New Audio Recording** and Windows has **Sound Recorder** where installed. They control microphone permission and start and stop recording. No account connection or voice-cloning service is needed. The agent must not activate a microphone merely because narration was requested.

Use a normal audio export such as WAV, AIFF, M4A or MP3 that the existing media tools can decode. Confirm it is their own recording or one they have permission to use. Do not read other recordings. Keep the original unchanged. Listen and compare it with the agreed script before combining it; if listening is unavailable, label that review unfinished.

## Combine it with the video

The recorder's bundled encoder is for video capture and might not support audio mixing. Use the shared cache's full ffmpeg, or an approved existing one. The helper measures durations by decoding, so no separate ffprobe download is needed; an existing ffprobe is optional. The [small setup](recording.md) uses ffmpeg-static alongside Core, with no voice account or system-wide package-manager install.

Use the [narration helper](../scripts/add-narration.mjs). Replace `PATH_TO_SKILL` with the installed `demo-walkthrough` directory. From the approved cache root, not the app project, with a new run folder and a generated AIFF:

```sh
node "PATH_TO_SKILL/scripts/add-narration.mjs" --runtime tools --video demos/RUN/take/walkthrough.webm --audio demos/RUN/narration.aiff --output demos/RUN/tour.mp4 --duration 30 --recording-result demos/RUN/take/result.json
```

On Windows use `--audio narration.wav`. For the person's own recorded voice, use that chosen file with the same `--audio` argument. Paths with spaces need quotes. The helper works with either source; it does not generate or clone a voice itself.

The default starts the narration 1.2 seconds into the video. Use `--delay-ms` for an agreed offset. The helper checks measured durations and refuses audio that would run past the video, an input video that already has audio, or an existing output file. Shorten the script or add real holds and record again if needed. Do not silently discard existing audio or replace it.

Review the full MP4 with sound in VS Code's integrated preview, or give its file path for the person to open. Never launch an external app or reuse another Chrome/Edge window to display it. Check that the right sentence lands on the right action, the voice is intelligible, the pointer remains visible and the ending is not clipped. Decode the whole file and inspect both audio and video streams. A successful mux is not proof of good narration.

## Work on something else while it runs

Follow [the frozen 30-second capture plan](thirty-second-demo.md). For a live-link request, record the actual stable HTTPS deployment and prevent a new deployment during the take; do not rebuild localhost as a substitute. For a local request, serve an immutable real build from an owned server with no hot reload. Do not capture another session's changing page. A separate browser context alone does not freeze files or sample data. The person can do a separate task in another folder while a bounded recorder or encode runs through the host's supported background-task facility. Verify the process starts and the local page responds; keep its process id and output path. Do not edit the app, rebuild it or reuse the same preview process mid-take.

Return to inspect the actual result and finish the recording/encoding tasks. Clean up capture-only helpers when no longer needed, not the person's ongoing development preview. Keep a development preview you started running while the person is still working in the session or queued follow-ups need it. Give its URL, port, owning terminal/process and how to stop it (Ctrl+C in that terminal or the host's stop control). One completed request is not the end of the session. Stop the preview when the person is done or asks, and never kill a process you did not start. Do not start another agent, buy more capacity or enable a schedule to claim parallel work. If the host cannot continue another task while recording, state that limit.

## Undo and checked coverage

System speech writes only the selected audio file. With approval, remove that file and the script, leaving other recordings alone. A supplied voice recording remains unchanged. Remove the newly added media tools only through their matching install route after checking shared use. The [recording guide](recording.md) has exact Mac and Windows removal commands. Delete no outputs without asking.

The macOS system-voice and local-audio mux routes have been exercised on an existing tool setup. Windows instructions are documented, not a completed clean-laptop rehearsal. Actual microphone recording and a human listening review remain separate checks. Do not promise clean-install timing or equivalent voice availability on every laptop.
