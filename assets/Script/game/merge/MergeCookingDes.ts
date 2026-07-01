import { _decorator, Component, Label, Node, ProgressBar, UITransform, Vec3 } from 'cc';
import { ContentModel } from '../items/ContentModel';
import { bindGuardedClick, unbindGuardedClick } from '../../GameKit/ui/TouchClickGuard';
import { MergeContentUtil } from './MergeContentUtil';

const { ccclass, property } = _decorator;

type DynamicNode = Node & { [key: string]: any };

function showContentModel (model: ContentModel | null, content: any) {
    if (!model) return;
    model.show(content, { iconParams: { dontTouch: true } });
}

@ccclass('MergeCookingDes')
export class MergeCookingDes extends Component {
    @property(Component)
    public cookingScrollview: Component | null = null;

    @property(Node)
    public state1: Node | null = null;

    @property(Node)
    public state2: Node | null = null;

    @property(Node)
    public state3: Node | null = null;

    public toolCellKey: any = null;
    public cookingData: any = null;
    public currentState: any = null;
    public recipeMeta: any = null;
    public time_progress: ProgressBar | null = null;
    public time_label: Label | null = null;

    start () {
    }

    ShowCookingDes (state: any, cookingData: any, toolCellKey: any) {
        this.toolCellKey = toolCellKey;
        this.cookingData = cookingData;
        this.currentState = state;
        for (let i = 1; i <= 3; i++) {
            const stateNode = (this as any)['state' + i] as Node | null;
            if (stateNode) stateNode.active = i === state;
        }
        this.node.active = true;

        const currentStateNode = (this as any)['state' + state] as Node | null;
        const toolId = cookingData && cookingData.toolId;
        this.recipeMeta = this.getRecipeMeta(toolId, cookingData && cookingData.ingredientIds);

        if (state === 1) {
            if (this.cookingScrollview) {
                (this.cookingScrollview as any).numItems = Array.isArray(cookingData && cookingData.ingredientIds) ? cookingData.ingredientIds.length : 0;
            }
            const btn_cooking = GameKit.ControllerTable.GetNode(currentStateNode, 'btn_cooking') as Node | null;
            const cook_itemModel = btn_cooking
                ? GameKit.ControllerTable.GetComponent(btn_cooking, 'itemModel', ContentModel) as ContentModel | null
                : null;
            if (btn_cooking) {
                btn_cooking.active = !!this.recipeMeta;
            }
            if (this.recipeMeta) {
                showContentModel(cook_itemModel, Game.Content.FromString('9=' + this.recipeMeta.ResultId() + '=' + this.recipeMeta.ResultCount()));
            }
        } else if (state === 2) {
            this.showState2();
        } else if (state === 3) {
            this.showState3();
        }
    }

    showState3 () {
        const cook_itemModel = GameKit.ControllerTable.GetComponent(this.state3, 'itemModel', ContentModel) as ContentModel | null;
        if (!cook_itemModel || !this.cookingData || !this.cookingData.resultId) return;
        const resultCount = this.cookingData.resultCount || (this.recipeMeta && this.recipeMeta.ResultCount()) || 1;
        showContentModel(cook_itemModel, Game.Content.FromString('9=' + this.cookingData.resultId + '=' + resultCount));
    }

    showState2 () {
        const btn_jump = GameKit.ControllerTable.GetNode(this.state2, 'btn_jump') as Node | null;
        const jump_itemModel = btn_jump
            ? GameKit.ControllerTable.GetComponent(btn_jump, 'itemModel', ContentModel) as ContentModel | null
            : null;
        if (this.recipeMeta) {
            showContentModel(jump_itemModel, Game.Content.FromString(MergeContentUtil.toContentString(this.recipeMeta.CancelCost())));
        }

        const result_itemModel = GameKit.ControllerTable.GetComponent(this.state2, 'itemModel', ContentModel) as ContentModel | null;
        if (this.recipeMeta && this.cookingData) {
            showContentModel(result_itemModel, Game.Content.FromString('9=' + this.cookingData.resultId + '=' + this.recipeMeta.ResultCount()));
        }

        this.time_progress = GameKit.ControllerTable.GetComponent(this.state2, 'time-progress', ProgressBar) as ProgressBar | null;
        this.time_label = this.time_progress && this.time_progress.getComponentInChildren(Label);
        this.refreshCookingProgress();
    }

    refreshCookingProgress () {
        if (!this.cookingData || !this.time_progress) return;
        const currentTime = GameKit.TimeUtil.getCurrentTime();
        const totalTime = Math.max(0, this.cookingData.finishTime - this.cookingData.startTime);
        const leftTime = Math.max(0, this.cookingData.finishTime - currentTime);
        const progress = totalTime > 0 ? (totalTime - leftTime) / totalTime : 1;
        this.time_progress.progress = Math.min(1, Math.max(0, progress));
        if (this.time_label) {
            this.time_label.string = GameKit.TimeUtil.FormatRemainTimeSimple(leftTime, false);
        }
        if (leftTime <= 0) {
            this.refreshNoCookingDataState(true);
        }
    }

    normalizeIngredientIds (ids: any) {
        const list: number[] = [];
        if (!Array.isArray(ids)) return list;
        for (let i = 0; i < ids.length; i++) {
            const id = parseInt(ids[i]);
            if (!isNaN(id)) list.push(id);
        }
        list.sort((a, b) => a - b);
        return list;
    }

    buildRecipeKey (ids: any) {
        return this.normalizeIngredientIds(ids).join('+');
    }

    getRecipeMeta (toolId: any, ingredientIds: any) {
        if (!toolId || !Meta.MergeCookingRecipeMeta) return null;
        const currentKey = this.buildRecipeKey(ingredientIds);
        if (!currentKey) return null;
        const recipes = Meta.MergeCookingRecipeMeta.GetRecipesByToolId(toolId) || [];
        for (let i = 0; i < recipes.length; i++) {
            const recipe = recipes[i];
            const ingredientKey = this.buildRecipeKey(recipe.IngredientIds ? recipe.IngredientIds() : []);
            if (ingredientKey === currentKey) {
                return recipe;
            }
            const recipeKey = recipe.RecipeKey ? recipe.RecipeKey() : '';
            if (recipeKey && (recipeKey === currentKey || recipeKey === toolId + '+' + currentKey || recipeKey === toolId + '_' + currentKey)) {
                return recipe;
            }
        }
        return null;
    }

    getCurrentRecipeMeta () {
        if (this.recipeMeta) return this.recipeMeta;
        if (this.cookingData && this.cookingData.recipeId) {
            return Meta.MetaManager.GetMeta(Meta.MetaType.MergeCookingRecipe, this.cookingData.recipeId);
        }
        return null;
    }

    getCookingConfirmParams (confirmFunc: any, costStr: any) {
        const recipeMeta = this.getCurrentRecipeMeta();
        const cookingData = this.cookingData || {};
        return {
            recipeMeta,
            toolCellKey: this.toolCellKey,
            toolId: cookingData.toolId || (recipeMeta && recipeMeta.ToolId()),
            resultId: cookingData.resultId || (recipeMeta && recipeMeta.ResultId()),
            resultCount: cookingData.resultCount || (recipeMeta && recipeMeta.ResultCount()),
            costStr,
            confirmFunc,
        };
    }

    refreshNoCookingDataState (forceRefresh?: any) {
        this.node.active = false;
        const mergeLevelNode = GamePlay.instance.mergeRoot.mergeLevelNode;
        const mergeNodeUI = GamePlay.instance.mergeRoot.mergeNodeUI;
        const toolNode = this.toolCellKey && mergeLevelNode.node.getChildByName(this.toolCellKey);
        const mergeItem = toolNode && toolNode.getComponent('MergeItem') as any;
        let meta = mergeItem ? Meta.MetaManager.GetMeta(Meta.MetaType.MergeElements, mergeItem.GetMergeId()) : null;
        if (!meta && this.cookingData && this.cookingData.toolId) {
            meta = Meta.MetaManager.GetMeta(Meta.MetaType.MergeElements, this.cookingData.toolId);
        }
        if (mergeNodeUI && meta && mergeItem) {
            mergeItem.showCooking(meta);
            if (forceRefresh) {
                mergeNodeUI.ShowMergeDes(null);
            }
            mergeNodeUI.ShowMergeDes(meta, mergeItem);
        }
    }

    playTakeBackItems (result: any, globalPos: any) {
        const returned = result && result.cookingReturned;
        if (!Array.isArray(returned) || returned.length <= 0) return;
        const mergeLevelNode = GamePlay.instance.mergeRoot.mergeLevelNode;
        for (let i = 0; i < returned.length; i++) {
            const item = returned[i];
            if (item && item.pieceData && item.cellKey) {
                mergeLevelNode.ExtractTempData(item.pieceData, item.cellKey, globalPos);
            }
        }
    }

    onCookingListRender (node: DynamicNode, index: number) {
        const resultContent = node.getComponent('ContentModel') as ContentModel | null;
        const id = this.cookingData.ingredientIds[index];
        const content = Game.Content.FromString('9=' + id + '=1');
        showContentModel(resultContent, content);
        unbindGuardedClick(node, this);
        bindGuardedClick(node, this, () => {
            const transform = node.getComponent(UITransform);
            const globalPos = transform ? transform.convertToWorldSpaceAR(Vec3.ZERO) : node.worldPosition.clone();
            const mergeLevelNode = GamePlay.instance.mergeRoot.mergeLevelNode;
            const emptypos = mergeLevelNode.getEmptyTilePos(globalPos);
            if (!emptypos) {
                GamePlay.instance.mergeRoot.mergeNodeUI.PlayAdditionDscAnim('没有空格子了，不能取回！');
                return;
            }
            const targetCellKeys = [emptypos.x + '_' + emptypos.y];
            mergeLevelNode.updateMergeMapEvent({
                actionType: 'func',
                funcAction: 'cookingTakeBack',
                forceServer: true,
                toolCellKey: this.toolCellKey,
                targetCellKeys,
                ingredientIndex: index,
            }).then((result: any) => {
                if (result.success) {
                    this.playTakeBackItems(result, globalPos);
                    this.refreshNoCookingDataState();
                }
            }).catch((err: any) => {
                console.error(err, 'updateMergeMapEvent_cookingTakeBack');
            });
        });
    }

    onClickStartCooking () {
        if (!this.recipeMeta) return;
        const mergeLevelNode = GamePlay.instance.mergeRoot.mergeLevelNode;
        mergeLevelNode.updateMergeMapEvent({
            actionType: 'func',
            forceServer: true,
            funcAction: 'cookingStart',
            toolCellKey: this.toolCellKey,
            recipeId: this.recipeMeta.Id(),
        }).then((result: any) => {
            if (result.success) {
                this.refreshNoCookingDataState();
            }
        }).catch((err: any) => {
            console.log(err, 'updateMergeMapEvent_cookingStart');
        });
    }

    onClickResetCooking () {
        const recipeMeta = this.getCurrentRecipeMeta();
        const costStr = recipeMeta && recipeMeta.CancelCost && recipeMeta.CancelCost();
        UIRoot.instance.openChildWindow('MergeCookingConfirmWindow', this.getCookingConfirmParams(() => {
            this.refreshNoCookingDataState();
        }, costStr));
    }

    onClickJump () {
        const recipeMeta = this.getCurrentRecipeMeta();
        if (!recipeMeta) return;
        const quickCost = MergeContentUtil.toContentString(recipeMeta.QuickCost());
        if (!Game.ContentCheck.CheckContent(Game.Content.FromString(quickCost))) {
            return;
        }
        const mergeLevelNode = GamePlay.instance.mergeRoot.mergeLevelNode;
        mergeLevelNode.updateMergeMapEvent({
            actionType: 'func',
            funcAction: 'cookingQuickFinish',
            forceServer: true,
            toolCellKey: this.toolCellKey,
        }).then((result: any) => {
            if (result.success) {
                this.refreshNoCookingDataState(true);
            }
        }).catch((err: any) => {
            console.error(err, 'updateMergeMapEvent_cookingQuickFinish');
        });
    }

    update (dt: number) {
        if (this.currentState === 2 && this.cookingData && this.cookingData.status === 'cooking') {
            this.refreshCookingProgress();
        }
    }
}

export default MergeCookingDes;
