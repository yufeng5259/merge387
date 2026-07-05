import { _decorator, Component, EditBox, Label, Node, ProgressBar, Sprite, SpriteFrame, sys, UIOpacity } from 'cc';
import { UIWindow } from '../../GameKit/ui/UIWindow';
import { bindGuardedClick, unbindGuardedClick } from '../../GameKit/ui/TouchClickGuard';

const { ccclass, property } = _decorator;

@ccclass('AvatarWindow')
export default class AvatarWindow extends UIWindow {
    public static windowPath = 'Sys/AvatarWindow';

    @property(Label)
    nameLabel: Label | null = null;

    @property(EditBox)
    editNameInput: EditBox | null = null;

    @property(Label)
    idLabel: Label | null = null;

    @property(Label)
    levelLabel: Label | null = null;

    @property(ProgressBar)
    expProgress: ProgressBar | null = null;

    @property(ProgressBar)
    expProgress1: ProgressBar | null = null;

    @property(Label)
    expLabel: Label | null = null;

    @property(Node)
    giftRewardsLayout: Node | null = null;

    @property(Node)
    avatarNode: Node | null = null;

    /** @type {UITabContainer} tab node鏁扮粍 */
    @property(Component)
    tab_node_array: any = null;

    @property(Component)
    list: any = null;

    showParams: any = null;
    MAX_AVATAR_FRAME_COUNT = 4;
    tab_index = 0;
    selectedAvatarFrameName: any = '1';
    selectedAvatarName = '';
    avatarArrData: any[] = [];

    onShow(showParams: any) {
        this.showParams = showParams;
        // this.parseAvatarName(showParams.user.Avatar());

        if (this.nameLabel) this.nameLabel.string = showParams.user.Name();
        if (this.idLabel) this.idLabel.string = 'ID:' + showParams.user.Id().toString();
        if (this.levelLabel) this.levelLabel.string = showParams.user.Level().toString();
        let expInfo = showParams.user.GetLevelExpInfo ? showParams.user.GetLevelExpInfo() : null;
        let levelExp = Meta.MetaManager.GetMeta(Meta.MetaType.Level, showParams.user.Level()).Exp();
        let expProgress = expInfo ? expInfo.progress : showParams.user.Exp() / levelExp;
        if (this.expProgress) this.expProgress.progress = expProgress;
        if (this.expProgress1) this.expProgress1.progress = expProgress;
        if (this.expLabel) this.expLabel.string = expInfo ? expInfo.current.toString() + '/' + expInfo.need.toString() : showParams.user.Exp().toString() + '/' + levelExp.toString();
        if (this.editNameInput) {
            this.editNameInput.string = '';
            this.setNodeOpacity(this.editNameInput.node, 0);
            this.editNameInput.placeholder = GameKit.i18n.t('EditNickName');
        }

        this.MAX_AVATAR_FRAME_COUNT = 4;
        this.tab_index = 0;

        let avatarArrData = showParams.user.Avatar().split(';');
        let avatarIcon = GameKit.ControllerTable.GetComponent(this.avatarNode, 'icon', Sprite);
        let avatarFrame = GameKit.ControllerTable.GetComponent(this.avatarNode, 'frame', Sprite);
        this.selectedAvatarFrameName = (avatarArrData.length > 1) ? avatarArrData[1] : '1';
        this.selectedAvatarName = avatarArrData[0] || 'https://cb-cdn.goldaxe.net/coinbeach/icons/2044.jpg';

        avatarFrame.spriteFrame = CommonAssets.instance.getByAtlas(CommonAssets.Atlases.AvatarFrames, this.selectedAvatarFrameName);
        this.SetAvatar(avatarIcon, this.selectedAvatarName);
        // console.log(this.selectedAvatarName);

        if (this.tab_node_array) {
            this.tab_node_array.onShow((index: number, tab: any, first: boolean) => {
                console.log(first, 'index:', index);
                this.tab_index = index;
                if (index == 0) {
                    this.list.numItems = 20;
                } else {
                    this.list.numItems = this.MAX_AVATAR_FRAME_COUNT;
                }
            }, this.tab_index);
        }

        let showLevelAndReward = () => {
            let giftRewards = Game.Content.FromStrings(Meta.MetaManager.GetMeta(Meta.MetaType.Level, this.showParams.user.Level()).Rewards());
            if (!this.giftRewardsLayout) return;
            this.giftRewardsLayout.children.forEach((child, index) => {
                if (index < giftRewards.length) {
                    child.active = true;
                    let contentModel: any = child.getComponent('ContentModel');
                    if (contentModel) contentModel.show(giftRewards[index], { infoBtnParams: { canTouch: false, showInfoBtn: true } });
                    //姝ゅ濂栧姳鍙兘鐪嬶紝鍗囩骇鍚庤嚜鍔ㄥ彂閫佸鍔?
                } else {
                    child.active = false;
                }
            });
        };

        showLevelAndReward();
    }

    parseAvatarName(avatarName: any) {
        // this.avatarArrData=["avatarUrl","frameName"];
        let avatar = this.showParams.user.Avatar();
        this.avatarArrData = avatar.split(';');
        if (this.avatarArrData.length == 1) {
            this.avatarArrData[1] = '1';
        }
    }

    onItemRender(node: Node, index: number) {
        // console.log(node,index);
        let avatarSprite = GameKit.ControllerTable.GetComponent(node, 'icon', Sprite);
        let avatarFrameSprite = GameKit.ControllerTable.GetComponent(node, 'frame', Sprite);
        let selectFrameRect = GameKit.ControllerTable.GetNode(node, 'selectFrame');
        let gouSprite = GameKit.ControllerTable.GetComponent(node, 'gou', Sprite);
        selectFrameRect.active = false;
        gouSprite.node.active = false;
        let avatarFrameName: any = index + 1;
        let avatarName = '';
        this.SetAvatar(avatarSprite, avatarName);
        if (this.tab_index == 0) {
            //澶村儚
            //鑾峰彇澶村儚
            // avatarFrameName="1";
            // avatarFrameSprite.spriteFrame = CommonAssets.instance.getByAtlas(CommonAssets.Atlases.AvatarFrames, avatarFrameName);
            this.SetAvatar(avatarSprite, avatarName);
        } else {
            //澶村儚妗?
            avatarSprite.spriteFrame = CommonAssets.instance.avatar_default;

            if (avatarFrameName == this.selectedAvatarFrameName) {
                selectFrameRect.active = true;
                gouSprite.node.active = true;
            } else {
                selectFrameRect.active = false;
                gouSprite.node.active = false;
            }
            avatarFrameSprite.spriteFrame = CommonAssets.instance.getByAtlas(CommonAssets.Atlases.AvatarFrames, avatarFrameName);
        }
        unbindGuardedClick(node, this);
        bindGuardedClick(node, this, () => {
            if (this.tab_index == 0) {

            } else {
                this.selectedAvatarFrameName = index + 1;
                let avatarFrame = GameKit.ControllerTable.GetComponent(this.avatarNode, 'frame', Sprite);
                avatarFrame.spriteFrame = CommonAssets.instance.getByAtlas(CommonAssets.Atlases.AvatarFrames, this.selectedAvatarFrameName);
                this.list.updateAll();
            }
        });
    }

    SetAvatar(sprite: any, avatar: any) {
        if (sprite == null) return;
        try {
            const requestAvatar = avatar || '';
            sprite._avatar = requestAvatar;
            sprite.spriteFrame = CommonAssets.instance.avatar_default;

            // 鍙鐞嗙綉缁滃ご鍍?
            if (requestAvatar.length > 0) {
                // 灏介噺鏍规嵁 url 鑷姩鎺ㄦ柇绫诲瀷锛岄伩鍏嶅啓姝?jpg 瀵艰嚧瑙ｆ瀽寮傚父
                cce.loaderLoad({ url: requestAvatar, type: 'jpg' }, function(err: any, tex: any) {
                    if (err == null && tex != null && sprite._avatar == tex._rawUrl) {
                        let spriteFrame = new SpriteFrame();
                        spriteFrame.texture = tex;
                        if (sprite.node) sprite.spriteFrame = spriteFrame;
                    }
                }, true);
            }
        } catch (e) {}
    }

    onEditNameBegin() {
        if (!this.editNameInput || !this.nameLabel) return;
        this.editNameInput.string = this.nameLabel.string;
        this.nameLabel.node.active = false;
    }

    onEditNameEnd() {
        if (!this.editNameInput || !this.nameLabel) return;
        if (this.editNameInput.string.length > 0) {
            this.nameLabel.string = this.editNameInput.string;
        } else {
            console.log('璇疯緭鍏ュ悕瀛?');
        }
        this.nameLabel.node.active = true;
        this.editNameInput.string = '';
        this.setNodeOpacity(this.editNameInput.node, 0);
    }

    onClickSave() {
        let avatarInfo = this.selectedAvatarName + ';' + this.selectedAvatarFrameName;
        let sr = SR.SRUserData.saveAvatarInfo(avatarInfo, this.nameLabel ? this.nameLabel.string : '');
        sr.SetCallBack(function(res: any) {
            Game.SUser.updateData(res);
            GameKit.GameEvent.DispatcherEvent(GameKit.GameEvent.EventName.UserInfoEvent);
            console.log('saveAvatarInfo', res);
        });
        sr.Send();
    }

    /**
     * Web 鍏滃簳锛氶殣钘?textarea + execCommand('copy')
     * @param {string} text
     * @returns {boolean}
     */
    _copyTextExecCommand(text: string) {
        if (typeof document === 'undefined') return false;
        try {
            let ta = document.createElement('textarea');
            ta.value = text;
            ta.setAttribute('readonly', 'readonly');
            ta.style.position = 'fixed';
            ta.style.left = '-9999px';
            ta.style.top = '0';
            document.body.appendChild(ta);
            ta.focus();
            ta.select();
            ta.setSelectionRange(0, text.length);
            let ok = document.execCommand('copy');
            document.body.removeChild(ta);
            return ok;
        } catch (e) {
            return false;
        }
    }

    /**
     * @param {string} text
     * @param {function(boolean)} [done] 鏄惁澶嶅埗鎴愬姛
     */
    _copyTextToClipboard(text: any, done?: any) {
        if (text == null || text === '') {
            if (done) done(false);
            return;
        }
        text = String(text);
        let clipboard = (sys as any).clipboard;
        if ((sys as any).isNative && clipboard && typeof clipboard.setString === 'function') {
            clipboard.setString(text);
            if (done) done(true);
            return;
        }
        if (typeof navigator !== 'undefined' && navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
            navigator.clipboard.writeText(text).then(function() {
                if (done) done(true);
            }).catch(function(this: AvatarWindow) {
                if (this._copyTextExecCommand(text)) {
                    if (done) done(true);
                } else {
                    if (done) done(false);
                }
            }.bind(this));
            return;
        }
        if (this._copyTextExecCommand(text)) {
            if (done) done(true);
        } else {
            if (done) done(false);
        }
    }

    onClickCopyId() {
        let idStr = this.showParams && this.showParams.user
            ? String(this.showParams.user.Id())
            : (this.idLabel ? this.idLabel.string.replace(/^ID\s*:/i, '').trim() : '');
        this._copyTextToClipboard(idStr, function(ok: boolean) {
            if (ok) {
                console.log('宸插鍒?ID:', idStr);
            } else {
                console.warn('澶嶅埗 ID 澶辫触');
            }
        });
    }

    close_window() {
        this.closeAnim();
    }

    private setNodeOpacity(node: Node, opacity: number) {
        let uiOpacity = node.getComponent(UIOpacity) || node.addComponent(UIOpacity);
        uiOpacity.opacity = opacity;
    }
}
