import { _decorator, Component } from 'cc';
const { ccclass } = _decorator;

@ccclass('RichTextEx')
export class RichTextEx extends Component {

    privacyHandler (event: any) {
        // cc.sys.openURL("https://getcoingang.com/privacy.html"); 
    }

    termHandler (event: any) {
        // cc.sys.openURL("https://getcoingang.com/terms-android.html"); 
    }

}


/**
 * Note: The original script has been commented out, due to the large number of changes in the script, there may be missing in the conversion, you need to convert it manually
 */
// cc.Class({
//     extends: cc.Component,
// 
//     privacyHandler(event) {
//         cc.sys.openURL("https://getcoingang.com/privacy.html");
//     },
//     termHandler(event) {
//         cc.sys.openURL("https://getcoingang.com/terms-android.html");
//     },
// });
