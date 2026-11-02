import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import WatchLabs from './watch-labs';
import { newWatchState, watchTopics, type WatchStory } from './watch-model';

const story = (id: string, topic: WatchStory['topic']): WatchStory => ({
  id, contentVersion: `${id}@1`, topic, category: 'News', title: `Story ${id}`, source: 'Example', date: '2026-09-01',
  url: `https://example.com/${id}`, domain: 'D1', signal: `Summary of ${id}`, mediaType: 'article',
});
const stories = [story('one', 'agents'), story('two', 'trust'), story('three', 'models'), story('four', 'work')];
const storageKey = (owner: string) => `new-horizon-watch-labs-v1:${owner}`;

function renderWatch(overrides: Partial<Parameters<typeof WatchLabs>[0]> = {}) {
  const props = { stories, language: 'en' as const, ownerId: 'owner-a', view: 'watch' as const, onViewChange: vi.fn(), onLegacyLabs: vi.fn(), ...overrides };
  return { props, ...render(<WatchLabs {...props} />) };
}

const interestButton = (topic: keyof typeof watchTopics) => screen.getByRole('button', { name: watchTopics[topic].en });

describe('WatchLabs', () => {
  it('shows a loading state first, then the restored Watch view', async () => {
    renderWatch();
    expect(screen.getByText('Preparing your saved stories and practice…')).toBeTruthy();
    expect(await screen.findByRole('heading', { level: 1, name: 'What’s worth knowing. What you can try.' })).toBeTruthy();
  });

  it('restores saved interests for this owner only', async () => {
    window.localStorage.setItem(storageKey('owner-a'), JSON.stringify({ ...newWatchState(), interests: ['trust'] }));
    renderWatch();
    await waitFor(() => expect(interestButton('trust').getAttribute('aria-pressed')).toBe('true'));
    expect(interestButton('agents').getAttribute('aria-pressed')).toBe('false');
  });

  it('does not show another owner’s saved state', async () => {
    window.localStorage.setItem(storageKey('owner-a'), JSON.stringify({ ...newWatchState(), interests: ['trust'] }));
    renderWatch({ ownerId: 'owner-b' });
    await screen.findByRole('heading', { level: 1 });
    expect(interestButton('trust').getAttribute('aria-pressed')).toBe('false');
  });

  it('saves a chosen interest to this owner’s storage key', async () => {
    renderWatch();
    await screen.findByRole('heading', { level: 1 });
    fireEvent.click(interestButton('agents'));
    await waitFor(() => expect(JSON.parse(window.localStorage.getItem(storageKey('owner-a')) ?? '{}').interests).toEqual(['agents']));
  });

  it('allows at most three interests', async () => {
    renderWatch();
    await screen.findByRole('heading', { level: 1 });
    for (const topic of ['agents', 'trust', 'models'] as const) fireEvent.click(interestButton(topic));
    const fourth = (Object.keys(watchTopics) as (keyof typeof watchTopics)[]).find(topic => !['agents', 'trust', 'models'].includes(topic))!;
    expect((interestButton(fourth) as HTMLButtonElement).disabled).toBe(true);
  });

  it('recovers from corrupt storage with defaults instead of crashing', async () => {
    window.localStorage.setItem(storageKey('owner-a'), '{not json');
    renderWatch();
    await screen.findByRole('heading', { level: 1 });
    expect(interestButton('agents').getAttribute('aria-pressed')).toBe('false');
  });

  it('tells the user when storage is unavailable and keeps working in memory', async () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('blocked'); });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('blocked'); });
    renderWatch();
    expect(await screen.findByText(/Browser storage is unavailable/)).toBeTruthy();
    fireEvent.click(interestButton('agents'));
    expect(interestButton('agents').getAttribute('aria-pressed')).toBe('true');
  });

  it('renders Thai copy when the language is Thai', async () => {
    renderWatch({ language: 'th' });
    expect(await screen.findByRole('heading', { level: 1, name: 'เรื่องน่ารู้ พร้อมสิ่งที่ลองทำได้' })).toBeTruthy();
  });

  it('asks the parent to switch to Labs from the Watch header', async () => {
    const { props } = renderWatch();
    await screen.findByRole('heading', { level: 1 });
    fireEvent.click(screen.getByRole('button', { name: /Open AI Labs/ }));
    expect(props.onViewChange).toHaveBeenCalledWith('labs');
  });

  it('marks its subtree so the legacy translation pass leaves it alone', () => {
    const { container } = renderWatch();
    expect(container.querySelector('section.watch-learning')?.hasAttribute('data-no-translate')).toBe(true);
  });
});
