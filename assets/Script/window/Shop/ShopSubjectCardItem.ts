import { _decorator, Button, Component, instantiate, Label, Node, Sprite } from 'cc';
import { ScrollViewTool } from '../../GameKit/ui/ScrollViewTool';
import { ContentModel } from '../../game/items/ContentModel';
import { SpriteGray } from '../../GameKit/render/SpriteGray';
import { LabelGray } from '../../GameKit/render/LabelGray';
import GameMainWindow from '../GameMainWindow';

const { ccclass, property } = _decorator;

@ccclass('ShopSubjectCardItem')
export class ShopSubjectCardItem extends Component {
    @property(Node)
    public buttonContainer: Node | null = null;

    @property(ScrollViewTool)
    public svt: ScrollViewTool | null = null;

    @property(Node)
    public reward_item: Node | null = null;

    @property(Node)
    public leftArrow: Node | null = null;

    @property(Node)
    public rightArrow: Node | null = null;

    @property(Sprite)
    public bg: Sprite | null = null;

    public meta: any = null;
    public leftTime: number | null = null;
    public currentIndex = 0;

    public start() {
    }

    public updatePanel(meta: any) {
        this.meta = meta;
        this.leftTime = 0;
        this.bg.spriteFrame = CommonAssets.instance.cardLimitSkinAssets.shopItemBg;
        this.create_svt();
    }

    public create_svt() {
        const para = this.meta.Param().pack;
        const activeData = Game.SUserActivity.GetActivityData(this.meta.Id());
        const id_list: number[] = [];
        para.forEach((_element: any, id: number) => {
            id_list.push(id);
        });

        this.svt.setItem(id_list, (index: number, id: number, node: Node) => {
            node.setPosition(node.position.x, 0, node.position.z);
            const timeLabel = GameKit.ControllerTable.GetComponent(node, 'timeLabel', Label);
            this.updateTime(timeLabel);

            const reward_layout = GameKit.ControllerTable.GetNode(node, 'layout');
            const btn_buy = GameKit.ControllerTable.GetComponent(node, 'buttonEnabled', Button);
            const priceLabel = GameKit.ControllerTable.GetComponent(node, 'price', Label);
            const shopid = para[index].shopId;
            priceLabel.string = Meta.MetaManager.GetMeta(Meta.MetaType.Shop, shopid).PriceString();
            btn_buy.interactable = !(activeData && activeData.isBuy && activeData.isBuy[shopid] === 1);

            const currentGet = Game.Content.FromStrings(para[index].rewards);
            currentGet.forEach((reward: any, idx: number) => {
                const reward_node = instantiate(this.reward_item);
                reward_node.parent = reward_layout;
                reward_node.setPosition(reward_node.position.x, 0, reward_node.position.z);
                reward_node.active = true;
                reward_node.getComponent(ContentModel).show(reward);
                reward_node.name = 'item__' + idx;

                const info = reward_node.getChildByName('info');
                if (reward.type === Game.Content.Types.Gift) {
                    info.active = true;
                } else if (reward.type === Game.Content.Types.CardChest) {
                    info.active = reward.cid === 14 || reward.cid === 15;
                } else {
                    info.active = false;
                }
            });
            btn_buy.clickEvents[0].customEventData = `${index}`;
        });

        this.svt.node.on('onScrollEnded', (newIndex: number) => {
            this.setCheckIndex(newIndex);
        });

        this.currentIndex = 0;
        this.leftArrow.active = false;
    }

    public updateUI() {
        for (const key in this.svt.items) {
            if (Object.hasOwnProperty.call(this.svt.items, key)) {
                const node = this.svt.items[key];
                const timeLabel = GameKit.ControllerTable.GetComponent(node, 'timeLabel', Label);
                this.updateTime(timeLabel);
            }
        }
    }

    public updateTime(labelTimer: Label | null) {
        if (this.leftTime != null && labelTimer) {
            const currentTime = GameKit.TimeUtil.getCurrentTime();
            this.leftTime = this.meta.EndTime() - currentTime;
            labelTimer.string = GameKit.i18n.t('ActivityTimeleft') + ' ' + GameKit.TimeUtil.FormatRemainTimeSimple(this.leftTime, true);

            if (this.leftTime <= 0) {
                this.leftTime = null;
            }
        }
    }

    public update() {
        this.updateUI();
    }

    public onClickArrow(_e: any, offset: any) {
        const newIndex = this.currentIndex + parseInt(offset, 10);
        this.updateArrowState(newIndex);
        this.onCheckClick(null, newIndex);
    }

    public onCheckClick(_e: any, newIndex: number) {
        this.updateArrowState(newIndex);
        const toggleItems = this.buttonContainer.children;
        for (let index = 0; index < toggleItems.length; index++) {
            const toggle = toggleItems[index];
            const checkmark = toggle.getChildByName('checkmark');
            if (index === newIndex) {
                if (checkmark.active === false) {
                    checkmark.active = true;
                    this.svt.ScrollToIndexByTime(index, 0.5);
                    this.currentIndex = index;
                }
            } else {
                checkmark.active = false;
            }
        }
    }

    public setCheckIndex(newIndex: number) {
        this.currentIndex = newIndex;
        this.updateArrowState(newIndex);
        const toggleItems = this.buttonContainer.children;
        for (let index = 0; index < toggleItems.length; index++) {
            const toggle = toggleItems[index];
            toggle.getChildByName('checkmark').active = index === newIndex;
        }
    }

    public onInfo(_e: any, _index: any) {
        const meta = Game.ActivityManager.GetMeta(this.meta.Id());
        UIRoot.instance.openChildWindow(meta.Panel(), {
            meta,
            showCallback: (_wnd: any) => {
            },
        });
    }

    public onBuy(_e: any, index: number) {
        const node = this.svt.items[index];
        const btn_buy = GameKit.ControllerTable.GetComponent(node, 'buttonEnabled', Button);
        const priceLabel = GameKit.ControllerTable.GetComponent(node, 'price', Label);
        btn_buy.interactable = false;

        const para = this.meta.Param().pack;
        const shopmeta = Meta.MetaManager.GetMeta(Meta.MetaType.Shop, para[index].shopId);

        let oldAp = Game.SUser.Ap();
        const oldCoin = Game.SUser.Coin();

        let apCount = 0;
        let coinCount = 0;
        const currentGet = Game.Content.FromStrings(para[index].rewards);
        currentGet.forEach((reward: any) => {
            if (reward.Type() === Game.Content.Types.Ap) {
                apCount += reward.Count();
            } else if (reward.Type() === Game.Content.Types.Coin) {
                coinCount += reward.Count();
            }
        });

        AppKit.PaymentWrap.Pay(shopmeta.Name(), (ok: boolean) => {
            if (ok) {
                UIRoot.instance.openChildWindow('PaySuccessWindow', {
                    from: 'pack',
                    showCallback: (wnd: any) => {
                        wnd.addOnCloseFunc(() => {
                            SpriteGray.SetGray(btn_buy, true);
                            LabelGray.SetGray(priceLabel, true);

                            UIRoot.instance.closeChildWindow('ShopWindow');

                            if (apCount > 0 && GamePlay.instance && GamePlay.instance.slotNode) {
                                GamePlay.instance.slotNode.showStoreAddSpinAnim(apCount);
                                oldAp += apCount;
                                GamePlay.instance.slotNode.userinfo.stopApAt(oldAp);
                            }

                            if (coinCount > 0 && GameMainWindow.instance) {
                                GameMainWindow.instance.playAddCoinAnim();
                                GameMainWindow.instance.scheduleOnce(() => {
                                    GameMainWindow.instance.userinfo.changeCoin(oldCoin, oldCoin + coinCount, 0.8);
                                }, 1);
                            }
                        });
                    },
                });
                GameKit.SoundManager.playSound('item_purchased');
                AppKit.LogEventWrap.logEvent('ShopDetail', { itemType: 'subject', name: shopmeta.Name(), phase: 1 });
            } else {
                AppKit.LogEventWrap.logEvent('ShopDetail', { itemType: 'subject', name: shopmeta.Name(), phase: -1 });
            }
        });

        AppKit.LogEventWrap.logEvent('ShopDetail', { itemType: 'subject', name: shopmeta.Name(), phase: 0 });
    }

    private updateArrowState(index: number) {
        if (index === 2) {
            this.rightArrow.active = false;
            this.leftArrow.active = true;
        } else if (index === 0) {
            this.leftArrow.active = false;
            this.rightArrow.active = true;
        } else {
            this.leftArrow.active = true;
            this.rightArrow.active = true;
        }
    }
}
