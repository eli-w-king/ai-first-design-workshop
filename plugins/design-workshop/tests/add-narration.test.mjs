import test from 'node:test';
import assert from 'node:assert/strict';
import { validateTiming, durationFromProgress, validateFinalHold } from '../skills/demo-walkthrough/scripts/add-narration.mjs';

test('fits narration including its lead-in rather than truncating words', () => {
  assert.doesNotThrow(() => validateTiming(12, 9, 1200));
  assert.throws(() => validateTiming(10, 9, 1200), /longer/);
  assert.throws(() => validateTiming(10, 11, 0), /longer/);
});

test('refuses unknown durations and invalid offsets before encoding', () => {
  for (const duration of [NaN, Infinity, 0, -1]) assert.throws(() => validateTiming(12, duration, 0), /duration/);
  for (const delay of [-1, 10001, 1.5, NaN]) assert.throws(() => validateTiming(12, 5, delay), /delay/);
});

test('measures decoded time without requiring a second media binary', () => {
  assert.equal(durationFromProgress('out_time_ms=99000000\nout_time=00:00:02.500000\nprogress=continue\nout_time=00:00:30.000000\nprogress=end\n'), 30);
  assert.equal(durationFromProgress('out_time=01:02:03.250000\r\n'), 3723.25);
  for (const output of ['', 'out_time=N/A', 'out_time=00:00:00.000000', 'out_time=00:99:10.000000']) {
    assert.throws(() => durationFromProgress(output), /duration/);
  }
});

test('only trims verified trailing idle and never extends or cuts the action flow', () => {
  assert.doesNotThrow(() => validateFinalHold(30.7, 30, 25));
  assert.throws(() => validateFinalHold(30.7, 30, 28), /final idle/);
  assert.throws(() => validateFinalHold(30, 31, 20), /final idle/);
  assert.throws(() => validateFinalHold(30, 20, Number.NaN), /final idle/);
});
