const fs = require('fs');

const file = 'assets/Script/game/MetaManager.ts';
let text = fs.readFileSync(file).toString('latin1');

function insertAfter(anchor, addition) {
  if (text.includes(addition.trim())) return;
  if (!text.includes(anchor)) throw new Error(`MetaManager anchor missing: ${anchor}`);
  text = text.replace(anchor, anchor + addition);
}

insertAfter("import './mergeTutorial/meta/MergeTutorialTriggerMeta'", "\nimport './weakGuide/meta/WeakGuideMeta'\nimport './weakGuide/meta/WeakGuideConditionMeta'");
insertAfter('    MergeTutorialTrigger:"mergeTutorialTrigger",', '\n    WeakGuide:"weakGuide",\n    WeakGuideCondition:"weakGuideCondition",');
insertAfter('    this.SetTypeData(Meta.MetaType.MergeTutorialTrigger, Meta.MergeTutorialTriggerMeta.MakeEntity, metaData[Meta.MetaType.MergeTutorialTrigger] || {})', '\n    this.SetTypeData(Meta.MetaType.WeakGuide, Meta.WeakGuideMeta.MakeEntity, metaData[Meta.MetaType.WeakGuide] || {})\n    this.SetTypeData(Meta.MetaType.WeakGuideCondition, Meta.WeakGuideConditionMeta.MakeEntity, metaData[Meta.MetaType.WeakGuideCondition] || {})');

fs.writeFileSync(file, Buffer.from(text, 'latin1'));
console.log('patched weak guide MetaManager registration');
