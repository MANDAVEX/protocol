# MANDAVEX

**The Authority Layer for Autonomous Intelligence.**

Identity is not authority. Autonomy is not permission.

MANDAVEX is an open protocol for verifiable, scoped authorization of agent actions. The project is at an early implementation stage; this repository documents verified facts separately from plans.

The reviewed prototype is published at [github.com/MANDAVEX/protocol](https://github.com/MANDAVEX/protocol).

The static wallet and identity-check preview is live at [mandavex.github.io/protocol](https://mandavex.github.io/protocol/). The deployed page has no Guard address and submits no protocol transactions; it is not the complete protocol workflow.

## Current status

See [PROJECT_STATE.md](PROJECT_STATE.md), [VERIFICATION_REPORT.md](VERIFICATION_REPORT.md), [PHASE_II_ACCEPTANCE.md](PHASE_II_ACCEPTANCE.md), and [BLOCKERS.md](BLOCKERS.md). No mainnet deployment, qualifying users, or submission is claimed.

## Security

The contract is experimental and unaudited. Review [SECURITY.md](SECURITY.md) before use. It holds no user assets. Never provide private keys, seed phrases, API credentials, or wallet pairing codes.

## Local preview

```sh
npm ci
npm run dev
```

Open `http://127.0.0.1:4173`. The preview checks only the connected address against the official Agent ID registry and does not submit transactions. See [developer quickstart](docs/DEVELOPER_QUICKSTART.md).

To estimate BSC deployment cost without signing or sending a transaction, run `npm run estimate:bsc-deployment`. `npm run prepare:bsc-deployment` prints an unsigned deployment transaction; a human must review it and submit it from a wallet. See the recorded estimate in `evidence/bsc-mainnet-deployment-estimate.json`.

The public preview uses GitHub Pages and does not submit transactions. Latest local verification: `npm test` (18 cases) and `npm audit --audit-level=low`; results and scope are recorded in `PHASE_III_ACCEPTANCE.md`. Official-wallet instructions and boundaries are documented in `docs/AGENTIC_WALLET_WORKFLOW.md`.
