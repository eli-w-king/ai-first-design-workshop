# AI-First Design Workshop

The site for the AI-First Design Workshop with UXPA Seattle: Thursday, November 19, 2026, 5:30 to 8:30 PM, in person in Seattle, with Eli King. The setup, the course (17 modules: the intro, the Excalidraw case study, the setup, the use case and what to do on your own time), cheat sheets, a FAQ and an uninstall guide.

Live at **https://eli-w-king.github.io/ai-first-design-workshop/**

An independent community event with UXPA Seattle. Not an official Microsoft or GitHub event.

## Build and preview

Plain static HTML, CSS and a little JavaScript, built by one Node script with no dependencies. Needs Node 20 or newer.

```sh
node build.mjs                   # build dist/ from content/
node tools/serve.mjs --port 4806 # preview at http://localhost:4806/
node tools/check.mjs             # headless checks and screenshots (see below)
```

Every build writes `work/build-report.md`: the pages, the videos it found, the wall and anything it left out.

GitHub Actions builds and publishes `main` to GitHub Pages (`.github/workflows/pages.yml`).

## Where things are

| Path | What's there |
|---|---|
| `build.mjs` | The generator |
| `content/pages/` | One Markdown file per page. `index.md` is the home page, `agenda.md` the unlisted run of show |
| `content/pages/modules/` | The course, one file per module |
| `content/course.json` | The course's order, in three groups. Numbers, file names, the sidebar and the pager follow it |
| `content/site.json` | The header, the home page's hero and the footer |
| `content/videos.json` | The video for each module and the uninstall page |
| `content/data/` | The workshop settings and the setup prompt (copied as they are into the setup page), and the pull request snapshot |
| `content/wall/`, `content/intro/` | Images and clips the pages use |
| `vendor/horizon/` | The Horizon kit, the workshop's visual identity, copied as is by `tools/sync-horizon.mjs` (never edit it here). The build publishes its runtime files to `assets/horizon/` |
| `src/assets/theme.css` | Every color, font, size, radius, shadow and motion value, taken from the kit's tokens |
| `src/assets/site-horizon.js` | Mounts the kit: the home page's hero (with a pause button) and the strip on inner pages |
| `src/assets/site.css` | The layout. It only uses the theme's values |
| `src/assets/site.js` | Copy buttons, the phone menu, the wall's clips |
| `src/flow.mjs` | The "How I work right now" diagram |
| `tools/` | The preview server, checks, screenshots, the pull request snapshot and the diagram export |
| `vendor/marked.esm.js` | Markdown parser ([marked](https://github.com/markedjs/marked), MIT) |

## Writing pages

A page is Markdown with front matter (`title`, `description`, and for modules `short`). In a module, `## Why` becomes the lead under the title. Pages link to modules by name, so links survive a reorder: `[Demo videos](module:demo-videos)` links to that module, `{n:demo-videos}` is its number and `{n}` is the page's own. A module can set `out:` for a fixed file name (the setup is `setup.html`).

- ```` ```text ```` is a prompt with a copy button. `label="Prompt 1"` names it, and `file=data/setup-prompt.txt` takes its text from that file, exactly.
- ```` ```sh ```` and the other code languages are code with a copy button.
- ```` ```flow ```` draws the diagram (`src/flow.mjs`), with its alt text and legend.
- ```` ```wall ```` is the wall of tiles on the Intro: `label`, `mark`, `still` or `loop` with its `poster`, `alt`, `text`, `link: url | label`.
- ```` ```prs ```` lists the pull request snapshot. ```` ```clock ```` is a list of times. ```` ```callout ```` is a short note with a title. ```` ```figure ```` is one screenshot with a caption.
- `## Heading {#id}` sets a heading's id, and `## Heading {collapsed}` starts a section closed. A `<!-- collapsed: label -->` comment puts the rest of its section in a closed disclosure.

## The look

The identity is the Horizon kit, the light version of the UXPA Seattle poster: `vendor/horizon/` holds it exactly as it was made (minus its `tools/` and `stills/`), with `vendor/horizon-sync.json` recording each file's hash. To update it, rerun:

```sh
node tools/sync-horizon.mjs <the kit's folder>
```

Theme through the kit's custom properties (`--hz-*`), which `src/assets/theme.css` maps to the site's own, and pass options when mounting (`src/assets/site-horizon.js`). The home page's hero has the kit's rise, arrival loop, cursor swell and scroll lift, with a pause button, and its height is capped so reading text never sits on the moving band; inner pages have a thin, still strip at the top. Reduced motion and `?motion=off` show the still frame.

## Videos

`content/videos.json` maps each module (by name) and `uninstall` to a file in `content/videos/`, with its captions (`.vtt`, which also becomes the transcript at the end of the page) and a note on what's real in it. Until the `.mp4` is there, the page shows nothing where the video goes. Keep each file under 100 MB.

## This in practice

The Intro lists Eli's pull requests in public repositories, from `content/data/prs.json`. To refresh it:

```sh
node tools/refresh-prs.mjs
```

It searches with the GitHub CLI, then checks every repository without signing in, so only public ones are kept. Pull requests closed without merging are left out.

## Checks

`node tools/check.mjs` opens every page in headless Chromium at 1440x900 and 390x844 and saves full-page screenshots in `work/shots/`. It fails on sideways scrolling, broken images, console errors, a missing link target or anchor, a copy button that copies anything but its block's exact text, low text contrast, any em or en dash, and an agenda page that's listed or indexable. `--external` also checks every outside link.

## Credits

- [Excalidraw](https://github.com/excalidraw/excalidraw) is open source under the MIT license. We're not affiliated with the Excalidraw team.
- [Inter](https://github.com/rsms/inter) and [Geist Mono](https://github.com/vercel/geist-font), SIL Open Font License 1.1 (licenses in `vendor/horizon/fonts/`).
- Icons: [Codicons](https://github.com/microsoft/vscode-codicons), CC BY 4.0.
