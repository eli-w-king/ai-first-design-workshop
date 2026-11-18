# Validation

Nothing in this folder runs on installation. These are maintainer checks, not attendee prerequisites.

From the repository root, using an existing Python installation with PyYAML and Node 22 or later:

```sh
python3 -B plugins/design-workshop/tests/validate_plugin.py
python3 -B -m unittest discover -s plugins/design-workshop/tests -p "*_test.py"
node --test plugins/design-workshop/tests/*.test.mjs
```

The first command parses every skill's YAML frontmatter, checks names and description lengths, validates package metadata and all three opt-in automation templates, resolves relative Markdown links and headings, and rejects em and en dashes. The Python unit tests reject missing or duplicate automation identities, hidden execution settings, unreviewed schedules and guide dependencies in default workflows. The Node tests cover recording-plan bounds, localhost-only read requests and narration timing that must not cut off words.

## Isolated CLI check

Use a new folder under your chosen local working folder, not your personal configuration. Give the fixture its own Git boundary for the CLI test so discovery does not inherit ancestor project skills; the attendee taste workflow itself needs no Git. Set `HOME`, `COPILOT_HOME` and `COPILOT_CACHE_HOME` to separate paths inside it and set `COPILOT_AUTO_UPDATE=false`. Keep those environment values for every command in the test. Do not change your real settings or copy personal skills or credentials into the test home.

Register the repository's absolute path with `copilot plugin marketplace add`, install `design-workshop@ai-first-design-workshop`, then inspect `copilot plugin list` and `copilot skill list`. Check all nine names, not merely the successful install message. Test update and uninstall through the same interface. Remove only the test folders you created after their scope is reviewed.

A small model trial consumes AI usage. If authorized, use a mid-priced model, a host-enforced cap, no background sync, no account integrations, and narrow read/write permissions in a fresh fixture folder. On the tested CLI, `apply_patch` is the available file-writing tool; filtering tools to nonexistent `create` or `edit` names leaves no writer. CLI 1.0.110-2 requires a session cap of at least 30 AI credits. Save the usage receipt. Never use an allow-all flag or a real project as a shortcut for the trial.

## Recording checks

Use only an existing approved browser and recording runtime, or separately approve a project-local install. Run the helper against a harmless local fixture with one input, one button and a visible result. Verify the actual WebM decodes, its dimensions, the initial and final screenshots, the pointer and the full continuous playback. Also verify a page error is reported as a failed take and that an existing output folder is not overwritten. Stop the fixture server and browser you started.

## Release limits

- A metadata and CLI install check does not prove a VS Code GUI install or an unattended schedule works.
- A recording on a prepared development machine does not prove clean personal-account Mac or Windows setup, dependency downloads or workshop timing.
- No real repository is published and no PR, job application, study, paid run or schedule is created by these checks.
- The branch preview is not a default-branch release. The maintainer reviews the public-content scan, license and workshop rehearsal before approving release.

## Checked on November 17, 2026

- Copilot CLI 1.0.110-2 accepted the local marketplace and installed all nine skills. The tests used isolated configuration and cache directories, not a person's real skill folder.
- A GPT-6.2 Sol trial generated a draft-only partner-test plan and evidence-limited fictional synthesis. No research service or contact action ran.
- Two GPT-6.2 Sol taste trials created the first local draft and a later proposal. The previous draft was preserved byte for byte, source-specific labels and links were excluded from rules, and existing personal-skill sentinels in the throwaway home stayed unchanged. No personal installation was attempted.
- The headless recorder produced an actual 1280 by 800, 10.64-second WebM. A deliberate page error failed, and an existing take could not be overwritten. Initial and final screenshots and a full-span contact sheet were inspected.
- Local macOS system speech and a supplied audio-file fixture both produced H.264/AAC narrated MP4s, with complete decoding checks. No microphone or external voice service was used. Full listening review is not claimed.
- The capture check reused an existing Chromium and Playwright Core 1.66 alpha runtime. Its expected encoder was missing, so the isolated test used an already installed full ffmpeg through a test-local path mapping. No shared cache was changed and no browser or package was installed. This proves the helper's real capture path, not a cold install of the documented stable package.
- Five focused Node checks and the YAML, metadata, relative-link and punctuation validator pass. Windows speech, clean Mac and Windows installs, the VS Code template UI and real public deployment still need a rehearsal.

## Generic fork follow-up

The fork guidance remains product-agnostic. A later check of the published package must still discover nine skills and resolve the new fork-safety, project-dependency and SPA references. The coordinator's conditional per-run-cap guidance stays unchanged.

Two targeted command checks used disposable fixtures only. `npm cache npx rm CACHE_KEY` on npm 11.21.1, in offline mode, removed one synthetic entry and preserved another; no package was downloaded. With two remotes in a throwaway Git repo, `gh repo set-default`, `--view`, and an explicit-repository `--unset` restored the local config byte for byte. Bare `--unset` failed in the noninteractive terminal, so the guide includes the repository argument. No PR, issue, comment, workflow or deployment was created by these checks.

The Vite, router and PWA guidance is based on the cited documentation. This package check does not claim a cold dependency install, a selected app's network-isolation check, a live Pages deployment or license compliance. Those require the actual approved fork and its rehearsal.

## Module-coverage follow-up, November 17, 2026

- The package contains nine skills and three automation templates. Daily cards is Manual by default and has no execution configuration in its frontmatter. Four Python unit tests cover template identity, duplicates, forbidden execution fields and reviewed schedules.
- A real validator regression was replayed in a disposable copy: the same test failed against the earlier validator because an automation without a display name was accepted, then passed with the stricter validator. The shared worktree was never reset or reverted. This verifies the validation fix, not a bug in the workshop app.
- A historical GPT-6.2 Sol trial followed the then-current CSV daily-cards template with file tools only. An independent CSV parser found ten distinct, two-field, headerless records; earlier concepts were excluded and inputs were unchanged. The review correctly said import was not verified. Usage was 7.26053 credits; no schedule or app import was created. This does not verify importer compatibility; the current default is tab-separated `.txt`.
- A technical-fixture capture overlapped independent file work while frozen input remained unchanged. Surplus final idle was trimmed from the same continuous take, then a local voiceover was added. The final 30.00-second file fully decoded, and its final frame was inspected. This was not the workshop app, did not capture app/system audio, and is not a full listening review.
- Parallel Agents-window sessions and Computer Use instructions are documented from the host guidance, not claimed as clean-account UI rehearsals. The supplied kit and actual app remain the reference run's responsibility.

## Self-contained Manual workflows

Every SKILL.md now has its complete default path inline. Relative guide/script links are confined to Optional detail and explicitly require a request for that extra depth. The validator rejects default-path file links and linked automation prompts. All three templates use workspace data only; the roles template uses saved posting copies rather than scheduled live browsing.

The permission check uses real Copilot CLI sessions with isolated homes and tiny workspaces, no allow-all paths/tools and no plugin-folder read grant. On November 18, 2026, an ordinary GPT-6.2 Sol CLI taste probe read two plugin guides without producing permission events, so it did not reproduce the reported VS Code prompt. A paired fail-closed check therefore explicitly denies built-in file reads under the registered plugin root. Keep that distinction when interpreting the results.

Read each run's persisted events.jsonl. Count permission-request events, permission-denial events, denied tool calls whose path is inside the plugin root, and all plugin-file read attempts separately. The GPT-6.2 Sol baseline produced two denied guide reads per skill for taste, variations and overnight-plan. The final inline versions made zero plugin-file calls and zero denials while producing the requested outputs. Those earlier Sol/cached-plugin checks emitted no permission-request events. Do not generalize that result to every install route or describe a deny-rule count as a measured VS Code UI-prompt count.

The candidate was registered through the documented local-marketplace route in a throwaway home; it lived outside all test workspaces, under the same explicit read-deny boundary. The published package's skill/template bytes are compared with those tested. A focused prototypes probe also checks that a requested label/spacing change lands directly in the normal entry file, without a hidden script/flag, and that a before copy remains. These file-only checks do not claim a browser or real queued-preview lifetime rehearsal.

## Model selection, plain decks and planning

Model recommendations live in automation descriptions and setup guidance, not their runtime prompts. A template's New Automation dialog must save the chosen model; after chat creation, open Automations, set the model, Save, then Run now. The prompt cannot select the model or prevent an unset configuration from using the account default.

For the current deck check, supply fictional notes including a comma-containing answer and an earlier deck. Generate ten new tab-separated `.txt` lines with exactly one literal Tab each, no header or quotation marks, and verify inputs are unchanged. A plain Tab splitter should yield ten front/back pairs. That is a file-format check, not an actual app import: only observed destination counts and sampled cards can prove import, not a Success toast.

A planning probe supplies a goal and off-limits work but leaves other details unknown. Keep command tools denied and count attempted shell calls as failures, not just commands that actually ran. Check the proposal uses labeled defaults, asks at most three essential questions, leaves facts unverified and does not start work. This does not claim a clean-account GUI Plan-mode rehearsal.

On November 18, 2026, a new paired **GPT-6.1 Terra, medium effort** check used the same local-live-plugin route for the 0.3.1 baseline and final 0.3.2 candidate. Each baseline skill (taste, variations, overnight-plan) emitted **two Manual permission requests, two denied completions and two denied guide-file calls**. Each final skill emitted **zero**, with no plugin-file calls. The explicit plugin-read deny was still present and there was no broad path approval. These are CLI event counts, not a GUI rehearsal; they differ from the earlier cached-plugin/Sol observation.

All nine Terra trials used **19.33832 credits** together, including baselines and three focused follow-ups. The deck trial used **low effort**, wrote ten valid literal-Tab `.txt` records with a comma-containing answer, excluded prior concepts and correctly left import unverified. The planning-limits probe used medium effort, proposed defaults, asked one essential question and attempted no shell call. The default-change probe preserved a before copy and changed the normal entry file without a hidden flag. Browser and actual GUI Plan-mode checks were not performed.
