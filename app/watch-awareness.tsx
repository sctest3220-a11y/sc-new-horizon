'use client';

import { useEffect, useState } from 'react';
import { awarenessLabels, newWatchState, parseWatchState, selectAwarenessStories } from './watch-model';
import type { WatchLanguage, WatchState, WatchStory } from './watch-model';
import WatchMedia from './watch-media';
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
  const eligible = selectAwarenessStories(stories, preferences);
  const story = eligible[index % eligible.length];
  if (!story?.awareness) return null;
  const t = (en: string, th: string) => language === 'th' ? th : en;
  return <article className="watch-learning wl-awareness wl-story" data-no-translate lang={language} aria-label={t('Did you know? In the news', 'รู้ไหม? จากข่าว AI')}>
    <p className="wl-eyebrow">{t('Did you know? In the news', 'รู้ไหม? จากข่าว AI')}</p>
    <h2>{story.awareness.hook[language]}</h2>
    <p className="wl-small">{awarenessLabels[story.awareness.kind][language]} · {t('Source checked', 'ตรวจต้นทางแล้ว')} {story.awareness.checkedAt}</p>
    {language === 'th' && <p className="wl-small">สรุปต้นทางภาษาอังกฤษ</p>}
    <p lang="en">{story.signal}</p>
    <WatchMedia key={story.id} story={story} language={language} />
    <p><a href={story.url} target="_blank" rel="noreferrer">{t('Original source', 'แหล่งข้อมูลต้นทาง')}: {story.source} ↗</a> · <span lang="en">{story.date}</span></p>
    <div className="wl-actions">
      <button type="button" onClick={onOpenWatch}>{t('Explore AI Watch', 'สำรวจ AI Watch')}</button>
      {eligible.length > 1 && <button type="button" onClick={() => setIndex(current => current + 1)}>{t('Another story', 'เรื่องถัดไป')}</button>}
      <span className="wl-small">{index % eligible.length + 1} / {eligible.length}</span>
    </div>
  </article>;
}
