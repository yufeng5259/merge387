import { _decorator, Component, LabelOutline, Node, RichText, Sprite, SpriteFrame, UITransform } from 'cc';
import { EDITOR } from 'cc/env';

const { ccclass, executeInEditMode, menu, property } = _decorator;

@ccclass('CardLimitSubjectOpenWindowTester')
@menu('Editor-Tools/ActivityGameShowTester')
@executeInEditMode
export class CardLimitSubjectOpenWindowTester extends Component {
    @property([Node])
    public nodes: Node[] = [];

    @property(Sprite)
    public spBg: Sprite | null = null;

    @property
    public readStr = '';

    @property
    get reset() {
        return false;
    }

    set reset(_value: boolean) {
        if (EDITOR) {
            this.readStrShow();
        }
    }

    @property
    public ImageURL = '';

    @property
    public pack = '';

    @property
    public sets = '';

    @property
    get checkUpdate() {
        return false;
    }

    set checkUpdate(_value: boolean) {
        if (EDITOR) {
            this.checkAndUpdate();
        }
    }

    @property
    public newStr = '';

    public metaParam: any = {};

    public readStrShow() {
        this.metaParam = {};
        if (this.readStr !== '') {
            this.metaParam = JSON.parse(this.readStr);
        }

        this.newStr = '';
        this.nodes.forEach((node) => {
            CCTools.SetNodeByParam(node, this.metaParam[node.name]);
        });

        if (this.metaParam.pack) {
            this.pack = JSON.stringify(this.metaParam.pack);
        }

        if (this.metaParam.sets) {
            this.sets = JSON.stringify(this.metaParam.sets);
        }
    }

    public checkAndUpdate() {
        this.showBg();
        this.getParams();
    }

    public showBg() {
        const url = this.ImageURL;
        if (url === '') {
            return;
        }

        const resName = `res/Activity/images/${url}`;
        cce.loadRes(resName, SpriteFrame, (err: any, spriteFrame: SpriteFrame) => {
            if (err) {
                console.error(err.message || err);
                return;
            }
            if (this.spBg) {
                this.spBg.spriteFrame = spriteFrame;
            }
        });
    }

    public getParams() {
        const dt: any = {};
        if (this.pack === '') {
            console.warn('pack is empty');
            return;
        }
        dt.pack = JSON.parse(this.pack);

        if (this.sets === '') {
            console.warn('sets is empty');
            return;
        }
        dt.sets = JSON.parse(this.sets);

        dt.ui = {};
        this.nodes.forEach((node) => {
            if (!dt.ui[node.name]) {
                dt.ui[node.name] = {};
            }
            this.GetNodeParam(node, dt.ui[node.name]);
        });
        this.newStr = JSON.stringify(dt);
    }

    public GetNodeParam(node: Node, obj: any) {
        obj.x = node.position.x;
        obj.y = node.position.y;

        const richText = node.getComponent(RichText);
        if (richText) {
            const transform = node.getComponent(UITransform);
            obj.width = transform ? transform.width : 0;
            obj.height = transform ? transform.height : 0;
            if (!obj.label) {
                obj.label = {};
            }
            obj.label.fontSize = richText.fontSize;
            obj.label.maxWidth = richText.maxWidth;
            obj.label.string = richText.string;
        }

        const labelOutline = node.getComponent(LabelOutline);
        if (labelOutline) {
            const color = labelOutline.color;
            obj.outline = {
                color: [color.r, color.g, color.b],
                width: labelOutline.width,
            };
        }
    }
}
