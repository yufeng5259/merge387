import { _decorator, Label } from 'cc';
import { UIWindow } from '../../GameKit/ui/UIWindow';
import { ContentModel } from '../../game/items/ContentModel';
import MergeTypes from '../../game/merge/MergeTypes';

const { ccclass, property } = _decorator;

@ccclass('ScissorsWindow')
export class ScissorsWindow extends UIWindow {
    @property(Label)
    public titleLabel: Label | null = null;

    @property(Label)
    public desLabel: Label | null = null;

    @property(ContentModel)
    public scissorsContentModel: ContentModel | null = null;

    @property(ContentModel)
    public dropItemContentModel: ContentModel | null = null;

    @property([ContentModel])
    public mergeContentModelArr: ContentModel[] = [];

    public static windowPath = 'Merge/ScissorsWindow';

    public scissorsMeta: any = null;
    public dropMeta: any = null;
    public cellKey1: any = null;
    public cellKey2: any = null;
    public pickPieceData: any = null;

    public onShow(showParams: any) {
        this.scissorsMeta = showParams.scissorsMeta;
        this.dropMeta = showParams.dropMeta;
        this.cellKey1 = showParams.cellKey1;
        this.cellKey2 = showParams.cellKey2;

        const preid = this.dropMeta.PrevId();
        this.pickPieceData = {
            cutPieces: null,
            degradedScissors: null,
        };

        this.scissorsContentModel.show(Game.Content.FromString('9=' + this.scissorsMeta.Id() + '=1'), { iconParams: { dontTouch: true } });
        this.dropItemContentModel.show(Game.Content.FromString('9=' + this.dropMeta.Id() + '=1'), { iconParams: { dontTouch: true } });

        this.mergeContentModelArr.forEach((mergeContentModel) => {
            const content = Game.Content.FromString('9=' + preid + '=1');
            mergeContentModel.show(content, { iconParams: { dontTouch: true } });
        });
    }

    public onClickOk() {
        const mergeLevelNode = GamePlay.instance.mergeRoot.mergeLevelNode;
        mergeLevelNode.updateMergeMapEvent({
            actionType: MergeTypes.MergeActionType.MERGE,
            cellKey1: this.cellKey1,
            cellKey2: this.cellKey2,
            forceSend: true,
        }).then((result: any) => {
            this.pickPieceData.cutPieces = result.cutPieces;
            this.pickPieceData.degradedScissors = result.degradedScissors;
            this.closeAnim();
        }).catch((err: any) => {
            console.error(err, 'ScissorsWindow updateMergeMapEvent');
        });
    }

    public event_close() {
        this.pickPieceData = null;
        this.closeAnim();
    }
}
