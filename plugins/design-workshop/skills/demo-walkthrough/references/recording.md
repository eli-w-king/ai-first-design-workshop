# A small reusable recorder

Use the browser already on the laptop, not another full browser download. The recorder uses Playwright Core with `channel: 'chrome'` or `channel: 'msedge'`, a fresh headless profile and the small capture encoder. A separate full ffmpeg supplies narration and MP4; ffprobe is not required. No extension, sign-in or existing browser tab is needed.

## Before Thursday

Have Node and an installed Chrome on Mac, or Edge on Windows. The plugin is installed during prework too. In chat, this exact request is enough:

> Use demo-walkthrough to prepare the shared recorder with the bundled prepare-recorder installer. Use my installed Chrome or Edge and my configured npm registry. I approve the small recorder install in its per-user cache, outside my project. Do not download another browser or change settings.

The explicit okay covers that recipe. Do not ask again for each package. A new browser, different download size, microphone, voice service or changed scope still needs its own decision. Host/OS permission prompts are separate and must not be bypassed.

The [standalone installer](../scripts/prepare-recorder.mjs) is ordinary Node code. Review it, then run its installed or downloaded copy:

```sh
node PATH_TO_SKILL/scripts/prepare-recorder.mjs --install
```

Without `--install`, it prints the plan and changes nothing. It preserves npm's configured registry, proxy and certificates, disables automatic package scripts, then runs only the reviewed encoder installer. A network/registry failure stops setup; it never switches to public npm. An unrelated or differently pinned existing cache manifest is left unchanged.

The resulting layout is:

```text
design-workshop/
  tools/       packages, private npm/download caches, capture encoder
  t/           temporary profiles owned by the recorder
  demos/       plans, narration, raw takes and final videos, separate from tools
```

Locations: macOS `~/Library/Caches/design-workshop`, Windows `%LOCALAPPDATA%\design-workshop`, Linux `~/.cache/design-workshop`. Every project reuses these tools. No `.workshop-recording` folder is created in the app repo. Keep videos outside the repo by default, or in a separately approved ignored folder. Never automatically commit them.

## Measured download sizes

Checked November 18, 2026 with **playwright-core 1.65.0**, **ffmpeg-static 5.3.0**, encoder release **b6.1.1**, and Playwright capture encoder **1013**. The previously documented Core 1.65.1 pin was unavailable in the configured registry; the stable 1.65.0 pin was checked instead, without changing registries.

| Target | Node package payloads | Full encoder and notices | Capture encoder | Total payload |
| --- | ---: | ---: | ---: | ---: |
| Mac ARM64 | 3,468,505 bytes | 19,252,384 bytes | 1,430,308 bytes | **24,151,197 bytes (24.16 MB rounded up)** |
| Windows x64 | 3,468,505 bytes | 29,655,948 bytes | 1,663,577 bytes | **34,788,030 bytes (34.79 MB rounded up)** |

These are compressed package/encoder payloads, not an estimate from the installed folder. Registry metadata and transport overhead are extra. Windows payloads were downloaded and inspected on Mac, not installed or timed on a Windows machine. Other architectures need their own measurement. The first cold Mac install took **9.35 seconds** and used about **107 MB** for tools plus their caches. Those are this connection's measurements, not promises for venue Wi-Fi. No browser was downloaded. The Mac full encoder reports FFmpeg 6.0; the release tag alone is not its executable version.

Use existing suitable media tools when already available. This small standalone route avoids a separate ffprobe binary and a system-wide package-manager install. Keep its bundled license/README files. Do not treat it as a license to process untrusted media indiscriminately or claim the binary is the latest ffmpeg release.

## Exact manual setup, if wanted

The installer above handles these steps. This is the Mac equivalent, with normal npm configuration retained:

```sh
RECORDER="$HOME/Library/Caches/design-workshop"
mkdir -p "$RECORDER/tools"
npm install --prefix "$RECORDER/tools" --cache "$RECORDER/tools/npm-cache" --save-exact --ignore-scripts playwright-core@1.65.0 ffmpeg-static@5.3.0
HOME="$RECORDER/tools/download-home" node "$RECORDER/tools/node_modules/ffmpeg-static/install.js"
PLAYWRIGHT_BROWSERS_PATH="$RECORDER/tools/browsers" node "$RECORDER/tools/node_modules/playwright-core/cli.js" install ffmpeg
```

Only the encoder child's HOME is changed, to contain its cache. npm still uses the person's real configuration. The standalone installer applies equivalent child-only HOME/LOCALAPPDATA/XDG_CACHE_HOME values on Windows and Linux, avoiding permanent environment edits. On Windows, `node PATH_TO_SKILL/scripts/prepare-recorder.mjs --install` uses the installed npm CLI through Node, so it does not require changing PowerShell execution policy.

Never add a `--registry` override or change certificate/proxy settings as a workaround. If a project's local npm configuration would select a different registry from the cache install, the installer stops for review instead of copying credentials or choosing a registry silently.

## Use the installed browser

Chrome is the Mac default; Edge is the Windows default. An already installed alternative channel is fine. If neither works, inspect the specific failure, not another person's browser or profile. A browser download is a separate choice: use the pinned CLI's `install chromium --no-shell --dry-run` to identify the exact archive, check its published byte size, explain it, then obtain a clear okay. Download only that approved browser, not both a browser and a headless shell. Do not install system dependencies or run an administrator command on failure.

The helper has no installer or automatic browser-download fallback. Its `--browser` option is only for an existing, explicitly approved executable. Browser-version compatibility still needs the actual run. Keep `chromiumSandbox: true`; do not disable it to get past a launch failure.

## Rehearse and record

Use the [JSON example](recording-plan.example.json), replacing every label with the real controls and the exact approved URL. HTTPS live links and localhost builds are supported. A live-link request records that deployed site, not a rebuilt localhost substitute. Check a completed stable deployment, keep other tasks from publishing during the take, and record its revision when available. The helper also checks the initial document hash afterward, but that does not verify every unversioned asset.

For a local request, supply a frozen build with no watcher or hot reload. Rehearse first and use harmless sample data. Keep upstream sync and account services inert. The helper allows only GET/HEAD to the selected origin, blocks workers and sockets, and fails on outside requests, errors, dialogs, downloads or new tabs. It is not a recorder for signed-in accounts or an unrestricted backend workflow.

Use `durationSeconds: 30` for a 30-second goal. Choose a final ready control, not an early placeholder. The helper waits for fonts, visible opacity and finite entrance animations before starting capture, not initial blank-page loading. It supports up to 12 bounded real input steps, then holds the final state. A flow that cannot leave final reading time fails rather than cutting actions. The pointer and blue click ring follow real input; app content is never replaced.

Run from the cache root on every invocation. Create a fresh `demos/RUN/` parent and put the plan and narration there. The take folder itself must not exist:

```sh
cd "$HOME/Library/Caches/design-workshop"
PLAYWRIGHT_BROWSERS_PATH="$PWD/tools/browsers" node "PATH_TO_SKILL/scripts/record-walkthrough.mjs" --runtime tools --channel chrome --plan demos/RUN/plan.json --output demos/RUN/take
node "PATH_TO_SKILL/scripts/add-narration.mjs" --runtime tools --video demos/RUN/take/walkthrough.webm --audio demos/RUN/narration.aiff --output demos/RUN/tour.mp4 --duration 30 --recording-result demos/RUN/take/result.json
```

In Windows PowerShell, set the current directory to `$env:LOCALAPPDATA\design-workshop`, set `PLAYWRIGHT_BROWSERS_PATH` for that process/terminal to its `tools\browsers`, use `--channel msedge` and a chosen WAV narration file. Restore a changed terminal variable afterward. All other helper arguments are the same; quote paths containing spaces.

The optional duration export checks the raw video's checksum and successful recording receipt, leaves at least 2.5 seconds after all actions, and refuses to cut narration. It trims only surplus final idle and retains the original WebM. A receipt or metadata edit is not a substitute for re-recording a failed take.

## Review and hand off

The folder contains the actual WebM, start/finish stills, result JSON and, after approved narration, the MP4. Failed captures remain marked failed. Inspect duration, streams, complete decoding, visible pointer, text, timing and full playback. Say what was not checked. The file captures **narration only, not the app's own speech/system audio**, even if the tour includes a Listen button.

Show the output in VS Code's integrated browser/media preview or return its file path. Never open external Chrome, another app or someone else's browser window to display it. Close owned capture contexts and completed helpers. Do not stop a continuing user-facing dev preview or another session's process.

Check the app project's Git status before/after. Tool caches and recordings stay out of an app-only PR, including when someone says "everything". The workshop limit is 1 MB, not 5 MB; a person's stricter limit wins. Committing a video needs separate explicit inclusion approval.

## Undo, only with approval

Stop active owned captures first. Removing `tools/` removes the shared packages and their private download caches for every project, but preserves `demos/`. From the cache root, the exact tools-only removal is:

```sh
node -e "require('node:fs').rmSync('tools', { recursive: true })"
```

Review the path and shared use before running it. Remove a downloaded installer separately if wanted. Delete no narration or take without its own review. Do not remove pre-existing global ffmpeg, browser installations or unrelated caches. Plugin removal does not remove this cache or any video.

## Current-code checks and sources

A prewritten real HTTPS plan, including cold setup, speech and export, took 59.25 seconds on the test Mac; a prepared repeat took 47.62 seconds. Final sandbox-preserving capture/export took 48.32 seconds with the voice file already generated. These do not include agent planning or human listening review and are not an app-tour timing promise. The final media was 30.00 seconds, H.264/AAC, 1280x800/30 fps, fully decoded with non-silent narration; the recorded website's source clone stayed Git-clean.

Sources: [installed browser channels](https://playwright.dev/docs/browsers#google-chrome--microsoft-edge), [the screencast API](https://playwright.dev/docs/api/class-screencast), and [pinned encoder release assets](https://github.com/eugeneware/ffmpeg-static/releases/tag/b6.1.1). Keep the selected source stable and verify the actual export; these docs and measurements do not prove another machine's result.
