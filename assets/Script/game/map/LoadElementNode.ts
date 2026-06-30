import {
    _decorator,
    assetManager,
    Color,
    Component,
    Font,
    Label,
    LabelOutline,
    Node,
    resources,
    Sprite,
    SpriteFrame,
    UIOpacity,
    UITransform,
} from 'cc';
const { ccclass } = _decorator;

declare const CC_EDITOR: boolean;
declare const Editor: any;

const RES_BUILD_BASE = 'res/village/buildPrefabs';
const RES_TEX_LOCK_CLOUD = 'res/village/texture/lockbuilding';
const RES_TEX_LOCK_BG = 'res/village/texture/lockBG';
const FONT_RES_PATH = 'LiveData/PoetsenOne-Regular';

function setNodeSize (node: Node, width: number, height: number) {
    const transform = node.getComponent(UITransform) || node.addComponent(UITransform);
    transform.setContentSize(width, height);
}

function setNodeOpacity (node: Node, opacity: number) {
    const uiOpacity = node.getComponent(UIOpacity) || node.addComponent(UIOpacity);
    uiOpacity.opacity = opacity;
}

function applyRawSprite (node: Node, spriteFrame: SpriteFrame) {
    const sprite = node.getComponent(Sprite);
    if (!sprite) return;
    sprite.spriteFrame = spriteFrame;
    sprite.sizeMode = Sprite.SizeMode.RAW;
    sprite.trim = false;
}

@ccclass('LoadElementNode')
export default class LoadElementNode extends Component {
    private buildMaxLevel = 5;
    private build_name = '';

    setupBuildId (buildID: number): Promise<void> {
        this.build_name = String(buildID);
        return this.loadAllAssets();
    }

    private loadAllAssets (): Promise<void> {
        const ln = this.node.getChildByName('levelNode');
        const lock1 = this.node.getChildByName('lockIcon');
        if (!ln || !lock1) {
            return Promise.reject(new Error('LoadElementNode: missing levelNode or lockIcon'));
        }
        lock1.active = true;

        const lockNode = lock1.getChildByName('mask');
        const lvNode = lock1.getChildByName('lv');
        const lvBg = lock1.getChildByName('bg');
        const coinBarNode = this.node.getChildByName('coinBar');
        const promises: Promise<void>[] = [];

        for (let index = 0; index < this.buildMaxLevel; index++) {
            for (const spfName of [`${index + 1}`, `${1}z`]) {
                const dbUrl = `db://assets/resources/${RES_BUILD_BASE}/${this.build_name}/res/${spfName}.png/${spfName}`;
                const resUrl = `${RES_BUILD_BASE}/${this.build_name}/res/${spfName}`;
                promises.push(
                    this.loadSpriteFrame(dbUrl, resUrl).then((spriteFrame) => {
                        this.applySpriteToLevel(ln, index, spfName, spriteFrame);
                    }),
                );
            }
        }

        promises.push(
            this.loadSpriteFrame(`db://assets/resources/${RES_TEX_LOCK_CLOUD}.png/lockbuilding`, RES_TEX_LOCK_CLOUD)
                .then((spriteFrame) => {
                    if (!lockNode) return;
                    applyRawSprite(lockNode, spriteFrame);
                    setNodeOpacity(lockNode, 150);
                }),
        );

        promises.push(this.loadFont().then((font) => {
            if (!font || !lvNode) return;
            const lvLabel = lvNode.getComponent(Label);
            if (!lvLabel) return;
            lvNode.setPosition(0, -20);
            setNodeSize(lvNode, 62, 30);
            lvLabel.font = font;
            lvLabel.useSystemFont = false;
            lvLabel.fontSize = 20;
            lvLabel.lineHeight = 30;
            lvLabel.color = new Color(255, 255, 255, 255);

            const labelOutline = lvNode.getComponent(LabelOutline) || lvNode.addComponent(LabelOutline);
            labelOutline.color = new Color(113, 125, 173, 255);
            labelOutline.width = 3;
        }));

        promises.push(
            this.loadSpriteFrame(`db://assets/resources/${RES_TEX_LOCK_BG}.png/lockBG`, RES_TEX_LOCK_BG)
                .then((spriteFrame) => {
                    if (!lvBg) return;
                    setNodeSize(lvBg, 70, 85);
                    lvBg.setPosition(0, -6.7);
                    applyRawSprite(lvBg, spriteFrame);
                }),
        );

        return Promise.all(promises).then(() => {
            if (coinBarNode) coinBarNode.active = false;
        });
    }

    private applySpriteToLevel (ln: Node, index: number, spfName: string, spriteFrame: SpriteFrame) {
        const level = ln.getChildByName(`level${index + 1}`);
        if (!level) return;
        const hparent = /z/g.test(spfName)
            ? level.getChildByName('handle_dam')
            : level.getChildByName('handle');
        if (!hparent) return;

        let target = hparent.getChildByName(spfName);
        if (!target) {
            target = new Node(spfName);
            target.addComponent(Sprite);
            target.parent = hparent;
        }
        applyRawSprite(target, spriteFrame);
    }

    private loadSpriteFrame (dbUrl: string, resUrl: string): Promise<SpriteFrame> {
        return new Promise((resolve, reject) => {
            if (CC_EDITOR && typeof Editor !== 'undefined' && Editor.assetdb && Editor.assetdb.remote) {
                const uuid = Editor.assetdb.remote.urlToUuid(dbUrl);
                if (!uuid) {
                    reject(new Error('LoadElementNode: urlToUuid failed ' + dbUrl));
                    return;
                }
                assetManager.loadAny(uuid, (err: Error | null, spriteFrame: SpriteFrame) => {
                    if (err) reject(err);
                    else resolve(spriteFrame);
                });
            } else {
                resources.load(resUrl, SpriteFrame, (err: Error | null, spriteFrame: SpriteFrame) => {
                    if (err) reject(err);
                    else resolve(spriteFrame);
                });
            }
        });
    }

    private loadFont (): Promise<Font | null> {
        return new Promise((resolve) => {
            if (CC_EDITOR && typeof Editor !== 'undefined' && Editor.assetdb && Editor.assetdb.remote) {
                const uuid = Editor.assetdb.remote.urlToUuid('db://assets/LiveData/PoetsenOne-Regular.ttf');
                if (!uuid) {
                    resolve(null);
                    return;
                }
                assetManager.loadAny(uuid, (err: Error | null, font: Font) => {
                    if (err) resolve(null);
                    else resolve(font);
                });
            } else {
                resources.load(FONT_RES_PATH, Font, (err: Error | null, font: Font) => {
                    if (err) resolve(null);
                    else resolve(font);
                });
            }
        });
    }
}
