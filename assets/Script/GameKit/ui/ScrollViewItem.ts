import { _decorator, Button, Component, Node } from 'cc';

const { ccclass, property } = _decorator;

type ScrollViewItemId = number | string | null | undefined;
type InitFunc = ((index: number, id: ScrollViewItemId, node: Node) => void) | null;

interface ScrollViewToolLike {
    isItemInView(index: number): boolean;
}

interface InScrollViewComponent extends Component {
    inScrollView?: boolean;
}

@ccclass('ScrollViewItem')
export class ScrollViewItem extends Component {
    @property
    public index = 0;

    @property
    public id: ScrollViewItemId = 0;

    public scrollViewTool: ScrollViewToolLike | null = null;
    public noLazy = false;

    private inited = false;
    private initFunc: InitFunc = null;

    public start(): void {
        this.markTouchChildrenInScrollView();
        this.update(0);
    }

    public registerInit(func: InitFunc): void {
        this.initFunc = func;
    }

    public update(_dt: number): void {
        if (this.inited || !this.scrollViewTool) {
            return;
        }

        if (this.id === null || this.id === undefined) {
            this.node.active = false;
            this.inited = true;
            return;
        }

        if (this.noLazy || this.scrollViewTool.isItemInView(this.index)) {
            this.inited = true;
            if (this.initFunc) {
                this.initFunc(this.index, this.id, this.node);
            }
        }
    }

    public setData(index: number, id: ScrollViewItemId): void {
        this.index = index;
        this.id = id;
        this.inited = false;
        if (this.id !== null && this.id !== undefined) {
            this.node.active = true;
        }
    }

    public refresh(): void {
        this.inited = false;
        if (this.id !== null && this.id !== undefined) {
            this.node.active = true;
        }
        this.update(0);
    }

    private markTouchChildrenInScrollView(): void {
        this.getComponentsInChildren(Button).forEach((component) => {
            (component as InScrollViewComponent).inScrollView = true;
        });

        this.getComponentsInChildren('EventListener').forEach((component) => {
            (component as InScrollViewComponent).inScrollView = true;
        });
    }
}

export default ScrollViewItem;
