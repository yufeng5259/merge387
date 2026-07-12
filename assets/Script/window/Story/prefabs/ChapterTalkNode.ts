import { _decorator, Color, Component, isValid, Label, Node, Sprite, SpriteFrame } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('ChapterTalkNode')
export class ChapterTalkNode extends Component {
    @property(Node)
    public msgLbl: Node | Label | null = null;

    public nameLbl: Label | null = null;
    public userNode: Node | null = null;
    public bgsp: Node | null = null;
    public colorList: Color[] = [new Color().fromHEX('#D55482'), new Color().fromHEX('#349DE7'), new Color().fromHEX('#7D6FE3')];
    public storyMeta: any = null;
    public roleMeta: any = null;
    public isLeft = true;

    public start() { this.init(); }

    public init() {
        this.msgLbl = GameKit.ControllerTable.GetNode(this.node, 'msgLbl').getComponent(Label);
        this.nameLbl = GameKit.ControllerTable.GetNode(this.node, 'nameLbl').getComponent(Label);
        this.userNode = GameKit.ControllerTable.GetNode(this.node, 'userNode');
        this.bgsp = GameKit.ControllerTable.GetNode(this.node, 'bgNode');
    }

    public showInfo(data: any, isLeft = true) {
        this.init();
        GameKit.SoundManager?.playDialoguePopSound?.();
        this.storyMeta = data;
        this.isLeft = isLeft;
        this.roleMeta = this.storyMeta.GetRoleMeata(this.storyMeta.EId());
        const sex = this.getRoleSex();
        this.updateTalkBubbleBg(sex);
        const msgLabel = this.msgLbl as Label;
        msgLabel.color = this.colorList[sex];
        this.nameLbl.string = GameKit.i18n.sel(this.roleMeta.Name());
        msgLabel.string = GameKit.i18n.sel(this.storyMeta.StoryContent());
        this.loadUrlPrefab();
    }

    public loadUrlPrefab() {
        if (!this.userNode || !this.roleMeta) return;
        const faceNode = this.findChild(this.userNode, 'faceNode');
        const face = faceNode?.getChildByName('face');
        if (!faceNode || !face) return;
        const expressionType = this.roleMeta.EType();
        let faceItem: Node | null = null;
        for (let i = 1; i < 6; i++) {
            const item = face.getChildByName(String(i));
            if (item) {
                item.active = expressionType === i;
                if (item.active) faceItem = item;
            }
        }
        this.loadTalkAvatarSprite(faceItem || face.getChildByName('1'));
        const nameLabel = this.findChild(faceNode, 'name')?.getComponent(Label);
        if (nameLabel) nameLabel.string = GameKit.i18n.sel(this.roleMeta.Name());
        this.updateTalkGenderStyle(faceNode, this.getRoleSex());
    }

    private getRoleSex() {
        const sex = Number(this.roleMeta?.Sex?.());
        return Number.isFinite(sex) && sex >= 0 && sex <= 2 ? sex : 0;
    }

    private updateTalkBubbleBg(sex: number) {
        for (let i = 0; i < 3; i++) {
            const bg = this.bgsp?.getChildByName(`bg${i}`);
            if (bg) bg.active = sex === i;
        }
    }

    private updateTalkGenderStyle(faceNode: Node, sex: number) {
        this.loadGenderSprite(faceNode.getChildByName('avatar_frame'), `res/Town/FreeAvatarFrame_ui/nameBG${sex}`);
        this.loadGenderSprite(faceNode.getChildByName('BG'), `res/Town/FreeAvatarFrame_ui/avatar_frame_free${sex}`);
    }

    private loadGenderSprite(node: Node | null, path: string) {
        const sprite = node?.getComponent(Sprite);
        if (!node || !sprite) return;
        (node as any)._storyGenderResName = path;
        cce.loadRes(path, SpriteFrame, (err: any, frame: SpriteFrame) => {
            if (!isValid(node) || (node as any)._storyGenderResName !== path || err || !frame) return;
            sprite.spriteFrame = frame;
        });
    }

    private loadTalkAvatarSprite(faceItem: Node | null) {
        const sprite = faceItem?.getComponent(Sprite);
        const path = this.getAvatarResName(this.roleMeta?.Avatar?.());
        if (!faceItem || !sprite || !path) return;
        faceItem.setScale(this.isLeft === false ? -Math.abs(faceItem.scale.x) : Math.abs(faceItem.scale.x), faceItem.scale.y, faceItem.scale.z);
        (faceItem as any)._storyAvatarResName = path;
        sprite.spriteFrame = null;
        cce.loadRes(path, SpriteFrame, (err: any, frame: SpriteFrame) => {
            if (!isValid(faceItem) || (faceItem as any)._storyAvatarResName !== path || err || !frame) return;
            sprite.spriteFrame = frame;
        });
    }

    private getAvatarResName(avatar: any) {
        let path = String(avatar || '').replace(/\\/g, '/').replace(/\.(png|jpg|jpeg)$/i, '');
        if (!path || path.startsWith('res/')) return path;
        return path.includes('/') ? `res/${path}` : `res/Town/avatar/${path}`;
    }

    private findChild(root: Node, name: string): Node | null {
        if (root.name === name) return root;
        for (const child of root.children) {
            const result = this.findChild(child, name);
            if (result) return result;
        }
        return null;
    }
}
