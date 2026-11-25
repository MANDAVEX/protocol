const { keccak256, toUtf8Bytes } = require('ethers');

const AGENT_ID_BSC = '0x60b9262456de011f7d15a54cdd8c48baaa8b022f';
const ACTION_INCREMENT = keccak256(toUtf8Bytes('MANDAVEX_DEMO_INCREMENT_V1'));
const DOMAIN_NAME = 'MANDAVEX';
const DOMAIN_VERSION = '1';
const types = {
  Mandate: [
    { name: 'issuer', type: 'address' },
    { name: 'executor', type: 'address' },
    { name: 'action', type: 'bytes32' },
    { name: 'payloadHash', type: 'bytes32' },
    { name: 'validAfter', type: 'uint64' },
    { name: 'expiry', type: 'uint64' },
    { name: 'nonce', type: 'uint256' },
    { name: 'maxUses', type: 'uint32' },
  ],
};

function typedMandate(mandate, chainId, verifyingContract) {
  if (!Number.isSafeInteger(Number(chainId)) || !verifyingContract) throw new TypeError('chainId and verifyingContract are required');
  return { domain: { name: DOMAIN_NAME, version: DOMAIN_VERSION, chainId: Number(chainId), verifyingContract }, types, primaryType: 'Mandate', message: mandate };
}

module.exports = { AGENT_ID_BSC, ACTION_INCREMENT, typedMandate };
