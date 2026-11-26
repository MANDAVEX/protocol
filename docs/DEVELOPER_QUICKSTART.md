# Developer quickstart (early preview)

## Requirements
Node.js 22 or newer and npm. This repository currently pins `solc` 0.8.39 for compilation. It does not require Foundry.

## Run the local preview

```sh
npm ci
npm run dev
```

Open `http://127.0.0.1:4173`. The page can connect to an installed browser wallet after explicit user approval and read that connected address's Agent ID `balanceOf` over a public BSC RPC. It does not submit transactions. Do not enter a seed phrase, private key, session token, or QR code.

## Compile and check

```sh
npm run compile:contracts
npm test
```

The tests include Hardhat local-EVM execution and adversarial checks, a deterministic seeded payload fuzz sample, and a block-pinned BSC fork test against the production Agent ID registry. The fork rejects a non-holder and shows an observed holder passes both identity checks before deliberately invalid signature rejection. This does not prove positive authorized execution. See `../evidence/agent-id-holder-fork-check.json` and `../evidence/runtime-test-report.txt`. Static analysis observations are in `../evidence/slither-report.txt`. These are not an independent audit. Do not deploy the current source.

## BSC deployment preparation

`npm run estimate:bsc-deployment` reads the current BSC registry, gas estimate and gas price without a wallet. `npm run prepare:bsc-deployment` prints an unsigned contract-creation transaction for human review in a wallet. It reads no private key and does not broadcast. Latest estimate and limits: `../evidence/bsc-mainnet-deployment-estimate.json`. A gas estimate is not a fee guarantee; review the live amount in the wallet before signing.

## Contract integration

The `MandavexGuard` source is experimental and has no deployment address. Read [the contract source](../contracts/src/MandavexGuard.sol), [security limitations](../SECURITY.md), and SDK helper documentation before integrating. There is no production API endpoint or MCP server yet.

### Permission-bound task review

The Guard supports two fixed task transitions in addition to the original counter fixture: `MANDAVEX_TASK_SUBMIT_V1` records an owner, contributor and non-zero artifact hash; `MANDAVEX_TASK_ACCEPT_V1` lets a distinct reviewer accept only that exact hash. Both actions use the same EIP-712 mandate checks, execution-time Agent ID reads, expiry, nonce, use limit and revocation as the fixture action. No arbitrary contract calls or asset movement are enabled. The Guard stores only task metadata and a hash; the artifact itself remains off-chain, so reviewers must independently verify its contents before authorizing acceptance.

Prepare typed data for a submission or acceptance with the CLI (preparation only; it never signs or sends):

```sh
node scripts/mandate-cli.cjs prepare --issuer OWNER --executor CONTRIBUTOR --guard GUARD --chain 31337 --nonce 1 --expiry UNIX_SECONDS --action submit-task --task-id 0xTASK_ID_64_HEX --artifact-hash 0xARTIFACT_HASH_64_HEX
```

For acceptance use `--executor REVIEWER --action accept-task` and the same task ID and artifact hash. The owner signs the typed data; the named executor reviews it and decides whether to submit the encoded call. On BNB mainnet use `--chain 56` only with a reviewed deployment address. User wallets must show the complete transaction and request explicit confirmation. Production execution remains unavailable until deployment and review.

The CLI also prints an unsigned `revoke(mandate)` calldata template for the same mandate. Only the issuer can successfully call it; the executor must inspect the target Guard and function before signing. The local Arena's “Revoked mandate” scenario demonstrates the revocation path using only a fresh fixture.

The public browser Arena runs the same compiled Solidity source and performs submission, self-review rejection, artifact-substitution rejection and acceptance using mock identities in a local in-memory EVM. Its receipts and hashes are local simulation evidence and are not public-chain transactions.

See [Agentic Wallet workflow](AGENTIC_WALLET_WORKFLOW.md) for the official documented Developer Mode EIP-712 signing and contract-call flow. It is a candidate integration only; no wallet session was connected or exercised.

## Adoption evidence indexer (pre-deployment)

`npm run index:activity -- --guard ADDRESS --deployment-block N --chain 56` scans `ActionAuthorized` logs in confirmed block pages, checks canonical receipt block hashes, retries RPC failures, validates successful Guard-targeted receipts, and reads Agent ID `balanceOf` for the transaction sender, mandate issuer, and executor at the receipt block. Inputs also support `--registry`, `--rpc-url`, `--page-size`, `--confirmations`, `--window-start`, and `--window-end`. Keep RPC credentials in environment variables; never put keys in commands or evidence.

The report separates `candidateCount` from `qualifyingCount`, which remains zero pending organizer rules and genuine deployed-chain evidence. Relayer/delegated senders are excluded pending organizer confirmation. Historical identity reads are post-block state, not exact transaction pre-state; archive RPC failure is reported and never treated as eligibility. A local receipt integration test validates parsing and non-mainnet exclusion on chain 31337 only; it cannot create competition participation.

The public Adoption panel is generated at build time from `deployments/manifest.json` and, when present, `evidence/adoption-activity.json`. Before deployment it shows `BLOCKED` and leaves counts unknown rather than displaying fixture activity or implying a verified zero. After a reviewed deployment, save a real BSC indexer report with `npm run index:activity -- --guard ADDRESS --deployment-block BLOCK --chain 56 --output evidence/adoption-activity.json`, review its RPC range and limitations, then rebuild and publish. The dashboard labels those senders as candidates and keeps the official qualifying count distinct.
