/** @author fengyong 2019-5-15 */

import { _decorator, Component, Label, Layout, Node, Sprite, SpriteFrame } from 'cc';
const { ccclass, property } = _decorator;

type TrackedSpriteFrame = SpriteFrame & {
    _resName?: string;
};

const C = {
    BASE_PATH: "Card",
    CARD_BG_FILENAME: "card-bg",
}

/**
 * 单个card的显示状态
 * - [使用方法1] 挂载在某个节点上,拖入对应的node
 * - [使用方法2] 直接拖入prefab-CardModel
 */
@ccclass('CardModel')
export default class CardModel extends Component {

    /** @type {CardMeta} */
    card_meta: any = null;

    /** @type {CardSetsMeta} */
    set_meta: any = null

    type: any = null
    joker = false

    /**
     * 显示单个card
     * @param {number} id
     * @param {"check"|"no-check"|"reset"} type "check"表示根据实际状态验证;"no-check"表示跳过验证;"reset表示重置";默认为"check"
     */
    show(id, type = "check") {
        if (id == Game.Content.JokerCardId) {
            this.show_joker()
            return
        }
        // 获取数据        
        this.type = type
        this.card_meta = Meta.MetaManager.GetMeta(Meta.MetaType.Card, id)
        if(!this.card_meta){
            this.card_meta=Meta.MetaManager.GetMeta(Meta.MetaType.SubjectCard, id)
        }
        this.set_meta = Meta.MetaManager.GetMeta(Meta.MetaType.CardSets, this.card_meta.SetId())
        // 修改样式
        this.show_border(type)
        this.show_card(type)
        this.show_name(type)
        this.show_rare(type)
        this.show_more_count(type)
        this.show_bg_title(type)
        this.show_lock(type)
    }

    /** 直接reset,无id传入 */
    reset() {
        this.show_border("reset")
        this.show_card("reset")
        this.show_name("reset")
        this.show_rare("reset")
        this.show_more_count("reset")
        this.show_bg_title("reset")
        this.show_lock("reset")
    }

    /** @type {Node} */
    @property(Node)
    sp_border_normal: Node | null = null

    /** @type {Node} */
    @property(Node)
    sp_border_golden: Node | null = null

    /** @type {Node} */
    @property(Node)
    sp_border_subject: Node | null = null

    /** @type {Node} */
    @property(Node)
    sp_border_subject_f: Node | null = null

    onClose() {
        cce.releaseSpriteFrame(this.sp_card)
        cce.releaseSpriteFrame(this.sp_title_bg)
    }

    /**
     * @param {"check"|"no-check"|"reset"} type "check"表示根据实际状态验证;"no-check"表示跳过验证;"reset表示重置";
     */
    show_border(type) {
        switch (type) {
            default: case "check": case "no-check":
                let f = this.card_meta.Golden()
                if (this.sp_border_normal) { this.sp_border_normal.active = !f }
                if (this.sp_border_golden) { this.sp_border_golden.active = f }
                if(this.set_meta.IsActivityCard()){
                    if(!f){
                        if(this.sp_border_subject){this.sp_border_subject.active=true}
                        if(this.sp_border_subject_f){this.sp_border_subject_f.active=true}
                        if (this.sp_border_normal) { this.sp_border_normal.active = false }
                    }else{
                        if(this.sp_border_subject){this.sp_border_subject.active=false}
                        if(this.sp_border_subject_f){this.sp_border_subject_f.active=false}
                    }
                }else{
                    if(this.sp_border_subject){this.sp_border_subject.active=false}
                    if(this.sp_border_subject_f){this.sp_border_subject_f.active=false}
                }
                break;
            case "reset":   // "reset"状态下显示normal
                if (this.sp_border_normal) { this.sp_border_normal.active = true }
                if (this.sp_border_golden) { this.sp_border_golden.active = false }
                if(this.sp_border_subject){this.sp_border_subject.active=false}
                if(this.sp_border_subject_f){this.sp_border_subject_f.active=false}
                break;
        }
    }

    /** @type {Sprite} */
    @property(Sprite)
    sp_card: Sprite | null = null

    spf_reset_card: SpriteFrame | null = null // 默认的card

    /**
     * @param {"check"|"no-check"|"reset"} type "check"表示根据实际状态验证;"no-check"表示跳过验证;"reset表示重置";
     */
    show_card(type) {
        if (!this.sp_card) { return }
        if (!this.spf_reset_card) { this.spf_reset_card = this.sp_card.spriteFrame }
        let self=this
        const f = () => {
            let resName = `${C.BASE_PATH}/${self.set_meta.Res()}/${self.card_meta.Index()}`
            cce.loadRes(resName, SpriteFrame, (err: any, res: TrackedSpriteFrame | null) => {
                if (!err && res && self.sp_card && res._resName == resName) {
                    self.sp_card.spriteFrame = res
                }
            })
        }
        cce.releaseSpriteFrame(this.sp_card)
        this.sp_card.spriteFrame = this.spf_reset_card // 初始化
        if(this.set_meta.IsActivityCard()){
            //限时卡片的默认底图
            if(CommonAssets.instance.cardLimitSkinAssets.cardDiBg){
                this.sp_card.spriteFrame=CommonAssets.instance.cardLimitSkinAssets.cardDiBg
            }
        }
        switch (type) {
            default: case "check":
                Game.SUserCard.HaveCard(this.card_meta.Id()) && f()
                break;
            case "no-check":
                f()
                break;
            case "reset":
                break;
        }
    }

    /** @type {Label} Name() or Id() or Index() */
    @property(Label)
    label_name: Label | null = null

    /**
     * @param {"check"|"no-check"|"reset"} type "check"表示根据实际状态验证;"no-check"表示跳过验证;"reset表示重置";
     */
    show_name(type) {
        if (!this.label_name) { return }
        switch (type) {
            default: case "check": case "no-check":
                this.label_name.string = `${this.card_meta.Name()}`
                break;
            case "reset":
                this.label_name.string = ""
                break;
        }
    }

    /** @type {Sprite} */
    @property(Sprite)
    sp_title_bg: Sprite | null = null

    spf_reset_title_bg: SpriteFrame | null = null // 默认的title-bg

    /**
     * @param {"check"|"no-check"|"reset"} type "check"表示根据实际状态验证;"no-check"表示跳过验证;"reset表示重置";
     */
    show_bg_title(type) {
        if (!this.sp_title_bg) { return }
        if (!this.spf_reset_title_bg) { this.spf_reset_title_bg = this.sp_title_bg.spriteFrame }
        const f = () => {
            cce.loadRes(`${C.BASE_PATH}/common/${C.CARD_BG_FILENAME}_${this.set_meta.Color()}`, SpriteFrame, (err: any, res: SpriteFrame) => {
                cce.releaseSpriteFrame(this.sp_title_bg, res)
                if (!err && this.sp_title_bg) {
                    this.sp_title_bg.spriteFrame = res
                }
            })
        }
        this.sp_title_bg.spriteFrame = this.spf_reset_title_bg // 初始化
        switch (type) {
            default: case "check":
                Game.SUserCard.HaveCard(this.card_meta.Id()) && f()
                break;
            case "no-check":
                f()
                break;
            case "reset":
                break;
        }
    }

    /** @type {Layout} rare-star */
    @property(Layout)
    layout_rare: Layout | null = null

    /**
     * @param {"check"|"no-check"|"reset"} type "check"表示根据实际状态验证;"no-check"表示跳过验证;"reset表示重置";
     */
    show_rare(type) {
        if (!this.layout_rare) { return }
        switch (type) {
            default: case "check": case "no-check":
                this.layout_rare.node.children.forEach((node, index) => {
                    node.active = index < this.card_meta.Rare()
                })
                break;
            case "reset":
                this.layout_rare.node.children.forEach(node => {
                    node.active = false
                })
                break;
        }
    }

    /** @type {Label} 额外个数 */
    @property(Label)
    label_more_count: Label | null = null

    /**
     * @param {"check"|"no-check"|"reset"} type "check"表示根据实际状态验证;"no-check"表示跳过验证;"reset表示重置";
     */
    show_more_count(type) {
        if (!this.label_more_count) { return }
        switch (type) {
            default: case "check":
                let count_check = Game.SUserCard.CardNum(this.card_meta.Id())
                if (this.label_more_count.node.parent) { this.label_more_count.node.parent.active = count_check > 1 }
                this.label_more_count.string = `+${count_check - 1}`
                break;
            case "no-check": // 在"no-check"状态下,直接显示当前个数
                let count_no_check = Game.SUserCard.CardNum(this.card_meta.Id())
                if (this.label_more_count.node.parent) { this.label_more_count.node.parent.active = true }
                this.label_more_count.string = `${count_no_check}`
                break;
            case "reset":   // 在"reset"状态下,直接隐藏
                this.label_more_count.string = ""
                if (this.label_more_count.node.parent) { this.label_more_count.node.parent.active = false }
                break;
        }
    }

    /** @type {Label} */
    @property({ tooltip: "lock组件,以label为父节点", type: Label })
    label_lock: Label | null = null

    /**
     * @param {"check"|"no-check"|"reset"} type "check"表示根据实际状态验证;"no-check"表示跳过验证;"reset表示重置";
     */
    show_lock(type) {
        if (!this.label_lock) { return }
        switch (type) {
            default: case "check":
                if (Game.SUserVillage.MapId() < this.card_meta.MinVillage() && !Game.SUserCard.HaveCard(this.card_meta.Id())) {
                    this.label_lock.string = String.format(GameKit.i18n.t("CardAllSetWindowLock"), this.card_meta.MinVillage())
                    this.label_lock.node.active = true
                } else {
                    this.label_lock.node.active = false
                }
                break;
            case "no-check": case "reset":  // no-check和reset状态下直接隐藏
                this.label_lock.node.active = false
                break;
        }
    }

    show_joker() {
        this.joker = true
        if (this.sp_border_normal) { this.sp_border_normal.active = false }
        if (this.sp_border_golden) { this.sp_border_golden.active = false }
        if (this.sp_card) { new Game.Content(Game.Content.Types.Card, Game.Content.JokerCardId, 1).Icon(this.sp_card) }
        if (this.label_name) { this.label_name.node.active = false }
        if (this.sp_title_bg) { this.sp_title_bg.node.active = false }
        if (this.layout_rare) { this.layout_rare.node.active = false }
    }

}
