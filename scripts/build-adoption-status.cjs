const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const registry = '0x60b9262456de011f7d15a54cdd8c48baaa8b022f';

function buildAdoptionStatus({ manifest, report = null, builtAt = new Date().toISOString() }) {
  const guardAddress = manifest?.network?.mandavexGuard || null;
  const deploymentBlock = manifest?.deploymentBlock;
  const deployed = manifest?.status === 'DEPLOYED'
    && /^0x[0-9a-f]{40}$/i.test(guardAddress || '')
    && Number.isSafeInteger(deploymentBlock)
    && deploymentBlock >= 0;
  const base = {
    network: 'BNB Smart Chain',
    chainId: 56,
    guardAddress: deployed ? guardAddress : null,
    deploymentBlock: deployed ? deploymentBlock : null,
    builtAt,
    candidateCount: null,
    qualifyingCount: null,
  };
  if (!deployed) return {
    ...base,
    evidenceStatus: 'BLOCKED',
    scanStatus: 'NOT RUN',
    reason: 'No deployed MANDAVEX Guard is recorded. A mainnet adoption scan cannot run.',
  };
  if (!report) return {
    ...base,
    evidenceStatus: 'BLOCKED',
    scanStatus: 'NOT RUN',
    reason: 'A deployment is recorded, but no saved adoption scan is available.',
  };

  const candidates = report.candidateAddresses;
  const reportMatches = Number(report.network) === 56
    && report.evidenceStatus === 'IMPLEMENTED BUT UNVERIFIED'
    && typeof report.guard === 'string'
    && report.guard.toLowerCase() === guardAddress.toLowerCase()
    && typeof report.registry === 'string'
    && report.registry.toLowerCase() === registry
    && Number.isSafeInteger(report.range?.from)
    && Number.isSafeInteger(report.range?.to)
    && report.range.from >= deploymentBlock
    && report.range.to >= report.range.from
    && Array.isArray(candidates)
    && candidates.every((address) => /^0x[0-9a-f]{40}$/i.test(address))
    && new Set(candidates.map((address) => address.toLowerCase())).size === candidates.length
    && report.candidateCount === candidates.length
    && Number.isSafeInteger(report.qualifyingCount)
    && report.qualifyingCount >= 0
    && report.qualifyingCount <= report.candidateCount;
  if (!reportMatches) return {
    ...base,
    evidenceStatus: 'BLOCKED',
    scanStatus: 'REJECTED',
    reason: 'The saved scan does not match the deployed Guard, BNB network, registry, or address counts.',
  };

  return {
    ...base,
    evidenceStatus: 'IMPLEMENTED BUT UNVERIFIED',
    scanStatus: 'SCANNED',
    scanRange: report.range,
    candidateCount: report.candidateCount,
    qualifyingCount: report.qualifyingCount,
    reason: report.qualificationNote || 'Candidates are indexer observations, not an official competition determination.',
  };
}

function readOptionalJson(file) {
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function generate() {
  const manifest = JSON.parse(fs.readFileSync(path.join(root, 'deployments/manifest.json'), 'utf8'));
  const report = readOptionalJson(path.join(root, 'evidence/adoption-activity.json'));
  const status = buildAdoptionStatus({ manifest, report });
  fs.writeFileSync(path.join(root, 'apps/web/adoption-status.json'), `${JSON.stringify(status, null, 2)}\n`);
  console.log(`Adoption evidence dashboard: ${status.evidenceStatus} · ${status.scanStatus}`);
  return status;
}

if (require.main === module) generate();
module.exports = { buildAdoptionStatus, generate };
