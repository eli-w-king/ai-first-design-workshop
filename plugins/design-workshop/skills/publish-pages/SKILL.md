---
name: publish-pages
description: "Prepare and, only with explicit approval, publish a static project to GitHub Pages. Use for \"publish this page\", \"put my prototype online\", \"share my lab\", or \"host this case study\". Review every exposed file and repository history, explain that the site is public, verify the live result, and provide unpublishing steps."
---

# Publish to GitHub Pages

Write short, plain sentences. Do not use em or en dashes.

The complete default workflow is here. Do not open linked plugin files to start, complete or verify it. Use optional detail only when the person explicitly asks for it. Normal approvals for their files, tools and consequential actions still apply.

A clear request or an explicit okay approves the named actions, targets and scope. Do not ask again for the same approval. State the plan briefly and proceed; ask only about a genuinely missing consequential detail or a changed scope. This does not bypass host/OS permission prompts, change permission levels, authorize unrelated installs or new charges, or grant access to another account.

## A deployment check is read-only

If asked to **check a deployment and give the live link**, including a Send Later request, do only that. Use the already known own-fork identity and read-only GitHub Pages/Actions queries, then inspect the returned public URL with browser tools. No file edits, Git checkout/fetch/commit/push, PR/merge, build, workflow dispatch or settings changes. Do not repair a failure as a hidden extra action. This keeps the check from colliding with an active shipping session.

Use explicit own-fork targets for reads too. A Pages API 404 may mean missing permission rather than no site; check the available repository/deployment evidence without changing permissions. Return verified live/repo links and status, or a clear pending/failed/unavailable result. Do not guess a successful URL or claim HTTP 200 alone proves the real app works. End the status-only task here.

## Fork Actions gate before publishing

Before publishing the fork, read `gh api repos/OWNER/REPO/actions/workflows` with the explicit own-fork identity. If `total_count` is **0**, stop with this one instruction:

> Open your fork on GitHub, go to Actions, click 'I understand my workflows, go ahead and enable them', then tell me to continue.

That fork opt-in registers inherited workflows and has no API replacement. An enable call to an unregistered `deploy.yml` returns 404; do not loop on it. If the button is absent, report that rather than guessing another route. Recheck the workflow count after the person continues.

Never improvise with the package's deploy script, a `gh-pages` push or a step that writes a CNAME. Offer a branch deployment only when the person explicitly asks for it, with built files and no inherited upstream domain. A failed Actions path is not consent for that alternative.

## Public and license check first

Say: **The site will be public on the internet. GitHub Free also requires a public repository.** A private source repository on another plan does not automatically make the site private.

Confirm the exact owned fork/repository, branch, publish folder and authorization. Read its license in the workspace; keep LICENSE, copyright/dependency notices and upstream credit. For copyleft code, preserve required licensing/source availability, add dated modification notices, and link the live app to the fork and deployed source. Present it as **my fork**, not official or endorsed. Use the original project name from the request/repository and the person's own supplied name and requested date in a note such as "My fork of PROJECT, modified by NAME on DATE. Not official PROJECT." Add a visible source link and preserve the original credit. If no display name was supplied, use their verified account name/handle, never the workshop author's name. Never copy a helper's personal attribution into an attendee fork. This is a practical checklist, not legal advice; stop if obligations are unclear.

List both committed files/history and served output. Look for secrets, personal/client data, unapproved assets, raw research, recordings, hidden files, drafts, dependencies and tool caches. Do not print secret values. A cosmetic password box is not access control. If unsafe, propose a reviewed clean export without deleting originals or rewriting history; leaked secrets need revocation, not just file removal.

Show the repository, visibility, files/history and intended URL. A clear request to publish this own fork already approves that scope; do not ask again. A repository visibility change or newly discovered sensitive content still needs a separate decision. Ask separately for installs, new spending, deletion or a visibility change. Never buy a domain, change billing or contact upstream. Before opening/building the app, make upstream sync/auth/analytics inert through an approved change; block destinations before navigation and treat attempted requests as failures.

## Choose and prepare the route

- **Explicitly requested branch deployment, with built files already committed:** use an existing approved branch and `/ (root)` or `/docs`. Confirm it contains the real app, not unbuilt source. A `dist/` folder is not a branch-source choice. Add `.nojekyll` if appropriate.
- **A build is needed:** review and approve a Pages workflow using the project's pinned runtime/manager, frozen lockfile, real build command and output directory. Explain scripts, triggers, permissions, artifact contents and possible Actions cost. Upload only static output, not the whole repo.
- **A backend is required:** state the limitation or an explicitly agreed static subset. Never replace the actual app with a screenshot recreation.

A default-branch-only fork may not include upstream `gh-pages`. Check actual branches. After the fork opt-in above, review the registered workflows and keep unrelated or unsafe jobs disabled. Select **Settings > Pages > Source > GitHub Actions** for a build-based app. Choosing Deploy from a branch for unbuilt application source can show a blank page; it is not an automatic fallback. With approval, remove inherited CNAME/custom-domain generation from the output/workflow and check the fork's Pages setting. Do not touch upstream DNS.

An Actions flow checks out the selected revision, runs the approved build, uploads the built folder and deploys to `github-pages`. Use verified official action versions/pins, explicit build/deploy dependency and only needed `contents: read`, `pages: write`, `id-token: write` permissions. Prefer a supervised manual trigger first; adding automatic push deployment needs consent. Do not add credentials or weaken protections to bypass errors.

## Project paths and Windows

For `https://USER.github.io/REPO/`, set Vite `base: '/REPO/'` (or a verified relative `./`). Preserve an existing hash router and keep its basename `/`: only asset URLs move, not routes. History routing needs a tested deep-link fallback; a local preview's fallback is not automatically available on Pages. The base doesn't rewrite everything, so search the source for root-based URLs: images or files written as `/name.png` in components (use `import.meta.env.BASE_URL` or an import) and plain `<a href="/...">` links (use the router's links). Remove `predeploy` or add-domain scripts that publish the original project's domain.

Keep one manifest and one service worker. If the PWA plugin and `public/` both provide a manifest, keep one, for example `public/manifest.json` with `start_url` and `scope` set to `./` and the plugin's `manifest: false`. When the plugin builds the worker, remove extra manual registrations such as `/sw.js`, and check that no worker imports a sync or analytics script. Resolve `start_url` and `scope` against the emitted manifest URL and keep both inside the project. Serve/register the service worker within that prefix, not `/`; check precache, icons and launch paths. Manifest scope is not a worker scope or network boundary. Use an isolated context first; never clear another project's workers or storage. Before publishing, check a production build served at the project path: it loads online, reloads offline after one visit, installs as an app, and makes no requests to outside services the person didn't approve.

On Windows, prefer PowerShell for path-like variables: `$env:BASE_PATH = '/repo/'`, then `node -p "process.env.BASE_PATH"` should print `/repo/`. Use the actual prefix and only variables the build reads. In Git Bash, prefix each affected command with `MSYS_NO_PATHCONV=1`; otherwise a URL-like value can become a filesystem path. Restore prior terminal values afterward, not global profiles.

## Publish and verify

Apply the same app-only commit/PR check before upload: exclude recordings, videos, tool caches, dependencies and changed files over the requested limit, 1 MB by default. Keep Git writes with the shipping coordinator. Record the prior Pages configuration and repository-local commit identity. Show the staged diff and upload only approved files to the exact fork/branch. Use the GitHub UI if CLI is absent. For a confirmed new Actions-based site, the approved request can use `gh api --method POST repos/OWNER/REPO/pages -f build_type=workflow`. An existing site needs its appropriate update operation, not a repeated create call. The same choice is **Settings > Pages > Source: GitHub Actions**. Do not mistake a permission-related 404 for absence. A branch source is a separately requested route for already built files, never a package-deploy or CNAME workaround.

Inspect remote state after ambiguous results before retrying. Poll deployment with a short limit and use GitHub's returned URL, not a guessed one. Open the real app with built-in browser tools, check assets, the main task, phone/desktop layout, deep-link reloads, applicable PWA/worker behavior, source/license links and zero upstream-service attempts. HTTP 200 or a successful push alone is insufficient.

Return the verified live URL and fork URL, revision, checks and gaps. If queued or failed, report that rather than success. With approval, **Settings > Pages > Unpublish site** takes it down; restore prior configuration only if wanted. This does not recall copies or privatize repository history. Never delete the repo as routine undo. Keep a development preview you started running while the person is still working in the session or queued follow-ups need it. Give its URL, port, owning terminal/process and how to stop it (Ctrl+C in that terminal or the host's stop control). One completed request is not the end of the session. Stop the preview when the person is done or asks, and never kill a process you did not start.

## Optional detail

None of these files is required above. Open one only for an explicit request for extra detail. Opening it may ask to read a file outside your workspace; that is this plugin's own folder. Check the path and request only that access, never a broad exception. Do not fetch another copy to bypass a denied read.

[Publishing details](references/publishing.md), [expanded SPA/PWA and Windows checks](references/spa-project-sites.md).
