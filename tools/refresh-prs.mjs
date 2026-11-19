#!/usr/bin/env node
// Refreshes content/data/prs.json: Eli's public pull requests, newest first, open or merged.
//   node tools/refresh-prs.mjs [--author eli-w-king]
// Needs the GitHub CLI, signed in (for the search). Each repository is then checked without signing in, against
// the public API, so only repositories anyone can open are kept. Pull requests closed without merging are left out,
// and so are repositories owned by other people's personal accounts and titles that look internal.
// The build only reads the JSON, so the site never needs GitHub to build.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'content/data/prs.json');
const arg = (name, fallback) => {
	const i = process.argv.indexOf(`--${name}`);
	return i < 0 ? fallback : process.argv[i + 1];
};
const AUTHOR = arg('author', 'eli-w-king');
// Titles with words from a private list stay off the public page. Point PRIVATE_TERMS_FILE at one or more local
// files (never committed), one word or name per line. Matching titles are dropped, and the words never get written
// anywhere.
// PRIVATE_TERMS_FILE can list several files, separated by the system's path separator.
const EXTRA_TERMS = String(process.env.PRIVATE_TERMS_FILE || '').split(path.delimiter).filter(f => f && fs.existsSync(f))
	.flatMap(f => fs.readFileSync(f, 'utf8').split('\n').map(s => s.trim()).filter(s => s && !s.startsWith('#')))
	.filter(t => !/^(eli|elijah|king|eli king|elijah king)$/i.test(t));
const extraTerm = title => EXTRA_TERMS.some(t => new RegExp(`\\b${t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i').test(title));
// A title that starts with someone else's branch name ("name/topic") names a person, so it stays off too.
const otherBranchName = title => {
	const m = title.match(/^([A-Za-z]+)\//);
	return Boolean(m && !/^(eli|elijah)$/i.test(m[1]));
};
// The workshop's own practice and test repositories aren't production work.
const SCAFFOLDING = /^eli-w-king\/(skola|ai-first-design-workshop|excalidraw-case-study.*|excalidraw-demo-copy|excalidraw-workshop|ws-test-.*)$/i;

const search = extra => JSON.parse(execFileSync('gh', ['search', 'prs', '--author', AUTHOR, ...extra, '--limit', '1000',
	'--json', 'repository,number,title,url,state,isDraft,createdAt,closedAt'], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }));

if (!EXTRA_TERMS.length) {
	console.error('No PRIVATE_TERMS_FILE given, so only the built-in checks filter titles. Read the result before committing it.');
}
const open = search(['--state', 'open']).map(p => ({ ...p, status: 'open', date: p.createdAt }));
const merged = search(['--merged']).map(p => ({ ...p, status: 'merged', date: p.closedAt || p.createdAt }));

const repos = new Map();
for (const p of [...open, ...merged]) {
	repos.set(p.repository.nameWithOwner, null);
}
// Both checks run without a token on purpose: a repository counts as public only if anyone can see it.
const cleanEnv = { PATH: process.env.PATH, HOME: process.env.HOME };
const curl = args => execFileSync('curl', ['-sS', '--max-time', '20', ...args], { encoding: 'utf8', env: cleanEnv });
function publicApi(name) {
	try {
		return JSON.parse(curl(['-H', 'Accept: application/vnd.github+json', `https://api.github.com/repos/${name}`]));
	} catch {
		return null;
	}
}
// The public API allows 60 calls an hour per address. Past that, the repository's own page answers the same
// question: GitHub shows a private repository to someone who isn't signed in as a 404.
function publicPage(name) {
	try {
		return curl(['-o', '/dev/null', '-w', '%{http_code}', `https://github.com/${name}`]).trim() === '200';
	} catch {
		return false;
	}
}
const ownerType = new Map();
function typeOf(owner) {
	if (!ownerType.has(owner)) {
		let type = null;
		try {
			type = execFileSync('gh', ['api', `users/${owner}`, '--jq', '.type'], { encoding: 'utf8' }).trim();
		} catch {
			type = null;
		}
		ownerType.set(owner, type);
	}
	return ownerType.get(owner);
}
const checkedBy = { api: 0, page: 0 };
for (const name of repos.keys()) {
	const info = publicApi(name);
	let isPublic;
	if (info && info.full_name) {
		isPublic = info.private === false && (info.visibility || 'public') === 'public';
		checkedBy.api++;
	} else if (info && /rate limit/i.test(info.message || '')) {
		isPublic = publicPage(name);
		checkedBy.page++;
	} else {
		isPublic = false;
		checkedBy.api++;
	}
	const owner = name.split('/')[0];
	const ownedByOtherPerson = owner.toLowerCase() !== AUTHOR.toLowerCase() && (info?.owner?.type || typeOf(owner)) === 'User';
	repos.set(name, { isPublic, ownedByOtherPerson });
}

const dropped = { privateRepo: new Set(), otherPerson: new Set(), scaffolding: new Set(), title: 0 };
const items = [...open, ...merged].filter(p => {
	const r = repos.get(p.repository.nameWithOwner);
	if (!r.isPublic) {
		dropped.privateRepo.add(p.repository.nameWithOwner);
		return false;
	}
	if (r.ownedByOtherPerson) {
		dropped.otherPerson.add(p.repository.nameWithOwner);
		return false;
	}
	if (SCAFFOLDING.test(p.repository.nameWithOwner)) {
		dropped.scaffolding.add(p.repository.nameWithOwner);
		return false;
	}
	if (/\binternal\b/i.test(p.title) || extraTerm(p.title) || otherBranchName(p.title)) {
		dropped.title++;
		return false;
	}
	return true;
}).map(p => ({
	repo: p.repository.nameWithOwner,
	number: p.number,
	title: p.title.replace(/[\u2013\u2014]/g, '-').trim(),
	url: p.url,
	status: p.status,
	draft: Boolean(p.isDraft),
	date: p.date,
})).sort((a, b) => b.date.localeCompare(a.date));

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify({
	_readme: 'Made by tools/refresh-prs.mjs. Public repositories only (checked without signing in), open or merged, newest first. The site shows this snapshot as is.',
	author: AUTHOR,
	taken: new Date().toISOString(),
	items,
}, null, '\t') + '\n');
console.log(JSON.stringify({
	kept: items.length,
	open: items.filter(i => i.status === 'open').length,
	merged: items.filter(i => i.status === 'merged').length,
	repos: [...new Set(items.map(i => i.repo))],
	droppedPrivateRepos: dropped.privateRepo.size,
	droppedOtherPeoplesRepos: dropped.otherPerson.size,
	droppedWorkshopRepos: dropped.scaffolding.size,
	droppedTitles: dropped.title,
	checkedBy,
}, null, 2));
