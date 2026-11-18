import test from 'node:test';
import assert from 'node:assert/strict';
import { validatePlan, requestAllowed, browserOptions } from '../skills/demo-walkthrough/scripts/record-walkthrough.mjs';

const plan = () => ({
  url: 'http://127.0.0.1:4173/',
  ready: { role: 'heading', name: 'My notes' },
  steps: [{ action: 'click', target: { role: 'button', name: 'Save note' } }],
  finish: { text: 'Saved locally.' }
});

test('accepts approved HTTPS or local sources but refuses insecure remote and credentialed URLs', () => {
  assert.doesNotThrow(() => validatePlan(plan()));
  assert.doesNotThrow(() => validatePlan({ ...plan(), url: 'https://example.com/my-fork/', durationSeconds: 30 }));
  for (const url of ['http://example.com', 'https://user:secret@example.com/', 'file:///index.html', 'http://user:secret@localhost:4173/', 'http://localhost.example.com/']) {
    assert.throws(() => validatePlan({ ...plan(), url }), /HTTPS|localhost/);
  }
  assert.throws(() => validatePlan({ ...plan(), finish: undefined }), /target/i);
  assert.throws(() => validatePlan({ ...plan(), ready: { role: 'heading', name: 'Notes', text: 'Notes' } }), /Targets/);
});

test('rejects script execution, oversized flows and unbounded holds', () => {
  assert.throws(() => validatePlan({ ...plan(), steps: [{ action: 'evaluate', code: 'alert(1)' }] }), /Unsupported/);
  assert.throws(() => validatePlan({ ...plan(), steps: Array(13).fill(plan().steps[0]) }), /1 to 12/);
  assert.throws(() => validatePlan({ ...plan(), steps: [{ action: 'wait', ms: 3001 }] }), /hold/);
  assert.throws(() => validatePlan({ ...plan(), steps: [{ action: 'fill', target: { role: 'textbox', name: 'Note' }, value: 'a'.repeat(301) }] }), /300/);
  assert.throws(() => validatePlan({ ...plan(), steps: [{ action: 'press', target: { text: 'Save' }, key: 'Control+V' }] }), /navigation key/);
});

test('allows only reads to the exact approved origin', () => {
  const origin = 'http://127.0.0.1:4173';
  assert.equal(requestAllowed(`${origin}/styles.css`, 'GET', origin), true);
  assert.equal(requestAllowed(`${origin}/`, 'HEAD', origin), true);
  for (const [url, method] of [
    [`${origin}/api/save`, 'POST'],
    ['http://127.0.0.1:4174/', 'GET'],
    ['https://example.com/', 'GET'],
    ['http://user:secret@127.0.0.1:4173/', 'GET']
  ]) assert.equal(requestAllowed(url, method, origin), false);
});

test('uses existing browser channels unless an explicit executable was chosen', () => {
  assert.deepEqual(browserOptions({ platform: 'darwin' }), { channel: 'chrome' });
  assert.deepEqual(browserOptions({ platform: 'win32' }), { channel: 'msedge' });
  assert.deepEqual(browserOptions({ browserPath: '/approved/browser' }), { executablePath: '/approved/browser' });
  assert.throws(() => browserOptions({ browserPath: '/approved/browser', channel: 'chrome' }), /not both/);
  assert.throws(() => browserOptions({ channel: 'chromium' }), /existing/);
  for (const durationSeconds of [0, 61, 30.5]) assert.throws(() => validatePlan({ ...plan(), durationSeconds }), /5 to 60/);
});
