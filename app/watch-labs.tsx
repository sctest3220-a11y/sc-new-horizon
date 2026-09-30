'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { connectedLabs, currentLabDraft, emptyLabDraft, evaluateConnectedLab } from './connected-labs';
import { newWatchState, parseWatchState, selectWatchStories, watchLenses, watchTopics, awarenessLabels } from './watch-model';
import type { ConnectedLabId, LabDraft, WatchLanguage, WatchMedia, WatchState, WatchStory, WatchTopic, WatchView } from './watch-model';
import './watch-labs.css';
import WatchMediaInline from './watch-media';

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
  const t = (en: string, th: string) => language === 'th' ? th : en;

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
  function resetPreferences() { patch({ interests: [], mutedTopics: [], minutes: 5, goal: 'learn', media: 'all' }); setNotice(t('Preferences reset. Your saves and Lab work are kept.', 'รีเซ็ตความสนใจแล้ว รายการบันทึกและงาน Lab ยังอยู่')); }

  return (
    <section className="watch-learning" data-no-translate lang={language} aria-label={view === 'watch' ? 'AI Watch' : 'AI Labs'}>
      <div className="wl-storage" role="status">
        {storageStatus === 'loading' ? t('Loading your learning space…', 'กำลังโหลดพื้นที่เรียนรู้…') : storageStatus === 'memory'
          ? t('Browser storage is unavailable. Your changes last only while this page stays open.', 'พื้นที่จัดเก็บของเบราว์เซอร์ใช้ไม่ได้ การเปลี่ยนแปลงจะอยู่เฉพาะขณะที่เปิดหน้านี้')
          : t('Saved in this browser profile only. Use a personal browser for private learning notes.', 'บันทึกเฉพาะโปรไฟล์เบราว์เซอร์นี้ ใช้เบราว์เซอร์ส่วนตัวสำหรับบันทึกส่วนตัว')}
      </div>
      {!ready ? <p>{t('Preparing your saved stories and practice…', 'กำลังเตรียมเรื่องที่บันทึกและแบบฝึก…')}</p> : view === 'watch' ? <>
        <header className="wl-hero">
          <div><p className="wl-eyebrow">AI Watch</p><h1 ref={headingRef} tabIndex={-1}>{t('What’s worth knowing. What you can try.', 'เรื่องน่ารู้ พร้อมสิ่งที่ลองทำได้')}</h1><p>{t('Choose useful AI ideas, inspect the evidence, and take one practical next step.', 'เลือกเรื่อง AI ที่มีประโยชน์ ตรวจหลักฐาน แล้วลองทำสิ่งเล็ก ๆ ที่นำไปใช้ได้')}</p></div>
          <button type="button" onClick={() => { patch({ activeLab: null }); onViewChange('labs'); }}>{t('Open AI Labs', 'เปิด AI Labs')} →</button>
        </header>
        <div className="wl-preferences">
          <fieldset><legend>{t('Your interests · choose up to 3', 'ความสนใจ · เลือกได้ไม่เกิน 3 เรื่อง')}</legend><div className="wl-chips">
            {(Object.keys(watchTopics) as WatchTopic[]).map(topic => <button key={topic} type="button" aria-pressed={state.interests.includes(topic)} disabled={!state.interests.includes(topic) && state.interests.length >= 3} onClick={() => setState(current => ({ ...current, interests: current.interests.includes(topic) ? current.interests.filter(id => id !== topic) : [...current.interests, topic], mutedTopics: current.mutedTopics.filter(id => id !== topic) }))}>{watchTopics[topic][language]}</button>)}
          </div></fieldset>
          <div className="wl-controls">
            <div className="wl-select-field"><label htmlFor="wl-time">{t('I have', 'เวลาที่มี')}</label><select id="wl-time" value={state.minutes} onChange={event => patch({ minutes: Number(event.target.value) as WatchState['minutes'] })}>{[2, 5, 10].map(minutes => <option key={minutes} value={minutes}>{minutes} {t('minutes', 'นาที')}</option>)}</select></div>
            <div className="wl-select-field"><label htmlFor="wl-goal">{t('My goal', 'เป้าหมาย')}</label><select id="wl-goal" value={state.goal} onChange={event => patch({ goal: event.target.value as WatchState['goal'] })}><option value="learn">{t('Understand an idea', 'เข้าใจแนวคิด')}</option><option value="practice">{t('Try a skill', 'ฝึกทักษะ')}</option></select></div>
            <button type="button" className="wl-text-button" onClick={resetPreferences}>{t('Reset preferences', 'รีเซ็ตความสนใจ')}</button>
          </div>
          <p className="wl-small">{t('Time helps prioritize brief + Lab combinations. Publisher articles and videos may take longer. No assessment needed.', 'เวลาช่วยจัดลำดับสรุปพร้อม Lab บทความและวิดีโอต้นทางอาจใช้เวลานานกว่า ไม่ต้องทำ Assessment ก่อน')}</p>
          {state.mutedTopics.length > 0 && <div className="wl-chips"><span>{t('Hidden topics:', 'หัวข้อที่ซ่อน:')}</span>{state.mutedTopics.map(topic => <button type="button" key={topic} onClick={() => patch({ mutedTopics: state.mutedTopics.filter(id => id !== topic) })}>{t('Restore', 'แสดงอีกครั้ง')}: {watchTopics[topic][language]}</button>)}</div>}
        </div>
        <div className="wl-feed-toolbar">
          <div className="wl-chips" aria-label={t('Feed view', 'มุมมองเรื่อง')}>
            {(['for-you', 'explore', 'saved'] as WatchView[]).map(feed => <button type="button" key={feed} aria-pressed={state.feed === feed} onClick={() => patch({ feed })}>{feed === 'for-you' ? t('For you', 'สำหรับคุณ') : feed === 'explore' ? t('Explore', 'สำรวจ') : `${t('Saved', 'บันทึกไว้')} (${state.savedIds.length})`}</button>)}
          </div>
          {state.feed !== 'saved' && <div className="wl-select-field"><label htmlFor="wl-source-format">{t('Source format', 'รูปแบบต้นทาง')}</label><select id="wl-source-format" value={state.media} onChange={event => patch({ media: event.target.value as WatchMedia })}><option value="all">{t('All formats', 'ทุกรูปแบบ')}</option><option value="article">{t('Articles', 'บทความ')}</option><option value="video">{t('Videos', 'วิดีโอ')}</option><option value="short">{t('Short videos', 'วิดีโอสั้น')}</option></select></div>}
        </div>
        <p className="wl-editorial-note">{t('Editorial snapshot · existing manually curated content. Source dates are shown below; discovery and freshness monitoring are not connected yet.', 'ชุดเนื้อหาที่คัดไว้โดยบรรณาธิการ · แสดงวันที่ต้นทางในแต่ละเรื่อง ระบบค้นหาและตรวจความใหม่อัตโนมัติยังไม่ได้เชื่อมต่อ')}</p>
        {state.goal === 'practice' && state.minutes === 2 && <p className="wl-note">{t('Our connected Labs take about 4 minutes. Read a brief now and save the practice for later.', 'Lab ที่เชื่อมไว้ใช้เวลาประมาณ 4 นาที อ่านสรุปก่อนแล้วเก็บแบบฝึกไว้ทำภายหลังได้')}</p>}
        <div className="wl-story-grid">
          {visible.map(({ story, reason }) => {
            const saved = state.savedIds.includes(story.id);
            const linkedLab = story.relatedLab ? connectedLabs[story.relatedLab] : null;
            return <article className="wl-story" key={story.id} id={`watch-${story.id}`}>
              <p className="wl-reason">{reason === 'interest' ? `${t('Because you chose', 'เพราะคุณเลือก')} ${watchTopics[story.topic][language]}` : reason === 'practice' ? t('A brief and practice fit your available time', 'อ่านสรุปพร้อมแบบฝึกได้ในเวลาที่คุณมี') : reason === 'saved' ? t('Saved by you · topic and format filters do not hide saved items', 'คุณบันทึกไว้ · ตัวกรองหัวข้อและรูปแบบไม่ซ่อนรายการบันทึก') : reason === 'explore' ? t('A topic to explore', 'หัวข้อให้ลองสำรวจ') : t('From the editorial selection', 'จากเรื่องที่บรรณาธิการคัดไว้')}</p>
              <div className="wl-meta"><span>{watchTopics[story.topic][language]}</span><span>{story.mediaType === 'article' ? t('Article', 'บทความ') : story.mediaType === 'short' ? t('Short video', 'วิดีโอสั้น') : t('Video', 'วิดีโอ')}</span><span>{t('Brief ≈ 1 min', 'สรุป ≈ 1 นาที')}</span></div>
              <h2 lang="en">{story.title}</h2>
              {language === 'th' && <span className="wl-small" lang="th">{t('', 'หัวข้อและสรุปต้นฉบับภาษาอังกฤษ · ยังไม่มีสรุปภาษาไทยที่ผ่านการตรวจ')}</span>}
              <p lang="en">{story.signal}</p>
              {story.awareness && <p className="wl-small">{awarenessLabels[story.awareness.kind][language]} · {t('Source checked', 'ตรวจต้นทางแล้ว')} {story.awareness.checkedAt}</p>}
              <WatchMediaInline key={story.id} story={story} language={language} />
              <p className="wl-story-source"><a href={story.url} target="_blank" rel="noreferrer">{t('Original source', 'แหล่งข้อมูลต้นทาง')}: {story.source} ↗</a> · <span lang="en">{story.date}</span></p>
              {story.references?.map(reference => <p className="wl-small" key={reference.url}><a href={reference.url} target="_blank" rel="noreferrer">{reference.label} ↗</a></p>)}
              <details className="wl-story-detail"><summary>{t('Inspect the evidence and source', 'ดูข้อควรตรวจและแหล่งข้อมูล')}</summary>
                <div className="wl-evidence-cue"><strong>{t('What to notice', 'สิ่งที่ควรตรวจ')}</strong><p>{watchLenses[story.domain][language]}</p></div>
                <dl className="wl-source-details"><div><dt>{t('Publisher', 'ผู้เผยแพร่')}</dt><dd>{story.source}</dd></div><div><dt>{t('Source date', 'วันที่ต้นทาง')}</dt><dd lang="en">{story.date}</dd></div><div><dt>{t('Content version', 'เวอร์ชันเนื้อหา')}</dt><dd>{story.contentVersion}</dd></div></dl>
                <a href={story.url} target="_blank" rel="noreferrer">{t('Open original source', 'เปิดแหล่งข้อมูลต้นทาง')} ↗</a>
              </details>
              <div className="wl-actions"><button type="button" aria-pressed={saved} onClick={() => toggleSaved(story.id)}>{saved ? t('Saved', 'บันทึกแล้ว') : t('Save story', 'บันทึกเรื่อง')}</button><button type="button" className="wl-text-button" onClick={() => { patch({ mutedTopics: [...new Set([...state.mutedTopics, story.topic])] }); setNotice(t('Topic hidden from For you and Explore. Restore it in preferences above.', 'ซ่อนหัวข้อจาก สำหรับคุณ และ สำรวจ แล้ว แสดงอีกครั้งได้ในส่วนความสนใจด้านบน')); }}>{t('Hide this topic', 'ซ่อนหัวข้อนี้')}</button></div>
              {linkedLab && <div className="wl-linked-lab"><span>{t('Put the idea into practice', 'ลองนำแนวคิดไปใช้')}</span><button type="button" onClick={() => startLab(linkedLab.id, story.id)}>{linkedLab.title[language]} →</button><small>{t('About', 'ประมาณ')} {linkedLab.minutes} {t('min · separate practice scenario', 'นาที · สถานการณ์ฝึกแยกจากข่าว')}</small></div>}
            </article>;
          })}
          {state.feed === 'saved' && missingSaved.map(id => <article key={id} className="wl-story"><h2>{t('Saved story unavailable', 'เรื่องที่บันทึกยังไม่พร้อมแสดง')}</h2><p>{t('This story is no longer in this editorial snapshot. Your bookmark is kept so its removal is visible.', 'เรื่องนี้ไม่อยู่ในชุดเนื้อหาปัจจุบันแล้ว ยังเก็บรายการบันทึกไว้เพื่อแจ้งให้ทราบ')}</p><button type="button" onClick={() => toggleSaved(id)}>{t('Remove bookmark', 'ลบรายการบันทึก')}</button></article>)}
        </div>
        {!visible.length && !(state.feed === 'saved' && missingSaved.length) && <div className="wl-empty"><h2>{state.feed === 'saved' ? t('Keep your next useful idea here.', 'เก็บเรื่องที่อยากกลับมาอ่านไว้ที่นี่') : t('No stories match these choices.', 'ไม่มีเรื่องที่ตรงกับตัวเลือกนี้')}</h2><p>{state.feed === 'saved' ? t('Save a story from For you or Explore.', 'บันทึกเรื่องจาก สำหรับคุณ หรือ สำรวจ') : t('Change the source format or restore a hidden topic. We will not override your preferences to fill the feed.', 'เปลี่ยนรูปแบบต้นทางหรือแสดงหัวข้อที่ซ่อน ระบบจะไม่เปลี่ยนความสนใจของคุณเองเพื่อเติมรายการ')}</p></div>}
        {state.feed === 'for-you' && recommendations.length > 3 && <button className="wl-more" type="button" onClick={() => patch({ feed: 'explore' })}>{t('Explore more stories', 'สำรวจเรื่องเพิ่มเติม')}</button>}
      </> : activeLab && draft && evaluation ? <>
        <div className="wl-actions"><button type="button" onClick={() => patch({ activeLab: null })}>← {t('All Labs', 'Lab ทั้งหมด')}</button><button type="button" onClick={returnToWatch}>{activeOrigin ? t('Back to story', 'กลับไปที่เรื่อง') : t('Back to AI Watch', 'กลับ AI Watch')}</button></div>
        <header className="wl-hero"><div><p className="wl-eyebrow">AI Labs · {activeLab.minutes} {t('min estimate', 'นาที โดยประมาณ')}</p><h1 ref={headingRef} tabIndex={-1}>{activeLab.title[language]}</h1><p>{activeLab.goal[language]}</p></div></header>
        <p className="wl-note">{t('Starter practice · not a scored assessment. Your work stays in this browser. No account or AI service is required.', 'แบบฝึกเริ่มต้น · ไม่ใช่ Assessment ที่คิดคะแนน งานอยู่ในเบราว์เซอร์นี้ ไม่ต้องมีบัญชีหรือใช้บริการ AI')}</p>
        {state.drafts[activeLab.id] && state.drafts[activeLab.id]?.version !== activeLab.version && <p className="wl-note">{t('This Lab has changed. Start a fresh attempt against the current criteria; the earlier completion does not carry over.', 'Lab นี้มีการเปลี่ยนแปลง ให้เริ่มทำตามเกณฑ์ปัจจุบัน ผลสำเร็จจากเวอร์ชันก่อนจะไม่ถูกนำมาใช้')}</p>}
        <div className="wl-lab-layout"><article className="wl-panel"><p className="wl-eyebrow">{t('Inspect', 'ตรวจหลักฐาน')}</p><h2>{activeLab.evidenceTitle[language]}</h2><ol className="wl-evidence-list">{activeLab.evidence.map((line, i) => <li key={i}>{line[language]}</li>)}</ol><p className="wl-small">{t('Original fictional training scenario', 'สถานการณ์สมมติที่สร้างเพื่อการฝึก')} · {activeLab.version}</p></article>
          <article className="wl-panel"><p className="wl-eyebrow">{t('Decide and revise', 'ตัดสินใจแล้วปรับปรุง')}</p><p>{activeLab.instructions[language]}</p>
            {activeLab.criteria.map(criterion => <fieldset className="wl-criterion" key={criterion.id}><legend>{criterion.prompt[language]}</legend>{criterion.choices.map(choice => <label key={choice.id}><input type="radio" name={`${activeLab.id}-${criterion.id}`} value={choice.id} checked={draft.answers[criterion.id] === choice.id} onChange={() => updateDraft({ answers: { ...draft.answers, [criterion.id]: choice.id }, checked: false, takeawaySaved: false })} /><span>{choice.label[language]}</span></label>)}</fieldset>)}
            <label className="wl-note-input">{t('Your reasoning (optional, not automatically graded)', 'เหตุผลของคุณ (ไม่บังคับและไม่ตรวจคะแนนอัตโนมัติ)')}<textarea value={draft.note} maxLength={2000} onChange={event => updateDraft({ note: event.target.value })} rows={3} /></label>
            <div className="wl-actions"><button className="wl-primary" type="button" disabled={!evaluation.ready} onClick={() => updateDraft({ checked: true })}>{t('Check my decisions', 'ตรวจคำตอบของฉัน')}</button><button type="button" onClick={() => updateDraft(emptyLabDraft(activeLab))}>{t('Start again', 'เริ่มใหม่')}</button></div>
          </article>
        </div>
        {draft.checked && <section className="wl-feedback" aria-live="polite"><h2>{evaluation.complete ? t('Both practice criteria met', 'ผ่านเกณฑ์แบบฝึกทั้งสองข้อ') : t('Review the evidence, then try again', 'ทบทวนหลักฐานแล้วลองอีกครั้ง')}</h2>{evaluation.criteria.map(({ criterion, choice, met }) => <div className="wl-feedback-row" key={criterion.id}><strong>{met ? t('Met', 'ผ่าน') : t('Revisit', 'ทบทวน')}: {criterion.prompt[language]}</strong><p>{choice?.feedback[language]}</p></div>)}<p>{activeLab.debrief[language]}</p><p className="wl-small">{t('This records practice only. It does not change your readiness score or certify mastery.', 'บันทึกนี้แสดงการฝึกเท่านั้น ไม่เปลี่ยนคะแนนความพร้อมหรือรับรองความเชี่ยวชาญ')}</p>
          {evaluation.complete && <div className="wl-takeaway"><h3>{t('A checklist to reuse', 'Checklist ที่นำไปใช้ต่อได้')}</h3><p>{activeLab.takeaway[language]}</p><button type="button" aria-pressed={draft.takeawaySaved} onClick={() => updateDraft({ takeawaySaved: !draft.takeawaySaved })}>{draft.takeawaySaved ? t('Takeaway saved · click to remove', 'บันทึกแล้ว · กดเพื่อลบ') : t('Save takeaway', 'บันทึก Checklist')}</button></div>}
        </section>}
      </> : <>
        <header className="wl-hero"><div><p className="wl-eyebrow">AI Labs</p><h1 ref={headingRef} tabIndex={-1}>{t('Build a skill you can use.', 'ฝึกทักษะที่นำไปใช้ได้')}</h1><p>{t('Inspect a realistic situation, make a decision, and improve it with specific feedback.', 'ตรวจสถานการณ์ที่สมจริง ตัดสินใจ แล้วปรับปรุงจากคำแนะนำที่ชัดเจน')}</p></div><button type="button" onClick={() => onViewChange('watch')}>AI Watch →</button></header>
        <p className="wl-note">{t('Two starter Labs · estimated 4 minutes each · English and Thai · no assessment required', 'Lab เริ่มต้นสองเรื่อง · ประมาณเรื่องละ 4 นาที · ภาษาอังกฤษและไทย · ไม่ต้องทำ Assessment ก่อน')}</p>
        {startedLabs.length > 0 && <section className="wl-resume"><h2>{t('Continue your practice', 'ทำแบบฝึกต่อ')}</h2><div className="wl-chips">{startedLabs.map(lab => <button type="button" key={lab.id} onClick={() => startLab(lab.id)}>{lab.title[language]} →</button>)}</div></section>}
        <div className="wl-story-grid">{Object.values(connectedLabs).map(lab => { const saved = currentLabDraft(lab, state.drafts[lab.id]); return <article className="wl-story" key={lab.id}><span className="wl-meta">{lab.minutes} {t('min · starter practice', 'นาที · แบบฝึกเริ่มต้น')}</span><h2>{lab.title[language]}</h2><p>{lab.goal[language]}</p><button type="button" className="wl-primary" onClick={() => startLab(lab.id)}>{Object.keys(saved.answers).length ? t('Resume Lab', 'ทำ Lab ต่อ') : t('Start Lab', 'เริ่ม Lab')}</button>{saved.takeawaySaved && <div className="wl-takeaway"><h3>{t('Saved takeaway', 'Checklist ที่บันทึก')}</h3><p>{lab.takeaway[language]}</p></div>}</article>; })}</div>
        <div className="wl-legacy"><h2>{t('More practice samples', 'ตัวอย่างแบบฝึกเพิ่มเติม')}</h2><p>{t('Explore the existing prompt, matching, media, and workflow activities. These older samples use simpler feedback.', 'สำรวจแบบฝึก Prompt การจับคู่ สื่อ และ Workflow ที่มีอยู่ ตัวอย่างเดิมเหล่านี้ใช้คำแนะนำแบบพื้นฐาน')}</p><button type="button" onClick={onLegacyLabs}>{t('Open practice samples', 'เปิดตัวอย่างแบบฝึก')}</button></div>
      </>}
      <p role="status" className="wl-notice">{notice}</p>
      {ready && <details className="wl-data-controls"><summary>{t('Your browser data', 'ข้อมูลในเบราว์เซอร์ของคุณ')}</summary><p>{t('Saved stories, preferences, Lab answers, and notes are stored together for this browser profile. They are not sent to an AI service or synced across devices.', 'เรื่องที่บันทึก ความสนใจ คำตอบ Lab และบันทึกส่วนตัว เก็บไว้ในโปรไฟล์เบราว์เซอร์นี้ ไม่ส่งไปยังบริการ AI และไม่ซิงก์ข้ามอุปกรณ์')}</p>{clearRequested ? <div className="wl-actions"><strong>{t('Clear all Watch and Lab data in this browser profile?', 'ล้างข้อมูล Watch และ Lab ทั้งหมดในโปรไฟล์เบราว์เซอร์นี้?')}</strong><button type="button" onClick={() => { setState(newWatchState()); setClearRequested(false); setNotice(t('Watch and Lab data cleared for this browser profile.', 'ล้างข้อมูล Watch และ Lab ในโปรไฟล์เบราว์เซอร์นี้แล้ว')); }}>{t('Clear data', 'ล้างข้อมูล')}</button><button type="button" onClick={() => setClearRequested(false)}>{t('Cancel', 'ยกเลิก')}</button></div> : <button type="button" onClick={() => setClearRequested(true)}>{t('Clear this learning data', 'ล้างข้อมูลการเรียนรู้นี้')}</button>}</details>}
    </section>
  );
}
