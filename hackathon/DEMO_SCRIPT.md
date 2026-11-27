# Competition demonstration script (3–4 minutes)

**Evidence status: IMPLEMENTED BUT UNVERIFIED.** This is a run-of-show for a recorded demo; no recording is included. All interactive transactions shown in the Arena are local fixture transactions and must be introduced as such.

## Before recording

1. Run `npm ci`, `npm run build:web`, then `npm run test:browser`.
2. Open the public preview and verify its build metadata. For interactive local scenarios, run `npm run arena:local` and open `http://127.0.0.1:4173`.
3. Record on screen that the environment says `browser-side EVM · ephemeral keys · no RPC` or `local Hardhat EVM · controlled test accounts`.
4. Do not connect a personal wallet or use a real Agent ID account in a simulated flow. Do not imply fork impersonation is real holder activity.

## Narration

### 0:00–0:35 — Problem

“An agent's identity does not tell a service which action it is allowed to take. MANDAVEX tests a smaller rule: a holder signs one executor, one operation, one exact payload and a short expiry. The contract rechecks both Agent IDs at execution.”

### 0:35–1:10 — Architecture and limits

Show the protocol overview and architecture diagram. Explain that the contract has no admin role, upgrade path, token transfer, arbitrary external call or custody. State plainly that the Guard is not deployed or independently audited; the current live site is a preview.

### 1:10–2:30 — Demonstration

In the isolated Arena, run **Valid signed action** and show the local `ActionAuthorized` event and counter transition. Then run **Payload tampering** to show the changed payload is rejected without state change. Run **Permission-bound task handoff**: the contributor submits a task hash, a distinct reviewer accepts the exact hash, and self-review or artifact substitution is rejected. Point out the local chain ID, ephemeral keys, mock identity and local-only receipts.

### 2:30–3:05 — Passport and receipts

Show the Passport's public Agent ID lookup and explain it reports the registry response at lookup time, not a safety score. Open the receipt explorer and point out that Arena hashes stay in local browser storage and are not public-chain transactions.

### 3:05–3:30 — Adoption evidence

Show the Adoption panel's `BLOCKED · NOT RUN` state with unknown counts. Explain that candidates require a real deployed Guard receipt and block-pinned identity reads; the organizer determines official competition eligibility. Do not replace unknowns with demo totals.

### 3:30–4:00 — Next proof gates

Close with the exact missing gates: independent security review, human-controlled BNB deployment and wallet confirmation, real user activity by Agent ID holders, and at least 30 distinct qualifying addresses during the official window. No production execution or qualifying interaction is claimed today.

## On-screen claims checklist

- Label every Arena outcome “local demo” or “fixture”; never call it mainnet activity.
- Distinguish candidate addresses from organizer-qualified addresses.
- Do not claim deployed-contract status, successful real-holder signature, security audit or user count.
- Make sure no seed phrase, private key, QR pairing code or personally identifiable registration data appears in the recording.
