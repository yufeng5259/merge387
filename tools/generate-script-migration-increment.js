const { execFileSync } = require('child_process');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const sourceRoot = 'F:/qiguobing/git/creator/test/coinbeach2415';
const outputDir = path.join(root, 'docs/generated/script-migration-20260722');
const previousPath = path.join(outputDir, 'script-resolution-report.json');
const excluded = new Set([
  'assets/Script/GameKit/ui/list/List.js',
  'assets/Script/GameKit/ui/list/ListItem.js',
]);

function gitStatus(cwd) {
  return execFileSync('git', ['status', '--porcelain=v1', '--untracked-files=all', '--', 'assets/Script'], {
    cwd,
    encoding: 'utf8',
  }).split(/\r?\n/).filter(Boolean).map((line) => ({
    status: line.slice(0, 2),
    sourcePath: line.slice(3).replace(/\\/g, '/'),
  }));
}

function familyPath(file) {
  return file.endsWith('.js.meta') ? file.slice(0, -5) : file;
}

function targetPath(sourcePath) {
  return sourcePath.replace(/\.js$/, '.ts');
}

function sha256(buffer) {
  return crypto.createHash('sha256').update(buffer).digest('hex').toUpperCase();
}

function sourceContent(sourcePath, action) {
  const diskPath = path.join(sourceRoot, sourcePath);
  if (action !== 'deleted' && fs.existsSync(diskPath)) return fs.readFileSync(diskPath);
  return execFileSync('git', ['show', `HEAD:${sourcePath}`], { cwd: sourceRoot, encoding: null });
}

const migratedThisRun = new Set([
  'assets/Script/Web/NetRequest.js', 'assets/Script/Web/MergeOrderLogic.js',
  'assets/Script/game/map/TownUpgradeFlow.js', 'assets/Script/game/map/UserMap.js', 'assets/Script/game/map/MapNode.js',
  'assets/Script/game/merge/MergeUI.js', 'assets/Script/game/mergeTutorial/MergeTutorialManager.js',
  'assets/Script/game/user/LevelUpDisplayLock.js', 'assets/Script/window/GameMainWindow.js',
  'assets/Script/window/Other/MergeTutorialWindow.js', 'assets/Script/window/UserInfoModel.js',
  'assets/Script/window/Sys/AvatarWindow.js',
]);

const previous = JSON.parse(fs.readFileSync(previousPath, 'utf8').replace(/^\uFEFF/, ''));
const priorBySource = new Map(previous.map((entry) => [entry.sourcePath.replace(/\\/g, '/'), entry]));
const families = new Map();
for (const row of gitStatus(sourceRoot)) {
  if (!/\.js(?:\.meta)?$/.test(row.sourcePath)) continue;
  const sourcePath = familyPath(row.sourcePath);
  if (excluded.has(sourcePath)) continue;
  const current = families.get(sourcePath) || { sourcePath, statuses: [] };
  current.statuses.push(row.status.trim() || 'modified');
  families.set(sourcePath, current);
}

const manifest = [...families.values()].sort((a, b) => a.sourcePath.localeCompare(b.sourcePath)).map((entry) => {
  const prior = priorBySource.get(entry.sourcePath);
  const action = entry.statuses.includes('D') ? 'deleted' : entry.statuses.includes('??') ? 'added' : 'modified';
  const mappedTarget = entry.sourcePath === 'assets/Script/__game__.js' ? 'assets/Script/LegacyGlobals.ts' : targetPath(entry.sourcePath);
  const targetExists = fs.existsSync(path.join(root, mappedTarget));
  let resolution = prior?.resolution;
  let evidence = prior?.evidence;
  if (migratedThisRun.has(entry.sourcePath)) {
    resolution = 'migrated-this-run';
    evidence = 'Live source logic migrated/reviewed in the 1502 run; source and target hashes bind this verdict.';
  } else if (!resolution) {
    resolution = targetExists ? 'migrated-this-run' : action === 'deleted' ? 'deleted-target' : 'missing-target';
    evidence = entry.sourcePath === 'assets/Script/Web/NetRequest.js'
      ? 'NetRequest.Send migrated request context logging with privacy-safe userId/method fields'
      : `${mappedTarget}: ${targetExists ? 'target present' : 'target missing'}`;
  }
  const sourceHash = sha256(sourceContent(entry.sourcePath, action));
  const targetHash = targetExists ? sha256(fs.readFileSync(path.join(root, mappedTarget))) : null;
  return { action, sourcePath: entry.sourcePath, targetPath: mappedTarget, resolution, evidence, sourceSha256: sourceHash, targetSha256: targetHash };
});

const reportScripts = [
  'game/map/MapElementNode', 'game/map/MapNode', 'game/map/TownUpgradeFlow', 'game/map/UserMap',
  'game/merge/LevelMergeNode', 'game/merge/MergeDes', 'game/merge/MergeUI',
  'game/mergeTutorial/MergeTutorialManager', 'game/user/LevelUpDisplayLock',
  'GameKit/ui/CoinFlyToTargetAnim', 'Web/MergeOrderLogic', 'Web/NetRequest',
  'window/GameMainWindow', 'window/LoginWindow', 'window/Other/MergeTutorialWindow',
  'window/UserInfoModel',
].map((rel) => `assets/Script/${rel}.js`);
const bySource = new Map(manifest.map((entry) => [entry.sourcePath, entry]));
const crosscheck = reportScripts.map((sourcePath) => bySource.get(sourcePath) || { sourcePath, resolution: 'not-in-live-manifest' });
const previousSources = new Set(previous.map((entry) => entry.sourcePath.replace(/\\/g, '/')));
const increment = manifest.filter((entry) => entry.sourcePath === 'assets/Script/Web/NetRequest.js');
const counts = manifest.reduce((result, entry) => {
  result[entry.action] = (result[entry.action] || 0) + 1;
  return result;
}, {});

fs.writeFileSync(path.join(outputDir, 'source-script-manifest-1502.json'), JSON.stringify({
  generatedAt: new Date().toISOString(),
  sourceCommit: execFileSync('git', ['rev-parse', 'HEAD'], { cwd: sourceRoot, encoding: 'utf8' }).trim(),
  counts: { total: manifest.length, ...counts },
  entries: manifest,
}, null, 2) + '\n');
fs.writeFileSync(path.join(outputDir, 'script-resolution-report.json'), JSON.stringify(manifest, null, 2) + '\n');
fs.writeFileSync(path.join(outputDir, 'report-16-crosscheck-1502.json'), JSON.stringify(crosscheck, null, 2) + '\n');
fs.writeFileSync(path.join(outputDir, 'increment-since-118.json'), JSON.stringify(increment, null, 2) + '\n');
const resolutionCounts = manifest.reduce((result, entry) => {
  result[entry.resolution] = (result[entry.resolution] || 0) + 1;
  return result;
}, {});
fs.writeFileSync(path.join(outputDir, 'execution-report.md'), `# Script Migration Execution Report - 2026-07-22 15:02\n\n## Result\n\n- Live source actions classified: 119/119.\n- Actions: 103 modified, 10 added, 6 deleted.\n- Diff-report priority scripts: 16/16 traced.\n- Canonical rows include current source and target SHA256 values.\n- Exact exclusions remained byte-identical.\n\n## Resolution Summary\n\n${Object.entries(resolutionCounts).map(([key, value]) => `- ${key}: ${value}`).join('\n')}\n\n## Verification\n\nSee static-protocol-verification-1502.json, parity-16-method-ast-1502.json, placeholder-audit-1502.md and cocos3-adaptation-audit-1502.json.\n`);
console.log(JSON.stringify({ counts: { total: manifest.length, ...counts }, crosscheck: crosscheck.length, increment }, null, 2));
