import { _decorator, Component, sys } from 'cc';

const { ccclass } = _decorator;

@ccclass('RichTextEx')
export class RichTextEx extends Component {
    public privacyHandler(_event: any) {
        sys.openURL('https://getcoingang.com/privacy.html');
    }

    public termHandler(_event: any) {
        sys.openURL('https://getcoingang.com/terms-android.html');
    }
}
