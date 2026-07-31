const fs = require('fs');

const files = [
  'MapBuyBuildWindow',
  'MapBuildUpgradeWindow',
  'MapBuildStageUpgradeWindow',
  'MapBuildMaxLevelWindow',
];

function insertOnce(text, anchor, addition, marker) {
  if (text.includes(marker)) return text;
  if (!text.includes(anchor)) throw new Error(`Missing anchor ${anchor}`);
  return text.replace(anchor, anchor + addition);
}

for (const name of files) {
  const file = `assets/Script/window/Map/${name}.ts`;
  let text = fs.readFileSync(file, 'utf8');
  text = insertOnce(text, "import { UIWindow } from '../../GameKit/ui/UIWindow';", "\nimport BuildingFocusEffect from '../../game/map/BuildingFocusEffect';", "import BuildingFocusEffect from '../../game/map/BuildingFocusEffect';");
  text = insertOnce(text, '    buildDisplayNode: Node | null = null;', '\n    focusEffect: BuildingFocusEffect | null = null;', 'focusEffect: BuildingFocusEffect | null');
  text = insertOnce(text, '        this.showBuildNode();', '\n        this.showFocusBuild();', '        this.showFocusBuild();');
  text = insertOnce(text, "        this.buildDisplayNode = find('bg/buildNode', this.node);", "\n        this.focusEffect = this.getComponentByPath('BuildingFocusEffect', BuildingFocusEffect);", "this.focusEffect = this.getComponentByPath('BuildingFocusEffect'");
  const methodAnchor = '    getMapElementNode(node: Node | null) {';
  if (!text.includes('    showFocusBuild() {')) {
    if (!text.includes(methodAnchor)) throw new Error(`Missing method anchor in ${file}`);
    text = text.replace(methodAnchor, "    showFocusBuild() { if (this.focusEffect && this.mNode) this.focusEffect.show(this.mNode); }\n    clearFocusBuild() { this.focusEffect?.clear(); }\n    onClose() { this.clearFocusBuild(); }\n\n" + methodAnchor);
  }
  fs.writeFileSync(file, text, 'utf8');
}

console.log(`patched ${files.length} building focus consumers`);
