# Technical pitch draft

Autonomous agents can have identity and still lack authority for a specific action. MANDAVEX makes identity necessary but insufficient: a signed mandate scopes one executor to one action and payload for a defined period, then checks the issuer and executor's official Agent IDs at the deterministic contract boundary. Successful execution consumes bounded authority and emits a receipt that anyone can inspect on BNB Chain.

Agent ID is a core eligibility input in the authorization path, not a profile badge. The protocol does not ask an LLM whether a request is safe, and it does not treat an on-chain hash as proof of arbitrary off-chain truth.

Status: pitch concept only. The core is not yet runtime-tested or deployed; do not present it as a live product until those gates are met.
