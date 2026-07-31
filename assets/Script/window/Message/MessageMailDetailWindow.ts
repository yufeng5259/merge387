import { _decorator, instantiate, Label, Layout, Node, RichText, Sprite, SpriteFrame, sys, UITransform } from 'cc';
import { UIWindow } from '../../GameKit/ui/UIWindow';

const { ccclass, property } = _decorator;

@ccclass('MessageMailDetailWindow')
export default class MessageMailDetailWindow extends UIWindow {
    static windowPath = 'Message/MessageMailDetailWindow';
    @property(Label) labelTitle: Label | null = null;
    @property(RichText) richtext_des: RichText | null = null;
    @property(Node) layout_reward: Node | null = null;
    @property(Sprite) img: Sprite | null = null;
    @property(Node) loading: Node | null = null;
    @property(Label) labelClaim: Label | null = null;
    present: any = null;
    rewards: any[] = [];
    onPresentReceived: any = null;

    onShow(params: any) {
        if (!params?.present) return;
        this.present = params.present;
        this.onPresentReceived = params.onPresentReceived;
        if (this.labelTitle) this.labelTitle.string = this.present.title || '';
        if (this.richtext_des) this.richtext_des.string = this.present.msg || '';
        this.showImage(this.present.imageUrl);
        this.showRewards(this.present.rewards, this.present.received);
    }
    onClose() { if (this.img) { cce.releaseSpriteFrame(this.img); this.img.spriteFrame = null; } }
    releaseImage() { this.onClose(); }
    openUrl(_event: any, url: string) { if (/^https?:\/\//.test(url || '')) sys.openURL(url); }
    event_confirm() {
        if (!this.rewards.length || this.present.received) return this.closeAnim();
        const req = SR.SRVillage.collectPresent(this.present.id);
        req.SetCallBack(() => {
            this.markPresentReceived(this.present);
            const cache = GameKit.DataCache.GetData('UserPresentList') || {};
            if (cache[this.present.id]) this.applyReceivedState(cache[this.present.id]);
            GameKit.DataCache.SetData('UserPresentList', cache);
            this.onPresentReceived?.(this.present);
            this.showRewards(this.present.rewards, true);
            this.updateClaimLabel();
            UIRoot.instance.openChildWindow('ShopBuySucessWindow', { rewards: this.rewards, nextWindow: 'none' });
        });
        req.Send();
    }
    call_close() { this.closeAnim(); }
    hasRewards() { return this.rewards.length > 0; }
    updateClaimLabel() { if (this.labelClaim) this.labelClaim.string = GameKit.i18n.t(this.hasRewards() && !this.present?.received ? 'MessageMailDetailWindow_claim' : 'MessageMailDetailWindow_confirm'); }
    getNodeComponent(name: string, comp: any) { return this.getNodeByName(this.node, name)?.getComponent(comp) || null; }
    getNodeByName(root: Node, name: string): Node | null { if (root.name === name) return root; for (const child of root.children) { const found = this.getNodeByName(child, name); if (found) return found; } return null; }
    getRewardTemplate() { return this.layout_reward?.children[0] || null; }
    clearRewardItems(itemTemplate: Node | null) { this.layout_reward?.children.slice().forEach(child => { if (child !== itemTemplate) child.destroy(); }); }
    updateRewardLayoutCenter(itemTemplate?: Node | null) {
        if (!this.layout_reward) return;
        const layout = this.layout_reward.getComponent(Layout);
        const transform = this.layout_reward.getComponent(UITransform);
        if (!layout || !transform) return;
        const children = this.layout_reward.children.filter(child => child.active && child !== itemTemplate);
        if (children.length === 0) {
            layout.updateLayout();
            return;
        }
        const contentWidth = children.reduce((width, child, index) => {
            const childWidth = child.getComponent(UITransform)?.contentSize.width || 0;
            return width + childWidth * Math.abs(child.scale.x || 1) + (index > 0 ? layout.spacingX : 0);
        }, 0);
        const padding = Math.max(0, (transform.contentSize.width - contentWidth) / 2);
        layout.paddingLeft = padding;
        layout.paddingRight = padding;
        layout.updateLayout();
    }
    collectPresent(callback?: Function) { if (!this.present || this.present.received) return; const req = SR.SRVillage.collectPresent(this.present.id); req.SetCallBack((res: any) => { this.markPresentReceived(this.present); callback?.(res); }); req.Send(); }
    markPresentReceived(present: any) { if (!present) return; this.applyReceivedState(present); this.updatePresentCache(); }
    applyReceivedState(present: any) {
        if (!present) return;
        present.received = true;
        if (present.unread !== undefined) present.unread = false;
        if (present.read !== undefined) present.read = true;
        if (present.isRead !== undefined) present.isRead = true;
        if (present.readed !== undefined) present.readed = true;
    }
    updatePresentCache() { const cache = GameKit.DataCache.GetData('UserPresentList') || {}; if (this.present?.id != null) cache[this.present.id] = this.present; GameKit.DataCache.SetData('UserPresentList', cache); }
    refreshInBoxWindow() { this.onPresentReceived?.(this.present); }
    private showImage(url: string) {
        if (!this.img) return;
        this.img.node.active = !!url;
        if (!url) return;
        if (this.loading) this.loading.active = true;
        cce.loaderLoad({ url, type: /\.jpe?g($|\?)/i.test(url) ? 'jpg' : 'png' }, (err: any, texture: any) => {
            if (err || !this.img) return;
            if (this.loading) this.loading.active = false;
            this.img.spriteFrame = new SpriteFrame(texture);
        });
    }
    private showRewards(value: string, received: boolean) {
        if (!this.layout_reward) return;
        const template = this.layout_reward.children[0];
        if (!template) return;
        this.layout_reward.children.slice(1).forEach(child => child.destroy());
        template.active = false;
        this.rewards = value ? (Game.Content.FromStrings(value) || []).filter(Boolean) : [];
        this.layout_reward.active = this.rewards.length > 0;
        this.rewards.forEach(content => {
            const item = instantiate(template); item.parent = this.layout_reward; item.active = true;
            (item.getComponent('ContentModel') as any)?.show(content);
            const gou = GameKit.ControllerTable.GetNode(item, 'gou'); if (gou) gou.active = !!received;
        });
        if (this.labelClaim) this.labelClaim.string = GameKit.i18n.t(this.rewards.length && !received ? 'MessageMailDetailWindow_claim' : 'MessageMailDetailWindow_confirm');
    }
}
