import { _decorator, Component, Label, Layout, Node, RichText, Sprite, UITransform, Vec3 } from 'cc';
import { ContentModel } from '../items/ContentModel';
import MergeTypes from './MergeTypes';
import { MergeBubbleDes } from './MergeBubbleDes';
import { MergeCookingDes } from './MergeCookingDes';
import LabelLocalized from '../../GameKit/i18n/LabelLocalized';

const { ccclass, property } = _decorator;

@ccclass('MergeDes')
export class MergeDes extends Component {
    @property(RichText)
    public desLabel: RichText | null = null;

    @property(Node)
    public contentDesNode: Node | null = null;

    @property(Node)
    public defaultDesNode: Node | null = null;

    @property(Node)
    public mergeElementBack: Node | null = null;

    @property(MergeCookingDes)
    public cookingDes: MergeCookingDes | null = null;

    @property(MergeBubbleDes)
    public bubbleDesNode: MergeBubbleDes | null = null;

    @property(Node)
    public deleteButton: Node | null = null;

    @property(Node)
    public sellButton: Node | null = null;

    @property(Node)
    public openButton: Node | null = null;

    @property(Label)
    public nameLabel: Label | null = null;

    public _lastShowKey: string | null = null;
    public mergeDataStr: any = null;
    public instanceId: any = null;
    public generateNode: Node | null = null;
    public meta: any = null;
    public tx: any = null;
    public ty: any = null;
    public mergeId: any = null;
    public onetimeDestroy: any = null;
    public remainingCount: any = null;

    onLoad () {
        this.mergeElementBack.active = false;
        this.contentDesNode.active = false;
        this.defaultDesNode.active = true;
        if (this.cookingDes && this.cookingDes.node) this.cookingDes.node.active = false;
        if (this.bubbleDesNode && this.bubbleDesNode.node) this.bubbleDesNode.node.active = false;
        this._lastShowKey = null;
        this.refreshStaticLocalizedLabels();
    }

    Show (meta: any, mergeItem: any) {
        this.refreshStaticLocalizedLabels();
        if (!meta) {
            this._lastShowKey = null;
            this.contentDesNode.active = false;
            this.defaultDesNode.active = true;
            this.mergeElementBack.active = false;
            if (this.cookingDes && this.cookingDes.node) this.cookingDes.node.active = false;
            if (this.bubbleDesNode && this.bubbleDesNode.node) this.bubbleDesNode.node.active = false;
            return;
        }

        const mergeDataStr = mergeItem.GetMergeData();
        const instanceId = mergeItem.GetGeneratorInstanceId();
        const isBubble = mergeItem.IsBubble();
        const bubbleData = isBubble ? Game.SUserMerge.GetBubbleByTilePos(mergeItem.tx, mergeItem.ty) : null;
        let cookingData: any = null;
        if (meta.FunctionType() === MergeTypes.MergeFunctionType.COOKING) {
            const cookingId = Game.SUserMerge.getGeneratorIdByMergeTilePos(mergeItem.tx, mergeItem.ty);
            cookingData = Game.SUserMerge.GetCookingState(cookingId);
        }
        const showKey = [
            meta.Id(),
            mergeItem.tx,
            mergeItem.ty,
            mergeDataStr,
            instanceId,
            isBubble ? JSON.stringify(bubbleData || {}) : '',
            isBubble ? Game.SUserMerge.BubbleFreeCount() : '',
            cookingData ? JSON.stringify(cookingData) : '',
        ].join('_');
        if (this._lastShowKey === showKey) {
            return;
        }
        this._lastShowKey = showKey;
        this.mergeDataStr = mergeDataStr;
        this.instanceId = instanceId;
        this.generateNode = mergeItem.node;
        this.meta = meta;
        this.tx = mergeItem.tx;
        this.ty = mergeItem.ty;

        const canDrag = mergeItem.IfCanDrag();
        this.contentDesNode.active = true;
        this.defaultDesNode.active = false;
        this.mergeElementBack.active = false;
        if (this.cookingDes && this.cookingDes.node) this.cookingDes.node.active = false;
        if (this.bubbleDesNode && this.bubbleDesNode.node) this.bubbleDesNode.node.active = false;
        if (this.desLabel) {
            this.desLabel.string = meta.Description();
            this.desLabel.node.active = true;
        }

        const typeMeta = Meta.MetaManager.GetMeta(Meta.MetaType.MergeType, meta.Type());
        const levels = typeMeta ? typeMeta.Levels() : [];
        this.mergeId = meta.Id();
        if (this.nameLabel) {
            this.nameLabel.string = levels.indexOf(meta.Id()) === -1 ? meta.Name() : meta.Name();
        }

        if (isBubble) {
            this.sellButton.active = false;
            this.deleteButton.active = false;
            this.openButton.active = false;
            if (this.bubbleDesNode && this.bubbleDesNode.node) {
                this.bubbleDesNode.node.active = true;
                this.bubbleDesNode.ShowDes(meta, this.tx, this.ty);
            }
            this.refreshDesLabelLayout();
            return;
        }

        if (this.isHighestGeneratorInType(meta.Id())) {
            this.sellButton.active = false;
            this.deleteButton.active = false;
            this.openButton.active = false;
        } else if (meta.IfCanSell()) {
            if (canDrag) {
                if (meta.SellType() === MergeTypes.MergeActionType.SELL) {
                    const itemModel = this.sellButton
                        ? GameKit.ControllerTable.GetComponent(this.sellButton, 'itemModel', ContentModel) as ContentModel | null
                        : null;
                    if (itemModel) itemModel.show(Game.Content.FromString(meta.SellPrice()));
                    this.sellButton.active = true;
                    this.deleteButton.active = false;
                    this.openButton.active = false;
                } else if (meta.SellType() === MergeTypes.MergeActionType.DELETE) {
                    this.sellButton.active = false;
                    this.deleteButton.active = true;
                    this.openButton.active = false;
                } else {
                    this.sellButton.active = false;
                    this.deleteButton.active = false;
                    this.openButton.active = false;
                }
            } else {
                this.deleteButton.active = false;
                this.sellButton.active = false;
                this.openButton.active = false;
            }
        } else if (meta.SellType() === MergeTypes.MergeActionType.OPEN) {
            if (mergeItem.IfNeedOpen()) {
                this.sellButton.active = false;
                this.deleteButton.active = false;
                this.openButton.active = true;
                const timeLabel = this.openButton
                    ? GameKit.ControllerTable.GetComponent(this.openButton, 'label_time', Label) as Label | null
                    : null;
                if (timeLabel) timeLabel.string = mergeItem.GetOpenTime();
            } else {
                this.sellButton.active = false;
                this.deleteButton.active = false;
                this.openButton.active = false;
            }
        } else {
            if (meta.FunctionType() === MergeTypes.MergeFunctionType.COOKING) {
                const toolCellKey = this.tx + '_' + this.ty;
                if (!cookingData || cookingData.ingredientIds.length === 0) {
                    if (this.cookingDes && this.cookingDes.node) this.cookingDes.node.active = false;
                    if (this.desLabel) this.desLabel.node.active = true;
                } else {
                    let state1 = 2;
                    if (cookingData.status === 'loaded') {
                        state1 = 1;
                        if (this.desLabel) this.desLabel.node.active = false;
                    } else if (cookingData.status === 'cooking') {
                        if (GameKit.TimeUtil.getCurrentTime() >= cookingData.finishTime) {
                            state1 = 3;
                            if (this.desLabel) {
                                this.desLabel.node.active = true;
                                this.desLabel.string = GameKit.i18n.t('Merge_Cooking_Finish_Des');
                            }
                        } else {
                            if (this.desLabel) this.desLabel.node.active = false;
                            state1 = 2;
                        }
                    }
                    if (this.cookingDes) {
                        this.cookingDes.ShowCookingDes(state1, cookingData, toolCellKey);
                    }
                }
            }
            this.deleteButton.active = false;
            this.sellButton.active = false;
            this.openButton.active = false;
        }
        this.applyMainForcedTutorialSellGuard();
        this.refreshDesLabelLayout();
    }

    ShouldHideSellButtonInMainForcedTutorial () {
        return !!(typeof Game !== 'undefined' && Game && Game.MergeTutorialManager &&
            Game.MergeTutorialManager.ShouldHideMainForcedTutorialControls &&
            Game.MergeTutorialManager.ShouldHideMainForcedTutorialControls());
    }

    applyMainForcedTutorialSellGuard () {
        if (this.ShouldHideSellButtonInMainForcedTutorial() && this.sellButton) this.sellButton.active = false;
    }

    refreshStaticLocalizedLabels () {
        this.bindLocalizedLabel(this.defaultDesNode ? this.defaultDesNode.getChildByName('des') : null, 'Merge_Default_Des');
        this.bindLocalizedLabel(this.sellButton ? this.sellButton.getChildByName('New Label') : null, 'SaleMark');
    }

    bindLocalizedLabel (node: Node | null, textKey: string) {
        if (!node) return;
        let localized = node.getComponent(LabelLocalized) || node.getComponent('LabelLocalized') as any;
        if (!localized) {
            localized = node.addComponent(LabelLocalized);
        }
        localized.textKey = textKey;
        if (localized.onLoad) localized.onLoad();
    }

    refreshDesLabelLayout () {
        if (!this.desLabel || !this.desLabel.node || !this.desLabel.node.active) return;
        if (!this.contentDesNode || !this.contentDesNode.active) return;

        const bg = this.contentDesNode.getChildByName('bg');
        if (!bg) return;
        const bgTransform = bg.getComponent(UITransform);
        if (!bgTransform) return;
        const bgAnchor = bgTransform.anchorPoint;
        let left = bg.position.x - bgAnchor.x * bgTransform.width + 5;
        let right = bg.position.x + (1 - bgAnchor.x) * bgTransform.width - 5;

        const blockNodes = this.getDesRightBlockNodes();
        for (let i = 0; i < blockNodes.length; i++) {
            const nodeLeft = this.getNodeLeftInDesContent(blockNodes[i]);
            if (nodeLeft == null) continue;
            right = Math.min(right, nodeLeft - 2);
        }

        this.desLabel.node.setPosition(left, this.desLabel.node.position.y, this.desLabel.node.position.z);
        const labelTransform = this.desLabel.node.getComponent(UITransform);
        if (labelTransform) {
            labelTransform.width = Math.max(0, right - left);
        }
    }

    getDesRightBlockNodes () {
        const nodes: Array<Node | null> = [
            this.deleteButton,
            this.sellButton,
            this.openButton,
        ];

        if (this.cookingDes && this.cookingDes.node && this.cookingDes.node.activeInHierarchy) {
            nodes.push(
                GameKit.ControllerTable.GetNode(this.cookingDes.node, 'btn_cooking'),
                GameKit.ControllerTable.GetNode(this.cookingDes.node, 'btn_reset'),
                GameKit.ControllerTable.GetNode(this.cookingDes.node, 'btn_jump'),
            );
        }

        if (this.bubbleDesNode && this.bubbleDesNode.node && this.bubbleDesNode.node.activeInHierarchy) {
            const bubbleLayout = this.bubbleDesNode.node.getComponent(Layout);
            if (bubbleLayout) bubbleLayout.updateLayout();
            nodes.push(
                this.bubbleDesNode.btn_broken,
                this.bubbleDesNode.btn_ad,
                this.bubbleDesNode.btn_free,
                this.bubbleDesNode.btn_diamond,
            );
        }

        return nodes;
    }

    getNodeLeftInDesContent (node: Node | null) {
        if (!node || !node.activeInHierarchy || !this.contentDesNode) return null;
        const transform = node.getComponent(UITransform);
        const contentTransform = this.contentDesNode.getComponent(UITransform);
        if (!transform || !contentTransform || transform.width <= 0 || transform.height <= 0) return null;
        const anchor = transform.anchorPoint;
        const width = transform.width;
        const height = transform.height;
        const corners = [
            new Vec3(-anchor.x * width, -anchor.y * height, 0),
            new Vec3((1 - anchor.x) * width, -anchor.y * height, 0),
            new Vec3(-anchor.x * width, (1 - anchor.y) * height, 0),
            new Vec3((1 - anchor.x) * width, (1 - anchor.y) * height, 0),
        ];
        let minX: number | null = null;
        for (let i = 0; i < corners.length; i++) {
            const worldPos = transform.convertToWorldSpaceAR(corners[i]);
            const localPos = contentTransform.convertToNodeSpaceAR(worldPos);
            minX = minX == null ? localPos.x : Math.min(minX, localPos.x);
        }
        return minX;
    }

    isHighestGeneratorInType (mergeId: any) {
        if (!Meta.MergeGeneraterMeta.GetGenerateByMergeId(mergeId)) {
            return false;
        }
        const meta = Meta.MetaManager.GetMeta(Meta.MetaType.MergeElements, mergeId);
        const typeMeta = meta ? Meta.MetaManager.GetMeta(Meta.MetaType.MergeType, meta.Type()) : null;
        const levels = typeMeta ? typeMeta.Levels() : [];
        const currentLevel = levels.indexOf(mergeId);
        if (currentLevel < 0) {
            return false;
        }
        let highestLevel = currentLevel;
        this.forEachUserMergePieceId((id: any) => {
            if (id === mergeId) {
                return;
            }
            if (!Meta.MergeGeneraterMeta.GetGenerateByMergeId(id)) {
                return;
            }
            const level = levels.indexOf(id);
            if (level > highestLevel) {
                highestLevel = level;
            }
        });
        return currentLevel >= highestLevel;
    }

    forEachUserMergePieceId (callback: (id: any) => void) {
        const readId = (dataStr: any) => {
            if (!dataStr) {
                return;
            }
            const id = parseInt(String(dataStr).split('=')[0].split('_')[0]);
            if (!isNaN(id)) {
                callback(id);
            }
        };
        const mapData = Game.SUserMerge.GetMergeMapData() || {};
        for (const key in mapData) {
            readId(mapData[key]);
        }
        const storeData = Game.SUserMerge.GetStoreData() || {};
        for (const key in storeData) {
            readId(storeData[key]);
        }
    }

    GetMergeId () {
        return this.mergeId;
    }

    initMergeElementBack (actionType: any) {
        if (!this.mergeElementBack || !this.meta) return;
        this.mergeElementBack.active = true;
        const icon = GameKit.ControllerTable.GetComponent(this.mergeElementBack, 'icon', Sprite) as Sprite | null;
        if (icon) {
            icon.spriteFrame = CommonAssets.instance.getByAtlas(CommonAssets.Atlases.MergeIcon, this.meta.Icon());
        }
        const itemModel = GameKit.ControllerTable.GetComponent(this.mergeElementBack, 'itemModel', ContentModel) as ContentModel | null;
        if (!itemModel) return;
        if (actionType === 'sell') {
            itemModel.node.active = true;
            itemModel.show(Game.Content.FromString(this.meta.SellPrice()));
        } else {
            itemModel.node.active = false;
        }
    }

    onClickDelete () {
        GamePlay.instance.mergeRoot.mergeLevelNode.DeleteSelectMergeItem(null, null, true, { actionType: 'delete', showAnim: true, forceSend: true }, () => {
            this.initMergeElementBack('delete');
        });
    }

    onClickSell () {
        GamePlay.instance.mergeRoot.mergeLevelNode.DeleteSelectMergeItem(null, null, true, { actionType: 'sell', showAnim: true, forceSend: true }, () => {
            this.initMergeElementBack('sell');
        });
    }

    onClickReset () {
        GamePlay.instance.mergeRoot.mergeLevelNode.UndoItemFromUI(this.tx + '_' + this.ty, this.mergeDataStr, () => {
            this.defaultDesNode.active = true;
            this.mergeElementBack.active = false;
            this.contentDesNode.active = false;
        });
    }

    onClickOpenMergeItem () {
        const generatorData = Game.SUserMerge.GetGeneratorByInstanceId(this.instanceId);
        const { onetimeDestroy, remainingCount } = generatorData;
        this.onetimeDestroy = onetimeDestroy;
        this.remainingCount = remainingCount;
        GamePlay.instance.mergeRoot.mergeLevelNode.OpenGenerator(this.mergeId, this.instanceId, this.onetimeDestroy, this.remainingCount, this.tx + '_' + this.ty, this.generateNode, () => {
            this.defaultDesNode.active = true;
            this.mergeElementBack.active = false;
            this.contentDesNode.active = false;
        });
    }
}

export default MergeDes;
