'use client';

import { useState } from 'react';
import { youtubePlayerUrl } from './watch-model';
import type { WatchLanguage, WatchStory } from './watch-model';

/** Publisher media stays inside its story, with attribution and a link fallback. */
export default function WatchMedia({ story, language }: { story: WatchStory; language: WatchLanguage }) {
  const [imageFailed, setImageFailed] = useState(false);
  const player = story.mediaType !== 'article' ? youtubePlayerUrl(story.url) : null;
  const t = (en: string, th: string) => language === 'th' ? th : en;
  return <>
    {story.articleImage && <figure className="wl-source-image">
      {!imageFailed ? <>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={story.articleImage.url} alt={story.articleImage.alt} loading="eager" referrerPolicy="no-referrer" onError={() => setImageFailed(true)} />
      </> : <p>{t('Publisher image unavailable. View it at the original source.', 'โหลดภาพไม่ได้ ดูภาพได้ที่แหล่งข้อมูลต้นทาง')}</p>}
      <figcaption><a href={story.url} target="_blank" rel="noreferrer" lang="en">{story.articleImage.credit}</a></figcaption>
    </figure>}
    {story.publisherVideo && <div className="wl-media">
      <video controls playsInline preload="metadata" aria-label={story.title} poster={story.articleImage?.url}>
        <source src={story.publisherVideo.url} type="video/mp4" />
      </video>
      <a href={story.url} target="_blank" rel="noreferrer">{story.publisherVideo.credit} ↗</a>
    </div>}
    {story.mediaType !== 'article' && !story.publisherVideo && <div className="wl-media">
      {player ? <iframe src={player} title={story.title} referrerPolicy="strict-origin-when-cross-origin" allow="encrypted-media; picture-in-picture; fullscreen" allowFullScreen /> : <>
        <p>{t('Watch this item on the publisher’s page.', 'ดูวิดีโอนี้บนหน้าของผู้เผยแพร่')}</p>
      </>}
      <a href={story.url} target="_blank" rel="noreferrer">{t('Video source', 'แหล่งวิดีโอ')}: {story.source} ↗</a>
      <p className="wl-small">{t('If playback is unavailable, open the source. Duration and captions have not been verified.', 'หากเล่นไม่ได้ ให้เปิดต้นทาง ยังไม่ได้ยืนยันความยาวและคำบรรยาย')}</p>
    </div>}
  </>;
}
