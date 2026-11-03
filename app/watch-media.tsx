'use client';

import { watchTranslator } from '../i18n/messages';
import { useState, useMemo } from 'react';
import { youtubePlayerUrl } from './watch-model';
import type { WatchLanguage, WatchStory } from './watch-model';

/** Publisher media stays inside its story, with attribution and a link fallback. */
export default function WatchMedia({ story, language }: { story: WatchStory; language: WatchLanguage }) {
  const [imageFailed, setImageFailed] = useState(false);
  const [loadVideo, setLoadVideo] = useState(false);
  const player = story.embedVideo ? youtubePlayerUrl(story.url) : null;
  const t = useMemo(() => watchTranslator(language), [language]);
  return <>
    {story.articleImage && <figure className="wl-source-image">
      {!imageFailed ? <>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={story.articleImage.url} alt={story.articleImage.alt} loading="lazy" referrerPolicy="no-referrer" onError={() => setImageFailed(true)} />
      </> : <p>{t('publisherImageUnavailableViewIt')}</p>}
      <figcaption><a href={story.url} target="_blank" rel="noreferrer" lang="en">{story.articleImage.credit}</a></figcaption>
    </figure>}
    {story.mediaType !== 'article' && <div className="wl-media">
      {player && loadVideo ? <iframe src={player} title={story.title} referrerPolicy="strict-origin-when-cross-origin" allow="encrypted-media; picture-in-picture; fullscreen" allowFullScreen /> : <>
        <p>{player ? t('watchTheSourceVideoHere') : t('watchThisItemOnThe')}</p>
        {player && <button type="button" onClick={() => setLoadVideo(true)}>{t('loadVideo')}</button>}
      </>}
      <a href={story.url} target="_blank" rel="noreferrer">{t('videoSource')}: {story.source} ↗</a>
      <p className="wl-small">{t('ifPlaybackIsUnavailableOpen')}</p>
    </div>}
  </>;
}
