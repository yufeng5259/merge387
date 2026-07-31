const fs = require('fs');

function dedupe(file, blocks) {
  let text = fs.readFileSync(file).toString('latin1');
  for (const block of blocks) {
    while (text.includes(block + block)) text = text.replace(block + block, block);
  }
  fs.writeFileSync(file, Buffer.from(text, 'latin1'));
}

const shop = `    getShopEntryButton() {
        if (this.shopEntryButton && isValid(this.shopEntryButton)) return this.shopEntryButton
        this.shopEntryButton = this.findChildByName(this.node, "btnShop")
        return this.shopEntryButton
    }
    canShowShopEntry() {
        const manager = Game.MergeTutorialManager
        return !(manager?.ShouldShowShopEntryButton && !manager.ShouldShowShopEntryButton())
    }
    refreshShopEntryVisibility() {
        const button = this.getShopEntryButton()
        if (button) button.active = this.canShowShopEntry()
    }
`;
const pack = `    canAutoOpenNewPlayerPack() {
        if (!this.canShowNewPlayerPack()) return false
        const manager = Game.MergeTutorialManager
        if (!manager) return true
        if (manager.IsFinished?.() === false) return false
        if (manager.GetTriggerMeta?.(manager.P4TriggerId) && manager.IsP4Completed?.() === false) return false
        if (manager.GetTriggerMeta?.(manager.P5GeneratorTriggerId) && manager.IsP5GeneratorCompleted?.() === false) return false
        return !manager.ShouldBlockForceGuideGlobalUi?.()
    }
`;
const time = `    formatNewPlayerPackEntryTime(remain) {
        const value = GameKit.TimeUtil.GetRemainTimeTable(remain)
        if (value.day > 0) return value.day + "d " + value.hour + "h"
        if (value.hour > 0) return value.hour + "h " + value.minute + "min"
        if (value.minute > 0) return value.minute + "min"
        return value.second + "s"
    }
`;

let main = fs.readFileSync('assets/Script/window/GameMainWindow.ts').toString('latin1');
main = main.replace(/    formatNewPlayerPackEntryTime\(remain\) \{[\s\S]*?    \}\n    formatNewPlayerPackEntryTime\(remain\) \{[\s\S]*?    \}\n    openMerge\(\)\{/, time + '    openMerge(){');
fs.writeFileSync('assets/Script/window/GameMainWindow.ts', Buffer.from(main, 'latin1'));
dedupe('assets/Script/window/GameMainWindow.ts', [shop, pack, '    shopEntryButton: any = null;\n']);

let userInfo = fs.readFileSync('assets/Script/window/UserInfoModel.ts').toString('latin1');
userInfo = userInfo.replace('        numAnim.playing = false;\n        numAnim.currentValue = Number(value) || 0;', '        numAnim.playAnim(Number(value) || 0, Number(value) || 0, 0);');
fs.writeFileSync('assets/Script/window/UserInfoModel.ts', Buffer.from(userInfo, 'latin1'));
