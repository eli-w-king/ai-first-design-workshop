# A real local video

Use VS Code's built-in browser tools to rehearse and inspect first. They support interaction and screenshots without an external server plugin. Do not assume they can export a video. This optional route records an actual browser viewport to WebM using Playwright. The capture helper does not record desktop apps or microphone audio. Add approved system speech or a chosen audio file with [the narration guide](narration.md) to meet the workshop's narrated-video goal.

## Check what already exists

Inspect only the current project's tools. You need Node 22 or later, Playwright or Playwright Core, a compatible browser, and Playwright's video encoder. Node alone is not enough. An existing standalone ffmpeg is not automatically a replacement for the encoder Playwright expects.

If these tools already work, use them with the helper's `--runtime`, `--package`, `--browser` or `--channel` options. Do not search another person's folders, download a browser on failure, or borrow a signed-in profile. The helper uses a fresh headless context and never opens a visible app window.

## Ask before the optional setup

Explain this proposal and wait for approval:

> Add Playwright 1.65.1 in a new `.workshop-recording` folder for this project, then separately download its browser and video encoder there. The downloads can use several hundred MB and need internet access. This does not change your app's dependencies, install a browser extension, or grant access to existing browser tabs. We can later remove that one folder, keeping the video files.

The pinned version is the public stable release checked for this guide. Review it before adoption; do not silently use `latest`. If the folder exists, inspect it and choose a new folder instead of overwriting it. Ask before adding an ignore entry for recording tools and private output to an existing repository.

With approval for the package, on macOS or Linux:

```sh
npm install --prefix .workshop-recording --cache .workshop-recording/npm-cache --registry=https://registry.npmjs.org --save-exact --ignore-scripts playwright@1.65.1
```

On Windows PowerShell, use the same arguments with `npm.cmd`:

```powershell
npm.cmd install --prefix .workshop-recording --cache .workshop-recording/npm-cache --registry=https://registry.npmjs.org --save-exact --ignore-scripts playwright@1.65.1
```

Then, with separate approval for the browser and encoder download, macOS or Linux:

```sh
PLAYWRIGHT_BROWSERS_PATH="$PWD/.workshop-recording/browsers" node .workshop-recording/node_modules/playwright/cli.js install chromium
```

Windows PowerShell, for this terminal only:

```powershell
$env:PLAYWRIGHT_BROWSERS_PATH = "$PWD/.workshop-recording/browsers"
node .workshop-recording/node_modules/playwright/cli.js install chromium
```

If the person prefers an already installed supported Chrome, install only Playwright's encoder with the same command ending in `install ffmpeg`, and use `--channel chrome` when recording. Test this route; browser-version compatibility is not guaranteed. Do not install system dependencies or run an administrator command on failure. Explain the missing item and ask again.

The [Playwright video documentation](https://playwright.dev/docs/videos) explains `recordVideo` and why the context must close before a file is complete. These commands do not run on plugin installation.

## Make the plan

Use the [JSON example](recording-plan.example.json), replacing every label and value with the real local prototype. The example is a format, not a supplied application. Rehearse all steps first. Use a localhost URL owned by this task, an existing local server, or the project's documented start command. Starting a server needs its normal approval; record its process id and stop only that server afterward.

The helper supports `click`, `fill`, `press`, `expect` and a short `wait`. Targets use an exact accessible role and name, or exact visible text. The `ready` and `finish` targets must match visible elements. Use at most 12 steps, no real accounts and no production data. The helper permits only GET and HEAD requests to the chosen localhost origin, blocks service workers and WebSockets, and fails on outside requests, errors, dialogs or new tabs. A prototype that needs a live backend is outside this route.

Choose a new output directory. The helper refuses an existing output folder and writes only under the current working folder. It puts browser scratch state inside that new folder and closes the context and browser even when recording fails. It never installs dependencies, opens an upload destination or deletes prior takes.

Replace `PATH_TO_SKILL` with the actual `demo-walkthrough` directory shown by the installed skill. From the project folder, macOS or Linux:

```sh
PLAYWRIGHT_BROWSERS_PATH="$PWD/.workshop-recording/browsers" node "PATH_TO_SKILL/scripts/record-walkthrough.mjs" --runtime .workshop-recording --plan recording-plan.json --output demo-take-01
```

Windows PowerShell, in the same terminal as the browser-path setting:

```powershell
node "PATH_TO_SKILL/scripts/record-walkthrough.mjs" --runtime .workshop-recording --plan recording-plan.json --output demo-take-01
```

With an existing Playwright Core installation, pass its project folder as `--runtime`, `--package playwright-core`, and `--browser` with an approved existing browser executable. Do not copy machine-specific paths into the plan or public project.

## What the helper leaves

- `walkthrough.webm`: a continuous real capture, only when flow checks passed. It still needs visual review.
- `start.png` and `finish.png`: the actual start and final state when reached.
- `result.json`: status, source URL, dimensions, video filename, flow checks and any failures.
- An owned browser-state folder, normally empty after browser shutdown.

On failure, a partial video is named `failed-take.webm` when one can be finalized. It is not a finished deliverable. A new take needs a new folder. Do not hide a failed check by editing the JSON or relabeling the file.

The helper's pointer is an overlay driven by the real input events. It is the only visual annotation. It never changes application content or invokes private app methods to force a result. Read the script before running it.

## Optional MP4, only if needed

WebM is a real video and does not require a separate ffmpeg install. If MP4 is needed, prefer an existing ffmpeg. Otherwise ask before installing it: `brew install ffmpeg` with an existing Homebrew on macOS, or `winget install --id Gyan.FFmpeg --exact` with an existing winget on Windows. Explain that these install a shared command-line tool and may add dependencies. Without those package managers, offer the official [ffmpeg download options](https://ffmpeg.org/download.html), not an automatic package-manager install.

Convert without overwriting an existing file:

```sh
ffmpeg -n -i demo-take-01/walkthrough.webm -c:v libx264 -pix_fmt yuv420p -crf 20 -movflags +faststart demo-take-01/walkthrough.mp4
```

With existing media tools, inspect and decode the file:

```sh
ffprobe -v error -show_entries stream=codec_name,width,height:format=duration -of json demo-take-01/walkthrough.webm
ffmpeg -v error -i demo-take-01/walkthrough.webm -f null -
```

Play the entire export too. Do not claim a visual review from metadata or selected stills alone. Record any narration or conversion limitation, and the actual tools and versions tested.

## Undo, only when asked

First stop the recorder and the server you own. Review the exact files. To remove the newly created recording setup on either platform, this command removes only its named folder, including its private npm cache, packages and browser downloads:

```sh
node -e "require('node:fs').rmSync('.workshop-recording', { recursive: true })"
```

Ask before running it. Do not use it if the folder existed before this setup or contains files the person wants. It does not remove `demo-take-01` or the plan. Those are separate deletion decisions. Remove only the ignore entries you added, and restore any previous terminal environment value. In a fresh PowerShell terminal no variable persists; if there was no prior value, `Remove-Item Env:PLAYWRIGHT_BROWSERS_PATH` clears it in the current terminal.

If this setup newly installed standalone ffmpeg, offer `brew uninstall ffmpeg` or `winget uninstall --id Gyan.FFmpeg --exact` after checking other projects do not need it. Never run a broad dependency cleanup. Uninstalling tools does not delete videos or recall any copy shared separately.
