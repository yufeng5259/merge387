import { _decorator, EditBox } from 'cc';
import { UIWindow } from '../../GameKit/ui/UIWindow';

const { ccclass, property } = _decorator;

@ccclass('DeleteWindow')
export default class DeleteWindow extends UIWindow {
    static windowPath = 'Other/DeleteWindow';

    @property(EditBox)
    InputText: EditBox | null = null;

    onShow() {
    }

    callClose() {
        this.closeAnim();
    }

    Delete() {
        if (this.InputText.string == 'Delete') {
            let req = SR.SRLogin.clearProgress();
            req.Send();
        } else {
            DialogWindow.Show('Please enter correctly, case sensitive', nullFunction);
        }
    }
}
