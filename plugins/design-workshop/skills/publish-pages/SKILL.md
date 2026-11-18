---
name: publish-pages
description: "Prepare and, only with explicit approval, publish a static project to GitHub Pages. Use for \"publish this page\", \"put my prototype online\", \"share my lab\", or \"host this case study\". Review every exposed file and repository history, explain that the site is public, verify the live result, and provide unpublishing steps."
---

# Publish to GitHub Pages

Write short, plain sentences. Do not use em or en dashes.

The complete default workflow is here. Do not open linked plugin files to start, complete or verify it. Use optional detail only when the person explicitly asks for it. Normal approvals for their files, tools and consequential actions still apply.

## Public and license check first

Say: **The site will be public on the internet. GitHub Free also requires a public repository.** A private source repository on another plan does not automatically make the site private.

Confirm the exact owned fork/repository, branch, publish folder and authorization. Read its license in the workspace; keep LICENSE, copyright/dependency notices and upstream credit. For copyleft code, preserve required licensing/source availability, add dated modification notices, and link the live app to the fork and deployed source. Present it as **my fork**, not official or endorsed. This is a practical checklist, not legal advice; stop if obligations are unclear.

List both committed files/history and served output. Look for secrets, personal/client data, unapproved assets, raw research, recordings, hidden files, drafts, dependencies and tool caches. Do not print secret values. A cosmetic password box is not access control. If unsafe, propose a reviewed clean export without deleting originals or rewriting history; leaked secrets need revocation, not just file removal.

Show the repository, visibility, files/history and intended URL, then ask to publish that exact scope. Ask separately for installs, new spending, deletion or a visibility change. Never buy a domain, change billing or contact upstream. Before opening/building the app, make upstream sync/auth/analytics inert through an approved change; block destinations before navigation and treat attempted requests as failures.

## Choose and prepare the route

- **Built files already committed:** use an existing approved branch and `/ (root)` or `/docs`. Confirm it contains the real app, not unbuilt source. A `dist/` folder is not a branch-source choice. Add `.nojekyll` if appropriate.
- **A build is needed:** review and approve a Pages workflow using the project's pinned runtime/manager, frozen lockfile, real build command and output directory. Explain scripts, triggers, permissions, artifact contents and possible Actions cost. Upload only static output, not the whole repo.
- **A backend is required:** state the limitation or an explicitly agreed static subset. Never replace the actual app with a screenshot recreation.

A default-branch-only fork may not include upstream `gh-pages`. Check actual branches. Fork Actions are disabled by default: review inherited workflows, keep unrelated or unsafe jobs disabled, then enable only the approved fork workflow and select **Settings > Pages > Source > GitHub Actions**. With approval, remove inherited CNAME/custom-domain generation from the output/workflow and check the fork's Pages setting. Do not touch upstream DNS.

An Actions flow checks out the selected revision, runs the approved build, uploads the built folder and deploys to `github-pages`. Use verified official action versions/pins, explicit build/deploy dependency and only needed `contents: read`, `pages: write`, `id-token: write` permissions. Prefer a supervised manual trigger first; adding automatic push deployment needs consent. Do not add credentials or weaken protections to bypass errors.

## Project paths and Windows

For `https://USER.github.io/REPO/`, align Vite `base: '/REPO/'` (or verified relative `./`), runtime asset URLs and router base. Preserve an existing hash router. History routing needs a tested deep-link fallback; a local preview's fallback is not automatically available on Pages.

Resolve PWA `start_url` and `scope` against the emitted manifest URL and keep both inside the project. Serve/register the service worker within that prefix, not `/`; check precache, icons and launch paths. Manifest scope is not a worker scope or network boundary. Use an isolated context first; never clear another project's workers or storage.

On Windows, prefer PowerShell for path-like variables: `$env:BASE_PATH = '/repo/'`, then `node -p "process.env.BASE_PATH"` should print `/repo/`. Use the actual prefix and only variables the build reads. In Git Bash, prefix each affected command with `MSYS_NO_PATHCONV=1`; otherwise a URL-like value can become a filesystem path. Restore prior terminal values afterward, not global profiles.

## Publish and verify

Record the prior Pages configuration and repository-local commit identity. Show the staged diff and upload only approved files to the exact fork/branch. Use the GitHub UI if CLI is absent. For a new branch-based site, an approved CLI command is `gh api --method POST repos/OWNER/REPO/pages -f 'source[branch]=BRANCH' -f 'source[path]=/'`; do not repeat it for an existing site or mistake a permission-related 404 for absence. A build workflow uses the Actions source instead.

Inspect remote state after ambiguous results before retrying. Poll deployment with a short limit and use GitHub's returned URL, not a guessed one. Open the real app with built-in browser tools, check assets, the main task, phone/desktop layout, deep-link reloads, applicable PWA/worker behavior, source/license links and zero upstream-service attempts. HTTP 200 or a successful push alone is insufficient.

Return the verified live URL and fork URL, revision, checks and gaps. If queued or failed, report that rather than success. With approval, **Settings > Pages > Unpublish site** takes it down; restore prior configuration only if wanted. This does not recall copies or privatize repository history. Never delete the repo as routine undo. Keep a development preview you started running while the person is still working in the session or queued follow-ups need it. Give its URL, port, owning terminal/process and how to stop it (Ctrl+C in that terminal or the host's stop control). One completed request is not the end of the session. Stop the preview when the person is done or asks, and never kill a process you did not start.

## Optional detail

None of these files is required above. Open one only for an explicit request for extra detail. Opening it may ask to read a file outside your workspace; that is this plugin's own folder. Check the path and request only that access, never a broad exception. Do not fetch another copy to bypass a denied read.

[Publishing details](references/publishing.md), [expanded SPA/PWA and Windows checks](references/spa-project-sites.md).
