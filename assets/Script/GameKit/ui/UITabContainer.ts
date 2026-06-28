import { _decorator, Component } from 'cc';
import { UITabNode } from './UITabNode';

const { ccclass, property } = _decorator;

type IndexedUITabNode = UITabNode & {
    index: number;
};

type TabChangeCallback = (index: number, tab: UITabNode, first?: boolean) => void;

@ccclass('UITabContainer')
export class UITabContainer extends Component {
    @property([UITabNode])
    public tabs: UITabNode[] = [];

    public index = 0;
    public changeCallback: TabChangeCallback | null = null;
    private tabClickHandlers: Array<(() => void) | null> = [];
    private registeredTabs: UITabNode[] = [];

    public start(): void {
    }

    public onShow(func: TabChangeCallback | null = null, defaultIndex = 0): void {
        this.clearTabEvents();
        this.changeCallback = func;
        this.index = defaultIndex || 0;

        for (let i = 0; i < this.tabs.length; i++) {
            const tab = this.tabs[i] as IndexedUITabNode;
            tab.index = i;
            tab.disable();
            const onClick = () => {
                this.changeIndex(i);
            };
            this.tabClickHandlers[i] = onClick;
            this.registeredTabs[i] = tab;
            tab.node.on('click', onClick, this);
        }

        this.enableIndex(this.index, true);
    }

    public changeIndex(index: number): void {
        if (this.index === index) return;
        this.disableIndex(this.index);
        this.index = index;
        this.enableIndex(this.index);
    }

    public disableIndex(index: number): void {
        this.tabs[index].disable();
    }

    public enableIndex(index: number, first?: boolean): void {
        this.tabs[index].enable();
        if (this.changeCallback) this.changeCallback(index, this.tabs[index], first);
    }

    public setChangeCallback(func: TabChangeCallback | null): void {
        this.changeCallback = func;
    }

    public onDisable(): void {
        this.clearTabEvents();
    }

    private clearTabEvents(): void {
        for (let i = 0; i < this.registeredTabs.length; i++) {
            const tab = this.registeredTabs[i];
            const onClick = this.tabClickHandlers[i];
            if (tab && onClick) tab.node.off('click', onClick, this);
        }
        this.tabClickHandlers = [];
        this.registeredTabs = [];
    }
}

export default UITabContainer;
