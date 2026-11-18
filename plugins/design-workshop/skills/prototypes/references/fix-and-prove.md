# Fix it and prove it

Fix one observed bug in the real component. Do not turn the repair into a redesign, dependency upgrade or new feature.

## Reproduce before changing code

1. Confirm the expected behavior, exact steps, starting state and approved sample data. Work on the person's own branch and keep upstream services inert using [the fork guardrails](fork-guardrails.md).
2. Use the existing built-in browser tools to reproduce the bug in the actual app. Record the observed failure, relevant screenshot or error, and the revision or dirty state. Do not substitute a recreation or claim reproduction from reading the report alone.
3. Follow the event, state and data flow to the responsible component. Separate a suspected cause from one supported by the reproduction. If it cannot be reproduced safely, report that and ask for the missing condition instead of inventing a fix.

## Show a real red run

Use the smallest existing test layer that can catch the behavior: unit, component or browser regression test. Add one focused case with the expected user-visible result. Do not test a private implementation detail just because it is easy to assert.

Run that new test **before the fix**, against the unchanged application behavior. Confirm that it fails for the observed bug, not because of a syntax error, missing package, unrelated broken test or bad fixture. Record the exact command, test name, relevant failure and exit status as **Red: failed before the fix**. Never fabricate terminal output, weaken an assertion to produce a convenient result, or call an unrun test red.

If no suitable test runner exists, explain the smallest proposed addition and ask before installing it. A saved browser reproduction is useful, but do not call it a passing automated regression test until it can actually run and assert the behavior.

## Make the smallest fix

Change the cause, not the surrounding product. A bug fix corrects the existing path; do not hide the repaired behavior behind an unrelated feature flag. Keep local-only safety preparation active. Do not change other directions, rewrite the component, upgrade packages or update snapshots broadly to make the test pass.

If the fix was already made before this workflow started, do not reset or revert a shared working folder to manufacture a red run. With approval, replay the prior revision plus the new test in a disposable local copy using the existing tools and network safeguards. If that cannot be done, state that the before-fix test evidence is unavailable.

## Show green, then recheck the app

1. Run the **same regression-test command** after the fix. Record the real output and exit status as **Green: passed after the fix**. Keep the failing test's meaningful assertion intact.
2. Run the smallest relevant neighboring tests. Escalate only if the change or failures justify it. Distinguish unrelated baseline failures from failures caused by this change.
3. Reopen or refresh the actual rebuilt app and repeat the original browser steps. Check that the result, saved state if relevant, and any nearby edge case now behave as expected. Watch for a stale build or service worker hiding the real result.
4. Review the diff. It should contain the focused fix, regression test and directly related documentation only. Remove no unrelated work and contact no upstream maintainer.

## Hand over the proof

Show the two actual run summaries together:

| Evidence | What to show |
| --- | --- |
| Red | Exact command and test, baseline revision/state, the relevant assertion failure and exit status. |
| Green | The same command and test, repaired revision/state, actual passing result and exit status. |
| Browser | Original steps repeated in the real app, a truthful result screenshot, and any remaining limitation. |

Give the cause, changed files, test evidence and what was not checked. A green unrelated suite is not proof this regression is covered. Keep the change local until the person approves a PR or publication, and stop only processes you started.
