# Design workshop skills

Computer Use needs **Interactive mode and Manual permissions**, not Autopilot. The first time it touches each app, click **Allow in the native permission panel**, not a chat card. Autopilot can cancel that request; do not keep retrying calls while the panel is unanswered. This is separate from screenshot markup and browser DOM automation.

Nine practical skills for designers working on their own laptops and projects. Explore options, fix and test a working prototype, prepare input files, record it and review work to share. Use the [screenshot markup loop](references/markup-feedback.md) to turn your arrows and rearranged pieces into changes in the real code. Each task can start from your own files; none depends on finishing an earlier workshop exercise.

This is a community workshop resource, not an official Microsoft or GitHub product.

**Release status:** this work is on `plugin/design-workshop`, not the default branch yet. After PR #1 merges, attendees use the main-release steps below. Until then, maintainers use the clearly marked preview source. Nothing in this plugin runs on installation.

## The skills

| Skill | What it helps you do | Try saying |
| --- | --- | --- |
| [workshop-setup](skills/workshop-setup/SKILL.md) | Check VS Code Insiders, GitHub, Git and current-LTS Node prework, then explain an approved pinned dependency install and undo. | "Check my setup. Do not install anything yet." |
| [variations](skills/variations/SKILL.md) | Build N distinct directions plus today's baseline, with one switcher and side-by-side comparison. | "Make three different directions for this screen." |
| [demo-walkthrough](skills/demo-walkthrough/SKILL.md) | Rehearse a real flow, then record a short narrated video with a local system voice or your own chosen audio. | "Make a short video of this prototype. Ask before adding tools." |
| [prototypes](skills/prototypes/SKILL.md) | Build or fix the real project with red/green proof, make plain input files, and prepare a PR inside your own fork. | "Apply this change in my fork. Keep a before screenshot and a way to revert." |
| [pair-test](skills/pair-test/SKILL.md) | Synthesize clearly fictional interview notes for practice, or draft a test you run with a real person. | "Plan a small partner test. Drafts only." |
| [taste](skills/taste/SKILL.md) | Create a taste-skill draft from your own notes, then propose updates through the opt-in automation or on demand. | "Set up my taste from notes in this workspace." |
| [overnight-plan](skills/overnight-plan/SKILL.md) | Agree on a longer run's scope, budget, checkpoints, permissions and stop rule before it starts. | "Plan tonight's work. Do not start it yet." |
| [publish-pages](skills/publish-pages/SKILL.md) | Check a fork's license and public content, choose branch or build-workflow deployment, then verify the real app and repo links. | "Check whether this folder is safe to publish." |
| [job-search](skills/job-search/SKILL.md) | Draft a truthful case study, tailored introduction or role digest from public pages you choose. | "Turn this work into a portfolio draft." |

The [Keep my taste current](automations/keep-my-taste-current.automation.md) automation creates a first draft, then proposes updates from your selected workspace notes. It enables nothing on install. Keep its first trigger Manual and press Run now before choosing a weekly schedule. The [daily cards](automations/daily-cards.automation.md) template drafts ten new cards from its workspace notes and starts Manual. The [weekly roles digest](automations/weekly-roles-digest.automation.md) is another opt-in, manual template; its default uses workspace copies of chosen postings so a scheduled run needs no outside file or browser access. Keep or return recurring triggers to Manual after the workshop to avoid unattended usage; Manual runs still consume credits. It never applies or sends. Read its [cost and scheduling guide](references/automation-guide.md) before choosing to run or schedule it.

From a template, choose the model and effort in the **New Automation** dialog. If created from chat, open it under **Automations**, set the model and effort, **Save**, then **Run now**. Check the saved choice before running; naming a model in the prompt does not select it and an unset model can use the account default. Keep the first trigger Manual and review usage after that supervised run. This applies to all three templates.

The [workflow map](references/workshop-workflows.md) covers the guided and free-work modules generically, including red/green fixes, separate parallel sessions, plain deck files, frozen 30-second narrated capture and the host's Computer Use handoff. It does not choose an app or replace the supplied workshop kit.

## What you install

Skills may ask to read optional files in this plugin's own folder; that is safe to allow after checking the path, and the default workflows avoid those reads.

Only the skill package: instructions, references, a taste-draft structure, optional recording and narration helpers and three opt-in automation templates. The helpers are inert until you choose to run them. The plugin does not install their dependencies.

- No hooks, bundled tool servers, global rules, account connections, background jobs or sync.
- No settings, permission changes, scheduled runs or paid services enabled for you.
- No silent installs, sends, publishing, spending or deletion. Each skill asks before those actions and explains what changes and how to undo it. Pair-test and job-search stay draft-only.
- No private samples or personal taste rules. You choose any material used to build your own.

These are instructions, not a security sandbox. Review tool requests and keep the host's approval and sandbox controls. Manual permissions still honor earlier approvals. Files stored locally can still be sent as context to the AI provider you selected. Use public, fictional or redacted content you are allowed to share.

## Install in VS Code before the workshop

Have VS Code Insiders, Node, Git and GitHub CLI ready, and use your own GitHub sign-in. Run `gh auth login`, choose HTTPS, and allow it to authenticate Git when asked. You handle sign-in yourself; do not paste a password or token into chat. Follow [Get ready](https://eli-w-king.github.io/ai-first-design-workshop/get-ready/) for the checked settings and Mac `/computer on` prework. File-only taste/deck tasks do not require a GitHub repository.

### Attendees, after PR #1 merges

1. Open VS Code Insiders with Copilot selected as the harness. Press **Shift+Command+P** on Mac or **Ctrl+Shift+P** on Windows to open the Command Palette.
2. Run **Chat: Open Customizations**. Open **Plugins**, then **Browse Marketplace** (or Browse), and choose **Configure Marketplaces > Add Marketplace** from the source menu.
3. Enter `eli-w-king/ai-first-design-workshop` and add it. Keep every marketplace already there; do not replace the list.
4. Open that marketplace, select **design-workshop**, review it, choose **Install**, and approve trust if you agree. Plugins are not extensions.
5. Start a fresh chat. Type the installed skill's name or select it from `/`, then try: **"Check my setup. Do not install anything yet."** There should be nine workshop skills.

If the UI is different, use the host's supported **Chat: Install Plugin from Source** for a checked-out `plugins/design-workshop` folder, or the CLI route below. If using the Settings route, append the source to `chat.plugins.marketplaces`, preserve every existing entry including `github/awesome-copilot#marketplace`, and avoid duplicates. Never replace the array or edit settings without an explicit request and reviewed backup.

The main-release direct link is `vscode-insiders://chat-plugin/install?source=eli-w-king%2Fai-first-design-workshop&plugin=design-workshop`. It prompts before installing and works only after the marketplace is on the default branch. Use `vscode://` for a supported regular VS Code release; the workshop uses Insiders.

### Maintainer preview, before the merge

Use the same steps but enter `eli-w-king/ai-first-design-workshop#plugin/design-workshop`. Do not register both preview and main sources for the same marketplace. The preview is not a default-branch release.

The checked [Get ready page](https://eli-w-king.github.io/ai-first-design-workshop/get-ready/) owns the two experimental settings, Computer Use and Send Later. This plugin links to that snippet instead of copying it. Computer Use uses Interactive mode and Manual permissions; allow each app in its native first-use panel, not a chat card. Do not run that flow under Autopilot.

## Before Thursday: prepare the recorder at home

After installing the plugin, paste this in chat:

> Use demo-walkthrough to prepare the shared recorder with the bundled prepare-recorder installer. Use my installed Chrome or Edge and my configured npm registry. I approve the small recorder install in its per-user cache, outside my project. Do not download another browser or change settings.

For a terminal route, download/review [prepare-recorder.mjs](skills/demo-walkthrough/scripts/prepare-recorder.mjs), open a terminal in the folder containing it, then run this same command on Mac or Windows:

```sh
node prepare-recorder.mjs --install
```

Without `--install`, it prints the plan without changing anything. It uses installed Chrome/Edge, Core 1.65.0, ffmpeg-static 5.3.0 and the small capture encoder. Measured payloads are **24.16 MB on Mac ARM64** or **34.79 MB on Windows x64**, plus registry metadata/transport overhead; no browser is downloaded. The first cold Mac install took **9.35 seconds** on the test connection, not a promise for the room. Windows payload size was measured, not native Windows install time.

Tools go in `design-workshop/tools` under `~/Library/Caches` on Mac, `%LOCALAPPDATA%` on Windows or `~/.cache` on Linux. Plans/videos go separately in `design-workshop/demos`, outside the app repo. Review [exact commands and removal](skills/demo-walkthrough/references/recording.md). With approval and no active capture, remove only `tools/` to undo the setup; keep videos until separately reviewed. The installer never changes npm's registry or global settings.

## Install in Copilot CLI

If Copilot CLI is already installed, after the main release use the commands below. They are separate from the required GitHub CLI (`gh`):

```sh
copilot plugin marketplace add eli-w-king/ai-first-design-workshop
copilot plugin install design-workshop@ai-first-design-workshop
copilot plugin list
copilot skill list
```

Before the merge, maintainers use the preview source instead:

```sh
copilot plugin marketplace add 'eli-w-king/ai-first-design-workshop#plugin/design-workshop'
copilot plugin install design-workshop@ai-first-design-workshop
```

Choose one source for this marketplace, not both at once. If already registered from another revision, inspect its current source before changing it. For local development, `copilot plugin marketplace add /ABSOLUTE/PATH/TO/REPO` reads this worktree's marketplace; do not point at the plugin subfolder for that command.

Start a fresh session and confirm all nine skills are available. Skills can load when your request matches their descriptions; choose the installed skill from the slash menu when you want to be explicit. Exact names can be qualified by the plugin in some clients.

VS Code can discover CLI-installed plugins. Avoid a duplicate installation just to make the name appear twice. The Customizations editor and chat `/plugin` commands can use separate inventories, so manage a plugin from the interface where you installed it.

## Update or remove

**Moving to 0.3.5:** skills no longer ask the agent to intercept requests in VS Code's built-in browser, where a failing route handler can hang the page. They check the local-only setup in the code and verify requests with the network log. Start a fresh session after updating.

**Moving to 0.3.4:** publish-pages now also checks root-based image paths and links, keeps one manifest and one service worker, and tests the production build at the project path before publishing. Start a fresh session after updating.

**Moving to 0.3.3:** recording tools now use the shared per-user cache and an installed browser. Prepare them before the workshop. An older in-project `.workshop-recording` folder is not moved or deleted automatically; leave it out of app commits and review removal separately. Existing created automations still keep their own saved prompt and model.

**Moving to 0.3.2:** start a fresh session after updating. Automations already created from an older template keep their saved prompt. Review and update that prompt from the new self-contained template, or recreate it with the trigger still Manual. Choose the model in New Automation, or open a chat-created automation under Automations, set the model, Save, then Run now. An old paused run may retain the old instructions; cancel it only with approval and start a fresh run. Do not solve an old guide prompt by granting broad folder access.

**VS Code:** use **Chat: Update Plugins**, or **Check for and Apply Updates** in Customizations. Review changes before adopting them. To remove the plugin, open **Customizations > Plugins > design-workshop > Uninstall**. Remove its marketplace from **Configure Marketplaces** if you no longer want it listed.

**CLI:** update the catalog, then the named plugin:

```sh
copilot plugin marketplace update ai-first-design-workshop
copilot plugin update design-workshop@ai-first-design-workshop
```

To remove it, without deleting your project:

```sh
copilot plugin uninstall design-workshop@ai-first-design-workshop
copilot plugin marketplace remove ai-first-design-workshop
```

Local-path plugins load from their real folder; edits take effect in a new session. A pinned commit stays pinned until you choose another revision. Review the host's own automatic-update settings if you want manual updates; this plugin adds no updater or sync job.

Uninstalling does not remove projects, video files, personal skills you created, optional tools you installed, or automations you deliberately created from the template. Use the relevant skill's undo steps for those, with approval. Disable a created automation separately before removing it.

Requested design changes become the app's default, with a before image/revision and a way back. Switchers are for explicitly requested alternatives. App-only PRs exclude recordings, tool files and anything over 1 MB, even when the request says everything. An Actions publish stops for the fork's manual opt-in when its workflow count is zero; it never substitutes a package deploy script or gh-pages push. A deployment-status check is read-only. Agent-owned dev previews stay available while the person and queued follow-ups are still working; the agent gives stop instructions and stops them when the person is done or asks.

## Fork prework and publishing

For the workshop fork, Git, GitHub sign-in and the current Node LTS are prework. [Project dependencies](skills/workshop-setup/references/project-dependencies.md) use the project's exact package-manager pin through `npx`, with a frozen lockfile, no Corepack and no global package-manager install. The guide explains local files, shared or project-local caches, and approved cleanup.

[Prototypes](skills/prototypes/SKILL.md) keeps PRs in your own fork, sets and verifies the CLI repository choice, and never sends workshop PRs, issues or comments upstream. Make upstream sync, accounts and analytics inert before running the app. An optional short `AGENTS.md` section helps communicate that boundary but does not enforce it.

[Pages publishing](skills/publish-pages/SKILL.md) covers Vite/SPAs, PWA and worker scopes, fork Actions activation and inherited custom domains. Keep license notices, date and describe your modifications, and link the live app to its corresponding source. Present it as your fork, not an official or endorsed project. No particular app is built into these skill rules.

All nine main workflows are inline in their `SKILL.md`. Plugin references and bundled scripts are optional, not startup requirements. All three automation prompts are self-contained and use workspace data only. Their normal workspace-write and tool approvals still apply; the plugin never grants broad access. Live job-page discovery remains an explicitly requested interactive job-search task, not the scheduled template's default.

## Models, tools and cost

The instructions work with any model and can be adapted to any harness. Automatic discovery needs a skills-compatible host; plugin installation, built-in browser tools and automation templates depend on the client. A plain chat can draft a plan but cannot claim to have edited files, run tests or recorded a video. No particular model, paid research account or work account is required by these skills. The taste flow uses only its selected workspace and built-in file tools. Voice can follow the same pattern later; no voice template is included.

A starting suggestion is GPT-6.1 Terra at medium effort (low for simple file generation, like a deck file). Switch to GPT-6.2 Sol when the job is hard or Terra stalls. More capable models, extra reasoning, long context and parallel agents can cost more. The skills do not hard-code the most expensive option or change your model settings.

The plugin adds no separate service charge. Agent work still consumes your plan's usage or provider balance. A free month of GitHub Copilot Max is not unlimited usage; review your offer's redemption and renewal terms rather than assuming them from this README. Do not enable paid overage for a workshop task. See the [budget guide](skills/overnight-plan/references/budgets.md) for per-run limits and usage receipts.

Browser screenshots need no extra browser server in supported VS Code sessions. A real automatic video needs a verified recorder. The optional [video path](skills/demo-walkthrough/references/recording.md) uses existing tools first, then uses the shared outside-repo Core/encoder cache with an installed Chrome or Edge. It reuses an explicit recorder-install okay instead of asking again. It has exact Mac and Windows removal steps. The [narration guide](skills/demo-walkthrough/references/narration.md) covers local system voices and your own recorded audio. Capture and encoding can run while you work on independent files. A screenshot slideshow or a silent fallback is not the narrated-video goal.

## Scope and sources

This set adapts [Eli King's full public skills](https://github.com/eli-w-king/autonomous-output-skills). Some parts of that larger set need tools available only at Microsoft; those parts are not included here. Do not run that larger setup as a prerequisite for this plugin. For an advanced look at how Eli does it, see [his attendee miner](https://github.com/eli-w-king/autonomous-output-skills/blob/main/automations/ATTENDEES.md). It uses a much larger setup and different permissions; it is not the workshop taste path.

See the [source notes](references/sources.md) for the public methods and current product documentation. The nine names are intentional: `prototypes` is separate so a fork or PR does not become a hidden part of asking for variations. `taste` replaces the draft voice-and-taste interview so the automation, not a manual profile-building exercise, is the main path.

For checks and known limits, read [validation](tests/README.md). Clean personal-account Mac and Windows workshop rehearsals remain necessary before promising an install time or a short live-video turnaround. No license file is added by this branch; the maintainer decides the license before release.
