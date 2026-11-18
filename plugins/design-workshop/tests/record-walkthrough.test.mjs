import test from 'node:test';
import assert from 'node:assert/strict';
import { validatePlan, requestAllowed } from '../skills/demo-walkthrough/scripts/record-walkthrough.mjs';

const plan = () => ({
  url: 'http://127.0.0.1:4173/',
  ready: { role: 'heading', name: 'My notes' },
  steps: [{ action: 'click', target: { role: 'button', name: 'Save note' } }],
  finish: { text: 'Saved locally.' }
});

test('requires a local unauthenticated URL and visible start and finish targets', () => {
  assert.doesNotThrow(() => validatePlan(plan()));
  for (const url of ['https://example.com', 'file:///index.html', 'http://user:secret@localhost:4173/', 'http://localhost.example.com/']) {
    assert.throws(() => validatePlan({ ...plan(), url }), /localhost/);
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
