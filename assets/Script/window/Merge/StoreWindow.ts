import { _decorator, instantiate, Node, UITransform } from 'cc';
import { UIWindow } from '../../GameKit/ui/UIWindow';
import List from '../../GameKit/ui/list/List';
import StoreItem from '../../game/merge/StoreItem';

const { ccclass, property } = _decorator;

@ccclass
class StoreWindow extends UIWindow {

    static windowPath = 'Merge/StoreWindow';

    @property(List)
    list = null;

    @property(Node)
    listBg = null;

    @property(StoreItem)
    storeItemTemplete = null;

    storeItems = [];
    storeItemGroupSize = 4;
    tempPutbackMergeData: any[] = [];

    onShow(showParams) {
        this.storeItems = [];
        this.tempPutbackMergeData = [];

        let metas = Meta.MetaManager.GetMetas(Meta.MetaType.MergeWharehouse);
        for (let key in metas) {
            this.storeItems.push({ item: null });
        }

        this.updateStoreItems();
    }

    updateStoreItems() {
        let storeData = Game.SUserMerge.GetStoreData() || {};
        let warehouseCapacity = Game.SUserMerge.GetWarehouseCapacity();
        let maxCount = this.storeItems.length;

        this.storeItems.forEach((item, index) => {
            if (index < warehouseCapacity) {
                this.storeItems[index].item = storeData[index];
            } else if (index == warehouseCapacity && warehouseCapacity < maxCount) {
                this.storeItems[index].item = 'add';
            } else {
                this.storeItems[index].item = 'unlock';
            }
        });

        if (this.list) {
            this.list.numItems = Math.ceil(this.storeItems.length / this.storeItemGroupSize);
        }

        if (this.listBg && this.list) {
            let listBgTransform = this.listBg.getComponent(UITransform);
            if (listBgTransform) {
                listBgTransform.height = this.list.numItems * 115;
            }
        }
    }

    event_close() {
        if (Game.MergeTutorialManager && Game.MergeTutorialManager.EmitNodeClick) {
            Game.MergeTutorialManager.EmitNodeClick('backpack_close_button');
        }
        this.closeAnim(() => {
            setTimeout(() => {
                GamePlay.instance.mergeRoot.mergeNodeUI.PlayWaitCreateAnimItems();
            }, 1);
        });
    }

    onItemRender(node, index) {
        let container = node.getChildByName('container');
        if (!container) {
            return;
        }

        this.ensureStoreItemCount(container);
        for (let i = 0; i < this.storeItemGroupSize; i++) {
            let itemNode = container.children[i];
            let realIndex = index * this.storeItemGroupSize + i;
            this.renderStoreItem(itemNode, realIndex);
        }

        for (let i = this.storeItemGroupSize; i < container.children.length; i++) {
            container.children[i].active = false;
            container.children[i].off(Node.EventType.TOUCH_END);
        }
    }

    ensureStoreItemCount(container) {
        while (container.children.length < this.storeItemGroupSize && this.storeItemTemplete && this.storeItemTemplete.node) {
            let itemNode = instantiate(this.storeItemTemplete.node);
            itemNode.parent = container;
            itemNode.off(Node.EventType.TOUCH_END);
        }
    }

    renderStoreItem(node, index) {
        if (!node) {
            return;
        }

        node.off(Node.EventType.TOUCH_END);
        if (index >= this.storeItems.length) {
            node.active = false;
            return;
        }

        node.active = true;
        node.name = 'storeItem_' + index;

        let item = node.getComponent(StoreItem);
        if (!item) {
            return;
        }

        let addGrid = item.addGrid;
        let icon = item.icon;
        let hole = item.hole;
        let contentModel = item.contentModel;
        let itemData = this.storeItems[index].item;

        if (contentModel) {
            contentModel.node.active = itemData == 'add';
        }

        if (itemData == 'add') {
            if (addGrid) addGrid.active = true;
            if (icon) icon.node.active = false;
            if (hole) hole.active = false;

            let meta = Meta.MetaManager.GetMeta(Meta.MetaType.MergeWharehouse, index + 1);
            let priceContent = meta ? meta.Price() : null;
            if (priceContent && contentModel) {
                contentModel.show(priceContent);
            }
        } else if (itemData == null) {
            if (addGrid) addGrid.active = false;
            if (icon) icon.node.active = false;
            if (hole) hole.active = true;
        } else if (itemData == 'unlock') {
            if (addGrid) addGrid.active = false;
            if (icon) icon.node.active = false;
            if (hole) hole.active = false;
        } else {
            let arr = itemData.split('_');
            let mergeId = arr[0];
            if (icon) {
                icon.node.active = true;
                icon.spriteFrame = GamePlay.instance.mergeRoot.mergeLevelNode.GetSpriteFrameByMergeId(mergeId);
            }
            if (hole) hole.active = true;
            if (addGrid) addGrid.active = false;
        }

        node.on(Node.EventType.TOUCH_END, () => {
            if (addGrid && addGrid.active) {
                let meta = Meta.MetaManager.GetMeta(Meta.MetaType.MergeWharehouse, index + 1);
                if (!meta) {
                    return;
                }

                let priceContent = meta.Price();
                if (!priceContent) {
                    return;
                }

                if (Game.ContentCheck.CheckContent(priceContent)) {
                    let req = SR.SRMerge.UpgradeWarehouse(priceContent);
                    req.SetCallBack(res => {
                        this.updateStoreItems();
                    });
                    req.SetErrorCallBack(() => {
                        this.updateStoreItems();
                    });
                    req.Send();
                }
            } else if (icon && icon.node.active) {
                let emptyPos = GamePlay.instance.mergeRoot.mergeLevelNode.getEmptyTilePos();
                if (emptyPos) {
                    let req = SR.SRMerge.MovePieceFromWarehouseToGrid(index);
                    req.SetCallBack(res => {
                        this.tempPutbackMergeData.push(itemData);
                        let pname = res.cellKey;
                        GamePlay.instance.mergeRoot.mergeLevelNode.CreateFromWharehouse(pname, itemData);
                        if (GameKit.SoundManager && GameKit.SoundManager.playWarehouseTakeOutSound) {
                            GameKit.SoundManager.playWarehouseTakeOutSound();
                        }
                        this.updateStoreItems();
                    });
                    req.Send();
                } else {
                    GameKit.ShakeAnimTool.Shake(icon.node, 3);
                }
            }
        });
    }

    update() {
        if (this.listBg && this.list && this.list.content) {
            this.listBg.setPosition(this.listBg.position.x, this.list.content.position.y);
        }
    }
}
