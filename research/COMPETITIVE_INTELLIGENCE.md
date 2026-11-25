# Competitive intelligence

Updated 2026-11-25. This is a first-pass desk review, not a complete competitor census or independent security audit. Recheck public repos and deployed contracts before submission.

## Live competitor surfaced during Phase II review

**Agent Voice** (public repository: https://github.com/Einju/agent-voice) describes an Agent ID-gated voting dApp, with one vote per Agent ID, and lists a live Netlify site plus a BSC contract address. The repository README gives contract address `0xFFfb38948e9b5a05c8d0ed8c175Fc27DB5315F7C`. These are project-published claims; this review confirmed the public repository and its README, but did not independently test the site, inspect verified contract source, or verify the deployment. It is a direct competition for Agent ID application depth and current product readiness. MANDAVEX's potential distinction remains narrowly scoped, issuer-signed authorization bound to executor, action, payload and time, with execution-time identity rechecks and replay/revocation controls. That difference is not a proven advantage until the complete workflow is deployed and used.

## Competition context
The official announcement says new and existing projects may enter; for existing projects, only data generated during the Nov 18–Dec 9, 2026 submission window counts. Participating contracts must be deployed on BNB Chain, verified on BscScan and open-source. Innovation Award requires a live product and at least 30 Agent ID addresses interacting with participating contracts. Scores weigh Agent ID depth 30%, practicality 25%, completion 25%, innovation 20%. Source: https://www.binance.com/en/support/announcement/detail/95f5dbe0ea674a48a739b59e046648bf

## Platform primitives and standards

| Project/standard | Existing / stated functionality | Verified deployment in this review | MANDAVEX opportunity |
|---|---|---|---|
| Binance Agent ID | Official announcement identifies the BSC SPACE ID Agent ID ERC-721, non-transferable; `balanceOf(address)>0` is the stated eligibility check. | Officially documented address `0x60b9262456de011f7d15a54cdd8c48baaa8b022f`; bytecode/implementation still needs direct RPC and explorer verification. | Gate mandate issuance and action execution with a fail-closed adapter; treat registry as identity eligibility, not trustworthiness. |
| Binance Agentic Wallet / Agent OS | Official materials describe wallet and user-configurable permissions, Binance skills/MCP integrations. Agent OS brings Binance APIs, wallet hub, x402 and MCP together. | Product/docs exist; no MANDAVEX integration tested. | Provide a standard MCP surface while leaving signing and transaction confirmation in user's wallet. Never collect QR pair codes or session data. |
| BNB Agent Studio | Official docs and quickstart are referenced by the hackathon announcement as a builder resource. | Tool not installed or exercised. | Optional scaffold path only; no dependency on vendor-specific build flow. |
| EIP-712 | Typed structured data signing with domain separation. | Standard, not an application deployment. | Bind issuer, executor, action, payload, time, nonce, chain and verifying contract. |
| ERC-1271 | Contract wallets can validate signatures using `isValidSignature`. | Not implemented in initial kernel. | Add after EOA flow, with staticcall, gas/revert handling and tests. |
| ERC-8004 | Agent identity/reputation/validation registry direction. | No integration/deployment verified here. | Keep identity adapter replaceable; do not conflate registry identity with action authority. |
| ERC-8183 | Agentic task/commerce lifecycle proposal/standard referenced in research brief. | Current adoption and status need standards-tracker verification. | Map task/job lifecycle to signed mandate without duplicating marketplace semantics. |
| Google AP2 | Payment authorization protocol addressing agent-initiated commerce using verifiable mandates/credentials. | No integration tested. | Reuse compatible mandate concepts; do not claim novelty for verifiable delegated authorization generally. |
| MCP / A2A | Interoperability protocols for tools and agent-to-agent task collaboration. | No MANDAVEX adapter implemented. | Expose deterministic authorization/execution tool methods; protocol checks remain outside model judgment. |
| OpenZeppelin / capability authorization | Mature access-control and cryptographic libraries/patterns exist. | Not yet vendored or compared in code. | Prefer audited primitives; minimize custom cryptography. |
| AgentDojo | Open research benchmark for prompt-injection and tool-use security in agents. | Not run here. | Arena should publish reproducible tool abuse and policy boundary scenarios, clearly separating model risk from contract guarantees. |

## Hackathon projects reviewed

### AgentDrop
Public repo: https://github.com/Dadangbachtiar/agentdrop. Its README and repository page describe an Agent ID-gated BNB Chain claim board, one claim per identity, a frontend, Solidity contract, tests, and links to BscScan/Sourcify. The repository claims Drop #0 is live with 28 of 30 claims and a small BNB reward; this was not independently recounted on-chain. This is a strong example of a concrete, narrow Agent ID-native use case. Differentiation opportunity: policy-scoped inter-agent authority and authorization evidence rather than one gated claim.

### Agent Voice
Public repo: https://github.com/Einju/agent-voice. README describes a live BSC voting dApp where Agent ID holders create polls and vote once; it states the contract handles no funds, has no owner/withdrawals, and offers Ganache local tests and testnet/mainnet deployment scripts. It publishes a Netlify app and BSC address `0xFFfb38948e9b5a05c8d0ed8c175Fc27DB5315F7C`. These are repository statements; contract code, explorer verification and live behavior were not independently tested in this review. Differentiation opportunity: mandates bind issuer, executor, action, payload and expiry at execution, whereas this project focuses on identity-gated voting.

### SkillShield
Public repo: https://github.com/Velidia/skillshield. README describes an on-chain skill package integrity and community review registry: Agent ID holders publish package hashes, others register a stance, and publishers revoke compromised versions. It publishes a website and BSC address `0xcc3D46b7ACCff20B576afB7454BaF21B4Be36A38`, and claims BscScan verification/Sourcify exact match. These are repository statements; deployed source and live service were not independently exercised here. Its explicit distinction that integrity anchoring does not prove safety is relevant to MANDAVEX's own evidence language. Differentiation opportunity: authorize an action within bounded mandate conditions, rather than register/review skill artifacts.

## Positioning and differentiation
Agent ID gating, typed mandates, delegated permissions, immutable receipts and prompt-injection benchmarks are not individually novel. Proposed distinction is an end-to-end lifecycle that binds an official Agent ID holder's mandate to a specific executor, action, payload and validity window, checks both identities at the actual deterministic execution boundary, supports revocation/replay protection, and produces an independently inspectable receipt. This is a product hypothesis until deployed, tested and adopted.

## Gaps
Research pending: direct BSC identity contract bytecode/ABI/proxy/lifecycle inspection; official Agentic Wallet install/signing workflow; Agent OS and Agent Studio hands-on; current ERC-8004/8183 status; competitor source/deploy review; wider participant census. No unverified project marketing claim is represented as proven functionality.
