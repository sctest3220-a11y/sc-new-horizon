import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
// Node strips the types at import time, so coverage is measured on the real
// source files. The models must stay free of non-erasable TypeScript (enums,
// namespaces, parameter properties) and of runtime imports.
import { newWatchState, parseWatchState, selectWatchStories, youtubePlayerUrl, watchTopics, selectAwarenessStories } from '../app/watch-model.ts';
import { connectedLabs, currentLabDraft, emptyLabDraft, evaluateConnectedLab } from '../app/connected-labs.ts';

const pageSource = fs.readFileSync(new URL('../app/page.tsx', import.meta.url), 'utf8');
const sourceFile = ts.createSourceFile('page.tsx', pageSource, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
const feed = sourceFile.statements.filter(ts.isVariableStatement).flatMap(statement => [...statement.declarationList.declarations]).find(declaration => declaration.name.getText(sourceFile) === 'trendFeed');
assert.ok(feed?.initializer, 'The actual editorial snapshot must remain available to the test.');
const stories = JSON.parse(JSON.stringify(vm.runInNewContext(`(${feed.initializer.getText(sourceFile)})`)));
const times = Object.fromEntries(Object.values(connectedLabs).map(lab => [lab.id, lab.minutes]));

test('corrupt, missing, and unknown-version storage recovers without throwing', () => {
  for (const raw of [null, '{bad', 'null', '[]', '{"version":2,"savedIds":["lost"]}']) assert.deepEqual(parseWatchState(raw), newWatchState());
});

test('storage rejects invalid preference values and caps untrusted data', () => {
  const result = parseWatchState(JSON.stringify({ version:1, interests:['agents','constructor','trust','models','work'], mutedTopics:['robotics','__proto__'], minutes:999, savedIds:['old-story','old-story',44], drafts:{ 'agent-boundaries':{version:'agent-boundaries@1',note:'x'.repeat(3000),answers:{permissions:'draft-only',invalid:'<script>'},checked:true,takeawaySaved:true} } }));
  assert.deepEqual(result.interests,['agents','trust','models']);
  assert.deepEqual(result.mutedTopics,['robotics']);
  assert.equal(result.minutes,5);
  assert.deepEqual(result.savedIds,['old-story']);
  assert.equal(result.drafts['agent-boundaries'].note.length,2000);
  assert.deepEqual(result.drafts['agent-boundaries'].answers,{permissions:'draft-only'});
});

test('all stories have unique stable identities, valid topics, and real Lab links', () => {
  assert.equal(new Set(stories.map(story=>story.id)).size,stories.length);
  for (const story of stories) {
    assert.match(story.id,/^[a-z0-9-]+$/);
    assert.ok(story.contentVersion.startsWith(`${story.id}@`) && /^[1-9][0-9]*$/.test(story.contentVersion.split('@')[1]));
    assert.ok(Object.hasOwn(watchTopics,story.topic));
    if(story.relatedLab) assert.ok(connectedLabs[story.relatedLab]);
    assert.equal(new URL(story.url).protocol,'https:');
  }
});

test('mutes and format filters are hard gates in recommendations', () => {
  const state={...newWatchState(),interests:['robotics'],mutedTopics:['robotics'],media:'video'};
  const selected=selectWatchStories(stories,state,times);
  assert.ok(selected.every(({story})=>story.topic!=='robotics' && story.mediaType==='video'));
  assert.deepEqual(selectWatchStories(stories,{...state,mutedTopics:Object.keys(watchTopics)},times),[]);
});

test('saved stories stay accessible even after a topic is muted or format changes', () => {
  const first=stories[0];
  const selected=selectWatchStories(stories,{...newWatchState(),feed:'saved',savedIds:[first.id,'removed-story'],mutedTopics:[first.topic],media:'short'},times);
  assert.deepEqual(selected.map(entry=>entry.story.id),[first.id]);
  assert.equal(selected[0].reason,'saved');
});

test('explicit interests lead; the first three leave room for a different topic', () => {
  const state={...newWatchState(),interests:['robotics']};
  const selected=selectWatchStories(stories,state,times);
  assert.equal(selected[0].story.topic,'robotics');
  assert.equal(selected[0].reason,'interest');
  assert.ok(selected.slice(0,3).some(({story})=>story.topic!=='robotics'));
  assert.deepEqual(selected,selectWatchStories(stories,state,times));
});

test('short sessions never claim the linked practice fits', () => {
  const short=selectWatchStories(stories,{...newWatchState(),goal:'practice',minutes:2},times);
  assert.ok(short.every(entry=>entry.reason!=='practice'));
  const longer=selectWatchStories(stories,{...newWatchState(),goal:'practice',minutes:5},times);
  assert.equal(longer[0].reason,'practice');
  assert.ok(longer[0].story.relatedLab);
});

test('a balanced edition offers format variety without overriding a media filter', () => {
  const balanced=selectWatchStories(stories,newWatchState(),times).slice(0,3);
  assert.ok(balanced.some(({story})=>story.mediaType==='video'));
  const articles=selectWatchStories(stories,{...newWatchState(),media:'article'},times);
  assert.ok(articles.every(({story})=>story.mediaType==='article'));
});

test('Lab feedback requires all current criteria, and never grades reflection text', () => {
  for (const lab of Object.values(connectedLabs)) {
    const draft=emptyLabDraft(lab);
    draft.note='approval manager evidence source'.repeat(50);
    assert.equal(evaluateConnectedLab(lab,draft).ready,false);
    assert.equal(evaluateConnectedLab(lab,draft).complete,false);
    draft.answers=Object.fromEntries(lab.criteria.map(criterion=>[criterion.id,criterion.correct]));
    assert.equal(evaluateConnectedLab(lab,draft).complete,true);
    draft.answers[lab.criteria[0].id]=lab.criteria[0].choices.find(choice=>choice.id!==lab.criteria[0].correct).id;
    assert.equal(evaluateConnectedLab(lab,draft).ready,true);
    assert.equal(evaluateConnectedLab(lab,draft).complete,false);
  }
});

test('stale versions and forged completion cannot retain a takeaway', () => {
  const lab=connectedLabs['agent-boundaries'];
  const stale={...emptyLabDraft(lab),version:'old',checked:true,takeawaySaved:true};
  assert.deepEqual(currentLabDraft(lab,stale),emptyLabDraft(lab));
  const forged={...emptyLabDraft(lab),answers:{permissions:'unknown'},checked:true,takeawaySaved:true};
  const restored=currentLabDraft(lab,forged);
  assert.deepEqual(restored.answers,{});
  assert.equal(restored.checked,false);
  assert.equal(restored.takeawaySaved,false);
});

test('both Labs include complete bilingual evidence, choices, and feedback', () => {
  for (const lab of Object.values(connectedLabs)) {
    const texts=[lab.title,lab.goal,lab.instructions,lab.evidenceTitle,lab.takeaway,lab.debrief,...lab.evidence,...lab.criteria.flatMap(criterion=>[criterion.prompt,...criterion.choices.flatMap(choice=>[choice.label,choice.feedback])])];
    for (const text of texts) { assert.ok(text.en.trim()); assert.match(text.th,/[\u0e00-\u0e7f]/); }
    for (const criterion of lab.criteria) assert.equal(criterion.choices.filter(choice=>choice.id===criterion.correct).length,1);
  }
});

test('video embeds accept only valid HTTPS YouTube IDs and never autoplay', () => {
  assert.equal(youtubePlayerUrl('https://www.youtube.com/watch?v=yo7nPQ42Kcg'),'https://www.youtube-nocookie.com/embed/yo7nPQ42Kcg?autoplay=0');
  assert.ok(youtubePlayerUrl('https://youtu.be/yo7nPQ42Kcg'));
  for (const url of ['https://evil.example/watch?v=yo7nPQ42Kcg','javascript:alert(1)','http://youtube.com/watch?v=yo7nPQ42Kcg','https://youtube.com/watch?v=bad','https://youtube.com.evil.example/watch?v=yo7nPQ42Kcg']) assert.equal(youtubePlayerUrl(url),null);
});


test('awareness teasers share curated records and respect topic preferences', () => {
  const state = newWatchState(); state.interests = ['models']; state.mutedTopics = ['trust'];
  const picks = selectAwarenessStories(stories, state);
  assert.equal(picks[0].id, 'jev-typed-decisions');
  assert.ok(picks.every(story => story.awareness && story.topic !== 'trust'));
  assert.ok(!picks.some(story => story.id === 'agents-bank-run-simulation'));
  assert.equal(stories.find(story => story.id === 'agents-bank-run-simulation').awareness.kind, 'simulation');
  assert.equal(stories.find(story => story.id === 'pip-ilands-paid-work').awareness.kind, 'reported-case');
});

test('storage keeps every valid preference value and both Lab drafts', () => {
  const raw = { version:1, interests:['agents'], minutes:10, goal:'practice', feed:'explore', media:'short', activeLab:'evidence-check', originStoryId:'some-story',
    drafts:{ 'evidence-check':{version:'evidence-check@1',answers:{source:'primary'},note:'kept',checked:true,takeawaySaved:false}, 'agent-boundaries':{version:'agent-boundaries@1'} } };
  const result = parseWatchState(JSON.stringify(raw));
  assert.equal(result.minutes, 10);
  assert.equal(result.goal, 'practice');
  assert.equal(result.feed, 'explore');
  assert.equal(result.media, 'short');
  assert.equal(result.activeLab, 'evidence-check');
  assert.equal(result.originStoryId, 'some-story');
  assert.deepEqual(result.drafts['evidence-check'], { version:'evidence-check@1', answers:{source:'primary'}, note:'kept', checked:true, takeawaySaved:false });
  assert.deepEqual(result.drafts['agent-boundaries'], { version:'agent-boundaries@1', answers:{}, note:'', checked:false, takeawaySaved:false });
  for (const [field, value] of [['minutes',2],['feed','saved'],['media','article'],['media','video']]) assert.equal(parseWatchState(JSON.stringify({ version:1, [field]:value }))[field], value);
});

test('storage falls back field by field when values are the wrong type or too long', () => {
  const result = parseWatchState(JSON.stringify({ version:1, interests:'agents', savedIds:['x'.repeat(121), ''], goal:'win', feed:'everything', media:'podcast', activeLab:'unknown-lab', originStoryId:'y'.repeat(121),
    drafts:{ 'unknown-lab':{version:'v'}, 'agent-boundaries':{version:'v'.repeat(81)}, 'evidence-check':{version:7}, list:[] } }));
  assert.deepEqual(result.interests, []);
  assert.deepEqual(result.savedIds, []);
  assert.equal(result.goal, 'learn');
  assert.equal(result.feed, 'for-you');
  assert.equal(result.media, 'all');
  assert.equal(result.activeLab, null);
  assert.equal(result.originStoryId, null);
  assert.deepEqual(result.drafts, {});
  const answers = Object.fromEntries(Array.from({ length: 25 }, (_, i) => [`criterion-${i}`, 'choice']));
  const capped = parseWatchState(JSON.stringify({ version:1, drafts:{ 'agent-boundaries':{ version:'agent-boundaries@1', answers:{ ...answers, Upper:'choice', ok:5 } } } }));
  assert.equal(Object.keys(capped.drafts['agent-boundaries'].answers).length, 20);
  assert.ok(!('Upper' in capped.drafts['agent-boundaries'].answers));
});

test('the explore feed lists every eligible story in editorial order', () => {
  const selected = selectWatchStories(stories, { ...newWatchState(), feed:'explore', mutedTopics:['robotics'] }, times);
  assert.deepEqual(selected.map(({ story }) => story.id), stories.filter(story => story.topic !== 'robotics').map(story => story.id));
  assert.ok(selected.every(entry => entry.reason === 'explore'));
});

test('ranking handles tiny editions, and still lifts one exploratory pick when the first pair already varies media', () => {
  const [a, b] = stories;
  assert.deepEqual(selectWatchStories([a, b], newWatchState(), times).map(entry => entry.story.id), [a.id, b.id]);
  assert.deepEqual(selectWatchStories([], newWatchState(), times), []);
  const article = { ...a, id:'x-article', topic:'agents', mediaType:'article' };
  const video = { ...a, id:'x-video', topic:'agents', mediaType:'video' };
  const third = { ...a, id:'x-third', topic:'agents', mediaType:'article' };
  const late = { ...a, id:'x-late', topic:'trust', mediaType:'article' };
  const picked = selectWatchStories([article, video, third, late], { ...newWatchState(), interests:['agents'] }, times);
  assert.deepEqual(picked.map(entry => entry.story.id), ['x-article', 'x-video', 'x-late', 'x-third']);
  assert.equal(picked[2].reason, 'explore');
});

test('video embeds accept Shorts and reject other YouTube paths and malformed URLs', () => {
  assert.equal(youtubePlayerUrl('https://www.youtube.com/shorts/yo7nPQ42Kcg'), 'https://www.youtube-nocookie.com/embed/yo7nPQ42Kcg?autoplay=0');
  for (const url of ['https://www.youtube.com/embed/yo7nPQ42Kcg', 'https://youtu.be/', 'https://www.youtube.com/watch', 'not a url']) assert.equal(youtubePlayerUrl(url), null);
});
