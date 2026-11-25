# MANDAVEX: Proof of Authorized Action

**Status: design draft.** This document describes an early architecture, not a deployed or audited protocol.

## Abstract
Autonomous agents can hold identities and invoke tools, but identity alone does not establish authority for a particular action. MANDAVEX explores an execution-boundary authorization protocol that binds an issuer's signed mandate to a designated Agent ID holder, action, payload, time window and nonce, then records a deterministic on-chain outcome.

## Problem and related work
Agent ID registries, EIP-712, wallet permissions, capability systems, ERC-1271, ERC-8004, AP2, MCP and A2A address adjacent parts of agent identity, signatures, payments, reputation and interoperability. MANDAVEX does not claim to invent delegation or signed authorization. It aims to connect identity eligibility, scoped authority, deterministic enforcement and action evidence in a narrow lifecycle.

## Architecture and authorization model
The initial immutable Guard references the official BNB Chain Agent ID registry. The mandate is an EIP-712 typed structure containing issuer, executor, action, payload hash, validity interval, nonce and use limit. The executor submits the exact payload and issuer signature. The Guard checks both identity balances, time, action/payload, nonce, revocation and signature, then atomically increments a demonstration counter and emits a receipt.

## Identity and cryptography
The competition's official eligibility signal is `balanceOf(address)>0`. This is not a claim about human identity or agent safety. EIP-712 binds signatures to the chain and verifying contract. Initial implementation supports EOA ECDSA with low-s validation; ERC-1271 is future work.

## Execution and evidence
An event records mandate ID, issuer, executor, action and payload commitment, use number and resulting counter. This demonstrates an on-chain state transition. It cannot prove arbitrary off-chain events or semantic correctness. Reverted calls cannot persist rejection events; rejected attempts need call traces/simulation or an independent indexed record.

## Threat model and assumptions
Threats include compromised signing keys, malicious agents, replay, altered payloads, revoked/expired authority, faulty identity registry/RPC, frontend compromise and prompt injection. The contract makes no arbitrary calls, has no owner privilege and holds no assets. Registry correctness and BSC execution are dependencies.

## Evaluation methodology and results
No compiler, test suite, deployment, benchmark or user study has yet produced results. Results will be entered here only with reproducible commands, artifacts, chain references and limitations.

## Economic extensibility
Core authorization has no MDVX dependency. Optional fee or verifier modules require evidence of sustainable utility and separate review. No token launch is planned or authorized.

## Limitations and future research
Current work is uncompiled, EOA-only and tied to one registry/action. It has no public app, external service integration, verified deployment or professional audit. Future research: registry lifecycle, ERC-1271, delegation constraints, cross-service policy adapters, MCP integration and independent benchmarks.

## References
- Binance Agent ID Hackathon announcement: https://www.binance.com/en/support/announcement/detail/95f5dbe0ea674a48a739b59e046648bf
- EIP-712: https://eips.ethereum.org/EIPS/eip-712
- ERC-1271: https://eips.ethereum.org/EIPS/eip-1271
- Binance Agentic Wallet docs: https://web3.binance.com/en/dev-docs/products/agentic-wallet/introduction
