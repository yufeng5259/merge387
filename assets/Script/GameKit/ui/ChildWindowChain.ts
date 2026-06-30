import UIRoot from '../../UIRoot';
import SoundManager from '../SoundManager';

type ChainCheckFunc = () => boolean;
type ChainCallback = () => void;

type ChainWindowParams = Record<string, any> & {
    showCallback?: (window: any) => void;
};

type ChainItem = {
    windowName: string;
    checkFunc?: ChainCheckFunc | null;
    params?: ChainWindowParams | null;
};

export default class ChildWindowChain {
    private data: ChainItem[] = [];
    private index = 0;
    private finishFunc: ChainCallback | null = null;
    private completeFunc: ChainCallback | null = null;

    add(windowName: string, checkFunc: ChainCheckFunc | null = null, params: ChainWindowParams | null = null) {
        this.data.push({ windowName, checkFunc, params });
    }

    start() {
        this.index = 0;
        this.execute(this.index);
    }

    private execute(index: number) {
        if (index >= this.data.length) {
            this.finish();
            return;
        }

        const data = this.data[index];
        if (data.checkFunc == null || data.checkFunc()) {
            const params = data.params || {};
            const showCallback = params.showCallback;
            params.showCallback = (window: any) => {
                window.addOnCloseFunc(() => {
                    this.index++;
                    this.execute(this.index);
                });
                window.childWindowChain = this;
                if (showCallback) showCallback(window);
            };
            SoundManager.playSound('se_open');
            UIRoot.instance.openChildWindow(data.windowName, params);
        } else {
            this.index++;
            this.execute(this.index);
        }
    }

    end() {
        this.index = this.data.length;
        if (this.completeFunc) this.completeFunc();
    }

    finish() {
        this.index = this.data.length;
        if (this.completeFunc) this.completeFunc();
        if (this.finishFunc) this.finishFunc();
    }

    setFinishFunc(callback: ChainCallback) {
        this.finishFunc = callback;
    }

    setCompleteFunc(callback: ChainCallback) {
        this.completeFunc = callback;
    }
}
