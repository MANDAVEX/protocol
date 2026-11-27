# Operation Vanguard release qualification

Updated 2026-11-27. This is an internal qualification record, not an audit or mainnet approval.

## Candidate integrity — VERIFIED

`releases/mandavex-guard-rc1/release.json` records the reviewed Guard source commit `62613993a0754a3479029760aea951281d29c0f0`, SHA-256 source hash `72455f719e52e49f9343e61ff3056ed1795a4417fea910004c8a710bd609c106`, compiler solc 0.8.39, optimizer 200, Paris EVM, official Agent ID registry constructor `0x60b9262456de011f7d15a54cdd8c48baaa8b022f`, 5,786-byte creation bytecode and 5,818-byte init code. The source, bytecode and init-code hashes were reproduced and matched the release manifest. A fresh `npm run compile:contracts` reproduced the 5,786-byte creation bytecode. SDK receipt-verification changes are off-contract and do not change this candidate's bytecode.

## Adversarial scope — PARTIALLY IMPLEMENTED

Reviewed/tested boundaries cover EIP-712 chain and verifying-contract domain separation; low-s ECDSA recovery; issuer/executor Agent ID checks at execution; fixed action and payload binding; nonce consumption and replay/rebinding; expiry and maximum one-day mandate window; revocation; bounded use counts; registry failure; task artifact hash binding; task owner authorization; contributor self-review rejection; and exact task transition receipt verification. Deterministic seeded checks mutate 128 payloads and 64 malformed signatures while asserting relevant state invariants. The full suite passed 52/52 in this qualification turn, including a read-only BSC fork at block 135964180. A focused EVM/SDK/CLI run also passed 20/20. This remains internal testing, not audit.

The work is internal testing, not independent audit, formal verification, or proof against all adversarial inputs. Slither's remaining timestamp observation concerns timestamp comparisons for `validAfter` and exclusive expiry. The protocol allows up to 24 hours and treats expiry as exclusive; validators' block timestamp tolerance remains an environmental assumption. No bypass was demonstrated in the tested boundary cases, but independent review is required before production. Registry correctness/availability and official identity balance semantics remain external trust assumptions.

## Receipt verification — IMPLEMENTED BUT UNVERIFIED

The previous SDK verifier accepted an `ActionAuthorized` event without checking the corresponding task event. The SDK now requires a matching `TaskTransition` from the expected Guard and validates task ID, status, artifact hash, optional parties, and mandate ID linkage. The CLI accepts `--task-id`, `--artifact-hash`, and `--task-status submitted|accepted` as an all-or-none group. Tests prove altered hashes and incomplete/invalid flags fail closed. Production chain verification remains unavailable until a deployed Guard address is in the manifest.

## Wallet and adoption — BLOCKED

Wallet procedure follows the official Agentic Wallet preview/inspect/confirm workflow and retains each mandatory confirmation. No genuine wallet is connected; no genuine signature or transaction was made. Latest local task gas measurements are 217,048 gas submission and 142,300 gas acceptance using a mock registry on Hardhat 31337. These are not production fee quotes. Deployment estimate was read-only at BSC block 135964279: 1,268,421 gas and 0.00006342105 BNB at sampled 0.05 gwei, with 0.00007610525 BNB deployment reserve including 20% gas headroom.

No Guard is deployed, no independent review is recorded, no qualifying interaction exists, and no competition submission has been made. The official eligibility description calls for a live product, BNB deployment with verified/open source, and at least 30 distinct Agent ID addresses interacting with submitted contracts during the event period; organizers determine qualification. Demo activity, registrations and unrelated transactions are excluded.
