---
version: 1
id: weekly-roles-digest
name: Weekly roles digest
description: Drafts a list of new design roles that match what you're looking for. It never applies or sends anything.
schedule:
  kind: cron
  expression: "0 8 * * 1"
  timeZone: local
---
Use the job-search skill. Draft this week's roles digest for me.

What I'm looking for: <the role, for example "senior product designer">, in <the place, or "remote">.
Where to look: <the companies' own careers pages, or job sites I can read without signing in>.

Find roles posted in the last 7 days that match. For each one: the title, the company, the link, and one line on
why it fits my case studies. Pick at most 10.

Save the list as roles-digest-<date>.md in this folder. Don't apply, send or post anything, and don't sign in to
any site.
