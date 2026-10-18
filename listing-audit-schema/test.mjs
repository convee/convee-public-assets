import test from 'node:test';
import assert from 'node:assert/strict';
import { auditChecks, getChecks, groupChecks } from './src/index.js';

test('exports the transparent checklist', () => {
  assert.equal(auditChecks.length, 8);
  assert.equal(getChecks('images')[0].id, 'image_coverage');
  assert.equal(groupChecks().compliance[0].severity, 'high');
});
