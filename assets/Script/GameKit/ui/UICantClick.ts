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
    private ownerLocks: Record<string, boolean> = {};

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
        this.refreshVisible();
    }

    public close(): void {
        this.cantClickCount = this.cantClickCount || 0;
        this.cantClickCount = Math.max(0, this.cantClickCount - 1);
        this.refreshVisible();
    }

    public acquire(owner: string, noloading?: unknown) {
        if (!owner || this.ownerLocks[owner]) return false;
        this.ownerLocks[owner] = true;
        if (noloading !== null && noloading !== undefined) this.noloading = noloading;
        this.refreshVisible();
        return true;
    }

    public release(owner: string) {
        if (!owner || !this.ownerLocks[owner]) return false;
        delete this.ownerLocks[owner];
        this.refreshVisible();
        return true;
    }

    public isLockedBy(owner: string) {
        return !!(owner && this.ownerLocks[owner]);
    }

    public refreshVisible() {
        this.node.active = this.cantClickCount > 0 || Object.keys(this.ownerLocks).length > 0;
    }
}

export default UICantClick;
