---
name: publish-pages
description: 'Publish a folder as a public page on GitHub Pages, safely: check what would become public, confirm with the person, create the repo, turn on Pages, and check the live link. Use when someone asks to publish, share, host, or put their page, lab or case study online.'
argument-hint: 'publish [folder] as [repo name]'
---

# Publish to GitHub Pages

Put a folder online as a page on GitHub Pages, so the person can share one link.

## First, what becomes public

On a free GitHub account, Pages only works from a public repo, and the page is public on the internet. Say that
plainly before anything else.

1. List every file that would be published.
2. Look for things that shouldn't be public, and show what you find:
   - client names, logos, or work under NDA, and screenshots of a former employer's product
   - email addresses, phone numbers, home addresses
   - keys, tokens, passwords
   - files that aren't part of the page (drafts, notes, large originals)
3. Ask: "This will be public on the internet. Publish these files?" Wait for a clear yes. If they want to remove
   something, do that first and ask again.

## Then publish

Ask before each step. Use the GitHub CLI if it's installed and signed in (`gh auth status`); otherwise walk the
person through the website.

1. **A repo.** If the folder isn't one yet, run `git init -b main`. Check `git config user.email`; if it's a personal
   address, suggest GitHub's private noreply address so it doesn't show on the page's history.
2. **A `.nojekyll` file** at the top of the folder, so GitHub serves the files as they are.
3. **The first commit**, with a plain message like "My case study page".
4. **The public repo.** With the CLI: `gh repo create <name> --public --source . --push`. Without it: in VS Code's
   Source Control view, **Publish Branch**, then **Publish to GitHub public repository**.
5. **Turn on Pages.** With the CLI:
   `gh api -X POST repos/<owner>/<name>/pages -f "source[branch]=main" -f "source[path]=/"`. Without it: on
   github.com, the repo's **Settings**, then **Pages**, then **Deploy from a branch**, `main`, `/ (root)`, **Save**.
6. **Wait and check.** The first build takes about a minute. Check that
   `https://<owner>.github.io/<name>/` returns HTTP 200, then open it in VS Code's built-in browser at desktop and
   phone width.

## Report

The live link, on its own line. Then how to take it down: the repo's **Settings**, **Pages**, **Unpublish site**, or
delete the repo.

## Never

- Never publish without the person's yes in this conversation.
- Never make a repo public that was private, without asking.
- Never push to someone else's repo, or open a pull request to a project they don't own.
