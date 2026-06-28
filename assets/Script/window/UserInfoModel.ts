/*if (this.labelStar && this.isSelf) {
GameKit.WebEvent.RegisterEvent(GameKit.WebEvent.EventName.StarEvent, this.uuid, function() {
this.updateStar()
}.bind(this))
}*/
/*if (this.labelStar && this.isSelf) {
GameKit.WebEvent.UnRegisterEvent(GameKit.WebEvent.EventName.StarEvent, this.uuid)
}*/
import { _decorator, Button, Color, Component, ImageAsset, Label, LabelOutline, Node, ProgressBar, Sprite, SpriteFrame, Texture2D } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('UserInfoModel')
export class UserInfoModel extends Component {
    @property(Node)
    public avatarNode = null;
    @property(Sprite)
    public avatarSprite = null;
    @property(Label)
    public labelName = null;
    @property(Label)
    public labelLevel = null;
    @property(ProgressBar)
    public expProgress = null;
    @property(Label)
    public labelAp = null;
    @property(Sprite)
    public spriteApFull = null;
    @property(Label)
    public labelApFull = null;
    @property(Label)
    public labelApRemain = null;
    @property
    public energyFullAnim: any = null;
    @property(Button)
    public btnApAdd = null;
    @property(Label)
    public labelCoin = null;
    @property(Button)
    public btnCoinAdd = null;
    @property(Sprite)
    public spriteCoin = null;
    @property(Label)
    public cashLabel = null;
    @property(Button)
    public btnCashAdd = null;
    @property(Label)
    public labelStar = null;
    @property([Node])
    public shields = [];
    @property(Node)
    public spVip = null;

    ctor () {
        // this.currentShowAp = 0 
    }

    updateShowAp () {
    }

    onLoad () {
    }

    show (User: any) {
        // if (User == null) return 
        // this.User = User 
        // this.isSelf = User === Game.SUser 
        // if (this.avatarNode) { 
                                    // UserInfoModel.SetAvatar(icon,frame, this.User) 
        // } 
        // if(this.isSelf){ 
            // GameKit.GameEvent.RegisterEvent(GameKit.GameEvent.EventName.UserInfoEvent, this.uuid, function() { 
                // if (this.avatarNode) { 
                                                            // UserInfoModel.SetAvatar(icon,frame, this.User) 
                // } 
                // if (this.labelName) { 
                    // this.labelName.string = this.User.Name() 
                // } 
                // if (this.labelLevel) { 
                    // this.labelLevel.string = this.User.Level().toString() 
                // } 
                // if (this.expProgress) { 
                    // let levelExp = Meta.MetaManager.GetMeta(Meta.MetaType.Level, this.User.Level()).Exp() 
                    // this.expProgress.progress = this.User.Exp() / levelExp 
                // } 
            // }.bind(this)) 
            // if(this.avatarSprite){ 
                // avatar touch handler disabled during migration 
                    // UIRoot.instance.openChildWindow("AvatarWindow", {user: this.User}) 
                // }) 
            // } 
        // } 
        // if (this.labelName) { 
            // this.labelName.string = this.User.Name() 
        // } 
        // if (this.labelLevel) { 
            // this.labelLevel.string = this.User.Level().toString() 
        // } 
        // if (this.expProgress) { 
            // let levelExp = Meta.MetaManager.GetMeta(Meta.MetaType.Level, this.User.Level()).Exp() 
            // this.expProgress.progress = this.User.Exp() / levelExp 
        // } 
        // if (this.genderMale) this.genderMale.active = User.Gender() === Game.User.Genders.Male 
        // if (this.genderFemale) this.genderFemale.active = User.Gender() === Game.User.Genders.genderFemale 
        // this.setAp() 
        // this.setCoin() 
        // this.setCash() 
        // this.setStar() 
        // this.setShield() 
        // this.setVip() 
    }

    update (dt: any) {
        // let cTime = GameKit.TimeUtil.getCurrentTime() 
        // let _t = this.lastUpdateTime ? cTime - this.lastUpdateTime : dt 
        // this.lastUpdateTime = cTime 
        // this.updateAp(_t) 
    }

    onClose () {
        // this.closeCoin() 
        // this.closeAp() 
        // this.closeShield() 
        // this.closeVip() 
    }

    onDisable () {
        // this.hiden = true 
    }

    onEnable () {
        // if (this.hiden) { 
            // if (this.labelAp || this.labelApFull || this.labelApRemain || this.spriteApFull) { 
                // this._setAp() 
            // } 
        // } 
    }

    setAp () {
        // if ((this.labelAp || this.labelApFull || this.labelApRemain || this.spriteApFull) && this.isSelf) { 
            // this._setAp() 
            // GameKit.WebEvent.RegisterEvent(GameKit.WebEvent.EventName.ApEvent, this.uuid, function() { 
                // this._setAp() 
            // }.bind(this)) 
        // } 
    }

    _setAp () {
        // if (!this.User) return 
        // this.apStop = false 
        // if (this.isSelf && Game.SUser && Game.SUser.GetFullApTime) { 
            // Game.SUser.GetFullApTime() 
        // } else if (this.User.UpdateApTime) { 
            // this.User.UpdateApTime() 
        // } 
        // let apNum = this.User.Ap() 
        // this.setApWithNum(apNum)         
    }

    setCash () {
        // this.updateCash() 
        // if (this.cashLabel && this.isSelf) { 
            // GameKit.WebEvent.RegisterEvent(GameKit.WebEvent.EventName.CashEvent, this.uuid, function() { 
                // this.updateCash() 
            // }.bind(this)) 
        // } 
        // if (this.btnCashAdd && this.isSelf) { 
            // this.btnCashAdd.node.on('click', function() { 
                // if (GamePlay.instance.isBusy()) return 
                // UIRoot.instance.openChildWindow("ShopWindow", {showCash: true}) 
            // }, this); 
        // } 
    }

    updateCash () {
        // if (this.cashLabel) this.cashLabel.string = this.User.Cash() 
    }

    getApRuntimeConfig () {
        // if (this.User && this.User.GetApRuntimeConfig) { 
            // return this.User.GetApRuntimeConfig() 
        // } 
        // let apMax = G.GameConstance.apMax 
        // let apRecoverSpins = G.GameConstance.apRecoverSpins 
        // if (Game.SUserStatus.IsVip()) { 
            // apMax = G.GameConstance.vipApMax 
            // apRecoverSpins = G.GameConstance.vipApRecoverSpins 
        // } 
        // let HugeSpinsMeta = Game.ActivityManager.GetActiveOtherActivityByType(Meta.ActivityMeta.SubTypes.HugeSpins) 
        // if (HugeSpinsMeta) { 
            // apMax += HugeSpinsMeta.Param().spinMaxAdd 
        // } 
        // return { 
            // apMax: apMax, 
            // apRecoverSpins: apRecoverSpins 
        // } 
    }

    setApWithNum (apNum: any) {
        // let apRuntime = this.getApRuntimeConfig() 
        // let apMax = apRuntime.apMax 
        // let apRecoverSpins = apRuntime.apRecoverSpins 
        // this.apRemainTime = G.GameConstance.apRecover - (this.User.ApRecover() + GameKit.TimeUtil.getCurrentTime() - 1 - this.User.ApRecoverLast()) 
        // var ap = isFinite(Number(apNum)) ? Number(apNum) : 0 
        // var maxAp = isFinite(Number(apMax)) ? parseInt(apMax) : 0 
        // if (this.labelAp) this.labelAp.string = ap.toString() 
        // if (this.labelApFull) this.labelApFull.string = Math.clamp(ap, 0, maxAp).toString() + " / " + apMax 
        // if (this.spriteApFull) this.spriteApFull.fillRange = Math.clamp(ap / maxAp, 0, 1) 
        // if (this.labelApRemain) { 
            // if(ap < maxAp){ 
                // this.labelApRemain.string = GameKit.TimeUtil.FormatRemainTimeSimple(this.apRemainTime)//String.format(GameKit.i18n.t("ApRecoverIn"), apRecoverSpins, GameKit.TimeUtil.FormatRemainTimeSimple(this.apRemainTime)) 
            // }else if(ap == maxAp){ 
                // this.labelApRemain.string = GameKit.i18n.t("ApFull") 
            // }else if(ap > maxAp){ 
                // this.labelApRemain.string = String.format(GameKit.i18n.t("ApPlus"), ap - maxAp) 
            // } 
        // } 
    }

    stopApAt (ap: any) {
        // this.apStop = true 
        // this.showAp = ap 
        // this.setApWithNum(ap)         
    }

    playApAnim (cb: any) {
        // var self = this 
        // self.energyFullAnim.play(function(){ 
            // self.apStop = false 
            // self._setAp() 
            // if(cb != null){ 
                // cb() 
            // } 
        // }) 
    }

    updateAp (dt: any) {
        // if (this.apRemainTime != null) { 
            // let apRuntime = this.getApRuntimeConfig() 
            // let apMax = apRuntime.apMax 
            // let apRecoverSpins = apRuntime.apRecoverSpins 
            // if(this.apStop){ 
                // if (this.showAp < apMax) { 
                    // this.apRemainTime -= dt 
                    // if (this.apRemainTime <= 0) { 
                        // this.showAp += apRecoverSpins 
                        // this.setApWithNum(this.showAp) 
                    // } else { 
                        // if (this.labelApRemain) this.labelApRemain.string = GameKit.TimeUtil.FormatRemainTimeSimple(this.apRemainTime)//String.format(GameKit.i18n.t("ApRecoverIn"), apRecoverSpins, GameKit.TimeUtil.FormatRemainTimeSimple(this.apRemainTime)) 
                    // } 
                // } 
            // }else{ 
                // if (this.User.Ap() < apMax) { 
                    // this.apRemainTime -= dt 
                    // if (this.apRemainTime <= 0) { 
                        // this._setAp() 
                        // if (SR && SR.SRMerge && SR.SRMerge.SaveLocalMergeSnapshot) { 
                            // SR.SRMerge.SaveLocalMergeSnapshot("apRecover") 
                        // } 
                    // } else { 
                        // if (this.labelApRemain) this.labelApRemain.string = GameKit.TimeUtil.FormatRemainTimeSimple(this.apRemainTime)//String.format(GameKit.i18n.t("ApRecoverIn"), apRecoverSpins, GameKit.TimeUtil.FormatRemainTimeSimple(this.apRemainTime)) 
                    // } 
                // } 
            // } 
        // } 
    }

    closeAp () {
        // if ((this.labelAp || this.labelApFull || this.labelApRemain || this.spriteApFull) && this.isSelf) { 
            // GameKit.WebEvent.UnRegisterEvent(GameKit.WebEvent.EventName.ApEvent, this.uuid) 
        // } 
    }

    setCoin () {
        // this.updateCoin() 
        // if (this.labelCoin && this.isSelf) { 
            // GameKit.WebEvent.RegisterEvent(GameKit.WebEvent.EventName.CoinEvent, this.uuid, function() { 
                // this.updateCoin() 
            // }.bind(this)) 
        // } 
        // if (this.btnCoinAdd) { 
            // this.btnCoinAdd.node.on('click', function() { 
                // if (GamePlay.instance.isBusy()) return 
                // UIRoot.instance.openChildWindow("ApNotEnoughDialogWindow") 
                // AppKit.LogEventWrap.logEvent("openshop_coin") 
            // }, this); 
        // } 
    }

    closeCoin () {
        // if (this.labelCoin && this.isSelf) { 
            // GameKit.WebEvent.UnRegisterEvent(GameKit.WebEvent.EventName.CoinEvent, this.uuid) 
        // } 
    }

    updateCoin () {
        // if (this.labelCoin) this.labelCoin.string = GameKit.StringUtil.formatNumber(this.User.Coin()) 
    }

    changeCoin (from: any, to: any, duration: any) {
        // if (from == to && duration != 0) return 
        // if(this.labelCoin) { 
            // if (this.labelCoin.getComponent("NumAnim") == null) { 
                // let na = this.labelCoin.addComponent("NumAnim") 
                // na.targetLabel = this.labelCoin 
            // } 
            // this.labelCoin.getComponent("NumAnim").playAnim(from, to, duration) 
        // } 
        // if (this.spriteCoin && duration > 0) { 
                                        // this.spriteCoin.node.stopAllActions() 
                            // }, this))) 
        // } 
    }

    setStar () {
        // this.updateStar() 
    }

    closeStar () {
    }

    updateStar () {
        // if (this.labelStar) this.labelStar.string = this.User.Star().toString() 
    }

    setShield () {
        // this.updateShield() 
        // if (this.shields.length > 0  && this.isSelf){ 
            // GameKit.WebEvent.RegisterEvent(GameKit.WebEvent.EventName.ShieldEvent, this.uuid, function(){ 
                // this.updateShield() 
            // }.bind(this)) 
        // } 
    }

    closeShield () {
        // if(this.shields.length > 0  && this.isSelf){ 
            // GameKit.WebEvent.UnRegisterEvent(GameKit.WebEvent.EventName.ShieldEvent, this.uuid) 
        // } 
    }

    updateShield () {
        // if(this.shields.length > 0 && this.isSelf){ 
            // for(var i = 0; i < this.shields.length; i++){ 
                // if(i < this.User.RawShield()){ 
                    // this.shields[i].active = true 
                // }else{ 
                    // this.shields[i].active = false 
                // } 
            // } 
        // } 
    }

    setShieldWithNum (num: any) {
        // if(this.shields.length > 0 && this.isSelf){ 
            // for(var i = 0; i < this.shields.length; i++){ 
                // if(i < num){ 
                    // this.shields[i].active = true 
                // }else{ 
                    // this.shields[i].active = false 
                // } 
            // } 
        // } 
    }

    changeShield (from: any, to: any, dt: any = 0.6) {
        // if(this.shields.length > 0 && this.isSelf){ 
            // for(var i = from; i < to; i++){ 
                // let shield = this.shields[i] 
                // shield.scaleX = 0 
                // shield.scaleY = 0 
                // shield.active = true 
                                // shield.runAction(seq) 
            // } 
        // } 
    }

    setVip () {
        // this.updateVip() 
        // if (this.isSelf) { 
            // GameKit.GameEvent.RegisterEvent(GameKit.GameEvent.EventName.StatusEvent, this.uuid, function() { 
                // this.updateVip() 
            // }.bind(this)) 
        // } 
    }

    updateVip () {
        // if (this.spVip) this.spVip.active = !!this.User.IsVip() 
        // if (this.labelName) { 
            // UserInfoModel.SetName(this.labelName, this.User) 
        // } 
    }

    closeVip () {
        // if (this.isSelf) { 
            // GameKit.GameEvent.UnRegisterEvent(GameKit.GameEvent.EventName.StatusEvent, this.uuid) 
        // } 
    }

    Flush () {
        // this.updateCoin() 
        // this.updateShield() 
        // this._setAp() 
    }

}


function createSpriteFrame(imageAsset: ImageAsset) {
    const texture = new Texture2D();
    texture.image = imageAsset;
    const spriteFrame = new SpriteFrame();
    spriteFrame.texture = texture;
    return spriteFrame;
}

(UserInfoModel as any).SetAvatar = function(sprite: Sprite, frame: Sprite, User: any) {
    if (sprite == null) return;
    try {
        let avatarArrData = User.Avatar().split(';');
        let avatar = avatarArrData[0];
        let frameName = avatarArrData[1] || '1';
        frame.spriteFrame = CommonAssets.instance.getByAtlas(CommonAssets.Atlases.AvatarFrames, frameName);
        (sprite as any)._avatar = avatar;
        sprite.spriteFrame = CommonAssets.instance.avatar_default;
        if (avatar != null && avatar.length > 0) {
            cce.loaderLoad({ url: avatar, type: 'jpg' }, function(err: any, tex: ImageAsset) {
                if (err == null && tex != null && (sprite as any)._avatar == (tex as any)._rawUrl) {
                    if (sprite.node) sprite.spriteFrame = createSpriteFrame(tex);
                }
            }, true);
        }
    } catch (e) {}
};

(UserInfoModel as any).SetName = function(labelName: Label, User: any) {
    labelName.string = User.Name();
    if ((labelName.node as any)._old_color) (labelName as any).color = (labelName.node as any)._old_color;
    let outline = labelName.getComponent(LabelOutline);
    if (outline && (outline as any)._old_color) outline.color = (outline as any)._old_color;
    if (User.IsVip()) {
        (labelName.node as any)._old_color = (labelName as any).color;
        (labelName as any).color = new Color(255, 216, 0);
        let outline = labelName.getComponent(LabelOutline);
        if (outline) {
            (outline as any)._old_color = outline.color;
            outline.color = new Color(255, 255, 255);
        }
    }
    labelName.node.active = !labelName.node.active;
    labelName.node.active = !labelName.node.active;
};
