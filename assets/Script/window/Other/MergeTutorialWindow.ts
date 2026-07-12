import { _decorator, Animation, BlockInputEvents, Label, Mask, Node, RichText, Tween, tween, UIOpacity, UITransform, v2, Vec2, Vec3 } from 'cc';
import { UIWindow } from '../../GameKit/ui/UIWindow';
import MaskRoundRect from '../../GameKit/ui/MaskRoundRect';
import MergeEmptyTaskGuide from '../../game/merge/MergeEmptyTaskGuide';

const { ccclass, property } = _decorator;

type GuidePositions = { from: any; to: any };

@ccclass('MergeTutorialWindow')
export default class MergeTutorialWindow extends UIWindow {
    public static windowPath = 'Other/MergeTutorialWindow';

    @property(Node) arrow1: Node | null = null;
    @property(Node) arrow2: Node | null = null;
    @property(Node) arrow3: Node | null = null;
    @property(Node) arrow4: Node | null = null;
    @property(Node) arrow5: Node | null = null;
    @property(Node) dialog: Node | null = null;
    @property(Label) dialogLabel: Label | null = null;
    @property(Node) dialog2: Node | null = null;
    @property(Label) dialog2Label: Label | null = null;
    @property(Node) dialog2Btn: Node | null = null;

    @property(Mask) circleLightMask: Mask | null = null;
    @property(Mask) highLightMask: Mask | null = null;
    @property([Node]) highLightSpecial: Node[] = [];

    @property(Node) clickFullScreen: Node | null = null;

    @property(Node) startTitle: Node | null = null;

    @property(Node) guide: Node | null = null;
    @property(Node) EmptyTaskGuide: Node | null = null;
    @property(RichText) EmptyTaskLabel: RichText | null = null;

    meta: any = null;
    guideMeta: any = null;
    guidepos: Vec3 | null = null;
    dragGuidePositionKey = '';
    private arrow4Tween: Tween<Node> | null = null;
    private highlightTween: Tween<any> | null = null;
    private guideInputBlockers: Node[] = [];

    onShow() {
        Game.MergeTutorialManager.mainWindow = this;
        if (this.guide) {
            CCTools.WidgetUpdateAlignment(this.guide);
            this.guidepos = this.guide.position.clone();
            this.setNodeXY(this.guide, this.guide.position.x - 400, this.guide.position.y);
        }
        this.dragGuidePositionKey = '';
        GameKit.BackKeyManager.registerBackEvent();
        this.refreshEmptyTaskGuide();
    }

    refreshEmptyTaskGuide() {
        const userMerge = Game.SUserMerge || Game.UserMerge;
        const visible = MergeEmptyTaskGuide.shouldShowForUserMerge(userMerge);
        if (this.EmptyTaskGuide) this.EmptyTaskGuide.active = visible;
        if (visible && this.EmptyTaskLabel) this.EmptyTaskLabel.string = MergeEmptyTaskGuide.getTaskEmptyMessage(GameKit.i18n);
    }

    setRoundedHighlight(radius: number) {
        const node = this.highLightMask?.node;
        if (!node) return;
        let rounded = node.getComponent(MaskRoundRect);
        if (!rounded) rounded = node.addComponent(MaskRoundRect);
        rounded.enabled = radius > 0;
        if (radius > 0) rounded.setRadius(radius);
    }

    onClose() {
        this.clearView();
        Game.MergeTutorialManager.mainWindow = null;
        GameKit.BackKeyManager.unregisterBackEvent();
    }

    update() {
        if (!this.meta || !this.guideMeta) return;
        if (this.guideMeta.GuideType() === 'drag') {
            this.refreshDragGuidePosition();
            this.refreshDragHighlightPosition();
        } else if (this.guideMeta.GuideType() === 'order_submit') {
            this.refreshOrderGuidePosition();
        } else if (this.isNodeGuide()) {
            this.refreshNodeGuidePosition();
        }
    }

    showMeta(meta: any, guideMeta: any) {
        this.meta = meta;
        this.guideMeta = guideMeta;
        this.clearView();
        if (!this.meta) return;
        this.setVisualMaskBlockInputEnabled(false);
        if (this.guideMeta) {
            this.showMask(this.guideMeta.Mask());
            this.showDialog(this.guideMeta.DialogText(), this.guideMeta.DialogRect());
            this.showHighlightByGuide();
            this.showGuidePointer();
        }
        if (this.meta.CompleteType && this.meta.CompleteType() === 'fullscreen_click') {
            this.addFullScreenOnClick(function() {
                Game.MergeTutorialManager.Emit('fullscreen_click');
            });
        }
    }

    clearView() {
        [this.arrow1, this.arrow2, this.arrow3, this.arrow4, this.arrow5].forEach((node) => {
            if (!node) return;
            Tween.stopAllByTarget(node);
            node.active = false;
            this.setOpacity(node, 255);
            this.setScale(node, 1);
        });
        this.stopDynamicHighlightTween();
        this.stopArrow4Tween();
        if (this.dialog) this.dialog.active = false;
        if (this.dialog2) this.dialog2.active = false;
        if (this.highLightMask && this.highLightMask.node) {
            this.highLightMask.enabled = false;
            this.highLightMask.node.active = false;
        }
        if (this.circleLightMask && this.circleLightMask.node) {
            this.circleLightMask.enabled = false;
            this.circleLightMask.node.active = false;
        }
        if (this.highLightSpecial) {
            this.highLightSpecial.forEach(x => { x.active = false; });
        }
        if (this.clickFullScreen) {
            this.clickFullScreen.off('click');
            this.clickFullScreen.active = false;
        }
        if (this.dialog2Btn) {
            this.dialog2Btn.off('click');
        }
        if (this.startTitle) this.startTitle.active = false;
        if (this.guide) {
            Tween.stopAllByTarget(this.guide);
            this.guide.active = false;
        }
        this.dragGuidePositionKey = '';
    }

    setVisualMaskBlockInputEnabled(enabled: boolean) {
        [this.highLightMask, this.circleLightMask].forEach(mask => {
            if (!mask || !mask.node) return;
            const blocks = mask.node.getComponentsInChildren(BlockInputEvents);
            blocks.forEach(block => {
                block.enabled = !!enabled;
            });
        });
    }

    showMask(enabled: boolean) {
        if (this.highLightMask && this.highLightMask.node) {
            this.highLightMask.node.active = !!enabled;
        }
        this.setVisualMaskBlockInputEnabled(false);
    }

    showDialog(text: string, rect: string) {
        if (!text) return;
        const dialog = this.dialog || this.dialog2;
        const label = this.dialogLabel || this.dialog2Label;
        if (!dialog || !label) return;
        dialog.active = true;
        if (rect) {
            const poses = rect.split(',');
            this.setNodeXY(dialog, parseInt(poses[0], 10), parseInt(poses[1], 10));
            this.setNodeSize(dialog, parseInt(poses[2], 10), parseInt(poses[3], 10));
        }
        label.string = text.replace(/\\n/g, '\n');
        this.setScale(dialog, 0.001);
        Tween.stopAllByTarget(dialog);
        tween(dialog).to(0.2, { scale: new Vec3(1, 1, 1) } as any).start();
        if (this.guide && this.guidepos) {
            this.guide.active = true;
            Tween.stopAllByTarget(this.guide);
            tween(this.guide).to(0.35, { position: this.guidepos.clone() } as any).start();
        }
    }

    showGuidePointer() {
        if (!this.guideMeta) return;
        const type = this.guideMeta.GuideType();
        if (type === 'drag') {
            this.showDragGuide();
        } else if (type === 'click') {
            if (this.guideMeta.TargetType && this.guideMeta.TargetType() === 'node') {
                this.showClickGuide(this.getNodeWorldPos(this.guideMeta.TargetFrom()));
            } else {
                this.showClickGuide(this.getTileWorldPos(this.guideMeta.TargetFrom()));
            }
        } else if (type === 'order_submit') {
            this.showClickGuide(this.getOrderSubmitWorldPos());
        }
    }

    showClickGuide(worldPos: any) {
        if (!this.arrow5 || !worldPos) return;
        const pos = this.convertWorldPositionToNodeParentLocal(this.arrow5, worldPos);
        this.arrow5.active = true;
        this.setNodeXY(this.arrow5, pos.x, pos.y);
        const anim = this.arrow5.getComponent(Animation);
        if (anim) (anim as any).setCurrentTime(0);
    }

    showDragGuide() {
        if (!this.arrow4) return;
        let positions = this.getDragGuidePositions();
        if (!positions) return;
        positions = this.convertGuidePositionsToLocal(this.arrow4, positions);
        this.dragGuidePositionKey = this.getDragGuidePositionKey(positions);
        this.arrow4.active = true;
        this.stopArrow4Tween();
        this.setOpacity(this.arrow4, 0);
        this.setScale(this.arrow4, 1);
        this.setNodePositionFromPoint(this.arrow4, positions.from);
        this.playDragGuideTween(positions);
    }

    refreshDragGuidePosition() {
        if (!this.arrow4 || !this.arrow4.active) return;
        let positions = this.getDragGuidePositions();
        if (!positions) return;
        positions = this.convertGuidePositionsToLocal(this.arrow4, positions);
        const key = this.getDragGuidePositionKey(positions);
        if (key !== this.dragGuidePositionKey) this.showDragGuide();
    }

    refreshDragHighlightPosition() {
        if (!this.guideMeta || (this.guideMeta.HighlightType() !== 'tile' && this.guideMeta.HighlightType() !== 'node')) return;
        if (this.guideMeta.HighlightType() === 'node') {
            this.showHighlightByGuide();
            return;
        }
        const positions = this.getDragGuidePositions();
        if (positions) this.applyTwoPointHighlight(positions.from, positions.to, true);
    }

    refreshOrderGuidePosition() {
        if (!this.arrow5 || !this.arrow5.active) return;
        let pos = this.getOrderSubmitWorldPos();
        if (!pos) return;
        pos = this.convertWorldPositionToNodeParentLocal(this.arrow5, pos);
        this.setNodeXY(this.arrow5, pos.x, pos.y);
        this.showHighlightByGuide();
    }

    showHighlightByGuide() {
        if (!this.guideMeta) return;
        const type = this.guideMeta.HighlightType();
        if (type === 'tile') {
            const list = this.guideMeta.HighlightParamList();
            if (list.length === 1) {
                const pos = this.getTileWorldPos(list[0]);
                if (pos) this.applyDynamicHighlightGeometry({ shape: 'circle', x: pos.x, y: pos.y, width: 110, height: 110 }, true);
            } else if (list.length >= 2) {
                if (this.guideMeta.GuideType() === 'drag') {
                    const positions = this.getDragGuidePositions();
                    if (positions) this.applyTwoPointHighlight(positions.from, positions.to, true);
                } else {
                    const from = this.getTileWorldPos(list[0]);
                    const to = this.getTileWorldPos(list[1]);
                    if (from && to) this.applyTwoPointHighlight(from, to, true);
                }
            }
        } else if (type === 'order') {
            const pos = this.getOrderSubmitWorldPos();
            if (pos) this.applyDynamicHighlightGeometry({ shape: 'circle', x: pos.x, y: pos.y, width: 120, height: 120 }, true);
        } else if (type === 'node') {
            const list = this.guideMeta.HighlightParamList ? this.guideMeta.HighlightParamList() : [];
            const target = list.length > 0 ? list[0] : (this.guideMeta.HighlightParam() || this.guideMeta.TargetFrom());
            const geometry = this.getNodeHighlightGeometry(target);
            if (geometry) this.applyDynamicHighlightGeometry(geometry, true);
        }
    }

    applyTwoPointHighlight(from: any, to: any, immediate: boolean) {
        const geometry = Game.MergeTutorialManager && Game.MergeTutorialManager.BuildDynamicHighlightGeometry
            ? Game.MergeTutorialManager.BuildDynamicHighlightGeometry(from, to)
            : null;
        if (!geometry) return;
        this.applyDynamicHighlightGeometry(geometry, immediate !== false);
    }

    addFullScreenOnClick(cb: any) {
        if (this.clickFullScreen) {
            this.clickFullScreen.active = true;
            this.clickFullScreen.once('click', cb);
        } else if (this.dialog2Btn) {
            this.dialog2Btn.once('click', cb);
        }
    }

    getTileWorldPos(tileKey: string) {
        const levelNode = Game.MergeTutorialManager.GetMergeLevelNode();
        if (!levelNode || !tileKey) return null;
        if (Game.MergeTutorialManager && Game.MergeTutorialManager.NormalizeTileKey) {
            tileKey = Game.MergeTutorialManager.NormalizeTileKey(tileKey);
        }
        const node = levelNode.node.getChildByName(tileKey);
        if (node) return this.convertNodeLocalToWorld(node, Vec3.ZERO);
        const parts = tileKey.split('_');
        if (parts.length !== 2) return null;
        const pos = GameKit.MergeUtil.tile2px(parseInt(parts[0], 10), parseInt(parts[1], 10), levelNode.getMergeBoardLayout());
        return this.convertNodeLocalToWorld(levelNode.node, this.toVec3(pos));
    }

    getNodeWorldPos(targetKey: string) {
        if (!Game.MergeTutorialManager || !Game.MergeTutorialManager.GetNodeWorldPos) return null;
        return Game.MergeTutorialManager.GetNodeWorldPos(targetKey);
    }

    getNodeHighlightGeometry(targetKey: string) {
        if (!Game.MergeTutorialManager || !Game.MergeTutorialManager.GetNodeHighlightGeometry) return null;
        return Game.MergeTutorialManager.GetNodeHighlightGeometry(targetKey);
    }

    isNodeGuide() {
        if (!this.guideMeta) return false;
        if (this.guideMeta.TargetType && this.guideMeta.TargetType() === 'node') return true;
        return !!(this.guideMeta.HighlightType && this.guideMeta.HighlightType() === 'node');
    }

    refreshNodeGuidePosition() {
        if (!this.guideMeta) return;
        if (this.guideMeta.GuideType() === 'click' && this.arrow5 && this.arrow5.active) {
            let pos = this.getNodeWorldPos(this.guideMeta.TargetFrom());
            if (pos) {
                pos = this.convertWorldPositionToNodeParentLocal(this.arrow5, pos);
                this.setNodeXY(this.arrow5, pos.x, pos.y);
            }
        } else if (this.guideMeta.GuideType() === 'click') {
            this.showGuidePointer();
        }
        this.showHighlightByGuide();
    }

    getDragGuidePositions(): GuidePositions | null {
        if (!this.guideMeta) return null;
        const tiles = Game.MergeTutorialManager && Game.MergeTutorialManager.GetCurrentDragGuideTiles
            ? Game.MergeTutorialManager.GetCurrentDragGuideTiles()
            : null;
        const fromKey = tiles && tiles.from ? tiles.from : this.guideMeta.TargetFrom();
        const toKey = tiles && tiles.to ? tiles.to : this.guideMeta.TargetTo();
        const useNode = this.guideMeta.TargetType && this.guideMeta.TargetType() === 'node';
        const from = useNode ? this.getNodeWorldPos(fromKey) : this.getTileWorldPos(fromKey);
        const to = useNode ? this.getNodeWorldPos(toKey) : this.getTileWorldPos(toKey);
        if (!from || !to) return null;
        return { from: from, to: to };
    }

    getOrderSubmitWorldPos() {
        const mergeUI = Game.MergeTutorialManager.GetMergeUI();
        if (!mergeUI || !mergeUI.orderGroup) return null;
        const orders = mergeUI.orderGroup.orders || mergeUI.orderGroup.orderList || [];
        for (let i = 0; i < orders.length; i++) {
            const order = orders[i];
            if (!order || !order.node || !order.GetSlotIndex) continue;
            const data = Game.MergeTutorialManager.GetTutorialOrderBySlotIndex(order.GetSlotIndex());
            if (data && order.completeBtn) return this.convertNodeLocalToWorld(order.completeBtn, Vec3.ZERO);
        }
        return null;
    }

    convertWorldPositionToNodeParentLocal(node: Node, worldPosition: any) {
        if (!node || !node.parent || !worldPosition) return worldPosition;
        const transform = node.parent.getComponent(UITransform);
        if (!transform) return worldPosition;
        return transform.convertToNodeSpaceAR(this.toVec3(worldPosition));
    }

    convertGuidePositionsToLocal(node: Node, positions: GuidePositions) {
        if (!positions) return positions;
        return {
            from: this.convertWorldPositionToNodeParentLocal(node, positions.from),
            to: this.convertWorldPositionToNodeParentLocal(node, positions.to),
        };
    }

    getDragGuidePositionKey(positions: GuidePositions) {
        if (!positions || !positions.from || !positions.to) return '';
        return [Math.round(positions.from.x), Math.round(positions.from.y), Math.round(positions.to.x), Math.round(positions.to.y)].join(',');
    }

    stopDynamicHighlightTween() {
        if (this.highlightTween) {
            this.highlightTween.stop();
            this.highlightTween = null;
        }
        if (this.highLightMask && this.highLightMask.node) Tween.stopAllByTarget(this.highLightMask.node);
        if (this.circleLightMask && this.circleLightMask.node) Tween.stopAllByTarget(this.circleLightMask.node);
    }

    applyDynamicHighlightGeometry(geometry: any, immediate: boolean) {
        if (!geometry) return;
        const useCircle = (geometry.shape || '').toLowerCase() === 'circle';
        const mask = useCircle ? this.circleLightMask : this.highLightMask;
        if (!mask || !mask.node) return;
        if (this.highLightMask && this.highLightMask.node) {
            this.highLightMask.enabled = !useCircle;
            this.highLightMask.node.active = !useCircle;
        }
        if (this.circleLightMask && this.circleLightMask.node) {
            this.circleLightMask.enabled = !!useCircle;
            this.circleLightMask.node.active = !!useCircle;
        }
        this.setVisualMaskBlockInputEnabled(false);
        const center = this.convertWorldPositionToNodeParentLocal(mask.node, v2(geometry.x, geometry.y));
        this.stopDynamicHighlightTween();
        if (immediate) {
            this.setNodeXY(mask.node, center.x, center.y);
            this.setNodeSize(mask.node, geometry.width, geometry.height);
            return;
        }
        const transform = this.getOrAddTransform(mask.node);
        const state = {
            x: mask.node.position.x,
            y: mask.node.position.y,
            width: transform.width,
            height: transform.height,
        };
        this.highlightTween = tween(state).to(geometry.tweenDuration || 0.25, {
            x: center.x,
            y: center.y,
            width: geometry.width,
            height: geometry.height,
        }, {
            onUpdate: () => {
                this.setNodeXY(mask.node, state.x, state.y);
                this.setNodeSize(mask.node, state.width, state.height);
            }
        } as any).start();
    }

    private playDragGuideTween(positions: GuidePositions) {
        if (!this.arrow4 || !this.arrow4.active) return;
        const arrow = this.arrow4;
        const to = this.toVec3(positions.to, arrow.position.z);
        this.arrow4Tween = tween(arrow)
            .delay(0.15)
            .call(() => {
                this.setOpacity(arrow, 255);
                this.setScale(arrow, 1);
            })
            .to(0.15, { scale: new Vec3(0.92, 0.92, 0.92) } as any)
            .to(0.45, { position: to } as any)
            .delay(0.15)
            .call(() => {
                this.setOpacity(arrow, 0);
                this.setScale(arrow, 1);
                this.setNodePositionFromPoint(arrow, positions.from);
            })
            .delay(0.25)
            .call(() => this.playDragGuideTween(positions))
            .start();
    }

    private stopArrow4Tween() {
        if (this.arrow4Tween) {
            this.arrow4Tween.stop();
            this.arrow4Tween = null;
        }
        if (this.arrow4) Tween.stopAllByTarget(this.arrow4);
    }

    private getOrAddTransform(node: Node) {
        return node.getComponent(UITransform) || node.addComponent(UITransform);
    }

    private setNodeSize(node: Node, width: number, height: number) {
        this.getOrAddTransform(node).setContentSize(width, height);
    }

    private setNodeXY(node: Node, x: number, y: number) {
        node.setPosition(x, y, node.position.z);
    }

    private setNodePositionFromPoint(node: Node, point: any) {
        node.setPosition(point.x, point.y, node.position.z);
    }

    private setOpacity(node: Node, opacity: number) {
        const uiOpacity = node.getComponent(UIOpacity) || node.addComponent(UIOpacity);
        uiOpacity.opacity = opacity;
    }

    private setScale(node: Node, scale: number) {
        node.setScale(scale, scale, scale);
    }

    private convertNodeLocalToWorld(node: Node, local: Vec3) {
        const transform = node.getComponent(UITransform);
        if (!transform) return node.worldPosition.clone();
        return transform.convertToWorldSpaceAR(local);
    }

    private toVec3(point: Vec2 | Vec3 | any, z = 0) {
        return new Vec3(point.x || 0, point.y || 0, point.z || z || 0);
    }

    ensureGuideInputBlockers() {
        while (this.guideInputBlockers.length < 4) {
            const node = new Node(`guideInputBlocker${this.guideInputBlockers.length}`);
            node.addComponent(UITransform);
            node.addComponent(BlockInputEvents);
            node.parent = this.node;
            this.guideInputBlockers.push(node);
        }
        return this.guideInputBlockers;
    }
    hideGuideInputBlockers() { this.guideInputBlockers.forEach(node => node.active = false); }
    shouldBlockGuideInput() { return !!this.guideMeta && this.guideMeta.GuideType?.() !== 'fullscreen_click'; }
    updateGuideInputBlockers(maskNode: Node | null) { if (!this.shouldBlockGuideInput() || !maskNode) return this.hideGuideInputBlockers(); this.ensureGuideInputBlockers().forEach(node => node.active = true); }
    setBlockerRect(blocker: Node, parent: Node, left: number, bottom: number, width: number, height: number) { blocker.parent = parent; this.setNodeSize(blocker, width, height); this.setNodeXY(blocker, left + width / 2, bottom + height / 2); blocker.active = width > 0 && height > 0; }
    getLocalizedDialogText(text: string) { return GameKit.i18n.sel ? GameKit.i18n.sel(text) : GameKit.i18n.t(text); }
    getGuideDialogFollowX(dialog: any) { return dialog?.position.x || 0; }
    updateDialogLabelWrap(_label: Label | null, _dialog: Node | null) { return; }
    clampDialogRect(dialog: Node | null) { return dialog; }
    getStaticTileWorldPos(tileKey: string) { return this.getTileWorldPos(tileKey); }
    getOrderSubmitHighlightGeometry() { const pos = this.getOrderSubmitWorldPos(); return pos ? { center: pos, width: 120, height: 120, cornerRadius: 16 } : null; }
    getMaskGraphics(mask: Mask | null) { return mask?.subComp || null; }
    patchRoundedRectMask(mask: Mask | null) { if (mask) this.setRoundedRectMaskEnabled(mask, true, 16); }
    setRoundedRectMaskEnabled(mask: Mask | null, enabled: boolean, cornerRadius = 16) { if (!mask) return; let rounded = mask.node.getComponent(MaskRoundRect); if (enabled) { if (!rounded) rounded = mask.node.addComponent(MaskRoundRect); (rounded as any).radius = cornerRadius; } else if (rounded) rounded.destroy(); }
    drawRoundedRectMask(mask: Mask | null, cornerRadius = 16) { this.setRoundedRectMaskEnabled(mask, true, cornerRadius); }
    applyRoundedRectMaskGeometry(mask: Mask | null, geometry: any, useCircle = false) { if (!mask || !geometry) return; this.setNodeSize(mask.node, geometry.width, geometry.height); this.setRoundedRectMaskEnabled(mask, !useCircle, geometry.cornerRadius || 16); }
}
