/**
* Toast.show 第二参：扩展字段可随业务增加，实现类自行读取。
*
* @typedef {Object} IToastShowParams
* @property {number} [duration] 展示时长（秒）；无动画驱动时由实现用于自动关闭
* @property {*} [extra] 其它透传数据，具体 Toast 自行约定
*/
/**
* Toast 组件约定：
* - show(message, params) — message 为主文案；params 可选，见 {@link IToastShowParams}
* - close() — 关闭并销毁视图（由实现决定）
*
* @typedef {Object} IToast
* @property {function(string, IToastShowParams=): void} show
* @property {function(): void} close
*/
/**
* Toast 基类：子类重写 show(message, params)、close()。
* 勿将未实现的基类直接挂节点。
*/
/**
* @param {string} message 提示文案
* @param {IToastShowParams} [params]
*/
import { _decorator, Component } from 'cc';
const { ccclass } = _decorator;

@ccclass('IToast')
export class IToast extends Component {

    show (message: any, params: any) {
        // cc.warn("IToastComponent.show(message, params) 应在子类实现"); 
    }

    close () {
        // cc.warn("IToastComponent.close 应在子类实现"); 
    }

}


/**
 * Note: The original script has been commented out, due to the large number of changes in the script, there may be missing in the conversion, you need to convert it manually
 */
// /**
//  * Toast.show 第二参：扩展字段可随业务增加，实现类自行读取。
//  *
//  * @typedef {Object} IToastShowParams
//  * @property {number} [duration] 展示时长（秒）；无动画驱动时由实现用于自动关闭
//  * @property {*} [extra] 其它透传数据，具体 Toast 自行约定
//  */
// 
// /**
//  * Toast 组件约定：
//  * - show(message, params) — message 为主文案；params 可选，见 {@link IToastShowParams}
//  * - close() — 关闭并销毁视图（由实现决定）
//  *
//  * @typedef {Object} IToast
//  * @property {function(string, IToastShowParams=): void} show
//  * @property {function(): void} close
//  */
// 
// /**
//  * Toast 基类：子类重写 show(message, params)、close()。
//  * 勿将未实现的基类直接挂节点。
//  */
// cc.Class({
//     extends: cc.Component,
// 
//     /**
//      * @param {string} message 提示文案
//      * @param {IToastShowParams} [params]
//      */
//     show(message, params) {
//         cc.warn("IToastComponent.show(message, params) 应在子类实现");
//     },
// 
//     close() {
//         cc.warn("IToastComponent.close 应在子类实现");
//     },
// });
