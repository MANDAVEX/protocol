import type { BytesLike, TransactionReceipt, TypedDataDomain } from 'ethers';

export interface Mandate {
  issuer: string;
  executor: string;
  action: string;
  payloadHash: string;
  validAfter: bigint | number;
  expiry: bigint | number;
  nonce: bigint | number;
  maxUses: number;
}

export interface MandateTypedData {
  domain: TypedDataDomain;
  types: {
    Mandate: Array<{ name: string; type: string }>;
  };
  primaryType: 'Mandate';
  message: Mandate;
}

export const AGENT_ID_BSC: string;
export const ACTION_INCREMENT: string;
export const ACTION_TASK_SUBMIT: string;
export const ACTION_TASK_ACCEPT: string;
export function encodeTaskPayload(taskId: string, artifactHash: string): string;
export function typedMandate(mandate: Mandate, chainId: number, verifyingContract: string): MandateTypedData;
export function encodeExecute(mandate: Mandate, payload: BytesLike, signature: string): string;
export function encodeRevoke(mandate: Mandate): string;
export function verifyReceipt(
  receipt: Pick<TransactionReceipt, 'status' | 'logs' | 'hash' | 'blockNumber' | 'to'>,
  expected?: Partial<Pick<Mandate, 'issuer' | 'executor' | 'action' | 'payloadHash'> & { mandateId: string; counterAfter: bigint | number }>,
  guardAddress?: string,
): { verified: false; reason: string } | { verified: true; transactionHash: string; blockNumber: number; mandateId: string; issuer: string; executor: string; counterAfter: bigint };
