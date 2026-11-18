---
name: publish-pages
description: "Prepare and, only with explicit approval, publish a static project to GitHub Pages. Use for \"publish this page\", \"put my prototype online\", \"share my lab\", or \"host this case study\". Review every exposed file and repository history, explain that the site is public, verify the live result, and provide unpublishing steps."
---

# Publish to GitHub Pages

Write short, plain sentences. Do not use em or en dashes in generated copy.

Say this first: **This will put the site on the public internet. On GitHub Free, the repository must also be public.** A private source repository on another plan does not automatically make a Pages site private.

## Check the fork and license first

For an open-source app, confirm that the selected repository is the person's **public fork** and that its license permits the intended distribution. Keep the LICENSE, copyright notices and required assets' notices. Credit the original project in the fork's README and distinguish the person's changes. A public repo alone is not a reuse license. Stop if permission is unclear; do not change visibility or remove attribution.

Check the actual branches. In GitHub's fork dialog, **Copy the DEFAULT branch only** can be selected. With that choice, an upstream `gh-pages` branch is not copied. The [forking docs](https://docs.github.com/en/pull-requests/how-tos/work-with-forks/fork-a-repo) say clearing the option copies all branches. Verify the fork rather than assuming a deploy branch exists.

## Make a public-content check

1. Confirm the person owns or is authorized to publish the project. Identify the exact site folder, destination account and repository, branch and publish path. Do not guess a remote.
2. List the files to be committed and the files Pages will serve. These are not always the same: a public repository exposes other tracked files and its history, not just the site folder.
3. Inspect the candidate content and relevant history for secrets, contact information, private notes, client or employer work, unapproved logos, raw research, recordings and hidden files. Name a sensitive file without printing its secret contents.
4. Check assets and licenses, relative links, local-only URLs, analytics and forms. A password box in front of downloadable files is not access control. Never include private data behind a cosmetic password screen.
5. If content is unsafe, stop and propose a clean export of reviewed static files into a separate folder. Do not delete, rewrite history or change repository visibility automatically. For a leaked secret, have the person revoke it; deleting a file is not enough.
6. Show the exact repo, visibility, file list, public URL shape and irreversible exposure risk. Ask: **"Publish these files and this reviewed history to this public repository and GitHub Pages?"** Wait for a clear yes. Reconfirm if the scope changes.

## Publish only the approved scope

Ask before any install, send, publish, spend or delete. Do not install Git or GitHub CLI for publishing without separate approval. The GitHub website is a valid route. Do not buy a domain, upgrade a plan or enable paid services.

Follow [the publishing steps](references/publishing.md). Keep a record of the previous Pages configuration and branch before changing them. Choose the route from the actual app:

- If the built, runnable files are already committed, use branch publishing from the approved branch, commonly `main`, at `/ (root)` or `/docs`. Verify that those files contain the real app.
- If a build is needed, propose a GitHub Actions Pages workflow using the existing project's build command and output folder. Explain its commands, permissions, trigger, public artifact and possible usage cost. Add or enable it only after an explicit okay.
- If a backend is required, do not pretend Pages can host it. Explain the limitation. Never replace the real app with a screenshot recreation to claim publishing worked.

1. Prepare only approved static files. Add `.nojekyll` if the site should be served without Jekyll. Keep drafts and local helpers out of the public copy.
2. Check the repository-local commit identity. Offer a GitHub noreply address; do not change global identity.
3. Show the staged file list and diff. Commit and push only the named files to the approved repository and branch. Never use a broad `git add .` for an unreviewed folder.
4. Enable Pages for the exact branch and source folder, or preserve the repository's existing approved build workflow. Do not overwrite a working workflow to fit this guide.
5. Read the Pages deployment status and actual returned site URL. Poll with a short limit; a queued build is not a working site. If a result is ambiguous, inspect state before retrying a create or publish action.
6. Use built-in browser tools first to check that the live URL loads the actual client-side app, including its assets, navigation and main interaction at desktop and phone widths. Watch for project-subpath issues and console errors. An HTTP 200 alone is not enough.

## Hand over the link and the undo

Give both the verified live-app URL and the person's fork URL, plus the published revision, paths, checks completed and anything unverified. Keep upstream attribution visible. If deployment is still pending, say so and give the status page instead of claiming success.

Explain how to use **Settings > Pages > Unpublish site** and how to restore the prior publishing configuration. Ask before doing either. Unpublishing the website does not make the repository or its history private and cannot recall cached copies. Never delete a repository as routine cleanup. Stop your own local preview server.
