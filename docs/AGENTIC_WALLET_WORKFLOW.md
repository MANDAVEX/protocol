# MANDAVEX Agentic Wallet workflow (candidate integration)

## Scope

The current Guard is not deployed and no production address exists. This is a verified-documentation-based integration design, not a tested wallet integration. It does not use a web QR login, ask for a pairing code, or collect a seed phrase/private key.

## Officially documented path

Binance's Agentic Wallet skill documents external contract-call preview/execute and EIP-712 `sign-message` preview/execute/result. It requires Developer Mode, showing the parsed operation and risk output, and explicit user confirmation before execution. The feature is controlled in the Binance App and may require an additional app confirmation.

1. Install the official [Binance Agentic Wallet skill](https://github.com/binance/binance-skills-hub/tree/main/skills/binance-web3/binance-agentic-wallet) using its official setup instructions.
2. In the Binance App, enable Agentic Wallet Developer Mode and accept its risk warning. This is a human-controlled, time-limited setting.
3. Run `baw wallet settings --json`; stop unless Developer Mode is enabled and unexpired.
4. Build an EIP-712 `Mandate` with the exact deployed Guard address, chain ID 56, holder's own wallet as issuer and executor, the fixed increment action, exact payload hash, validity window, nonce and one-use limit.
5. Run `baw sign-message preview --binanceChainId 56 --signType EIP712 --message '<eth_signTypedData_v4 request JSON>' --json`. Inspect `parsedMessage` and risks. Ask the holder to explicitly approve before `sign-message execute`.
6. If the wallet requires app confirmation, wait for that confirmation and retrieve the result through `baw sign-message result --order-id <orderId> --json`. Never treat a pending order as a signature.
7. Encode `execute(mandate, payload, signature)` with the published ABI and run `baw contract-call preview --binanceChainId 56 --from <holder> --to <deployed Guard> --inputData <calldata> --json`.
8. Inspect the parsed call, simulation, risk output and expected fee. Obtain explicit holder confirmation, then call `baw contract-call execute --requestId <requestId> --json`. If app confirmation is pending, wait for the user to approve it.
9. Verify the returned transaction hash on BscScan, confirm success and `ActionAuthorized`, and check the Guard state and Agent ID `balanceOf` at that block.

## Current status and limitations

- The official docs describe this external signing path and BSC support. MANDAVEX has not installed/authenticated the wallet skill or exercised the flow.
- The Guard has no deployed address, so no valid production calldata or preview can currently be made.
- `contract-call` and `sign-message` may require Developer Mode and user confirmation. Do not bypass those requirements.
- A signed mandate is a permission grant, even though the present demo action is a counter increment. The holder must inspect exact typed data and its scope before signing.
- No actual transaction, adoption, or competition-eligible interaction is claimed.

## Official references

- [Agentic Wallet developer documentation](https://developers.binance.com/en/docs/products/agentic-wallet/welcome)
- [Agentic Wallet external signing reference](https://github.com/binance/binance-skills-hub/blob/main/skills/binance-web3/binance-agentic-wallet/references/external-sign.md)
- [Official Agent ID hackathon announcement and rules](https://www.binance.com/en/support/announcement/detail/95f5dbe0ea674a48a739b59e046648bf)
