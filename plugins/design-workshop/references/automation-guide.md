# Optional automation templates

## Set the model before Run now

From a template, choose the model and effort in the **New Automation** dialog. If created from chat, open it under **Automations**, set the model and effort, **Save**, then **Run now**. Check the saved choice before running; naming a model in the prompt does not select it and an unset model can use the account default. An automation made from chat can have no saved model; the runtime prompt cannot choose one.

Suggested: GPT-6.1 Terra at medium effort (low for simple file generation, like a deck file). Switch to GPT-6.2 Sol when the job is hard or Terra stalls. Choose that in the UI, not in the prompt. Keep the first trigger Manual.

Reference-run measurements reported on November 18, 2026: **GPT-6.1 Terra at medium effort** used **4.69 credits** for a taste first run and **8.15 credits** for an overnight plan. These are individual runs, not fixed prices.

## Taste

For the workshop taste exercise, use [Keep my taste current](../automations/keep-my-taste-current.automation.md) and [the taste folder guide](../skills/taste/references/getting-started.md). It reads only its workspace, creates a draft first, and proposes later updates without installing them. Keep the first trigger Manual and press Run now. Scheduled local runs need the laptop awake and the agent running; a run waiting for approval holds back the next one.

A small synthetic taste trial on November 17, 2026 used **8.15 AI credits** for a first draft from three short notes and **11.66 credits** for an update after a fourth note, on GPT-6.2 Sol. That is about $0.08 and $0.12 of usage value at the credit conversion below, not necessarily an extra bill. These runs used no screenshots. Longer notes, images, retries or other models can cost more; they are examples, not promised prices.

These are local workshop templates. Keep **Run in the Cloud** off. Local scheduled runs and Send Later require an awake laptop and a running local host; they do not wake the machine. Send Later also needs the checked setting from [Get ready](https://eli-w-king.github.io/ai-first-design-workshop/get-ready/) and is a one-time prompt, not this weekly schedule. Cloud automations require eligible private repositories and are not available for public forks. A one-off Cloud task is separate.

## Daily cards

The [daily-cards template](../automations/daily-cards.automation.md) is Manual by default. Choose a local learning workspace with `notes/`, review the prompt and format, keep Manual permissions and use **Run now** first. Its [deck-file workflow](../skills/prototypes/references/deck-files.md) writes ten new supported cards as tab-separated `.txt` unless a workspace import-format note says otherwise. The default has ten lines with exactly one literal Tab per line, no header or quotation marks, and no Tab/line break inside a field. Check what the importer accepts and verify the imported count, never just a Success message. It reads no other folders, accounts or browser pages and never imports automatically.

Each run uses the selected model's credits. There is no fixed ten-card price: longer notes, old decks, retries and different models change the cost. The taste measurements above are not a price estimate for card generation. Use a host cap if offered and approved, inspect actual usage after the first run, and never enable overage or increase a budget for this template.

An older CSV-only file trial on November 17, 2026 used **7.26 AI credits** (about $0.07 of usage value) on GPT-6.2 Sol to create ten new cards from twelve short test notes, excluding two concepts in an earlier deck. That is a historical measured example, not a price promise or proof of importer compatibility. The current default is Tab-separated `.txt`; no app import or schedule was tested in that older trial.

A morning schedule is a later deliberate choice. Review the local time zone, sources, output and expected recurring usage first. **Set the trigger back to Manual after the workshop so it does not spend credits on recurring runs.** A later Run now still costs usage. Also inspect and cancel any queued or running request you no longer want; changing the trigger does not cancel it. Disabling/deleting a created automation and removing the plugin are separate actions requiring approval.

## Weekly roles digest

Stage copies of the chosen public job postings and criteria in the automation workspace first. Include source URLs and collection dates. The self-contained scheduled prompt reads those files only, not live pages or plugin guides, and labels current role status unverified. Refresh the copies yourself, or separately request an interactive job-search task with approved public URLs.

The [template](../automations/weekly-roles-digest.automation.md) does nothing when this plugin is installed. It starts as a **manual** template. There is no schedule, enabled state, workspace, model or permission grant hidden in it.

## Try it once first

1. Read the prompt and choose the role, criteria, workspace posting copies and private output folder. Do not give it access to an inbox or job-site account.
2. In a VS Code version that supports automation templates, open **Automations > Templates from Plugins**, choose **Weekly roles digest**, and review the new-automation dialog. Keep **Enabled** off. In other hosts, paste the prompt into an ordinary supervised chat.
3. Choose the model/effort in **New Automation**. If created from chat instead, open **Automations**, set them, **Save**, then **Run now**. Use the suggestion above only if available and within the approved budget; a prompt cannot set this choice. A digest still needs your review.
4. Review the actual tool, path and URL permissions. Keep approvals and sandbox protections. Do not enable Allow all or Autopilot to get a digest past an approval request.
5. Set the host's per-run usage cap, if available, and run once under supervision. Keep a receipt of actual usage. If the host cannot enforce a cap for unattended work, leave the template manual.

## What one run costs

There is no fixed price per digest. Each run uses input, output and cached tokens at your chosen model's rates. The copied public postings need no new subscription here, but the AI calls consume your plan's allowance or your separately configured provider balance. Do not buy credits, enable paid overage or increase a budget to make this template run.

For Copilot, one AI credit currently represents $0.01 USD of usage value. A 30-credit per-run cap represents $0.30 of usage value, not necessarily an extra charge if you have included allowance. This is an example cap, not an estimate that every digest will finish within it. Check the [current rates](https://docs.github.com/en/copilot/reference/copilot-billing/models-and-pricing) and [billing explanation](https://docs.github.com/en/copilot/concepts/billing-and-usage/individuals/billing), then set your own limit. Do not move this template to a Cloud automation on a public fork. Separately approved one-off Cloud tasks still require their own compute and usage review.

The prompt cannot enforce billing by itself. After a supervised run, use the host's actual receipt to estimate later runs. Weekly usage is roughly the measured per-run usage times the number of runs, with margin for longer pages, retries and changed prices. Report unavailable cost as unavailable, never as zero.

## Schedule only after a deliberate choice

If you want repetition, review the workspace, URLs, time zone, run cap, permissions and schedule yourself. A possible weekly schedule is Monday at 8 AM local time (`0 8 * * 1`). This is an example to choose, not a setting this plugin enables. Keep runs bounded to ten supplied postings, ten roles and ten minutes unless you deliberately change those limits.

The automation drafts a local file only. It never applies, sends, contacts people, installs tools or changes a subscription. If a necessary approval is unavailable, it stops and records the blocker rather than seeking broader access.

## Stop and remove

Turn off the automation's **Enabled** control in the same host, then cancel an active run if needed. Deleting the automation or its history requires your approval. Removing or disabling the plugin removes its template but may leave automations you created from it; review those separately. Keep or delete the local digest files deliberately. Nothing is sent to you automatically.

Source: [VS Code automation templates](https://code.visualstudio.com/docs/agents/reference/agent-plugin-reference#_automations-in-plugins).
