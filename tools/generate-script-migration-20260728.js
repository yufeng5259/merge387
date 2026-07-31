const { execFileSync } = require('child_process');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const targetRoot = process.cwd();
const sourceRoot = 'F:/qiguobing/git/creator/test/coinbeach2415';
const outputDir = process.env.SCRIPT_MIGRATION_OUTPUT_DIR
  ? path.resolve(process.env.SCRIPT_MIGRATION_OUTPUT_DIR)
  : path.join(targetRoot, 'docs/generated/script-migration-20260728');
const reportPath = path.join(sourceRoot, 'docs/assets-diff-report.md');
const excluded = new Set([
  'assets/Script/GameKit/ui/list/List.js',
  'assets/Script/GameKit/ui/list/ListItem.js',
]);

function run(cwd, args) {
  return execFileSync('git', args, { cwd, encoding: 'utf8' }).trim();
}

function statusRows(cwd) {
  const output = execFileSync('git', ['status', '--porcelain=v1', '--untracked-files=all', '--', 'assets/Script'], {
    cwd,
    encoding: 'utf8',
  });
  return output.split(/\r?\n/).filter(Boolean).map((line) => ({
    status: line.slice(0, 2),
    path: line.slice(3).replace(/\\/g, '/'),
  }));
}

function hashFile(file) {
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex').toUpperCase();
}

function familyPath(file) {
  return file.endsWith('.js.meta') ? file.slice(0, -5) : file;
}

function targetScriptPath(sourcePath) {
  if (sourcePath === 'assets/Script/__game__.js') return 'assets/Script/LegacyGlobals.ts';
  return sourcePath.replace(/\.js$/, '.ts');
}

function classify(statuses) {
  if (statuses.some((status) => status.includes('D'))) return 'deleted';
  if (statuses.some((status) => status === '??' || status.includes('A'))) return 'added';
  return 'modified';
}

function disposition(action, sourcePath, targetExists) {
  if (action === 'deleted') return targetExists ? 'delete-conflict' : 'source-deleted';
  if (sourcePath === 'assets/Script/__game__.js') return targetExists ? 'equivalent-infrastructure' : 'entry-mapping-missing';
  if (!targetExists) return 'target-missing';
  if (action === 'added') return 'source-added-migrated';
  return 'existing-cocos3-reviewed';
}

function hashExisting(root, file) {
  const absolute = path.join(root, file);
  return fs.existsSync(absolute) ? hashFile(absolute) : null;
}

function hashHeadFile(root, file) {
  try {
    const content = execFileSync('git', ['show', `HEAD:${file}`], { cwd: root, encoding: null });
    return crypto.createHash('sha256').update(content).digest('hex').toUpperCase();
  } catch (_error) {
    return null;
  }
}

fs.mkdirSync(outputDir, { recursive: true });
const sourceRows = statusRows(sourceRoot);
const targetRows = statusRows(targetRoot);
const families = new Map();

for (const row of sourceRows) {
  if (!/\.js(?:\.meta)?$/.test(row.path)) continue;
  const sourcePath = familyPath(row.path);
  if (excluded.has(sourcePath)) continue;
  const family = families.get(sourcePath) || { sourcePath, statusRows: [] };
  family.statusRows.push({ status: row.status, path: row.path });
  families.set(sourcePath, family);
}

const entries = [...families.values()].sort((a, b) => a.sourcePath.localeCompare(b.sourcePath)).map((family) => {
  const action = classify(family.statusRows.map((row) => row.status));
  const targetPath = targetScriptPath(family.sourcePath);
  const sourceMetaPath = `${family.sourcePath}.meta`;
  const targetMetaPath = `${targetPath}.meta`;
  const sourceExists = fs.existsSync(path.join(sourceRoot, family.sourcePath));
  const sourceMetaExists = fs.existsSync(path.join(sourceRoot, sourceMetaPath));
  const targetExists = fs.existsSync(path.join(targetRoot, targetPath));
  const targetMetaExists = fs.existsSync(path.join(targetRoot, targetMetaPath));
  return {
    action,
    sourcePath: family.sourcePath,
    sourceMetaPath,
    targetPath,
    targetMetaPath,
    sourceExists,
    sourceMetaExists,
    targetExists,
    targetMetaExists,
    disposition: disposition(action, family.sourcePath, targetExists),
    sourceSha256: sourceExists ? hashExisting(sourceRoot, family.sourcePath) : hashHeadFile(sourceRoot, family.sourcePath),
    sourceMetaSha256: sourceMetaExists ? hashExisting(sourceRoot, sourceMetaPath) : hashHeadFile(sourceRoot, sourceMetaPath),
    targetSha256: hashExisting(targetRoot, targetPath),
    targetMetaSha256: hashExisting(targetRoot, targetMetaPath),
    evidence: action === 'deleted'
      ? 'deleted-path-residue-audit.md'
      : family.sourcePath === 'assets/Script/__game__.js'
        ? 'entry-added-deleted-audit.md'
        : action === 'added'
          ? 'entry-added-deleted-audit.md'
          : 'live-method-parity.json',
    statusRows: family.statusRows,
  };
});

const counts = entries.reduce((result, entry) => {
  result[entry.action] += 1;
  result[entry.disposition] = (result[entry.disposition] || 0) + 1;
  return result;
}, { total: entries.length, modified: 0, added: 0, deleted: 0 });

const exclusions = [...excluded].map((sourcePath) => {
  const targetPath = targetScriptPath(sourcePath);
  return { sourcePath, targetPath, sha256: hashFile(path.join(targetRoot, targetPath)) };
});

const baseline = {
  generatedAt: new Date().toISOString(),
  source: {
    root: sourceRoot,
    commit: run(sourceRoot, ['rev-parse', 'HEAD']),
    statusRows: sourceRows,
  },
  target: {
    root: targetRoot.replace(/\\/g, '/'),
    commit: run(targetRoot, ['rev-parse', 'HEAD']),
    statusRows: targetRows,
  },
  report: {
    path: reportPath.replace(/\\/g, '/'),
    lastWriteTime: fs.statSync(reportPath).mtime.toISOString(),
  },
  exclusions,
};

function parseReportScriptRows() {
  const markdown = fs.readFileSync(reportPath, 'utf8');
  const headings = new Map([
    ['## 仅项目存在的文件', 'only-project'],
    ['## 仅外部存在的文件', 'only-external'],
    ['## 同路径但内容不同的文件', 'modified'],
  ]);
  let category = null;
  const rows = [];
  for (const line of markdown.split(/\r?\n/)) {
    if (line.startsWith('## ')) category = headings.get(line.trim()) || null;
    if (!category || !line.startsWith('| `')) continue;
    const match = line.match(/^\| `([^`]+)` \|/);
    if (!match) continue;
    const reportPath = match[1].replace(/\\/g, '/');
    if (!(/^Script\/.*\.js$/.test(reportPath) || reportPath === 'other/TReBuild.ts')) continue;
    const sourcePath = `assets/${reportPath}`;
    const inScriptScope = reportPath.startsWith('Script/');
    const sourceExists = fs.existsSync(path.join(sourceRoot, sourcePath));
    const targetPath = inScriptScope ? targetScriptPath(sourcePath) : null;
    rows.push({ category, reportPath, sourcePath, targetPath, inScriptScope, sourceExists, targetExists: targetPath ? fs.existsSync(path.join(targetRoot, targetPath)) : false });
  }
  return rows;
}

const reportScriptRows = parseReportScriptRows();

fs.writeFileSync(path.join(outputDir, 'execution-baseline.json'), `${JSON.stringify(baseline, null, 2)}\n`);
fs.writeFileSync(path.join(outputDir, 'source-script-manifest.json'), `${JSON.stringify({
  generatedAt: baseline.generatedAt,
  sourceCommit: baseline.source.commit,
  counts,
  exclusions,
  entries,
}, null, 2)}\n`);
fs.writeFileSync(path.join(outputDir, 'report-script-scope.json'), `${JSON.stringify({
  generatedAt: baseline.generatedAt,
  counts: reportScriptRows.reduce((result, row) => {
    result.total += 1;
    result[row.category] = (result[row.category] || 0) + 1;
    result.inScriptScope += row.inScriptScope ? 1 : 0;
    result.currentSourceMissing += row.inScriptScope && !row.sourceExists ? 1 : 0;
    return result;
  }, { total: 0, inScriptScope: 0, currentSourceMissing: 0 }),
  entries: reportScriptRows,
}, null, 2)}\n`);
fs.writeFileSync(path.join(outputDir, 'report-68-files.json'), `${JSON.stringify(
  reportScriptRows
    .filter(row => row.inScriptScope && row.sourceExists && row.targetExists)
    .map(row => row.targetPath.replace(/^assets\/Script\//, '').replace(/\.ts$/, '')),
  null,
  2,
)}\n`);
fs.writeFileSync(path.join(outputDir, 'live-comparable-files.json'), `${JSON.stringify(
  entries
    .filter(entry => entry.sourceExists && entry.targetExists && entry.sourcePath !== 'assets/Script/__game__.js')
    .map(entry => entry.targetPath.replace(/^assets\/Script\//, '').replace(/\.ts$/, '')),
  null,
  2,
)}\n`);

console.log(JSON.stringify({ counts, exclusions }, null, 2));
