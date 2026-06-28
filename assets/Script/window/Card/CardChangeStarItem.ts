import { _decorator, Component, Label, Node, Sprite, SpriteFrame } from 'cc';

const { ccclass, property } = _decorator;

type GreySprite = Sprite & {
    setState?: (state: number) => void;
};

@ccclass('CardChangeStarItem')
export default class CardChangeStarItem extends Component {
    @property(Sprite)
    sp_border_normal: Sprite | null = null;

    @property(Sprite)
    sp_border_golden: Sprite | null = null;

    @property(Node)
    sp_border_subject: Node | null = null;

    @property(Node)
    sp_border_subject_f: Node | null = null;

    @property(Sprite)
    sp_card: Sprite | null = null;

    @property(Label)
    label_name: Label | null = null;

    @property(Sprite)
    sp_title_bg: Sprite | null = null;

    @property(Node)
    layout_rare: Node | null = null;

    @property(Label)
    label_more_count: Label | null = null;

    @property(Sprite)
    label_more_sprite: Sprite | null = null;

    @property(Sprite)
    ProgressBar: Sprite | null = null;

    @property(Label)
    ProgressBarLabel: Label | null = null;

    @property(Node)
    AddButton: Node | null = null;

    @property(Node)
    SubtractButton: Node | null = null;

    @property(Component)
    CardTradeWindwo: any = null;

    CardNum = 0;
    id: any = null;
    card_meta: any = null;
    set_meta: any = null;
    count_check = 0;
    spf_reset_card: SpriteFrame | null = null;
    spf_reset_title_bg: SpriteFrame | null = null;

    start() {

    }

    show(id: any, num: number) {
        this.CardNum = 0;
        this.id = id;
        this.card_meta = Meta.MetaManager.GetMeta(Meta.MetaType.Card, id);
        this.set_meta = Meta.MetaManager.GetMeta(Meta.MetaType.CardSets, this.card_meta.SetId());
        this.show_border();
        this.show_card();
        this.show_name();
        this.show_bg_title();
        this.show_rare();
        this.updatePanel();
        this.onSetCardNum(num);
    }

    show_border() {
        let f = this.card_meta.Golden();
        if (this.sp_border_normal) { this.sp_border_normal.node.active = !f; }
        if (this.sp_border_golden) { this.sp_border_golden.node.active = f; }
        if (this.set_meta.IsActivityCard()) {
            if (!f) {
                if (this.sp_border_subject) { this.sp_border_subject.active = true; }
                if (this.sp_border_subject_f) { this.sp_border_subject_f.active = true; }
                if (this.sp_border_normal) { this.sp_border_normal.node.active = false; }
            } else {
                if (this.sp_border_subject) { this.sp_border_subject.active = false; }
                if (this.sp_border_subject_f) { this.sp_border_subject_f.active = false; }
            }
        } else {
            if (this.sp_border_subject) { this.sp_border_subject.active = false; }
            if (this.sp_border_subject_f) { this.sp_border_subject_f.active = false; }
        }
    }

    show_card() {
        if (!this.sp_card) { return; }
        if (!this.spf_reset_card) { this.spf_reset_card = this.sp_card.spriteFrame; }
        const f = () => {
            let resName = `${'Card/'}${this.set_meta.Res()}/${this.card_meta.Index()}`;
            cce.loadRes(resName, SpriteFrame, (err: any, res: any) => {
                if (!err && this.sp_card && res._resName == resName) {
                    this.sp_card.spriteFrame = res;
                }
            });
        };
        cce.releaseSpriteFrame(this.sp_card);
        this.sp_card.spriteFrame = this.spf_reset_card;
        if (this.set_meta.IsActivityCard()) {
            if (CommonAssets.instance.cardLimitSkinAssets.cardDiBg) {
                this.sp_card.spriteFrame = CommonAssets.instance.cardLimitSkinAssets.cardDiBg;
            }
        }
        Game.SUserCard.HaveCard(this.card_meta.Id()) && f();
    }

    show_name() {
        if (!this.label_name) { return; }
        this.label_name.string = `${this.card_meta.Name()}`;
    }

    show_bg_title() {
        if (!this.sp_title_bg) { return; }
        if (!this.spf_reset_title_bg) { this.spf_reset_title_bg = this.sp_title_bg.spriteFrame; }
        const f = () => {
            cce.loadRes(`${'Card/common/card-bg'}_${this.set_meta.Color()}`, SpriteFrame, (err: any, res: any) => {
                cce.releaseSpriteFrame(this.sp_title_bg, res);
                if (!err && this.sp_title_bg) {
                    this.sp_title_bg.spriteFrame = res;
                }
            });
        };
        this.sp_title_bg.spriteFrame = this.spf_reset_title_bg;
        Game.SUserCard.HaveCard(this.card_meta.Id()) && f();
    }

    show_rare() {
        if (!this.layout_rare) { return; }
        this.layout_rare.children.forEach((node, index) => {
            node.active = index < this.card_meta.Rare();
        });
    }

    updatePanel() {
        this.count_check = Game.SUserCard.CardNum(this.card_meta.Id()) - 1;
        if (this.ProgressBarLabel) this.ProgressBarLabel.string = `${this.CardNum}/${this.count_check}`;
        if (this.ProgressBar) this.ProgressBar.fillRange = this.CardNum / this.count_check;

        if (this.SubtractButton) this.SubtractButton.active = !(this.CardNum <= 0);
        if (this.AddButton) this.AddButton.active = !(this.count_check <= this.CardNum);
        this.set_grey(this.node, 1);
    }

    onAddButton() {
        if (this.count_check <= this.CardNum) return;
        this.CardTradeWindwo.onManuallyClick();
        this.onSetCardNum(1);
        this.CardTradeWindwo.onManualSelect(1, this.id);
    }

    onSubtractButton() {
        if (this.CardNum <= 0) return;
        this.CardTradeWindwo.onManuallyClick();
        this.onSetCardNum(-1);
        this.CardTradeWindwo.onManualSelect(-1, this.id);
    }

    onSetCardNum(num: number) {
        this.CardNum += num;
        if (this.ProgressBarLabel) this.ProgressBarLabel.string = `${this.CardNum}/${this.count_check}`;
        if (this.ProgressBar) this.ProgressBar.fillRange = this.CardNum / this.count_check;
        if (this.SubtractButton) this.SubtractButton.active = !(this.CardNum <= 0);
        if (this.AddButton) this.AddButton.active = !(this.count_check <= this.CardNum);

        if (this.CardNum <= 0) {
            this.set_grey(this.node, 1);
        } else {
            this.set_grey(this.node, 0);
        }
    }

    set_grey(node: Node, state: number) {
        var s = node.getComponentsInChildren(Sprite);
        for (var i = 0; i < s.length; i++) {
            const sprite = s[i] as GreySprite;
            if (sprite.setState) sprite.setState(state);
        }
    }
}
