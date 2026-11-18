# Fork, branch and PR guide

Commands below are examples. Replace capitalized placeholders with the reviewed values, show the command and destination, and obtain the action's approval before running it. Do not change someone else's repository.

## Fork and clone the selected project

Do not choose a workshop project on the person's behalf. Confirm the selected upstream URL, public license and intended changes. A public repository with no license is not automatically permission to reuse and redistribute its code. Keep the LICENSE and notices, and add a short README credit naming and linking to the real upstream project after the person selects it.

With approval, on GitHub choose **Fork**, check the owner and repository name, and create the person's fork. Inspect the **Copy the DEFAULT branch only** choice. When it is selected, other branches such as `gh-pages` are not copied. The [forking guide](https://docs.github.com/en/pull-requests/how-tos/work-with-forks/fork-a-repo) says clearing that choice copies all branches. Verify which branches the actual fork has; never assume a deployment branch came along.

If GitHub CLI is already installed, an explicit fork command is `gh repo fork UPSTREAM_OWNER/PROJECT --clone=false --remote=false`. Show its public destination and ask first. Then clone the person's fork separately:

```sh
git clone https://github.com/YOUR_USERNAME/YOUR_FORK.git CHOSEN_FOLDER
```

Run later commands inside that new folder. Do not clone over an existing directory. Inspect scripts and dependencies before running the project's setup, and obtain approval for any installation. Do not enable inherited Actions workflows or add secrets automatically.

## Inspect before changing files

```sh
git status --short --branch
git remote -v
git log -3 --oneline
git diff --stat
```

Do not print a remote containing embedded credentials. If you find one, stop and have the person replace it securely. Read the repo's instructions and use its actual test commands.

Agree on an existing base revision, then create the branch with `git switch -c design/IDEA BASE`. Explain that switching branches changes the files on disk. If there are unrelated edits, stop for the person to choose how to preserve them; never auto-stash, reset or clean.

For a new product idea, use a small local demo. For an existing product, keep its original behavior as the default. Test the new toggle off and on. A prototype flag is not an authorization or security boundary.

## Pin the GitHub destination

A PR from a fork targets upstream by default. In the GitHub compare form, explicitly change **base repository** to `YOUR_USERNAME/YOUR_FORK`, then choose that fork's base branch and your feature branch. Check the owner in the preview before submitting. Workshop PRs stay inside the person's own fork.

With GitHub CLI, inspect the current default first. After explaining that this changes the default GitHub API repository for this local clone, get approval and set it explicitly:

```sh
gh repo set-default --view
gh repo set-default YOUR_USERNAME/YOUR_FORK
gh repo set-default --view
```

Record the previous value or its absence. This does not change Git's remotes, and it does not select a repository for secrets commands. Continue to verify `origin`, and keep `--repo YOUR_USERNAME/YOUR_FORK` explicit on every GitHub write, including the PR command below. See [the command reference](https://cli.github.com/manual/gh_repo_set-default).

Never open PRs, issues or comments upstream from a workshop. Do not add upstream reviewers, mention the maintainer, star or watch the original as a test. Read its code and license only. Before launching the app, apply the approved [hosted-service safeguards and optional AGENTS.md section](fork-guardrails.md).

## Before/after evidence

After the hosted-service protections are verified, capture the real design baseline with those protections active, then the new state at the same size, theme and sample content. Label feature-off versus feature-on images accurately, and disclose the local-only preparation. Never reconnect an upstream service just to capture an original state. Missing evidence stays marked as missing. Keep screenshots outside the proposed commit until their contents and destination are reviewed.

Draft the PR in a private local file:

- What changed and why, in two or three sentences.
- Before and after images of the same state, with plain captions.
- How to run the project and turn the prototype toggle on and off.
- Tests that passed, checks not run and known limitations.
- Which data or behavior is simulated.
- The one next design question.

Local image paths do not magically become PR attachments. After explicit approval, either include reviewed images in a deliberate repository media folder with working links, or have the person attach them through GitHub. Do not silently upload assets to a third-party host.

## Commit, then ask before public actions

Inspect the intended files. Stage their exact paths, not the entire working folder. Show `git diff --cached --stat` and the staged diff. Follow the person's request for a local commit; do not commit unrelated changes, secrets, private notes or generated caches.

With separate approval for the repository, branch and content:

```sh
git push --set-upstream origin design/IDEA
gh pr create --repo YOUR_USERNAME/YOUR_FORK --draft --base BASE_BRANCH --head design/IDEA --title "Describe the change" --body-file pr-draft.md
```

The first command uploads code to `origin`, which must be the person's fork. The second explicitly creates a PR inside that fork, not upstream, and may notify people. GitHub and CLI can otherwise default a fork PR to upstream, so verify the base repository as well as both branch names. Inspect remote state or `gh pr list --repo YOUR_USERNAME/YOUR_FORK` if an operation times out before retrying. Do not open duplicates. Use the GitHub website if CLI is absent; do not install it automatically.

Do not use `gh pr create --dry-run` as a harmless check: the [CLI reference](https://cli.github.com/manual/gh_pr_create) says it may still push Git changes. Review the intended arguments and use read-only inspection until creation is approved.

Verify the returned PR URL, base repository, base and head branches, files, image links and checks. Give the person the fork URL and the branch URL for their portfolio, with clear upstream credit. Keep incomplete work in draft. Do not merge, mark ready, assign people, force-push or delegate to Cloud without specific approval.

## Undo without losing other work

For an uncommitted prototype, turn its toggle off or switch back only after checking for unsaved edits. For a committed change, show a proposed `git revert COMMIT` and its effect before running it. Never recommend `git reset --hard`, `git clean` or deleting the repo as cleanup. Closing a PR does not delete its public history, and removing a local branch does not remove a remote one. Each removal needs its own review.

To undo an approved `gh repo set-default` change, show the prior value and ask before restoring it with `gh repo set-default PREVIOUS_OWNER/PREVIOUS_REPO`. If there was no stored default, `gh repo set-default YOUR_USERNAME/YOUR_FORK --unset` removes this clone's choice. Include the repository argument in noninteractive terminals: the checked CLI rejects a bare `--unset` there. Do not undo it silently or assume that changing this default undoes a PR or push.
