const fs = require('node:fs');
const path = require('node:path');
const solc = require('solc');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'contracts/src/MandavexGuard.sol'), 'utf8');
const mockSource = fs.readFileSync(path.join(root, 'contracts/test/MockAgentId.sol'), 'utf8');
const input = {
  language: 'Solidity',
  sources: {
    'MandavexGuard.sol': { content: source },
    'MockAgentId.sol': { content: mockSource },
  },
  settings: { optimizer: { enabled: true, runs: 200 }, evmVersion: 'paris', outputSelection: { '*': { '*': ['abi', 'evm.bytecode.object'] } } },
};
const output = JSON.parse(solc.compile(JSON.stringify(input)));
const errors = (output.errors || []).filter((item) => item.severity === 'error');
if (errors.length) throw new Error(errors.map((item) => item.formattedMessage).join('\n'));
const contract = output.contracts['MandavexGuard.sol'].MandavexGuard;
const mock = output.contracts['MockAgentId.sol'].MockAgentId;
if (!contract.evm.bytecode.object) throw new Error('Compiler returned empty bytecode');
const outDir = path.join(root, 'contracts/build');
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'MandavexGuard.abi.json'), JSON.stringify(contract.abi, null, 2));
fs.writeFileSync(path.join(outDir, 'MandavexGuard.bin'), contract.evm.bytecode.object);
fs.writeFileSync(path.join(outDir, 'MockAgentId.abi.json'), JSON.stringify(mock.abi, null, 2));
fs.writeFileSync(path.join(outDir, 'MockAgentId.bin'), mock.evm.bytecode.object);
if (require.main === module) {
  console.log(`Solidity ${solc.version()}: compiled MandavexGuard (${contract.evm.bytecode.object.length / 2} bytes)`);
}
module.exports = { source, contract, mockSource, mock };
