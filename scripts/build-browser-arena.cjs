const fs = require('node:fs');
const path = require('node:path');
const esbuild = require('esbuild');
const { contract, mock } = require('./compile-contract.cjs');

const root = path.resolve(__dirname, '..');
const web = path.join(root, 'apps/web');
const artifacts = {
  guard: { abi: contract.abi, bytecode: contract.evm.bytecode.object },
  mock: { abi: mock.abi, bytecode: mock.evm.bytecode.object },
};
fs.writeFileSync(path.join(web, 'arena-artifacts.json'), JSON.stringify(artifacts));
esbuild.buildSync({
  entryPoints: [path.join(web, 'arena-worker.mjs')],
  bundle: true,
  format: 'esm',
  platform: 'browser',
  target: ['es2022'],
  minify: true,
  outfile: path.join(web, 'arena-worker.js'),
});
const size = fs.statSync(path.join(web, 'arena-worker.js')).size;
console.log(`Browser Arena built from MandavexGuard (${contract.evm.bytecode.object.length / 2} byte creation code); worker ${Math.round(size / 1024)} KiB`);
