import { _decorator, Component, find, instantiate, Label, Layout, Node, ScrollView, UITransform, Widget } from 'cc';
import { UIWindow } from '../../GameKit/ui/UIWindow';
import ShopData from '../../game/shop/ShopData';

const { ccclass, property } = _decorator;

@ccclass('ShopWindow')
export default class ShopWindow extends UIWindow {
    public static windowPath = 'Shop/ShopWindow';

    @property(Component)
    userInfo: any = null;

    @property(Node)
    userInfoNode: Node | null = null;

    @property(Node)
    spinPageNode: Node | null = null;

    @property(Component)
    spinSVItem: any = null;

    @property(Node)
    coinPageNode: Node | null = null;

    @property(Component)
    coinSVItem: any = null;

    @property(Node)
    gemPageNode: Node | null = null;

    @property(Node)
    gemNode: Node | null = null;

    @property(Component)
    gemSVItem: any = null;

    @property(Node)
    salePageNode: Node | null = null;

    @property(Node)
    saleNode: Node | null = null;

    @property(Component)
    saleSVItem: any = null;

    @property(Node)
    hotPageNode: Node | null = null;

    @property(Node)
    hotNode: Node | null = null;

    @property(Component)
    hotSVItem: any = null;

    @property(Node)
    shieldPageNode: Node | null = null;

    @property([Label])
    shieldPrices: Label[] = [];

    @property(Node)
    chestPageNode: Node | null = null;

    @property(Node)
    chestDisable: Node | null = null;

    @property(Component)
    chestSVItem: any = null;

    @property(Component)
    chestFree: any = null;

    @property(Component)
    chestMagical: any = null;

    @property(Node)
    jockerChestPage: Node | null = null;

    @property(Component)
    jockersItem: any = null;

    @property(Node)
    treatPageNode: Node | null = null;

    @property(Component)
    treatSVItem: any = null;

    @property(Node)
    treatDisable: Node | null = null;

    @property(Component)
    shopIconNode: any = null;

    @property(Node)
    coinShopText: Node | null = null;

    @property(Label)
    levelText: Label | null = null;

    @property(Label)
    disabledIOS: Label | null = null;

    @property(Label)
    activityText: Label | null = null;

    @property(Component)
    item: any = null;

    @property([Label])
    timeLabList: Label[] = [];

    @property(Label)
    refreshLabel: Label | null = null;

    @property(Component)
    subjectItem: any = null;

    @property(Component)
    tab_node_array: any = null;

    @property(Node)
    testActivityPageNode: Node | null = null;

    @property(Node)
    shopMainNode: Node | null = null;

    @property(Node)
    shopLoadingNode: Node | null = null;

    showCash = false;
    hotServerMeta: any[] = [];
    saleServerMeta: any[] = [];
    shopNextRefreshTime: number | null = null;
    _lastShopRefreshRemainSecond: number | null = null;
    showOff = false;
    refreshCashCount = 0;
    activityMeta: any = null;
    leftTime: any = null;
    choose_tab: any = null;
    _pendingShopTabIndex: number | null = null;
    _shopTabLayoutDirty = false;
    _shopScrollView: ScrollView | null = null;
    _mergeTutorialNodeClickHandler: any = null;
    _mergeTutorialNodeClickTargets: any[] | null = null;
    _shopRefreshing = false;
    _shopContentReady = false;
    _usingLocalUserInfo = true;
    _sharedUserInfoStates: any[] | null = null;
    gemInited = false;
    saleInited = false;
    hotInited = false;
    spinInited = false;
    coinInited = false;
    chestInited = false;
    jockerChestInited = false;
    treatInited = false;

    onShow(showParams: any = {}) {
        this.setShopContentReady(false);
        this.showCash = showParams.showCash || false;
        this._usingLocalUserInfo = !this.attachGameMainUserInfo();
        if (this._usingLocalUserInfo && this.userInfo) this.userInfo.show(Game.SUser);
        this.hotServerMeta = [];
        this.saleServerMeta = [];
        this.shopNextRefreshTime = null;
        this._lastShopRefreshRemainSecond = null;
        this.showOff = false;
        this.refreshCashCount = 0;
        this.choose_tab = null;
        this._pendingShopTabIndex = null;
        this.hideGemActivityPages();
        LoadingWindow.Show();
        GameKit.GameEvent.RegisterEvent(GameKit.GameEvent.EventName.ShopWindowrefresh, 'ShopWindowrefresh', function(this: ShopWindow, data: any) {
            this.refresh();
        }.bind(this));
        this.reqShopData(function(this: ShopWindow, success: boolean) {
            if (!success) return;
            this.initData();
        }.bind(this), this.hotServerMeta, this.saleServerMeta);
    }

    attachGameMainUserInfo() {
        if (this._sharedUserInfoStates) return true;
        const mainWindow = typeof GameMainWindow !== 'undefined' ? GameMainWindow.instance : null;
        const userInfoNode = mainWindow?.userinfo?.node as Node | null;
        const overlayParent = this.node?.parent;
        if (!userInfoNode?.isValid || !userInfoNode.parent || !overlayParent?.isValid) return false;

        const sharedNodes = ['spinbar', 'coinbar', 'diamondbar'].map(name => userInfoNode.getChildByName(name));
        if (sharedNodes.some(node => !node?.isValid || !node.parent)) return false;

        const shopSiblingIndex = this.node.getSiblingIndex();
        this._sharedUserInfoStates = sharedNodes.map(node => ({
            node,
            parent: node!.parent,
            siblingIndex: node!.getSiblingIndex(),
            position: node!.position.clone(),
            scale: node!.scale.clone(),
            angle: node!.angle,
            active: node!.active,
            worldPosition: node!.worldPosition.clone(),
        }));
        if (this.userInfoNode?.isValid) this.userInfoNode.active = false;

        this._sharedUserInfoStates.forEach((state, index) => {
            state.node.parent = overlayParent;
            state.node.setWorldPosition(state.worldPosition);
            state.node.setScale(state.scale);
            state.node.angle = state.angle;
            state.node.active = true;
            state.node.setSiblingIndex(shopSiblingIndex + index + 1);
        });
        return true;
    }

    restoreGameMainUserInfo() {
        const states = this._sharedUserInfoStates;
        this._sharedUserInfoStates = null;
        if (!states?.length) return false;

        let restored = false;
        states.forEach(state => {
            if (!state.node?.isValid || !state.parent?.isValid) return;
            state.node.parent = state.parent;
            state.node.setPosition(state.position);
            state.node.setScale(state.scale);
            state.node.angle = state.angle;
            state.node.active = state.active;
            state.node.setSiblingIndex(Math.min(state.siblingIndex, Math.max(0, state.parent.children.length - 1)));
            restored = true;
        });
        if (this.userInfoNode?.isValid) this.userInfoNode.active = true;
        return restored;
    }

    reqShopData(callback: any, hot: any[], sale: any[], force = false) {
        let self = this;
        ShopData.GetInfo(function(success: boolean, data: any) {
            if (!success || !data) {
                LoadingWindow.Hide();
                if (callback) callback(false);
                return;
            }
            if (data.refreshCost) {
                self.refreshCashCount = data.refreshCost.price;
                self.updateRefreshLabel();
            }
            console.log(data.daily, data.dailyState);
            console.log(data.hot, data.hotState);
            if (!data.daily) {
                console.log('data.daily error');
                LoadingWindow.Hide();
                if (callback) callback(false);
                return;
            }
            if (!data.hot) {
                console.log('data.hot error');
                LoadingWindow.Hide();
                if (callback) callback(false);
                return;
            }
            self.setShopNextRefreshTime(data.nextRefreshTime);
            for (let index = 0; index < data.daily.length; index++) {
                const mid = data.daily[index];
                const meta = Meta.MetaManager.GetMeta(Meta.MetaType.ShopDaily, mid);
                meta.setServerMeta(data.dailyState[index]);
                sale.push(meta);
            }
            for (let index = 0; index < data.hot.length; index++) {
                const mid = data.hot[index];
                const meta = Meta.MetaManager.GetMeta(Meta.MetaType.ShopHot, mid);
                meta.setServerMeta(data.hotState[index]);
                hot.push(meta);
            }
            LoadingWindow.Hide();
            console.log('----', hot, sale);

            if (callback) callback(true);
        }, { force, silence: false });
    }

    refresh() {
        if (this._shopRefreshing) return;
        this._shopRefreshing = true;
        LoadingWindow.Show();
        let latestHot: any[] = [];
        let latestSale: any[] = [];
        this.reqShopData(function(this: ShopWindow, success: boolean) {
            this._shopRefreshing = false;
            if (!success) return;
            this.hotServerMeta = latestHot;
            this.saleServerMeta = latestSale;
            this.refreshShopListData();
            this.scheduleRefreshCurrentTabLayout();
        }.bind(this), latestHot, latestSale, true);
    }

    initData() {
        console.log('====', this.hotServerMeta, this.saleServerMeta);

        this.activityMeta = Game.ActivityManager.GetActiveShopActivity();
        if (this.activityMeta) {
            this.leftTime = 0;
            this.update(0);
        }

        if (!AppKit.PaymentWrap.PayEnabled() && this.disabledIOS) {
            let disStr = 'PayDisable';
            this.disabledIOS.string = GameKit.i18n.t(disStr);
        }

        const defaultTabIndex = this.showCash ? 0 : 1;
        this._pendingShopTabIndex = defaultTabIndex;
        if (this.tab_node_array) {
            this.tab_node_array.onShow((index: number, tab: any, first: boolean) => {
                if (this.showCash) {
                    index = 0;
                }
                this._pendingShopTabIndex = index;
                if (first) {
                    setTimeout(() => { this.event_change_to_tab(index); }, 300);
                } else {
                    this.event_change_to_tab(index);
                }
            }, defaultTabIndex);
        }
        this.initsubjectPage();
        this.bindMergeTutorialNodeClick();
        if (Game.MergeTutorialManager && Game.MergeTutorialManager.RefreshCurrentWindow) {
            Game.MergeTutorialManager.RefreshCurrentWindow();
        }

        if (this.chestDisable) {
            const label = this.chestDisable.getComponent(Label);
            if (label) label.string = String.format(GameKit.i18n.t('ShopChestDisable'), G.GameConstance.cardSystemStartLevel);
        }
        if (this.treatDisable) {
            const label = this.treatDisable.getComponent(Label);
            if (label) label.string = String.format(GameKit.i18n.t('ShopTreatDisable'), G.GameConstance.servantSystemStartLevel);
        }
        this.updateRefreshLabel();
        this.setShopContentReady(true);
    }

    setShopContentReady(ready: boolean) {
        this._shopContentReady = ready;
        const mainNode = this.getShopMainNode();
        if (mainNode?.isValid) mainNode.active = ready;
        this.setShopLoadingVisible(!ready);
        if (ready) LoadingWindow.Hide();
    }

    setShopLoadingVisible(visible: boolean) {
        if (this.shopLoadingNode?.isValid) this.shopLoadingNode.active = visible;
    }

    getShopMainNode() {
        if (this.shopMainNode?.isValid) return this.shopMainNode;
        return find('node', this.node);
    }

    event_change_to_tab(index = 0) {
        index = Number(index);
        if (this.choose_tab === index) { return; }
        this.choose_tab = index;
        this._pendingShopTabIndex = index;
        this.setShopTabPageVisible(index);
        switch (index) {
            case 0:
                this.showGemPage();
                break;
            case 1:
                this.showHotPage();
                this.showSalePage();
                break;
            default: break;
        }
        this.scheduleRefreshCurrentTabLayout();
    }

    setShopTabPageVisible(index: number) {
        let showGem = index === 0;
        let showItem = index === 1;
        this.hideGemActivityPages();
        if (this.gemPageNode) this.gemPageNode.active = showGem;
        if (this.salePageNode) this.salePageNode.active = showItem;
        if (this.hotPageNode) this.hotPageNode.active = showItem;
    }

    scheduleRefreshCurrentTabLayout() {
        this.refreshCurrentTabLayout();
        if (this._shopTabLayoutDirty) return;
        this._shopTabLayoutDirty = true;
        this.scheduleOnce(() => {
            this._shopTabLayoutDirty = false;
            this.refreshCurrentTabLayout();
        }, 0);
        const delay = this.getShopEnterAnimDelay();
        if (delay > 0) this.scheduleOnce(() => this.refreshCurrentTabLayout(), delay);
    }

    getShopEnterAnimDelay() {
        let maxDelay = 0;
        const anims = (this.node as any).getComponentsInChildren('EnterCloseAnim') || [];
        anims.forEach((anim: any) => {
            if (!anim?.enabled || !anim.node?.active || !anim.e_playAwake || !anim.enterAnimType) return;
            maxDelay = Math.max(maxDelay, Number(anim.e_DelayTime || 0) + Number(anim.e_AnimTime || 0));
        });
        return maxDelay > 0 ? maxDelay + 0.02 : 0;
    }

    refreshCurrentTabLayout() {
        let scrollView = this.getShopScrollView();
        if (!scrollView) return;

        this.refreshShopScrollViewArea(scrollView);

        let contentNode = scrollView.content;
        if (contentNode) {
            this.refreshNodeTreeLayout(contentNode);
        }

        this.refreshShopScrollViewArea(scrollView);

        scrollView.stopAutoScroll();
        scrollView.scrollToTop(0);
        this.alignShopScrollContentToTop(scrollView);
    }

    refreshShopScrollViewArea(scrollView: ScrollView | null) {
        if (!scrollView || !scrollView.node || !scrollView.node.isValid) return;

        let scrollWidget = scrollView.node.getComponent(Widget);
        if (scrollWidget) {
            let desiredTop = this.getShopScrollViewTop();
            let desiredBottom = this.getShopScrollViewBottom();
            if (Math.abs(scrollWidget.top - desiredTop) > 0.5) {
                scrollWidget.top = desiredTop;
            }
            if (Math.abs(scrollWidget.bottom - desiredBottom) > 0.5) {
                scrollWidget.bottom = desiredBottom;
            }
            this.updateWidgetAlignmentOnce(scrollWidget);
        }

        let viewNode = scrollView.node.getChildByName('view');
        if (viewNode) {
            this.updateWidgetAlignmentOnce(viewNode.getComponent(Widget));
        }
    }

    getShopScrollViewTop() {
        return 340;
    }

    getShopScrollViewBottom() {
        let tabNode = this.getShopTabNode();
        return tabNode ? this.getNodeHeight(tabNode) : 80;
    }

    updateWidgetAlignmentOnce(widget: Widget | null) {
        if (!widget) return;
        let wasEnabled = widget.enabled;
        widget.enabled = true;
        widget.updateAlignment();
        widget.enabled = wasEnabled;
    }

    refreshNodeTreeLayout(node: Node | null) {
        if (!node || !node.isValid) return;
        node.children.forEach(child => {
            if (child && child.active) {
                this.refreshNodeTreeLayout(child);
            }
        });
        this.refreshNodeLayout(node);
    }

    hideGemActivityPages() {
        if (this.testActivityPageNode && this.testActivityPageNode.isValid) {
            this.testActivityPageNode.active = false;
        }
        if (this.subjectItem && this.subjectItem.node && this.subjectItem.node.isValid) {
            this.subjectItem.node.active = false;
        }
    }

    alignShopScrollContentToTop(scrollView: ScrollView | null) {
        if (!scrollView || !scrollView.content || !scrollView.content.isValid) return;
        let contentNode = scrollView.content;
        if (Math.abs(contentNode.position.y) > 0.5) {
            contentNode.setPosition(contentNode.position.x, 0, contentNode.position.z);
        }
    }

    refreshNodeLayout(node: Node | null) {
        if (!node) return;
        let layout = node.getComponent(Layout);
        if (layout && layout.enabled) {
            layout.updateLayout();
        }
    }

    getShopScrollView() {
        if (this._shopScrollView && this._shopScrollView.isValid) {
            return this._shopScrollView;
        }
        let scrollNode = find('node/shopScrollView', this.node);
        this._shopScrollView = scrollNode ? scrollNode.getComponent(ScrollView) : null;
        return this._shopScrollView;
    }

    getShopTabNode() {
        if (this.tab_node_array && this.tab_node_array.node && this.tab_node_array.node.isValid) {
            return this.tab_node_array.node as Node;
        }
        return find('node/tab', this.node);
    }

    onClose() {
        this.restoreGameMainUserInfo();
        GameKit.GameEvent.UnRegisterEvent(GameKit.GameEvent.EventName.ShopWindowrefresh, 'ShopWindowrefresh');
        this.unbindMergeTutorialNodeClick();
        if (this._usingLocalUserInfo && this.userInfo) this.userInfo.onClose();
    }

    bindMergeTutorialNodeClick() {
        this.unbindMergeTutorialNodeClick();
        if (!Game.MergeTutorialManager || !Game.MergeTutorialManager.IsWaitingNodeClick || !Game.MergeTutorialManager.IsWaitingNodeClick('item_shop_button')) return;
        if (!Game.MergeTutorialManager.ResolveGuideTargetNode) return;
        let target = Game.MergeTutorialManager.ResolveGuideTargetNode('item_shop_button');
        if (!target || !target.on) return;
        this._mergeTutorialNodeClickHandler = function() {
            if (Game.MergeTutorialManager && Game.MergeTutorialManager.EmitNodeClick) {
                Game.MergeTutorialManager.EmitNodeClick('item_shop_button');
            }
        };
        target.on(Node.EventType.TOUCH_END, this._mergeTutorialNodeClickHandler, this);
        this._mergeTutorialNodeClickTargets = [target];
    }

    unbindMergeTutorialNodeClick() {
        if (!this._mergeTutorialNodeClickTargets || !this._mergeTutorialNodeClickHandler) return;
        this._mergeTutorialNodeClickTargets.forEach(function(this: ShopWindow, node: any) {
            if (node && node.off) node.off(Node.EventType.TOUCH_END, this._mergeTutorialNodeClickHandler, this);
        }.bind(this));
        this._mergeTutorialNodeClickTargets = null;
        this._mergeTutorialNodeClickHandler = null;
    }

    update(dt: number) {
        if (this.leftTime != null) {
            let currentTime = GameKit.TimeUtil.getCurrentTime();

            if (this.activityMeta.IsUserTime()) {
                this.leftTime = this.activityMeta.UserTime() - currentTime + Game.ActivityManager.GetLocalData()[this.activityMeta.Id()].startTime;
            } else {
                this.leftTime = this.activityMeta.EndTime() - currentTime;
            }
            if (this.activityText) this.activityText.string = String.format(GameKit.i18n.t('ActivityShopDes'), GameKit.TimeUtil.FormatRemainTimeSimple(this.leftTime, false));

            if (this.leftTime <= 0) {
                this.leftTime = null;
                this.callClose();
            }
        }
        this.updateShopRefreshTimeLabels();
    }

    setShopNextRefreshTime(nextRefreshTime: any) {
        if (nextRefreshTime == null || nextRefreshTime === '') {
            this.shopNextRefreshTime = null;
        } else {
            let targetTime = Number(nextRefreshTime);
            if (isNaN(targetTime) || targetTime < 0) targetTime = 0;
            this.shopNextRefreshTime = targetTime;
        }
        this._lastShopRefreshRemainSecond = null;
        this.updateShopRefreshTimeLabels(true);
    }

    getShopRefreshRemainTime() {
        if (this.shopNextRefreshTime == null) return null;
        let currentTime = GameKit.TimeUtil.getCurrentTime();
        return Math.max(0, this.shopNextRefreshTime - currentTime);
    }

    updateShopRefreshTimeLabels(force?: boolean) {
        if (!this.timeLabList || this.timeLabList.length <= 0) return;
        let remain = this.getShopRefreshRemainTime();
        if (remain == null) return;

        let remainSecond = Math.ceil(remain);
        if (!force && this._lastShopRefreshRemainSecond === remainSecond) return;
        this._lastShopRefreshRemainSecond = remainSecond;

        let timeStr = GameKit.TimeUtil.FormatRemainTimeSimple(remain, false);
        this.timeLabList.forEach(function(label) {
            if (!label || !label.node || !label.node.isValid) return;
            label.string = timeStr;
        });
    }

    updateRefreshLabel() {
        if (!this.refreshLabel || !this.refreshLabel.node || !this.refreshLabel.node.isValid) return;
        this.refreshLabel.string = this.refreshCashCount != null ? this.refreshCashCount.toString() : '0';
    }

    setItem(data: any[], initFunc: any, items: any, parent: Node | null) {
        this.item = items ? items.node : this.item;
        if (this.item) this.item.active = false;
        if (!this.item || !parent) return;

        let index = 0;
        data.forEach(function(this: ShopWindow, id: any) {
            let itemHandle = instantiate(this.item);
            itemHandle.active = true;
            itemHandle.parent = parent;

            let scItem: any = itemHandle.getComponent('ScrollViewItem');
            if (scItem) {
                scItem.index = index;
                scItem.id = id;
                scItem.registerInit(initFunc);
                if (initFunc) initFunc(scItem.index, scItem.id, scItem.node);
            }
            index++;
        }.bind(this));
    }

    initsubjectPage() {
        let subjectActivityMeta = Game.ActivityManager.GetActiveActivity(Meta.ActivityMeta.Types.Pay, Meta.ActivityMeta.SubTypes.SubjectCard);
        if (subjectActivityMeta) {
            this.subjectItem.updatePanel(subjectActivityMeta);
            this.subjectItem.node.active = true;
        } else if (this.subjectItem) {
            this.subjectItem.node.active = false;
        }
    }

    initGemPage() {
        if (this.gemInited) return;
        let gemSVData = new Array();
        for (var i = 0; i < 6; i++) {
            gemSVData.push(i + 1);
        }
        this.setItem(gemSVData, this.initGemItem.bind(this), this.gemSVItem, this.gemNode);
        this.gemInited = true;
    }

    initGemItem(index: number, id: any, node: Node) {
        let meta = Meta.ShopMeta.GetByTypeIndex(Meta.ShopMeta.Types.Gem, index);
        let oldMeta = meta;
        let gemItem: any = node.getComponent('ShopGemItem');
        let icon = this.shopIconNode.getGemSprite(index);
        gemItem.updatePanel(meta, id, icon, oldMeta);
    }

    initSalePage() {
        if (this.saleInited) return;
        let saleSVData = new Array();
        for (var i = 0; i < this.saleServerMeta.length; i++) {
            saleSVData.push(i + 1);
        }

        this.setItem(saleSVData, this.initSaleItem.bind(this), this.saleSVItem, this.saleNode);
        this.saleInited = true;
    }

    initSaleItem(index: number, id: any, node: Node) {
        let meta = Meta.ShopMeta.GetByTypeIndex(Meta.ShopMeta.Types.Sale, index);
        let saleItem: any = node.getComponent('ShopSaleItem');
        saleItem.updatePanel(this.saleServerMeta[index], id, meta);
    }

    initHotPage() {
        if (this.hotInited) return;
        let hotSVData = new Array();
        for (var i = 0; i < this.hotServerMeta.length; i++) {
            hotSVData.push(i + 1);
        }
        this.setItem(hotSVData, this.initHotItem.bind(this), this.hotSVItem, this.hotNode);
        this.hotInited = true;
    }

    initHotItem(index: number, id: any, node: Node) {
        let meta = Meta.ShopMeta.GetByTypeIndex(Meta.ShopMeta.Types.Hot, index);
        let hotItem: any = node.getComponent('ShopHotItem');

        hotItem.updatePanel(this.hotServerMeta[index], id, meta);
    }

    showTestActivitPage() {
        if (this.testActivityPageNode && this.testActivityPageNode.isValid) {
            this.testActivityPageNode.active = true;
        }
    }

    showsubjectPage() {
        this.initsubjectPage();
    }

    initSpinPage() {
        if (this.spinInited) return;
        let spinSVData = new Array();
        for (var i = 0; i < 6; i++) {
            spinSVData.push(i + 1);
        }
        this.setItem(spinSVData, this.initSpinItem.bind(this), this.spinSVItem, this.spinPageNode);
        this.spinInited = true;
    }

    initSpinItem(index: number, id: any, node: Node) {
        let meta = Meta.ShopMeta.GetByTypeIndex(Meta.ShopMeta.Types.Spin, index);
        let oldMeta = meta;
        if (this.activityMeta && this.activityMeta.ShopIds().spin != null) {
            meta = Meta.MetaManager.GetMeta(Meta.MetaType.Shop, this.activityMeta.ShopIds().spin[index]);
        }
        let spinItem: any = node.getComponent('ShopSpinItem');
        let icon = this.shopIconNode.getSpinSprite(index);
        spinItem.updatePanel(meta, id, icon, oldMeta);
    }

    initCoinPage() {
        if (this.coinInited) return;
        let coinSVData = new Array();
        for (var i = 0; i < 6; i++) {
            coinSVData.push(i + 1);
        }
        this.setItem(coinSVData, this.initCoinItem.bind(this), this.coinSVItem, this.coinPageNode);

        if (this.levelText) this.levelText.string = String.format(GameKit.i18n.t('CoinShopLevel'), Game.SUserVillage.MapId());
        this.coinInited = true;
    }

    initCoinItem(index: number, id: any, node: Node) {
        let meta = Meta.ShopMeta.GetByTypeIndex(Meta.ShopMeta.Types.ShopCoin, index);
        let oldMeta = meta;
        if (this.activityMeta && this.activityMeta.ShopIds().coin != null) {
            meta = Meta.MetaManager.GetMeta(Meta.MetaType.Shop, this.activityMeta.ShopIds().coin[index]);
        }
        let coinItem: any = node.getComponent('ShopCoinItem');
        let icon = this.shopIconNode.getCoinSprite(index);

        coinItem.updatePanel(meta, index, icon, oldMeta);
    }

    initChestPage() {
        if (this.chestInited) return;
        let chestSVData = new Array();
        for (var i = 0; i < 3; i++) {
            chestSVData.push(i + 1);
        }
        this.setItem(chestSVData, this.initChestItem.bind(this), this.chestSVItem, this.chestPageNode);
        this.chestFree.updateAdPanel(this.shopIconNode.getChestSprite(3));
        this.chestMagical.updateAdMagicalPanel(this.shopIconNode.getChestSprite(4), Meta.ShopMeta.GetByTypeIndex(Meta.ShopMeta.Types.PayChest, 0));
        this.chestInited = true;
    }

    initJockerChestPage() {
        if (this.jockerChestInited) return;
        let chestSVData = new Array();
        let metas = Meta.ShopMeta.GetByType(Meta.ShopMeta.Types.PayJocker);
        metas.sort((a: any, b: any) => {
            return a.DefaultPrice() - b.DefaultPrice();
        });
        let count = Math.min(metas.length, 6);
        for (var i = 0; i < count; i++) {
            chestSVData.push(metas[i]._data.count);
        }

        this.setItem(chestSVData, this.initJockerChestItem.bind(this), this.jockersItem, this.jockerChestPage);
        this.jockerChestInited = true;
    }

    initJockerChestItem(index: number, id: any, node: Node) {
        let meta = Meta.ShopMeta.GetByTypeCount(Meta.ShopMeta.Types.PayJocker, id);
        let chestItem: any = node.getComponent('ShopJockerChestItem');
        let idStr = meta.Id().toString();
        let packId = parseInt(idStr.charAt(idStr.length - 1));
        let icon = CommonAssets.instance.getByAtlas(CommonAssets.Atlases.RandomPack, packId.toString());

        chestItem.updatePanel(meta, index, icon, meta.IsHot());
    }

    initChestItem(index: number, id: any, node: Node) {
        let meta = Meta.ShopMeta.GetByTypeIndex(Meta.ShopMeta.Types.Chest, index);
        let chestItem: any = node.getComponent('ShopChestItem');
        let icon = this.shopIconNode.getChestSprite(index);

        chestItem.updatePanel(meta, id, icon);
    }

    initTreatPage() {
        if (this.treatInited) return;
        let treatSVData = new Array();
        for (var i = 0; i < 10; i++) {
            treatSVData.push(i + 1);
        }
        this.setItem(treatSVData, this.initTreatItem.bind(this), this.treatSVItem, this.treatPageNode);
        this.treatInited = true;
    }

    initTreatItem(index: number, id: any, node: Node) {
        let meta = Meta.ShopMeta.GetByTypeIndex(Meta.ShopMeta.Types.Treat, index);
        let oldMeta = meta;
        if (this.activityMeta && this.activityMeta.ShopIds().treat != null) {
            meta = Meta.MetaManager.GetMeta(Meta.MetaType.Shop, this.activityMeta.ShopIds().treat[index]);
        }
        let treatItem: any = node.getComponent('ShopTreatItem');
        let icon = this.shopIconNode.getTreatSprite(index);

        treatItem.updatePanel(meta, index, icon, oldMeta);
    }

    initShieldPage() {
        for (let i = 0; i < 5; i++) {
            let shopMeta = Meta.MetaManager.GetMeta(Meta.MetaType.Shop, 1201 + i);
            if (this.shieldPrices[i]) this.shieldPrices[i].string = shopMeta.PriceString();
        }
    }

    OnClickShieldBuy(e: any, index: any) {
        let shopId = 1200 + parseInt(index);
        let shopMeta = Meta.MetaManager.GetMeta(Meta.MetaType.Shop, shopId);
        AppKit.PaymentWrap.Pay(shopMeta.Name(), function(ok: boolean) {
            if (ok) {
                UIRoot.instance.openChildWindow('PaySuccessWindow', { from: 'shield', showCallback: (wnd: any) => {
                    wnd.addOnCloseFunc(() => {
                        UIRoot.instance.closeChildWindow('ShopWindow');
                    });
                } });
                GameKit.SoundManager.playSound('item_purchased');

                AppKit.LogEventWrap.logEvent('ShopDetail', { itemType: 'shield', name: shopMeta.Name(), phase: 1 });
            } else {
                AppKit.LogEventWrap.logEvent('ShopDetail', { itemType: 'shield', name: shopMeta.Name(), phase: -1 });
            }
        }.bind(this));

        AppKit.LogEventWrap.logEvent('ShopDetail', { itemType: 'shield', name: shopMeta.Name(), phase: 0 });
    }

    onOpenShow() {
        this.showGemPage();
        this.showSalePage();
        this.showHotPage();
    }

    showGemPage() {
        if (this.activityText) this.activityText.node.active = (this.activityMeta && this.activityMeta.ShopIds().spin != null);
        this.showTestActivitPage();
        this.showsubjectPage();
        if (this.gemPageNode) this.gemPageNode.active = true;
        if (this.disabledIOS) this.disabledIOS.node.active = !AppKit.PaymentWrap.PayEnabled();
        this.initGemPage();
    }

    showSalePage() {
        if (this.activityText) this.activityText.node.active = (this.activityMeta && this.activityMeta.ShopIds().spin != null);
        this.hideGemActivityPages();
        if (this.salePageNode) this.salePageNode.active = true;
        if (this.disabledIOS) this.disabledIOS.node.active = !AppKit.PaymentWrap.PayEnabled();
        this.initSalePage();
    }

    showHotPage() {
        if (this.activityText) this.activityText.node.active = (this.activityMeta && this.activityMeta.ShopIds().spin != null);
        this.hideGemActivityPages();
        if (this.hotPageNode) this.hotPageNode.active = true;
        if (this.disabledIOS) this.disabledIOS.node.active = !AppKit.PaymentWrap.PayEnabled();
        this.initHotPage();
    }

    showSpinPage() {
        if (this.activityText) this.activityText.node.active = (this.activityMeta && this.activityMeta.ShopIds().spin != null);
        if (this.spinPageNode) this.spinPageNode.active = true;
        if (this.disabledIOS) this.disabledIOS.node.active = !AppKit.PaymentWrap.PayEnabled();
        this.initSpinPage();
    }

    showCoinPage() {
        if (this.coinShopText) this.coinShopText.active = !(this.activityMeta && this.activityMeta.ShopIds().coin != null);
        if (this.levelText) this.levelText.node.active = !(this.activityMeta && this.activityMeta.ShopIds().coin != null);
        if (this.activityText) this.activityText.node.active = (this.activityMeta && this.activityMeta.ShopIds().coin != null);
        if (this.coinPageNode) this.coinPageNode.active = true;
        if (this.disabledIOS) this.disabledIOS.node.active = !AppKit.PaymentWrap.PayEnabled();
        this.initCoinPage();
    }

    showShieldPage() {
        if (this.shieldPageNode) this.shieldPageNode.active = true;
        if (this.disabledIOS) this.disabledIOS.node.active = !AppKit.PaymentWrap.PayEnabled();
        this.initShieldPage();
    }

    showChestPage() {
        if (Game.SUserVillage.MapId() < G.GameConstance.cardSystemStartLevel) {
            if (this.chestDisable) this.chestDisable.active = true;
            return;
        }
        if (this.chestPageNode) this.chestPageNode.active = true;
        this.initChestPage();
        this.initJockerChestPage();
    }

    showTreatPage() {
        if (Game.SUserVillage.MapId() < G.GameConstance.servantSystemStartLevel) {
            if (this.treatDisable) this.treatDisable.active = true;
            return;
        }
        if (this.activityText) this.activityText.node.active = (this.activityMeta && this.activityMeta.ShopIds().treat != null);
        if (this.treatPageNode) this.treatPageNode.active = true;
        if (this.disabledIOS) this.disabledIOS.node.active = !AppKit.PaymentWrap.PayEnabled();
        this.initTreatPage();
    }

    refreshShopListData() {
        this.refreshSubjectPage();
        if (this.saleInited) {
            this.refreshSalePageItems();
        }
        if (this.hotInited) {
            this.refreshHotPageItems();
        }
    }

    refreshSubjectPage() {
        this.activityMeta = Game.ActivityManager.GetActiveShopActivity();
        this.initsubjectPage();
    }

    refreshSalePageItems() {
        this.refreshShopItemNodes(this.saleNode, this.saleServerMeta, 'ShopSaleItem', this.initSaleItem.bind(this));
    }

    refreshHotPageItems() {
        this.refreshShopItemNodes(this.hotNode, this.hotServerMeta, 'ShopHotItem', this.initHotItem.bind(this));
    }

    refreshShopItemNodes(parentNode: Node | null, serverMetas: any[], componentName: string, initFunc: any) {
        if (!parentNode || !parentNode.isValid) return;
        if (!serverMetas) return;

        let itemNodes = parentNode.children.filter(function(child) {
            return child && child.active && child.getComponent(componentName);
        });

        if (itemNodes.length !== serverMetas.length) {
            this.resetShopItemNodes(parentNode, componentName);
            if (parentNode === this.saleNode) {
                this.saleInited = false;
                this.initSalePage();
            } else if (parentNode === this.hotNode) {
                this.hotInited = false;
                this.initHotPage();
            }
            return;
        }

        itemNodes.forEach(function(node, index) {
            if (initFunc) initFunc(index, index + 1, node);
        });
    }

    resetShopItemNodes(parentNode: Node | null, componentName: string) {
        if (!parentNode || !parentNode.children) return;
        parentNode.children.slice().forEach(function(this: ShopWindow, child: Node) {
            if (!child) return;
            if (!child.getComponent || !child.getComponent(componentName)) return;
            if (child === this.saleSVItem.node || child === this.hotSVItem.node || child === this.gemSVItem.node) return;
            child.destroy();
        }.bind(this));
    }

    onClickRefresh() {
        if (Game.ContentCheck.CheckContent(new Game.Content(7, 0, this.refreshCashCount))) {
            let req = SR.SRShop.RefreshHot();
            req.SetCallBack((res: any) => {
                console.log('need refresh data', res);
                this.refresh();
            });
            req.Send();
        }
    }

    callClose() {
        this.closeAnim();
    }

    private getNodeHeight(node: Node) {
        return node.getComponent(UITransform)?.height || 0;
    }
}
