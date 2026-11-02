import test from 'node:test';
import assert from 'node:assert/strict';
import { isLabKind, labKinds, labPath, legacyRedirect, pathForStep, stepForPath } from '../app/learner-routes-model.ts';

const routedSteps = ['home', 'dashboard', 'admin', 'developerReport', 'news', 'learningLabs', 'onboarding', 'premiumOnboarding', 'assessment', 'results'];

test('every routed step round-trips through its URL', () => {
  for (const step of routedSteps) assert.equal(stepForPath(pathForStep(step)), step, step);
  assert.equal(new Set(routedSteps.map(pathForStep)).size, routedSteps.length, 'two steps share a URL');
});

test('answer feedback shares the assessment run URL', () => {
  assert.equal(pathForStep('feedback'), '/assessment/run');
  assert.equal(stepForPath('/assessment/run'), 'assessment');
});

test('each lab kind has its own URL that resolves to the lab screen', () => {
  for (const kind of labKinds) {
    assert.equal(labPath(kind), `/labs/${kind}`);
    assert.equal(stepForPath(labPath(kind)), 'lab');
    assert.ok(isLabKind(kind));
  }
  for (const value of ['', 'unknown', 'PROMPT', null, 3, '__proto__']) assert.equal(isLabKind(value), false, String(value));
});

test('paths ignore a trailing slash and unknown paths fall back to home', () => {
  assert.equal(stepForPath('/dashboard/'), 'dashboard');
  assert.equal(stepForPath('/'), 'home');
  assert.equal(stepForPath('/nowhere'), 'home');
  assert.equal(stepForPath('/labs/prompt/extra'), 'home');
});

test('legacy home links redirect to their routes', () => {
  assert.equal(legacyRedirect('/', '?view=watch'), '/watch');
  assert.equal(legacyRedirect('/', '?view=labs'), '/labs');
  assert.equal(legacyRedirect('/', '?view=admin'), '/admin');
  assert.equal(legacyRedirect('/', '?view=assessment'), '/assessment');
  assert.equal(legacyRedirect('/', '?question=D1-A-001&view=watch'), '/assessment/run?question=D1-A-001');
});

test('legacy redirects encode the question id and ignore anything else', () => {
  assert.equal(legacyRedirect('/', '?question=a%26b%3Dc'), '/assessment/run?question=a%26b%3Dc');
  assert.equal(legacyRedirect('/', ''), null);
  assert.equal(legacyRedirect('/', '?view=unknown'), null);
  assert.equal(legacyRedirect('/', '?view=constructor'), null);
  assert.equal(legacyRedirect('/dashboard', '?view=watch'), null);
});
