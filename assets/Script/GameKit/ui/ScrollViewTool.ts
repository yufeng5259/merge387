import { _decorator, Component, instantiate, Layout, Node, Prefab, ScrollView, Tween, tween, UITransform, Vec3 } from 'cc';
import { DEV } from 'cc/env';
import { ScrollViewItem } from './ScrollViewItem';

const { ccclass, property, requireComponent } = _decorator;

type ScrollViewItemId = Parameters<ScrollViewItem['setData']>[1];
type ScrollViewInitFunc = ((index: number, id: ScrollViewItemId, node: Node) => void) | null;

interface ScrollViewToolOptions {
    noLazy?: boolean;
    noImeUpdate?: boolean;
}

type ScrollViewWithScrollBarRefresh = ScrollView & {
    _updateScrollBar?: (outOfBoundary: unknown) => void;
    _getHowMuchOutOfBoundary?: () => unknown;
};

function getTransform(node: Node | null | undefined): UITransform | null {
    return node ? node.getComponent(UITransform) : null;
}

function ensureTransform(node: Node): UITransform {
    return node.getComponent(UITransform) || node.addComponent(UITransform);
}

function nodeWidth(node: Node | null | undefined): number {
    return getTransform(node)?.width || 0;
}

function nodeHeight(node: Node | null | undefined): number {
    return getTransform(node)?.height || 0;
}

function nodeAnchorX(node: Node | null | undefined): number {
    return getTransform(node)?.anchorX || 0;
}

function nodeAnchorY(node: Node | null | undefined): number {
    return getTransform(node)?.anchorY || 0;
}

function setNodeWidth(node: Node, width: number): void {
    const transform = ensureTransform(node);
    transform.setContentSize(width, transform.height);
}

function setNodeHeight(node: Node, height: number): void {
    const transform = ensureTransform(node);
    transform.setContentSize(transform.width, height);
}

function setNodeX(node: Node, x: number): void {
    node.setPosition(x, node.position.y, node.position.z);
}

function setNodeY(node: Node, y: number): void {
    node.setPosition(node.position.x, y, node.position.z);
}

@ccclass('ScrollViewTool')
@requireComponent(ScrollView)
export class ScrollViewTool extends Component {
    @property(ScrollViewItem)
    public item: ScrollViewItem | null = null;

    @property(Prefab)
    public prefab: Prefab | null = null;

    @property
    public startPos = 0;

    @property
    public maxReuse = 0;

    @property
    public centerOnChild = false;

    @property
    public testNumber = 0;

    public scrollView: ScrollView | null = null;
    public itemnode: Node | null = null;
    public itemsContent: Node | null = null;
    public items: Record<string, Node> = {};
    public data: ScrollViewItemId[] = [];
    public initFunc: ScrollViewInitFunc = null;
    public itemSize = 0;
    public reuseInited = false;
    public reuseUpdateTimer = 0;
    public reuseBufferZoneUp = 0;
    public reuseBufferZoneDown = 0;
    public lastContentPos = 0;

    public onLoad(): void {
        this.scrollView = this.getComponent(ScrollView);
        if (this.item) this.item.node.active = false;
        this.itemnode = this.item ? this.item.node : this.prefab?.data || null;
        this.items = {};

        if (this.centerOnChild && this.scrollView) {
            this.startPos = nodeWidth(this.scrollView.node) / 2;
            if (this.scrollView.vertical) this.startPos = -nodeHeight(this.scrollView.node) / 2;
        }

        this.node.on(ScrollView.EventType.SCROLL_ENDED, this.onScrollEnded, this);
    }

    public onDestroy(): void {
        this.node.off(ScrollView.EventType.SCROLL_ENDED, this.onScrollEnded, this);
        const content = this.scrollView?.content;
        if (content) Tween.stopAllByTarget(content);
    }

    public start(): void {
        if (DEV && this.testNumber > 0) {
            const data: number[] = [];
            for (let i = 0; i < this.testNumber; i++) data.push(i);
            this.setItem(data, nullFunction);
        }
    }

    public update(dt: number): void {
        if (this.maxReuse > 0) this.reuseUpdate(dt);
    }

    public setItem(data: ScrollViewItemId[], initFunc: ScrollViewInitFunc, options: ScrollViewToolOptions = {}): void {
        const content = this.scrollView?.content;
        if (!content) return;

        this.clear();
        const opts = options || {};
        this.data = data || [];
        this.initFunc = initFunc;

        if (content.getComponent(Layout)) {
            this.itemsContent = content;
            this.itemsContent.destroyAllChildren();
        }

        if (!this.itemsContent) {
            this.itemsContent = instantiate(content);
            this.itemsContent.parent = content;
            this.itemsContent.setPosition(0, 0, 0);
            this.itemsContent.destroyAllChildren();
        }

        this.itemnode = this.item ? this.item.node : this.prefab?.data || this.itemnode;
        this.itemSize = this.scrollView?.vertical ? nodeHeight(this.itemnode) : nodeWidth(this.itemnode);

        if (this.maxReuse > 0) {
            if (!this.reuseInited) this.initializeReuse();
            this.reuseSetInitFunc(initFunc);
            this.reuseSetData(this.data, opts);
        } else {
            this.data.forEach((id, index) => {
                const itemHandle = this.createItemNode();
                if (!itemHandle || !this.itemsContent) return;

                itemHandle.active = true;
                itemHandle.parent = this.itemsContent;
                this.items[index] = itemHandle;
                this.setItemNodePosition(itemHandle, index);

                const scItem = this.ensureScrollViewItem(itemHandle);
                scItem.index = index;
                scItem.id = id;
                scItem.scrollViewTool = this;
                scItem.noLazy = !!opts.noLazy;
                scItem.registerInit(initFunc);
                if (!opts.noImeUpdate) scItem.update(0);
            });
        }

        this.ResetContentSize();
    }

    public addItem(data: ScrollViewItemId[], initFunc: ScrollViewInitFunc): void {
        let index = this.data.length;
        this.data = this.data.concat(data);
        this.ResetContentSize();

        if (this.maxReuse > 0) {
            this.reuseUpdate(1);
            for (let i = 0; i < this.maxReuse; ++i) {
                const itemHandle = this.items[i];
                if (!itemHandle) continue;
                const scItem = this.ensureScrollViewItem(itemHandle);
                scItem.setData(scItem.index, this.data[scItem.index]);
                scItem.update(0);
            }
            return;
        }

        const content = this.scrollView?.content;
        if (!content) return;

        if (!this.itemsContent) {
            this.itemsContent = instantiate(content);
            this.itemsContent.parent = content;
            this.itemsContent.setPosition(0, 0, 0);
            this.itemsContent.destroyAllChildren();
        }

        this.itemSize = this.scrollView?.vertical ? nodeHeight(this.itemnode) : nodeWidth(this.itemnode);
        data.forEach((id) => {
            const itemHandle = this.createItemNode();
            if (!itemHandle || !this.itemsContent) return;

            itemHandle.active = true;
            itemHandle.parent = this.itemsContent;
            this.items[String(id)] = itemHandle;
            this.setItemNodePosition(itemHandle, index);

            const scItem = this.ensureScrollViewItem(itemHandle);
            scItem.index = index;
            scItem.id = id;
            scItem.scrollViewTool = this;
            scItem.registerInit(initFunc);
            scItem.update(0);
            index++;
        });
    }

    public clear(): void {
        this.items = {};
        this.data = [];
        this.reuseInited = false;

        const content = this.scrollView?.content;
        if (!content) return;

        if (this.itemsContent) this.itemsContent.destroyAllChildren();
        if (this.scrollView?.vertical) setNodeHeight(content, 0);
        else setNodeWidth(content, 0);
        this.updateScrollBar(0);
    }

    public ResetContentSize(): void {
        const content = this.scrollView?.content;
        if (!content || content.getComponent(Layout)) return;

        if (this.scrollView?.vertical) {
            let height = -this.startPos + this.data.length * this.itemSize;
            if (this.centerOnChild && this.scrollView) height -= this.itemSize - nodeHeight(this.scrollView.node) / 2;
            setNodeHeight(content, Math.max(0, height));
        } else {
            let width = this.startPos + this.data.length * this.itemSize;
            if (this.centerOnChild && this.scrollView) width -= this.itemSize - nodeWidth(this.scrollView.node) / 2;
            setNodeWidth(content, Math.max(0, width));
        }

        this.updateScrollBar(0);
    }

    public isItemInView(index: number): boolean {
        if (this.maxReuse > 0) return true;
        if (!this.scrollView || !this.itemnode) return false;

        const item = this.items[index];
        if (!item) return false;

        const offset = this.scrollView.getScrollOffset();
        let min = -offset.x;
        let max = -offset.x + nodeWidth(this.scrollView.node);

        if (this.scrollView.vertical) {
            max = -offset.y;
            min = -offset.y - nodeHeight(this.scrollView.node);
        }

        let itemMin = item.position.x - nodeAnchorX(this.itemnode) * this.itemSize;
        let itemMax = itemMin + this.itemSize;

        if (this.scrollView.vertical) {
            itemMax = item.position.y + (1 - nodeAnchorY(this.itemnode)) * this.itemSize;
            itemMin = itemMax - this.itemSize;
        }

        const csize = 50;
        return itemMax > min - csize && itemMin < max + csize;
    }

    public initializeReuse(): void {
        if (!this.scrollView || !this.itemsContent) return;

        for (let i = 0; i < this.maxReuse; ++i) {
            const itemHandle = this.createItemNode();
            if (!itemHandle) continue;

            itemHandle.active = true;
            itemHandle.parent = this.itemsContent;
            this.items[i] = itemHandle;
            this.setItemNodePosition(itemHandle, i);

            const scItem = this.ensureScrollViewItem(itemHandle);
            scItem.index = i;
            scItem.id = 0;
            scItem.scrollViewTool = this;
        }

        this.reuseInited = true;
        this.reuseUpdateTimer = 0;

        const content = this.scrollView.content;
        const contentParent = content?.parent || null;
        if (!content || !contentParent) return;

        if (this.scrollView.vertical) {
            const oldY = content.position.y;
            setNodeY(content, 0);
            const parentWorld = contentParent.getWorldPosition(new Vec3());
            const itemsWorld = this.itemsContent.getWorldPosition(new Vec3());
            const dis = parentWorld.y + (1 - nodeAnchorY(contentParent)) * nodeHeight(contentParent) - itemsWorld.y;
            setNodeY(content, oldY);
            this.reuseBufferZoneUp = this.itemSize + dis;
            this.reuseBufferZoneDown = -nodeHeight(this.node) + dis;
        } else {
            const oldX = content.position.x;
            setNodeX(content, 0);
            const parentWorld = contentParent.getWorldPosition(new Vec3());
            const itemsWorld = this.itemsContent.getWorldPosition(new Vec3());
            const dis = parentWorld.x - nodeAnchorX(contentParent) * nodeWidth(contentParent) - itemsWorld.x;
            setNodeX(content, oldX);
            this.reuseBufferZoneUp = nodeWidth(this.node) + dis;
            this.reuseBufferZoneDown = -this.itemSize + dis;
        }
    }

    public reuseSetInitFunc(initFunc: ScrollViewInitFunc): void {
        this.initFunc = initFunc;
        for (let i = 0; i < this.maxReuse; ++i) {
            const item = this.items[i];
            if (item) this.ensureScrollViewItem(item).registerInit(initFunc);
        }
    }

    public reuseSetData(data: ScrollViewItemId[], options: ScrollViewToolOptions = {}): void {
        if (!this.scrollView?.content) return;

        const opts = options || {};
        const content = this.scrollView.content;
        if (this.scrollView.horizontal) setNodeX(content, 0);
        if (this.scrollView.vertical) setNodeY(content, 0);

        this.data = data || [];
        for (let i = 0; i < this.maxReuse; ++i) {
            const itemHandle = this.items[i];
            if (!itemHandle) continue;

            this.setItemNodePosition(itemHandle, i);
            const scItem = this.ensureScrollViewItem(itemHandle);
            scItem.noLazy = !!opts.noLazy;
            scItem.setData(i, this.data[i]);
            if (!opts.noImeUpdate) scItem.update(0);
        }

        this.lastContentPos = this.scrollView.vertical ? content.position.y : content.position.x;
        this.ResetContentSize();
    }

    public flushData(): void {
        Object.keys(this.items).forEach((index) => {
            this.ensureScrollViewItem(this.items[index]).refresh();
        });
    }

    public getPositionInView(item: Node): number {
        const content = this.scrollView?.content;
        if (!content) return 0;

        const viewPos = new Vec3(content.position);
        viewPos.add(item.position);
        if (this.scrollView?.vertical) return viewPos.y + (1 - nodeAnchorY(item)) * this.itemSize;
        return viewPos.x - nodeAnchorX(item) * this.itemSize;
    }

    public reuseUpdate(dt: number): void {
        if (!this.reuseInited || !this.scrollView?.content) return;

        this.reuseUpdateTimer += dt;
        if (this.reuseUpdateTimer < 0.1) return;
        this.reuseUpdateTimer = 0;

        const content = this.scrollView.content;
        let isDown = content.position.x > this.lastContentPos;
        if (this.scrollView.vertical) isDown = content.position.y < this.lastContentPos;

        const offset = this.itemSize * this.maxReuse;
        let changed = true;
        while (changed) {
            changed = false;
            for (let i = 0; i < this.maxReuse; ++i) {
                const itemNode = this.items[i];
                if (!itemNode) continue;

                const viewPos = this.getPositionInView(itemNode);
                const item = this.ensureScrollViewItem(itemNode);

                if (this.scrollView.vertical) {
                    if (isDown) {
                        const newPos = itemNode.position.y + offset;
                        if (viewPos <= this.reuseBufferZoneDown) {
                            setNodeY(itemNode, newPos);
                            const newIndex = item.index - this.maxReuse;
                            item.setData(newIndex, this.data[newIndex]);
                            changed = true;
                        }
                    } else {
                        const newPos = itemNode.position.y - offset;
                        if (viewPos >= this.reuseBufferZoneUp) {
                            setNodeY(itemNode, newPos);
                            const newIndex = item.index + this.maxReuse;
                            item.setData(newIndex, this.data[newIndex]);
                            changed = true;
                        }
                    }
                } else if (isDown) {
                    const newPos = itemNode.position.x - offset;
                    if (viewPos >= this.reuseBufferZoneUp) {
                        setNodeX(itemNode, newPos);
                        const newIndex = item.index - this.maxReuse;
                        item.setData(newIndex, this.data[newIndex]);
                        changed = true;
                    }
                } else {
                    const newPos = itemNode.position.x + offset;
                    if (viewPos <= this.reuseBufferZoneDown) {
                        setNodeX(itemNode, newPos);
                        const newIndex = item.index + this.maxReuse;
                        item.setData(newIndex, this.data[newIndex]);
                        changed = true;
                    }
                }
            }

            for (let i = 0; i < this.maxReuse; ++i) {
                const itemNode = this.items[i];
                if (itemNode) itemNode.setSiblingIndex(this.ensureScrollViewItem(itemNode).index);
            }
        }

        this.lastContentPos = this.scrollView.vertical ? content.position.y : content.position.x;
    }

    public onScrollEnded(): void {
        if (!this.centerOnChild || !this.scrollView?.content || this.itemSize === 0) return;

        let nearIndex = Math.round(-this.scrollView.content.position.x / this.itemSize);
        if (this.scrollView.vertical) nearIndex = Math.round(this.scrollView.content.position.y / this.itemSize);
        this.ScrollToIndex(nearIndex);
    }

    public ScrollToIndex(index: number): void {
        this.scrollToIndexByTime(index, this.scrollView?.bounceDuration || 0);
    }

    public DirectToIndex(index: number): void {
        const content = this.scrollView?.content;
        if (!content) return;

        content.setPosition(this.getTargetContentPosition(index));
        this.updateScrollBar();
        if (this.maxReuse > 0) this.reuseUpdate(1);
    }

    public ScrollToIndexByTime(index: number, time: number): void {
        this.scrollToIndexByTime(index, time);
    }

    private createItemNode(): Node | null {
        if (this.item) return instantiate(this.item.node);
        if (this.prefab) return instantiate(this.prefab);
        return null;
    }

    private ensureScrollViewItem(node: Node): ScrollViewItem {
        return node.getComponent(ScrollViewItem) || node.addComponent(ScrollViewItem);
    }

    private setItemNodePosition(itemNode: Node, index: number): void {
        if (this.scrollView?.vertical) setNodeY(itemNode, this.startPos - index * this.itemSize);
        else setNodeX(itemNode, this.startPos + index * this.itemSize);
    }

    private getTargetContentPosition(index: number): Vec3 {
        const content = this.scrollView?.content;
        const current = content ? content.position : Vec3.ZERO;
        const targetpos = index * this.itemSize;
        const target = new Vec3(current);
        if (this.scrollView?.vertical) target.y = targetpos;
        else target.x = -targetpos;
        return target;
    }

    private scrollToIndexByTime(index: number, time: number): void {
        const content = this.scrollView?.content;
        if (!content) return;

        const duration = Math.max(0, time || 0);
        Tween.stopAllByTarget(content);
        tween(content)
            .to(duration, { position: this.getTargetContentPosition(index) }, {
                easing: 'backOut',
                onUpdate: () => {
                    this.updateScrollBar();
                    if (this.maxReuse > 0) this.reuseUpdate(1);
                },
            })
            .call(() => {
                this.updateScrollBar();
                if (this.maxReuse > 0) this.reuseUpdate(1);
            })
            .start();
    }

    private updateScrollBar(outOfBoundary?: unknown): void {
        const scrollView = this.scrollView as ScrollViewWithScrollBarRefresh | null;
        if (!scrollView?._updateScrollBar) return;

        if (outOfBoundary !== undefined) {
            scrollView._updateScrollBar(outOfBoundary);
            return;
        }

        scrollView._updateScrollBar(scrollView._getHowMuchOutOfBoundary ? scrollView._getHowMuchOutOfBoundary() : 0);
    }
}

export default ScrollViewTool;
