# ARCHITECTURE

## Core lifecycle
Issuer and executor must each hold the official BSC Agent ID at execution. Issuer signs a chain- and contract-bound EIP-712 mandate; executor submits it to an immutable guard. Guard binds the mandate to executor, target/action label, payload hash, validity interval, unique issuer nonce and use limit. Successful check atomically consumes the nonce/use and changes only a demonstration counter, emitting an on-chain receipt. Revocation is issuer-controlled.

## Trust boundaries
- BSC consensus and configured RPC: trusted for chain state; RPC availability/data integrity are external dependencies.
- Agent ID registry: external identity dependency. `balanceOf` proves only the registry's current eligibility signal, not human identity, safety, or intent.
- Issuer wallet: controls mandate signature and revocation.
- Executor: untrusted; mandate fields and payload are verified at execution.
- Frontend/LLM: untrusted convenience layer; never the authorization authority.
- Receipt: proves contract execution and committed values, not semantic correctness of arbitrary off-chain outcomes.

## Initial scope
One immutable EIP-712 guard; no proxy, token, arbitrary call, asset custody or off-chain claim of execution. Broader services, ERC-1271, delegation, proofs and economic modules are future work and must be independently reviewed.
