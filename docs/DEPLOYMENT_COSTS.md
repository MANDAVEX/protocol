# BNB Chain deployment costs

**Status: VERIFIED as a read-only RPC estimate at block 135956825; prices and gas may change. No transaction was sent.**

The reviewed build uses solc 0.8.39, optimizer 200 and Paris EVM. Creation bytecode is 5,786 bytes; constructor init code is 5,818 bytes and supplies the official Agent ID registry address.

| Cost item | Estimate | Status |
|---|---:|---|
| Guard deployment | 1,268,421 gas × 0.05 gwei = 0.00006342105 BNB | Read-only estimate |
| Initialization | 0 BNB | No initializer or follow-up configuration call; constructor sets the immutable registry |
| First genuine production verification | Not priced | No reviewed deployment exists. The wallet preview must show the exact execution fee before a holder approves any transaction. |
| Recommended deployment reserve | 1,522,105 gas at sampled 0.05 gwei = 0.00007610525 BNB | 20% gas-limit headroom; sampled fee is not guaranteed |
| Participant interactions | Variable; not priced | Depends on each mandate action, calldata, current fee and user wallet. No token approval or asset transfer is needed. Each holder reviews their own preview. |

These figures are informational only. The authorized additional expenditure remains $0.00, so deployment, first production verification and participant interactions must not be initiated under the current authorization. Re-run `npm run estimate:bsc-deployment` and `npm run prepare:bsc-deployment` immediately before any future human-authorized release decision.
