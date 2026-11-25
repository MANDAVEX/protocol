export default {
  chainDescriptors: {
    56: { name: "BNB Smart Chain", chainType: "l1", hardforkHistory: { berlin: { blockNumber: 0 }, london: { blockNumber: 0 }, merge: { blockNumber: 0 }, shanghai: { blockNumber: 0 }, cancun: { blockNumber: 0 }, prague: { blockNumber: 0 } } },
  },
  solidity: {
    version: "0.8.39",
    settings: { optimizer: { enabled: true, runs: 200 }, evmVersion: "paris" },
  },
  networks: {
    default: {
      type: "edr-simulated",
      chainType: "l1",
    },
  },
};
