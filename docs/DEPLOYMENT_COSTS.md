# BNB Chain deployment costs

**Status: VERIFIED as a read-only RPC estimate at block 135963205; prices and gas may change. No transaction was sent.**

The reviewed build uses solc 0.8.39, optimizer 200 and Paris EVM. Creation bytecode is 5,786 bytes; constructor init code is 5,818 bytes and supplies the official Agent ID registry address.

| Cost item | Estimate | Status |
|---|---:|---|
| Guard deployment | 1,268,421 gas × 0.05 gwei = 0.00006342105 BNB | Read-only estimate |
| Initialization | 0 BNB | No initializer or follow-up configuration call; constructor sets the immutable registry |
| First genuine production verification | Not priced | No reviewed deployment exists. The wallet preview must show the exact execution fee before a holder approves any transaction. |
| Recommended deployment reserve | 1,522,105 gas at sampled 0.05 gwei = 0.00007610525 BNB | 20% gas-limit headroom; sampled fee is not guaranteed |
| Task submission | 217,048 gas in local Hardhat fixture; illustrative 0.0000108524 BNB at sampled 0.05 gwei | `LOCAL FIXTURE GAS MEASUREMENT`; mock identity registry, not an exact BNB Chain quote |
| Task acceptance | 142,300 gas in local Hardhat fixture; illustrative 0.000007115 BNB at sampled 0.05 gwei | `LOCAL FIXTURE GAS MEASUREMENT`; mock identity registry, not an exact BNB Chain quote |
| Minimum submit + accept flow | 359,348 local gas; illustrative 0.0000179674 BNB at sampled price | Two transactions; each executor funds their own transaction; wallet preview is authoritative |
| Deployment + one submit + one accept | 1,627,769 gas; illustrative 0.00008138845 BNB, or 0.00009766614 BNB with 20% headroom | Illustrative minimum project + participant flow; excludes independent review, monitoring and optional transactions |
| First production verification | Variable; not priced | Depends on the exact reviewed production action and current wallet preview |

These figures are informational only. Task costs are extrapolated from a local mock-registry fixture and are not BNB Chain measurements. The authorized additional expenditure remains $0.00, so deployment, first production verification and participant interactions must not be initiated under the current authorization. Re-run `npm run estimate:bsc-deployment` and `npm run prepare:bsc-deployment` immediately before any future human-authorized release decision; after deployment, rely on each official wallet's exact transaction preview.
