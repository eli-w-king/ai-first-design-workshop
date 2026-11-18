# Sources and scope

Public documentation checked on November 17, 2026. Features, labels, rates and available models can change. Inspect the actual installed client's tools and help before running a command.

## Product documentation

- [VS Code agent plugins](https://code.visualstudio.com/docs/agent-customization/agent-plugins): installation, trust, discovery, updates and removal. Plugins are not VS Code extensions.
- [VS Code plugin authoring reference](https://code.visualstudio.com/docs/agents/reference/agent-plugin-reference): Agent Plugins 1.0, fixed skill discovery, branch-qualified marketplace sources and opt-in automation templates.
- [VS Code Agent Skills](https://code.visualstudio.com/docs/agent-customization/agent-skills): metadata, personal and project scope, portability and verification.
- [Copilot CLI plugin commands](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-plugin-reference): marketplace format, local-path registration, install, update and uninstall.
- [Finding and installing CLI plugins](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/plugins-finding-installing): supported installation routes and marketplace removal.
- [Built-in browser tools](https://code.visualstudio.com/docs/agents/run/browser-tools): navigation, interaction, screenshots and isolated sessions. This page does not establish a general video-export capability.
- [Approvals](https://code.visualstudio.com/docs/agents/run/approvals) and [sandboxing](https://code.visualstudio.com/docs/agents/run/agent-sandboxing): separate protections; Manual honors existing approvals and sandboxing does not block all network access by default.
- [Playwright videos](https://playwright.dev/docs/videos) and [browser installation](https://playwright.dev/docs/browsers): recording requires a browser and encoder, matching viewport and video size, and a closed context to finalize the file.
- [GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site): public exposure and account requirements.
- [Copilot billing](https://docs.github.com/en/copilot/concepts/billing-and-usage/individuals/billing) and [model pricing](https://docs.github.com/en/copilot/reference/copilot-billing/models-and-pricing): token-based usage, credits and separate additional-usage budgets.

- [Forking a repository](https://docs.github.com/en/pull-requests/how-tos/work-with-forks/fork-a-repo): the default-branch-only choice and cloning the person's own fork.
- [Pages publishing sources](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site) and [custom Pages workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages): branch folders, build artifacts, deployment permissions and the real returned URL.
- [Local automations](https://code.visualstudio.com/docs/agents/run/automations): first Manual run, enabled state, awake-host requirements and serialized runs.

- [Workshop Get ready](https://eli-w-king.github.io/ai-first-design-workshop/get-ready/): the checked two-entry settings snippet and controls guidance are maintained there, not duplicated in this plugin. Native chat Mark Up is source-checked; clean-account UI rehearsal remains separate.

## Public source methods

This set adapts the methods in [Eli King's public autonomous output skills](https://github.com/eli-w-king/autonomous-output-skills), reviewed at commit `a5ae7612b1c111dbb8b77990458de6408ad4de0d`:

- Variations: distinct ideas, today's baseline, shared content, a single comparison surface, responsive checks and preserved rounds.
- Demos: real UI, a clean complete flow, intentional pointer movement, continuous capture and full-export review.
- Prototypes: the real component, a reversible toggle, a branch and before/after review.
- Research: consent, actual observation, verbatim evidence and limits on what a small test proves.
- Longer runs: explicit boundaries, checkpoints, process ownership and a final report.
- Setup: inspect, explain, approve, change one item, verify, and keep an undo record.

The public workshop versions are rewritten for personal projects. They do not include personal writing samples, personal taste rules, account integrations, global setup scripts or automatic sync. The taste draft structure is newly written. Voice is only a possible later use of the same pattern; no voice template is included. No content from the source's separate writing-style reference is bundled.

The set has nine skills. `taste` replaces the initial voice-and-taste draft with an automation-led flow. `prototypes` is the new ninth skill, kept separate so building and PR review do not become hidden steps inside variations or publishing. Installing the plugin grants no authority to install its optional tools or carry out its workflows.
