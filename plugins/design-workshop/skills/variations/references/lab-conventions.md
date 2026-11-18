# Lab conventions

Use the existing project. A lab isolates one decision without turning the rest of the product into a different design.

## Files

For a small standalone page, create a new `labs/<question>/` folder with `index.html`, `v0/` when there is a real baseline, `v1/` through `vN/`, `stills/`, `manifest.json` and `README.md`. Do not replace the project's existing `index.html`. In an app, use its component and route conventions instead.

Keep the original content and asset names. If a prototype needs fictional content, label it in the notes. Do not fetch live customer data or invent research to fill the page. A screenshot baseline is a labeled still, not a reimplemented claim about today's behavior.

## One review page

| Control | Contract |
| --- | --- |
| `?v=0` | Today's version, when supplied. Never count it among N new directions. |
| `?v=1` and other ids | Open a stable, named direction directly. Unknown ids fall back to a real available id with a clear label. |
| Previous and next buttons | Work with keyboard and touch, with visible focus and accessible names. |
| `[` and `]` | Step directions only when focus is not in an input, textarea, select or editable area. Ignore modified keystrokes and embedded mode. |
| Compare | Choose two directions, including Today. Show them at the same logical viewport and task state; stack on narrow screens. Do not squeeze a desktop layout until it looks like a phone. |
| `?motion=off` | Show still, final states with the same content and usable controls. Combine it with system `prefers-reduced-motion`. No looping canvas, CSS or script animation remains. |
| `?embed=1` | Hide the lab controls and shortcuts so comparison frames do not contain duplicate switchers. Keep the product controls and accessible content. |

Preserve shared task state where the designs have equivalent states. If a direction uses a different flow and cannot preserve it, reset with an explicit label rather than comparing hidden different outcomes. Keep the selected id in the URL so reload, history and copied links work.

Scope styles to the variant root or isolate them in separate frames. Reuse shared content and tokens; do not let one variant's CSS leak into the baseline. Relative asset paths must work when the lab lives under a repository subpath.

## Small manifest

Use strings for ids. Record only files that exist. Set missing still paths to `null`; do not invent screenshot evidence.

```json
{
  "question": "Which structure makes the primary task clearer?",
  "baseline": "0",
  "picked": null,
  "sourceRevision": null,
  "directions": [
    { "id": "0", "name": "Today", "kind": "interactive", "path": "v0/index.html", "idea": "The unchanged version", "desktopStill": null, "phoneStill": null },
    { "id": "1", "name": "Task first", "kind": "interactive", "path": "v1/index.html", "idea": "Put the next action before supporting detail", "desktopStill": null, "phoneStill": null }
  ]
}
```

This is a format example, not a supplied project or completed result. Set `baseline` to `null` if none exists, or `kind` to `reference-image` for a still. Add all requested directions. The review page should use local data directly when opened from a file, or the project's existing local server; do not add a server dependency just to fetch this manifest.

## Checks

- Desktop: 1440 by 900 and 1280 by 800. Tablet: 820 by 1180. Phone: 390 by 844.
- Every id loads; no clipped text, accidental sideways scrolling, missing assets or console errors.
- The primary task works with pointer and keyboard. Focus remains visible, Escape closes dismissible UI and returns focus, and controls have names. Aim for 44 CSS pixel touch targets.
- Compare shows matching content and viewport, direct links survive reload, and shortcuts do not capture typing.
- Both `?motion=off` and system reduced motion stop nonessential motion without removing content.
- Open and inspect the saved desktop and phone stills for every id. Automated checks alone are not a visual review.

Write opening steps, content sources, the differences and trade-offs, results actually checked, gaps, and integration instructions in the lab README. Record the source revision when one exists. A pick should reuse that exact version; keep the review controls out of the product. Ask before moving or deleting files.
