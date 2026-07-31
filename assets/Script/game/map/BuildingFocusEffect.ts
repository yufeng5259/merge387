import { _decorator, BlockInputEvents, Camera, Component, instantiate, isValid, Node, RenderTexture, Sprite, SpriteFrame, Texture2D, UITransform, Vec3, view } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('BuildingFocusEffect')
export default class BuildingFocusEffect extends Component {
    @property focusScale = 1;
    @property blurDownsample = 0.4;
    @property blurRadius = 4;

    private focusNode: Node | null = null;
    private blurBackdrop: Node | null = null;
    private blurTexture: Texture2D | RenderTexture | null = null;
    private blurFrame: SpriteFrame | null = null;
    private focusRoot: Node | null = null;

    onLoad() {
        this.focusScale = 1;
        this.focusRoot = this.node.getChildByName('FocusBuilding');
        if (!this.focusRoot) { this.focusRoot = new Node('FocusBuilding'); this.node.addChild(this.focusRoot); }
    }
    onDisable() { this.clear(); }
    onDestroy() { this.clear(); }

    show(sourceBuildNode: Node) {
        this.clear();
        if (!this.isNodeValid(sourceBuildNode) || !this.focusRoot) return null;
        this.createBlurBackdrop(sourceBuildNode);
        const focusNode = instantiate(sourceBuildNode);
        this.focusRoot.addChild(focusNode);
        focusNode.active = true;
        focusNode.addComponent(BlockInputEvents);
        focusNode.setPosition(this.getFocusPosition(sourceBuildNode));
        this.setFocusScale(focusNode, sourceBuildNode);
        this.hideMapElementInfo(focusNode);
        this.focusNode = focusNode;
        return focusNode;
    }

    clear() {
        this.clearBlurBackdrop();
        if (this.isNodeValid(this.focusNode)) this.focusNode!.destroy();
        this.focusNode = null;
    }

    createBlurBackdrop(sourceBuildNode: Node) {
        const camera = this.getMapCamera(sourceBuildNode);
        if (!camera) return null;
        const size = this.getBackdropSize();
        if (size.width <= 0 || size.height <= 0) return null;
        const renderSize = this.getBlurRenderSize(size);
        const texture = new RenderTexture();
        try {
            texture.reset({ width: renderSize.width, height: renderSize.height });
            const previousTexture = camera.targetTexture;
            camera.targetTexture = texture;
            try {
                const render = (camera as any).render || (camera.camera as any)?.render;
                if (typeof render !== 'function') throw new Error('manual camera render unavailable');
                render.call((camera as any).render ? camera : camera.camera);
            } finally { camera.targetTexture = previousTexture; }
        } catch {
            texture.destroy();
            return null;
        }
        const backdrop = new Node('BlurBackdrop');
        this.node.addChild(backdrop);
        backdrop.setSiblingIndex(0);
        const displayTexture = this.createGaussianBlurTexture(texture, renderSize);
        if (displayTexture !== texture) texture.destroy();
        const frame = new SpriteFrame();
        frame.texture = displayTexture;
        this.addBlurSprite(backdrop, frame, size);
        this.blurBackdrop = backdrop;
        this.blurTexture = displayTexture;
        this.blurFrame = frame;
        return backdrop;
    }

    clearBlurBackdrop() {
        if (this.isNodeValid(this.blurBackdrop)) this.blurBackdrop!.destroy();
        this.blurFrame?.destroy();
        this.blurTexture?.destroy();
        this.blurBackdrop = null;
        this.blurTexture = null;
        this.blurFrame = null;
    }

    getBackdropSize() {
        const transform = this.node.parent?.getComponent(UITransform);
        const visible = view.getVisibleSize();
        return { width: transform?.contentSize.width || visible.width, height: transform?.contentSize.height || visible.height };
    }

    getBlurRenderSize(size: { width: number; height: number }) {
        const pixelSize = view.getVisibleSizeInPixel();
        let downsample = Number(this.blurDownsample);
        if (!Number.isFinite(downsample) || downsample <= 0 || downsample > 1) downsample = 0.4;
        return { width: Math.max(1, Math.round((pixelSize.width || size.width) * downsample)), height: Math.max(1, Math.round((pixelSize.height || size.height) * downsample)) };
    }

    createGaussianBlurTexture(sourceTexture: RenderTexture, size: { width: number; height: number }) {
        try {
            const pixels = sourceTexture.readPixels();
            if (!pixels || pixels.length < size.width * size.height * 4) return sourceTexture;
            const texture = new Texture2D();
            texture.reset({ width: size.width, height: size.height, format: Texture2D.PixelFormat.RGBA8888 });
            texture.uploadData(this.blurPixels(pixels, size.width, size.height, this.getBlurRadius()));
            return texture;
        } catch { return sourceTexture; }
    }

    getBlurRadius() { let radius = Number(this.blurRadius); if (!Number.isFinite(radius) || radius < 1) radius = 4; return Math.min(Math.round(radius), 12); }

    blurPixels(pixels: Uint8Array, width: number, height: number, radius: number) {
        const weights = this.getGaussianWeights(radius);
        const temp = new Uint8Array(pixels.length);
        const output = new Uint8Array(pixels.length);
        for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
            const index = (y * width + x) * 4;
            for (let channel = 0; channel < 4; channel++) {
                let sum = 0;
                for (let offset = -radius; offset <= radius; offset++) {
                    const sampleX = Math.min(Math.max(x + offset, 0), width - 1);
                    sum += pixels[(y * width + sampleX) * 4 + channel] * weights[offset + radius];
                }
                temp[index + channel] = Math.round(sum);
            }
        }
        for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
            const index = (y * width + x) * 4;
            for (let channel = 0; channel < 4; channel++) {
                let sum = 0;
                for (let offset = -radius; offset <= radius; offset++) {
                    const sampleY = Math.min(Math.max(y + offset, 0), height - 1);
                    sum += temp[(sampleY * width + x) * 4 + channel] * weights[offset + radius];
                }
                output[index + channel] = Math.round(sum);
            }
        }
        return output;
    }

    getGaussianWeights(radius: number) {
        const sigma = Math.max(radius * 0.5, 1);
        const weights: number[] = [];
        let total = 0;
        for (let offset = -radius; offset <= radius; offset++) { const weight = Math.exp(-(offset * offset) / (2 * sigma * sigma)); weights.push(weight); total += weight; }
        return weights.map(weight => weight / total);
    }

    addBlurSprite(parent: Node, frame: SpriteFrame, size: { width: number; height: number }) {
        const sample = new Node('BlurSprite');
        parent.addChild(sample);
        const sprite = sample.addComponent(Sprite);
        sprite.spriteFrame = frame;
        sprite.sizeMode = Sprite.SizeMode.CUSTOM;
        sample.addComponent(UITransform).setContentSize(size.width, size.height);
    }

    getFocusPosition(sourceBuildNode: Node) {
        const sourceTransform = sourceBuildNode.getComponent(UITransform);
        let worldPos = sourceTransform ? sourceTransform.convertToWorldSpaceAR(new Vec3()) : sourceBuildNode.worldPosition.clone();
        const camera = this.getMapCamera(sourceBuildNode);
        if (camera) worldPos = camera.worldToScreen(worldPos);
        return this.node.getComponent(UITransform)?.convertToNodeSpaceAR(worldPos) || new Vec3();
    }

    getMapCamera(sourceBuildNode: Node): (Camera & { zoomRatio?: number }) | null {
        const mapNode = sourceBuildNode.parent?.parent;
        const controller = mapNode?.getComponent('MapControlle') as any;
        return controller?.camera || null;
    }

    setFocusScale(focusNode: Node, sourceBuildNode: Node) {
        let scale = Number(this.focusScale);
        if (!Number.isFinite(scale) || scale <= 0) scale = 1;
        let cameraScale = Number(this.getMapCamera(sourceBuildNode)?.zoomRatio);
        if (!Number.isFinite(cameraScale) || cameraScale <= 0) cameraScale = 1;
        const sourceScale = sourceBuildNode.scale;
        focusNode.setScale(sourceScale.x * cameraScale * scale, sourceScale.y * cameraScale * scale, sourceScale.z);
    }

    hideMapElementInfo(focusNode: Node) {
        const mapElementNode = focusNode.getComponent('MapElementNode') as any;
        mapElementNode?.hideNode?.();
    }

    isNodeValid(node: Node | null) { return !!(node && isValid(node)); }
}
