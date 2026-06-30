import { _decorator, Label } from 'cc';
import { UIWindow } from '../../GameKit/ui/UIWindow';
import { ContentModel } from '../../game/items/ContentModel';
import MergeContentUtil from '../../game/merge/MergeContentUtil';

const { ccclass, property } = _decorator;

@ccclass('MergeCookingConfirmWindow')
export default class MergeCookingConfirmWindow extends UIWindow {
    @property(ContentModel)
    public toolContent: ContentModel | null = null;

    @property(ContentModel)
    public resultContent: ContentModel | null = null;

    @property(Label)
    public titleLabel: Label | null = null;

    @property(Label)
    public msgLabel: Label | null = null;

    @property(Label)
    public labelCancel: Label | null = null;

    @property(Label)
    public labelOk: Label | null = null;

    @property(ContentModel)
    public cancelContent: ContentModel | null = null;

    public static windowPath = 'Merge/MergeCookingConfirmWindow';

    public recipeMeta: any = null;
    public confirmFunc: any = null;
    public cancelFunc: any = null;
    public toolCellKey = '';
    public toolId = 0;
    public resultId = 0;
    public resultCount = 1;
    public costContent: any = null;

    public onShow(showParams: any) {
        showParams = showParams || {};
        this.recipeMeta = showParams.recipeMeta;
        this.confirmFunc = showParams.confirmFunc || showParams.onConfirm || showParams.onOk;
        this.cancelFunc = showParams.cancelFunc || showParams.onCancel;
        this.toolCellKey = showParams.toolCellKey;
        this.toolId = this.getParamId(showParams, ['toolId', 'cookingToolId', 'makeToolId']);
        this.resultId = this.getParamId(showParams, ['resultId', 'productId', 'mergeId', 'id']);
        this.resultCount = parseInt(showParams.resultCount || showParams.count || 1, 10);

        const costStr = MergeContentUtil.toContentString(showParams.costStr || (this.recipeMeta && this.recipeMeta.CancelCost && this.recipeMeta.CancelCost()));
        this.costContent = costStr ? Game.Content.FromString(costStr) : null;
        if (this.cancelContent && costStr) {
            this.cancelContent.node.active = true;
            this.cancelContent.show(this.costContent, { iconParams: { dontTouch: true } });
        } else if (this.cancelContent) {
            this.cancelContent.node.active = false;
        }

        this.updateLabels(showParams);
        this.showMergeContent(this.toolContent, this.toolId, 1, true);
        this.showMergeContent(this.resultContent, this.resultId, this.resultCount, true);
    }

    public event_close() {
        this.onCancel();
    }

    public isCookingFinished() {
        if (!this.toolCellKey) {
            return false;
        }
        const posArr = this.toolCellKey.split('_');
        if (posArr.length < 2) {
            return false;
        }
        const cookingId = Game.SUserMerge.getGeneratorIdByMergeTilePos(posArr[0], posArr[1]);
        const cookingData = cookingId ? Game.SUserMerge.GetCookingState(cookingId) : null;
        return cookingData && cookingData.status === 'cooking' && GameKit.TimeUtil.getCurrentTime() >= cookingData.finishTime;
    }

    public closeIfCookingFinished() {
        if (!this.isCookingFinished()) {
            return false;
        }
        console.log('cooking already finished');
        this.closeAnim();
        return true;
    }

    public onConfirm() {
        if (this.closeIfCookingFinished()) {
            return;
        }
        if (this.costContent && !Game.ContentCheck.CheckContent(this.costContent)) {
            return;
        }
        this.backToLoadedBeforeConfirm();
    }

    public backToLoadedBeforeConfirm() {
        if (!this.toolCellKey) {
            console.error('MergeCookingConfirmWindow missing toolCellKey');
            return;
        }
        const mergeLevelNode = GamePlay.instance.mergeRoot.mergeLevelNode;
        mergeLevelNode.updateMergeMapEvent({
            actionType: 'func',
            funcAction: 'cookingBackToLoaded',
            forceServer: true,
            toolCellKey: this.toolCellKey,
        }).then((result: any) => {
            if (result.success) {
                if (this.confirmFunc) {
                    this.confirmFunc();
                }
                this.closeAnim();
            }
        }).catch((err: any) => {
            console.error(err, 'updateMergeMapEvent_cookingBackToLoaded');
        });
    }

    public onCancel() {
        if (this.closeIfCookingFinished()) {
            return;
        }
        if (this.cancelFunc) {
            this.cancelFunc();
        }
        this.closeAnim();
    }

    public updateLabels(_showParams: any) {
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
}
