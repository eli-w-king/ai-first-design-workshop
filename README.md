# AI-First Design Workshop

A hands-on evening with UXPA Seattle. Thursday, Nov 19, 2026, 5:30 to 8:30 PM PT, in Seattle. Hosted by UXPA Seattle, with Eli King and Thoa Nguyen.

- Site: https://eli-w-king.github.io/ai-first-design-workshop/
- Event: https://luma.com/hw3533y5

An independent community event with UXPA Seattle. It isn't an official Microsoft or GitHub event.

## Preview

Node 22 or later. No packages to install.

```sh
node tools/serve.mjs --port 4179
```

Open http://127.0.0.1:4179/ai-first-design-workshop/. Add `?motion=off` for the designed still frame. Stop the server with Ctrl+C. It serves only `docs/`, including the project path that GitHub Pages uses.

The site is static. GitHub Pages publishes the committed `docs/` folder from `main`. Work on `site/v1` is a review branch, not the live site. Merging and publishing require the maintainer's approval.

## Edit and build

- `src/pages.mjs`: the six public pages and 404.
- `src/data.mjs`: public metadata, official documentation links, glossary and take-home guide titles.
- `src/run-sheet.mjs`: the nine draft guided modules and free-work links.
- `src/kit/`: the supplied fictional practice brief, slide text, six interview notes and public UX deck, copied unchanged after line-by-line review.
- `src/assets/`: shared styles, browser code, favicon and social image.
- `src/downloads/workshop-settings.jsonc`: the checked two-key snippet, copied unchanged into `docs/get-ready/`.
- `templates/page.html`: navigation, metadata, footer and shared page shell.
- `tools/build.mjs`: dependency-free static build.

```sh
node tools/build.mjs
node --test test/site.test.mjs
node tools/check.mjs
```

The full build reads course Markdown and its credential from outside this repository. By default they are in `~/Desktop/AI-First Design Workshop/Takehome-source/` and `~/.config/ai-first-design-workshop/takehome-password`. Set `TAKEHOME_SOURCE` and `TAKEHOME_PASSWORD_FILE` to other outside-repository paths if needed. Never put either input in git or pass a credential as a command-line argument.

Each module supports paragraphs, headings, simple lists, HTTPS links, inline code, bold text and fenced prompts. Raw HTML is escaped. A module needs Goal, Steps, What it costs and How to undo it sections. Keep any media public-safe and outside the course unless it is also encrypted.

If you only have the public repository, preserve the existing encrypted course while rebuilding public pages:

```sh
node tools/build.mjs --public-only
```

A full build fails before writing output if private inputs are missing. It never falls back to plaintext. Commit the generated `docs/` along with public source changes. Keep `.nojekyll`.

## The take-home lock

The build derives an AES-256-GCM key with PBKDF2-SHA256 at 600,000 iterations. A fresh encryption uses a random 16-byte salt and a random 12-byte IV. Unchanged content reuses a previous payload only after authenticating and comparing it in memory. The single payload is `docs/keep-going/course.json`.

The browser decrypts it with WebCrypto. Remembering access is opt-in and stores the derived access key in localStorage, not the entered password or lesson text. Forget access clears that key and removes the decrypted lessons from the page. A changed encryption salt invalidates remembered access. This convenience gate is not suitable for confidential material: keep the course safe to share even if access is passed on.

## Current draft items

Skola is the shared example. The fictional practice brief and nine-module run sheet are supplied, but the run sheet is still being rehearsed and is not approved by Eli. Public video slots are placeholders, and the Spanish travel deck is not supplied yet. Skola tests, type checks and builds pass on public-npm Windows, macOS and Linux runners with Node 22 and 26. Personal-laptop UI, permissions, venue Wi-Fi and live deployment remain separate rehearsal checks. Every change and PR stays in the attendee's own fork, with cloud sync disabled and no Skola sign-in. The settings and controls are checked against VS Code Insiders 1.148 and the docs, but not yet tested on a clean personal account. The public snippet contains only the two approved experimental keys. Free-month redemption, card requirement, renewal and promotional cancellation details need confirmation. The Skills page describes a plugin under separate development; installation is for after release, not an instruction to install an unpublished branch.

Public pages do not include guest data, private links, redemption codes, credentials or a street address. Review content and repository history before publishing.

## Workshop skills

[Design workshop](plugins/design-workshop/README.md) is a preview agent plugin with nine skills and three opt-in automation templates for your own projects: setup, variations, narrated demos, prototypes and PRs in your own fork, partner tests, your taste, longer-run plans, GitHub Pages, and portfolio drafts. It installs no tools or background jobs, and it asks before anything consequential. It's still in review on the `plugin/design-workshop` branch. Its README covers installing, updating and removing it.
