import test from 'node:test';
import assert from 'node:assert/strict';
import { parseStoredList, parseStoredRecord } from '../app/page-storage-model.ts';

const corrupt = [null, '', '{bad', 'null', '42', '"text"', 'true'];

test('stored lists recover from missing, corrupt and non-array data without throwing', () => {
  for (const raw of [...corrupt, '{"id":"a"}']) assert.deepEqual(parseStoredList(raw, ['id']), []);
});

test('stored lists keep only entries that carry every required field', () => {
  const raw = JSON.stringify([
    { id: 'keep', groupKey: 'g', scores: {} },
    { id: 'no-scores', groupKey: 'g' },
    { id: '', groupKey: 'g', scores: {} },
    null,
    'text',
    7,
    [],
  ]);
  assert.deepEqual(parseStoredList(raw, ['id', 'groupKey', 'scores']), [{ id: 'keep', groupKey: 'g', scores: {} }]);
});

test('stored records recover from missing, corrupt, array and primitive data without throwing', () => {
  for (const raw of [...corrupt, '[]', '[{"id":"a"}]']) assert.equal(parseStoredRecord(raw), null);
});

test('stored records require their fields', () => {
  assert.equal(parseStoredRecord('{"email":"a@example.com"}', ['id']), null);
  assert.deepEqual(parseStoredRecord('{"id":"user-1","email":"a@example.com"}', ['id']), { id: 'user-1', email: 'a@example.com' });
  assert.deepEqual(parseStoredRecord('{"context":"general"}'), { context: 'general' });
});
