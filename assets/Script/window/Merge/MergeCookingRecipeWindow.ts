import { _decorator, isValid, Label, UIOpacity } from 'cc';
import { UIWindow } from '../../GameKit/ui/UIWindow';
import { ContentModel } from '../../game/items/ContentModel';
import List from '../../GameKit/ui/list/List';
import { EnterCloseAnim } from '../../GameKit/ui/EnterCloseAnim';

const { ccclass, property } = _decorator;

@ccclass('MergeCookingRecipeWindow')
export class MergeCookingRecipeWindow extends UIWindow {
    @property(List)
    public cookingScrollview: List | null = null;

    @property(ContentModel)
    public materialContent1: ContentModel | null = null;

    @property(ContentModel)
    public materialContent2: ContentModel | null = null;

    @property(Label)
    public labelTime: Label | null = null;

    public static windowPath = 'Merge/MergeCookingRecipeWindow';

    public showParams: any = null;
    public mergeTypeWindow: any = null;
    public mergeTypeWindowActive = false;
    public mergeTypeNameLabelState: any = null;
    public resultId = 0;
    public toolId = 0;
    public recipeMeta: any = null;
    public ingredientIds: any[] = [];

    public onShow(showParams: any) {
        showParams = showParams || {};
        this.showParams = showParams;
        this.mergeTypeWindow = this.getMergeTypeWindow(showParams);
        this.mergeTypeWindowActive = this.mergeTypeWindow && this.mergeTypeWindow.node ? this.mergeTypeWindow.node.active : false;
        this.mergeTypeNameLabelState = this.getMergeTypeNameLabelState(this.mergeTypeWindow);
        if (this.mergeTypeWindowActive) {
            this.mergeTypeWindow.node.active = false;
        }

        this.resultId = this.getParamId(showParams, ['resultId', 'productId', 'mergeId', 'id']);
        this.toolId = this.getParamId(showParams, ['toolId', 'cookingToolId', 'makeToolId']);
        this.recipeMeta = this.getRecipeMeta(this.resultId, this.toolId);
        this.ingredientIds = this.recipeMeta ? this.recipeMeta.IngredientIds() : [];

        this.showMergeContent(this.materialContent1, this.toolId, 1, true);
        this.showMergeContent(this.materialContent2, this.resultId, this.recipeMeta ? this.recipeMeta.ResultCount() : 1);
        this.updateLabels(showParams);

        if (this.cookingScrollview) {
            this.cookingScrollview.numItems = this.ingredientIds.length;
        }
    }

    public onListItemRender(itemNode: any, index: number) {
        const ingredientId = this.ingredientIds[index];
        const contentModel = this.getItemContentModel(itemNode);
        if (contentModel) {
            this.showMergeContent(contentModel, ingredientId, 1, true);
        }

        const nameLabel = this.getChildComponent(itemNode, ['labelName', 'nameLabel', 'name', 'title'], Label);
        if (nameLabel) {
            nameLabel.string = this.getIngredientName(ingredientId, index);
        }
    }

    public event_close() {
        this.closeAnim();
    }

    public onClose() {
        if (this.mergeTypeWindowActive && this.mergeTypeWindow && isValid(this.mergeTypeWindow.node)) {
            const mergeTypeWindow = this.mergeTypeWindow;
            const nameLabelState = this.mergeTypeNameLabelState;
            mergeTypeWindow.node.active = true;
            this.restoreMergeTypeNameLabel(mergeTypeWindow, nameLabelState);
            EnterCloseAnim.playEnter(mergeTypeWindow.node);
            mergeTypeWindow.scheduleOnce(() => {
                this.restoreMergeTypeNameLabel(mergeTypeWindow, nameLabelState);
            }, 0);
        }
        this.mergeTypeWindow = null;
        this.mergeTypeWindowActive = false;
        this.mergeTypeNameLabelState = null;
    }

    public getMergeTypeWindow(showParams: any) {
        if (showParams.sourceWindow && showParams.sourceWindow.node && isValid(showParams.sourceWindow.node)) {
            return showParams.sourceWindow;
        }

        const mergeTypeWindow = UIRoot.instance.GetWindow('MergeTypeWindow');
        if (mergeTypeWindow && mergeTypeWindow.node && isValid(mergeTypeWindow.node)) {
            return mergeTypeWindow;
        }
        return null;
    }

    public getMergeTypeNameLabelState(mergeTypeWindow: any) {
        if (!mergeTypeWindow || !mergeTypeWindow.nameLabel || !mergeTypeWindow.nameLabel.node) {
            return null;
        }

        const labelNode = mergeTypeWindow.nameLabel.node;
        const opacity = labelNode.getComponent(UIOpacity);
        return {
            string: mergeTypeWindow.nameLabel.string,
            active: labelNode.active,
            opacity: opacity ? opacity.opacity : 255,
            position: labelNode.position.clone(),
        };
    }

    public restoreMergeTypeNameLabel(mergeTypeWindow: any, nameLabelState: any) {
        if (!nameLabelState || !mergeTypeWindow || !mergeTypeWindow.nameLabel || !isValid(mergeTypeWindow.nameLabel.node)) {
            return;
        }

        const labelNode = mergeTypeWindow.nameLabel.node;
        const opacity = labelNode.getComponent(UIOpacity) || labelNode.addComponent(UIOpacity);
        mergeTypeWindow.nameLabel.string = nameLabelState.string;
        labelNode.active = nameLabelState.active;
        opacity.opacity = nameLabelState.opacity;
        labelNode.setPosition(nameLabelState.position);
    }

    public getParamId(params: any, keys: string[]) {
        for (let i = 0; i < keys.length; i++) {
            const value = params[keys[i]];
            if (value != null && value !== '') {
                return parseInt(value, 10);
            }
        }
        return 0;
    }

    public getRecipeMeta(resultId: any, toolId: any) {
        if (!resultId || !toolId) {
            return null;
        }

        const list = Meta.MergeCookingRecipeMeta.GetRecipesByToolId(toolId) || [];
        for (let i = 0; i < list.length; i++) {
            if (list[i].ResultId() === resultId) {
                return list[i];
            }
        }
        return null;
    }

    public updateLabels(showParams: any) {
        const titleLabel = this.getLabel('titleLabel');
        if (titleLabel) {
            titleLabel.string = showParams.title || (this.recipeMeta ? this.recipeMeta.ResultName() : '');
        }

        const timeLabel = this.labelTime || this.getLabel('timeLabel');
        if (timeLabel) {
            const makeTime = this.recipeMeta ? this.recipeMeta.MakeTime() : showParams.time;
            timeLabel.string = typeof makeTime === 'string' ? makeTime : this.formatTime(makeTime);
        }
    }

    public formatTime(seconds: any) {
        seconds = parseInt(seconds, 10) || 0;
        return GameKit.TimeUtil.FormatRemainTimeSimple(seconds, false);
    }

    public showMergeContent(contentModel: any, mergeId: any, count: number, showInfoBtn?: boolean) {
        if (!contentModel) {
            return;
        }

        if (!mergeId) {
            if (contentModel.clear) {
                contentModel.clear();
            }
            contentModel.node.active = false;
            return;
        }

        contentModel.node.active = true;
        contentModel.show(this.getMergeContent(mergeId, count), {
            iconParams: { dontTouch: !showInfoBtn },
            infoBtnParams: {
                canTouch: false,
                showInfoBtn: !!showInfoBtn,
            },
        });
    }

    public getMergeContent(mergeId: any, count: number) {
        return Game.Content.FromString('9=' + mergeId + '=' + (count || 1));
    }

    public getIngredientName(ingredientId: any, index: number) {
        if (this.recipeMeta) {
            const names = this.recipeMeta.IngredientNames() || [];
            const name = GameKit.i18n.sel(names[index]);
            if (name) {
                return name;
            }
        }

        const meta = Meta.MetaManager.GetMeta(Meta.MetaType.MergeElements, ingredientId);
        return meta ? meta.Name() : '';
    }

    public getItemContentModel(itemNode: any) {
        if (!itemNode) {
            return null;
        }

        const contentModel = itemNode.getComponent(ContentModel);
        if (contentModel) {
            return contentModel;
        }

        return this.getChildComponent(itemNode, ['content', 'item', 'itemModel', 'contentModel', 'materialContent'], ContentModel);
    }

    public getLabel(nodeName: string) {
        return this.getChildComponent(this.node, [nodeName], Label);
    }

    public getChildComponent(root: any, nodeNames: string[], component: any) {
        if (!root) {
            return null;
        }

        for (let i = 0; i < nodeNames.length; i++) {
            const node = this.findChild(root, nodeNames[i]);
            if (node) {
                const comp = node.getComponent(component);
                if (comp) {
                    return comp;
                }
            }
        }
        return null;
    }

    public findChild(root: any, nodeName: string) {
        if (!root) {
            return null;
        }
        if (root.name === nodeName) {
            return root;
        }
        for (let i = 0; i < root.children.length; i++) {
            const child = this.findChild(root.children[i], nodeName);
            if (child) {
                return child;
            }
        }
        return null;
    }
}
