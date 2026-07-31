import { _decorator, Component, Label, Node, RichText, Widget } from 'cc';
import { UIWindow } from '../../GameKit/ui/UIWindow';

const { ccclass, property } = _decorator;

@ccclass('MessageInBoxWindow')
export default class MessageInBoxWindow extends UIWindow {
    static windowPath = 'Message/MessageInBoxWindow';

    static getPresentNum() {
        const presentList = GameKit.DataCache.GetData('UserPresentList') || {};
        const currentTime = GameKit.TimeUtil.getCurrentTime();
        return Object.keys(presentList).reduce((count, id) => {
            if (id === 'cid') return count;
            const present = presentList[id];
            if (!present || (present.expire > 0 && currentTime > present.expire) || present.received) return count;
            return count + 1;
        }, 0);
    }

    @property(Component) list: any = null;
    @property(Node) bg: Node | null = null;
    @property(Label) label_no_messge: Label | null = null;
    @property(Node) btn_claim: Node | null = null;
    presentList: any = {};
    mailList: any[] = [];

    onShow() {
        this.initListView();
    }

    initListView() {
        if (this.list?.renderEvent) {
            this.list.renderEvent.target = this.node;
            this.list.renderEvent.component = 'MessageInBoxWindow';
            this.list.renderEvent.handler = 'onItemRender';
        }
        this.update_mail_item(this.get_mail_data());
    }

    refreshList(_hasMail = true) { this.update_mail_item(this.get_mail_data()); }
    updateBatchClaimLayout() { this.updateBottom(this.btn_claim?.active ? 130 : 50); }
    hasUnreceivedMail() { return this.mailList.some(mail => this.hasUnclaimedRewards(mail)); }
    updateWidgetBottom(node: Node | null, bottom: number) { const widget = node?.getComponent(Widget); if (widget) { widget.bottom = bottom; widget.updateAlignment(); } }
    updateWidgetAlignmentOnce(widget: Widget | null) { widget?.updateAlignment(); }
    getSortedMailList(data: any = {}) { return Object.keys(data).filter(id => id !== 'cid').map(id => ({ ...data[id], id })).sort((a, b) => Number(this.isMailUnread(b)) - Number(this.isMailUnread(a)) || this.getMailPriority(b) - this.getMailPriority(a) || this.getMailSendTime(b) - this.getMailSendTime(a)); }
    getMailPriority(present: any) { return this.priority(present); }
    hasUnclaimedRewards(present: any) { return this.hasMailRewards(present) && !present.received; }
    isMailUnread(present: any) { return this.isUnread(present); }
    getMailSendTime(present: any) { return this.sendTime(present); }

    update_mail_item(data: any = {}) {
        this.presentList = data || {};
        this.mailList = Object.keys(this.presentList).filter(id => id !== 'cid').map(id => ({ ...this.presentList[id], id }));
        this.mailList.sort((a, b) => Number(this.isUnread(b)) - Number(this.isUnread(a)) || this.priority(b) - this.priority(a) || this.sendTime(b) - this.sendTime(a));
        const hasMail = this.mailList.length > 0;
        if (this.label_no_messge) this.label_no_messge.node.active = !hasMail;
        if (this.btn_claim) this.btn_claim.active = this.mailList.some(mail => !mail.received);
        this.updateBottom(this.btn_claim?.active ? 130 : 50);
        if (this.list) {
            this.list.numItems = this.mailList.length;
            this.list.updateAll?.();
            if (hasMail) this.list.scrollTo?.(0, 0);
        }
    }

    onItemRender(node: Node, index: number) {
        const mail = this.mailList[index];
        if (!mail || !node) return;
        const title = this.find(node, 'Label_title')?.getComponent(Label);
        const date = this.find(node, 'Label_date')?.getComponent(Label);
        const expire = this.find(node, 'Label_expire');
        if (title) title.string = mail.title || '';
        if (date) date.string = this.formatDate(mail.createTime);
        const expireText = this.formatExpire(mail.expire);
        const rich = expire?.getComponent(RichText);
        if (rich) rich.string = expireText ? (String as any).format(GameKit.i18n.t('MessageInBoxWindow_expire'), expireText) : '';
        const red = this.find(node, 'red');
        if (red) red.active = !mail.received;
        node.targetOff(this);
        node.on(Node.EventType.TOUCH_END, () => this.openDetail(mail), this);
    }

    event_collectPresentBatch() {
        const req = SR.SRVillage.collectPresentBatch();
        req.SetCallBack((res: any) => {
            Object.keys(this.presentList).forEach(key => {
                const mail = this.presentList[key];
                this.applyReceivedState(mail);
            });
            GameKit.DataCache.SetData('UserPresentList', this.presentList);
            this.update_mail_item(this.presentList);
            UIRoot.instance.openChildWindow('ShopBuySucessWindow', { rewards: res.rewards, nextWindow: 'none' });
        });
        req.Send();
    }

    event_close() { this.closeAnim(); }

    openMailDetail(present: any) { this.openDetail(present); }
    onPresentReceivedFromDetail(present: any) { this.markPresentReceived(present); this.update_mail_item(this.get_mail_data()); }
    hasMailRewards(present: any) { return !!present && !!(present.rewards || present.reward || present.contents); }
    collectPresent(present: any, callback?: Function) { if (!present || present.received) return; const req = SR.SRVillage.collectPresent(present.id); req.SetCallBack((res: any) => { this.markPresentReceived(present); callback?.(res); }); req.Send(); }
    markPresentReceived(present: any) {
        if (!present) return;
        this.applyReceivedState(present);
        this.updatePresentCache(present);
    }
    applyReceivedState(present: any) {
        if (!present) return;
        present.received = true;
        if (present.unread !== undefined) present.unread = false;
        if (present.read !== undefined) present.read = true;
        if (present.isRead !== undefined) present.isRead = true;
        if (present.readed !== undefined) present.readed = true;
    }
    updatePresentCache(present: any) { const cache = GameKit.DataCache.GetData('UserPresentList') || this.presentList || {}; if (present?.id != null) cache[present.id] = present; GameKit.DataCache.SetData('UserPresentList', cache); }
    updatePresentBatchCache(res: any) { const cache = res?.presentList || res?.data?.presentList || this.presentList; Object.keys(cache || {}).forEach(id => { if (id !== 'cid') this.applyReceivedState(cache[id]); }); GameKit.DataCache.SetData('UserPresentList', cache || {}); }
    updateMailStateNodes(itemNode: Node, present: any) { const red = this.getItemNode(itemNode, 'red'); if (red) red.active = this.isMailUnread(present); }
    getItemComponent(root: Node, name: string, comp: any) { return this.getItemNode(root, name)?.getComponent(comp) || null; }
    getItemNode(root: Node, name: string) { return this.find(root, name); }
    setLabelEllipsis(label: Label | null, text: string) { if (label) label.string = text || ''; }
    getLabelTextWidth(_label: Label | null, text: string) { return String(text || '').length; }
    findChild(root: Node, name: string) { return this.find(root, name); }
    updateMailExpireText(node: Node | null, expire: any) { const rich = node?.getComponent(RichText); if (rich) rich.string = this.formatMailExpireTime(expire); }
    formatMailExpireTime(expire: any) { return this.formatExpire(expire); }
    formatMailDate(time: any) { return this.formatDate(time); }

    private openDetail(mail: any) {
        UIRoot.instance.openChildWindow('MessageMailDetailWindow', {
            present: mail,
            onPresentReceived: () => this.update_mail_item(GameKit.DataCache.GetData('UserPresentList') || this.presentList),
        });
    }

    private get_mail_data() {
        const list = GameKit.DataCache.GetData('UserPresentList') || {};
        const now = GameKit.TimeUtil.getCurrentTime();
        Object.keys(list).forEach(id => { if (id !== 'cid' && list[id]?.expire > 0 && now > list[id].expire) delete list[id]; });
        GameKit.DataCache.SetData('UserPresentList', list);
        return list;
    }

    private isUnread(mail: any) { return mail.unread ?? (mail.read !== undefined ? !mail.read : !mail.received); }
    private priority(mail: any) { return Number(mail.priority || mail.Priority || mail.sort || mail.order) || 0; }
    private sendTime(mail: any) { return Number(mail.createTime || mail.time) || 0; }
    private formatDate(time: any) {
        if (!time) return '';
        const value = GameKit.TimeUtil.FormatTime(Number(time));
        const pad = (n: number) => n < 10 ? `0${n}` : String(n);
        return `${pad(value.month + 1)}/${pad(value.day)}/${value.year}`;
    }
    private formatExpire(expire: any) {
        const remain = Math.ceil(Number(expire || 0) - GameKit.TimeUtil.getCurrentTime());
        if (!expire) return '';
        if (remain >= GameKit.TimeUtil.DayInSecond) return (String as any).format(GameKit.i18n.t('SomeDay'), Math.ceil(remain / GameKit.TimeUtil.DayInSecond));
        if (remain >= GameKit.TimeUtil.HourInSecond) return (String as any).format(GameKit.i18n.t('SomeHour'), Math.ceil(remain / GameKit.TimeUtil.HourInSecond));
        return (String as any).format(GameKit.i18n.t('SomeMinute'), Math.max(0, Math.ceil(remain / GameKit.TimeUtil.MinuteInSecond)));
    }
    private updateBottom(bottom: number) {
        [this.bg, this.list?.node?.getChildByName('view')].forEach(node => {
            const widget = node?.getComponent(Widget);
            if (widget) { widget.bottom = bottom; widget.updateAlignment(); }
        });
    }
    private find(root: Node, name: string): Node | null {
        if (root.name === name) return root;
        for (const child of root.children) { const found = this.find(child, name); if (found) return found; }
        return null;
    }
}
