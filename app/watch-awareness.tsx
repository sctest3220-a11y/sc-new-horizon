'use client';

import { watchTranslator } from '../i18n/messages';
import { useEffect, useState, useMemo } from 'react';
import { awarenessLabels, formatSourceDate, newWatchState, parseWatchState, selectAwarenessStories } from './watch-model';
import type { WatchLanguage, WatchState, WatchStory } from './watch-model';
import WatchMedia from './watch-media';
import { translateContent } from '../i18n/content';
import './watch-labs.css';

export default function AwarenessFlash({ stories, language, ownerId, onOpenWatch }: { stories: WatchStory[]; language: WatchLanguage; ownerId: string; onOpenWatch: () => void }) {
  const [preferences, setPreferences] = useState<WatchState>(newWatchState);
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      try { setPreferences(parseWatchState(localStorage.getItem(`new-horizon-watch-labs-v1:${ownerId}`))); }
      catch { setPreferences(newWatchState()); }
      setIndex(0);
    });
    return () => cancelAnimationFrame(frame);
  }, [ownerId]);
  const t = useMemo(() => watchTranslator(language), [language]);
  const eligible = selectAwarenessStories(stories, preferences);
  const story = eligible[index % eligible.length];
  if (!story?.awareness) return null;
  return <article className="watch-learning wl-awareness wl-story" data-no-translate lang={language} aria-label={t('didYouKnowInThe')}>
    <p className="wl-eyebrow">{t('didYouKnowInThe')}</p>
    <h2>{story.awareness.hook[language]}</h2>
    <p className="wl-small">{awarenessLabels[story.awareness.kind][language]} · {t('sourceChecked')} {formatSourceDate(story.awareness.checkedAt, language)}</p>
    {language === 'th' && translateContent(story.signal, language) === story.signal && <p className="wl-small">สรุปต้นทางภาษาอังกฤษ</p>}
    <p lang={translateContent(story.signal, language) === story.signal ? 'en' : language}>{translateContent(story.signal, language)}</p>
    <WatchMedia key={story.id} story={story} language={language} />
    <p><a href={story.url} target="_blank" rel="noreferrer">{t('originalSource')}: {story.source} ↗</a> · <span>{translateContent(formatSourceDate(story.date, language), language)}</span></p>
    <div className="wl-actions">
      <button type="button" onClick={onOpenWatch}>{t('exploreAiWatch')}</button>
      {eligible.length > 1 && <button type="button" onClick={() => setIndex(current => current + 1)}>{t('anotherStory')}</button>}
      <span className="wl-small">{index % eligible.length + 1} / {eligible.length}</span>
    </div>
  </article>;
}
