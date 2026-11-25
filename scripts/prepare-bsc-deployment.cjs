const { ContractFactory, JsonRpcProvider, formatUnits } = require('ethers');
const { AGENT_ID_BSC } = require('../packages/sdk/index.cjs');
const { contract } = require('./compile-contract.cjs');

const rpcUrl = process.env.BSC_RPC_URL || 'https://bsc-dataseed.binance.org';
const provider = new JsonRpcProvider(rpcUrl);

async function main() {
  const network = await provider.getNetwork();
  if (network.chainId !== 56n) throw new Error(`Refusing non-BSC network: chainId ${network.chainId}`);
  const registryCode = await provider.getCode(AGENT_ID_BSC);
  if (registryCode === '0x') throw new Error('Official Agent ID registry has no code at the configured RPC');

  const factory = new ContractFactory(contract.abi, contract.evm.bytecode.object, provider);
  const deployment = await factory.getDeployTransaction(AGENT_ID_BSC);
  const estimateFrom = process.env.DEPLOYER_ADDRESS || '0x0000000000000000000000000000000000000001';
  const gasEstimate = await provider.estimateGas({ ...deployment, from: estimateFrom });
  const paddedGasLimit = gasEstimate * 120n / 100n;
  const feeData = await provider.getFeeData();
  const feePerGas = feeData.maxFeePerGas ?? feeData.gasPrice;
  if (feePerGas === null) throw new Error('RPC did not return a current gas price');
  const block = await provider.getBlock('latest');

  console.log(JSON.stringify({
    status: 'PREPARED_UNSIGNED_TRANSACTION',
    network: 'BNB Smart Chain mainnet',
    chainId: 56,
    blockNumber: block.number,
    estimateFrom,
    unsignedTransaction: { to: null, value: '0x0', data: deployment.data },
    constructorArgument: AGENT_ID_BSC,
    compiler: 'solc 0.8.39',
    optimizerRuns: 200,
    evmVersion: 'paris',
    gasEstimate: gasEstimate.toString(),
    gasLimit: paddedGasLimit.toString(),
    feePerGasWeiAtPreparation: feePerGas.toString(),
    estimatedFeeBNBAtPreparation: formatUnits(paddedGasLimit * feePerGas, 18),
    note: 'Unsigned only. No private key is read and no transaction is sent. Review the target, constructor, calldata and live fee in a human-controlled wallet before signing.'
  }, null, 2));
}

main().finally(() => provider.destroy()).catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
