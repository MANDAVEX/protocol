# SECURITY

## Scope and status
Experimental pre-audit code. No production use is recommended. No independent professional audit has been performed.

## Threat model
Malicious issuers/executors, compromised wallets, forged/replayed signatures, altered payload/scope, stale/revoked/expired mandates, concurrent consumption, chain/contract replay, untrusted RPC, identity contract failure or lifecycle changes, frontend compromise, prompt injection, denial of service, and misleading off-chain attestations.

## Controls intended in the initial kernel
EIP-712 domain separation (chain and verifying contract), low-s ECDSA recovery, exact typed mandate fields, issuer and executor Agent ID checks on every execution, explicit payload hash/action scope/time range, nonce consumption, use bounds, issuer revocation, no arbitrary external execution, and atomic state update/event emission.

## Limitations
The registry's `balanceOf` is an external trust dependency. EOA signature support only; ERC-1271 is not included initially. A successful receipt only proves the on-chain demonstration state transition and committed values, not arbitrary off-chain semantics. A reverted transaction cannot leave a rejection event; rejected attempts must be evidenced from transaction simulation/call traces or an independent indexer. Review storage/gas/nonce semantics and test before deployment.

## Reporting
Report suspected vulnerabilities privately to the project owner before public disclosure. Contact details are not yet published; this is a release blocker.
