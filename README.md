# AI-First Design Workshop

Materials for the AI-First Design Workshop, with UXPA Seattle: Thursday, Nov 19, 2026, 5:30 to 8:30 PM PT, in person in Seattle. Hosted by Eli King and Thoa Nguyen.

The site: https://eli-w-king.github.io/ai-first-design-workshop/

Event page: https://luma.com/hw3533y5

Materials are coming soon.

This is a UXPA Seattle community workshop. It isn't an official Microsoft or GitHub event.

## What's here

- `docs/` is the site, published with GitHub Pages from the `main` branch.
  - `docs/index.html` is the home page.
  - `docs/assets/site.css` styles every page. `docs/assets/dither.js` draws the one dithered moment on a page.
- `templates/page.html` is the starting point for a new page.

## Add a page

1. Copy `templates/page.html` to `docs/<name>.html`.
2. Fill in the title, the nav link marked `aria-current`, and the content.
3. Add a link to the new page from the home page and from the nav in every page.

Pages are plain HTML, so there's nothing to install or build. To preview, open `docs/index.html` in a browser, or run `python3 -m http.server --directory docs` and open http://localhost:8000.

## Workshop skills

[Design workshop](plugins/design-workshop/README.md) is a preview plugin with nine skills for your own projects: setup, variations, real demo videos, prototypes and PRs, partner tests, personal taste, longer-run plans, GitHub Pages, and portfolio or role-digest drafts. It installs no tools or background jobs and asks before consequential actions.

The preview lives on `plugin/design-workshop`. Follow the plugin README for branch-specific installation in VS Code or Copilot CLI, updates, removal and cost guidance. Default-branch install links are not ready until the preview is approved for release.
