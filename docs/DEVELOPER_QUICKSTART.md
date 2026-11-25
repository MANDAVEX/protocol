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

The tests include Hardhat local-EVM execution and adversarial checks, a deterministic seeded payload fuzz sample, and a block-pinned BSC fork test against the production Agent ID registry. The fork confirms non-holder rejection; it does not prove a holder-positive path. Results are saved in `../evidence/runtime-test-report.txt`. Static analysis observations are saved in `../evidence/slither-report.txt`. Neither suite is an independent audit. Do not deploy the current source.

## Contract integration

The `MandavexGuard` source is experimental and has no deployment address. Read [the contract source](../contracts/src/MandavexGuard.sol), [security limitations](../SECURITY.md), and SDK helper documentation before integrating. There is no production API endpoint or MCP server yet.
