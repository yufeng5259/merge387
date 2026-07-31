const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const outputDir = process.env.SCRIPT_MIGRATION_OUTPUT_DIR || 'docs/generated/script-migration-20260728';
const manifest = require(path.resolve(outputDir, 'source-script-manifest.json'));
const comparable = require(path.resolve(outputDir, 'live-comparable-files.json'));
const sourceRoot = process.env.SCRIPT_MIGRATION_SOURCE_ROOT || 'F:/qiguobing/git/creator/test/coinbeach2415';

function sha256(file) {
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex').toUpperCase();
}

function resolves(fromFile, request) {
  const base = path.resolve(path.dirname(fromFile), request);
  return ['', '.ts', '.tsx', '.js', '.json'].some(ext => fs.existsSync(base + ext)) || fs.existsSync(path.join(base, 'index.ts'));
}

const missingImports = [];
for (const rel of comparable) {
  const file = `assets/Script/${rel}.ts`;
  const source = fs.readFileSync(file, 'latin1');
  const importPattern = /(?:import[^'\"]*from\s*|import\s*)['\"]([^'\"]+)['\"]/g;
  for (const match of source.matchAll(importPattern)) {
    if (match[1].startsWith('.') && !resolves(file, match[1])) missingImports.push(`${file} -> ${match[1]}`);
  }
}

let metasChecked = 0;
const uuidMismatches = [];
for (const entry of manifest.entries) {
  if (!entry.sourceMetaExists || !entry.targetMetaExists) continue;
  const sourceUuid = JSON.parse(fs.readFileSync(path.join(sourceRoot, entry.sourceMetaPath), 'utf8')).uuid;
  const targetUuid = JSON.parse(fs.readFileSync(entry.targetMetaPath, 'utf8')).uuid;
  metasChecked += 1;
  if (sourceUuid !== targetUuid && entry.sourcePath !== 'assets/Script/__game__.js') {
    uuidMismatches.push({ sourcePath: entry.sourcePath, sourceUuid, targetUuid });
  }
}

const exclusionChecks = manifest.exclusions.map(item => ({
  targetPath: item.targetPath,
  expected: item.sha256,
  actual: sha256(item.targetPath),
  matches: sha256(item.targetPath) === item.sha256,
}));

const result = {
  comparableFiles: comparable.length,
  missingImports,
  metasChecked,
  uuidMismatches,
  intentionalEntryUuidMapping: 'assets/Script/__game__.js -> assets/Script/LegacyGlobals.ts',
  exclusionChecks,
};
console.log(JSON.stringify(result, null, 2));
if (missingImports.length || uuidMismatches.length || exclusionChecks.some(item => !item.matches)) process.exitCode = 1;
