const fs = require('fs');
const path = require('path');

const target = path.resolve(__dirname, '../assets/Script/game/merge/MergeGeneraterMeta.ts');
let source = fs.readFileSync(target, 'latin1');
if (!source.includes('    static IsReady: any')) {
  source = source.replace('    static GetGenerateItemId: any', '    static GetGenerateItemId: any\r\n    static IsReady: any');
}
if (!source.includes('MergeGeneraterMeta.IsReady =')) {
  const marker = 'MergeGeneraterMeta.GetGenerateByMergeId = (mergeId) => {';
  const start = source.indexOf(marker);
  const nextDoc = source.indexOf('/**', start);
  if (start < 0 || nextDoc < 0) throw new Error('bounded insertion point not found');
  const method = 'MergeGeneraterMeta.IsReady = () => {\r\n    const metas = Meta.MetaManager.GetMetas(Meta.MetaType.MergeGenerater)\r\n    return !!metas && Object.keys(metas).length > 0\r\n}\r\n\r\n';
  source = source.slice(0, nextDoc) + method + source.slice(nextDoc);
}
fs.writeFileSync(target, source, 'latin1');
console.log('MergeGeneraterMeta.IsReady present');
