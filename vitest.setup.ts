import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Unmount rendered components and clear browser storage between tests, so no
// test sees another test's state.
afterEach(() => {
  cleanup();
  window.localStorage.clear();
});
