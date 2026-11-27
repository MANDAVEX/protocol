const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { ContractFactory } = require('ethers');
const { contract } = require('./compile-contract.cjs');
const solc = require('solc');
const { AGENT_ID_BSC } = require('../packages/sdk/index.cjs');

const root = path.resolve(__dirname, '..');
const releaseDir = path.join(root, 'releases/mandavex-guard-rc1');
const sha256 = (value) => crypto.createHash('sha256').update(value).digest('hex');

async function packageRelease() {
  const sourcePath = path.join(root, 'contracts/src/MandavexGuard.sol');
  const source = fs.readFileSync(sourcePath);
  const manifest = JSON.parse(fs.readFileSync(path.join(root, 'deployments/manifest.json'), 'utf8'));
  const estimate = JSON.parse(fs.readFileSync(path.join(root, 'evidence/bsc-mainnet-deployment-estimate.json'), 'utf8'));
  const gitHead = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim();
  const sourceTreeCleanBeforePackaging = execFileSync('git', ['status', '--porcelain'], { cwd: root, encoding: 'utf8' }).trim() === '';
  const bytecodeHex = `0x${contract.evm.bytecode.object}`;
  const factory = new ContractFactory(contract.abi, bytecodeHex);
  const deployment = await factory.getDeployTransaction(AGENT_ID_BSC);
  const initCode = deployment.data;
  if (manifest.status !== 'PRE_DEPLOYMENT' || manifest.network?.mandavexGuard) {
    throw new Error('Release packager expects the checked-in pre-deployment manifest; review deployment state before packaging');
  }
  const release = {
    evidenceStatus: 'IMPLEMENTED BUT UNVERIFIED',
    releaseStatus: 'RELEASE_CANDIDATE · NOT APPROVED FOR MAINNET',
    sourceCommit: gitHead,
    sourceTreeCleanBeforePackaging,
    sourcePath: 'contracts/src/MandavexGuard.sol',
    sourceSha256: sha256(source),
    compiler: solc.version(),
    compilerSettings: { optimizer: { enabled: true, runs: 200 }, evmVersion: 'paris' },
    network: 'BNB Smart Chain',
    chainId: 56,
    constructorArguments: [AGENT_ID_BSC],
    creationBytecodeBytes: (bytecodeHex.length - 2) / 2,
    creationBytecodeSha256: sha256(Buffer.from(bytecodeHex.slice(2), 'hex')),
    deploymentInitCodeBytes: (initCode.length - 2) / 2,
    deploymentInitCodeSha256: sha256(Buffer.from(initCode.slice(2), 'hex')),
    deploymentEstimate: {
      evidenceStatus: estimate.evidenceStatus,
      blockNumber: estimate.blockNumber,
      gasEstimate: estimate.gasEstimate,
      gasLimitWith20PercentHeadroom: estimate.gasLimitWith20PercentHeadroom,
      sampledFeePerGasWei: estimate.feePerGasWeiAtPreparation,
      estimatedExecutionFeeBNB: estimate.estimatedExecutionFeeBNBAtGasEstimate,
      recommendedReserveBNB: estimate.recommendedFundingReserveBNBAtPreparedGasLimit,
    },
    mainnetReadiness: {
      approvedForMainnet: false,
      deploymentTransactionSent: false,
      independentSecurityReview: false,
      reviewedDeploymentAddress: null,
      qualifyingInteractions: 0,
    },
    artifacts: ['MandavexGuard.abi.json', 'MandavexGuard.creation-bytecode.txt', 'deployment-init-code.txt'],
  };
  fs.mkdirSync(releaseDir, { recursive: true });
  fs.writeFileSync(path.join(releaseDir, 'MandavexGuard.abi.json'), `${JSON.stringify(contract.abi, null, 2)}\n`);
  fs.writeFileSync(path.join(releaseDir, 'MandavexGuard.creation-bytecode.txt'), `${bytecodeHex}\n`);
  fs.writeFileSync(path.join(releaseDir, 'deployment-init-code.txt'), `${initCode}\n`);
  fs.writeFileSync(path.join(releaseDir, 'release.json'), `${JSON.stringify(release, null, 2)}\n`);
  process.stdout.write(`${JSON.stringify({ status: release.releaseStatus, sourceCommit: gitHead, sourceTreeCleanBeforePackaging, creationBytecodeBytes: release.creationBytecodeBytes, deploymentInitCodeBytes: release.deploymentInitCodeBytes, releaseDir: path.relative(root, releaseDir) }, null, 2)}\n`);
}

packageRelease().catch((error) => {
  process.stderr.write(`${error.message}\n`);
  process.exitCode = 1;
});
