import { _decorator, Component, Node } from 'cc';
import UIRoot from '../../UIRoot';

const { ccclass, property } = _decorator;

@ccclass('UICantClick')
export class UICantClick extends Component {
    @property(Node)
    public loading: Node | null = null;

    private loadingTime = 0;
    private cantClickCount = 0;
    private noloading: unknown = false;

    public update(dt: number): void {
        this.loadingTime += dt;
        if (this.loadingTime < 1 || !this.loading || this.loading.active) return;
        if (UIRoot.instance && UIRoot.instance.currentWindowName !== 'LoginWindow' && !this.noloading) {
            this.loading.active = true;
        }
    }

    public onEnable(): void {
        this.loadingTime = 0;
        if (this.loading) this.loading.active = false;
    }

    public onDisable(): void {
        if (!this.node.active) this.noloading = false;
    }

    public show(noloading?: unknown): void {
        this.cantClickCount = this.cantClickCount || 0;
        this.cantClickCount++;
        if (noloading !== null && noloading !== undefined) this.noloading = noloading;
        this.node.active = this.cantClickCount > 0;
    }

    public close(): void {
        this.cantClickCount = this.cantClickCount || 0;
        this.cantClickCount--;
        this.node.active = this.cantClickCount > 0;
    }
}

export default UICantClick;
