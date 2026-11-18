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
