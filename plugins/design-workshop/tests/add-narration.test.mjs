import test from 'node:test';
import assert from 'node:assert/strict';
import { validateTiming } from '../skills/demo-walkthrough/scripts/add-narration.mjs';

test('fits narration including its lead-in rather than truncating words', () => {
  assert.doesNotThrow(() => validateTiming(12, 9, 1200));
  assert.throws(() => validateTiming(10, 9, 1200), /longer/);
  assert.throws(() => validateTiming(10, 11, 0), /longer/);
});

test('refuses unknown durations and invalid offsets before encoding', () => {
  for (const duration of [NaN, Infinity, 0, -1]) assert.throws(() => validateTiming(12, duration, 0), /duration/);
  for (const delay of [-1, 10001, 1.5, NaN]) assert.throws(() => validateTiming(12, 5, delay), /delay/);
});
