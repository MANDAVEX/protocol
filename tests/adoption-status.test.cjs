const test = require('node:test');
const assert = require('node:assert/strict');
const { buildAdoptionStatus } = require('../scripts/build-adoption-status.cjs');

const registry = '0x60b9262456de011f7d15a54cdd8c48baaa8b022f';
const guard = '0x1111111111111111111111111111111111111111';
const deployedManifest = { status: 'DEPLOYED', deploymentBlock: 100, network: { mandavexGuard: guard } };

test('adoption dashboard shows blocked and unknown counts before deployment', () => {
  const snapshot = buildAdoptionStatus({ manifest: { status: 'PRE_DEPLOYMENT', deploymentBlock: null, network: { mandavexGuard: null } }, builtAt: '2026-11-27T00:00:00.000Z' });
  assert.equal(snapshot.evidenceStatus, 'BLOCKED');
  assert.equal(snapshot.scanStatus, 'NOT RUN');
  assert.equal(snapshot.guardAddress, null);
  assert.equal(snapshot.candidateCount, null);
  assert.equal(snapshot.qualifyingCount, null);
});

test('deployment without an activity scan does not invent adoption counts', () => {
  const snapshot = buildAdoptionStatus({ manifest: deployedManifest });
  assert.equal(snapshot.evidenceStatus, 'BLOCKED');
  assert.equal(snapshot.scanStatus, 'NOT RUN');
  assert.equal(snapshot.guardAddress, guard);
  assert.equal(snapshot.candidateCount, null);
  assert.equal(snapshot.qualifyingCount, null);
});

test('mainnet candidate scan stays explicitly unverified and separates official qualification', () => {
  const report = {
    evidenceStatus: 'IMPLEMENTED BUT UNVERIFIED',
    network: 56,
    guard,
    registry,
    range: { from: 100, to: 200 },
    candidateAddresses: ['0x2222222222222222222222222222222222222222'],
    candidateCount: 1,
    qualifyingCount: 0,
    qualificationNote: 'Candidates require organizer review.',
  };
  const snapshot = buildAdoptionStatus({ manifest: deployedManifest, report });
  assert.equal(snapshot.evidenceStatus, 'IMPLEMENTED BUT UNVERIFIED');
  assert.equal(snapshot.scanStatus, 'SCANNED');
  assert.equal(snapshot.candidateCount, 1);
  assert.equal(snapshot.qualifyingCount, 0);
  assert.match(snapshot.reason, /organizer review/i);
});

test('adoption dashboard rejects a fixture chain and a report for a different Guard', () => {
  const base = { evidenceStatus: 'IMPLEMENTED BUT UNVERIFIED', network: 31337, guard, registry, range: { from: 100, to: 200 }, candidateAddresses: [], candidateCount: 0, qualifyingCount: 0 };
  assert.equal(buildAdoptionStatus({ manifest: deployedManifest, report: base }).evidenceStatus, 'BLOCKED');
  assert.equal(buildAdoptionStatus({ manifest: deployedManifest, report: { ...base, network: 56, guard: '0x3333333333333333333333333333333333333333' } }).scanStatus, 'REJECTED');
  assert.equal(buildAdoptionStatus({ manifest: deployedManifest, report: { ...base, network: 56, evidenceStatus: 'FIXTURE EVIDENCE' } }).scanStatus, 'REJECTED');
});
