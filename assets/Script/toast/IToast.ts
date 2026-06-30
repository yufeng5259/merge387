import { _decorator, Component } from 'cc';

const { ccclass } = _decorator;

export type IToastShowParams = {
    duration?: number;
    extra?: any;
};

@ccclass('IToast')
export class IToast extends Component {
    public show(message: string, params?: IToastShowParams) {
        console.warn('IToastComponent.show(message, params) should be implemented by subclass', message, params);
    }

    public close() {
        console.warn('IToastComponent.close should be implemented by subclass');
    }
}
