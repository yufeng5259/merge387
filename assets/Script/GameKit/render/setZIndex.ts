import { _decorator, Component, UITransform } from 'cc';

const { ccclass, property } = _decorator;

function ensureUITransform(component: Component): UITransform {
    return component.getComponent(UITransform) || component.addComponent(UITransform);
}

@ccclass('SetZIndex')
export class SetZIndex extends Component {
    @property
    public zAdd = 0;

    start(): void {
        this.applyZIndex();
    }

    applyZIndex(): void {
        ensureUITransform(this).priority = this.zAdd;
    }
}

export default SetZIndex;
