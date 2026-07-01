import { _decorator, Component, instantiate, Node, Prefab, TiledLayer, TiledMap, TiledObjectGroup, UITransform, Vec2, Vec3 } from 'cc';

const { ccclass, executeInEditMode, property } = _decorator;

declare const CC_EDITOR: boolean;
declare const Editor: any;

@ccclass('ObjectItemT')
export class ObjectItemT {
    @property
    public layerName = '';

    @property
    public objectName = '';
}

function getOrAddTransform(node: Node): UITransform {
    return node.getComponent(UITransform) || node.addComponent(UITransform);
}

@ccclass('AutoTiledmap')
@executeInEditMode
export class AutoTiledmap extends Component {
    @property
    private get do() {
        return false;
    }
    private set do(value: boolean) {
        if (typeof CC_EDITOR !== 'undefined' && CC_EDITOR) this.loadTileMap();
    }

    @property([ObjectItemT])
    public keyControllers: ObjectItemT[] = [];

    @property({ tooltip: 'tmx folder path' })
    public mapPath = '';

    @property({ type: Prefab, tooltip: 'tile prefab' })
    public itemPrefab: Prefab | null = null;

    private tmx: TiledMap | null = null;

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

        const builds = tmxNode.parent?.getChildByName('builds');
        if (builds) builds.removeAllChildren();

        this.keyControllers.forEach((element) => {
            const objectGroup = this.tmx!.getObjectGroup(element.objectName);
            if (objectGroup && builds) this.createBuild(objectGroup, builds);
        });

        if (typeof Editor !== 'undefined') Editor.log('tilemap data generated');
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
                }
            }
        }
    }

    public createBuild(buildobjGroup: TiledObjectGroup, layer: Node) {
        if (!this.tmx || !this.itemPrefab) return;

        const objects = buildobjGroup.getObjects();
        const mapSize = this.tmx.getMapSize();
        const tileSize = this.tmx.getTileSize();
        const rootTransform = getOrAddTransform(this.node);
        objects.forEach((element: any) => {
            const node = instantiate(this.itemPrefab!);
            layer.addChild(node);

            const posIdxX = element.offset.x / tileSize.width * 2;
            const posIdxY = element.offset.y / tileSize.height;
            node.setPosition(
                tileSize.width / 2 * (mapSize.width + posIdxX - posIdxY),
                tileSize.height / 2 * (mapSize.height * 2 - posIdxX - posIdxY),
                node.position.z,
            );
            node.name = element.name ? element.name : 'obj_' + element.id;
            if (typeof Editor !== 'undefined') Editor.log(node.name);
            node.setSiblingIndex(Math.floor(rootTransform.height - node.position.y));
        });
    }
}
