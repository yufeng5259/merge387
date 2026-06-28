/******************************************
 * @author kL <klk0@qq.com>
 * @date 2019/12/9
 * @doc 列表Item组件.
 * 说明：
 *      1、此组件须配合List组件使用。（配套的配套的..）
 * @end
 ******************************************/
import { _decorator, Button, Component, Enum, Node, Sprite, SpriteFrame, tween, UITransform, Vec3 } from 'cc';
import { DEV } from 'cc/env';

const { ccclass, property, disallowMultiple, menu, executionOrder } = _decorator;

const SelectedType = {
    NONE: 0,
    TOGGLE: 1,
    SWITCH: 2,
};
Enum(SelectedType);

@ccclass('ListItem')
@disallowMultiple()
@menu('List/Item')
@executionOrder(-5001)          //先于List
export default class ListItem extends Component {
    //图标
    @property({ type: Sprite, tooltip: DEV ? '图标' : '' })
    icon = null;
    //标题
    @property({ type: Node, tooltip: DEV ? '标题' : '' })
    title = null;
    //选择模式
    @property({
        type: SelectedType,
        tooltip: DEV ? '选择模式' : ''
    })
    selectedMode = SelectedType.NONE;
    //被选标志
    @property({
        type: Node, tooltip: DEV ? '被选标识' : '',
        visible() { return this.selectedMode > SelectedType.NONE; }
    })
    selectedFlag = null;
    //被选择的SpriteFrame
    @property({
        type: SpriteFrame, tooltip: DEV ? '被选择的SpriteFrame' : '',
        visible() { return this.selectedMode == SelectedType.SWITCH; }
    })
    selectedSpriteFrame = null;
    //未被选择的SpriteFrame
    _unselectedSpriteFrame = null;
    //自适应尺寸
    @property({
        tooltip: DEV ? '自适应尺寸（宽或高）' : '',
    })
    adaptiveSize = false;
    //选择
    _selected = false;
    set selected(val) {
        this._selected = val;
        if (!this.selectedFlag)
            return;
        switch (this.selectedMode) {
            case SelectedType.TOGGLE:
                this.selectedFlag.active = val;
                break;
            case SelectedType.SWITCH:
                let sp = this.selectedFlag.getComponent(Sprite);
                if (sp) {
                    sp.spriteFrame = val ? this.selectedSpriteFrame : this._unselectedSpriteFrame;
                }
                break;
        }
    }
    get selected() {
        return this._selected;
    }
    //按钮组件
    _btnCom = null;
    get btnCom() {
        if (!this._btnCom)
            this._btnCom = this.node.getComponent(Button);
        return this._btnCom;
    }
    //依赖的List组件
    list = null;
    //是否已经注册过事件
    _eventReg = false;
    //序列id
    listId = 0;

    onLoad() {
        // //没有按钮组件的话，selectedFlag无效
        // if (!this.btnCom)
        //     this.selectedMode == SelectedType.NONE;
        //有选择模式时，保存相应的东西
        if (this.selectedMode == SelectedType.SWITCH) {
            let com = this.selectedFlag.getComponent(Sprite);
            this._unselectedSpriteFrame = com.spriteFrame;
        }
    }

    onDestroy() {
        this.node.off(Node.EventType.SIZE_CHANGED, this._onSizeChange, this);
    }

    _registerEvent() {
        if (!this._eventReg) {
            if (this.btnCom && this.list.selectedMode > 0) {
                this.btnCom.clickEvents.unshift(this.createEvt(this, 'onClickThis'));
            }
            if (this.adaptiveSize) {
                this.node.on(Node.EventType.SIZE_CHANGED, this._onSizeChange, this);
            }
            this._eventReg = true;
        }
    }

    _onSizeChange() {
        this.list._onItemAdaptive(this.node);
    }
    /**
     * 创建事件
     * @param {Component} component 组件脚本
     * @param {string} handlerName 触发函数名称
     * @param {Node} node 组件所在node（不传的情况下取component.node）
     * @returns Component.EventHandler
     */
    createEvt(component, handlerName, node = null) {
        if (!component.isValid)
            return;//有些异步加载的，节点以及销毁了。
        component['comName'] = component['comName'] || component.name.match(/\<(.*?)\>/g).pop().replace(/\<|>/g, '');
        let evt = new Component.EventHandler();
        evt.target = node || component.node;
        evt.component = component['comName'];
        evt.handler = handlerName;
        return evt;
    }

    showAni(aniType, callFunc, del) {
        let t = this;
        let twe;
        const contentSize = t.node.getComponent(UITransform)?.contentSize;
        const width = contentSize ? contentSize.width : 0;
        const height = contentSize ? contentSize.height : 0;
        switch (aniType) {
            case 0: //向上消失
                twe = tween(t.node)
                    .to(.2, { scale: new Vec3(.7, .7) })
                    .by(.3, { position: new Vec3(0, height * 2) });
                break;
            case 1: //向右消失
                twe = tween(t.node)
                    .to(.2, { scale: new Vec3(.7, .7) })
                    .by(.3, { position: new Vec3(width * 2, 0) });
                break;
            case 2: //向下消失
                twe = tween(t.node)
                    .to(.2, { scale: new Vec3(.7, .7) })
                    .by(.3, { position: new Vec3(0, height * -2) });
                break;
            case 3: //向左消失
                twe = tween(t.node)
                    .to(.2, { scale: new Vec3(.7, .7) })
                    .by(.3, { position: new Vec3(width * -2, 0) });
                break;
            default: //默认：缩小消失
                twe = tween(t.node)
                    .to(.3, { scale: new Vec3(.1, .1) });
                break;
        }

        if (callFunc || del) {
            twe.call(() => {
                if (del) {
                    t.list._delSingleItem(t.node);
                    for (let n = t.list.displayData.length - 1; n >= 0; n--) {
                        if (t.list.displayData[n].id == t.listId) {
                            t.list.displayData.splice(n, 1);
                            break;
                        }
                    }
                }
                callFunc();
            });
        }
        twe.start();
    }

    onClickThis() {
        this.list.selectedId = this.listId;
    }

}


