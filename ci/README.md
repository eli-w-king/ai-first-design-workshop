# Skola workshop check

This branch only checks the workshop's prep for its example project, [Skola](https://github.com/h16nning/skola), on
GitHub's Windows, macOS and Linux runners with Node 22 and the current Node LTS.

The workflow clones Skola at a pinned commit, applies the five prep patches in `ci/skola-patches/`, installs from
public npm, then runs the tests, the type check and a project-site build at `/skola/`. It never deploys anything,
opens no pull requests or issues on the upstream project, and doesn't contact Skola's sync service.

The patches:

1. `01-local-only.patch`: turns cloud sync off, so everything stays in your browser.
2. `02-project-pages.patch`: makes the build work at `username.github.io/skola/`, and removes the upstream custom
   domain step.
3. `03-attribution.patch`: a dated "modified by" note, the license and a source link, as the AGPL asks.
4. `04-agent-guardrails.patch`: an `AGENTS.md` that keeps agents working in your own fork.
5. `05-manifest-and-hash-links.patch`: relative app manifest paths and hash-safe links.

Skola is licensed under the AGPL-3.0. This workshop isn't affiliated with or endorsed by the Skola project.
