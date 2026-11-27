# BscScan source verification procedure

**Current status: NOT IMPLEMENTED.** The Guard has no BNB mainnet address, so it cannot be verified on BscScan yet. This is a post-deployment checklist, not evidence of a published contract.

## Before submitting source

1. Freeze and review the exact `sourceCommit` recorded in `releases/mandavex-guard-rc1/release.json`.
2. Confirm the deployed transaction, chain ID 56, constructor argument and runtime bytecode through an independent RPC and BscScan transaction page.
3. Check the deployed address's runtime code against the reviewed build. The constructor is the official Agent ID registry address `0x60b9262456de011f7d15a54cdd8c48baaa8b022f`.
4. Use Solidity `0.8.39`, optimization enabled with 200 runs, Paris EVM target and the Apache-2.0 license. The contract is self-contained; submit `contracts/src/MandavexGuard.sol` as the single source file.
5. Supply the constructor address argument exactly as it appears in the deployment transaction input. Do not include it in source or alter compilation settings to make verification pass.
6. Compare verified deployed bytecode and ABI to the packaged release artifact, then update `deployments/manifest.json` only after all values independently match.

## Safety and limits

Never submit a private key, seed phrase or wallet token to a verification site. Source verification is a public disclosure and proves source/build correspondence only; it is not a security audit or endorsement. The deployment and any gas payment require separate human-controlled wallet review and confirmation.
