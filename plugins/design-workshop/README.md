# Design workshop skills

Nine practical skills for designers working on their own laptops and projects. Explore options, build a working prototype, record it, test with a person and prepare work to share. Use the [screenshot markup loop](references/markup-feedback.md) to turn your arrows and rearranged pieces into changes in the real code. Each task can start from your own files; none depends on finishing an earlier workshop exercise.

This is a community workshop resource, not an official Microsoft or GitHub product.

**Branch preview:** this version is on `plugin/design-workshop`, not the default branch. Use the preview instructions below until a release is approved. Nothing in this plugin runs on installation.

## The skills

| Skill | What it helps you do | Try saying |
| --- | --- | --- |
| [workshop-setup](skills/workshop-setup/SKILL.md) | Check VS Code Insiders, GitHub, Git and current-LTS Node prework, then explain an approved pinned dependency install and undo. | "Check my setup. Do not install anything yet." |
| [variations](skills/variations/SKILL.md) | Build N distinct directions plus today's baseline, with one switcher and side-by-side comparison. | "Make three different directions for this screen." |
| [demo-walkthrough](skills/demo-walkthrough/SKILL.md) | Rehearse a real flow, then record a short narrated video with a local system voice or your own chosen audio. | "Make a short video of this prototype. Ask before adding tools." |
| [prototypes](skills/prototypes/SKILL.md) | Fork a real open-source project, redesign it on a branch, and prepare a before/after PR inside your own fork. | "Build this idea on a branch. Keep the current version available." |
| [pair-test](skills/pair-test/SKILL.md) | Synthesize clearly fictional interview notes for practice, or draft a test you run with a real person. | "Plan a small partner test. Drafts only." |
| [taste](skills/taste/SKILL.md) | Create a taste-skill draft from your own notes, then propose updates through the opt-in automation or on demand. | "Set up my taste from notes in this workspace." |
| [overnight-plan](skills/overnight-plan/SKILL.md) | Agree on a longer run's scope, budget, checkpoints, permissions and stop rule before it starts. | "Plan tonight's work. Do not start it yet." |
| [publish-pages](skills/publish-pages/SKILL.md) | Check a fork's license and public content, choose branch or build-workflow deployment, then verify the real app and repo links. | "Check whether this folder is safe to publish." |
| [job-search](skills/job-search/SKILL.md) | Draft a truthful case study, tailored introduction or role digest from public pages you choose. | "Turn this work into a portfolio draft." |

The [Keep my taste current](automations/keep-my-taste-current.automation.md) automation creates a first draft, then proposes updates from your selected workspace notes. It enables nothing on install. Keep its first trigger Manual and press Run now before choosing a weekly schedule. The [weekly roles digest](automations/weekly-roles-digest.automation.md) is a separate opt-in, manual template. It never applies or sends. Read its [cost and scheduling guide](references/automation-guide.md) before choosing to run or schedule it.

## What you install

Only the skill package: instructions, references, a taste-draft structure, optional recording and narration helpers and two opt-in automation templates. The helpers are inert until you choose to run them. The plugin does not install their dependencies.

- No hooks, bundled tool servers, global rules, account connections, background jobs or sync.
- No settings, permission changes, scheduled runs or paid services enabled for you.
- No silent installs, sends, publishing, spending or deletion. Each skill asks before those actions and explains what changes and how to undo it. Pair-test and job-search stay draft-only.
- No private samples or personal taste rules. You choose any material used to build your own.

These are instructions, not a security sandbox. Review tool requests and keep the host's approval and sandbox controls. Manual permissions still honor earlier approvals. Files stored locally can still be sent as context to the AI provider you selected. Use public, fictional or redacted content you are allowed to share.

## Install in VS Code

Use VS Code Insiders for the workshop, with Copilot selected as the harness. Other supported VS Code releases can load the skills too; check the actual features you need. Plugins are different from extensions.

### Preview branch

1. Run **Chat: Open Customizations** from the Command Palette.
2. In **Browse**, open the source menu, then **Configure Marketplaces > Add Marketplace**. Enter `eli-w-king/ai-first-design-workshop#plugin/design-workshop`.
3. Browse that marketplace, select **design-workshop**, review this README and its contents, then choose **Install** and approve the trust prompt if you agree.
4. If that preview UI is unavailable, use **Plugins > Browse Marketplace** if offered, or the documented local-source or CLI route below. If you choose the Settings route, **append** the workshop source to `chat.plugins.marketplaces`; never replace its array. Preserve every existing entry, including the default `github/awesome-copilot#marketplace`, and avoid duplicates. If the setting is absent, retain that default when adding the workshop source. Show the proposed change and get approval before editing.
5. Start a fresh session. Open the installed plugin's **Skills** list or type `/` to find its skills. Ask it to list the nine workshop skills, then try the read-only setup check.

If plugin support is disabled, review the host's explanation before changing anything. The checked [Get ready page](https://eli-w-king.github.io/ai-first-design-workshop/get-ready/) owns the workshop's two experimental settings, Computer Use and Send Later. This plugin links to that snippet rather than copying it. For a checked-out copy, use **Chat: Install Plugin from Source** and select its `plugins/design-workshop` folder. No global script or private fork is needed.

### After a default-branch release

Use the same steps with `eli-w-king/ai-first-design-workshop`, without the branch suffix. The documented direct install link is:

```text
vscode-insiders://chat-plugin/install?source=eli-w-king%2Fai-first-design-workshop&plugin=design-workshop
```

Use `vscode://` for the regular VS Code app. This link needs the marketplace to exist on the default branch and prompts before installing. It is not the current preview install route.

## Install in Copilot CLI

If CLI is already installed, for the current branch preview run:

```sh
copilot plugin marketplace add 'eli-w-king/ai-first-design-workshop#plugin/design-workshop'
copilot plugin install design-workshop@ai-first-design-workshop
copilot plugin list
copilot skill list
```

After a default-branch release, the standard commands are:

```sh
copilot plugin marketplace add eli-w-king/ai-first-design-workshop
copilot plugin install design-workshop@ai-first-design-workshop
```

Choose one source for this marketplace, not both at once. If already registered from another revision, inspect its current source before changing it. For local development, `copilot plugin marketplace add /ABSOLUTE/PATH/TO/REPO` reads this worktree's marketplace; do not point at the plugin subfolder for that command.

Start a fresh session and confirm all nine skills are available. Skills can load when your request matches their descriptions; choose the installed skill from the slash menu when you want to be explicit. Exact names can be qualified by the plugin in some clients.

VS Code can discover CLI-installed plugins. Avoid a duplicate installation just to make the name appear twice. The Customizations editor and chat `/plugin` commands can use separate inventories, so manage a plugin from the interface where you installed it.

## Update or remove

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

## Fork prework and publishing

For the workshop fork, Git, GitHub sign-in and the current Node LTS are prework. [Project dependencies](skills/workshop-setup/references/project-dependencies.md) use the project's exact package-manager pin through `npx`, with a frozen lockfile, no Corepack and no global package-manager install. The guide explains local files, shared or project-local caches, and approved cleanup.

[Prototypes](skills/prototypes/SKILL.md) keeps PRs in your own fork, sets and verifies the CLI repository choice, and never sends workshop PRs, issues or comments upstream. Make upstream sync, accounts and analytics inert before running the app. An optional short `AGENTS.md` section helps communicate that boundary but does not enforce it.

[Pages publishing](skills/publish-pages/SKILL.md) covers Vite/SPAs, PWA and worker scopes, fork Actions activation and inherited custom domains. Keep license notices, date and describe your modifications, and link the live app to its corresponding source. Present it as your fork, not an official or endorsed project. No particular app is built into these skill rules.

## Models, tools and cost

The instructions work with any model and can be adapted to any harness. Automatic discovery needs a skills-compatible host; plugin installation, built-in browser tools and automation templates depend on the client. A plain chat can draft a plan but cannot claim to have edited files, run tests or recorded a video. No particular model, paid research account or work account is required by these skills. The taste flow uses only its selected workspace and built-in file tools. Voice can follow the same pattern later; no voice template is included.

Start with your current model or a mid-priced option such as GPT-6.2 Sol if your host offers it. More capable models, extra reasoning, long context and parallel agents can cost more. The skills do not hard-code the most expensive option or change your model settings.

The plugin adds no separate service charge. Agent work still consumes your plan's usage or provider balance. A free month of GitHub Copilot Max is not unlimited usage; review your offer's redemption and renewal terms rather than assuming them from this README. Do not enable paid overage for a workshop task. See the [budget guide](skills/overnight-plan/references/budgets.md) for per-run limits and usage receipts.

Browser screenshots need no extra browser server in supported VS Code sessions. A real automatic video needs a verified recorder. The optional [video path](skills/demo-walkthrough/references/recording.md) uses existing tools first, then offers a small project-local Playwright installation only with your approval. It has exact Mac and Windows removal steps. The [narration guide](skills/demo-walkthrough/references/narration.md) covers local system voices and your own recorded audio. Capture and encoding can run while you work on independent files. A screenshot slideshow or a silent fallback is not the narrated-video goal.

## Scope and sources

This set adapts [Eli King's full public skills](https://github.com/eli-w-king/autonomous-output-skills). Some parts of that larger set need tools available only at Microsoft; those parts are not included here. Do not run that larger setup as a prerequisite for this plugin. For an advanced look at how Eli does it, see [his attendee miner](https://github.com/eli-w-king/autonomous-output-skills/blob/main/automations/ATTENDEES.md). It uses a much larger setup and different permissions; it is not the workshop taste path.

See the [source notes](references/sources.md) for the public methods and current product documentation. The nine names are intentional: `prototypes` is separate so a fork or PR does not become a hidden part of asking for variations. `taste` replaces the draft voice-and-taste interview so the automation, not a manual profile-building exercise, is the main path.

For checks and known limits, read [validation](tests/README.md). Clean personal-account Mac and Windows workshop rehearsals remain necessary before promising an install time or a short live-video turnaround. No license file is added by this branch; the maintainer decides the license before release.
