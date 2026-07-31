const fs = require('fs');
const path = require('path');

const DEFAULT_SOURCE_ROOT = 'F:/qiguobing/git/creator/test/coinbeach2415/assets';
const DEFAULT_TARGET_ROOT = process.cwd().replace(/\\/g, '/') + '/assets';
const DEFAULT_REPORT_PATH = 'F:/qiguobing/git/creator/test/coinbeach2415/docs/assets-diff-report.md';
const DEFAULT_OUT_DIR = process.cwd().replace(/\\/g, '/') + '/docs/generated/assets-sync-20260708';

const sourceRoot = normRoot(process.env.ASSETS_SOURCE_ROOT || DEFAULT_SOURCE_ROOT);
const targetRoot = normRoot(process.env.ASSETS_TARGET_ROOT || DEFAULT_TARGET_ROOT);
const reportPath = path.normalize(process.env.ASSETS_DIFF_REPORT || DEFAULT_REPORT_PATH);
const outDir = path.normalize(process.env.ASSETS_SYNC_OUT_DIR || DEFAULT_OUT_DIR);

function normRoot(value) {
  return path.resolve(path.normalize(value));
}

function toRel(root, file) {
  return path.relative(root, file).replace(/\\/g, '/');
}

function fromRel(root, rel) {
  return path.join(root, rel.replace(/\//g, path.sep));
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function readUtf8(file) {
  return fs.readFileSync(file, 'utf8');
}

function writeJson(name, value) {
  fs.writeFileSync(path.join(outDir, name), JSON.stringify(value, null, 2) + '\n', 'utf8');
}

function writeText(name, value) {
  fs.writeFileSync(path.join(outDir, name), value.endsWith('\n') ? value : value + '\n', 'utf8');
}

function walkFiles(root) {
  const files = [];
  const stack = [root];
  while (stack.length > 0) {
    const dir = stack.pop();
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        stack.push(full);
      } else if (entry.isFile()) {
        files.push(toRel(root, full));
      }
    }
  }
  files.sort((a, b) => a.localeCompare(b));
  return files;
}

function sectionText(markdown, heading) {
  const start = markdown.indexOf(`## ${heading}`);
  if (start < 0) return '';
  const rest = markdown.slice(start);
  const next = rest.indexOf('\n## ', 1);
  return next < 0 ? rest : rest.slice(0, next);
}

function parseRows(markdown) {
  const rows = [];
  let id = 1;

  function parseTable(heading, category, mapper) {
    const text = sectionText(markdown, heading);
    for (const line of text.split(/\r?\n/)) {
      if (!line.startsWith('|')) continue;
      if (line.includes('---')) continue;
      const cells = line.slice(1, -1).split('|').map((cell) => cell.trim());
      if (cells[0] === 'Relative path') continue;
      if (!cells[0] || cells[0] === heading) continue;
      rows.push({ id: id++, category, ...mapper(cells) });
    }
  }

  parseTable('Only in project assets', 'only-project', (cells) => ({
    rel: cells[0],
    projectSize: cells[1],
    projectMtime: cells[2],
  }));
  parseTable('Only in external assets', 'only-external', (cells) => ({
    rel: cells[0],
    externalSize: cells[1],
    externalMtime: cells[2],
  }));
  parseTable('Modified on both sides', 'modified', (cells) => ({
    rel: cells[0],
    projectSize: cells[1],
    externalSize: cells[2],
    projectMtime: cells[3],
    externalMtime: cells[4],
    difference: cells[5],
  }));

  return rows;
}

function mapSourceToTarget(rel) {
  if ((rel.startsWith('Script/') || rel.startsWith('other/')) && rel.endsWith('.js')) {
    return rel.slice(0, -3) + '.ts';
  }
  if ((rel.startsWith('Script/') || rel.startsWith('other/')) && rel.endsWith('.js.meta')) {
    return rel.slice(0, -8) + '.ts.meta';
  }
  if (rel.startsWith('Scene/') && rel.endsWith('.fire')) {
    return rel.slice(0, -5) + '.scene';
  }
  if (rel.startsWith('Scene/') && rel.endsWith('.fire.meta')) {
    return rel.slice(0, -10) + '.scene.meta';
  }
  return rel;
}

function sourceCandidatesForTarget(targetRel) {
  const candidates = [targetRel];
  if ((targetRel.startsWith('Script/') || targetRel.startsWith('other/')) && targetRel.endsWith('.ts')) {
    candidates.push(targetRel.slice(0, -3) + '.js');
  }
  if ((targetRel.startsWith('Script/') || targetRel.startsWith('other/')) && targetRel.endsWith('.ts.meta')) {
    candidates.push(targetRel.slice(0, -8) + '.js.meta');
  }
  if (targetRel.startsWith('Scene/') && targetRel.endsWith('.scene')) {
    candidates.push(targetRel.slice(0, -6) + '.fire');
  }
  if (targetRel.startsWith('Scene/') && targetRel.endsWith('.scene.meta')) {
    candidates.push(targetRel.slice(0, -11) + '.fire.meta');
  }
  return candidates;
}

function findSourceForTarget(sourceSet, targetRel) {
  for (const candidate of sourceCandidatesForTarget(targetRel)) {
    if (sourceSet.has(candidate)) return candidate;
  }
  return null;
}

function readMaybeText(file) {
  if (!fs.existsSync(file)) return '';
  const stat = fs.statSync(file);
  if (stat.size > 8 * 1024 * 1024) return '';
  const buf = fs.readFileSync(file);
  if (buf.includes(0)) return '';
  return buf.toString('utf8');
}

function listEvidenceFor(rel, files) {
  const evidence = new Set();
  if (/list/i.test(rel)) evidence.add('path-list');

  for (const file of files) {
    const normalizedFile = file.replace(/\\/g, '/');
    if (/\.meta$/i.test(normalizedFile)) continue;
    const text = readMaybeText(file);
    if (!text) continue;
    if (/\.tps$/i.test(normalizedFile)) {
      if (/<key>(?:fileList|ignoreFileList|replaceList)<\/key>/.test(text)) {
        evidence.add('texturepacker-list-key');
      }
      continue;
    }
    if (/\/Script\/GameKit\/i18n\/data\/[^/]+\.js$/i.test(normalizedFile) || /\/Script\/GameKit\/i18n\/data\/[^/]+\.ts$/i.test(normalizedFile)) {
      const keyMatches = [...text.matchAll(/["']([^"']+)["']\s*:/g)];
      if (keyMatches.some((match) => /list/i.test(match[1]))) evidence.add('i18n-key-list');
      continue;
    }
    if (/(?:import|require)\s*\(?\s*['"][^'"]*\/?List[^'"]*['"]/.test(text)) {
      evidence.add('import-or-require-List');
    }
    if (/\b[A-Za-z_$][A-Za-z0-9_$]*List[A-Za-z0-9_$]*\b/.test(text)) {
      evidence.add('identifier-list');
    }
    if (/(^|[^A-Za-z0-9_$])list(?:[A-Z0-9_]|$)/.test(text)) {
      evidence.add('identifier-list');
    }
    if (/\b[A-Za-z_$][A-Za-z0-9_$]*_list[A-Za-z0-9_$]*\b|\b[A-Za-z_$][A-Za-z0-9_$]*LIST[A-Za-z0-9_$]*\b/.test(text)) {
      evidence.add('identifier-list');
    }
    if (/(ListView|listView|ListItem|listItem|listNode|contentList|mailList|shopList|itemList|orderList|dataList)/.test(text)) {
      evidence.add('binding-or-component-list');
    }
    if (/\.(prefab|scene|fire)$/i.test(rel) && /['"][A-Za-z0-9_./-]*(?:List|list(?:[A-Z0-9_/-]|$))[A-Za-z0-9_./-]*['"]/.test(text)) {
      evidence.add('string-key-list');
    }
  }

  return [...evidence];
}

function metaBase(rel) {
  return rel.endsWith('.meta') ? rel.slice(0, -5) : null;
}

function applyPairedListSkips(entries, relKey, actionKey, skipValue) {
  const listRelatedRels = new Set(
    entries
      .filter((entry) => entry.listRelated)
      .map((entry) => entry[relKey]),
  );

  for (const entry of entries) {
    const base = metaBase(entry[relKey]);
    if (!base || !listRelatedRels.has(base)) continue;
    entry.listRelated = true;
    if (!entry.listEvidence.includes('paired-list-related')) {
      entry.listEvidence.push('paired-list-related');
    }
    entry[actionKey] = skipValue;
    if (entry.reason) entry.reason = 'Paired meta for a List-related item; target is left unchanged.';
  }
}

function applyWindowPrefabListSkips(reportRows) {
  const listWindowScripts = new Set(
    reportRows
      .filter((entry) => entry.listRelated && entry.targetRel.startsWith('Script/window/') && entry.targetRel.endsWith('.ts'))
      .map((entry) => entry.targetRel),
  );

  for (const entry of reportRows) {
    if (!entry.targetRel.startsWith('resources/window/') || !entry.targetRel.endsWith('.prefab')) continue;
    const scriptRel = 'Script/window/' + entry.targetRel.slice('resources/window/'.length, -'.prefab'.length) + '.ts';
    if (!listWindowScripts.has(scriptRel)) continue;
    entry.listRelated = true;
    if (!entry.listEvidence.includes('paired-list-window-script')) {
      entry.listEvidence.push('paired-list-window-script');
    }
    entry.initialAction = 'skipped-list-related';
  }
}

function relationEvidence(rel, sourceSet, targetSet, targetRel = mapSourceToTarget(rel)) {
  const files = [];
  const sourceFile = fromRel(sourceRoot, rel);
  const targetFile = fromRel(targetRoot, targetRel);
  if (sourceSet.has(rel)) files.push(sourceFile);
  if (targetSet.has(targetRel)) files.push(targetFile);
  return listEvidenceFor(`${rel} ${targetRel}`, files);
}

function classifyReportRow(row, sourceSet, targetSet) {
  const targetRel = mapSourceToTarget(row.rel);
  const sourceExists = sourceSet.has(row.rel);
  const targetExists = targetSet.has(targetRel);
  const listEvidence = relationEvidence(row.rel, sourceSet, targetSet, targetRel);
  const listRelated = listEvidence.length > 0;

  let initialAction = 'manual-review';
  if (listRelated) {
    initialAction = 'skipped-list-related';
  } else if (row.category === 'only-external') {
    initialAction = targetExists ? 'delete-source-missing' : 'confirm-absent';
  } else if (row.category === 'only-project') {
    initialAction = targetExists ? 'sync-source-present' : 'add-or-migrate';
  } else if (row.category === 'modified') {
    initialAction = targetRel.startsWith('Script/') ? 'port-js-to-ts' : 'sync-raw-or-prefab';
  }

  return {
    ...row,
    targetRel,
    sourceExists,
    targetExists,
    listRelated,
    listEvidence,
    initialAction,
  };
}

function classifySourceMissing(sourceRel, targetRel, sourceSet) {
  const sourceFile = fromRel(sourceRoot, sourceRel);
  const evidence = listEvidenceFor(`${sourceRel} ${targetRel}`, [sourceFile]);
  const listRelated = evidence.length > 0;

  let action = 'add-or-migrate';
  let reason = 'Source exists but mapped target file is missing.';
  if (listRelated) {
    action = 'skipped-list-related';
    reason = 'List-related source item; target is left unchanged.';
  } else if (sourceRel === 'Script/__game__.js' || sourceRel === 'Script/__game__.js.meta') {
    action = 'covered-by-legacyglobals-review';
    reason = 'Legacy global bootstrap is covered by TS migration infrastructure.';
  } else if (sourceRel.startsWith('Script/') && sourceRel.endsWith('.js')) {
    reason = 'Source JS requires TS migration or explicit coverage decision.';
  } else if (sourceRel.startsWith('Script/') && sourceRel.endsWith('.js.meta')) {
    reason = 'Source JS meta requires paired TS meta migration or explicit coverage decision.';
  }

  return {
    sourceRel,
    targetRel,
    sourceExists: sourceSet.has(sourceRel),
    targetExists: false,
    listRelated,
    listEvidence: evidence,
    action,
    reason,
  };
}

function classifyTargetOnly(targetRel, sourceRel, targetSet) {
  const targetFile = fromRel(targetRoot, targetRel);
  const evidence = listEvidenceFor(targetRel, [targetFile]);
  const listRelated = evidence.length > 0;

  let action = 'delete-source-missing';
  let reason = 'No source file matched after direct TS and JS->TS mapping.';
  if (listRelated) {
    action = 'skipped-list-related';
    reason = 'List-related target item; target is left unchanged.';
  } else if (/^Script\/(?:LegacyGlobals\.ts|LegacyGlobals\.ts\.meta|globals\.d\.ts|globals\.d\.ts\.meta)$/.test(targetRel)) {
    action = 'keep-ts-migration-infrastructure';
    reason = 'TS migration/global declaration infrastructure.';
  } else if (/^Script\/GameKit\/ui\/TouchClickGuard\.ts(?:\.meta)?$/.test(targetRel)) {
    action = 'keep-cocos3-runtime';
    reason = 'Cocos 3 target runtime UI click guard; needs review before removal.';
  }

  return {
    targetRel,
    mappedSourceRel: sourceRel,
    candidateSourceRels: sourceCandidatesForTarget(targetRel),
    targetExists: targetSet.has(targetRel),
    listRelated,
    listEvidence: evidence,
    action,
    reason,
  };
}

function countBy(items, key) {
  const counts = {};
  for (const item of items) {
    const value = item[key] || 'unknown';
    counts[value] = (counts[value] || 0) + 1;
  }
  return counts;
}

function main() {
  ensureDir(outDir);

  const report = readUtf8(reportPath);
  const sourceFiles = walkFiles(sourceRoot);
  const targetFiles = walkFiles(targetRoot);
  const sourceSet = new Set(sourceFiles);
  const targetSet = new Set(targetFiles);

  const reportRows = parseRows(report).map((row) => classifyReportRow(row, sourceSet, targetSet));
  applyWindowPrefabListSkips(reportRows);
  applyPairedListSkips(reportRows, 'rel', 'initialAction', 'skipped-list-related');
  const sourceToTargetMap = sourceFiles.map((sourceRel) => ({
    sourceRel,
    targetRel: mapSourceToTarget(sourceRel),
    targetExists: targetSet.has(mapSourceToTarget(sourceRel)),
  }));

  const sourcePresentTargetMissing = sourceToTargetMap
    .filter((entry) => !entry.targetExists)
    .map((entry) => classifySourceMissing(entry.sourceRel, entry.targetRel, sourceSet));
  applyPairedListSkips(sourcePresentTargetMissing, 'sourceRel', 'action', 'skipped-list-related');

  const sourceMissingTargetOnly = targetFiles
    .map((targetRel) => {
      const sourceRel = findSourceForTarget(sourceSet, targetRel);
      return { targetRel, sourceRel };
    })
    .filter((entry) => !entry.sourceRel)
    .map((entry) => classifyTargetOnly(entry.targetRel, entry.sourceRel, targetSet));
  applyPairedListSkips(sourceMissingTargetOnly, 'targetRel', 'action', 'skipped-list-related');

  const commonDifferentReport = reportRows.filter((row) => row.category === 'modified');
  const deleteCandidatesReviewed = sourceMissingTargetOnly;
  const manualReview = [
    ...sourceMissingTargetOnly.filter((entry) => entry.action.startsWith('keep-')),
    ...sourcePresentTargetMissing.filter((entry) => entry.action === 'covered-by-legacyglobals-review'),
  ];
  const listSkipped = [
    ...reportRows
      .filter((entry) => entry.initialAction === 'skipped-list-related')
      .map((entry) => ({ scope: 'report-row', rel: entry.rel, targetRel: entry.targetRel, evidence: entry.listEvidence })),
    ...sourcePresentTargetMissing
      .filter((entry) => entry.action === 'skipped-list-related')
      .map((entry) => ({ scope: 'source-present-target-missing', rel: entry.sourceRel, targetRel: entry.targetRel, evidence: entry.listEvidence })),
    ...sourceMissingTargetOnly
      .filter((entry) => entry.action === 'skipped-list-related')
      .map((entry) => ({ scope: 'source-missing-target-only', rel: entry.targetRel, targetRel: entry.targetRel, evidence: entry.listEvidence })),
  ];

  const reportCounts = countBy(reportRows, 'category');
  const summary = {
    generatedAt: new Date().toISOString(),
    reportPath: reportPath.replace(/\\/g, '/'),
    sourceRoot: sourceRoot.replace(/\\/g, '/'),
    targetRoot: targetRoot.replace(/\\/g, '/'),
    reportCounts: {
      onlyProject: reportCounts['only-project'] || 0,
      onlyExternal: reportCounts['only-external'] || 0,
      modified: reportCounts.modified || 0,
      total: reportRows.length,
    },
    fileCounts: {
      source: sourceFiles.length,
      target: targetFiles.length,
    },
    sourcePresentTargetMissing: sourcePresentTargetMissing.length,
    sourceMissingTargetOnly: sourceMissingTargetOnly.length,
    targetOnlyActions: countBy(sourceMissingTargetOnly, 'action'),
    sourceMissingActions: countBy(sourcePresentTargetMissing, 'action'),
    reportInitialActions: countBy(reportRows, 'initialAction'),
    listSkipped: listSkipped.length,
  };

  writeJson('report-diff-rows.json', reportRows);
  writeText('source-files.txt', sourceFiles.join('\n'));
  writeText('target-files.txt', targetFiles.join('\n'));
  writeJson('source-to-target-map.json', sourceToTargetMap);
  writeJson('source-present-target-missing.json', sourcePresentTargetMissing);
  writeJson('source-missing-target-only.json', sourceMissingTargetOnly);
  writeJson('common-different-report.json', commonDifferentReport);
  writeJson('delete-candidates-reviewed.json', deleteCandidatesReviewed);
  writeJson('manual-review.json', manualReview);
  writeJson('list-skipped.json', listSkipped);
  writeJson('summary.json', summary);

  const targetOnlyLines = Object.entries(summary.targetOnlyActions).map(([key, value]) => `- ${key}: ${value}`);
  const sourceMissingLines = Object.entries(summary.sourceMissingActions).map(([key, value]) => `- ${key}: ${value}`);
  const reportActionLines = Object.entries(summary.reportInitialActions).map(([key, value]) => `- ${key}: ${value}`);
  writeText('summary.md', [
    '# Assets Sync 20260708 Manifest Summary',
    '',
    `- Report rows: ${summary.reportCounts.total} (${summary.reportCounts.onlyProject} only-project, ${summary.reportCounts.onlyExternal} only-external, ${summary.reportCounts.modified} modified)`,
    `- Source files: ${summary.fileCounts.source}`,
    `- Target files: ${summary.fileCounts.target}`,
    `- Source-present target-missing after mapping: ${summary.sourcePresentTargetMissing}`,
    `- Source-missing target-only after mapping: ${summary.sourceMissingTargetOnly}`,
    `- List-skipped entries: ${summary.listSkipped}`,
    '',
    '## Target-only actions',
    '',
    ...targetOnlyLines,
    '',
    '## Source-missing actions',
    '',
    ...sourceMissingLines,
    '',
    '## Report row initial actions',
    '',
    ...reportActionLines,
  ].join('\n'));

  console.log(JSON.stringify(summary, null, 2));
}

main();
