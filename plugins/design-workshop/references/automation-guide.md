# Optional automation templates

For the workshop taste exercise, use [Keep my taste current](../automations/keep-my-taste-current.automation.md) and [the taste folder guide](../skills/taste/references/getting-started.md). It reads only its workspace, creates a draft first, and proposes later updates without installing them. Keep the first trigger Manual and press Run now. Scheduled local runs need the laptop awake and the agent running; a run waiting for approval holds back the next one.

A small synthetic taste trial on November 17, 2026 used **8.15 AI credits** for a first draft from three short notes and **11.66 credits** for an update after a fourth note, on GPT-6.2 Sol. That is about $0.08 and $0.12 of usage value at the credit conversion below, not necessarily an extra bill. These runs used no screenshots. Longer notes, images, retries or other models can cost more; they are examples, not promised prices.

## Weekly roles digest

The [template](../automations/weekly-roles-digest.automation.md) does nothing when this plugin is installed. It starts as a **manual** template. There is no schedule, enabled state, workspace, model or permission grant hidden in it.

## Try it once first

1. Read the prompt and choose the role, criteria, public URLs and private output folder. Do not give it access to an inbox or job-site account.
2. In a VS Code version that supports automation templates, open **Automations > Templates from Plugins**, choose **Weekly roles digest**, and review the new-automation dialog. Keep **Enabled** off. In other hosts, paste the prompt into an ordinary supervised chat.
3. Choose a model already available in your account. A mid-priced model such as GPT-6.2 Sol is a reasonable starting point when offered. More capable models can help difficult matching, but cost more; a digest still needs your review.
4. Review the actual tool, path and URL permissions. Keep approvals and sandbox protections. Do not enable Allow all or Autopilot to get a digest past an approval request.
5. Set the host's per-run usage cap, if available, and run once under supervision. Keep a receipt of actual usage. If the host cannot enforce a cap for unattended work, leave the template manual.

## What one run costs

There is no fixed price per digest. Each run uses input, output and cached tokens at your chosen model's rates. Public pages cost no subscription here, but the AI calls consume your plan's allowance or your separately configured provider balance. Do not buy credits, enable paid overage or increase a budget to make this template run.

For Copilot, one AI credit currently represents $0.01 USD of usage value. A 30-credit per-run cap represents $0.30 of usage value, not necessarily an extra charge if you have included allowance. This is an example cap, not an estimate that every digest will finish within it. Check the [current rates](https://docs.github.com/en/copilot/reference/copilot-billing/models-and-pricing) and [billing explanation](https://docs.github.com/en/copilot/concepts/billing-and-usage/individuals/billing), then set your own limit. Include any separate Cloud compute cost before choosing that execution target.

The prompt cannot enforce billing by itself. After a supervised run, use the host's actual receipt to estimate later runs. Weekly usage is roughly the measured per-run usage times the number of runs, with margin for longer pages, retries and changed prices. Report unavailable cost as unavailable, never as zero.

## Schedule only after a deliberate choice

If you want repetition, review the workspace, URLs, time zone, run cap, permissions and schedule yourself. A possible weekly schedule is Monday at 8 AM local time (`0 8 * * 1`). This is an example to choose, not a setting this plugin enables. Keep runs bounded to ten pages, ten roles and ten minutes unless you deliberately change those limits.

The automation drafts a local file only. It never applies, sends, contacts people, installs tools or changes a subscription. If a necessary approval is unavailable, it stops and records the blocker rather than seeking broader access.

## Stop and remove

Turn off the automation's **Enabled** control in the same host, then cancel an active run if needed. Deleting the automation or its history requires your approval. Removing or disabling the plugin removes its template but may leave automations you created from it; review those separately. Keep or delete the local digest files deliberately. Nothing is sent to you automatically.

Source: [VS Code automation templates](https://code.visualstudio.com/docs/agents/reference/agent-plugin-reference#_automations-in-plugins).
