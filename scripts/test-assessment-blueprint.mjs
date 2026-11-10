import assert from 'node:assert/strict';
import test from 'node:test';
import { getAssessmentLanes } from '../config/assessment-blueprint.mjs';
import { futureOfAiWatchSeeds } from '../config/ai-watch-future-of-ai.mjs';

test('always routes core concept lanes', () => {
  const lanes = getAssessmentLanes({ role: 'developer' });
  assert.ok(lanes.core.length >= 4);
  assert.ok(lanes.tools.some((lane) => lane.id === 'developer-tools'));
});

test('routes tool lanes from profile signals without making them universal', () => {
  const lanes = getAssessmentLanes({ function: 'finance analyst' });
  assert.ok(lanes.tools.some((lane) => lane.id === 'analyst-tools'));
  assert.equal(getAssessmentLanes({ role: 'student' }).tools.length, 0);
  assert.match(lanes.routingNote, /user confirmation/);
});

test('future of AI seeds remain editorial review items', () => {
  assert.equal(futureOfAiWatchSeeds.length, 5);
  for (const seed of futureOfAiWatchSeeds) {
    assert.equal(seed.reviewStatus, 'editorial-review');
    assert.ok(seed.sourceUrl);
    assert.ok(seed.caution);
    assert.ok(seed.didYouKnow);
  }
});
