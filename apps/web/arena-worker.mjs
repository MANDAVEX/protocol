import { createBrowserArena } from './browser-arena-core.mjs';

let engine;
async function getEngine() {
  if (!engine) {
    const response = await fetch(new URL(`./arena-artifacts.json?v=${encodeURIComponent(new URL(import.meta.url).searchParams.get('v') || 'dev')}`, import.meta.url));
    if (!response.ok) throw new Error('Bundled contract artifacts are unavailable');
    engine = createBrowserArena(await response.json());
  }
  return engine;
}

self.addEventListener('message', async ({ data }) => {
  const { requestId, type, scenario } = data;
  try {
    const arena = await getEngine();
    const result = type === 'init' ? { ready: true } : type === 'run' ? await arena.runScenario(scenario) : await arena.compare();
    self.postMessage({ requestId, result });
  } catch (error) {
    self.postMessage({ requestId, error: error?.message || 'Browser EVM execution failed' });
  }
});
