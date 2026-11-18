import test from 'node:test';
import assert from 'node:assert/strict';
import { validateExistingManifest } from '../skills/demo-walkthrough/scripts/prepare-recorder.mjs';

test('does not repurpose an unrelated or differently pinned cache manifest', () => {
  const value = { name: 'design-workshop-recorder', private: true, dependencies: { 'playwright-core': '1.65.0', 'ffmpeg-static': '5.3.0' } };
  assert.doesNotThrow(() => validateExistingManifest(value));
  for (const changed of [
    { ...value, name: 'another-project' },
    { ...value, private: false },
    { ...value, dependencies: { ...value.dependencies, 'playwright-core': 'latest' } },
    { ...value, dependencies: { ...value.dependencies, 'another-tool': '1.0.0' } }
  ]) assert.throws(() => validateExistingManifest(changed), /Leave it unchanged/);
});
