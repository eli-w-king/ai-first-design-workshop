# design-workshop

Skills for the AI-First Design Workshop with UXPA Seattle. They help you design with agents in VS Code: explore a few
directions side by side, click through each one, test them with a partner, and publish the result as a page.

This is a draft for the workshop on Thursday, Nov 19, 2026. It isn't an official Microsoft or GitHub product.

## What's in it

| Skill | What it does |
| --- | --- |
| `workshop-setup` | Checks your laptop, shows you what it would change, and sets things up one at a time, with your okay. Say **check my setup**. |
| `variations` | Builds a few really different directions of one screen, side by side, in plain HTML. |
| `demo-walkthrough` | Clicks through each direction in VS Code's built-in browser and saves screenshots. |
| `pair-test` | A 10 minute test with your partner, a note template, and findings with real quotes. |
| `publish-pages` | Checks what would be public, then publishes a folder to GitHub Pages and checks the live link. |
| `voice-and-taste` | Learns how you write and what you like from files you pick. It stays on your laptop. |
| `overnight-plan` | Plans a longer run, keeps your laptop awake, and leaves a status file and a morning summary. |
| `job-search` | Drafts a tailored intro for a job posting, interview prep, and a weekly roles digest. You review and send. |

There's also one automation template, a weekly roles digest. Installing the plugin doesn't turn it on.

## What it installs, and what it doesn't

- It adds the skills above. Skills are instructions the agent reads. They don't run anything on their own.
- No hooks, no MCP servers, no background jobs, no automations turned on.
- It doesn't change your settings. The setup skill can turn on the terminal sandbox, and it asks first.
- Nothing gets sent, posted or published unless you say so.

## Install

Open this link with VS Code installed, then confirm:

```text
vscode://chat-plugin/install?source=eli-w-king%2Fai-first-design-workshop&plugin=design-workshop
```

## Remove it

In VS Code, run **Chat: Open Customizations**, select **Plugins**, open **design-workshop**, then select
**Uninstall**.
