import { _decorator, Animation, BlockInputEvents, Color, Graphics, isValid, Label, Mask, Node, RichText, Sprite, Tween, tween, UIOpacity, UITransform, v2, Vec2, Vec3 } from 'cc';
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
    @property(Node) skipNode: Node | null = null;

    meta: any = null;
    guideMeta: any = null;
    guidepos: Vec3 | null = null;
    dragGuidePositionKey = '';
    private arrow4Tween: Tween<Node> | null = null;
    private highlightTween: Tween<any> | null = null;
    private guideInputBlockers: Node[] = [];
    private guideGenNode: Node | null = null;
    private highlightFrameNode: Node | null = null;
    private highlightFrameGraphics: Graphics | null = null;
    private skipConfirmShowing = false;

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
        const sameView = this.isSameTutorialView(meta, guideMeta);
        this.meta = meta;
        this.guideMeta = guideMeta;
        this.clearView({ keepDialog: sameView });
        if (!this.meta) return;
        this.setVisualMaskBlockInputEnabled(false);
        if (this.guideMeta) {
            this.showMask(this.guideMeta.Mask());
            this.showDialog(this.guideMeta.DialogText(), this.guideMeta.DialogRect(), { skipAnim: sameView });
            this.showHighlightByGuide();
            this.showGuidePointer();
        }
        this.showSkipNode();
        this.refreshFullScreenGuideBlocker();
        if (this.meta.CompleteType && this.meta.CompleteType() === 'fullscreen_click') {
            this.addFullScreenOnClick(function() {
                Game.MergeTutorialManager.Emit('fullscreen_click');
            });
        }
    }

    clearView(options: any = {}) {
        [this.arrow1, this.arrow2, this.arrow3, this.arrow4, this.arrow5].forEach((node) => {
            if (!node) return;
            Tween.stopAllByTarget(node);
            node.active = false;
            this.setOpacity(node, 255);
            this.setScale(node, 1);
        });
        this.stopDynamicHighlightTween();
        this.stopArrow4Tween();
        if (!options.keepDialog) {
            if (this.dialog) this.dialog.active = false;
            if (this.dialog2) this.dialog2.active = false;
        }
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
        this.hideHighlightFrame();
        if (this.clickFullScreen) {
            this.clickFullScreen.off('click');
            this.clickFullScreen.active = false;
        }
        if (this.dialog2Btn) {
            this.dialog2Btn.off('click');
        }
        this.hideSkipNode();
        if (this.startTitle) this.startTitle.active = false;
        if (this.guide) {
            Tween.stopAllByTarget(this.guide);
            this.guide.active = false;
        }
        this.dragGuidePositionKey = '';
        this.hideGuideInputBlockers();
        const guideGen = this.getGuideGenNode();
        if (guideGen) {
            Tween.stopAllByTarget(guideGen);
            guideGen.active = false;
        }
    }

    getMetaId(meta: any) { return meta?.Id ? String(meta.Id()) : ''; }
    getTutorialViewKey(meta: any, guideMeta: any) { return `${this.getMetaId(meta)}:${this.getMetaId(guideMeta)}`; }
    isSameTutorialView(meta: any, guideMeta: any) { return !!this.meta && this.getTutorialViewKey(this.meta, this.guideMeta) === this.getTutorialViewKey(meta, guideMeta); }

    getGuideGenNode() {
        if (this.guideGenNode && isValid(this.guideGenNode)) return this.guideGenNode;
        this.guideGenNode = this.node?.getChildByName('guide_gen') || null;
        return this.guideGenNode;
    }

    getGuideGenIconSprite() {
        const guideGen = this.getGuideGenNode();
        const icon = guideGen?.getChildByName('genNode') || guideGen?.getChildByName('icon');
        return icon ? (icon.getComponent(Sprite) || icon.addComponent(Sprite)) : null;
    }

    setGuideGenIcon(mergeId: any) {
        const sprite = this.getGuideGenIconSprite();
        const frame = Game.MergeTutorialManager?.GetSpriteFrameByMergeId?.(mergeId);
        if (!sprite || !frame) return false;
        sprite.spriteFrame = frame;
        const transform = sprite.node.getComponent(UITransform) || sprite.node.addComponent(UITransform);
        if (!transform.width || !transform.height) {
            const size = frame.originalSize || frame.rect || { width: 86, height: 86 };
            transform.setContentSize(transform.width || size.width || 86, transform.height || size.height || 86);
        }
        return true;
    }

    retryGeneratorRewardFly(mergeId: any, cb?: Function, retryCount = 0) {
        this.scheduleOnce(() => {
            if (!isValid(this.node)) return cb?.();
            this.playGeneratorRewardFly(mergeId, cb, retryCount + 1);
        }, 0.05);
    }

    playGeneratorRewardFly(mergeId: any, cb?: Function, retryCount = 0) {
        const guideGen = this.getGuideGenNode();
        const points = Game.MergeTutorialManager?.GetGeneratorRewardFlyPoints?.();
        if (!guideGen || !points) {
            cb?.();
            return false;
        }
        this.setGuideGenIcon(mergeId);
        const from = this.convertWorldPositionToNodeParentLocal(guideGen, points.from);
        const center = this.convertWorldPositionToNodeParentLocal(guideGen, points.center);
        const to = this.convertWorldPositionToNodeParentLocal(guideGen, points.to);
        if (!from || !center || !to) {
            guideGen.active = false;
            if (retryCount < 20) {
                this.retryGeneratorRewardFly(mergeId, cb, retryCount);
                return true;
            }
            cb?.();
            return false;
        }
        Tween.stopAllByTarget(guideGen);
        Game.MergeTutorialManager?.SetTempRewardVisibleForGuide?.(false);
        guideGen.active = true;
        guideGen.setScale(1, 1, 1);
        guideGen.setPosition(this.toVec3(from));
        const effect = guideGen.getChildByName('effect');
        if (effect) effect.active = true;
        tween(guideGen).delay(1).to(0.5, { position: this.toVec3(center) } as any)
            .to(0.35, { scale: new Vec3(1.4, 1.4, 1.4) } as any).to(0.35, { scale: Vec3.ONE } as any)
            .to(0.5, { position: this.toVec3(to) } as any).call(() => {
                guideGen.active = false;
                Game.MergeTutorialManager?.SetTempRewardVisibleForGuide?.(true);
                cb?.();
            }).start();
        return true;
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

    showDialog(text: string, rect: string, options: any = {}) {
        if (!text) return;
        const dialog = this.dialog || this.dialog2;
        const label = this.dialogLabel || this.dialog2Label;
        if (!dialog || !label) return;
        dialog.active = true;
        if (rect) {
            const parsed = this.parseDialogRect(rect);
            if (parsed) {
                this.setNodeXY(dialog, parsed.x, parsed.y);
                this.setNodeSize(dialog, parsed.width, parsed.height);
                this.clampDialogRect(dialog);
            }
        }
        this.updateDialogLabelWrap(label, dialog);
        label.string = this.getLocalizedDialogText(text).replace(/\\n/g, '\n');
        Tween.stopAllByTarget(dialog);
        if (options.skipAnim) this.setScale(dialog, 1);
        else {
            this.setScale(dialog, 0.001);
            tween(dialog).to(0.2, { scale: new Vec3(1, 1, 1) } as any).start();
        }
        if (this.guide && this.guidepos) {
            this.guide.active = true;
            Tween.stopAllByTarget(this.guide);
            const guidePosition = new Vec3(this.getGuideDialogFollowX(dialog), dialog.position.y, this.guide.position.z);
            if (options.skipAnim) this.guide.setPosition(guidePosition);
            else tween(this.guide).to(0.35, { position: guidePosition } as any).start();
        }
    }

    parseDialogRect(rect: any) {
        if (!rect) return null;
        const text = String(rect).trim();
        let values: number[] = [];
        if (text.includes(',')) values = text.split(',').map(value => Number.parseInt(value, 10));
        else if (/^\d{9,}$/.test(text)) {
            const pos = text.slice(0, -6);
            values = [Number.parseInt(pos.slice(0, 2), 10), Number.parseInt(pos.slice(2) || '0', 10),
                Number.parseInt(text.slice(-6, -3), 10), Number.parseInt(text.slice(-3), 10)];
        }
        return values.length >= 4 && values.slice(0, 4).every(Number.isFinite)
            ? { x: values[0], y: values[1], width: values[2], height: values[3] } : null;
    }

    showGuidePointer() {
        if (!this.guideMeta) return;
        const type = this.guideMeta.GuideType();
        if (type === 'drag') {
            this.showDragGuide();
        } else if (type === 'click') {
            if (this.guideMeta.TargetType && this.guideMeta.TargetType() === 'node') {
                this.showClickGuide(this.getNodeWorldPos(this.guideMeta.TargetFrom()), this.guideMeta.TargetFrom());
            } else {
                this.showClickGuide(this.getTileWorldPos(this.guideMeta.TargetFrom()), this.guideMeta.TargetFrom());
            }
        } else if (type === 'order_submit') {
            this.showClickGuide(this.getOrderSubmitWorldPos());
        }
    }

    showClickGuide(worldPos: any, targetKey?: string) {
        if (!this.arrow5 || !worldPos) return;
        this.applyClickGuidePosition(worldPos, targetKey);
        this.arrow5.active = true;
        const anim = this.arrow5.getComponent(Animation);
        if (anim) (anim as any).setCurrentTime(0);
    }

    applyClickGuidePosition(worldPos: any, targetKey?: string) {
        if (!this.arrow5 || !worldPos) return;
        const pos = this.convertWorldPositionToNodeParentLocal(this.arrow5, worldPos);
        const transform = this.getClickGuideTransform(targetKey);
        this.setNodeXY(this.arrow5, pos.x + transform.x, pos.y + transform.y);
        this.arrow5.angle = transform.rotation;
    }

    getClickGuideTransform(targetKey?: string) {
        const key = this.normalizeGuideTargetKey(targetKey);
        return key === 'back_to_board_button' || key === 'town_button'
            ? { x: 0, y: 0, rotation: 180 } : { x: 0, y: 0, rotation: 0 };
    }

    refreshFullScreenGuideBlocker() {
        if (this.clickFullScreen && Game.MergeTutorialManager?.ShouldUseFullScreenGuideBlocker?.()) this.clickFullScreen.active = true;
    }

    normalizeGuideTargetKey(targetKey: any) {
        return Game.MergeTutorialManager?.NormalizeOrderParam?.(targetKey) ?? (targetKey == null ? '' : String(targetKey).trim());
    }

    isMainForcedTutorialMeta() { return !!Game.MergeTutorialManager?.IsMainForcedTutorialStep?.(this.meta); }

    shouldShowSkipNode() {
        return Game.MergeTutorialManager?.ShouldShowSkipButton?.(this.meta) ?? this.isMainForcedTutorialMeta();
    }

    showSkipNode() {
        if (!this.skipNode) return;
        this.hideSkipNode();
        if (!this.shouldShowSkipNode()) return;
        this.skipNode.active = true;
        this.updateSkipNodeBottomRightPosition();
        this.bringSkipNodeToTop();
        this.skipNode.on(Node.EventType.TOUCH_END, this.onSkipTouchEnd, this);
    }

    updateSkipNodeBottomRightPosition() {
        if (!this.skipNode) return;
        const parentTransform = (this.skipNode.parent || this.node).getComponent(UITransform);
        const skipTransform = this.skipNode.getComponent(UITransform);
        const height = (skipTransform?.height || 0) * Math.abs(this.skipNode.scale.y || 1);
        this.skipNode.setPosition(0, -(parentTransform?.height || 0) / 2 + height / 2 + 20);
    }

    skipCurrentTutorial() {
        if (Game.MergeTutorialManager?.SkipCurrentTutorial) return Game.MergeTutorialManager.SkipCurrentTutorial();
        if (!Game.MergeTutorialManager?.SkipForcedTutorial) return false;
        Game.MergeTutorialManager.SkipForcedTutorial();
        return true;
    }

    bringSkipNodeToTop() {
        if (this.skipNode?.active && this.skipNode.parent) this.skipNode.setSiblingIndex(this.skipNode.parent.children.length - 1);
    }

    hideSkipNode() {
        if (!this.skipNode) return;
        this.skipNode.off(Node.EventType.TOUCH_END, this.onSkipTouchEnd, this);
        this.skipNode.active = false;
        this.skipConfirmShowing = false;
    }

    onSkipTouchEnd() {
        if (!this.skipNode?.active || this.skipConfirmShowing) return;
        this.skipConfirmShowing = true;
        this.hideForSkipConfirm();
        UIRoot.instance.openChildWindow('DialogWindow', {
            titleStr: GameKit.i18n.t('GuestConfirmTitle'), msg: GameKit.i18n.t('Guide_Skip'), confirmStr: GameKit.i18n.t('Yes'),
            confirmFunc: () => { this.skipConfirmShowing = false; if (this.skipNode) this.skipNode.active = false; this.skipCurrentTutorial(); },
            cancelStr: GameKit.i18n.t('Cancel'), cancelFunc: () => { this.skipConfirmShowing = false; this.restoreFromSkipConfirm(); },
        });
    }

    hideForSkipConfirm() { if (this.node) this.node.active = false; }
    restoreFromSkipConfirm() { if (this.node && isValid(this.node)) { this.node.active = true; this.showMeta(this.meta, this.guideMeta); } }

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
                if (pos) {
                    const geometry = Game.MergeTutorialManager?.BuildTileHighlightGeometry?.(pos) ||
                        { shape: 'circle', x: pos.x, y: pos.y, width: 215, height: 215 };
                    this.applyDynamicHighlightGeometry(geometry, true);
                }
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
            if (!pos) return;
            const geometry = this.getOrderSubmitHighlightGeometry() ||
                Game.MergeTutorialManager?.BuildOrderHighlightGeometry?.(pos) ||
                { shape: 'circle', x: pos.x, y: pos.y, width: 120, height: 120 };
            this.applyDynamicHighlightGeometry(geometry, true);
        } else if (type === 'node') {
            const list = this.guideMeta.HighlightParamList ? this.guideMeta.HighlightParamList() : [];
            const target = list.length > 0 ? list[0] : (this.guideMeta.HighlightParam() || this.guideMeta.TargetFrom());
            const geometry = this.getNodeHighlightGeometry(target);
            if (geometry) this.applyDynamicHighlightGeometry(geometry, true);
        }
    }

    applyTwoPointHighlight(from: any, to: any, immediate: boolean) {
        if (this.shouldUseGeneratorMergeDragRectHighlight() && this.applyGeneratorMergeDragRectHighlight(from, to, immediate)) return;
        const geometry = Game.MergeTutorialManager && Game.MergeTutorialManager.BuildDynamicHighlightGeometry
            ? Game.MergeTutorialManager.BuildDynamicHighlightGeometry(from, to)
            : null;
        if (!geometry) return;
        this.applyDynamicHighlightGeometry(geometry, immediate !== false);
    }

    shouldUseGeneratorMergeDragRectHighlight() {
        if (this.guideMeta?.GuideType?.() !== 'drag' || !this.meta) return false;
        return this.meta.Id?.() === 1050040 || String(this.meta.CompleteParam?.() || '') === 'dynamic_claimed_101004>dynamic_board_101004';
    }

    applyGeneratorMergeDragRectHighlight(from: any, to: any, immediate: boolean) {
        const geometry = Game.MergeTutorialManager?.BuildGeneratorMergeDragHighlightGeometry?.(from, to);
        if (!geometry) return false;
        this.applyDynamicHighlightGeometry(geometry, immediate !== false);
        return true;
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
            const pos = this.getNodeWorldPos(this.guideMeta.TargetFrom());
            if (pos) this.applyClickGuidePosition(pos, this.guideMeta.TargetFrom());
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
        const useStaticTile = !useNode && !!Game.MergeTutorialManager?.ShouldUseStaticMergeDragGuideTiles?.();
        const resolve = useNode
            ? (key: string) => this.getNodeWorldPos(key)
            : useStaticTile
                ? (key: string) => this.getStaticTileWorldPos(key)
                : (key: string) => this.getTileWorldPos(key);
        const from = resolve(fromKey);
        const to = resolve(toKey);
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
        if (useCircle) this.setRoundedRectMaskEnabled(this.highLightMask, false);
        this.setVisualMaskBlockInputEnabled(false);
        const center = this.convertWorldPositionToNodeParentLocal(mask.node, v2(geometry.x, geometry.y));
        this.stopDynamicHighlightTween();
        this.applyRoundedRectMaskGeometry(mask, geometry, useCircle);
        if (immediate) {
            this.setNodeXY(mask.node, center.x, center.y);
            this.setNodeSize(mask.node, geometry.width, geometry.height);
            this.applyRoundedRectMaskGeometry(mask, geometry, useCircle);
            this.updateGuideInputBlockers(mask.node);
            this.updateHighlightFrame(mask.node, geometry, useCircle);
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
        } as any).call(() => {
            this.applyRoundedRectMaskGeometry(mask, geometry, useCircle);
            this.updateGuideInputBlockers(mask.node);
            this.updateHighlightFrame(mask.node, geometry, useCircle);
        }).start();
        this.updateGuideInputBlockers(mask.node);
        this.updateHighlightFrame(mask.node, geometry, useCircle);
    }

    isHighlightFrameEnabled() { return !!Game.MergeTutorialManager?.HighlightFrameEnabled; }
    getHighlightFrameColor() { return Game.MergeTutorialManager?.HighlightFrameColor || new Color(174, 255, 58, 255); }
    getHighlightFrameLineWidth() { return Game.MergeTutorialManager?.HighlightFrameLineWidth || 6; }
    getHighlightFramePadding() { return Game.MergeTutorialManager?.HighlightFramePadding || 0; }

    ensureHighlightFrameNode() {
        if (!this.highlightFrameNode || !isValid(this.highlightFrameNode)) {
            this.highlightFrameNode = new Node('highlight_frame');
            this.highlightFrameNode.addComponent(UITransform);
            this.highlightFrameGraphics = this.highlightFrameNode.addComponent(Graphics);
        }
        if (this.highlightFrameNode.parent !== this.node) this.highlightFrameNode.parent = this.node;
        this.highlightFrameNode.active = true;
        this.refreshHighlightFrameLayer();
        return this.highlightFrameNode;
    }

    refreshHighlightFrameLayer() {
        if (this.highlightFrameNode?.active && this.highlightFrameNode.parent) this.highlightFrameNode.setSiblingIndex(this.getHighlightFrameSiblingIndex());
    }

    getHighlightFrameSiblingIndex() {
        if (!this.highlightFrameNode?.parent) return 0;
        const parent = this.highlightFrameNode.parent;
        const front = [this.arrow1, this.arrow2, this.arrow3, this.arrow4, this.arrow5, this.dialog, this.dialog2,
            this.clickFullScreen, this.startTitle, this.guide, this.EmptyTaskGuide, this.skipNode]
            .filter((node): node is Node => !!node && node.parent === parent && node !== this.highlightFrameNode)
            .map(node => node.getSiblingIndex());
        if (front.length) return Math.min(...front);
        const back = [this.highLightMask?.node, this.circleLightMask?.node, ...(this.highLightSpecial || [])]
            .filter((node): node is Node => !!node && node.parent === parent && node !== this.highlightFrameNode)
            .map(node => node.getSiblingIndex());
        return back.length ? Math.max(...back) + 1 : 0;
    }

    hideHighlightFrame() {
        this.highlightFrameGraphics?.clear();
        if (this.highlightFrameNode) this.highlightFrameNode.active = false;
    }

    drawHighlightFrame(graphics: Graphics, geometry: any, useCircle: boolean) {
        const padding = this.getHighlightFramePadding();
        const width = Math.max(0, geometry.width + padding * 2);
        const height = Math.max(0, geometry.height + padding * 2);
        const radius = Math.max(0, (geometry.cornerRadius || 0) + padding);
        graphics.clear();
        graphics.lineWidth = this.getHighlightFrameLineWidth();
        graphics.strokeColor = this.getHighlightFrameColor();
        if (useCircle) graphics.circle(0, 0, Math.max(width, height) / 2);
        else graphics.roundRect(-width / 2, -height / 2, width, height, radius);
        graphics.stroke();
    }

    updateHighlightFrame(maskNode: Node, geometry: any, useCircle: boolean) {
        if (!this.isHighlightFrameEnabled() || !maskNode || !geometry) return this.hideHighlightFrame();
        const node = this.ensureHighlightFrameNode();
        const world = maskNode.parent?.getComponent(UITransform)?.convertToWorldSpaceAR(maskNode.position) || maskNode.worldPosition;
        const local = this.node.getComponent(UITransform)?.convertToNodeSpaceAR(world) || maskNode.position;
        node.setPosition(local);
        this.setNodeSize(node, geometry.width, geometry.height);
        this.drawHighlightFrame(this.highlightFrameGraphics!, geometry, useCircle);
        this.refreshHighlightFrameLayer();
        this.bringSkipNodeToTop();
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
    shouldBlockGuideInput() { return !!Game.MergeTutorialManager?.ShouldBlockGuideInput?.(); }
    updateGuideInputBlockers(maskNode: Node | null) {
        if (!this.shouldBlockGuideInput() || !maskNode) {
            this.hideGuideInputBlockers();
            this.refreshHighlightFrameLayer();
            return;
        }
        const blockers = this.ensureGuideInputBlockers();
        const parent = maskNode.parent || this.node;
        const parentSize = parent.getComponent(UITransform)?.contentSize || view.getVisibleSize();
        const maskSize = maskNode.getComponent(UITransform)?.contentSize;
        const radiusX = Math.max(0, (maskSize?.width || 0) * Math.abs(maskNode.scale.x || 1) / 2);
        const radiusY = Math.max(0, (maskSize?.height || 0) * Math.abs(maskNode.scale.y || 1) / 2);
        const { x: cx, y: cy } = maskNode.position;
        const minX = -parentSize.width / 2;
        const maxX = parentSize.width / 2;
        const minY = -parentSize.height / 2;
        const maxY = parentSize.height / 2;
        const left = cx - radiusX;
        const right = cx + radiusX;
        const bottom = cy - radiusY;
        const top = cy + radiusY;
        this.setBlockerRect(blockers[0], parent, minX, minY, Math.max(0, left - minX), parentSize.height);
        this.setBlockerRect(blockers[1], parent, right, minY, Math.max(0, maxX - right), parentSize.height);
        this.setBlockerRect(blockers[2], parent, left, top, Math.max(0, right - left), Math.max(0, maxY - top));
        this.setBlockerRect(blockers[3], parent, left, minY, Math.max(0, right - left), Math.max(0, bottom - minY));
        this.refreshHighlightFrameLayer();
        this.bringSkipNodeToTop();
    }
    setBlockerRect(blocker: Node, parent: Node, left: number, bottom: number, width: number, height: number) {
        if (blocker.parent !== parent) blocker.parent = parent;
        blocker.setSiblingIndex(parent.children.length - 1);
        this.setNodeSize(blocker, width, height);
        this.setNodeXY(blocker, left + width / 2, bottom + height / 2);
        blocker.active = width > 0 && height > 0;
    }
    getLocalizedDialogText(text: string) {
        try {
            const textData = JSON.parse(text.trim());
            return GameKit.i18n.sel ? GameKit.i18n.sel(textData) : text;
        } catch {
            return text;
        }
    }
    getGuideDialogFollowX(dialog: Node | null) {
        if (!dialog) return this.guidepos?.x || 0;
        const width = dialog.getComponent(UITransform)?.contentSize.width;
        return width == null ? (this.guidepos?.x || 0) : -width / 2;
    }
    updateDialogLabelWrap(label: Label | null, dialog: Node | null) {
        const dialogTransform = dialog?.getComponent(UITransform);
        if (!label || !dialogTransform) return;
        const width = Math.max(0, dialogTransform.contentSize.width - 60);
        const legacyLabel = label as Label & { maxWidth?: number };
        if (legacyLabel.maxWidth != null) legacyLabel.maxWidth = width;
        const labelTransform = label.node.getComponent(UITransform);
        if (labelTransform) labelTransform.setContentSize(width, labelTransform.contentSize.height);
        const position = label.node.position;
        label.node.setPosition(0, position.y, position.z);
    }
    clampDialogRect(dialog: Node | null) {
        if (!dialog) return;
        const transform = dialog.getComponent(UITransform);
        if (!transform) return;
        const parent = dialog.parent || this.node;
        const parentSize = parent.getComponent(UITransform)?.contentSize || view.getVisibleSize();
        const margin = 12;
        const maxWidth = Math.max(120, parentSize.width - margin * 2);
        if (transform.contentSize.width > maxWidth) transform.setContentSize(maxWidth, transform.contentSize.height);
        const halfWidth = transform.contentSize.width / 2;
        const halfHeight = transform.contentSize.height / 2;
        const minX = -parentSize.width / 2 + halfWidth + margin;
        const maxX = parentSize.width / 2 - halfWidth - margin;
        const minY = -parentSize.height / 2 + halfHeight + margin;
        const maxY = parentSize.height / 2 - halfHeight - margin;
        const position = dialog.position;
        dialog.setPosition(
            minX <= maxX ? Math.max(minX, Math.min(maxX, position.x)) : position.x,
            minY <= maxY ? Math.max(minY, Math.min(maxY, position.y)) : position.y,
            position.z,
        );
    }
    getStaticTileWorldPos(tileKey: string) {
        const levelNode = Game.MergeTutorialManager?.GetMergeLevelNode?.();
        if (!levelNode?.node || !tileKey) return null;
        const normalized = Game.MergeTutorialManager?.NormalizeTileKey?.(tileKey) || tileKey;
        const parts = normalized.split('_');
        if (parts.length !== 2 || !levelNode.getMergeBoardLayout) return null;
        const x = Number.parseInt(parts[0], 10);
        const y = Number.parseInt(parts[1], 10);
        if (Number.isNaN(x) || Number.isNaN(y)) return null;
        const position = GameKit.MergeUtil.tile2px(x, y, levelNode.getMergeBoardLayout());
        return this.convertNodeLocalToWorld(levelNode.node, this.toVec3(position));
    }
    getOrderSubmitHighlightGeometry() {
        return Game.MergeTutorialManager?.GetOrderSubmitHighlightGeometry?.() || null;
    }
    getMaskGraphics(mask: Mask | null) { return mask?.subComp || null; }
    patchRoundedRectMask(mask: Mask | null) { if (mask) this.setRoundedRectMaskEnabled(mask, true, 16); }
    setRoundedRectMaskEnabled(mask: Mask | null, enabled: boolean, cornerRadius = 16) { if (!mask) return; let rounded = mask.node.getComponent(MaskRoundRect); if (enabled) { if (!rounded) rounded = mask.node.addComponent(MaskRoundRect); (rounded as any).radius = cornerRadius; } else if (rounded) rounded.destroy(); }
    drawRoundedRectMask(mask: Mask | null, cornerRadius = 16) { this.setRoundedRectMaskEnabled(mask, true, cornerRadius); }
    applyRoundedRectMaskGeometry(mask: Mask | null, geometry: any, useCircle = false) { if (!mask || !geometry) return; this.setNodeSize(mask.node, geometry.width, geometry.height); this.setRoundedRectMaskEnabled(mask, !useCircle, geometry.cornerRadius || 16); }
}
