const { ContractFactory, JsonRpcProvider, formatUnits } = require('ethers');
const { AGENT_ID_BSC } = require('../packages/sdk/index.cjs');
const { contract } = require('./compile-contract.cjs');

const rpcUrl = process.env.BSC_RPC_URL || 'https://bsc-dataseed.binance.org';
const provider = new JsonRpcProvider(rpcUrl);

async function main() {
  const network = await provider.getNetwork();
  if (network.chainId !== 56n) throw new Error(`Expected BSC chainId 56, received ${network.chainId}`);
  const registryCode = await provider.getCode(AGENT_ID_BSC);
  if (registryCode === '0x') throw new Error('Official Agent ID registry has no code at the configured RPC');
  const factory = new ContractFactory(contract.abi, contract.evm.bytecode.object, provider);
  const deployment = await factory.getDeployTransaction(AGENT_ID_BSC);
  const gasEstimate = await provider.estimateGas({ ...deployment, from: '0x0000000000000000000000000000000000000001' });
  const feeData = await provider.getFeeData();
  const gasPrice = feeData.gasPrice ?? feeData.maxFeePerGas;
  if (gasPrice === null) throw new Error('RPC did not return a current gas price');
  const estimatedFeeWei = gasEstimate * gasPrice;
  const block = await provider.getBlock('latest');
  console.log(JSON.stringify({
    status: 'ESTIMATE_ONLY',
    network: 'BNB Smart Chain mainnet',
    chainId: Number(network.chainId),
    blockNumber: block.number,
    registry: AGENT_ID_BSC,
    compiler: 'solc 0.8.39',
    optimizerRuns: 200,
    evmVersion: 'paris',
    gasEstimate: gasEstimate.toString(),
    gasPriceWei: gasPrice.toString(),
    gasPriceGwei: formatUnits(gasPrice, 'gwei'),
    estimatedFeeWei: estimatedFeeWei.toString(),
    estimatedFeeBNB: formatUnits(estimatedFeeWei, 18),
    note: 'RPC estimate only. Fee may change before inclusion; no transaction was sent.'
  }, null, 2));
}

main().finally(() => provider.destroy()).catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
