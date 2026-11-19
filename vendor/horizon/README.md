# Horizon kit 1.0.1

The Luma poster's ordered dither, as a living horizon on white. One kit for the site, the deck, the setup canvas and the printed signs. Copy it verbatim and keep the folder structure. Don't edit the kit's files; theme with CSS variables and pass options.

```
horizon/
  horizon.css      tokens (custom properties on :root) and base classes
  horizon.js       window.Horizon: mount, renderStill and the rest
  fonts/           Inter Display, Inter, Geist Mono (woff2) and their licenses
  print.html       a still at any size from URL parameters (+ print.css, print.js)
  demo/            site, slide-title, slide-tonight, canvas, deck-demo, course (+ demo.css and one small script per page)
  stills/          the stills and the motion clips
  tools/           check.js (stills and checks) and record.js (frame-exact clips); not needed at runtime
```

Everything runs from `file://`, with classic scripts, no modules and no network.

## Quick start

```html
<link rel="stylesheet" href="horizon/horizon.css">
<script src="horizon/horizon.js"></script>   <!-- in <head>, so motion state is set before first paint -->

<section id="hero">
  <p class="hz-label" data-hz-reveal="0.2">UXPA Seattle</p>
  <h1 class="hz-headline" data-hz-condense="0.45">AI-First<br>Design<br>Workshop</h1>
</section>

<script>
  document.fonts.ready.then(function () {
    Horizon.mount(document.getElementById('hero'), { level: 0.31, tilt: 0.58, intro: 'rise', ambient: true, interactive: true });
  });
</script>
```

The kit puts its canvas inside the host as the first child, behind the host's content. It sets `isolation: isolate` on the host, and `position: relative` only if the host is static. Mount after `document.fonts.ready`, so the headline's line boxes are final.

## API

```js
var hz = Horizon.mount(element, options);   // element or selector; returns an instance

hz.setLevel(0.2, { duration: 1400, easing: 'inOut' });   // band height, eased
hz.setTilt(0.4, { duration: 1400 });                      // slope, eased
hz.setMotion(0.15, { duration: 1600 });                   // ambient amount, 0 (still) to 1 (full arrival loop)
hz.set({ speed: 0.8, swell: 1.2 });                       // change any knob live
hz.pause(); hz.resume(); hz.replay(); hz.refresh(); hz.destroy();
hz.level; hz.tilt; hz.kind;                               // current values; kind is 'webgl' or '2d'

Horizon.renderStill(canvas, { width, height, level, tilt, cell, seed, curve, swell, glow, edge, background });
Horizon.refresh();     // re-measure every instance (call after you rescale a slide stage)
Horizon.stats();       // { frames, avgMs, maxMs, renderer } for rough performance checks
Horizon.advance(ms);   // with ?clock=manual: step the clock yourself (for frame-exact recording)
```

### Options

| Option | Default | What it does |
| --- | --- | --- |
| `level` | `0.32` | Band height as a share of the host's height, 0 to 1. |
| `tilt` | `0.55` | Slope, -1 to 1. Positive rises toward the right, where the poster's glow rises. |
| `curve` | `1.6` | How late the band climbs toward its high side. Higher keeps the low side flat longer. |
| `cell` | `7` | Cell size in CSS px. For a 1920 slide stage, use 7. Use 6 for a site hero, 5 for the canvas and 4 for strips. |
| `intro` | `'rise'` | `'rise'` plays the rise once. `'none'` shows the settled band at once. |
| `ambient` | `false` | Turns on the continuous arrival loop. Use it only on the title slide, the landing hero and the canvas welcome. |
| `interactive` | `false` | A cursor or touch lifts a soft local swell, then it eases back. |
| `seed` | `7` | Changes the band's shape and the order of the bigger moments. Same seed, same band. |
| `maxDpr` | `2` | Caps device pixel ratio. |
| `speed` | `1` | Tempo of the ambient loop. |
| `intensity` | `1` | Shimmer, condensing cells and crest light. |
| `swell` | `1` | Height of the swells. |
| `moments` | `30` | Average seconds between bigger moments (each lands within plus or minus 35%). `0` turns them off. |
| `glow` | `0.6` | Strength of the light in the high corner. |
| `edge` | `'bottom'` | `'top'` hangs the band from the top edge (course page strips). |
| `scrollLift` | `0` | The band rises by this share as the host scrolls away (the site uses `0.25`). |
| `renderer` | `'auto'` | `'auto'` tries WebGL, then 2D. `'2d'` forces the fallback. |
| `condense` | `[data-hz-condense]` in the host | Elements whose text resolves out of dither cells during the rise. |
| `onIntroEnd` | `null` | Callback after the rise. |

### Markup hooks

- `data-hz-reveal="0.4"`: fades and lifts the element in during the rise, starting at that many seconds.
- `data-hz-condense="0.5"`: the element's text condenses out of dither cells. They start in the accent color, go coarse to fine, and land as crisp ink type. The overlay covers only the text's line boxes and removes itself when it's done.
- Without motion, both show at once. A safety timer also reveals any hooked element that no instance owns after 4 seconds.

### URL parameters (for tuning live)

| Parameter | Effect |
| --- | --- |
| `?speed=0.8&intensity=1.2&swell=1.3&moments=25&seed=3` | Overrides those knobs on every instance on the page. |
| `?motion=off` | The settled still. Same as `prefers-reduced-motion`. |
| `?gl=0` | Forces the Canvas 2D fallback. |
| `?embed=1` | Adds `hz-embed` to `<html>`. The demo pages use it to remove margins and scrollbars. |
| `?clock=manual` | Freezes the clock until you call `Horizon.advance(ms)`. Used to record the clips. |

## What moves, and when

- **The rise:** title slide, landing hero and canvas welcome only, about 2.6 seconds, once. The band climbs from its high corner while the cells resolve coarse to fine (8, 4, 2, then 1 times the cell size). The headline condenses out of dither cells, from accent cells into crisp ink. A wave of light runs along the crest as it settles.
- **The arrival loop:** title slide and landing hero (`ambient: true`). It never repeats within the 20 minute arrival.
  - Slow swells morph the band's shape. Seeded noise keeps the variation long.
  - Crests catch light.
  - Cells near the crest condense and dissolve in slow patches. They shimmer as the threshold drifts, and each cell changes less than once a second, so nothing flashes.
  - Every 20 to 40 seconds a bigger moment: a wave of light rolling along the crest, or a brief swell of the whole band.
  - The canvas welcome runs a calmer version (`speed: 0.6`, `intensity: 0.7`, `swell: 0.6`, no moments).
- **Interactive:** the cursor or a touch lifts a soft local swell where it nears the band, and the cells re-dither around it.
- **Deck:** one horizon for the whole deck. It eases level, tilt and motion per slide: high and alive on the title, low and still on text slides, rising again on "Okay, let's get started". It's never redrawn from scratch.
- **Site:** the hero's band rises a little with scroll and stops when the hero leaves the screen. Course pages get a thin, still strip at the top.
- **Everywhere else:** still.
- **Pauses:** when the tab is hidden or the host is off screen (`IntersectionObserver`). It re-measures on resize and container changes (`ResizeObserver`).
- **Reduced motion and `?motion=off`:** a composed still, with every intro and reveal skipped.

## Examples

### 1. Static site hero, or a course strip

```js
Horizon.mount('#hero', { level: 0.31, tilt: 0.58, curve: 2.4, cell: 6, intro: 'none' });             // still
Horizon.mount('#strip', { edge: 'top', level: 0.62, tilt: 0.45, cell: 4, glow: 0.2, swell: 0.5, intro: 'none' }); // 40px strip
```

The landing hero is `demo/site.html` with `demo/site.js`. It uses `intro: 'rise'`, `ambient: true`, `interactive: true` and `scrollLift: 0.25`, with a flatter shape below 720px. Leave `padding-bottom` on the hero (230 to 240px) so the band never reaches the text.

### 2. A deck with a persistent horizon

See `demo/deck-demo.html` and `demo/deck.js`.
- Mount once on a layer that holds all the slides.
- Put `data-level`, `data-tilt` and `data-motion` on each slide.
- On a slide change, call `setLevel`, `setTilt` and `setMotion` with a 1400ms ease.

```js
var hz = Horizon.mount(deck, { level: 0.405, tilt: 0.66, cell: 7, intro: 'rise', ambient: true, interactive: true });
function show(slide) {
  hz.setLevel(+slide.dataset.level, { duration: 1400, easing: 'inOut' });
  hz.setTilt(+slide.dataset.tilt, { duration: 1400, easing: 'inOut' });
  hz.setMotion(+slide.dataset.motion, { duration: 1600 });
}
```

- **Slide values used:** title `0.405 / 0.66 / 1`, Tonight `0.207 / 0.57 / 0.12`, "Okay, let's get started" `0.46 / 0.42 / 0.6`.
- **Stage:** slides use a 1920x1080 stage scaled to fit. `demo/stage.js` does the scaling, and the kit re-measures on resize.
- **Keys:** Right, Space or Page Down to advance; Left or Page Up to go back.
- **Open at a slide:** `?slide=2`.

### 3. The setup canvas (a VS Code webview)

`demo/canvas.html` has no inline script and no inline styles, so it runs under a strict webview CSP. In the extension:

```ts
const kit = vscode.Uri.joinPath(context.extensionUri, 'media', 'horizon');
webview.options = { enableScripts: true, localResourceRoots: [kit] };
const css = webview.asWebviewUri(vscode.Uri.joinPath(kit, 'horizon.css'));
const js = webview.asWebviewUri(vscode.Uri.joinPath(kit, 'horizon.js'));
// <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${webview.cspSource}; style-src ${webview.cspSource}; font-src ${webview.cspSource}; script-src ${webview.cspSource};">
```

- **Copy the whole folder.** The fonts load through relative URLs in `horizon.css`, so they resolve as webview resources.
- **CSP:** the kit sets styles only through the CSSOM, which CSP allows, and needs no `data:` or `blob:` URLs. WebGL works in webviews.
- **Webview theme:** set `--hz-ground` and the body background explicitly, because VS Code's theme variables don't apply to this light design.
- **Mount on the panel:** `level 0.57`, `tilt 0.37`, `cell 5`, calm ambient. The step card sits on the glow as an opaque `hz-card`, so reading text never has motion behind it.

### 4. Print

`print.html?w=3300&h=5100&level=.32&tilt=.12` draws one still at exactly w by h pixels with the 2D renderer. The default cell is `w / 275` (12px at 3300, about 1mm at 300 dpi). Other parameters: `cell`, `seed`, `curve`, `swell`, `glow`, `edge`, and `bg` (default white).

```js
const page = await browser.newPage({ viewport: { width: 3300, height: 5100 }, deviceScaleFactor: 1 });
await page.goto('file:///…/horizon/print.html?w=3300&h=5100&level=.32&tilt=.12');
await page.waitForSelector('html[data-ready]');
await page.screenshot({ path: 'sign-11x17-300dpi.png' });                  // PNG at 300 dpi for 11x17 in
await page.pdf({ path: 'sign.pdf', width: '3300px', height: '5100px', printBackground: true }); // or a PDF
```

You can also call `Horizon.renderStill(canvas, {...})` yourself for any fallback image.

## Tokens

All on `:root` in `horizon.css`. Contrast is measured on white unless noted.

| Token | Value | Contrast |
| --- | --- | --- |
| `--hz-ink` | `#0d1014` | 19.1:1 |
| `--hz-muted` | `#464c55` | 8.7:1 |
| `--hz-subtle` | `#69707a` | 5.0:1 (AA text) |
| `--hz-accent` | `#1b6b9e` | 5.8:1 (AA text). White on it is also 5.8:1. |
| `--hz-accent-strong` | `#124874` | 9.5:1 (hover and pressed) |
| `--hz-control-border` | `#848b95` | 3.4:1 (meets 3:1 for controls) |
| `--hz-disabled-ink` on `--hz-disabled-bg` | `#5f6670` on `#eceef1` | 5.0:1 |
| `--hz-hairline`, `--hz-hairline-strong` | `#e5e8ec`, `#d5d9df` | borders only |
| `--hz-ramp-0` to `--hz-ramp-7` | `#124874` `#1b6b9e` `#2390b9` `#34abbd` `#4fc4d0` `#7ae1e3` `#89eaeb` `#c4f5f3` | fills only, never text |

- **Ramp:** colors from the poster, edge to core. The kit reads them when it mounts, so overriding the variables re-colors the band.
- **Type:** `--hz-font-display` (Inter Display, regular, `--hz-track-display: -0.035em`), `--hz-font-text` (Inter), `--hz-font-mono` (Geist Mono). Sizes run from `--hz-size-display` down to `--hz-size-label`.
- **Space and shape:** `--hz-space-1` to `--hz-space-10` (4px base). Radii `4`, `8` and `12px`. Two soft shadows.
- **Motion:** `--hz-dur-fast` 150ms, `--hz-dur` 300ms, `--hz-dur-slow` 900ms, `--hz-dur-slide` 1400ms, `--hz-ease-out`, `--hz-ease-in-out`.
- **Base classes:** `hz-base`, `hz-headline`, `hz-title`, `hz-label`, `hz-body`, `hz-lede`, `hz-mono`, `hz-button` (`--primary`, `--secondary`, `--small`), `hz-card`, `hz-rule` and `hz-focus` (a 2px accent focus ring with a 2px offset).

## Fonts and licenses

- **Inter Display and Inter:** Regular, Medium and SemiBold, from the official Inter 4.1 release (github.com/rsms/inter). SIL Open Font License 1.1. See `fonts/Inter-LICENSE.txt`.
- **Geist Mono:** latin, variable, from Google Fonts, by the Geist Project Authors (Vercel). SIL Open Font License 1.1. See `fonts/GeistMono-OFL.txt`.

## How it's drawn

- **Field:** each frame computes a small field on the CPU, one texel per cell (about 42,000 on a 1920 slide). Each texel holds density and tone.
- **WebGL:** composites the field per pixel: an 8x8 Bayer threshold for the cells, the poster ramp for color, and a bilinear smooth layer that melts the cells into continuous light at the core.
- **Canvas 2D fallback:** runs the same field and thresholds, so it looks the same.
- **Grid:** cells snap to device pixels, so there are no seams at any scale.
- **Context loss:** if the WebGL context is lost, the instance switches to 2D in place.

## Notes for the people porting it

- Load `horizon.js` in `<head>`. It adds `hz-motion` or `hz-still` to `<html>` before first paint, so hooked text doesn't flash.
- Never put reading text over a moving band. Use `ambient: false` there, or an opaque `hz-card`.
- The condensing overlay paints `--hz-ground`. Keep condensing headlines on the plain ground, not on top of the band.
- On a scaled slide stage, scale first, then mount. The kit re-measures on window resize. Call `Horizon.refresh()` after any other transform change.
- Two instances can share a page (the Tonight slide uses one for the page and one inside the main card). Keep it to a few per page.
- Tuning for tomorrow: open the title slide with `?speed=0.8&intensity=1.2&swell=1.2&moments=24` and adjust by eye. The defaults live in `Horizon.defaults`.

## Stills and motion clips

`stills/` has:
- the seven stills: `site-desktop`, `site-phone`, `slide-title`, `slide-title-motion`, `slide-tonight`, `canvas` (with "AI-First Design" selected) and `canvas-narrow`
- `deck-demo-1.png` to `deck-demo-3.png`
- `motion-title-30s.mp4`: the title slide's rise and arrival loop. A bigger moment, a light wave along the crest, lands at about 22 seconds.
- `motion-hero-15s.mp4`: the landing hero, with a cursor lifting the band in the second half.
- `motion.mp4`: the first 8 seconds of the title clip.

The clips were recorded headlessly with `?clock=manual`, one frame every 1/30 s, so they show the real timing even though headless rendering is slower than real time.

To re-record after tuning, run `node tools/record.js title` or `node tools/record.js hero`. It needs Playwright and ffmpeg; the script points at the Playwright install on this Mac. `node tools/check.js` re-shoots the stills and re-runs the checks.

## Checks (Thu Nov 19, 12:35 AM PT, headless Chromium 1.61 on this Mac)

- **Coverage:** every demo page and `print.html` was loaded in five modes: motion on, `?motion=off`, reduced motion, `?gl=0` and `?embed=1`.
  - The site ran at 1440x900 and 390x844, the slides and deck at 1920x1080, and the canvas at 560x860, 360x700 and 720x1000.
  - Result: zero page errors and zero console errors or warnings, no sideways scroll, and nothing left hidden after the intro. The panels never scroll.
  - The one console message ignored is Chromium's "GPU stall due to ReadPixels", which headless screenshots of a WebGL canvas cause.
- **Renderers:** WebGL rendered in headless through SwiftShader, and `?gl=0` rendered the 2D fallback. Both look the same.
- **Frame time (rough):**
  - The kit's own work per frame (field and render submit) averaged 0.65 ms with WebGL and 1.4 ms with 2D on the 1920x1080 title slide. The worst frame was 3.5 ms.
  - In headless, software WebGL composited at about 24 to 28 fps, which is the cost of software compositing. The 2D path held 60 fps in the same environment.
  - I couldn't watch it live on a real GPU, so please confirm 60 fps on the MacBook and the Windows laptop. If a machine struggles, mount with `renderer: '2d'` or a larger `cell`.
- **Contrast:** the numbers are in the token table above.

## Changelog

- **1.0.1:** fixed an intro that could fail to start. The first frame's time step could be negative, which left the band empty and hooked text invisible. If you copied 1.0.0, copy `horizon.js` again and remove any watchdog that calls `replay()`. Also clamped the condensing overlay to its own element, so it never nicks the label above.
- **1.0.0:** first release.
