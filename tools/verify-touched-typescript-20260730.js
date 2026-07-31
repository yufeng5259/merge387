const fs = require('fs');
const { spawnSync } = require('child_process');

const comparable = new Set(require('../docs/generated/script-migration-20260730/live-comparable-files.json').map(rel => `assets/Script/${rel}.ts`.replace(/\\/g, '/')));
const extra = [
  'assets/Script/LegacyGlobals.ts',
  'assets/Script/game/MetaManager.ts',
  'assets/Script/window/Map/MapBuyBuildWindow.ts',
  'assets/Script/window/Map/MapBuildUpgradeWindow.ts',
  'assets/Script/window/Map/MapBuildStageUpgradeWindow.ts',
  'assets/Script/window/Map/MapBuildMaxLevelWindow.ts',
];
extra.forEach(file => comparable.add(file));

const run = spawnSync('cmd.exe', ['/d', '/s', '/c', 'npx tsc --noEmit --pretty false'], { encoding: 'utf8' });
const lines = `${run.stdout || ''}${run.stderr || ''}`.split(/\r?\n/).filter(Boolean);
const touchedDiagnostics = lines.filter(line => {
  const match = line.match(/^([^\(]+\.tsx?)\(/);
  return match && comparable.has(match[1].replace(/\\/g, '/'));
});
const result = {
  generatedAt: new Date().toISOString(),
  command: 'npx tsc --noEmit --pretty false',
  projectExitCode: run.status,
  launchError: run.error ? run.error.message : null,
  projectDiagnostics: lines.length,
  touchedFilesChecked: comparable.size,
  touchedDiagnostics,
};
fs.writeFileSync('docs/generated/script-migration-20260730/g011-typescript-filter.json', JSON.stringify(result, null, 2));
console.log(JSON.stringify(result, null, 2));
if (touchedDiagnostics.length) process.exitCode = 1;
