# Budgets and longer runs

AI usage is not free just because the tools run on your laptop. Included credits are an allowance. More turns, long context, reasoning, parallel agents and retries can all increase usage.

## Before starting

Check the selected provider's current rate and account allowance. Respect an already selected model; otherwise suggest GPT-6.1 Terra at medium effort (low for simple file generation, like a deck file). Switch to GPT-6.2 Sol when the job is hard or Terra stalls. The best starting model is one the person can afford and verify, not automatically the largest one. Escalating models is another budget decision.

For GitHub Copilot, the current [billing guide](https://docs.github.com/en/copilot/concepts/billing-and-usage/individuals/billing) prices input, output and cached tokens by model, then converts the total to AI credits. One AI credit is $0.01 USD of usage value. A 30-credit cap is $0.30 of usage value, not necessarily a separate charge if included allowance remains. Rates, model availability and included credits can change; use the [live pricing table](https://docs.github.com/en/copilot/reference/copilot-billing/models-and-pricing).

A model using a separate provider account or key can have separate billing. Do not switch providers, buy credits, enable overage or increase an account budget for the person.

Reference-run measurements reported on November 18, 2026: **GPT-6.1 Terra, medium effort**, used **4.69 credits** for a taste first run and **8.15 credits** for an overnight plan. These are individual examples, not fixed prices or a promise for another input.

For an automation, set the actual model before running: select it in **New Automation** when using a template; after creation from chat, open **Automations**, set the model/effort, **Save**, then **Run now**. A model named in a prompt does not set the stored model. An unset choice can use a pricier account default.

## Use the host's controls

Prefer an enforceable session limit and a bounded task. A sentence in a prompt is not a billing control. Read the cap's documented behavior, including whether an in-flight call can finish at the limit. Set a conservative margin and stop before the cap where usage can be observed.

Recent Copilot CLI builds expose `--max-ai-credits` and `--usage-output-file`. Confirm them with `copilot --help` on the actual installed version. CLI 1.0.110-2 requires a cap of at least 30 AI credits; a smaller value is rejected before the run. For example, `--max-ai-credits 30 --usage-output-file run-usage.json` supplies a session cap and a final usage receipt; these are flags for an otherwise approved command, not permission to run arbitrary tools.

Non-interactive CLI cannot ask for normal approvals and denies actions without an allow rule. Keep any approved command or path scope narrow. Do not add an allow-all flag to get an overnight task past a permission check. If the necessary work cannot proceed within the agreed permissions, keep it supervised or leave a draft plan.

## Cost per run

There is no fixed price for a job prompt. Estimate a run as the sum of input, output and cached-token costs at the chosen model's rates, plus any separately billed tools or compute. Run one bounded supervised trial, record the host's actual usage, and use that receipt to set a conservative next-run cap. If usage is unavailable, say so; do not write $0.

Cloud execution can add compute or Actions usage depending on the product and plan. Check the current host documentation and the person's account before starting. Never imply that a Cloud run is free or that it uses a different model automatically.

Afterward report the actual credits or provider cost, the rate source and timestamp, any unmeasured usage, and whether it stayed within the approved cap. Stopping a session does not refund usage already incurred.
