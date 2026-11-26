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

See [Agentic Wallet workflow](AGENTIC_WALLET_WORKFLOW.md) for the official documented Developer Mode EIP-712 signing and contract-call flow. It is a candidate integration only; no wallet session was connected or exercised.

## Adoption evidence indexer (pre-deployment)

`npm run index:activity -- --guard ADDRESS --deployment-block N --chain 56` scans `ActionAuthorized` logs in confirmed block pages, checks canonical receipt block hashes, retries RPC failures, validates successful Guard-targeted receipts, and reads Agent ID `balanceOf` for the transaction sender, mandate issuer, and executor at the receipt block. Inputs also support `--registry`, `--rpc-url`, `--page-size`, `--confirmations`, `--window-start`, and `--window-end`. Keep RPC credentials in environment variables; never put keys in commands or evidence.

The report separates `candidateCount` from `qualifyingCount`, which remains zero pending organizer rules and genuine deployed-chain evidence. Relayer/delegated senders are excluded pending organizer confirmation. Historical identity reads are post-block state, not exact transaction pre-state; archive RPC failure is reported and never treated as eligibility. A local receipt integration test validates parsing and non-mainnet exclusion on chain 31337 only; it cannot create competition participation.
