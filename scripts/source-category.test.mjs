import assert from 'node:assert/strict';
import test from 'node:test';

import { normalizeSourceCategory } from './source-category.mjs';

test('maps every source-only Seedance category into one public use case', () => {
  const cases = {
    action: 'cinematic-action',
    advertising: 'brand-film',
    anime: 'animation',
    'cinematic-travel': 'cinematic-story',
    experimental: 'cinematic-story',
    fashion: 'brand-film',
    gameplay: 'cinematic-action',
    historical: 'cinematic-story',
    lifestyle: 'vlog',
    'motion-graphics': 'animation',
    music: 'music-video',
    'product-commercial': 'brand-film',
    sports: 'brand-film',
    thriller: 'cinematic-story',
  };
  for (const [source, expected] of Object.entries(cases)) {
    assert.equal(normalizeSourceCategory(source), expected);
  }
  assert.equal(normalizeSourceCategory('fantasy'), 'fantasy');
});
