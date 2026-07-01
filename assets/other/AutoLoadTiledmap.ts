import {
    _decorator,
    assetManager,
    Button,
    Color,
    Component,
    EventHandler,
    instantiate,
    Node,
    Prefab,
    rect,
    Sprite,
    SpriteFrame,
    Texture2D,
    TiledLayer,
    TiledMap,
    TiledObjectGroup,
    UITransform,
    Vec2,
} from 'cc';

const { ccclass, executeInEditMode, property } = _decorator;

declare const CC_EDITOR: boolean;
declare const Editor: any;

@ccclass('ObjectItem')
export class ObjectItem {
    @property
    public layerName = '';

    @property
    public objectName = '';

    @property
    public tileSetName = '';
}

function getOrAddTransform(node: Node): UITransform {
    return node.getComponent(UITransform) || node.addComponent(UITransform);
}

function editorLog(...args: any[]) {
    if (typeof Editor !== 'undefined') Editor.log(...args);
}

function editorError(...args: any[]) {
    if (typeof Editor !== 'undefined') Editor.error(...args);
}

@ccclass('AutoLoadTiledmap')
@executeInEditMode
export class AutoLoadTiledmap extends Component {
    @property
    private get do() {
        return false;
    }
    private set do(value: boolean) {
        if (typeof CC_EDITOR !== 'undefined' && CC_EDITOR) this.loadTileMap();
    }

    @property([ObjectItem])
    public keyControllers: ObjectItem[] = [];

    @property({ tooltip: 'tmx folder path' })
    public mapPath = '';

    @property({ type: Prefab, tooltip: 'tile prefab' })
    public itemPrefab: Prefab | null = null;

    @property({ type: SpriteFrame, tooltip: 'undeveloped area tree sprite' })
    public treeAssetFrame: SpriteFrame | null = null;

    @property({ type: Prefab, tooltip: 'raid target prefab' })
    public raidTargetPrefab: Prefab | null = null;

    @property({ type: Prefab, tooltip: 'attack target prefab' })
    public attackTargetPrefab: Prefab | null = null;

    @property(SpriteFrame)
    public brokenCell: SpriteFrame | null = null;

    private tmx: TiledMap | null = null;
    private townNode: any = null;

    public loadTileMap() {
        this.tmx = this.node.getComponent(TiledMap);
        if (!this.tmx) return;

        const mapSize = this.tmx.getMapSize();
        const tileSize = this.tmx.getTileSize();
        const width = mapSize.width * tileSize.width;
        const height = mapSize.height * tileSize.height;
        const tmxNode = this.tmx.node;
        const transform = getOrAddTransform(tmxNode);
        transform.setContentSize(width, height);
        transform.setAnchorPoint(0, 0);
        tmxNode.setPosition(-width / 2, -height / 2, tmxNode.position.z);

        this.keyControllers.forEach((element) => {
            const layer = this.tmx!.getLayer(element.layerName);
            if (layer) layer.node.removeAllChildren();
        });

        this.keyControllers.forEach((element) => {
            const layer = this.tmx!.getLayer(element.layerName);
            const objectGroup = this.tmx!.getObjectGroup(element.objectName);
            editorLog(element.layerName + element.tileSetName);
            if (layer && objectGroup) this.createTree(objectGroup, layer, element.tileSetName);
        });

        this.townNode = this.node.parent?.getComponent('TownNode');
        if (!this.townNode) {
            editorLog('TownNode missing');
            return;
        }
        this.townNode.itemPrefab = this.itemPrefab;
        this.townNode.raidTargets = [];
        this.townNode.attackTargets = [];
        this.townNode.fixButtons = [];

        let buttonLayer = this.tmx.node.getChildByName('buttonLayer');
        if (!buttonLayer) {
            buttonLayer = new Node('buttonLayer');
            getOrAddTransform(buttonLayer).setAnchorPoint(0, 0);
            this.tmx.node.addChild(buttonLayer);
        }
        buttonLayer.removeAllChildren();

        this.initRaidTargets(buttonLayer);
        this.initAttackTargets(buttonLayer);

        const coverLayer = this.tmx.getLayer('cover');
        const buildLayer = this.tmx.getLayer('build');
        if (coverLayer && buildLayer) this.initCoverTree(coverLayer, buildLayer.node);

        this.townNode.brokenCell = this.brokenCell;

        editorLog('tilemap data generated');
    }

    public initRaidTargets(parent: Node) {
        if (!this.tmx || !this.raidTargetPrefab || !this.townNode) return;

        const tmxTransform = getOrAddTransform(this.tmx.node);
        for (let index = 0; index < 4; index++) {
            const node = instantiate(this.raidTargetPrefab);
            node.name = 'raidTarget' + (index + 1);
            parent.addChild(node);
            const eventHandler = new EventHandler();
            eventHandler.target = this.townNode.node;
            eventHandler.component = 'TownNode';
            eventHandler.handler = 'onClickRaid';
            eventHandler.customEventData = String(index + 1);
            const button = node.getComponent(Button);
            if (button) button.clickEvents[0] = eventHandler;
            node.setPosition(tmxTransform.width / 2, tmxTransform.height / 2, node.position.z);
            this.townNode.raidTargets.push(node);
            node.active = false;
        }
    }

    public initAttackTargets(parent: Node) {
        if (!this.tmx || !this.attackTargetPrefab || !this.townNode) return;

        const tmxTransform = getOrAddTransform(this.tmx.node);
        for (let index = 0; index < 5; index++) {
            const node = instantiate(this.attackTargetPrefab);
            node.name = 'attackTarget' + (index + 1);
            parent.addChild(node);

            const eventHandler = new EventHandler();
            eventHandler.target = this.townNode.node;
            eventHandler.component = 'TownNode';
            eventHandler.handler = 'onClickAttack';
            eventHandler.customEventData = String(index + 1);
            const button = node.getComponent(Button);
            if (button) button.clickEvents[0] = eventHandler;
            node.setPosition(tmxTransform.width / 2, tmxTransform.height / 2, node.position.z);
            this.townNode.attackTargets.push(node);
            node.active = false;
        }
    }

    public initCoverTree(layer: TiledLayer, parent: Node) {
        if (!this.tmx || !this.itemPrefab) return;

        const layerAny = layer as any;
        const layerSize = layer.layerSize || layerAny._layerSize;
        const tileSize = this.tmx.getTileSize();
        const mapTransform = getOrAddTransform(this.tmx.node);
        for (let i = 0; i < layerSize.width; i++) {
            for (let j = 0; j < layerSize.height; j++) {
                const index = Math.floor(i) + Math.floor(j) * layerSize.width;
                const tileGid = layerAny.tiles ? layerAny.tiles[index] : layerAny._tiles[index];
                if (tileGid !== 0) {
                    const props = this.tmx.getPropertiesForGID(tileGid) || {};
                    const lv = Number((props as any).level || 0);
                    if (lv < 2) continue;
                    const node = instantiate(this.itemPrefab);
                    parent.addChild(node);
                    const pos = layer.getPositionAt(i, j) || Vec2.ZERO;
                    node.setPosition(pos.x + tileSize.width / 2, pos.y, node.position.z);
                    node.name = 'tree_' + index;
                    node.setSiblingIndex(Math.floor(mapTransform.height - node.position.y));
                    const sprite = node.getChildByName('sp')?.getComponent(Sprite);
                    if (sprite) sprite.spriteFrame = this.treeAssetFrame;
                }
            }
        }
    }

    public getTilesetURL(array: HTMLCollectionOf<Element>, tilesetGID: number) {
        for (let index = 0; index < array.length; index++) {
            const element = array[index];
            if (Number(element.getAttribute('id')) === tilesetGID) {
                return element.getElementsByTagName('image')[0]?.getAttribute('source') || null;
            }
        }
        return null;
    }

    public createTile(layer: TiledLayer, parent: Node, tileSetName?: string) {
        if (!this.tmx || !this.itemPrefab) return;

        parent.removeAllChildren();
        const layerAny = layer as any;
        const layerSize = layer.layerSize || layerAny._layerSize;
        const tileSize = this.tmx.getTileSize();
        const mapTransform = getOrAddTransform(this.tmx.node);
        editorLog(JSON.stringify(layerAny.texGrids || layerAny._texGrids));
        editorLog(layerAny._tileset?.firstGid);

        for (let i = 0; i < layerSize.width; i++) {
            for (let j = 0; j < layerSize.height; j++) {
                const index = Math.floor(i) + Math.floor(j) * layerSize.width;
                const tileGid = layerAny.tiles ? layerAny.tiles[index] : layerAny._tiles[index];
                if (tileGid !== 0) {
                    const gid = tileGid - layerAny._tileset.firstGid;
                    const texGrid = layerAny._textures[gid];
                    const spriteFrame = new SpriteFrame();
                    spriteFrame.texture = layerAny._texture as Texture2D;
                    spriteFrame.rect = rect(texGrid.x, texGrid.y, texGrid.width, texGrid.height);

                    const node = instantiate(this.itemPrefab);
                    parent.addChild(node);
                    const pos = layer.getPositionAt(i, j) || Vec2.ZERO;
                    node.setPosition(pos.x + tileSize.width / 2, pos.y, node.position.z);
                    node.name = layerAny._layerName + '_' + index;
                    node.setSiblingIndex(Math.floor(mapTransform.height - node.position.y));
                    const sprite = node.getChildByName('sp')?.getComponent(Sprite);
                    if (sprite) sprite.spriteFrame = spriteFrame;
                }
            }
        }
    }

    public createTree(buildobjGroup: TiledObjectGroup, layer: TiledLayer, tileSetName: string) {
        if (!this.tmx || !this.itemPrefab) return;

        const objects = buildobjGroup.getObjects();
        const mapSize = this.tmx.getMapSize();
        const tileSize = this.tmx.getTileSize();
        const mapInfo = (buildobjGroup as any)._mapInfo;
        const tileSet = mapInfo?._tilesets?.find((item: any) => item.name === tileSetName);
        const firstGid = tileSet ? tileSet.firstGid : 0;
        const xmlStr = mapInfo?._tsxMap?.[tileSetName + '.tsx'];
        const tiles = xmlStr ? new DOMParser().parseFromString(xmlStr, 'text/xml').getElementsByTagName('tile') : null;
        const rootTransform = getOrAddTransform(this.node);

        objects.forEach((element: any) => {
            const node = instantiate(this.itemPrefab!);
            layer.node.addChild(node);
            const posIdxX = element.offset.x / tileSize.width * 2;
            const posIdxY = element.offset.y / tileSize.height;
            node.setPosition(
                tileSize.width / 2 * (mapSize.width + posIdxX - posIdxY),
                tileSize.height / 2 * (mapSize.height * 2 - posIdxX - posIdxY),
                node.position.z,
            );
            node.name = element.name ? element.name : 'obj_' + element.id;
            editorLog(node.name);
            node.setSiblingIndex(Math.floor(rootTransform.height - node.position.y));
            if (tileSetName !== '' && tiles) {
                const tilesetGID = element.gid - firstGid;
                const tileURL = this.getTilesetURL(tiles, tilesetGID);
                if (!tileURL) return;
                const infos = tileURL.split('/');
                const resName = infos[infos.length - 1].split('.')[0];
                const url = `${this.mapPath}/${tileSetName}/${resName}.png/${resName}`;
                editorLog(url);
                const uuid = Editor?.assetdb?.remote?.urlToUuid
                    ? Editor.assetdb.remote.urlToUuid(url)
                    : Editor?.remote?.assetdb?.urlToUuid?.(url);
                assetManager.loadAny({ type: 'uuid', uuid }, (err, spriteFrame: SpriteFrame) => {
                    if (err) {
                        editorError(err.message || err);
                        return;
                    }
                    const sprite = node.getChildByName('sp')?.getComponent(Sprite);
                    if (sprite) sprite.spriteFrame = spriteFrame;
                });
            } else {
                this.openglToTile(node.position);
            }
        });
    }

    public createElement(parent: Node, element: any, mapSize = this.tmx!.getMapSize(), tileSize = this.tmx!.getTileSize()) {
        if (!this.itemPrefab) return;

        const node = instantiate(this.itemPrefab);
        parent.addChild(node);
        const posIdxX = element.offset.x / tileSize.width * 2;
        const posIdxY = element.offset.y / tileSize.height;
        node.setPosition(
            tileSize.width / 2 * (mapSize.width + posIdxX - posIdxY),
            tileSize.height / 2 * (mapSize.height * 2 - posIdxX - posIdxY),
            node.position.z,
        );
        node.name = String(element.id);
        node.setSiblingIndex(Math.floor(getOrAddTransform(this.node).height - node.position.y));
    }

    public tileToOpengl(point: Vec2) {
        if (!this.tmx) return new Vec2();

        const mapSize = this.tmx.getMapSize();
        const tileSize = this.tmx.getTileSize();
        const x = point.x * tileSize.width + Math.floor(point.y % 2) * tileSize.width / 2;
        const y = (mapSize.height - (point.y + 1)) * tileSize.height / 2 - tileSize.height / 2;

        return new Vec2(x, y);
    }

    public openglToTile(point: Vec2 | { x: number, y: number }) {
        if (!this.tmx) return new Vec2();

        const mapSize = this.tmx.getMapSize();
        const tileSize = this.tmx.getTileSize();
        const x = Math.floor(mapSize.height - point.y / tileSize.height + point.x / tileSize.width - mapSize.width / 2);
        const y = Math.floor(mapSize.height - point.y / tileSize.height - point.x / tileSize.width + mapSize.width / 2);

        return new Vec2(x, y);
    }
}
