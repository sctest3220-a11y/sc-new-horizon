export type WatchLanguage = 'en' | 'th';
export type Bilingual = { en: string; th: string };
export type WatchTopic = 'agents' | 'trust' | 'models' | 'robotics' | 'work' | 'coding' | 'commerce' | 'security' | 'multimodal' | 'research' | 'governance' | 'education';
export type ConnectedLabId = 'agent-boundaries' | 'evidence-check';
export type WatchMedia = 'all' | 'article' | 'video' | 'short';
export type WatchView = 'for-you' | 'explore' | 'saved';

export type WatchStory = {
  id: string;
  contentVersion: string;
  topic: WatchTopic;
  relatedTopics?: WatchTopic[];
  relatedLab?: ConnectedLabId;
  awareness?: { hook: Bilingual; kind: 'reported-case' | 'simulation' | 'model-release' | 'product-launch' | 'industry-analysis'; checkedAt: string };
  references?: { label: string; url: string }[];
  category: string;
  title: string;
  source: string;
  date: string;
  url: string;
  domain: 'D1' | 'D2' | 'D3' | 'D4' | 'D5' | 'D6';
  signal: string;
  mediaType: Exclude<WatchMedia, 'all'>;
  duration?: string;
  embedVideo?: boolean;
  articleImage?: { url: string; alt: string; credit: string };
  publisherVideo?: { url: string; credit: string };
  publisherType?: 'official' | 'standards' | 'research' | 'news';
};

export const watchTopics: Record<WatchTopic, Bilingual> = {
  coding: { en: 'Coding and software', th: 'การเขียนโค้ดและซอฟต์แวร์' },
  commerce: { en: 'Shopping and commerce', th: 'การซื้อสินค้าและการค้า' },
  security: { en: 'Security and privacy', th: 'ความปลอดภัยและความเป็นส่วนตัว' },
  multimodal: { en: 'Images, video and voice', th: 'ภาพ วิดีโอ และเสียง' },
  research: { en: 'Research and benchmarks', th: 'งานวิจัยและการทดสอบเปรียบเทียบ' },
  governance: { en: 'Policy and governance', th: 'นโยบายและการกำกับดูแล' },
  education: { en: 'Learning and education', th: 'การเรียนรู้และการศึกษา' },
  agents: { en: 'Work with agents', th: 'ทำงานกับ Agent' },
  trust: { en: 'Check claims and risks', th: 'ตรวจสอบข้ออ้างและความเสี่ยง' },
  models: { en: 'Understand AI capabilities', th: 'เข้าใจความสามารถของ AI' },
  robotics: { en: 'Robots in the real world', th: 'หุ่นยนต์ในโลกจริง' },
  work: { en: 'AI at work', th: 'AI ในการทำงาน' },
};

export const watchLenses: Record<WatchStory['domain'], Bilingual> = {
  D1: { en: 'Which capability was demonstrated, and what does the evidence not prove?', th: 'แสดงความสามารถอะไร และหลักฐานนี้ยังพิสูจน์อะไรไม่ได้?' },
  D2: { en: 'Which tools can act, and where must a person review the work?', th: 'เครื่องมือใดลงมือทำได้ และขั้นตอนไหนต้องให้คนตรวจสอบ?' },
  D3: { en: 'Does the source, sample, and comparison support the headline?', th: 'แหล่งข้อมูล กลุ่มตัวอย่าง และวิธีเปรียบเทียบ รองรับพาดหัวหรือไม่?' },
  D4: { en: 'What permissions, safeguards, and accountable person are needed?', th: 'ต้องมีสิทธิ์ใช้งาน มาตรการป้องกัน และผู้รับผิดชอบอย่างไร?' },
  D5: { en: 'Which outcome changes, at what cost, and with what evidence?', th: 'ผลลัพธ์อะไรเปลี่ยนไป มีต้นทุนเท่าไร และมีหลักฐานอะไร?' },
  D6: { en: 'How do responsibilities and human review change when AI joins the task?', th: 'เมื่อใช้ AI หน้าที่รับผิดชอบและการตรวจสอบโดยคนเปลี่ยนอย่างไร?' },
};

export type LabDraft = {
  version: string;
  answers: Record<string, string>;
  note: string;
  checked: boolean;
  takeawaySaved: boolean;
};

export type WatchState = {
  version: 1;
  interests: WatchTopic[];
  mutedTopics: WatchTopic[];
  savedIds: string[];
  minutes: 2 | 5 | 10;
  goal: 'learn' | 'practice';
  feed: WatchView;
  media: WatchMedia;
  drafts: Partial<Record<ConnectedLabId, LabDraft>>;
  activeLab: ConnectedLabId | null;
  originStoryId: string | null;
};

export function newWatchState(): WatchState {
  return { version: 1, interests: [], mutedTopics: [], savedIds: [], minutes: 5, goal: 'learn', feed: 'for-you', media: 'all', drafts: {}, activeLab: null, originStoryId: null };
}

export function isLabId(value: unknown): value is ConnectedLabId {
  return value === 'agent-boundaries' || value === 'evidence-check';
}

const object = (value: unknown): Record<string, unknown> => value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : {};
const shortStrings = (value: unknown, max = 200) => Array.isArray(value) ? [...new Set(value.filter((v): v is string => typeof v === 'string' && v.length > 0 && v.length <= 120))].slice(0, max) : [];
const topics = (value: unknown) => shortStrings(value).filter((id): id is WatchTopic => Object.hasOwn(watchTopics, id));

export function parseWatchState(raw: string | null): WatchState {
  const fallback = newWatchState();
  if (!raw) return fallback;
  try {
    const data = object(JSON.parse(raw));
    if (data.version !== 1) return fallback;
    const drafts: WatchState['drafts'] = {};
    for (const [id, value] of Object.entries(object(data.drafts))) {
      if (!isLabId(id)) continue;
      const draft = object(value);
      if (typeof draft.version !== 'string' || draft.version.length > 80) continue;
      const answers = Object.fromEntries(Object.entries(object(draft.answers))
        .filter(([key, value]) => /^[a-z0-9-]{1,60}$/.test(key) && typeof value === 'string' && /^[a-z0-9-]{1,60}$/.test(value))
        .slice(0, 20)) as Record<string, string>;
      drafts[id] = { version: draft.version, answers, note: typeof draft.note === 'string' ? draft.note.slice(0, 2000) : '', checked: draft.checked === true, takeawaySaved: draft.takeawaySaved === true };
    }
    return {
      ...fallback,
      interests: topics(data.interests), mutedTopics: topics(data.mutedTopics), savedIds: shortStrings(data.savedIds),
      minutes: data.minutes === 2 || data.minutes === 10 ? data.minutes : 5,
      goal: data.goal === 'practice' ? 'practice' : 'learn',
      feed: data.feed === 'explore' || data.feed === 'saved' ? data.feed : 'for-you',
      media: data.media === 'article' || data.media === 'video' || data.media === 'short' ? data.media : 'all',
      activeLab: isLabId(data.activeLab) ? data.activeLab : null,
      originStoryId: typeof data.originStoryId === 'string' && data.originStoryId.length <= 120 ? data.originStoryId : null,
      drafts,
    };
  } catch { return fallback; }
}

export type RecommendationReason = 'interest' | 'practice' | 'explore' | 'saved' | 'balanced';
export type WatchRecommendation = { story: WatchStory; reason: RecommendationReason };

export function storyTopics(story: WatchStory): WatchTopic[] {
  return [story.topic, ...(story.relatedTopics ?? [])];
}

/** Ranks the editorial snapshot; no assessment evidence or inferred weaknesses are used. */
export function selectWatchStories(stories: WatchStory[], state: WatchState, labMinutes: Record<ConnectedLabId, number>): WatchRecommendation[] {
  const eligible = stories.filter(story => state.feed === 'saved'
    ? state.savedIds.includes(story.id)
    : !storyTopics(story).some(topic => state.mutedTopics.includes(topic)) && (state.media === 'all' || story.mediaType === state.media));
  if (state.feed === 'saved') return eligible.map(story => ({ story, reason: 'saved' }));
  if (state.feed === 'explore') return eligible.map(story => ({ story, reason: 'explore' }));
  const canPractise = (story: WatchStory) => story.relatedLab && labMinutes[story.relatedLab] + 1 <= state.minutes;
  const ranked = eligible.map((story, order) => ({ story, order, score: (storyTopics(story).some(topic => state.interests.includes(topic)) ? 4 : 0) + (state.goal === 'practice' && canPractise(story) ? 2 : 0) }))
    .sort((a, b) => b.score - a.score || a.order - b.order);
  // Keep one exploratory pick, favoring a different medium when eligible supply allows it.
  if (ranked.length > 2) {
    const candidates = ranked.flatMap((entry, index) => index >= 2 && !storyTopics(entry.story).some(topic => state.interests.includes(topic)) ? [{ ...entry, index }] : []);
    const varied = ranked[0].story.mediaType === ranked[1].story.mediaType
      ? candidates.find(entry => entry.story.mediaType !== ranked[0].story.mediaType)
      : undefined;
    const exploratoryIndex = (varied ?? candidates[0])?.index ?? -1;
    if (exploratoryIndex > 2) ranked.splice(2, 0, ranked.splice(exploratoryIndex, 1)[0]);
  }
  return ranked.map(({ story }) => ({ story, reason: storyTopics(story).some(topic => state.interests.includes(topic)) ? 'interest' : state.goal === 'practice' && canPractise(story) ? 'practice' : state.interests.length ? 'explore' : 'balanced' }));
}

export function youtubePlayerUrl(raw: string): string | null {
  try {
    const url = new URL(raw);
    if (url.protocol !== 'https:' || !['youtube.com', 'www.youtube.com', 'youtu.be'].includes(url.hostname)) return null;
    const id = url.hostname === 'youtu.be' ? url.pathname.slice(1) : url.pathname === '/watch' ? url.searchParams.get('v') : url.pathname.startsWith('/shorts/') ? url.pathname.split('/')[2] : null;
    return id && /^[\w-]{11}$/.test(id) ? `https://www.youtube-nocookie.com/embed/${id}?autoplay=0` : null;
  } catch { return null; }
}

export const awarenessLabels = {
  'reported-case': { en: 'Reported case', th: 'กรณีที่มีรายงาน' },
  simulation: { en: 'Research simulation', th: 'งานวิจัยจำลอง' },
  'model-release': { en: 'Model announcement', th: 'ประกาศ Model' },
  'product-launch': { en: 'AI product launch', th: 'เปิดตัวผลิตภัณฑ์ AI' },
  'industry-analysis': { en: 'Independent analysis', th: 'บทวิเคราะห์อิสระ' },
} as const;

/** Only explicitly curated awareness stories are eligible; hidden topics remain hidden. */
export function selectAwarenessStories(stories: WatchStory[], state: WatchState): WatchStory[] {
  return selectWatchStories(stories.filter(story => story.awareness), { ...state, feed: 'for-you', media: 'all' }, { 'agent-boundaries': 4, 'evidence-check': 4 }).map(item => item.story);
}
