---
name: overnight-plan
description: "Plan a bounded longer or overnight design run with a budget, checkpoint files, scoped permissions, a stop rule and a morning report. Use for \"plan an overnight run\", \"keep working while I am away\", or \"plan a Cloud task\". Planning does not start a run, change approvals, install software or create an automation."
---

# Overnight plan

Write short, plain sentences. Do not use em or en dashes in generated copy.

Advanced take-home only. Agree on a small, testable job before leaving an agent to work. A saved plan is not permission to run it. A research-to-variations plan can use selected findings, but fictional practice notes remain fictional and never become customer evidence. Do not promise this as a live workshop task.

## Draft the agreement

Read only the selected project and feedback. Fill in [the run agreement](references/run-agreement.md):

- The outcome, the exact folder and branch, permitted files, and what must remain unchanged.
- A few independent steps, each with a deliverable and a check that proves it works.
- A start time, stop time with time zone, maximum duration, model and usage cap.
- The exact permissions and commands needed, who can approve them, and what happens if an approval is unavailable.
- Checkpoints, retry limit, process ownership, undo and the morning report path.

Ask for approval of the filled agreement. Before any install, send, publish, spend or delete, ask separately and wait. The default run does none of these. Using included AI credits also consumes an allowance, so agree on its cap before starting.

## Choose where it runs

**On this laptop:** prefer the existing workspace session and Manual permissions. A run may pause when it needs an approval. Do not solve that by turning on Allow all, Autopilot or broad auto-approval. Keep the sandbox on where supported, but explain that it is not a budget or a complete safety boundary. Do a short supervised check first.

Keep the laptop plugged in with its lid open. If the person wants a wake lock, explain the temporary change and ask. On macOS, a bounded `caffeinate -i -t 3600` prevents idle system sleep for one hour; keep its process id and stop only that process early if the run finishes. Do not change system sleep settings or install a utility automatically. On other systems, let the person use their power settings and record the original values for restoration.

**A Cloud session, optionally:** check the host's supported execution targets and account access. Explain which repository files are uploaded, whether a branch or PR is created, and the current AI credit and compute costs. Cloud is an execution location, not a model. Ask before starting it. If upload or spend permission is missing, leave a draft handoff instead. Do not provision machines or remote hosts.

## Set an enforceable budget

Use the current model, or suggest a mid-priced model such as GPT-6.2 Sol if it is offered. A smaller model can cost less but may need more checking; longer context, reasoning and parallel sessions can increase usage. No model is required by this skill.

Use [the budget notes](references/budgets.md). Prefer the host's actual session cap, not a sentence that asks the model to stop at a price. Never raise an account budget, enable paid overage, buy credits or switch to a separately billed provider. If there is no enforceable cap or costs cannot be checked, keep the run supervised and do not start an unattended paid run.

## During an approved run

- Keep `STATUS.md` in the agreed run folder current at each step and at least every 15 minutes while working. Include verified work, next action, blockers, usage if available, files changed and owned process ids.
- Stop at the first limit: done, deadline, usage cap, unavailable approval, a secret, unexpected outside access, or two failures of the same step. Save partial results and the exact blocker. Do not expand scope to keep busy.
- Preserve unrelated edits. Make local commits only if the agreement authorizes them; never push as a checkpoint.
- On interruption, resume from the last verified checkpoint only after checking whether the previous run or its processes still exist. Never run two copies of the same job.

## Finish without waiting for a greeting

Write the morning report at the end of the run: links or local paths, what changed, real checks, unfinished work, usage or **unavailable**, and the next decision. Show how to turn off a prototype toggle or revert the run's named commits, with review before any destructive action.

Stop every process you started, including a wake lock, and record cleanup. Do not leave a recurring job behind. Do not email, message or publish the report. The person reads it locally when they return.
