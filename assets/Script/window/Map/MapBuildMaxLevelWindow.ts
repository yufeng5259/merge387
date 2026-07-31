import { _decorator, Button, Component, find, instantiate, isValid, Label, Node } from 'cc';
import { UIWindow } from '../../GameKit/ui/UIWindow';
import BuildingFocusEffect from '../../game/map/BuildingFocusEffect';

const { ccclass } = _decorator;

@ccclass('MapBuildMaxLevelWindow')
export default class MapBuildMaxLevelWindow extends UIWindow {
    public static windowPath = 'Map/MapBuildMaxLevelWindow';

    namelbl: Label | null = null;
    btnClose: Button | null = null;
    buildDisplayNode: Node | null = null;
    focusEffect: BuildingFocusEffect | null = null;
    allComNode: Node | null = null;
    meta: any = null;
    mapID: any = null;
    buildID: any = null;
    mNode: Node | null = null;
    mbid: any = null;
    buildData: any = null;

    onLoad() {
        this.cacheNodes();
        this.bindButtons();
    }

    onShow(showParams: any) {
        showParams = showParams || {};
        this.meta = showParams.meta;
        if (!this.meta) return;

        this.mapID = Game.SUserVillage.MergeMapId();
        this.buildID = this.meta.BuildID() || 0;
        this.mNode = showParams.mNode;
        this.mbid = this.mapID + '_' + this.buildID;
        this.buildData = Game.SUserMap.initElement(this.mbid);

        this.cacheNodes();
        this.bindButtons();
        this.showBuildNode();
        this.showFocusBuild();
        this.updatePanel();
    }

    cacheNodes() {
        if (!this.node) return;
        this.namelbl = this.getLabel('bg/bg/nameTitle');
        this.btnClose = this.getComponentByPath('bg/close', Button);
        this.buildDisplayNode = find('bg/buildNode', this.node);
        this.focusEffect = this.getComponentByPath('BuildingFocusEffect', BuildingFocusEffect);
        this.allComNode = find('bg/allDone', this.node);
    }

    getComponentByPath<T extends Component>(path: string, type: new (...args: any[]) => T): T | null {
        const node = find(path, this.node);
        return node ? node.getComponent(type) : null;
    }

    getLabel(path: string) {
        return this.getComponentByPath(path, Label);
    }

    updateNameTitle() {
        if (!this.namelbl || !this.meta) return;
        const showname = this.meta.Showname();
        const localized: any = this.namelbl.getComponent('LabelLocalized');
        if (localized) {
            if (localized.setTextData) {
                localized.setTextData(showname);
                return;
            }
            localized.textKey = GameKit.i18n.sel(showname);
            localized.onLoad();
            return;
        }
        this.namelbl.string = GameKit.i18n.sel(showname);
    }

    bindButtons() {
        if (this.btnClose && this.btnClose.node) {
            this.btnClose.clickEvents = [];
            this.btnClose.node.off('click', this.close_window, this);
            this.btnClose.node.on('click', this.close_window, this);
        }
    }

    updatePanel() {
        this.updateNameTitle();
        if (this.allComNode) this.allComNode.active = true;
        if (this.buildDisplayNode) this.buildDisplayNode.active = true;
    }

    showBuildNode() {
        if (!this.buildDisplayNode) return;
        this.buildDisplayNode.removeAllChildren();
        if (!this.mNode) {
            console.log('MapBuildMaxLevelWindow: no map node');
            return;
        }
        const buildNodeCopy = instantiate(this.mNode);
        buildNodeCopy.parent = this.buildDisplayNode;
        (buildNodeCopy as any).groupIndex = 0;
        buildNodeCopy.setPosition(0, 0, 0);
        buildNodeCopy.setScale(0.5, 0.5, 0.5);
        const mapElementNode = this.getMapElementNode(buildNodeCopy);
        if (mapElementNode) mapElementNode.hideNode();
    }

    showFocusBuild() { if (this.focusEffect && this.mNode) this.focusEffect.show(this.mNode); }
    clearFocusBuild() { this.focusEffect?.clear(); }
    onClose() { this.clearFocusBuild(); }

    getMapElementNode(node: Node | null) {
        if (!isValid(node)) return null;
        const mapElementNode: any = node.getComponent('MapElementNode');
        if (mapElementNode) return mapElementNode;

        const components = node.getComponents(Component);
        for (let i = 0; i < components.length; i++) {
            const component: any = components[i];
            if (component && component.initData && component.updateElement && component.showLevelInfo) {
                return component;
            }
        }
        return null;
    }

    close_window() {
        this.closeAnim();
    }
}
