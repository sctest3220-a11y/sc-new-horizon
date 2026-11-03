'use client';

import { watchTranslator } from '../i18n/messages';
import { useEffect, useMemo, useRef, useState } from 'react';
import { connectedLabs, currentLabDraft, emptyLabDraft, evaluateConnectedLab } from './connected-labs';
import { formatSourceDate, newWatchState, parseWatchState, selectWatchStories, watchLenses, watchTopics, awarenessLabels } from './watch-model';
import type { ConnectedLabId, LabDraft, WatchLanguage, WatchMedia, WatchState, WatchStory, WatchTopic, WatchView } from './watch-model';
import './watch-labs.css';
import WatchMediaInline from './watch-media';
import { translateContent } from '../i18n/content';

type Props = {
  stories: WatchStory[];
  language: WatchLanguage;
  ownerId: string;
  view: 'watch' | 'labs';
  onViewChange: (view: 'watch' | 'labs') => void;
  onLegacyLabs: () => void;
};

const labTimes = { 'agent-boundaries': connectedLabs['agent-boundaries'].minutes, 'evidence-check': connectedLabs['evidence-check'].minutes };

export default function WatchLabs({ stories, language, ownerId, view, onViewChange, onLegacyLabs }: Props) {
  const [state, setState] = useState<WatchState>(newWatchState);
  const [ready, setReady] = useState(false);
  const [storageStatus, setStorageStatus] = useState<'loading' | 'saved' | 'memory'>('loading');
  const [notice, setNotice] = useState('');
  const [clearRequested, setClearRequested] = useState(false);
  const returnStoryRef = useRef<string | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const storageKey = `new-horizon-watch-labs-v1:${ownerId}`;
  const t = useMemo(() => watchTranslator(language), [language]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      try { setState(parseWatchState(window.localStorage.getItem(storageKey))); setStorageStatus('saved'); }
      catch { setStorageStatus('memory'); }
      setReady(true);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [storageKey]);

  useEffect(() => {
    if (!ready) return;
    let outcome: 'saved' | 'memory' = 'saved';
    try { window.localStorage.setItem(storageKey, JSON.stringify(state)); }
    catch { outcome = 'memory'; }
    const frame = window.requestAnimationFrame(() => setStorageStatus(outcome));
    return () => window.cancelAnimationFrame(frame);
  }, [ready, state, storageKey]);

  useEffect(() => {
    if (!ready) return;
    const frame = window.requestAnimationFrame(() => {
      if (view === 'watch' && returnStoryRef.current) {
        const element = document.getElementById(`watch-${returnStoryRef.current}`);
        if (element) {
          const details = element.querySelector('details');
          if (details) details.open = true;
          element.scrollIntoView({ block: 'center' });
          element.querySelector<HTMLElement>('summary, button')?.focus({ preventScroll: true });
        }
        else headingRef.current?.focus();
        returnStoryRef.current = null;
      } else headingRef.current?.focus();
    });
    return () => window.cancelAnimationFrame(frame);
  }, [view, ready, state.activeLab]);

  const recommendations = useMemo(() => selectWatchStories(stories, state, labTimes), [stories, state]);
  const visible = state.feed === 'for-you' ? recommendations.slice(0, 3) : recommendations;
  const missingSaved = state.savedIds.filter(id => !stories.some(story => story.id === id));
  const activeLab = state.activeLab ? connectedLabs[state.activeLab] : null;
  const draft = activeLab ? currentLabDraft(activeLab, state.drafts[activeLab.id]) : null;
  const evaluation = activeLab && draft ? evaluateConnectedLab(activeLab, draft) : null;
  const activeOrigin = stories.find(story => story.id === state.originStoryId);
  const startedLabs = Object.values(connectedLabs).filter(lab => {
    const saved = currentLabDraft(lab, state.drafts[lab.id]);
    return Object.keys(saved.answers).length > 0 || Boolean(saved.note);
  });

  function patch(next: Partial<WatchState>) { setState(current => ({ ...current, ...next })); }
  function toggleSaved(id: string) {
    setState(current => ({ ...current, savedIds: current.savedIds.includes(id) ? current.savedIds.filter(saved => saved !== id) : [...current.savedIds, id].slice(-200) }));
  }
  function startLab(id: ConnectedLabId, originStoryId: string | null = null) {
    patch({ activeLab: id, originStoryId });
    setNotice('');
    onViewChange('labs');
  }
  function updateDraft(next: Partial<LabDraft>) {
    if (!activeLab) return;
    setState(current => ({ ...current, drafts: { ...current.drafts, [activeLab.id]: { ...currentLabDraft(activeLab, current.drafts[activeLab.id]), ...next } } }));
  }
  function returnToWatch() {
    returnStoryRef.current = state.originStoryId;
    onViewChange('watch');
  }
  function resetPreferences() { patch({ interests: [], mutedTopics: [], minutes: 5, goal: 'learn', media: 'all' }); setNotice(t('preferencesResetYourSavesAnd')); }

  return (
    <section className="watch-learning" data-no-translate lang={language} aria-label={view === 'watch' ? 'AI Watch' : 'AI Labs'}>
      <div className="wl-storage" role="status">
        {storageStatus === 'loading' ? t('loadingYourLearningSpace') : storageStatus === 'memory'
          ? t('browserStorageIsUnavailableYour')
          : t('savedInThisBrowserProfile')}
      </div>
      {!ready ? <p>{t('preparingYourSavedStoriesAnd')}</p> : view === 'watch' ? <>
        <header className="wl-hero">
          <div><p className="wl-eyebrow">AI Watch</p><h1 ref={headingRef} tabIndex={-1}>{t('whatSWorthKnowingWhat')}</h1><p>{t('chooseUsefulAiIdeasInspect')}</p></div>
          <button type="button" onClick={() => { patch({ activeLab: null }); onViewChange('labs'); }}>{t('openAiLabs')} →</button>
        </header>
        <div className="wl-preferences">
          <fieldset><legend>{t('yourInterestsChooseUpTo')}</legend><div className="wl-chips">
            {(Object.keys(watchTopics) as WatchTopic[]).map(topic => <button key={topic} type="button" aria-pressed={state.interests.includes(topic)} disabled={!state.interests.includes(topic) && state.interests.length >= 3} onClick={() => setState(current => ({ ...current, interests: current.interests.includes(topic) ? current.interests.filter(id => id !== topic) : [...current.interests, topic], mutedTopics: current.mutedTopics.filter(id => id !== topic) }))}>{watchTopics[topic][language]}</button>)}
          </div></fieldset>
          <div className="wl-controls">
            <div className="wl-select-field"><label htmlFor="wl-time">{t('iHave')}</label><select id="wl-time" value={state.minutes} onChange={event => patch({ minutes: Number(event.target.value) as WatchState['minutes'] })}>{[2, 5, 10].map(minutes => <option key={minutes} value={minutes}>{minutes} {t('minutes')}</option>)}</select></div>
            <div className="wl-select-field"><label htmlFor="wl-goal">{t('myGoal')}</label><select id="wl-goal" value={state.goal} onChange={event => patch({ goal: event.target.value as WatchState['goal'] })}><option value="learn">{t('understandAnIdea')}</option><option value="practice">{t('tryASkill')}</option></select></div>
            <button type="button" className="wl-text-button" onClick={resetPreferences}>{t('resetPreferences')}</button>
          </div>
          <p className="wl-small">{t('timeHelpsPrioritizeBriefLab')}</p>
          {state.mutedTopics.length > 0 && <div className="wl-chips"><span>{t('hiddenTopics')}</span>{state.mutedTopics.map(topic => <button type="button" key={topic} onClick={() => patch({ mutedTopics: state.mutedTopics.filter(id => id !== topic) })}>{t('restore')}: {watchTopics[topic][language]}</button>)}</div>}
        </div>
        <div className="wl-feed-toolbar">
          <div className="wl-chips" aria-label={t('feedView')}>
            {(['for-you', 'explore', 'saved'] as WatchView[]).map(feed => <button type="button" key={feed} aria-pressed={state.feed === feed} onClick={() => patch({ feed })}>{feed === 'for-you' ? t('forYou') : feed === 'explore' ? t('explore') : `${t('saved')} (${state.savedIds.length})`}</button>)}
          </div>
          {state.feed !== 'saved' && <div className="wl-select-field"><label htmlFor="wl-source-format">{t('sourceFormat')}</label><select id="wl-source-format" value={state.media} onChange={event => patch({ media: event.target.value as WatchMedia })}><option value="all">{t('allFormats')}</option><option value="article">{t('articles')}</option><option value="video">{t('videos')}</option><option value="short">{t('shortVideos')}</option></select></div>}
        </div>
        <p className="wl-editorial-note">{t('editorialSnapshotExistingManuallyCurated')}</p>
        {state.goal === 'practice' && state.minutes === 2 && <p className="wl-note">{t('ourConnectedLabsTakeAbout')}</p>}
        <div className="wl-story-grid">
          {visible.map(({ story, reason }) => {
            const saved = state.savedIds.includes(story.id);
            const linkedLab = story.relatedLab ? connectedLabs[story.relatedLab] : null;
            return <article className="wl-story" key={story.id} id={`watch-${story.id}`}>
              <p className="wl-reason">{reason === 'interest' ? `${t('becauseYouChose')} ${watchTopics[story.topic][language]}` : reason === 'practice' ? t('aBriefAndPracticeFit') : reason === 'saved' ? t('savedByYouTopicAnd') : reason === 'explore' ? t('aTopicToExplore') : t('fromTheEditorialSelection')}</p>
              <div className="wl-meta"><span>{watchTopics[story.topic][language]}</span><span>{story.mediaType === 'article' ? t('article') : story.mediaType === 'short' ? t('shortVideo') : t('video')}</span><span>{t('brief1Min')}</span></div>
              <h2 lang="en">{story.title}</h2>
              {(() => {
                // Headlines stay in the source's language; the summary is translated when a translation exists.
                const summary = translateContent(story.signal, language);
                const translated = summary !== story.signal;
                return <>
                  {language === 'th' && <span className="wl-small" lang="th">{translated ? t('originalEnglishHeadlineDraftTranslated') : t('originalEnglishHeadlineAndSummary')}</span>}
                  <p lang={translated ? language : 'en'}>{summary}</p>
                </>;
              })()}
              {story.awareness && <p className="wl-small">{awarenessLabels[story.awareness.kind][language]} · {t('sourceChecked')} {formatSourceDate(story.awareness.checkedAt, language)}</p>}
              <WatchMediaInline key={story.id} story={story} language={language} />
              <p className="wl-story-source"><a href={story.url} target="_blank" rel="noreferrer">{t('originalSource')}: {story.source} ↗</a> · <span>{translateContent(formatSourceDate(story.date, language), language)}</span></p>
              {story.references?.map(reference => <p className="wl-small" key={reference.url}><a href={reference.url} target="_blank" rel="noreferrer">{reference.label} ↗</a></p>)}
              <details className="wl-story-detail"><summary>{t('inspectTheEvidenceAndSource')}</summary>
                <div className="wl-evidence-cue"><strong>{t('whatToNotice')}</strong><p>{watchLenses[story.domain][language]}</p></div>
                <dl className="wl-source-details"><div><dt>{t('publisher')}</dt><dd>{story.source}</dd></div><div><dt>{t('sourceDate')}</dt><dd>{translateContent(formatSourceDate(story.date, language), language)}</dd></div><div><dt>{t('contentVersion')}</dt><dd>{story.contentVersion}</dd></div></dl>
                <a href={story.url} target="_blank" rel="noreferrer">{t('openOriginalSource')} ↗</a>
              </details>
              <div className="wl-actions"><button type="button" aria-pressed={saved} onClick={() => toggleSaved(story.id)}>{saved ? t('saved2') : t('saveStory')}</button><button type="button" className="wl-text-button" onClick={() => { patch({ mutedTopics: [...new Set([...state.mutedTopics, story.topic])] }); setNotice(t('topicHiddenFromForYou')); }}>{t('hideThisTopic')}</button></div>
              {linkedLab && <div className="wl-linked-lab"><span>{t('putTheIdeaIntoPractice')}</span><button type="button" onClick={() => startLab(linkedLab.id, story.id)}>{linkedLab.title[language]} →</button><small>{t('about')} {linkedLab.minutes} {t('minSeparatePracticeScenario')}</small></div>}
            </article>;
          })}
          {state.feed === 'saved' && missingSaved.map(id => <article key={id} className="wl-story"><h2>{t('savedStoryUnavailable')}</h2><p>{t('thisStoryIsNoLonger')}</p><button type="button" onClick={() => toggleSaved(id)}>{t('removeBookmark')}</button></article>)}
        </div>
        {!visible.length && !(state.feed === 'saved' && missingSaved.length) && <div className="wl-empty"><h2>{state.feed === 'saved' ? t('keepYourNextUsefulIdea') : t('noStoriesMatchTheseChoices')}</h2><p>{state.feed === 'saved' ? t('saveAStoryFromFor') : t('changeTheSourceFormatOr')}</p></div>}
        {state.feed === 'for-you' && recommendations.length > 3 && <button className="wl-more" type="button" onClick={() => patch({ feed: 'explore' })}>{t('exploreMoreStories')}</button>}
      </> : activeLab && draft && evaluation ? <>
        <div className="wl-actions"><button type="button" onClick={() => patch({ activeLab: null })}>← {t('allLabs')}</button><button type="button" onClick={returnToWatch}>{activeOrigin ? t('backToStory') : t('backToAiWatch')}</button></div>
        <header className="wl-hero"><div><p className="wl-eyebrow">{t('labMinutes', { minutes: activeLab.minutes })}</p><h1 ref={headingRef} tabIndex={-1}>{activeLab.title[language]}</h1><p>{activeLab.goal[language]}</p></div></header>
        <p className="wl-note">{t('starterPracticeNotAScored')}</p>
        {state.drafts[activeLab.id] && state.drafts[activeLab.id]?.version !== activeLab.version && <p className="wl-note">{t('thisLabHasChangedStart')}</p>}
        <div className="wl-lab-layout"><article className="wl-panel"><p className="wl-eyebrow">{t('inspect')}</p><h2>{activeLab.evidenceTitle[language]}</h2><ol className="wl-evidence-list">{activeLab.evidence.map((line, i) => <li key={i}>{line[language]}</li>)}</ol><p className="wl-small">{t('originalFictionalTrainingScenario')} · {activeLab.version}</p></article>
          <article className="wl-panel"><p className="wl-eyebrow">{t('decideAndRevise')}</p><p>{activeLab.instructions[language]}</p>
            {activeLab.criteria.map(criterion => <fieldset className="wl-criterion" key={criterion.id}><legend>{criterion.prompt[language]}</legend>{criterion.choices.map(choice => <label key={choice.id}><input type="radio" name={`${activeLab.id}-${criterion.id}`} value={choice.id} checked={draft.answers[criterion.id] === choice.id} onChange={() => updateDraft({ answers: { ...draft.answers, [criterion.id]: choice.id }, checked: false, takeawaySaved: false })} /><span>{choice.label[language]}</span></label>)}</fieldset>)}
            <label className="wl-note-input">{t('yourReasoningOptionalNotAutomatically')}<textarea value={draft.note} maxLength={2000} onChange={event => updateDraft({ note: event.target.value })} rows={3} /></label>
            <div className="wl-actions"><button className="wl-primary" type="button" disabled={!evaluation.ready} onClick={() => updateDraft({ checked: true })}>{t('checkMyDecisions')}</button><button type="button" onClick={() => updateDraft(emptyLabDraft(activeLab))}>{t('startAgain')}</button></div>
          </article>
        </div>
        {draft.checked && <section className="wl-feedback" aria-live="polite"><h2>{evaluation.complete ? t('bothPracticeCriteriaMet') : t('reviewTheEvidenceThenTry')}</h2>{evaluation.criteria.map(({ criterion, choice, met }) => <div className="wl-feedback-row" key={criterion.id}><strong>{met ? t('met') : t('revisit')}: {criterion.prompt[language]}</strong><p>{choice?.feedback[language]}</p></div>)}<p>{activeLab.debrief[language]}</p><p className="wl-small">{t('thisRecordsPracticeOnlyIt')}</p>
          {evaluation.complete && <div className="wl-takeaway"><h3>{t('aChecklistToReuse')}</h3><p>{activeLab.takeaway[language]}</p><button type="button" aria-pressed={draft.takeawaySaved} onClick={() => updateDraft({ takeawaySaved: !draft.takeawaySaved })}>{draft.takeawaySaved ? t('takeawaySavedClickToRemove') : t('saveTakeaway')}</button></div>}
        </section>}
      </> : <>
        <header className="wl-hero"><div><p className="wl-eyebrow">AI Labs</p><h1 ref={headingRef} tabIndex={-1}>{t('buildASkillYouCan')}</h1><p>{t('inspectARealisticSituationMake')}</p></div><button type="button" onClick={() => onViewChange('watch')}>{t('openAiWatch')}</button></header>
        <p className="wl-note">{t('twoStarterLabsEstimated4')}</p>
        {startedLabs.length > 0 && <section className="wl-resume"><h2>{t('continueYourPractice')}</h2><div className="wl-chips">{startedLabs.map(lab => <button type="button" key={lab.id} onClick={() => startLab(lab.id)}>{lab.title[language]} →</button>)}</div></section>}
        <div className="wl-story-grid">{Object.values(connectedLabs).map(lab => { const saved = currentLabDraft(lab, state.drafts[lab.id]); return <article className="wl-story" key={lab.id}><span className="wl-meta">{lab.minutes} {t('minStarterPractice')}</span><h2>{lab.title[language]}</h2><p>{lab.goal[language]}</p><button type="button" className="wl-primary" onClick={() => startLab(lab.id)}>{Object.keys(saved.answers).length ? t('resumeLab') : t('startLab')}</button>{saved.takeawaySaved && <div className="wl-takeaway"><h3>{t('savedTakeaway')}</h3><p>{lab.takeaway[language]}</p></div>}</article>; })}</div>
        <div className="wl-legacy"><h2>{t('morePracticeSamples')}</h2><p>{t('exploreTheExistingPromptMatching')}</p><button type="button" onClick={onLegacyLabs}>{t('openPracticeSamples')}</button></div>
      </>}
      <p role="status" className="wl-notice">{notice}</p>
      {ready && <details className="wl-data-controls"><summary>{t('yourBrowserData')}</summary><p>{t('savedStoriesPreferencesLabAnswers')}</p>{clearRequested ? <div className="wl-actions"><strong>{t('clearAllWatchAndLab')}</strong><button type="button" onClick={() => { setState(newWatchState()); setClearRequested(false); setNotice(t('watchAndLabDataCleared')); }}>{t('clearData')}</button><button type="button" onClick={() => setClearRequested(false)}>{t('cancel')}</button></div> : <button type="button" onClick={() => setClearRequested(true)}>{t('clearThisLearningData')}</button>}</details>}
    </section>
  );
}
