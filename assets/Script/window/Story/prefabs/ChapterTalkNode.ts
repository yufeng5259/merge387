import { _decorator, Color, Component, isValid, Label, LabelOutline, Node, Sprite, SpriteFrame } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('ChapterTalkNode')
export class ChapterTalkNode extends Component {
    @property(Node)
    public msgLbl: Node | Label | null = null;

    public nameLbl: Label | null = null;
    public userNode: Node | null = null;
    public bgsp: Node | null = null;
    public colorList: Color[] = [new Color().fromHEX('#D55482'), new Color().fromHEX('#349DE7'), new Color().fromHEX('#7D6FE3')];
    public outLineColorList: Color[] = [new Color().fromHEX('#D55482'), new Color().fromHEX('#3194D9'), new Color().fromHEX('#6555DB')];
    public storyMeta: any = null;
    public roleMeta: any = null;
    public eid: any = null;
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
        this.eid = this.storyMeta.EId();
        this.roleMeta = this.storyMeta.GetRoleMeata(this.eid);
        const sex = this.getRoleSex();
        this.updateTalkBubbleBg(sex);
        const msgLabel = this.msgLbl as Label;
        this.nameLbl.string = GameKit.i18n.sel(this.roleMeta.Name());
        msgLabel.string = GameKit.i18n.sel(this.storyMeta.StoryContent());
        this.updateTalkTextColor(sex);
        this.updateTalkNameOutline(this.nameLbl, sex);
        this.loadUrlPrefab();
    }

    public loadUrlPrefab() {
        if (!this.userNode || !this.roleMeta) return;
        const faceNode = this.getNodeInNode(this.userNode, 'faceNode');
        const face = faceNode?.getChildByName('face');
        if (!faceNode) {
            this.warning('ChapterTalkNode missing faceNode');
            return;
        }
        if (!face) {
            this.warning('ChapterTalkNode missing face');
            return;
        }
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
        const nameLabel = this.getLabelInNode(faceNode, 'name');
        if (nameLabel) {
            nameLabel.string = GameKit.i18n.sel(this.roleMeta.Name());
            this.updateTalkNameOutline(nameLabel, this.getRoleSex());
        }
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

    private updateTalkTextColor(sex: number) {
        const label = this.msgLbl as Label | null;
        const color = this.colorList[sex];
        if (label && color) label.color = color;
    }

    private updateTalkNameOutline(label: Label | null, sex: number) {
        const color = this.outLineColorList[sex];
        const outline = label?.node.getComponent(LabelOutline);
        if (outline && color) outline.color = color;
    }

    private updateTalkGenderStyle(faceNode: Node, sex: number) {
        this.loadGenderSprite(faceNode.getChildByName('avatar_frame'), `res/Town/FreeAvatarFrame_ui/nameBG${sex}`);
        this.loadGenderSprite(faceNode.getChildByName('BG'), `res/Town/FreeAvatarFrame_ui/avatar_frame_free${sex}`);
    }

    private loadGenderSprite(node: Node | null, path: string) {
        const sprite = node?.getComponent(Sprite);
        if (!node) return;
        if (!sprite) {
            this.warning(`ChapterTalkNode missing ${path} sprite`);
            return;
        }
        (node as any)._storyGenderResName = path;
        cce.loadRes(path, SpriteFrame, (err: any, frame: SpriteFrame) => {
            if (!isValid(node) || (node as any)._storyGenderResName !== path) return;
            if (err || !frame) {
                this.warning(err || `ChapterTalkNode load gender sprite failed: ${path}`);
                return;
            }
            sprite.spriteFrame = frame;
        });
    }

    private loadTalkAvatarSprite(faceItem: Node | null) {
        const sprite = faceItem?.getComponent(Sprite);
        const path = this.getAvatarResName(this.roleMeta?.Avatar?.());
        if (!faceItem || !path) return;
        if (!sprite) {
            this.warning('ChapterTalkNode missing avatar sprite');
            return;
        }
        this.updateTalkAvatarDirection(faceItem);
        (faceItem as any)._storyAvatarResName = path;
        sprite.spriteFrame = null;
        cce.loadRes(path, SpriteFrame, (err: any, frame: SpriteFrame) => {
            if (!isValid(faceItem) || (faceItem as any)._storyAvatarResName !== path) return;
            if (err || !frame) {
                this.warning(err || `ChapterTalkNode load avatar failed: ${path}`);
                return;
            }
            sprite.spriteFrame = frame;
        });
    }

    public updateTalkAvatarDirection(faceItem: Node | null) {
        if (!faceItem) return;
        faceItem.setScale(this.isLeft === false ? -1 : 1, faceItem.scale.y, faceItem.scale.z);
    }

    private getAvatarResName(avatar: any) {
        let path = String(avatar || '').replace(/\\/g, '/').replace(/\.(png|jpg|jpeg)$/i, '');
        if (!path || path.startsWith('res/')) return path;
        return path.includes('/') ? `res/${path}` : `res/Town/avatar/${path}`;
    }

    public getNodeInNode(root: Node | null, name: string): Node | null {
        if (!root || !name) return null;
        if (root.name === name) return root;
        for (const child of root.children) {
            const result = this.getNodeInNode(child, name);
            if (result) return result;
        }
        return null;
    }

    public getLabelInNode(root: Node | null, name: string): Label | null {
        return this.getNodeInNode(root, name)?.getComponent(Label) || null;
    }

    public warning(message: any) {
        if (typeof Logs !== 'undefined' && Logs.Warning) Logs.Warning(message);
    }
}
