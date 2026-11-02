import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Home from './page';

// Pins one landmark per screen of the learner and admin app, so moving the
// screens between files and routes can be checked against today's behaviour.
// Results and per-answer feedback need a completed assessment and are checked
// by hand in the browser (see docs/TESTING.md).

async function renderApp(search = '') {
  window.history.replaceState(null, '', `/${search}`);
  const view = render(<Home />);
  // Saved state and `?view=` are applied after the first animation frame.
  await screen.findByRole('navigation', { name: 'Primary navigation' });
  await new Promise((resolve) => window.requestAnimationFrame(() => resolve(null)));
  return view;
}

function navigate(label: string) {
  fireEvent.click(within(screen.getByRole('navigation', { name: 'Primary navigation' })).getByRole('button', { name: label }));
}

const heading = (name: string) => screen.findByRole('heading', { level: 1, name });

describe('app screens', () => {
  it('opens on the home screen', async () => {
    await renderApp();
    expect(await heading('Measure practical AI readiness.')).toBeTruthy();
  });

  it.each([
    ['Assessment', 'Start with a broad profile.'],
    ['Premium', 'Add context for a deeper profile.'],
    ['Dashboard', 'Your AI readiness dashboard.'],
    ['Admin', 'Assessment intelligence console.'],
    ['AI Watch', 'What’s worth knowing. What you can try.'],
    ['AI Labs', 'Build a skill you can use.'],
  ])('the %s navigation opens its screen', async (label, title) => {
    await renderApp();
    navigate(label);
    expect(await heading(title)).toBeTruthy();
  });

  it('Home returns from another screen', async () => {
    await renderApp();
    navigate('Dashboard');
    await heading('Your AI readiness dashboard.');
    navigate('Home');
    expect(await heading('Measure practical AI readiness.')).toBeTruthy();
  });

  it.each([
    ['?view=watch', 'What’s worth knowing. What you can try.'],
    ['?view=labs', 'Build a skill you can use.'],
    ['?view=assessment', 'Start with a broad profile.'],
    ['?view=admin', 'Assessment intelligence console.'],
  ])('the legacy link %s opens its screen', async (search, title) => {
    await renderApp(search);
    expect(await heading(title)).toBeTruthy();
  });

  it('starting an assessment shows the question workbench', async () => {
    await renderApp();
    navigate('Assessment');
    await heading('Start with a broad profile.');
    fireEvent.click(screen.getByRole('button', { name: 'Build Profile and Begin 12-Question Assessment' }));
    fireEvent.click(await screen.findByRole('button', { name: 'Skip for now' }));
    await waitFor(() => expect(document.querySelector('.assessment-workbench [data-question-id]')).toBeTruthy());
  });

  it('a Practice Lab card opens that lab', async () => {
    await renderApp();
    const card = document.querySelector<HTMLButtonElement>('button.activity-card, button.room-card');
    expect(card).toBeTruthy();
    fireEvent.click(card!);
    expect(await screen.findByRole('button', { name: 'Back to Labs' })).toBeTruthy();
  });

  it('renders the home screen in Thai', async () => {
    window.localStorage.setItem('new-horizon-language-v1', 'th');
    await renderApp();
    expect(await heading('วัดความพร้อมด้าน AI ที่ใช้ได้จริง')).toBeTruthy();
  });
});
