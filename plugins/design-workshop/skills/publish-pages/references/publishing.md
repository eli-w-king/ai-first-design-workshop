# Publishing a reviewed static page

This guide starts after the person approves the exact repository, public content and publishing scope. Before each external change, show what will happen and wait for approval unless that exact action was already approved in the current plan. Never treat a generic "share it" as permission to expose a whole repository.

## Select the app's actual deploy route

Before publishing a fork, confirm its public visibility, the license's distribution conditions, the retained LICENSE and notices, and upstream credit in its README. If permission is unclear, stop. Do not relabel an unlicensed public repository as open source.

Inspect the fork's branches. GitHub's **Copy the DEFAULT branch only** option copies only that branch when selected. The [forking guide](https://docs.github.com/en/pull-requests/how-tos/work-with-forks/fork-a-repo) says clearing it copies all branches. Do not assume the upstream `gh-pages` branch exists in the fork, and do not copy it over without review.

**Built files already committed:** use **Deploy from a branch**, an existing approved branch such as `main`, and `/ (root)` or `/docs`. Confirm that the selected folder contains the real app's entry point and assets, not source that needs compilation. GitHub allows any existing branch, but the folder choices are only root or `/docs`; a `dist/` folder is not a branch-source choice.

**Build needed:** propose a workflow, do not add it silently. Read the project's existing lockfile, build scripts, required runtime and output path. Use the [current GitHub Pages workflow guide](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages) and the [publishing-source guide](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site). Show the complete proposed file and ask before writing, pushing or enabling it.

A reviewed workflow normally checks out the selected revision, sets up the project's supported runtime, installs from its lockfile, runs its real build, uploads only the built static folder with `actions/upload-pages-artifact`, then deploys with `actions/deploy-pages`. Use current supported action versions or verified commit pins from their official repositories, not guessed versions. Keep build and deploy dependencies explicit with `needs`, use the `github-pages` environment, and request only the required `contents: read`, `pages: write` and `id-token: write` permissions. Explain that these permissions allow deployment.

Start with a manual `workflow_dispatch` trigger if the person wants a supervised first publish. Add push triggers only for the approved branch and with approval, because later pushes would then publish automatically. Do not deploy from arbitrary pull requests, enable unrelated fork workflows, add credentials or weaken protections. Review any runner or Actions usage cost. Once approved, select **GitHub Actions** as the Pages source, run the reviewed workflow and inspect its build and deployment jobs.

If the app needs a server backend, identify what cannot work on static hosting. Do not swap in a fake interface or say the app is fully hosted when only a limited static subset works. Any reduced-scope version must be explicit and separately agreed.

## Prepare a clean public copy

Prefer a separate export folder when the project contains private notes, research or old history. Copy only files reviewed for publication; keep originals unchanged. The public copy needs the real app's built entry page, actual assets, LICENSE and required attribution, not a whole workspace, dependency directory or recording-tool cache. Do not sever upstream credit or present the fork as your original application.

Check links with a repository subpath, for example `/my-prototype/`, not just at localhost's root. Root-relative links such as `/styles.css` often break on project Pages sites. Use relative paths or the build tool's existing base-path setting. Do not add a backend to make a static host work.

If creating a new local repo, confirm its branch name and run `git init -b publish/site` in the clean export folder, not in a parent project. Review repository-local identity and add `.nojekyll` if appropriate. Stage exact approved paths and inspect the diff before a local commit.

## Website route, without more tools

1. On GitHub, the person creates the approved repository and chooses public visibility, understanding that the files and commit history will be visible.
2. They upload only the reviewed static files, preserving directories, or use VS Code Source Control to push the approved branch. Do not use a whole-folder upload without checking hidden and unrelated files.
3. Open **Settings > Pages**. For a plain static site, select **Deploy from a branch**, the approved branch, and `/ (root)` or `/docs`, then save. For an existing build workflow, use its documented route instead.
4. Read the deployment status and GitHub's actual site URL. Wait for a successful build, then verify the live result.

## Existing CLI route

Check `git --version`, `gh --version` and `gh auth status` without extracting credentials. Replace `OWNER`, `REPOSITORY` and `BRANCH` below with reviewed values. Commands are examples, not an unattended script.

Inspect an existing repo with `gh repo view OWNER/REPOSITORY --json nameWithOwner,isPrivate,url,defaultBranchRef`. Confirm that it is the person's intended destination. Do not change a private repo to public without a separate full-history review and explicit permission.

Creating a public repository and pushing are separate changes:

```sh
gh repo create OWNER/REPOSITORY --public
git remote add origin https://github.com/OWNER/REPOSITORY.git
git push --set-upstream origin BRANCH
```

Do not run `remote add` if `origin` already exists. Review the current remote instead. Do not replace it automatically, use `--force`, or bundle creation and upload in a command that hides the exposure.

Before enabling Pages, read `gh api repos/OWNER/REPOSITORY/pages`. A 404 can mean missing permissions, not only a missing site; distinguish that from an authorization failure. Preserve an existing configuration.

For a new, approved branch-based site:

```sh
gh api --method POST repos/OWNER/REPOSITORY/pages -f 'source[branch]=BRANCH' -f 'source[path]=/'
```

For a configuration change to an existing site, use the [documented update endpoint](https://docs.github.com/en/rest/pages/pages#update-information-about-a-github-pages-site) after approval rather than repeating creation. Do not change repository visibility or workflow permissions to bypass an error.

## Verify once, then inspect state

Read `gh api repos/OWNER/REPOSITORY/pages` and the deployment or Actions status. Use the returned `html_url`, not a guessed address, especially for custom domains and account-level sites. Poll for up to five minutes, not forever. If it is still queued or failed, report that state and its link.

Use built-in browser tools first to open the actual URL and exercise the real app's main task at desktop and phone widths. Record that verified app URL next to the fork URL; a source repo page or static screenshot is not the live application. Verify asset requests, internal links, any `?v=` routes, reduced motion and console errors. Do not say "published and working" based only on a successful push or HTTP 200.

## Take it down

With approval, use **Settings > Pages > Unpublish site**. Restore the recorded prior configuration only if the person wants it restored. Removing a Pages deployment does not remove the public repository, commits, forks, downloads or cached copies. Never delete the repository as a routine undo step. GitHub's [Pages guide](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site) explains supported sources and account requirements.
