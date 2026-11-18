import test from 'node:test';
import assert from 'node:assert/strict';
import { webcrypto } from 'node:crypto';
import { seal, unseal } from '../tools/crypto.mjs';
import { renderMarkdown } from '../tools/render.mjs';

const phrase = Buffer.from('local test fixture, never a real credential');

test('course encryption authenticates and uses a fresh salt and IV', () => {
  const plain = JSON.stringify({ version: 1, html: '<p>A fixture lesson.</p>' });
  const a = seal(plain, phrase);
  const b = seal(plain, phrase);
  assert.equal(unseal(a, phrase), plain);
  assert.notEqual(a.salt, b.salt);
  assert.notEqual(a.iv, b.iv);
  assert.notEqual(a.ct, b.ct);
  assert.throws(() => unseal(a, Buffer.from('wrong fixture')));
  const corrupted = Buffer.from(a.ct, 'base64');
  corrupted[0] ^= 1;
  assert.throws(() => unseal({ ...a, ct: corrupted.toString('base64') }, phrase));
  assert.throws(() => unseal({ ...a, iterations: 1 }, phrase));
});

test('the published format decrypts using browser-compatible WebCrypto', async () => {
  const plain = JSON.stringify({ version: 1, html: '<p>Browser fixture.</p>' });
  const payload = seal(plain, phrase);
  const material = await webcrypto.subtle.importKey('raw', phrase, 'PBKDF2', false, ['deriveKey']);
  const key = await webcrypto.subtle.deriveKey({ name: 'PBKDF2', hash: payload.hash, salt: Buffer.from(payload.salt, 'base64'), iterations: payload.iterations }, material, { name: payload.cipher, length: 256 }, false, ['decrypt']);
  const bytes = await webcrypto.subtle.decrypt({ name: payload.cipher, iv: Buffer.from(payload.iv, 'base64'), tagLength: 128 }, key, Buffer.from(payload.ct, 'base64'));
  assert.equal(new TextDecoder().decode(bytes), plain);
});

test('course Markdown gives prompts unique targets and escapes raw HTML', () => {
  const result = renderMarkdown('## Goal\n\nUse **small tasks** and [public docs](https://code.visualstudio.com/).\n\n1. Try it.\n2. Check it.\n\n```prompt\n<script>alert(1)</script>\n```\n\n```text\nSecond prompt.\n```', 'sample');
  assert.match(result, /<h3>Goal<\/h3>/);
  assert.match(result, /<ol><li>Try it\.<\/li><li>Check it\.<\/li><\/ol>/);
  assert.match(result, /data-copy="sample-prompt-1"/);
  assert.match(result, /id="sample-prompt-2"/);
  assert.match(result, /&lt;script&gt;/);
  assert.doesNotMatch(result, /<script>/);
  assert.match(renderMarkdown('<img src=x onerror=alert(1)>'), /&lt;img/);
  assert.match(renderMarkdown('# Brief\n\n*Fictional practice*', 'brief', 2), /<h3>Brief<\/h3>[\s\S]*<em>Fictional practice<\/em>/);
});

test('course Markdown fails closed for unsafe links and unclosed code', () => {
  assert.throws(() => renderMarkdown('[bad](javascript:alert)'));
  assert.throws(() => renderMarkdown('[bad](//untrusted.example)'));
  assert.throws(() => renderMarkdown('```prompt\nunfinished'));
});

test('Tonight puts the live link at the end of the hour in both the cards and index', async () => {
  const { GUIDED_MODULES, FREE_MODULES } = await import('../src/run-sheet.mjs');
  const { PAGES } = await import('../src/pages.mjs');
  const html = PAGES.find(page => page.slug === 'tonight').content;
  const schedule = [
    [1, '6:10 PM', '6:20 PM'], [2, '6:20 PM', '6:25 PM'], [3, '6:25 PM', '6:33 PM'],
    [4, '6:33 PM', '6:36 PM'], [5, '6:36 PM', '6:44 PM'], [6, '6:44 PM', '6:59 PM'],
    [9, '6:59 PM', '7:10 PM'], [7, '7:10 PM', '7:12 PM'], [8, '7:12 PM', 'about 7:25 PM'],
  ];
  assert.deepEqual(GUIDED_MODULES.map(m => [m.number,m.time,m.end]), schedule);
  assert.deepEqual(GUIDED_MODULES.filter(m => m.block === 'together').map(m => m.number), [7,8]);
  const nav = html.match(/<nav[^>]*aria-label="On this page"[^>]*>([\s\S]*?)<\/nav>/)[1];
  const expected = ['module-1','module-2','module-3','module-4','module-5','module-6','module-9','running-behind','together','module-7','module-8','free-work','cloud','module-10','module-11','module-12','module-13','your-project'];
  assert.deepEqual([...nav.matchAll(/href="#([^"]+)"/g)].map(m => m[1]).filter(id => expected.includes(id)), expected);
  assert.deepEqual([...html.matchAll(/<(?:section|article)\b[^>]*\bid="([^"]+)"/g)].map(m => m[1]).filter(id => expected.includes(id)), expected);
  for (const [number,time,end] of schedule) assert.ok(html.includes(`id="module-${number}"><p class="module-meta">${time} to ${end} PT</p>`));
  assert.equal(FREE_MODULES[0].id, 'cloud');
  const byNum = n => GUIDED_MODULES.find(m => m.number === n);
  assert.equal(byNum(3).prompts[1].text, byNum(4).prompts[0].text);
  const [picked, unfinished] = byNum(9).prompts.map(p => p.text);
  assert.equal(unfinished, "Make tonight's changes the default, with no flags." + picked.slice(picked.indexOf('. Then open')+1));
});

test('Get ready lists the seven steps in the order they are done', async () => {
  const { PAGES } = await import('../src/pages.mjs');
  const html = PAGES.find(page => page.slug === 'get-ready').content;
  const ids = ['free-month','spending','tools','plugin','workshop-settings','pre-download','kit'];
  const links = html.match(/<nav[^>]*aria-label="On this page"[^>]*>([\s\S]*?)<\/nav>/)[1];
  assert.deepEqual([...links.matchAll(/href="#([^"]+)"/g)].map(m => m[1]).slice(0,7),ids);
  assert.deepEqual([...html.matchAll(/<section class="prework-step" id="([^"]+)">/g)].map(m => m[1]),ids);
  assert.equal((html.match(/<h3>How to undo it<\/h3>/g) || []).length >= 7,true);
  assert.match(html,/id="prefetch-mac"/);
  assert.match(html,/id="prefetch-windows"/);
  for (const slug of ['get-ready','tonight']) assert.match(PAGES.find(p => p.slug === slug).content,/href="\/ai-first-design-workshop\/kit\.zip" download/);
});

test('the kit archive extracts to the reviewed Workshop/kit paths, with no extra entries', async () => {
  const { readFile } = await import('node:fs/promises');
  const { createHash } = await import('node:crypto');
  const { crc32 } = await import('node:zlib');
  const root = new URL('../docs/kit/', import.meta.url);
  const manifest = await readFile(new URL('manifest.json',root));
  const files = JSON.parse(manifest).files;
  const zip = await readFile(new URL('../kit.zip',root));
  const end = zip.length-22;
  assert.equal(zip.readUInt32LE(end),0x06054b50);
  assert.equal(zip.readUInt16LE(end+10),files.length+1);
  let pos = zip.readUInt32LE(end+16);
  const entries = new Map();
  while (pos < end) {
    assert.equal(zip.readUInt32LE(pos),0x02014b50);
    const len = zip.readUInt16LE(pos+28), name = zip.toString('utf8',pos+46,pos+46+len);
    const local = zip.readUInt32LE(pos+42);
    assert.equal(zip.readUInt32LE(local),0x04034b50);
    assert.equal(zip.readUInt16LE(local+8),0); // Stored, not deflated.
    const start = local+30+zip.readUInt16LE(local+26)+zip.readUInt16LE(local+28);
    assert.equal(zip.toString('utf8',local+30,local+30+len),name);
    const bytes = zip.subarray(start,start+zip.readUInt32LE(pos+24));
    assert.equal(crc32(bytes),zip.readUInt32LE(pos+16));
    entries.set(name,bytes);
    pos += 46+len+zip.readUInt16LE(pos+30)+zip.readUInt16LE(pos+32);
  }
  assert.deepEqual([...entries.keys()].sort(), ['kit/manifest.json',...files.map(f => 'kit/'+f.file)].sort());
  assert.deepEqual(entries.get('kit/manifest.json'),manifest);
  for (const name of ['decks/UX laws and principles.txt','decks/Spanish travel phrases.txt','research/All six notes.md','screens/04 - Study back.png']) assert.ok(entries.has('kit/'+name));
  for (const {file,sha256} of files) {
    const bytes = entries.get('kit/'+file);
    assert.equal(createHash('sha256').update(bytes).digest('hex'),sha256);
    assert.deepEqual(bytes, await readFile(new URL(file,root)));
  }
});
