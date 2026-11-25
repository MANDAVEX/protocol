# MANDAVEX

**The Authority Layer for Autonomous Intelligence.**

Identity is not authority. Autonomy is not permission.

MANDAVEX is an open protocol for verifiable, scoped authorization of agent actions. The project is at an early implementation stage; this repository documents verified facts separately from plans.

The reviewed prototype is published at [github.com/MANDAVEX/protocol](https://github.com/MANDAVEX/protocol) (commit `2158f9ab45f080b2055e2559d1b1e9bfd1fba8d3`).

The GitHub Pages workflow and publishing source are enabled. Its first deployment attempt failed before upload because Pages was disabled; a new run is pending. The intended preview URL is `https://mandavex.github.io/protocol/`. It is not the complete Guard workflow and does not submit transactions.

## Current status

See [PROJECT_STATE.md](PROJECT_STATE.md), [VERIFICATION_REPORT.md](VERIFICATION_REPORT.md), and [BLOCKERS.md](BLOCKERS.md). No production deployment, qualifying users, or submission is claimed.

## Security

The contract is experimental and unaudited. Review [SECURITY.md](SECURITY.md) before use. It holds no user assets. Never provide private keys, seed phrases, API credentials, or wallet pairing codes.

## Local preview

```sh
npm ci
npm run dev
```

Open `http://127.0.0.1:4173`. The preview checks only the connected address against the official Agent ID registry and does not submit transactions. See [developer quickstart](docs/DEVELOPER_QUICKSTART.md).
