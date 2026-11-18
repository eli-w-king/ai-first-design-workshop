# Vite, SPA and PWA project sites

A project site lives below a path such as `https://YOUR_USERNAME.github.io/YOUR_REPO/`, not at the host root. Use the actual fork's name and Pages URL. A working development server at `/` does not prove the built app works there.

## Align all the paths

| Piece | Check before publishing |
| --- | --- |
| Vite asset base | For a fixed project site, use the actual `/<repo>/` prefix, including the trailing slash. `base: './'` is an alternative for relocatable relative assets only when the router, generated files and PWA configuration are verified with it. Do not leave `/` simply because localhost works. |
| Generated asset URLs | Inspect the actual built HTML, lazy chunks, CSS, icons, imported files and runtime URLs. Use the project's build-base mechanism, such as `import.meta.env.BASE_URL`, rather than a second hardcoded prefix. Changing `base` does not rewrite every handwritten URL. |
| Router | Preserve an existing hash router if it works: a URL like `/<repo>/#/screen` requests the project entry page. For history routing, setting a router basename or equivalent base path does not provide a server rewrite. Pages does not automatically serve the app entry point for arbitrary deep links. Agree on and test a fallback, or an approved hash-routing change; do not silently change the routing style. |
| Manifest `start_url` | Point inside the project, for example `/<repo>/`, or `./` when the emitted manifest is at the project root. Relative values resolve against the manifest URL, not the page you happen to be viewing. Check the emitted manifest, not only its source template. |
| Manifest `scope` | Keep it inside the same project prefix and ensure the resolved `start_url` lies within it. `./` is only correct relative to the actual emitted manifest location. Manifest scope is not a network restriction or a service-worker scope. |
| Service-worker script and scope | Serve the worker under the project prefix and register it for that prefix, not `/`. The default worker scope is the script's directory; widening it normally needs a server header you should not assume Pages provides. Inspect generated worker code, registration URLs and precache paths from any PWA plugin. |
| Other PWA URLs | Check manifest `id`, icons, shortcuts, navigation fallback and other generated launch paths if present. No entry may lead to the upstream app or domain by accident. |

For an emitted manifest at `/<repo>/manifest.webmanifest`, a straightforward fixed-path configuration uses Vite `base: '/<repo>/'`, manifest `start_url: '/<repo>/'` and `scope: '/<repo>/'`, with a worker served and registered within `/<repo>/`. Replace the placeholder everywhere with the real fork name. This is a consistency example, not a universal configuration to paste over an existing app.

Follow the [Vite project-site guide](https://vite.dev/guide/static-deploy#github-pages), [manifest start URL](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest/Reference/start_url), [manifest scope](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest/Reference/scope) and [service-worker registration rules](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer/register). Keep existing hash or history behavior unless a change is approved.

## Check the production build, not a recreation

Use the actual project and its pinned package manager, approved dependency install and documented build. Do not substitute a tiny HTML facsimile for the real app. Use an existing local preview tool that serves the built output at the real project prefix. Do not assume its preview server's SPA fallback is available on Pages.

Before any navigation, confirm the approved local-only preparation and block upstream service destinations. Then check:

1. The entry URL, with its trailing slash, loads the real app and all assets.
2. Navigate to a deeper screen, copy its URL, open it in a fresh tab, then reload. Check the server response too, not only the screen left open from earlier navigation.
3. Load a lazy route and any local import/export or data task used in the demo. No sign-in, sync or analytics request goes to upstream, including from workers.
4. Inspect the manifest's resolved start URL and scope. If PWA installation is in scope, ask before installing it and confirm launch stays inside the fork. Otherwise report the install/launch check as not run.
5. Inspect the service worker's script URL, registration scope and cached asset paths. Test an update and offline behavior only if the app promises them and the person requests those checks.
6. Repeat on the real published URL. Verify the visible source link points to the fork's deployed source and the app labels itself as a fork.

Use an isolated browser context first so an old worker or cache cannot make a broken deploy look successful. If an earlier workshop version left registrations or caches, ask before removing only those belonging to this project. Never unregister every worker or clear an entire origin's storage: the same Pages hostname can serve other projects. Keep local data and the person's other installed apps intact.

A successful build, a 200 response at the root, or a working offline cache alone is not a pass. Report the exact revision and checks, including any unsupported PWA or routing behavior. Stop only the preview and browser processes you started.
