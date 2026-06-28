import '../../LegacyGlobals';
import { _decorator, Label } from 'cc';
import { UIWindow } from '../../GameKit/ui/UIWindow';

const { ccclass, property } = _decorator;

@ccclass('HelpWindow')
export default class HelpWindow extends UIWindow {
    static windowPath = 'Common/HelpWindow';

    @property(Label)
    labelMsg: Label | null = null;

    @property(Label)
    labelTitle: Label | null = null;

    onShow(showParams: any) {
        this.labelMsg.string = Game.HelpManager.GetHelp(showParams.key);
        this.labelTitle.string = showParams.title;
    }

    call_close() {
        this.closeAnim();
    }

    static Show(title: any, key: any) {
        UIRoot.instance.openChildWindow('HelpWindow', { title: title, key: key });
    }
}

Game.HelpWindow = HelpWindow;
