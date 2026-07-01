import { _decorator, Color, Component, Label, LabelOutline, Node, RichText, Sprite, UITransform, UIOpacity } from 'cc';

const { ccclass, executeInEditMode, menu, property } = _decorator;

declare const CC_EDITOR: boolean;
declare const Editor: any;
declare const CCTools: any;

type AnyRecord = Record<string, any>;

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

@ccclass('TActivityPanelGetNodes')
@menu('Editor-Tools/TActivityPanelGetNodes')
@executeInEditMode
export class TActivityPanelGetNodes extends Component {
    @property
    public record = false;

    @property
    public check = false;

    @property
    public readStr = '';

    @property
    public read = false;

    private records: AnyRecord = {};

    public start() {

    }

    public update() {
        if (typeof CC_EDITOR !== 'undefined' && CC_EDITOR && this.record) {
            this.record = false;
            this.records = this.recordList();
        }
        if (typeof CC_EDITOR !== 'undefined' && CC_EDITOR && this.check) {
            this.check = false;
            this.outputList();
        }
        if (typeof CC_EDITOR !== 'undefined' && CC_EDITOR && this.read) {
            this.read = false;
            try {
                const param = JSON.parse(this.readStr);
                const rawNames: string[] = [];
                const recNode = (node: Node) => {
                    node.children.forEach((child) => {
                        CCTools.SetNodeByParam(child, param[child.name]);
                        rawNames.push(child.name);
                        if (child.children.length > 0) recNode(child);
                    });
                };
                recNode(this.node);

                for (const name in param) {
                    if (rawNames.includes(name)) continue;
                    const node = new Node(name);
                    this.node.addChild(node);
                    CCTools.SetNodeByParam(node, param[name]);
                }
            } catch (e) {
                if (typeof Editor !== 'undefined') Editor.log(e);
            }
        }
    }

    public recordList() {
        const records: AnyRecord = {};

        const recordOne = (node: Node) => {
            if (node.name === 'RICHTEXT_CHILD' || hasText(node.name, '_TwoColor_child') || hasText(node.name, '_LabelShadow_child_')) return;
            const transform = getTransform(node);
            const scale = node.scale;
            const record: AnyRecord = {};
            record.active = node.active;
            record.x = node.position.x;
            record.y = node.position.y;
            record.rotation = node.angle;
            record.anchorX = transform ? transform.anchorX : 0.5;
            record.anchorY = transform ? transform.anchorY : 0.5;
            record.skewX = 0;
            record.skewY = 0;
            record.scaleX = scale.x;
            record.scaleY = scale.y;
            record.width = transform ? transform.width : 0;
            record.height = transform ? transform.height : 0;
            record.color = this.recordColor(getRenderableColor(node));
            record.opacity = getOpacity(node);

            const label = node.getComponent(Label) || node.getComponent(RichText);
            if (label) {
                record.label = {};
                record.label.string = label.string;
                record.label.fontSize = label.fontSize;
                record.label.lineHeight = label.lineHeight;
                record.label.maxWidth = (label as any).maxWidth || 0;
                record.label.maxLines = (label as any).maxLines || 0;

                const labelOutline = node.getComponent(LabelOutline);
                if (labelOutline) {
                    record.outline = {};
                    record.outline.color = this.recordColor(labelOutline.color);
                    record.outline.width = labelOutline.width;
                }
                const labelShadow = node.getComponent('LabelShadow') as any;
                if (labelShadow) {
                    record.shadow = {};
                    record.shadow.color = this.recordColor(labelShadow.color);
                    record.shadow.opacity = labelShadow.opacity;
                    record.shadow.dx = labelShadow.dx;
                    record.shadow.dy = labelShadow.dy;
                }
            }

            const sprite = node.getComponent(Sprite);
            if (sprite && sprite.spriteFrame) {
                record.sprite = {};
                record.sprite.image = sprite.spriteFrame.name;
            }

            const blinkAnim = node.getComponent('BlinkAnim') as any;
            if (blinkAnim) {
                record.blinkAnim = {};
                record.blinkAnim.minAlpha = blinkAnim.minAlpha;
                record.blinkAnim.maxAlpha = blinkAnim.maxAlpha;
                record.blinkAnim.duration = blinkAnim.duration;
                record.blinkAnim.delay = blinkAnim.delay;
            }

            const moveAnim = node.getComponent('MoveAnim') as any;
            if (moveAnim) {
                record.moveAnim = {};
                record.moveAnim.dis = moveAnim.dis;
                record.moveAnim.disx = moveAnim.disx;
                record.moveAnim.time = moveAnim.time;
                record.moveAnim.delay = moveAnim.delay;
            }

            const loopMoveAnim = node.getComponent('LoopMoveAnim') as any;
            if (loopMoveAnim) {
                record.loopMoveAnim = {};
                record.loopMoveAnim.dis = loopMoveAnim.dis;
                record.loopMoveAnim.disx = loopMoveAnim.disx;
                record.loopMoveAnim.time = loopMoveAnim.time;
                record.loopMoveAnim.delay = loopMoveAnim.delay;
            }

            const rotateAnim = node.getComponent('RotateAnim') as any;
            if (rotateAnim) {
                record.rotateAnim = {};
                record.rotateAnim.time = rotateAnim.time;
                record.rotateAnim.delay = rotateAnim.delay;
                record.rotateAnim.clockwise = rotateAnim.clockwise;
                record.rotateAnim.outDegree = rotateAnim.outDegree;
                record.rotateAnim.step = rotateAnim.step;
            }

            const scaleAnim = node.getComponent('ScaleAnim') as any;
            if (scaleAnim) {
                record.scaleAnim = {};
                record.scaleAnim.time = scaleAnim.time;
                record.scaleAnim.delay = scaleAnim.delay;
                record.scaleAnim.minX = scaleAnim.minX;
                record.scaleAnim.maxX = scaleAnim.maxX;
                record.scaleAnim.minY = scaleAnim.minY;
                record.scaleAnim.maxY = scaleAnim.maxY;
            }

            const skewAnim = node.getComponent('SkewAnim') as any;
            if (skewAnim) {
                record.skewAnim = {};
                record.skewAnim.time = skewAnim.time;
                record.skewAnim.delay = skewAnim.delay;
                record.skewAnim.minX = skewAnim.minX;
                record.skewAnim.maxX = skewAnim.maxX;
                record.skewAnim.minY = skewAnim.minY;
                record.skewAnim.maxY = skewAnim.maxY;
            }

            const shakeAnim = node.getComponent('ShakeAnim') as any;
            if (shakeAnim) {
                record.shakeAnim = {};
                record.shakeAnim.time = shakeAnim.time;
                record.shakeAnim.delay = shakeAnim.delay;
                record.shakeAnim.wait = shakeAnim.wait;
                record.shakeAnim.degree = shakeAnim.degree;
            }

            records[node.name] = record;
        };

        const recNode = (node: Node) => {
            node.children.forEach((child) => {
                recordOne(child);
                if (child.children.length > 0) {
                    if (hasText(child.name, '_TwoColor_child')) return;
                    recNode(child);
                }
            });
        };

        recNode(this.node);

        return records;
    }

    public outputList() {
        const oldRecords = this.records || {};
        const records = this.recordList();
        const result: AnyRecord = {};
        for (const name in records) {
            const record = records[name];
            const oldRecord = oldRecords[name];
            const res: AnyRecord = {};

            if (oldRecord) {
                if (record.active !== oldRecord.active) res.active = record.active;
                if (record.x !== oldRecord.x) res.x = record.x;
                if (record.y !== oldRecord.y) res.y = record.y;
                if (record.rotation !== oldRecord.rotation) res.rotation = record.rotation;
                if (record.anchorX !== oldRecord.anchorX) res.anchorX = record.anchorX;
                if (record.anchorY !== oldRecord.anchorY) res.anchorY = record.anchorY;
                if (record.skewX !== oldRecord.skewX) res.skewX = record.skewX;
                if (record.skewY !== oldRecord.skewY) res.skewY = record.skewY;
                if (record.scaleX !== oldRecord.scaleX && record.scaleY !== oldRecord.scaleY && record.scaleX === record.scaleY) {
                    res.scale = record.scaleX;
                } else {
                    if (record.scaleX !== oldRecord.scaleX) res.scaleX = record.scaleX;
                    if (record.scaleY !== oldRecord.scaleY) res.scaleY = record.scaleY;
                }
                if (record.width !== oldRecord.width) res.width = record.width;
                if (record.height !== oldRecord.height) res.height = record.height;
                if (!this.colorSame(record.color, oldRecord.color)) res.color = this.parseColor(record.color);
                if (record.opacity !== oldRecord.opacity) res.opacity = record.opacity;

                this.diffNested(record, oldRecord, res, 'label');
                this.diffNested(record, oldRecord, res, 'outline', ['color']);
                this.diffNested(record, oldRecord, res, 'shadow', ['color']);
                this.diffNested(record, oldRecord, res, 'blinkAnim');
                this.diffNested(record, oldRecord, res, 'moveAnim');
                this.diffNested(record, oldRecord, res, 'loopMoveAnim');
                this.diffNested(record, oldRecord, res, 'rotateAnim');
                this.diffNested(record, oldRecord, res, 'scaleAnim');
                this.diffNested(record, oldRecord, res, 'skewAnim');
                this.diffNested(record, oldRecord, res, 'shakeAnim');

                if (record.sprite) {
                    res.sprite = {};
                    if (!oldRecord.sprite || record.sprite.image !== oldRecord.sprite.image) {
                        res.sprite.image = 'https://cg-cdn.goldaxe.net/mergeTown/event/img/' + record.sprite.image + '.png';
                    }
                    if (Object.keys(res.sprite).length <= 0) delete res.sprite;
                }
            } else {
                if (record.x !== 0) res.x = record.x;
                if (record.y !== 0) res.y = record.y;
                if (record.rotation !== 0) res.rotation = record.rotation;
                if (record.anchorX !== 0.5) res.anchorX = record.anchorX;
                if (record.anchorY !== 0.5) res.anchorY = record.anchorY;
                if (record.skewX !== 0) res.skewX = record.skewX;
                if (record.skewY !== 0) res.skewY = record.skewY;
                if (record.scaleX !== 1 && record.scaleY !== 1 && record.scaleX === record.scaleY) {
                    res.scale = record.scaleX;
                } else {
                    if (record.scaleX !== 1) res.scaleX = record.scaleX;
                    if (record.scaleY !== 1) res.scaleY = record.scaleY;
                }
                if (record.width !== 0) res.width = record.width;
                if (record.height !== 0) res.height = record.height;
                if (!this.colorSame(record.color, this.recordColor(Color.WHITE))) res.color = this.parseColor(record.color);
                if (record.opacity !== 255) res.opacity = record.opacity;

                this.copyNested(record, res, 'label');
                this.copyNested(record, res, 'outline', ['color']);
                this.copyNested(record, res, 'shadow', ['color']);
                this.copyNested(record, res, 'blinkAnim');
                this.copyNested(record, res, 'moveAnim');
                this.copyNested(record, res, 'loopMoveAnim');
                this.copyNested(record, res, 'rotateAnim');
                this.copyNested(record, res, 'scaleAnim');
                this.copyNested(record, res, 'skewAnim');
                this.copyNested(record, res, 'shakeAnim');

                if (record.sprite) {
                    res.sprite = {};
                    res.sprite.image = 'https://cg-cdn.goldaxe.net/mergeTown/event/img/' + record.sprite.image + '.png';
                }
            }

            if (res.label?.string) {
                res.label.string = this.wrapLocalizedString(res.label.string);
            }
            if (Object.keys(res).length > 0) result[name] = res;
        }
        if (typeof Editor !== 'undefined') Editor.log(JSON.stringify(result));
    }

    private diffNested(record: AnyRecord, oldRecord: AnyRecord, out: AnyRecord, key: string, colorKeys: string[] = []) {
        if (!record[key]) return;
        out[key] = {};
        if (!oldRecord[key]) {
            Object.assign(out[key], record[key]);
        } else {
            for (const prop in record[key]) {
                if (colorKeys.includes(prop)) {
                    if (!this.colorSame(record[key][prop], oldRecord[key][prop])) out[key][prop] = this.parseColor(record[key][prop]);
                } else if (record[key][prop] !== oldRecord[key][prop]) {
                    out[key][prop] = record[key][prop];
                }
            }
        }
        if (Object.keys(out[key]).length <= 0) delete out[key];
    }

    private copyNested(record: AnyRecord, out: AnyRecord, key: string, colorKeys: string[] = []) {
        if (!record[key]) return;
        out[key] = {};
        for (const prop in record[key]) {
            out[key][prop] = colorKeys.includes(prop) ? this.parseColor(record[key][prop]) : record[key][prop];
        }
    }

    private wrapLocalizedString(value: string) {
        if (value === 'BUY NOW') {
            return { en: 'BUY NOW', es: 'COMPRAR AHORA', de: 'JETZT KAUFEN', fr: 'ACHETER MAINTENANT' };
        }
        if (value === 'GO!') {
            return { en: 'GO!', es: '闅咺R!', de: 'LOS!', fr: 'ALLER!' };
        }
        return { en: value, de: value, es: value, fr: value };
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
}
