const fs = require('fs');
const file = 'assets/Script/window/UserInfoModel.ts';
let text = fs.readFileSync(file).toString('latin1');

function insertAfter(anchor, addition) {
  if (!text.includes(anchor)) throw new Error(`Missing anchor: ${anchor.slice(0, 50)}`);
  text = text.replace(anchor, anchor + addition);
}

insertAfter(`    public _setAp() {
        if (!this.User) {
            return;
        }
`, `        const lockedValue = this.getLevelUpLockedResourceValue(Game.Content.Types.Ap);
        if (lockedValue != null) {
            this.apStop = true;
            this.showAp = lockedValue;
            this.stopResourceNumAnimAt(Game.Content.Types.Ap, lockedValue);
            this.setApWithNum(lockedValue);
            return;
        }
`);

insertAfter(`    public updateCash() {
`, `        const lockedValue = this.getLevelUpLockedResourceValue(Game.Content.Types.Cash);
        if (lockedValue != null) {
            this.stopResourceNumAnimAt(Game.Content.Types.Cash, lockedValue);
            if (this.cashLabel) this.cashLabel.string = String(lockedValue);
            return;
        }
`);

insertAfter(`    public updateAp(dt: number) {
`, `        const lockedValue = this.getLevelUpLockedResourceValue(Game.Content.Types.Ap);
        if (lockedValue != null) {
            this.apStop = true;
            this.showAp = lockedValue;
            this.stopResourceNumAnimAt(Game.Content.Types.Ap, lockedValue);
            this.setApWithNum(lockedValue);
            return;
        }
`);

insertAfter(`    public updateCoin() {
`, `        const lockedValue = this.getLevelUpLockedResourceValue(Game.Content.Types.Coin);
        if (lockedValue != null) {
            this.stopResourceNumAnimAt(Game.Content.Types.Coin, lockedValue);
            if (this.labelCoin) this.labelCoin.string = GameKit.StringUtil.formatNumber(lockedValue);
            return;
        }
`);

text = text.replace('        numAnim.playAnim(Number(value) || 0, Number(value) || 0, 0);', '        numAnim.stopAt(Number(value) || 0);');
fs.writeFileSync(file, Buffer.from(text, 'latin1'));
