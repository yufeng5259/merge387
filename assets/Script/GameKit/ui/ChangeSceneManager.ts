import { _decorator, Component, UITransform } from 'cc';
import { EnterCloseAnim } from './EnterCloseAnim';

const { ccclass, executionOrder } = _decorator;

@ccclass('ChangeSceneManager')
@executionOrder(-10)
export class ChangeSceneManager extends Component {
    static instance: ChangeSceneManager | null = null;

    onLoad() {
        ChangeSceneManager.instance = this;

        let transform = this.node.getComponent(UITransform);
        if (!transform) transform = this.node.addComponent(UITransform);
        if (UIRoot && UIRoot.instance && UIRoot.instance.winSize) {
            transform.setContentSize(UIRoot.instance.winSize.width, UIRoot.instance.winSize.height);
        }

        EnterCloseAnim.playCloseImmediately(this.node);
    }

    start() {
    }

    show(callback?: () => void) {
        UIRoot.instance.ShowCantClick(true);
        EnterCloseAnim.playEnter(this.node);
        this.scheduleOnce(() => {
            if (callback && typeof callback == 'function') callback();
        }, 0.3);
        GameKit.SoundManager.playSound('swipe_clouds');
    }

    hide(callback?: () => void) {
        UIRoot.instance.CloseCantClick();
        EnterCloseAnim.playClose(this.node);
        this.scheduleOnce(() => {
            if (callback && typeof callback == 'function') callback();
        }, 0.25);
        GameKit.SoundManager.playSound('swipe_clouds_open');
    }
}

global.ChangeSceneManager = ChangeSceneManager;
export default ChangeSceneManager;
