import {
    _decorator,
    Button,
    Color,
    Component,
    EditBox,
    Label,
    LabelOutline,
    Mask,
    Node,
    RichText,
    ScrollBar,
    ScrollView,
    Sprite,
    SpriteFrame,
    UITransform,
    UIOpacity,
    Widget,
} from 'cc';

const { ccclass, executeInEditMode, menu, property } = _decorator;

declare const CC_EDITOR: boolean;
declare const Editor: any;

type AnyRecord = Record<string, any>;

const audioTypeS: AnyRecord = {
    0: 0,
    1: 3,
    2: 4,
    3: 1,
    8: 1,
};

const easeTypeS: AnyRecord = {
    0: 1,
    1: 2,
    2: 3,
    3: 4,
    4: 17,
    5: 18,
    6: 19,
    7: 2,
    8: 3,
    9: 4,
    10: 23,
    11: 24,
    12: 25,
    13: 29,
    14: 30,
    15: 31,
    16: 26,
    17: 27,
    18: 28,
    19: 5,
    20: 6,
    21: 7,
    22: 11,
    23: 12,
    24: 13,
    25: 14,
    26: 15,
    27: 16,
    28: 20,
    29: 21,
    30: 22,
    31: 8,
    32: 9,
    33: 10,
    34: 1,
};

const defCValues = ['_name', '_objFlags', 'node', '__scriptAsset', '_enabled', 'name', 'uuid', 'enabled', 'enabledInHierarchy', '_isOnLoadCalled', '_windowName'];
const ignoreNodeName = ['RICHTEXT_CHILD', 'BACKGROUND_SPRITE', 'TEXT_LABEL', 'PLACEHOLDER_LABEL'];

function hasText(value: string, pattern: string) {
    return value.indexOf(pattern) !== -1;
}

function getTransform(node: Node) {
    return node.getComponent(UITransform);
}

function getOpacity(node: Node) {
    return node.getComponent(UIOpacity)?.opacity ?? 255;
}

function getRenderableColor(node: Node) {
    const sprite = node.getComponent(Sprite);
    if (sprite) return sprite.color;
    const label = node.getComponent(Label);
    if (label) return label.color;
    const richText = node.getComponent(RichText);
    if (richText) return richText.fontColor;
    return Color.WHITE;
}

function getComponentProps(component: any): string[] {
    const ctor = component?.constructor;
    return ctor?.__props__ || ctor?.prototype?.constructor?.__props__ || [];
}

function isSpriteFrame(value: any): value is SpriteFrame {
    return value instanceof SpriteFrame || value?.constructor?.name === 'cc_SpriteFrame' || value?.constructor?.name === 'SpriteFrame';
}

function getAssetUuid(asset: any) {
    return asset?.uuid || asset?._uuid || asset?.texture?.uuid || asset?.getTexture?.()?.uuid || asset?.getTexture?.()?._uuid || '';
}

function normalizeAssetUrl(url: string) {
    return url ? url.replace('db://assets/', '') : '';
}

async function queryAssetUrlByUuid(uuid: string): Promise<string> {
    if (!uuid || typeof Editor === 'undefined') return '';
    if (Editor.assetdb?.queryUrlByUuid) {
        return new Promise((resolve) => {
            Editor.assetdb.queryUrlByUuid(uuid, (_: any, res: string) => resolve(normalizeAssetUrl(res)));
        });
    }
    if (Editor.Message?.request) {
        const url = await Editor.Message.request('asset-db', 'query-url', uuid);
        return normalizeAssetUrl(url);
    }
    return '';
}

@ccclass('TUIPrefabToJson')
@menu('Ex-Tools/TUIPrefabToJson')
@executeInEditMode
export class TUIPrefabToJson extends Component {
    @property
    public read = false;

    @property
    public readComponent = false;

    private rpn = 0;
    private rpnI: ReturnType<typeof setInterval> | null = null;

    public start() {

    }

    public update() {
        if (typeof CC_EDITOR !== 'undefined' && CC_EDITOR && this.read) {
            this.read = false;
            this.exportWindow();
        }
        if (typeof CC_EDITOR !== 'undefined' && CC_EDITOR && this.readComponent) {
            this.readComponent = false;
            this.exportComponent();
        }
    }

    private exportWindow() {
        this.rpn = 0;
        const children = this.toJson();
        const props: any[] = [];
        const sprites: any[] = [];
        const wnd = this.node.getComponent('UIWindow') as any;
        if (wnd) this.collectComponentRefs(wnd, props, sprites);

        this.waitPending(() => {
            if (typeof Editor !== 'undefined') Editor.log(JSON.stringify({ name: wnd ? wnd.constructor?.name || this.node.name : this.node.name, props, sprites, children }));
        });
    }

    private exportComponent() {
        this.rpn = 0;
        const props: any[] = [];
        const sprites: any[] = [];
        const wnd = this.node.components.find((component) => component !== this) as any;
        if (wnd) this.collectComponentRefs(wnd, props, sprites);

        this.waitPending(() => {
            if (typeof Editor !== 'undefined') Editor.log(JSON.stringify({ name: wnd ? wnd.constructor?.name || this.node.name : this.node.name, props, sprites }));
        });
    }

    private collectComponentRefs(component: any, props: any[], sprites: any[]) {
        getComponentProps(component).forEach((key) => {
            const value = component[key];
            if (defCValues.includes(key) || !value) return;

            if (Array.isArray(value)) {
                value.forEach((item, index) => {
                    this.collectComponentRefValue(key + (index + 1).toString(), item, props, sprites);
                });
            } else {
                this.collectComponentRefValue(key, value, props, sprites);
            }
        });
    }

    private collectComponentRefValue(key: string, value: any, props: any[], sprites: any[]) {
        if (isSpriteFrame(value)) {
            this.rpn++;
            queryAssetUrlByUuid(getAssetUuid(value)).then((url) => {
                sprites.push({ key, node: url });
                this.rpn--;
            });
        } else if (value && value.node) {
            props.push({ key, node: this.nodeParentPath(value.node) });
        }
    }

    private waitPending(cb: () => void) {
        this.rpnI = setInterval(() => {
            if (this.rpn === 0) {
                if (this.rpnI) clearInterval(this.rpnI);
                this.rpnI = null;
                cb();
            }
        }, 200);
    }

    public toJson() {
        const records: AnyRecord[] = [];

        const recordOne = (node: Node, parent?: AnyRecord) => {
            if (ignoreNodeName.includes(node.name) || hasText(node.name, '_TwoColor_child') || hasText(node.name, '_LabelShadow_child_')) return null;
            const transform = getTransform(node);
            const scale = node.scale;
            const record: AnyRecord = {};
            record.name = node.name;
            record.active = node.active;
            record.x = node.position.x;
            record.y = node.position.y;
            record.rotation = -node.angle;
            record.scaleX = scale.x;
            record.scaleY = scale.y;
            record.anchorX = transform ? transform.anchorX : 0.5;
            record.anchorY = transform ? transform.anchorY : 0.5;
            record.width = transform ? transform.width : 0;
            record.height = transform ? transform.height : 0;
            record.color = this.recordColor(getRenderableColor(node));
            record.opacity = getOpacity(node);

            this.recordWidget(node, record);
            this.recordLabel(node, record);
            this.recordSprite(node, record);
            this.recordEditBox(node, record);
            this.recordButton(node, record);
            this.recordMask(node, record);
            this.recordCustomComponents(node, record);
            this.recordScroll(node, record);
            this.recordTabs(node, record);
            this.recordAnims(node, record);

            if (!parent) records.push(record);
            else parent.children.push(record);
            return record;
        };

        const recordNode = (node: Node, parent?: AnyRecord) => {
            node.children.forEach((child) => {
                const record = recordOne(child, parent);
                if (record && child.children.length > 0) {
                    record.children = [];
                    if (ignoreNodeName.includes(node.name) || hasText(node.name, '_TwoColor_child') || hasText(node.name, '_LabelShadow_child_')) return;
                    recordNode(child, record);
                }
            });
        };

        recordNode(this.node);

        return records;
    }

    private recordWidget(node: Node, out: AnyRecord) {
        const widget = node.getComponent(Widget);
        if (!widget) return;

        out.widget = {};
        widget.target = node.parent;
        out.widget.enableTop = widget.isAlignTop;
        out.widget.enableBottom = widget.isAlignBottom;
        out.widget.enableLeft = widget.isAlignLeft;
        out.widget.enableRight = widget.isAlignRight;
        out.widget.top = Math.round(widget.top * 100) / 100;
        out.widget.bottom = Math.round(widget.bottom * 100) / 100;
        out.widget.left = Math.round(widget.left * 100) / 100;
        out.widget.right = Math.round(widget.right * 100) / 100;
    }

    private recordLabel(node: Node, out: AnyRecord) {
        const label = node.getComponent(Label) || node.getComponent(RichText);
        if (!label) return;

        out.label = {};
        if (node.getComponent(RichText)) out.label.richText = true;
        out.label.string = label.string;
        out.label.fontSize = label.fontSize;
        out.label.lineHeight = Math.round(label.lineHeight * 100 / label.fontSize) / 100;
        const hAlign = (label as any).horizontalAlign || 0;
        const vAlign = (label as any).verticalAlign || 0;
        out.label.alignment = hAlign + vAlign * 3;
        if (out.label.richText) out.label.alignment = hAlign + 3;
        out.label.overflow = (label as any).overflow;

        const labelOutline = node.getComponent(LabelOutline);
        if (labelOutline) {
            out.label.outline = {};
            out.label.outline.color = this.recordColor(labelOutline.color);
            out.label.outline.width = labelOutline.width / 2;
        }

        const labelShadow = node.getComponent('LabelShadow') as any;
        if (labelShadow) {
            out.label.shadow = {};
            out.label.shadow.color = this.recordColor(labelShadow.color);
            out.label.shadow.opacity = labelShadow.opacity;
            out.label.shadow.dx = labelShadow.dx;
            out.label.shadow.dy = labelShadow.dy;
        }

        const labelTwoColor = node.getComponent('LabelTwoColor') as any;
        if (labelTwoColor) {
            out.label.labelTwoColor = {};
            out.label.labelTwoColor.colorBottom = this.recordColor(labelTwoColor.colorTo);
        }

        const labelLocalized = node.getComponent('LabelLocalized') as any;
        if (labelLocalized) {
            out.label.labelLocalized = {};
            out.label.labelLocalized.key = labelLocalized.textKey;
            out.label.labelLocalized.isBold = labelLocalized.isBold;
        }

        if (out.label.richText) {
            const maxLines = node.getComponent('CCLabelMaxLines') as any;
            if (maxLines) out.label.maxLines = maxLines.maxLines;
        }
    }

    private recordSprite(node: Node, out: AnyRecord) {
        const sprite = node.getComponent(Sprite);
        if (!sprite) return;

        out.sprite = {};
        if (sprite.spriteFrame) {
            this.rpn++;
            queryAssetUrlByUuid(getAssetUuid(sprite.spriteFrame)).then((url) => {
                out.sprite.image = url;
                this.rpn--;
            });
        }
        out.sprite.type = sprite.type;
    }

    private recordEditBox(node: Node, out: AnyRecord) {
        const editBox = node.getComponent(EditBox);
        if (!editBox) return;

        const textLabel = editBox.textLabel;
        const placeholderLabel = editBox.placeholderLabel;
        const fontSize = textLabel ? textLabel.fontSize : 0;
        const lineHeight = textLabel ? textLabel.lineHeight : fontSize;

        out.editBox = {};
        out.editBox.fontSize = fontSize;
        out.editBox.lineHeight = fontSize > 0 ? Math.round(lineHeight * 100 / fontSize) / 100 : 0;
        out.editBox.fontColor = this.recordColor(textLabel ? textLabel.color : Color.WHITE);
        out.editBox.placeholder = editBox.placeholder;
        out.editBox.placeholderFontSize = placeholderLabel ? placeholderLabel.fontSize : 0;
        out.editBox.placeholderFontColor = this.recordColor(placeholderLabel ? placeholderLabel.color : Color.WHITE);
        out.editBox.maxLength = editBox.maxLength;
        out.editBox.textChanged = '';
        editBox.textChanged.forEach((item) => {
            out.editBox.textChanged += item.handler + ':' + item.customEventData + ';';
        });
        out.editBox.editingDidEnded = '';
        editBox.editingDidEnded.forEach((item) => {
            out.editBox.editingDidEnded += item.handler + ':' + item.customEventData + ';';
        });
    }

    private recordButton(node: Node, out: AnyRecord) {
        const button = node.getComponent(Button);
        if (!button) return;

        out.button = {};
        if (button.clickEvents.length > 0) {
            out.button.events = '';
            button.clickEvents.forEach((item) => {
                out.button.events += item.handler + ':' + item.customEventData + ';';
            });
        }
        out.button.interactable = button.interactable;
    }

    private recordMask(node: Node, out: AnyRecord) {
        const mask = node.getComponent(Mask);
        if (!mask) return;

        out.mask = {};
        if (mask.spriteFrame) {
            this.rpn++;
            queryAssetUrlByUuid(getAssetUuid(mask.spriteFrame)).then((url) => {
                out.mask.spriteFrame = url;
                this.rpn--;
            });
        }
    }

    private recordCustomComponents(node: Node, out: AnyRecord) {
        if (node.getComponent('LongScreenFit')) out.LongScreenFit = true;

        const playAudio = node.getComponent('PlayAudio') as any;
        if (playAudio) {
            out.PlayAudio = {};
            out.PlayAudio.audioType = audioTypeS[playAudio.audioType];
            out.PlayAudio.trigger = playAudio.trigger;
        }

        const controllerTable = node.getComponent('ControllerTable') as any;
        if (controllerTable) {
            out.ControllerTable = {};
            controllerTable.controllers.forEach((item: Node) => {
                if (item) out.ControllerTable[item.name] = this.nodeParentPath(item);
            });
            controllerTable.keyControllers.forEach((item: any) => {
                if (item.key) out.ControllerTable[item.key] = this.nodeParentPath(item.node);
            });
        }

        this.recordControllerTableFields(node, out, 'UserInfoModel', [
            'avatarSprite', 'labelName', 'labelAp', 'spriteApFull', 'labelApFull', 'labelApRemain', 'energyFullAnim',
            'btnApAdd', 'labelCoin', 'btnCoinAdd', 'spriteCoin', 'labelStar', 'shields', 'spVip',
        ]);
        this.recordControllerTableFields(node, out, 'ContentModel', [
            'icon', 'count', 'countBignum', 'countX', 'countWithColor', 'labelName', 'desc',
        ]);
        this.recordControllerTableFields(node, out, 'CardModel', [
            'sp_border_normal', 'sp_border_golden', 'sp_card', 'label_name', 'sp_title_bg', 'layout_rare', 'label_more_count', 'label_lock',
        ]);

        const enterCloseAnim = node.getComponent('EnterCloseAnim') as any;
        if (enterCloseAnim) {
            out.EnterCloseAnim = {};
            out.EnterCloseAnim.enterAnimType = enterCloseAnim.enterAnimType;
            out.EnterCloseAnim.e_playAwake = enterCloseAnim.e_playAwake;
            out.EnterCloseAnim.e_AnimTime = enterCloseAnim.e_AnimTime;
            out.EnterCloseAnim.e_DelayTime = enterCloseAnim.e_DelayTime;
            out.EnterCloseAnim.e_easeType = easeTypeS[enterCloseAnim.e_easeType];
            out.EnterCloseAnim.e_alpha = enterCloseAnim.e_alpha;
            out.EnterCloseAnim.e_scaleX = enterCloseAnim.e_scale.x;
            out.EnterCloseAnim.e_scaleY = enterCloseAnim.e_scale.y;
            out.EnterCloseAnim.e_dx = enterCloseAnim.e_dx;
            out.EnterCloseAnim.e_dy = enterCloseAnim.e_dy;
            out.EnterCloseAnim.e_width = enterCloseAnim.e_width;
            out.EnterCloseAnim.e_height = enterCloseAnim.e_height;
            out.EnterCloseAnim.e_rotAngle = enterCloseAnim.e_rotAngle;
            out.EnterCloseAnim.closeAnimType = enterCloseAnim.closeAnimType;
            out.EnterCloseAnim.c_AnimTime = enterCloseAnim.c_AnimTime;
            out.EnterCloseAnim.c_DelayTime = enterCloseAnim.c_DelayTime;
            out.EnterCloseAnim.c_easeType = easeTypeS[enterCloseAnim.c_easeType];
            out.EnterCloseAnim.c_alpha = enterCloseAnim.c_alpha;
            out.EnterCloseAnim.c_scaleX = enterCloseAnim.c_scale.x;
            out.EnterCloseAnim.c_scaleY = enterCloseAnim.c_scale.y;
            out.EnterCloseAnim.c_dx = enterCloseAnim.c_dx;
            out.EnterCloseAnim.c_dy = enterCloseAnim.c_dy;
            out.EnterCloseAnim.c_width = enterCloseAnim.c_width;
            out.EnterCloseAnim.c_height = enterCloseAnim.c_height;
            out.EnterCloseAnim.c_rotAngle = enterCloseAnim.c_rotAngle;
        }

        if (node.getComponent('ScrollViewItem')) out.ScrollViewItem = true;

        const scrollViewTool = node.getComponent('ScrollViewTool') as any;
        if (scrollViewTool) {
            out.ScrollViewTool = {};
            out.ScrollViewTool.item = this.nodeParentPath(scrollViewTool.item.node);
            out.ScrollViewTool.startPos = scrollViewTool.startPos;
            out.ScrollViewTool.maxReuse = scrollViewTool.maxReuse;
            out.ScrollViewTool.centerOnChild = scrollViewTool.centerOnChild;
            out.ScrollViewTool.testNumber = scrollViewTool.testNumber;
        }
    }

    private recordControllerTableFields(node: Node, out: AnyRecord, componentName: string, fields: string[]) {
        const comp = node.getComponent(componentName) as any;
        if (!comp) return;

        out.ControllerTable = out.ControllerTable || {};
        fields.forEach((field) => {
            if (comp[field]) out.ControllerTable[field] = this.nodeParentPath(comp[field].node);
        });
    }

    private recordScroll(node: Node, out: AnyRecord) {
        const scrollView = node.getComponent(ScrollView);
        if (scrollView) {
            out.scrollView = {};
            out.scrollView.content = this.nodeParentPath(scrollView.content);
            out.scrollView.horizontal = scrollView.horizontal;
            out.scrollView.vertical = scrollView.vertical;
            out.scrollView.inertia = scrollView.inertia;
            out.scrollView.brake = scrollView.brake;
            out.scrollView.elastic = scrollView.elastic;
            out.scrollView.bounceDuration = scrollView.bounceDuration;
            out.scrollView.horizontalScrollBar = this.nodeParentPath(scrollView.horizontalScrollBar ? scrollView.horizontalScrollBar.node : null);
            out.scrollView.horizontalScrollBarAutoHide = scrollView.horizontalScrollBar ? scrollView.horizontalScrollBar.enableAutoHide : false;
            out.scrollView.verticalScrollBar = this.nodeParentPath(scrollView.verticalScrollBar ? scrollView.verticalScrollBar.node : null);
            out.scrollView.verticalScrollBarAutoHide = scrollView.verticalScrollBar ? scrollView.verticalScrollBar.enableAutoHide : false;
            out.scrollView.scrollEvents = '';
            scrollView.scrollEvents.forEach((item) => {
                out.scrollView.scrollEvents += item.handler + ':' + item.customEventData + ';';
            });
        }

        const scrollbar = node.getComponent(ScrollBar);
        if (scrollbar) {
            out.scrollbar = {};
            out.scrollbar.direction = scrollbar.direction;
            out.scrollbar.handle = this.nodeParentPath(scrollbar.handle ? scrollbar.handle.node : null);
        }
    }

    private recordTabs(node: Node, out: AnyRecord) {
        const tabContainer = node.getComponent('UITabContainer') as any;
        if (tabContainer) {
            out.UITabContainer = {};
            out.UITabContainer.tabs = '';
            tabContainer.tabs.forEach((item: any) => {
                out.UITabContainer.tabs += this.nodeParentPath(item.node) + ';';
            });
        }

        const tabNode = node.getComponent('UITabNode') as any;
        if (tabNode) {
            out.UITabNode = {};
            out.UITabNode.enabledNode = this.nodeParentPath(tabNode.enabledNode.node);
            out.UITabNode.disabledNode = this.nodeParentPath(tabNode.disabledNode.node);
        }
    }

    private recordAnims(node: Node, out: AnyRecord) {
        const blinkAnim = node.getComponent('BlinkAnim') as any;
        if (blinkAnim) {
            out.blinkAnim = {};
            out.blinkAnim.minAlpha = blinkAnim.minAlpha;
            out.blinkAnim.maxAlpha = blinkAnim.maxAlpha;
            out.blinkAnim.duration = blinkAnim.duration;
            out.blinkAnim.delay = blinkAnim.delay;
        }

        const moveAnim = node.getComponent('MoveAnim') as any;
        if (moveAnim) {
            out.moveAnim = {};
            out.moveAnim.dis = moveAnim.dis;
            out.moveAnim.disx = moveAnim.disx;
            out.moveAnim.time = moveAnim.time;
            out.moveAnim.delay = moveAnim.delay;
        }

        const loopMoveAnim = node.getComponent('LoopMoveAnim') as any;
        if (loopMoveAnim) {
            out.loopMoveAnim = {};
            out.loopMoveAnim.disy = loopMoveAnim.disy;
            out.loopMoveAnim.disx = loopMoveAnim.disx;
            out.loopMoveAnim.time = loopMoveAnim.time;
            out.loopMoveAnim.delay = loopMoveAnim.delay;
        }

        const rotateAnim = node.getComponent('RotateAnim') as any;
        if (rotateAnim) {
            out.rotateAnim = {};
            out.rotateAnim.time = rotateAnim.time;
            out.rotateAnim.delay = rotateAnim.delay;
            out.rotateAnim.clockwise = !rotateAnim.clockwise;
            out.rotateAnim.outDegree = rotateAnim.outDegree;
            out.rotateAnim.step = rotateAnim.step;
        }

        const scaleAnim = node.getComponent('ScaleAnim') as any;
        if (scaleAnim) {
            out.scaleAnim = {};
            out.scaleAnim.time = scaleAnim.time;
            out.scaleAnim.delay = scaleAnim.delay;
            out.scaleAnim.minX = scaleAnim.minX;
            out.scaleAnim.maxX = scaleAnim.maxX;
            out.scaleAnim.minY = scaleAnim.minY;
            out.scaleAnim.maxY = scaleAnim.maxY;
        }

        const shakeAnim = node.getComponent('ShakeAnim') as any;
        if (shakeAnim) {
            out.shakeAnim = {};
            out.shakeAnim.time = shakeAnim.time;
            out.shakeAnim.delay = Math.max(shakeAnim.delay, shakeAnim.wait);
            out.shakeAnim.degree = shakeAnim.degree;
        }

        const numAnim = node.getComponent('NumAnim') as any;
        if (numAnim) {
            out.numAnim = {};
            out.numAnim.time = numAnim.duration;
            out.numAnim.fromValue = numAnim.fromValue;
            out.numAnim.toValue = numAnim.toValue;
            out.numAnim.playTime = numAnim.playTime;
            out.numAnim.currentValue = numAnim.currentValue;
        }
    }

    public colorSame(c1: AnyRecord, c2: AnyRecord) {
        return c1.r === c2.r && c1.g === c2.g && c1.b === c2.b;
    }

    public parseColor(c: AnyRecord) {
        return [c.r, c.g, c.b];
    }

    public recordColor(c: Color) {
        return { r: c.r, g: c.g, b: c.b };
    }

    public nodeParentPath(node: Node | null) {
        if (node == null) return '';
        let path = '';
        let current: Node | null = node;
        while (current && current !== this.node) {
            path = path.length === 0 ? current.name : current.name + '/' + path;
            current = current.parent;
        }
        return path;
    }
}
