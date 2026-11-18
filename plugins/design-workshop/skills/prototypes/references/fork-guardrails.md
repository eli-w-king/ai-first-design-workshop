# Keep workshop changes in the fork

## Make hosted services inert before opening the app

A local-first interface can still initialize cloud sync, account providers or analytics on startup. A localhost URL is not proof that its requests stay local.

1. Inspect the selected code and configuration before launch: environment examples, hardcoded URLs, database/sync initialization, authentication, telemetry, service workers, install scripts and workflow steps. Do not print secret values. Never call an upstream endpoint to see what it does.
2. Propose a small local-only change and ask before applying it. Prevent remote client construction and background sync or telemetry, not merely the sign-in button. Keep local data and the intended task working. Mark unavailable cloud features honestly; do not fake a successful sign-in or sync.
3. Keep the protection active in both the design baseline and the new direction, in development and in the built app. Any explicitly requested comparison toggle must not re-enable production services. Do not put an upstream URL into a supposedly safe fallback configuration.
4. Before the first browser navigation, verify the local-only preparation from the code: steps 1 to 3 are in place, sync is removed, and any content-security policy limits requests to the app. Then open it and record attempted requests from the network log. Once the preparation is verified, don't add request interception in VS Code's built-in browser at all. Its `runPlaywrightCode` has no `URL` global, and a route handler that throws never continues or aborts the request, which leaves the page loading forever and every later browser call timing out. If another browser truly needs interception, match request URLs with `startsWith` or a regular expression, and wrap every route handler in `try`/`catch` so it always calls `route.continue()` or `route.abort()`. A monitor attached afterward cannot recall traffic already sent, so if the preparation is unverified, stop rather than launch it unprotected.
5. Exercise startup, local data changes, relevant controls and reload. There must be no attempted upstream service requests, including worker traffic. A blocked request is a failing check to fix, not proof the code is inert. Check both the development build and the production build at the planned Pages path.
6. Repeat the check on the approved live fork. Do not sign in, test credentials, subscribe to sync, or send analytics events. Preserve the request results without cookies, credentials or personal data. Stop and report unexpected traffic; do not hide the warning or claim a clean release.

An upstream source link or license credit is not an invitation to load that maintainer's live app or service. Read public source and documentation through the approved tools; do not test against their infrastructure. Adding a local data-only mode does not turn a client-side secret into something safe to publish.

## Offer a short AGENTS.md section

Ask before adding it. If the fork already has `AGENTS.md`, propose a small workshop section rather than replacing the file. Replace the placeholders with the verified fork and the approved local-only mode.

```markdown
## Workshop guardrails

- Work in MY_USERNAME/MY_FORK. Upstream is read-only.
- Before a GitHub write, verify the owner and repository. Use an explicit own-fork --repo argument. PR base and head stay in my fork.
- Never open PRs, issues or comments upstream, or notify, star or watch the original from this workshop.
- Keep upstream sync, accounts, analytics and other hosted services inert. Do not sign in or send test traffic to them.
- Use local sample data. Keep personal notes, credentials and recordings out of commits.
- Ask before installs, publication, spending or deletion. Do not broaden permissions to bypass a blocker.
- Keep the original license and notices, mark my modifications, and link a published app to its corresponding source.
```

This file is guidance to an agent, not a sandbox, firewall or guarantee that traffic is blocked. It does not replace code changes, scoped approvals or network verification. Review the actual tool actions and results.

## Undo deliberately

Record the exact local-only changes, the optional instruction section and the CLI default-repository change. Ask before restoring or deleting any of them. Do not automatically reconnect a hosted service when the workshop ends. Keep the protection in a public demo until the person deliberately chooses and is authorized to operate a different service configuration.
