const fs = require('fs');

function update(file, edits) {
  let text = fs.readFileSync(file).toString('latin1');
  for (const [anchor, replacement] of edits) {
    if (!text.includes(anchor)) {
      if (text.includes(replacement)) continue;
      throw new Error(`Missing anchor in ${file}: ${anchor.slice(0, 60)}`);
    }
    text = text.replace(anchor, replacement);
  }
  fs.writeFileSync(file, Buffer.from(text, 'latin1'));
}

let lock = fs.readFileSync('F:/qiguobing/git/creator/test/coinbeach2415/assets/Script/game/user/LevelUpDisplayLock.js', 'utf8').replace(/^\uFEFF/, '');
lock = `import '../../LegacyGlobals';\n\nconst LevelUpDisplayLock: any = {}\n` + lock.replace(/^var LevelUpDisplayLock = \{\}\s*/, '')
  .replace(/module\.exports = LevelUpDisplayLock\s*$/, 'export default LevelUpDisplayLock');
fs.writeFileSync('assets/Script/game/user/LevelUpDisplayLock.ts', lock, 'utf8');

update('assets/Script/window/GameMainWindow.ts', [
  [`    shopRedNode: any = null;`, `    shopRedNode: any = null;\n    shopEntryButton: any = null;`],
  [`    findChildByName(root, name) {`, `    getShopEntryButton() {
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
    findChildByName(root, name) {`],
  [`    canShowNewPlayerPack() {`, `    canAutoOpenNewPlayerPack() {
        if (!this.canShowNewPlayerPack()) return false
        const manager = Game.MergeTutorialManager
        if (!manager) return true
        if (manager.IsFinished?.() === false) return false
        if (manager.GetTriggerMeta?.(manager.P4TriggerId) && manager.IsP4Completed?.() === false) return false
        if (manager.GetTriggerMeta?.(manager.P5GeneratorTriggerId) && manager.IsP5GeneratorCompleted?.() === false) return false
        return !manager.ShouldBlockForceGuideGlobalUi?.()
    }
    canShowNewPlayerPack() {`],
  [`    openMerge(){`, `    formatNewPlayerPackEntryTime(remain) {
        const time = GameKit.TimeUtil.GetRemainTimeTable(remain)
        if (time.day > 0) return time.day + "d " + time.hour + "h"
        if (time.hour > 0) return time.hour + "h " + time.minute + "min"
        if (time.minute > 0) return time.minute + "min"
        return time.second + "s"
    }
    openMerge(){`],
]);

update('assets/Script/window/Other/MergeTutorialWindow.ts', [
  [`    showSkipNode() {`, `    shouldShowSkipNode() {
        return Game.MergeTutorialManager?.ShouldShowSkipButton?.(this.meta) ?? this.isMainForcedTutorialMeta();
    }

    showSkipNode() {`],
  [`        if (!this.isMainForcedTutorialMeta()) return;\n        this.skipNode.active = true;\n        this.skipNode.setPosition(0, -355);`, `        if (!this.shouldShowSkipNode()) return;\n        this.skipNode.active = true;\n        this.updateSkipNodeBottomRightPosition();`],
  [`    bringSkipNodeToTop() {`, `    updateSkipNodeBottomRightPosition() {
        if (!this.skipNode) return;
        const parentTransform = (this.skipNode.parent || this.node).getComponent(UITransform);
        const skipTransform = this.skipNode.getComponent(UITransform);
        const height = (skipTransform?.height || 0) * Math.abs(this.skipNode.scale.y || 1);
        this.skipNode.setPosition(0, -(parentTransform?.height || 0) / 2 + height / 2 + 20);
    }

    skipCurrentTutorial() {
        if (Game.MergeTutorialManager?.SkipCurrentTutorial) return Game.MergeTutorialManager.SkipCurrentTutorial();
        if (!Game.MergeTutorialManager?.SkipForcedTutorial) return false;
        Game.MergeTutorialManager.SkipForcedTutorial();
        return true;
    }

    bringSkipNodeToTop() {`],
  [`Game.MergeTutorialManager?.SkipForcedTutorial?.();`, `this.skipCurrentTutorial();`],
]);

update('assets/Script/window/UserInfoModel.ts', [
  [`    public playResourceNumAnimFromEvent(data: any, contentType: any) {`, `    public getLevelUpLockedResourceValue(contentType: any) {
        if (!this.isSelf || !LevelUpDisplayLock.IsResourceLocked(contentType)) return null;
        return LevelUpDisplayLock.GetDisplayResourceValue(this.User, contentType);
    }

    public refreshLevelUpResourceDisplay() {
        if (!this.isSelf) return;
        for (const type of [Game.Content.Types.Ap, Game.Content.Types.Coin, Game.Content.Types.Cash]) {
            const value = this.getLevelUpLockedResourceValue(type);
            if (value != null) { this.stopResourceNumAnimAt(type, value); this.setResourceLabelNum(type, value); }
        }
        this.updateCoin();
        this.updateCash();
    }

    public stopResourceNumAnimAt(contentType: any, value: number) {
        delete this._pendingResourceNumAnims[String(contentType)];
        const label = contentType === Game.Content.Types.Coin ? this.labelCoin : contentType === Game.Content.Types.Ap ? (this.labelAp || this.labelApFull) : contentType === Game.Content.Types.Cash ? this.cashLabel : null;
        const numAnim = label?.getComponent(NumAnim);
        if (!numAnim) return;
        numAnim.playing = false;
        numAnim.currentValue = Number(value) || 0;
    }

    public playResourceNumAnimFromEvent(data: any, contentType: any) {
        const lockedValue = this.getLevelUpLockedResourceValue(contentType);
        if (lockedValue != null) { this.stopResourceNumAnimAt(contentType, lockedValue); this.setResourceLabelNum(contentType, lockedValue); return true; }`],
]);

update('assets/Script/game/merge/MergeUI.ts', [
  [`    isValidFlySpineAnimIndex (spineAnimIndex: any) {`, `    RefreshUpgradeButtonVisible () {
        const canUpgrade = Game.SUserMap.IsRedPoint();
        if (this.noteDialog) this.noteDialog.node.active = canUpgrade;
        this._updateUpgradeButtonVisible(canUpgrade);
        return canUpgrade;
    }

    isValidFlySpineAnimIndex (spineAnimIndex: any) {`],
  [`        const canUpgrade = Game.SUserMap.IsRedPoint();\n        if (this.noteDialog) this.noteDialog.node.active = canUpgrade;\n        this._updateUpgradeButtonVisible(canUpgrade);`, `        this.RefreshUpgradeButtonVisible();`],
]);
