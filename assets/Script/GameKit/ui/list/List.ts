/******************************************
 * @author kL <klk0@qq.com>
 * @date 2020/12/9
 * @doc 列表组件.
 * @end
 ******************************************/
import { _decorator, CCBoolean, CCFloat, CCInteger, Component, Enum, Event, EventHandler, instantiate, isValid, Layout, Node, NodePool, Prefab, ScrollView, Size, tween, UITransform, Vec3, Widget } from 'cc';
import { DEV } from 'cc/env';
import ListItem from './ListItem';

const { ccclass, property, disallowMultiple, menu, executionOrder, requireComponent } = _decorator;


const TemplateType = { NODE: 1, PREFAB: 2 };
Enum(TemplateType);

/**
 * 滑动模式类型
 * @enum {number}
 */
const SlideType = { 
    NORMAL: 1,      // 普通滑动模式：自由滑动，支持循环列表
    ADHERING: 2,    // 粘附滑动模式：滑动结束后自动吸附到最近的item位置
    PAGE: 3         // 翻页滑动模式：按页滑动，每次滑动一页
};

Enum(SlideType);

const SelectedType = { NONE: 0, SINGLE: 1, MULT: 2 };
Enum(SelectedType);

interface ListNode extends Node {
    _listId?: number;
    isCached?: boolean;
    listItem?: ListItem | null;
}

interface ListItemPos {
    id: number;
    x: number;
    y: number;
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
}

function getTransform(node: Node | null | undefined): UITransform | null {
    return node ? node.getComponent(UITransform) : null;
}

function ensureTransform(node: Node): UITransform {
    return node.getComponent(UITransform) || node.addComponent(UITransform);
}

function nodeWidth(node: Node | null | undefined): number {
    return getTransform(node)?.width || 0;
}

function nodeHeight(node: Node | null | undefined): number {
    return getTransform(node)?.height || 0;
}

function nodeAnchorX(node: Node | null | undefined): number {
    return getTransform(node)?.anchorX || 0;
}

function nodeAnchorY(node: Node | null | undefined): number {
    return getTransform(node)?.anchorY || 0;
}

function setNodeWidth(node: Node, width: number): void {
    const transform = ensureTransform(node);
    transform.setContentSize(width, transform.height);
}

function setNodeHeight(node: Node, height: number): void {
    const transform = ensureTransform(node);
    transform.setContentSize(transform.width, height);
}

function setNodeSize(node: Node, width: number, height: number): void {
    ensureTransform(node).setContentSize(width, height);
}

@ccclass('List')
@disallowMultiple()
@menu('List/List')
@requireComponent(ScrollView)
//脚本生命周期回调的执行优先级。小于 0 的脚本将优先执行，大于 0 的脚本将最后执行。该优先级只对 onLoad, onEnable, start, update 和 lateUpdate 有效，对 onDisable 和 onDestroy 无效。
@executionOrder(-5000)
export default class List extends Component {
    //模板类型
    @property({ type: TemplateType, tooltip: DEV && '模板类型', })
    templateType = TemplateType.NODE;
    //模板Item（Node）
    @property({
        type: Node,
        tooltip: DEV && '模板Item',
        visible() { return this.templateType == TemplateType.NODE; }
    })
    tmpNode = null;
    //模板Item（Prefab）
    @property({
        type: Prefab,
        tooltip: DEV && '模板Item',
        visible() { return this.templateType == TemplateType.PREFAB; }
    })
    tmpPrefab = null;
    //滑动模式
    @property({})
    _slideMode = SlideType.NORMAL;
    @property({
        type: SlideType,
        tooltip: DEV && '滑动模式'
    })
    set slideMode(val) {
        this._slideMode = val;
    }
    get slideMode() {
        return this._slideMode;
    }
    //翻页作用距离
    @property({
        type: CCFloat,
        range: [0, 1, .1],
        tooltip: DEV && '翻页作用距离',
        slide: true,
        visible() { return this._slideMode == SlideType.PAGE; }
    })
    pageDistance = .3;
    //页面改变事件
    @property({
        type: EventHandler,
        tooltip: DEV && '页面改变事件',
        visible() { return this._slideMode == SlideType.PAGE; }
    })
    pageChangeEvent = new EventHandler();
    //是否为虚拟列表（动态列表）
    @property({})
    _virtual = true;
    @property({
        type: CCBoolean,
        tooltip: DEV && '是否为虚拟列表（动态列表）'
    })
    set virtual(val) {
        if (val != null)
            this._virtual = val;
        if (!DEV && this._numItems != 0) {
            this._onScrolling();
        }
    }
    get virtual() {
        return this._virtual;
    }
    //是否为循环列表
    @property({
        tooltip: DEV && '是否为循环列表',
        visible() {
            let val = /*this.virtual &&*/ this.slideMode == SlideType.NORMAL;
            if (!val)
                this.cyclic = false;
            return val;
        }
    })
    cyclic = false;
    //缺省居中
    @property({
        tooltip: DEV && 'Item数量不足以填满Content时，是否居中显示Item（不支持Grid布局）',
        visible() { return this.virtual; }
    })
    lackCenter = false;
    //缺省可滑动
    @property({
        tooltip: DEV && 'Item数量不足以填满Content时，是否可滑动',
        visible() {
            let val = this.virtual && !this.lackCenter;
            if (!val)
                this.lackSlide = false;
            return val;
        }
    })
    lackSlide = false;
    //刷新频率
    @property({ type: CCInteger })
    _updateRate = 0;
    @property({
        type: CCInteger,
        range: [0, 6, 1],
        tooltip: DEV && '刷新频率（值越大刷新频率越低、性能越高）',
        slide: true,
    })
    set updateRate(val) {
        if (val >= 0 && val <= 6) {
            this._updateRate = val;
        }
    }
    get updateRate() {
        return this._updateRate;
    }
    //分帧渲染（每帧渲染的Item数量（<=0时关闭分帧渲染））
    @property({
        type: CCInteger,
        range: [0, 12, 1],
        tooltip: DEV && '逐帧渲染时，每帧渲染的Item数量（<=0时关闭分帧渲染）',
        slide: true,
    })
    frameByFrameRenderNum = 0;
    //渲染事件（渲染器）
    @property({
        type: EventHandler,
        tooltip: DEV && '渲染事件（渲染器）',
    })
    renderEvent = new EventHandler();
    //选择模式
    @property({
        type: SelectedType,
        tooltip: DEV && '选择模式'
    })
    selectedMode = SelectedType.NONE;
    //触发选择事件
    @property({
        type: EventHandler,
        tooltip: DEV && '触发选择事件',
        visible() { return this.selectedMode > SelectedType.NONE; }
    })
    selectedEvent = new EventHandler();
    @property({
        tooltip: DEV && '是否重复响应单选事件',
        visible() { return this.selectedMode == SelectedType.SINGLE; }
    })
    repeatEventSingle = false;

    // @property({
    //     type: Node,
    //     tooltip: DEV && '可视视图范围',
    // })
    // view;

    //当前选择id
    _selectedId = -1;
    _lastSelectedId;
    multSelected = [];
    set selectedId(val) {
        let t = this;
        let item;
        switch (t.selectedMode) {
            case SelectedType.SINGLE: {
                if (!t.repeatEventSingle && val == t._selectedId)
                    return;
                item = t.getItemByListId(val);
                // if (!item && val >= 0)
                //     return;
                let listItem;
                if (t._selectedId >= 0)
                    t._lastSelectedId = t._selectedId;
                else //如果＜0则取消选择，把_lastSelectedId也置空吧，如果以后有特殊需求再改吧。
                    t._lastSelectedId = null;
                t._selectedId = val;
                if (item) {
                    listItem = item.getComponent(ListItem);
                    listItem.selected = true;
                }
                if (t._lastSelectedId >= 0 && t._lastSelectedId != t._selectedId) {
                    let lastItem = t.getItemByListId(t._lastSelectedId);
                    if (lastItem) {
                        lastItem.getComponent(ListItem).selected = false;
                    }
                }
                if (t.selectedEvent) {
                    EventHandler.emitEvents([t.selectedEvent], item, val % this._actualNumItems, t._lastSelectedId == null ? null : (t._lastSelectedId % this._actualNumItems));
                }
                break;
            }
            case SelectedType.MULT: {
                item = t.getItemByListId(val);
                if (!item)
                    return;
                let listItem = item.getComponent(ListItem);
                if (t._selectedId >= 0)
                    t._lastSelectedId = t._selectedId;
                t._selectedId = val;
                let bool = !listItem.selected;
                listItem.selected = bool;
                let sub = t.multSelected.indexOf(val);
                if (bool && sub < 0) {
                    t.multSelected.push(val);
                } else if (!bool && sub >= 0) {
                    t.multSelected.splice(sub, 1);
                }
                if (t.selectedEvent) {
                    EventHandler.emitEvents([t.selectedEvent], item, val % this._actualNumItems, t._lastSelectedId == null ? null : (t._lastSelectedId % this._actualNumItems), bool);
                }
                break;
            }
        }
    }
    get selectedId() {
        return this._selectedId;
    }
    _forceUpdate = false;
    _align;
    _horizontalDir;
    _verticalDir;
    _startAxis;
    _alignCalcType;
    content;
    firstListId;
    displayItemNum;
    _updateDone = true;
    _updateCounter;
    _actualNumItems;
    _cyclicNum;
    _cyclicPos1;
    _cyclicPos2;
    //列表数量
    @property({
        serializable: false
    })
    _numItems = 0;
    set numItems(val) {
        let t = this;
        if (!t.checkInited(false))
            return;
        if (val == null || val < 0) {
            console.error('numItems set the wrong::', val);
            return;
        }
        t._actualNumItems = t._numItems = val;
        t._forceUpdate = true;

        if (t._virtual) {
            t._resizeContent();
            if (t.cyclic) {
                t._numItems = t._cyclicNum * t._numItems;
            }
            t._onScrolling();
            if (!t.frameByFrameRenderNum && t.slideMode == SlideType.PAGE)
                t.curPageNum = t.nearestListId;
        } else {
            if (t.cyclic) {
                t._resizeContent();
                t._numItems = t._cyclicNum * t._numItems;
            }
            let layout = t.content.getComponent(Layout);
            if (layout) {
                layout.enabled = true;
            }
            t._delRedundantItem();

            t.firstListId = 0;
            if (t.frameByFrameRenderNum > 0) {
                //先渲染几个出来
                let len = t.frameByFrameRenderNum > t._numItems ? t._numItems : t.frameByFrameRenderNum;
                for (let n = 0; n < len; n++) {
                    t._createOrUpdateItem2(n);
                }
                if (t.frameByFrameRenderNum < t._numItems) {
                    t._updateCounter = t.frameByFrameRenderNum;
                    t._updateDone = false;
                }
            } else {
                for (let n = 0; n < t._numItems; n++) {
                    t._createOrUpdateItem2(n);
                }
                t.displayItemNum = t._numItems;
            }
        }
    }
    get numItems() {
        return this._actualNumItems;
    }

    _inited = false;
    _eventRegistered = false;
    _scrollView;
    get scrollView() {
        return this._scrollView;
    }
    _layout;
    _resizeMode;
    _topGap;
    _rightGap;
    _bottomGap;
    _leftGap;

    _columnGap;
    _lineGap;
    _colLineNum;

    _lastDisplayData = [];
    displayData = [];
    _pool;

    _itemTmp;
    _needUpdateWidget = false;
    _itemSize;
    _sizeType;

    _customSize;

    frameCount;
    _aniDelRuning = false;
    _aniDelCB;
    _aniDelItem;
    _aniDelBeforePos;
    _aniDelBeforeScale;
    viewTop;
    viewRight;
    viewBottom;
    viewLeft;

    _doneAfterUpdate = false;

    elasticTop;
    elasticRight;
    elasticBottom;
    elasticLeft;

    scrollToListId;

    adhering = false;

    _adheringBarrier = false;
    nearestListId;

    curPageNum = 0;
    _beganPos;
    _scrollPos;
    _curScrollIsTouch;//当前滑动是否为手动

    _scrollToListId;
    _scrollToEndTime;
    _scrollToSo;

    _lack;
    _allItemSize;
    _allItemSizeNoEdge;

    _scrollItem;//当前控制 ScrollView 滚动的 Item

    //----------------------------------------------------------------------------

    onLoad() {
        this._init();
    }

    onDestroy() {
        let t = this;
        if (isValid(t._itemTmp))
            t._itemTmp.destroy();
        if (isValid(t.tmpNode))
            t.tmpNode.destroy();
        t._pool && t._pool.clear();
    }

    onEnable() {
        // if (!EDITOR) 
        if (!this._inited) {
            this._init();
        }
        this._registerEvent();
        // 处理重新显示后，有可能上一次的动画移除还未播放完毕，导致动画卡住的问题
        if (this._aniDelRuning) {
            this._aniDelRuning = false;
            if (this._aniDelItem) {
                if (this._aniDelBeforePos) {
                    this._aniDelItem.position = this._aniDelBeforePos;
                    delete this._aniDelBeforePos;
                }
                if (this._aniDelBeforeScale) {
                    this._aniDelItem.scale = this._aniDelBeforeScale;
                    delete this._aniDelBeforeScale;
                }
                delete this._aniDelItem;
            }
            if (this._aniDelCB) {
                this._aniDelCB();
                delete this._aniDelCB;
            }
        }
    }

    onDisable() {
        // if (!EDITOR) 
        this._unregisterEvent();
    }
    //注册事件
    _registerEvent() {
        let t = this;
        if (t._eventRegistered) return;
        t._eventRegistered = true;
        t.node.on(Node.EventType.TOUCH_START, t._onTouchStart, t);
        t.node.on('touch-up', t._onTouchUp, t);
        t.node.on(Node.EventType.TOUCH_CANCEL, t._onTouchCancelled, t);
        t.node.on('scroll-began', t._onScrollBegan, t);
        t.node.on('scroll-ended', t._onScrollEnded, t);
        t.node.on('scrolling', t._onScrolling, t);
        t.node.on(Node.EventType.SIZE_CHANGED, t._onSizeChanged, t);
    }
    //卸载事件
    _unregisterEvent() {
        let t = this;
        if (!t._eventRegistered) return;
        t._eventRegistered = false;
        t.node.off(Node.EventType.TOUCH_START, t._onTouchStart, t);
        t.node.off('touch-up', t._onTouchUp, t);
        t.node.off(Node.EventType.TOUCH_CANCEL, t._onTouchCancelled, t);
        t.node.off('scroll-began', t._onScrollBegan, t);
        t.node.off('scroll-ended', t._onScrollEnded, t);
        t.node.off('scrolling', t._onScrolling, t);
        t.node.off(Node.EventType.SIZE_CHANGED, t._onSizeChanged, t);
    }
    //初始化各种..
    _init() {
        let t = this;
        if (t._inited)
            return;

        t._scrollView = t.node.getComponent(ScrollView);

        t.content = t._scrollView.content;
        if (!t.content) {
            console.error(t.node.name + "'s ScrollView unset content!");
            return;
        }

        t._layout = t.content.getComponent(Layout);

        t._align = t._layout.type; //排列模式
        t._resizeMode = t._layout.resizeMode; //自适应模式
        t._startAxis = t._layout.startAxis;

        t._topGap = t._layout.paddingTop; //顶边距
        t._rightGap = t._layout.paddingRight; //右边距
        t._bottomGap = t._layout.paddingBottom; //底边距
        t._leftGap = t._layout.paddingLeft; //左边距

        t._columnGap = t._layout.spacingX; //列距
        t._lineGap = t._layout.spacingY; //行距

        t._colLineNum; //列数或行数（非GRID模式则=1，表示单列或单行）;

        t._verticalDir = t._layout.verticalDirection; //垂直排列子节点的方向
        t._horizontalDir = t._layout.horizontalDirection; //水平排列子节点的方向

        // 模板实例化（延迟到真正需要时再创建，但这里先创建用于初始化）
        if (t.templateType == TemplateType.PREFAB && t.tmpPrefab) {
            t.setTemplateItem(instantiate(t.tmpPrefab));
        } else if (t.templateType == TemplateType.NODE && t.tmpNode) {
            t.setTemplateItem(instantiate(t.tmpNode));
        } else {
            // 如果没有模板，延迟初始化
            return;
        }

        // 特定的滑动模式处理
        if (t._slideMode == SlideType.ADHERING || t._slideMode == SlideType.PAGE) {
            t._scrollView.inertia = false;
            t._scrollView["_onMouseWheel"] = function () {
                return;
            };
        }
        if (!t.virtual)         // lackCenter 仅支持 Virtual 模式
            t.lackCenter = false;

        t._lastDisplayData = []; //最后一次刷新的数据
        t.displayData = []; //当前数据
        t._pool = new NodePool();    //这是个池子..
        t._forceUpdate = false;         //是否强制更新
        t._updateCounter = 0;           //当前分帧渲染帧数
        t._updateDone = true;           //分帧渲染是否完成

        t.curPageNum = 0;               //当前页数

        if (t.cyclic || 0) {
            t._scrollView["_processAutoScrolling"] = this._processAutoScrolling.bind(t);
            t._scrollView["_startBounceBackIfNeeded"] = function () {
                return false;
            }
        }

        switch (t._align) {
            case Layout.Type.HORIZONTAL: {
                switch (t._horizontalDir) {
                    case Layout.HorizontalDirection.LEFT_TO_RIGHT:
                        t._alignCalcType = 1;
                        break;
                    case Layout.HorizontalDirection.RIGHT_TO_LEFT:
                        t._alignCalcType = 2;
                        break;
                }
                break;
            }
            case Layout.Type.VERTICAL: {
                switch (t._verticalDir) {
                    case Layout.VerticalDirection.TOP_TO_BOTTOM:
                        t._alignCalcType = 3;
                        break;
                    case Layout.VerticalDirection.BOTTOM_TO_TOP:
                        t._alignCalcType = 4;
                        break;
                }
                break;
            }
            case Layout.Type.GRID: {
                switch (t._startAxis) {
                    case Layout.AxisDirection.HORIZONTAL:
                        switch (t._verticalDir) {
                            case Layout.VerticalDirection.TOP_TO_BOTTOM:
                                t._alignCalcType = 3;
                                break;
                            case Layout.VerticalDirection.BOTTOM_TO_TOP:
                                t._alignCalcType = 4;
                                break;
                        }
                        break;
                    case Layout.AxisDirection.VERTICAL:
                        switch (t._horizontalDir) {
                            case Layout.HorizontalDirection.LEFT_TO_RIGHT:
                                t._alignCalcType = 1;
                                break;
                            case Layout.HorizontalDirection.RIGHT_TO_LEFT:
                                t._alignCalcType = 2;
                                break;
                        }
                        break;
                }
                break;
            }
        }
        // 清空 content
        // t.content.children.forEach((child) => {
        //     child.removeFromParent();
        //     if (child != t.tmpNode && child.isValid)
        //         child.destroy();
        // });
        t.content.removeAllChildren();
        t._inited = true;
    }
    /**
     * 为了实现循环列表，必须覆写ScrollView的某些函数
     * @param {Number} dt
     */
    _processAutoScrolling(dt) {

        // ------------- scroll-view 里定义的一些常量 -------------
        const OUT_OF_BOUNDARY_BREAKING_FACTOR = 0.05;
        const EPSILON = 1e-4;
        const ZERO = new Vec3();
        const quintEaseOut = (time) => {
            time -= 1;
            return (time * time * time * time * time + 1);
        };
        // ------------- scroll-view 里定义的一些常量 -------------

        let sv = this._scrollView;

        const isAutoScrollBrake = sv['_isNecessaryAutoScrollBrake']();
        const brakingFactor = isAutoScrollBrake ? OUT_OF_BOUNDARY_BREAKING_FACTOR : 1;
        sv['_autoScrollAccumulatedTime'] += dt * (1 / brakingFactor);

        let percentage = Math.min(1, sv['_autoScrollAccumulatedTime'] / sv['_autoScrollTotalTime']);
        if (sv['_autoScrollAttenuate']) {
            percentage = quintEaseOut(percentage);
        }

        const clonedAutoScrollTargetDelta = sv['_autoScrollTargetDelta'].clone();
        clonedAutoScrollTargetDelta.multiplyScalar(percentage);
        const clonedAutoScrollStartPosition = sv['_autoScrollStartPosition'].clone();
        clonedAutoScrollStartPosition.add(clonedAutoScrollTargetDelta);
        let reachedEnd = Math.abs(percentage - 1) <= EPSILON;

        const fireEvent = Math.abs(percentage - 1) <= sv['getScrollEndedEventTiming']();
        if (fireEvent && !sv['_isScrollEndedWithThresholdEventFired']) {
            sv['_dispatchEvent'](ScrollView.EventType.SCROLL_ENG_WITH_THRESHOLD);
            sv['_isScrollEndedWithThresholdEventFired'] = true;
        }

        if (sv['elastic']) {
            const brakeOffsetPosition = clonedAutoScrollStartPosition.clone();
            brakeOffsetPosition.subtract(sv['_autoScrollBrakingStartPosition']);
            if (isAutoScrollBrake) {
                brakeOffsetPosition.multiplyScalar(brakingFactor);
            }
            clonedAutoScrollStartPosition.set(sv['_autoScrollBrakingStartPosition']);
            clonedAutoScrollStartPosition.add(brakeOffsetPosition);
        } else {
            const moveDelta = clonedAutoScrollStartPosition.clone();
            moveDelta.subtract(sv['_getContentPosition']());
            const outOfBoundary = sv['_getHowMuchOutOfBoundary'](moveDelta);
            if (!outOfBoundary.equals(ZERO, EPSILON)) {
                clonedAutoScrollStartPosition.add(outOfBoundary);
                reachedEnd = true;
            }
        }

        if (reachedEnd) {
            sv['_autoScrolling'] = false;
        }

        const deltaMove = new Vec3(clonedAutoScrollStartPosition);
        deltaMove.subtract(sv['_getContentPosition']());
        sv['_clampDelta'](deltaMove);
        sv['_moveContent'](deltaMove, reachedEnd);
        sv['_dispatchEvent'](ScrollView.EventType.SCROLLING);

        if (!sv['_autoScrolling']) {
            sv['_isBouncing'] = false;
            sv['_scrolling'] = false;
            sv['_dispatchEvent'](ScrollView.EventType.SCROLL_ENDED);
        }
    }
    //设置模板Item
    setTemplateItem(item) {
        if (!item)
            return;
        let t = this;
        t._itemTmp = item;

        if (t._resizeMode == Layout.ResizeMode.CHILDREN)
            t._itemSize = t._layout.cellSize;
        else {
            t._itemSize = new Size(nodeWidth(item), nodeHeight(item));
        }

        //获取ListItem，如果没有就取消选择模式
        let com = item.getComponent(ListItem);
        let remove = false;
        if (!com)
            remove = true;
        if (remove) {
            t.selectedMode = SelectedType.NONE;
        }
        com = item.getComponent(Widget);
        if (com && com.enabled) {
            t._needUpdateWidget = true;
        }
        if (t.selectedMode == SelectedType.MULT)
            t.multSelected = [];

        switch (t._align) {
            case Layout.Type.HORIZONTAL:
                t._colLineNum = 1;
                t._sizeType = false;
                break;
            case Layout.Type.VERTICAL:
                t._colLineNum = 1;
                t._sizeType = true;
                break;
            case Layout.Type.GRID:
                switch (t._startAxis) {
                    case Layout.AxisDirection.HORIZONTAL:
                        //计算列数
                        let trimW = nodeWidth(t.content) - t._leftGap - t._rightGap;
                        t._colLineNum = Math.floor((trimW + t._columnGap) / (t._itemSize.width + t._columnGap));
                        t._sizeType = true;
                        break;
                    case Layout.AxisDirection.VERTICAL:
                        //计算行数
                        let trimH = nodeHeight(t.content) - t._topGap - t._bottomGap;
                        t._colLineNum = Math.floor((trimH + t._lineGap) / (t._itemSize.height + t._lineGap));
                        t._sizeType = false;
                        break;
                }
                break;
        }
    }
    /**
     * 检查是否初始化
     * @param {Boolean} printLog 是否打印错误信息
     * @returns
     */
    checkInited(printLog = true) {
        if (!this._inited) {
            if (printLog)
                console.error('List initialization not completed!');
            return false;
        }
        return true;
    }
    //禁用 Layout 组件，自行计算 Content Size
    _resizeContent() {
        let t = this;
        let result;

        switch (t._align) {
            case Layout.Type.HORIZONTAL: {
                if (t._customSize) {
                    let fixed = t._getFixedSize(null);
                    result = t._leftGap + fixed.val + (t._itemSize.width * (t._numItems - fixed.count)) + (t._columnGap * (t._numItems - 1)) + t._rightGap;
                } else {
                    result = t._leftGap + (t._itemSize.width * t._numItems) + (t._columnGap * (t._numItems - 1)) + t._rightGap;
                }
                break;
            }
            case Layout.Type.VERTICAL: {
                if (t._customSize) {
                    let fixed = t._getFixedSize(null);
                    result = t._topGap + fixed.val + (t._itemSize.height * (t._numItems - fixed.count)) + (t._lineGap * (t._numItems - 1)) + t._bottomGap;
                } else {
                    result = t._topGap + (t._itemSize.height * t._numItems) + (t._lineGap * (t._numItems - 1)) + t._bottomGap;
                }
                break;
            }
            case Layout.Type.GRID: {
                //网格模式不支持居中
                if (t.lackCenter)
                    t.lackCenter = false;
                switch (t._startAxis) {
                    case Layout.AxisDirection.HORIZONTAL:
                        let lineNum = Math.ceil(t._numItems / t._colLineNum);
                        result = t._topGap + (t._itemSize.height * lineNum) + (t._lineGap * (lineNum - 1)) + t._bottomGap;
                        break;
                    case Layout.AxisDirection.VERTICAL:
                        let colNum = Math.ceil(t._numItems / t._colLineNum);
                        result = t._leftGap + (t._itemSize.width * colNum) + (t._columnGap * (colNum - 1)) + t._rightGap;
                        break;
                }
                break;
            }
        }

        let layout = t.content.getComponent(Layout);
        if (layout)
            layout.enabled = false;

        t._allItemSize = result;
        t._allItemSizeNoEdge = t._allItemSize - (t._sizeType ? (t._topGap + t._bottomGap) : (t._leftGap + t._rightGap));

        if (t.cyclic) {
            let totalSize = (t._sizeType ? nodeHeight(t.node) : nodeWidth(t.node));

            t._cyclicPos1 = 0;
            totalSize -= t._cyclicPos1;
            t._cyclicNum = Math.ceil(totalSize / t._allItemSizeNoEdge) + 1;
            let spacing = t._sizeType ? t._lineGap : t._columnGap;
            t._cyclicPos2 = t._cyclicPos1 + t._allItemSizeNoEdge + spacing;
            t["_cyclicAllItemSize"] = t._allItemSize + (t._allItemSizeNoEdge * (t._cyclicNum - 1)) + (spacing * (t._cyclicNum - 1));
            t["_cycilcAllItemSizeNoEdge"] = t._allItemSizeNoEdge * t._cyclicNum;
            t["_cycilcAllItemSizeNoEdge"] += spacing * (t._cyclicNum - 1);
        }

        t._lack = !t.cyclic && t._allItemSize < (t._sizeType ? nodeHeight(t.node) : nodeWidth(t.node));
        let slideOffset = ((!t._lack || !t.lackCenter) && t.lackSlide) ? 0 : .1;

        let targetWH = t._lack ? ((t._sizeType ? nodeHeight(t.node) : nodeWidth(t.node)) - slideOffset) : (t.cyclic ? t["_cyclicAllItemSize"] : t._allItemSize);
        if (targetWH < 0)
            targetWH = 0;

        if (t._sizeType) {
            setNodeHeight(t.content, targetWH);
        } else {
            setNodeWidth(t.content, targetWH);
        }

        // console.log('_resizeContent()  numItems =', t._numItems, '，content =', t.content);
    }

    //滚动进行时...
    _onScrolling(ev = null) {
        if (this.frameCount == null)
            this.frameCount = this._updateRate;
        if (!this._forceUpdate && (ev && ev.type != 'scroll-ended') && this.frameCount > 0) {
            this.frameCount--;
            return;
        } else
            this.frameCount = this._updateRate;

        if (this._aniDelRuning)
            return;

        //循环列表处理
        if (this.cyclic) {
            let contentPos = this.content.getPosition();
            let scrollPos = this._sizeType ? contentPos.y : contentPos.x;

            let addVal = this._allItemSizeNoEdge + (this._sizeType ? this._lineGap : this._columnGap);
            let add = this._sizeType ? new Vec3(0, addVal, 0) : new Vec3(addVal, 0, 0);

            switch (this._alignCalcType) {
                case 1://单行HORIZONTAL（LEFT_TO_RIGHT）、网格VERTICAL（LEFT_TO_RIGHT）
                    if (scrollPos > -this._cyclicPos1) {
                        contentPos.set(-this._cyclicPos2, contentPos.y, contentPos.z);
                        this.content.setPosition(contentPos);
                        if (this._scrollView.isAutoScrolling()) {
                            this._scrollView['_autoScrollStartPosition'] = this._scrollView['_autoScrollStartPosition'].subtract(add);
                        }
                        // if (this._beganPos) {
                        //     this._beganPos += add;
                        // }
                    } else if (scrollPos < -this._cyclicPos2) {
                        contentPos.set(-this._cyclicPos1, contentPos.y, contentPos.z);
                        this.content.setPosition(contentPos);
                        if (this._scrollView.isAutoScrolling()) {
                            this._scrollView['_autoScrollStartPosition'] = this._scrollView['_autoScrollStartPosition'].add(add);
                        }
                        // if (this._beganPos) {
                        //     this._beganPos -= add;
                        // }
                    }
                    break;
                case 2://单行HORIZONTAL（RIGHT_TO_LEFT）、网格VERTICAL（RIGHT_TO_LEFT）
                    if (scrollPos < this._cyclicPos1) {
                        contentPos.set(this._cyclicPos2, contentPos.y, contentPos.z);
                        this.content.setPosition(contentPos);
                        if (this._scrollView.isAutoScrolling()) {
                            this._scrollView['_autoScrollStartPosition'] = this._scrollView['_autoScrollStartPosition'].add(add);
                        }
                    } else if (scrollPos > this._cyclicPos2) {
                        contentPos.set(this._cyclicPos1, contentPos.y, contentPos.z);
                        this.content.setPosition(contentPos);
                        if (this._scrollView.isAutoScrolling()) {
                            this._scrollView['_autoScrollStartPosition'] = this._scrollView['_autoScrollStartPosition'].subtract(add);
                        }
                    }
                    break;
                case 3://单列VERTICAL（TOP_TO_BOTTOM）、网格HORIZONTAL（TOP_TO_BOTTOM）
                    if (scrollPos < this._cyclicPos1) {
                        contentPos.set(contentPos.x, this._cyclicPos2, contentPos.z);
                        this.content.setPosition(contentPos);
                        if (this._scrollView.isAutoScrolling()) {
                            this._scrollView['_autoScrollStartPosition'] = this._scrollView['_autoScrollStartPosition'].add(add);
                        }
                    } else if (scrollPos > this._cyclicPos2) {
                        contentPos.set(contentPos.x, this._cyclicPos1, contentPos.z);
                        this.content.setPosition(contentPos);
                        if (this._scrollView.isAutoScrolling()) {
                            this._scrollView['_autoScrollStartPosition'] = this._scrollView['_autoScrollStartPosition'].subtract(add);
                        }
                    }
                    break;
                case 4://单列VERTICAL（BOTTOM_TO_TOP）、网格HORIZONTAL（BOTTOM_TO_TOP）
                    if (scrollPos > -this._cyclicPos1) {
                        contentPos.set(contentPos.x, -this._cyclicPos2, contentPos.z);
                        this.content.setPosition(contentPos);
                        if (this._scrollView.isAutoScrolling()) {
                            this._scrollView['_autoScrollStartPosition'] = this._scrollView['_autoScrollStartPosition'].subtract(add);
                        }
                    } else if (scrollPos < -this._cyclicPos2) {
                        contentPos.set(contentPos.x, -this._cyclicPos1, contentPos.z);
                        this.content.setPosition(contentPos);
                        if (this._scrollView.isAutoScrolling()) {
                            this._scrollView['_autoScrollStartPosition'] = this._scrollView['_autoScrollStartPosition'].add(add);
                        }
                    }
                    break;
            }
        }

        this._calcViewPos();

        let vTop, vRight, vBottom, vLeft;
        if (this._sizeType) {
            vTop = this.viewTop;
            vBottom = this.viewBottom;
        } else {
            vRight = this.viewRight;
            vLeft = this.viewLeft;
        }

        if (this._virtual) {
            this.displayData = [];
            let itemPos;

            let curId = 0;
            let endId = this._numItems - 1;

            if (this._customSize) {
                let breakFor = false;
                //如果该item的位置在可视区域内，就推入displayData
                for (; curId <= endId && !breakFor; curId++) {
                    itemPos = this._calcItemPos(curId);
                    switch (this._align) {
                        case Layout.Type.HORIZONTAL:
                            if (itemPos.right >= vLeft && itemPos.left <= vRight) {
                                this.displayData.push(itemPos);
                            } else if (curId != 0 && this.displayData.length > 0) {
                                breakFor = true;
                            }
                            break;
                        case Layout.Type.VERTICAL:
                            if (itemPos.bottom <= vTop && itemPos.top >= vBottom) {
                                this.displayData.push(itemPos);
                            } else if (curId != 0 && this.displayData.length > 0) {
                                breakFor = true;
                            }
                            break;
                        case Layout.Type.GRID:
                            switch (this._startAxis) {
                                case Layout.AxisDirection.HORIZONTAL:
                                    if (itemPos.bottom <= vTop && itemPos.top >= vBottom) {
                                        this.displayData.push(itemPos);
                                    } else if (curId != 0 && this.displayData.length > 0) {
                                        breakFor = true;
                                    }
                                    break;
                                case Layout.AxisDirection.VERTICAL:
                                    if (itemPos.right >= vLeft && itemPos.left <= vRight) {
                                        this.displayData.push(itemPos);
                                    } else if (curId != 0 && this.displayData.length > 0) {
                                        breakFor = true;
                                    }
                                    break;
                            }
                            break;
                    }
                }
            } else {
                let ww = this._itemSize.width + this._columnGap;
                let hh = this._itemSize.height + this._lineGap;
                switch (this._alignCalcType) {
                    case 1://单行HORIZONTAL（LEFT_TO_RIGHT）、网格VERTICAL（LEFT_TO_RIGHT）
                        curId = (vLeft - this._leftGap) / ww;
                        endId = (vRight - this._leftGap) / ww;
                        break;
                    case 2://单行HORIZONTAL（RIGHT_TO_LEFT）、网格VERTICAL（RIGHT_TO_LEFT）
                        curId = (-vRight - this._rightGap) / ww;
                        endId = (-vLeft - this._rightGap) / ww;
                        break;
                    case 3://单列VERTICAL（TOP_TO_BOTTOM）、网格HORIZONTAL（TOP_TO_BOTTOM）
                        curId = (-vTop - this._topGap) / hh;
                        endId = (-vBottom - this._topGap) / hh;
                        break;
                    case 4://单列VERTICAL（BOTTOM_TO_TOP）、网格HORIZONTAL（BOTTOM_TO_TOP）
                        curId = (vBottom - this._bottomGap) / hh;
                        endId = (vTop - this._bottomGap) / hh;
                        break;
                }
                curId = Math.floor(curId) * this._colLineNum;
                endId = Math.ceil(endId) * this._colLineNum;
                endId--;
                if (curId < 0)
                    curId = 0;
                if (endId >= this._numItems)
                    endId = this._numItems - 1;
                for (; curId <= endId; curId++) {
                    this.displayData.push(this._calcItemPos(curId));
                }
            }
            this._delRedundantItem();
            if (this.displayData.length <= 0 || !this._numItems) { //if none, delete all.
                this._lastDisplayData = [];
                return;
            }
            this.firstListId = this.displayData[0].id;
            this.displayItemNum = this.displayData.length;

            let len = this._lastDisplayData.length;

            let haveDataChange = this.displayItemNum != len;
            if (haveDataChange) {
                // 如果是逐帧渲染，需要排序
                if (this.frameByFrameRenderNum > 0) {
                    this._lastDisplayData.sort((a, b) => { return a - b });
                }
                // 因List的显示数据是有序的，所以只需要判断数组长度是否相等，以及头、尾两个元素是否相等即可。
                haveDataChange = this.firstListId != this._lastDisplayData[0] || this.displayData[this.displayItemNum - 1].id != this._lastDisplayData[len - 1];
            }

            if (this._forceUpdate || haveDataChange) {    //如果是强制更新
                if (this.frameByFrameRenderNum > 0) {
                    // if (this._updateDone) {
                    // this._lastDisplayData = [];
                    //逐帧渲染
                    if (this._numItems > 0) {
                        if (!this._updateDone) {
                            this._doneAfterUpdate = true;
                        } else {
                            this._updateCounter = 0;
                        }
                        this._updateDone = false;
                    } else {
                        this._updateCounter = 0;
                        this._updateDone = true;
                    }
                    // }
                } else {
                    //直接渲染
                    this._lastDisplayData = [];
                    // console.debug('List Display Data II::', this.displayData);
                    for (let c = 0; c < this.displayItemNum; c++) {
                        this._createOrUpdateItem(this.displayData[c]);
                    }
                    this._forceUpdate = false;
                }
            }
            this._calcNearestItem();
        }
    }
    //计算可视范围
    _calcViewPos() {
        //为了某些表现效果,父节点可能有偏移
        let contentPos = this.content.getPosition();
        let parentPos = this.content.parent ? this.content.parent.getPosition() : new Vec3(0, 0, 0);
        let scrollPos = new Vec3(contentPos.x + parentPos.x, contentPos.y + parentPos.y, contentPos.z + parentPos.z);
        //const viewUt=this.view.UITransform;
        switch (this._alignCalcType) {
            case 1://单行HORIZONTAL（LEFT_TO_RIGHT）、网格VERTICAL（LEFT_TO_RIGHT）
                this.elasticLeft = scrollPos.x > 0 ? scrollPos.x : 0;
                this.viewLeft = (scrollPos.x < 0 ? -scrollPos.x : 0) - this.elasticLeft;

                this.viewRight = this.viewLeft + nodeWidth(this.node);
                this.elasticRight = this.viewRight > nodeWidth(this.content) ? Math.abs(this.viewRight - nodeWidth(this.content)) : 0;
                this.viewRight += this.elasticRight;
                break;
            case 2://单行HORIZONTAL（RIGHT_TO_LEFT）、网格VERTICAL（RIGHT_TO_LEFT）
                this.elasticRight = scrollPos.x < 0 ? -scrollPos.x : 0;
                this.viewRight = (scrollPos.x > 0 ? -scrollPos.x : 0) + this.elasticRight;
                this.viewLeft = this.viewRight - nodeWidth(this.node);
                this.elasticLeft = this.viewLeft < -nodeWidth(this.content) ? Math.abs(this.viewLeft + nodeWidth(this.content)) : 0;
                this.viewLeft -= this.elasticLeft;
                break;
            case 3://单列VERTICAL（TOP_TO_BOTTOM）、网格HORIZONTAL（TOP_TO_BOTTOM）
                this.elasticTop = scrollPos.y < 0 ? Math.abs(scrollPos.y) : 0;
                this.viewTop = (scrollPos.y > 0 ? -scrollPos.y : 0) + this.elasticTop;
                this.viewBottom = this.viewTop - nodeHeight(this.node);
                this.elasticBottom = this.viewBottom < -nodeHeight(this.content) ? Math.abs(this.viewBottom + nodeHeight(this.content)) : 0;
                this.viewBottom += this.elasticBottom;
                break;
            case 4://单列VERTICAL（BOTTOM_TO_TOP）、网格HORIZONTAL（BOTTOM_TO_TOP）
                this.elasticBottom = scrollPos.y > 0 ? Math.abs(scrollPos.y) : 0;
                this.viewBottom = (scrollPos.y < 0 ? -scrollPos.y : 0) - this.elasticBottom;
                this.viewTop = this.viewBottom + nodeHeight(this.node);
                this.elasticTop = this.viewTop > nodeHeight(this.content) ? Math.abs(this.viewTop - nodeHeight(this.content)) : 0;
                this.viewTop -= this.elasticTop;
                break;
        }
    }
    //计算位置 根据id
    _calcItemPos(id) {
        let width, height, top, bottom, left, right, itemX, itemY;
        switch (this._align) {
            case Layout.Type.HORIZONTAL:
                switch (this._horizontalDir) {
                    case Layout.HorizontalDirection.LEFT_TO_RIGHT: {
                        if (this._customSize) {
                            let fixed = this._getFixedSize(id);
                            left = this._leftGap + ((this._itemSize.width + this._columnGap) * (id - fixed.count)) + (fixed.val + (this._columnGap * fixed.count));
                            let cs = this._customSize[id];
                            width = (cs > 0 ? cs : this._itemSize.width);
                        } else {
                            left = this._leftGap + ((this._itemSize.width + this._columnGap) * id);
                            width = this._itemSize.width;
                        }
                        if (this.lackCenter) {
                            left -= this._leftGap;
                            let offset = (nodeWidth(this.content) / 2) - (this._allItemSizeNoEdge / 2);
                            left += offset;
                        }
                        right = left + width;
                        return {
                            id: id,
                            left: left,
                            right: right,
                            x: left + (nodeAnchorX(this._itemTmp) * width),
                            y: this._itemTmp.y,
                        };
                    }
                    case Layout.HorizontalDirection.RIGHT_TO_LEFT: {
                        if (this._customSize) {
                            let fixed = this._getFixedSize(id);
                            right = -this._rightGap - ((this._itemSize.width + this._columnGap) * (id - fixed.count)) - (fixed.val + (this._columnGap * fixed.count));
                            let cs = this._customSize[id];
                            width = (cs > 0 ? cs : this._itemSize.width);
                        } else {
                            right = -this._rightGap - ((this._itemSize.width + this._columnGap) * id);
                            width = this._itemSize.width;
                        }
                        if (this.lackCenter) {
                            right += this._rightGap;
                            let offset = (nodeWidth(this.content) / 2) - (this._allItemSizeNoEdge / 2);
                            right -= offset;
                        }
                        left = right - width;
                        return {
                            id: id,
                            right: right,
                            left: left,
                            x: left + (nodeAnchorX(this._itemTmp) * width),
                            y: this._itemTmp.y,
                        };
                    }
                }
                break;
            case Layout.Type.VERTICAL: {
                switch (this._verticalDir) {
                    case Layout.VerticalDirection.TOP_TO_BOTTOM: {
                        if (this._customSize) {
                            let fixed = this._getFixedSize(id);
                            top = -this._topGap - ((this._itemSize.height + this._lineGap) * (id - fixed.count)) - (fixed.val + (this._lineGap * fixed.count));
                            let cs = this._customSize[id];
                            height = (cs > 0 ? cs : this._itemSize.height);
                        } else {
                            top = -this._topGap - ((this._itemSize.height + this._lineGap) * id);
                            height = this._itemSize.height;
                        }
                        if (this.lackCenter) {
                            top += this._topGap;
                            let offset = (nodeHeight(this.content) / 2) - (this._allItemSizeNoEdge / 2);
                            top -= offset;
                        }
                        bottom = top - height;
                        return {
                            id: id,
                            top: top,
                            bottom: bottom,
                            x: this._itemTmp.x,
                            y: bottom + (nodeAnchorY(this._itemTmp) * height),
                        };
                    }
                    case Layout.VerticalDirection.BOTTOM_TO_TOP: {
                        if (this._customSize) {
                            let fixed = this._getFixedSize(id);
                            bottom = this._bottomGap + ((this._itemSize.height + this._lineGap) * (id - fixed.count)) + (fixed.val + (this._lineGap * fixed.count));
                            let cs = this._customSize[id];
                            height = (cs > 0 ? cs : this._itemSize.height);
                        } else {
                            bottom = this._bottomGap + ((this._itemSize.height + this._lineGap) * id);
                            height = this._itemSize.height;
                        }
                        if (this.lackCenter) {
                            bottom -= this._bottomGap;
                            let offset = (nodeHeight(this.content) / 2) - (this._allItemSizeNoEdge / 2);
                            bottom += offset;
                        }
                        top = bottom + height;
                        return {
                            id: id,
                            top: top,
                            bottom: bottom,
                            x: this._itemTmp.x,
                            y: bottom + (nodeAnchorY(this._itemTmp) * height),
                        };
                        break;
                    }
                }
            }
            case Layout.Type.GRID: {
                let colLine = Math.floor(id / this._colLineNum);
                switch (this._startAxis) {
                    case Layout.AxisDirection.HORIZONTAL: {
                        switch (this._verticalDir) {
                            case Layout.VerticalDirection.TOP_TO_BOTTOM: {
                                top = -this._topGap - ((this._itemSize.height + this._lineGap) * colLine);
                                bottom = top - this._itemSize.height;
                                itemY = bottom + (nodeAnchorY(this._itemTmp) * this._itemSize.height);
                                break;
                            }
                            case Layout.VerticalDirection.BOTTOM_TO_TOP: {
                                bottom = this._bottomGap + ((this._itemSize.height + this._lineGap) * colLine);
                                top = bottom + this._itemSize.height;
                                itemY = bottom + (nodeAnchorY(this._itemTmp) * this._itemSize.height);
                                break;
                            }
                        }
                        itemX = this._leftGap + ((id % this._colLineNum) * (this._itemSize.width + this._columnGap));
                        switch (this._horizontalDir) {
                            case Layout.HorizontalDirection.LEFT_TO_RIGHT: {
                                itemX += (nodeAnchorX(this._itemTmp) * this._itemSize.width);
                                itemX -= (nodeAnchorX(this.content) * nodeWidth(this.content));
                                break;
                            }
                            case Layout.HorizontalDirection.RIGHT_TO_LEFT: {
                                itemX += ((1 - nodeAnchorX(this._itemTmp)) * this._itemSize.width);
                                itemX -= ((1 - nodeAnchorX(this.content)) * nodeWidth(this.content));
                                itemX *= -1;
                                break;
                            }
                        }
                        return {
                            id: id,
                            top: top,
                            bottom: bottom,
                            x: itemX,
                            y: itemY,
                        };
                    }
                    case Layout.AxisDirection.VERTICAL: {
                        switch (this._horizontalDir) {
                            case Layout.HorizontalDirection.LEFT_TO_RIGHT: {
                                left = this._leftGap + ((this._itemSize.width + this._columnGap) * colLine);
                                right = left + this._itemSize.width;
                                itemX = left + (nodeAnchorX(this._itemTmp) * this._itemSize.width);
                                itemX -= (nodeAnchorX(this.content) * nodeWidth(this.content));
                                break;
                            }
                            case Layout.HorizontalDirection.RIGHT_TO_LEFT: {
                                right = -this._rightGap - ((this._itemSize.width + this._columnGap) * colLine);
                                left = right - this._itemSize.width;
                                itemX = left + (nodeAnchorX(this._itemTmp) * this._itemSize.width);
                                itemX += ((1 - nodeAnchorX(this.content)) * nodeWidth(this.content));
                                break;
                            }
                        }
                        itemY = -this._topGap - ((id % this._colLineNum) * (this._itemSize.height + this._lineGap));
                        switch (this._verticalDir) {
                            case Layout.VerticalDirection.TOP_TO_BOTTOM: {
                                itemY -= ((1 - nodeAnchorY(this._itemTmp)) * this._itemSize.height);
                                itemY += ((1 - nodeAnchorY(this.content)) * nodeHeight(this.content));
                                break;
                            }
                            case Layout.VerticalDirection.BOTTOM_TO_TOP: {
                                itemY -= ((nodeAnchorY(this._itemTmp)) * this._itemSize.height);
                                itemY += (nodeAnchorY(this.content) * nodeHeight(this.content));
                                itemY *= -1;
                                break;
                            }
                        }
                        return {
                            id: id,
                            left: left,
                            right: right,
                            x: itemX,
                            y: itemY,
                        };
                    }
                }
                break;
            }
        }
    }
    //计算已存在的Item的位置
    _calcExistItemPos(id) {
        let item = this.getItemByListId(id);
        if (!item)
            return null;
        let pos = item.getPosition();
        let data: ListItemPos = {
            id: id,
            x: pos.x,
            y: pos.y,
        }
        if (this._sizeType) {
            data.top = pos.y + (nodeHeight(item) * (1 - nodeAnchorY(item)));
            data.bottom = pos.y - (nodeHeight(item) * nodeAnchorY(item));
        } else {
            data.left = pos.x - (nodeWidth(item) * nodeAnchorX(item));
            data.right = pos.x + (nodeWidth(item) * (1 - nodeAnchorX(item)));
        }
        return data;
    }
    //获取Item位置
    getItemPos(id) {
        if (this._virtual)
            return this._calcItemPos(id);
        else {
            if (this.frameByFrameRenderNum)
                return this._calcItemPos(id);
            else
                return this._calcExistItemPos(id);
        }
    }
    //获取固定尺寸
    _getFixedSize(listId) {
        if (!this._customSize)
            return null;
        if (listId == null)
            listId = this._numItems;
        let fixed = 0;
        let count = 0;
        for (let id in this._customSize) {
            if (parseInt(id) < listId) {
                fixed += this._customSize[id];
                count++;
            }
        }
        return {
            val: fixed,
            count: count,
        }
    }
    //滚动结束时..
    _onScrollBegan() {
        this._beganPos = this._sizeType ? this.viewTop : this.viewLeft;
    }
    //滚动结束时..
    _onScrollEnded() {
        let t = this;
        t._curScrollIsTouch = false;
        if (t.scrollToListId != null) {
            let item = t.getItemByListId(t.scrollToListId);
            t.scrollToListId = null;
            if (item) {
                tween(item)
                    .to(.1, { scale: new Vec3(1.06, 1.06, 1.06) })
                    .to(.1, { scale: new Vec3(1, 1, 1) })
                    .start();
            }
        }
        t._onScrolling();

        if (t._slideMode == SlideType.ADHERING &&
            !t.adhering
        ) {
            //console.debug(t.adhering, t._scrollView.isAutoScrolling(), t._scrollView.isScrolling());
            t.adhere();
        } else if (t._slideMode == SlideType.PAGE) {
            if (t._beganPos != null && t._curScrollIsTouch) {
                this._pageAdhere();
            } else {
                t.adhere();
            }
        }
    }
    // 触摸时
    _onTouchStart(ev, captureListeners) {
        // 兼容不同版本 ScrollView：_hasNestedViewGroup 可能不存在或不是函数
        if (this._scrollView && typeof this._scrollView._hasNestedViewGroup === 'function') {
            if (this._scrollView._hasNestedViewGroup(ev, captureListeners))
                return;
        }
        this._curScrollIsTouch = true;
        let isMe = ev.eventPhase === Event.AT_TARGET && ev.target === this.node;
        if (!isMe) {
            let itemNode = ev.target;
            while (itemNode._listId == null && itemNode.parent)
                itemNode = itemNode.parent;
            this._scrollItem = itemNode._listId != null ? itemNode : ev.target;
        }
    }
    //触摸抬起时..
    _onTouchUp() {
        let t = this;
        t._scrollPos = null;
        if (t._slideMode == SlideType.ADHERING) {
            if (this.adhering)
                this._adheringBarrier = true;
            t.adhere();
        } else if (t._slideMode == SlideType.PAGE) {
            if (t._beganPos != null) {
                this._pageAdhere();
            } else {
                t.adhere();
            }
        }
        this._scrollItem = null;
    }

    _onTouchCancelled(ev, captureListeners) {
        let t = this;
        // 同上，安全调用 _hasNestedViewGroup
        if (t._scrollView && typeof t._scrollView._hasNestedViewGroup === 'function') {
            if (t._scrollView._hasNestedViewGroup(ev, captureListeners) || ev.simulate)
                return;
        }

        t._scrollPos = null;
        if (t._slideMode == SlideType.ADHERING) {
            if (t.adhering)
                t._adheringBarrier = true;
            t.adhere();
        } else if (t._slideMode == SlideType.PAGE) {
            if (t._beganPos != null) {
                t._pageAdhere();
            } else {
                t.adhere();
            }
        }
        this._scrollItem = null;
    }
    //当尺寸改变
    _onSizeChanged() {
        if (this.checkInited(false))
            this._onScrolling();
    }
    //当Item自适应
    _onItemAdaptive(item) {
        // if (this.checkInited(false)) {
        if (
            (!this._sizeType && nodeWidth(item) != this._itemSize.width)
            || (this._sizeType && nodeHeight(item) != this._itemSize.height)
        ) {
            if (!this._customSize)
                this._customSize = {};
            let val = this._sizeType ? nodeHeight(item) : nodeWidth(item);
            if (this._customSize[item._listId] != val) {
                this._customSize[item._listId] = val;
                this._resizeContent();
                // this.content.children.forEach((child) => {
                //     this._updateItemPos(child);
                // });
                this.updateAll();
                // 如果当前正在运行 scrollTo，肯定会不准确，在这里做修正
                if (this._scrollToListId != null) {
                    this._scrollPos = null;
                    this.unschedule(this._scrollToSo);
                    this.scrollTo(this._scrollToListId, Math.max(0, this._scrollToEndTime - ((new Date()).getTime() / 1000)));
                }
            }
        }
        // }
    }
    //PAGE粘附
    _pageAdhere() {
        let t = this;
        if (!t.cyclic && (t.elasticTop > 0 || t.elasticRight > 0 || t.elasticBottom > 0 || t.elasticLeft > 0))
            return;
        let curPos = t._sizeType ? t.viewTop : t.viewLeft;
        let dis = (t._sizeType ? nodeHeight(t.node) : nodeWidth(t.node)) * t.pageDistance;
        let canSkip = Math.abs(t._beganPos - curPos) > dis;
        if (canSkip) {
            let timeInSecond = .5;
            switch (t._alignCalcType) {
                case 1://单行HORIZONTAL（LEFT_TO_RIGHT）、网格VERTICAL（LEFT_TO_RIGHT）
                case 4://单列VERTICAL（BOTTOM_TO_TOP）、网格HORIZONTAL（BOTTOM_TO_TOP）
                    if (t._beganPos > curPos) {
                        t.prePage(timeInSecond);
                    } else {
                        t.nextPage(timeInSecond);
                    }
                    break;
                case 2://单行HORIZONTAL（RIGHT_TO_LEFT）、网格VERTICAL（RIGHT_TO_LEFT）
                case 3://单列VERTICAL（TOP_TO_BOTTOM）、网格HORIZONTAL（TOP_TO_BOTTOM）
                    if (t._beganPos < curPos) {
                        t.prePage(timeInSecond);
                    } else {
                        t.nextPage(timeInSecond);
                    }
                    break;
            }
        } else if (t.elasticTop <= 0 && t.elasticRight <= 0 && t.elasticBottom <= 0 && t.elasticLeft <= 0) {
            t.adhere();
        }
        t._beganPos = null;
    }
    //粘附
    adhere() {
        let t = this;
        if (!t.checkInited())
            return;
        if (t.elasticTop > 0 || t.elasticRight > 0 || t.elasticBottom > 0 || t.elasticLeft > 0)
            return;
        t.adhering = true;
        t._calcNearestItem();
        let offset = (t._sizeType ? t._topGap : t._leftGap) / (t._sizeType ? nodeHeight(t.node) : nodeWidth(t.node));
        let timeInSecond = .7;
        t.scrollTo(t.nearestListId, timeInSecond, offset);
    }
    //Update..
    update() {
        if (this.frameByFrameRenderNum <= 0 || this._updateDone)
            return;
        // console.debug(this.displayData.length, this._updateCounter, this.displayData[this._updateCounter]);
        if (this._virtual) {
            let len = (this._updateCounter + this.frameByFrameRenderNum) > this.displayItemNum ? this.displayItemNum : (this._updateCounter + this.frameByFrameRenderNum);
            for (let n = this._updateCounter; n < len; n++) {
                let data = this.displayData[n];
                if (data) {
                    this._createOrUpdateItem(data);
                }
            }

            if (this._updateCounter >= this.displayItemNum - 1) { //最后一个
                if (this._doneAfterUpdate) {
                    this._updateCounter = 0;
                    this._updateDone = false;
                    // if (!this._scrollView.isScrolling())
                    this._doneAfterUpdate = false;
                } else {
                    this._updateDone = true;
                    this._delRedundantItem();
                    this._forceUpdate = false;
                    this._calcNearestItem();
                    if (this.slideMode == SlideType.PAGE)
                        this.curPageNum = this.nearestListId;
                }
            } else {
                this._updateCounter += this.frameByFrameRenderNum;
            }
        } else {
            if (this._updateCounter < this._numItems) {
                let len = (this._updateCounter + this.frameByFrameRenderNum) > this._numItems ? this._numItems : (this._updateCounter + this.frameByFrameRenderNum);
                for (let n = this._updateCounter; n < len; n++) {
                    this._createOrUpdateItem2(n);
                }
                this._updateCounter += this.frameByFrameRenderNum;
            } else {
                this._updateDone = true;
                this._calcNearestItem();
                if (this.slideMode == SlideType.PAGE)
                    this.curPageNum = this.nearestListId;
            }
        }
    }
    /**
     * 创建或更新Item（虚拟列表用）
     * @param {Object} data 数据
     */
    _createOrUpdateItem(data) {
        let item = this.getItemByListId(data.id);
        if (!item) { //如果不存在
            let canGet = this._pool.size() > 0;
            if (canGet) {
                item = this._pool.get() as ListNode;
                // console.debug('从池中取出::   旧id =', item['_listId'], '，新id =', data.id, item);
            } else {
                item = instantiate(this._itemTmp) as ListNode;
                // console.debug('新建::', data.id, item);
            }
            if (!canGet || !isValid(item)) {
                item = instantiate(this._itemTmp) as ListNode;
                canGet = false;
            }
            if (item._listId != data.id) {
                item._listId = data.id;
                setNodeSize(item, this._itemSize.width, this._itemSize.height);
            }
            item.setPosition(new Vec3(data.x, data.y, 0));
            this._resetItemSize(item);
            this.content.addChild(item);
            if (canGet && this._needUpdateWidget) {
                let widget = item.getComponent(Widget);
                if (widget)
                    widget.updateAlignment();
            }
            // item.setSiblingIndex(data.id);
            // Note: In Cocos Creator 2.0, priority is not available on node
            // for (let i = 0; i < this.content.children.length; i++) {
            //     let tNode = this._mapObj[i]
            //     tNode.setSiblingIndex(i)
            // }
            let listItem = item.getComponent(ListItem);
            item.listItem = listItem;
            if (listItem) {
                listItem.listId = data.id;
                listItem.list = this;
                listItem._registerEvent();
            }
            if (this.renderEvent) {
                EventHandler.emitEvents([this.renderEvent], item, data.id % this._actualNumItems);
            }
        } else if (this._forceUpdate && this.renderEvent) { //强制更新
            item.setPosition(new Vec3(data.x, data.y, 0));
            this._resetItemSize(item);
            // console.debug('ADD::', data.id, item);
            if (this.renderEvent) {
                EventHandler.emitEvents([this.renderEvent], item, data.id % this._actualNumItems);
            }
        }
        this._resetItemSize(item);

        this._updateListItem(item.listItem);
        if (this._lastDisplayData.indexOf(data.id) < 0) {
            this._lastDisplayData.push(data.id);
        }
    }
    //创建或更新Item（非虚拟列表用）
    _createOrUpdateItem2(listId) {
        let item = this.content.children[listId] as ListNode;
        let listItem;
        if (!item) { //如果不存在
            item = instantiate(this._itemTmp) as ListNode;
            item._listId = listId;
            this.content.addChild(item);
            listItem = item.getComponent(ListItem);
            item.listItem = listItem;
            if (listItem) {
                listItem.listId = listId;
                listItem.list = this;
                listItem._registerEvent();
            }
            if (this.renderEvent) {
                EventHandler.emitEvents([this.renderEvent], item, listId % this._actualNumItems);
            }
        } else if (this._forceUpdate && this.renderEvent) { //强制更新
            item._listId = listId;
            if (listItem)
                listItem.listId = listId;
            if (this.renderEvent) {
                EventHandler.emitEvents([this.renderEvent], item, listId % this._actualNumItems);
            }
        }
        this._updateListItem(listItem);
        if (this._lastDisplayData.indexOf(listId) < 0) {
            this._lastDisplayData.push(listId);
        }
    }

    _updateListItem(listItem) {
        if (!listItem)
            return;
        if (this.selectedMode > SelectedType.NONE) {
            let item = listItem.node;
            switch (this.selectedMode) {
                case SelectedType.SINGLE:
                    listItem.selected = this.selectedId == item._listId;
                    break;
                case SelectedType.MULT:
                    listItem.selected = this.multSelected.indexOf(item._listId) >= 0;
                    break;
            }
        }
    }
    //仅虚拟列表用
    _resetItemSize(item) {
        return;
        let size;
        if (this._customSize && this._customSize[item._listId]) {
            size = this._customSize[item._listId];
        } else {
            if (this._colLineNum > 1) {
                setNodeSize(item, this._itemSize.width, this._itemSize.height);
            } else
                size = this._sizeType ? this._itemSize.height : this._itemSize.width;
        }
        if (size) {
            if (this._sizeType)
                setNodeHeight(item, size);
            else
                setNodeWidth(item, size);
        }
    }
    /**
     * 更新Item位置
     * @param {Number||Node} listIdOrItem
     */
    _updateItemPos(listIdOrItem) {
        let item = isNaN(listIdOrItem) ? listIdOrItem : this.getItemByListId(listIdOrItem);
        let pos = this.getItemPos(item._listId);
        item.setPosition(pos.x, pos.y);
    }
    /**
     * 设置多选
     * @param {Array} args 可以是单个listId，也可是个listId数组
     * @param {Boolean} bool 值，如果为null的话，则直接用args覆盖
     */
    setMultSelected(args, bool) {
        let t = this;
        if (!t.checkInited())
            return;
        if (!Array.isArray(args)) {
            args = [args];
        }
        if (bool == null) {
            t.multSelected = args;
        } else {
            let listId, sub;
            if (bool) {
                for (let n = args.length - 1; n >= 0; n--) {
                    listId = args[n];
                    sub = t.multSelected.indexOf(listId);
                    if (sub < 0) {
                        t.multSelected.push(listId);
                    }
                }
            } else {
                for (let n = args.length - 1; n >= 0; n--) {
                    listId = args[n];
                    sub = t.multSelected.indexOf(listId);
                    if (sub >= 0) {
                        t.multSelected.splice(sub, 1);
                    }
                }
            }
        }
        t._forceUpdate = true;
        t._onScrolling();
    }
    /**
     * 获取多选数据
     * @returns
     */
    getMultSelected() {
        return this.multSelected;
    }
    /**
     * 多选是否有选择
     * @param {number} listId 索引
     * @returns
     */
    hasMultSelected(listId) {
        return this.multSelected && this.multSelected.indexOf(listId) >= 0;
    }
    /**
     * 更新指定的Item
     * @param {Array} args 单个listId，或者数组
     * @returns
     */
    updateItem(args) {
        if (!this.checkInited())
            return;
        if (!Array.isArray(args)) {
            args = [args];
        }
        for (let n = 0, len = args.length; n < len; n++) {
            let listId = args[n];
            let item = this.getItemByListId(listId);
            if (item)
                EventHandler.emitEvents([this.renderEvent], item, listId % this._actualNumItems);
        }
    }
    /**
     * 更新全部
     */
    updateAll() {
        if (!this.checkInited())
            return;
        this.numItems = this.numItems;
    }
    /**
     * 根据ListID获取Item
     * @param {Number} listId
     * @returns
     */
    getItemByListId(listId) {
        if (this.content) {
            for (let n = this.content.children.length - 1; n >= 0; n--) {
                let item = this.content.children[n] as ListNode;
                if (item["_listId"] == listId)
                    return item;
            }
        }
    }
    /**
     * 获取在显示区域外的Item
     * @returns
     */
    _getOutsideItem() {
        let item;
        let result = [];
        for (let n = this.content.children.length - 1; n >= 0; n--) {
            item = this.content.children[n] as ListNode;
            if (!this.displayData.find(d => d.id == item._listId)) {
                result.push(item);
            }
        }
        return result;
    }
    //删除显示区域以外的Item
    _delRedundantItem() {
        if (this._virtual) {
            let arr = this._getOutsideItem();
            for (let n = arr.length - 1; n >= 0; n--) {
                let item = arr[n];
                if (this._scrollItem && item._listId == this._scrollItem._listId)
                    continue;
                item.isCached = true;
                this._pool.put(item);
                for (let m = this._lastDisplayData.length - 1; m >= 0; m--) {
                    if (this._lastDisplayData[m] == item._listId) {
                        this._lastDisplayData.splice(m, 1);
                        break;
                    }
                }
            }
            // console.debug('存入::', str, '    pool.length =', this._pool.length);
        } else {
            while (this.content.children.length > this._numItems) {
                this._delSingleItem(this.content.children[this.content.children.length - 1]);
            }
        }
    }
    //删除单个Item
    _delSingleItem(item) {
        // console.debug('DEL::', item['_listId'], item);
        item.removeFromParent();
        if (item.destroy)
            item.destroy();
        item = null;
    }
    /** 
     * 动效删除Item（此方法只适用于虚拟列表，即_virtual=true）
     * 一定要在回调函数里重新设置新的numItems进行刷新，毕竟本List是靠数据驱动的。
     */
    aniDelItem(listId, callFunc, aniType) {
        let t = this;

        if (!t.checkInited() || t.cyclic || !t._virtual)
            return console.error('This function is not allowed to be called!');

        if (!callFunc)
            return console.error('CallFunc are not allowed to be NULL, You need to delete the corresponding index in the data array in the CallFunc!');

        if (t._aniDelRuning)
            return console.warn('Please wait for the current deletion to finish!');

        let item = t.getItemByListId(listId);
        let listItem;
        if (!item) {
            callFunc(listId);
            return;
        } else {
            listItem = item.getComponent(ListItem);
        }
        t._aniDelRuning = true;
        t._aniDelCB = callFunc;
        t._aniDelItem = item;
        t._aniDelBeforePos = item.position;
        t._aniDelBeforeScale = item.scale;
        let curLastId = t.displayData[t.displayData.length - 1].id;
        let resetSelectedId = listItem.selected;
        listItem.showAni(aniType, () => {
            //判断有没有下一个，如果有的话，创建粗来
            let newId;
            if (curLastId < t._numItems - 2) {
                newId = curLastId + 1;
            }
            if (newId != null) {
                let newData = t._calcItemPos(newId);
                t.displayData.push(newData);
                if (t._virtual)
                    t._createOrUpdateItem(newData);
                else
                    t._createOrUpdateItem2(newId);
            } else
                t._numItems--;
            if (t.selectedMode == SelectedType.SINGLE) {
                if (resetSelectedId) {
                    t._selectedId = -1;
                } else if (t._selectedId - 1 >= 0) {
                    t._selectedId--;
                }
            } else if (t.selectedMode == SelectedType.MULT && t.multSelected.length) {
                let sub = t.multSelected.indexOf(listId);
                if (sub >= 0) {
                    t.multSelected.splice(sub, 1);
                }
                //多选的数据，在其后的全部减一
                for (let n = t.multSelected.length - 1; n >= 0; n--) {
                    let id = t.multSelected[n];
                    if (id >= listId)
                        t.multSelected[n]--;
                }
            }
            if (t._customSize) {
                if (t._customSize[listId])
                    delete t._customSize[listId];
                let newCustomSize = {};
                let size;
                for (let id in t._customSize) {
                    size = t._customSize[id];
                    let idNumber = parseInt(id);
                    newCustomSize[idNumber - (idNumber >= listId ? 1 : 0)] = size;
                }
                t._customSize = newCustomSize;
            }
            //后面的Item向前怼的动效
            let sec = .2333;
            let twe, haveCB;
            for (let n = newId != null ? newId : curLastId; n >= listId + 1; n--) {
                item = t.getItemByListId(n);
                if (item) {
                    let posData = t._calcItemPos(n - 1);
                    twe = tween(item)
                        .to(sec, { position: new Vec3(posData.x, posData.y, 0) });

                    if (n <= listId + 1) {
                        haveCB = true;
                        twe.call(() => {
                            t._aniDelRuning = false;
                            callFunc(listId);
                            delete t._aniDelCB;
                        });
                    }
                    twe.start();
                }
            }
            if (!haveCB) {
                t._aniDelRuning = false;
                callFunc(listId);
                t._aniDelCB = null;
            }
        }, true);
    }
    /**
     * 滚动到..
     * @param {Number} listId 索引（如果<0，则滚到首个Item位置，如果>=_numItems，则滚到最末Item位置）
     * @param {Number} timeInSecond 时间
     * @param {Number} offset 索引目标位置偏移，0-1
     * @param {Boolean} overStress 滚动后是否强调该Item（这只是个实验功能）
     */
    scrollTo(listId, timeInSecond = .5, offset = null, overStress = false) {
        let t = this;
        if (!t.checkInited(false))
            return;
        // t._scrollView.stopAutoScroll();
        if (timeInSecond == null)   //默认0.5
            timeInSecond = .5;
        else if (timeInSecond < 0)
            timeInSecond = 0;
        if (listId < 0)
            listId = 0;
        else if (listId >= t._numItems)
            listId = t._numItems - 1;
        // 以防设置了numItems之后layout的尺寸还未更新
        if (!t._virtual && t._layout && t._layout.enabled)
            t._layout.updateLayout();

        let pos = t.getItemPos(listId);
        if (!pos) {
            return DEV && console.error('pos is null', listId);
        }
        let targetX, targetY;
        let scrollOffset = new Vec3();

        switch (t._alignCalcType) {
                case 1://单行HORIZONTAL（LEFT_TO_RIGHT）、网格VERTICAL（LEFT_TO_RIGHT）
                targetX = pos.left;
                if (offset != null)
                    targetX -= nodeWidth(t.node) * offset;
                else
                    targetX -= t._leftGap;
                scrollOffset = new Vec3(targetX, 0, 0);
                break;
            case 2://单行HORIZONTAL（RIGHT_TO_LEFT）、网格VERTICAL（RIGHT_TO_LEFT）
                targetX = pos.right - nodeWidth(t.node);
                if (offset != null)
                    targetX += nodeWidth(t.node) * offset;
                else
                    targetX += t._rightGap;
                scrollOffset = new Vec3(targetX + nodeWidth(t.content), 0, 0);
                break;
            case 3://单列VERTICAL（TOP_TO_BOTTOM）、网格HORIZONTAL（TOP_TO_BOTTOM）
                targetY = pos.top;
                if (offset != null)
                    targetY += nodeHeight(t.node) * offset;
                else
                    targetY += t._topGap;
                scrollOffset = new Vec3(0, -targetY, 0);
                break;
            case 4://单列VERTICAL（BOTTOM_TO_TOP）、网格HORIZONTAL（BOTTOM_TO_TOP）
                targetY = pos.bottom + nodeHeight(t.node);
                if (offset != null)
                    targetY -= nodeHeight(t.node) * offset;
                else
                    targetY -= t._bottomGap;
                scrollOffset = new Vec3(0, -targetY + nodeHeight(t.content), 0);
                break;
        }
        let viewPos = t.content.getPosition();
        viewPos = Math.abs(t._sizeType ? viewPos.y : viewPos.x);

        let comparePos = t._sizeType ? scrollOffset.y : scrollOffset.x;
        let runScroll = Math.abs((t._scrollPos != null ? t._scrollPos : viewPos) - comparePos) > .5;
        // console.debug(runScroll, t._scrollPos, viewPos, comparePos)

        // t._scrollView.stopAutoScroll();
        if (runScroll) {
            t._scrollView.scrollToOffset(scrollOffset, timeInSecond);
            t._scrollToListId = listId;
            t._scrollToEndTime = ((new Date()).getTime() / 1000) + timeInSecond;
            // console.debug(listId, t.content.width, t.content.getPosition(), pos);
            t._scrollToSo = t.scheduleOnce(() => {
                if (!t._adheringBarrier) {
                    t.adhering = t._adheringBarrier = false;
                }
                t._scrollPos =
                    t._scrollToListId =
                    t._scrollToEndTime =
                    t._scrollToSo =
                    null;
                //console.debug('2222222222', t._adheringBarrier)
                if (overStress) {
                    // t.scrollToListId = listId;
                    let item = t.getItemByListId(listId);
                    if (item) {
                        tween(item)
                            .to(.1, { scale: new Vec3(1.05, 1.05, item.scale.z) })
                            .to(.1, { scale: new Vec3(1, 1, item.scale.z) })
                            .start();
                    }
                }
            }, timeInSecond + .1);

            if (timeInSecond <= 0) {
                t._onScrolling();
            }
        }
    }
    /**
     * 计算当前滚动窗最近的Item
     */
    _calcNearestItem() {
        let t = this;
        t.nearestListId = null;
        let data, center;

        if (t._virtual)
            t._calcViewPos();

        let vTop, vRight, vBottom, vLeft;
        vTop = t.viewTop;
        vRight = t.viewRight;
        vBottom = t.viewBottom;
        vLeft = t.viewLeft;

        let breakFor = false;
        for (let n = 0; n < t.content.children.length && !breakFor; n += t._colLineNum) {
            data = t._virtual ? t.displayData[n] : t._calcExistItemPos(n);
            if (data) {
                center = t._sizeType ? ((data.top + data.bottom) / 2) : (center = (data.left + data.right) / 2);
                switch (t._alignCalcType) {
                    case 1://单行HORIZONTAL（LEFT_TO_RIGHT）、网格VERTICAL（LEFT_TO_RIGHT）
                        if (data.right >= vLeft) {
                            t.nearestListId = data.id;
                            if (vLeft > center)
                                t.nearestListId += t._colLineNum;
                            breakFor = true;
                        }
                        break;
                    case 2://单行HORIZONTAL（RIGHT_TO_LEFT）、网格VERTICAL（RIGHT_TO_LEFT）
                        if (data.left <= vRight) {
                            t.nearestListId = data.id;
                            if (vRight < center)
                                t.nearestListId += t._colLineNum;
                            breakFor = true;
                        }
                        break;
                    case 3://单列VERTICAL（TOP_TO_BOTTOM）、网格HORIZONTAL（TOP_TO_BOTTOM）
                        if (data.bottom <= vTop) {
                            t.nearestListId = data.id;
                            if (vTop < center)
                                t.nearestListId += t._colLineNum;
                            breakFor = true;
                        }
                        break;
                    case 4://单列VERTICAL（BOTTOM_TO_TOP）、网格HORIZONTAL（BOTTOM_TO_TOP）
                        if (data.top >= vBottom) {
                            t.nearestListId = data.id;
                            if (vBottom > center)
                                t.nearestListId += t._colLineNum;
                            breakFor = true;
                        }
                        break;
                }
            }
        }
        //判断最后一个Item。。。（哎，这些判断真心恶心，判断了前面的还要判断最后一个。。。一开始呢，就只有一个布局（单列布局），那时候代码才三百行，后来就想着完善啊，艹..这坑真深，现在这行数都一千五了= =||）
        data = t._virtual ? t.displayData[t.displayItemNum - 1] : t._calcExistItemPos(t._numItems - 1);
        if (data && data.id == t._numItems - 1) {
            center = t._sizeType ? ((data.top + data.bottom) / 2) : (center = (data.left + data.right) / 2);
            switch (t._alignCalcType) {
                case 1://单行HORIZONTAL（LEFT_TO_RIGHT）、网格VERTICAL（LEFT_TO_RIGHT）
                    if (vRight > center)
                        t.nearestListId = data.id;
                    break;
                case 2://单行HORIZONTAL（RIGHT_TO_LEFT）、网格VERTICAL（RIGHT_TO_LEFT）
                    if (vLeft < center)
                        t.nearestListId = data.id;
                    break;
                case 3://单列VERTICAL（TOP_TO_BOTTOM）、网格HORIZONTAL（TOP_TO_BOTTOM）
                    if (vBottom < center)
                        t.nearestListId = data.id;
                    break;
                case 4://单列VERTICAL（BOTTOM_TO_TOP）、网格HORIZONTAL（BOTTOM_TO_TOP）
                    if (vTop > center)
                        t.nearestListId = data.id;
                    break;
            }
        }
        // console.debug('t.nearestListId =', t.nearestListId);
    }
    //上一页
    prePage(timeInSecond = .5) {
        // console.debug('👈');
        if (!this.checkInited())
            return;
        this.skipPage(this.curPageNum - 1, timeInSecond);
    }
    //下一页
    nextPage(timeInSecond = .5) {
        // console.debug('👉');
        if (!this.checkInited())
            return;
        this.skipPage(this.curPageNum + 1, timeInSecond);
    }
    //跳转到第几页
    skipPage(pageNum, timeInSecond) {
        let t = this;
        if (!t.checkInited())
            return;
        if (t._slideMode != SlideType.PAGE)
            return console.error('This function is not allowed to be called, Must SlideMode = PAGE!');
        if (pageNum < 0 || pageNum >= t._numItems)
            return;
        if (t.curPageNum == pageNum)
            return;
        // console.debug(pageNum);
        const oldPageNum=t.curPageNum;
        t.curPageNum = pageNum;
        if (t.pageChangeEvent) {
            EventHandler.emitEvents([t.pageChangeEvent], pageNum,oldPageNum);
        }
        t.scrollTo(pageNum, timeInSecond);
    }
    //计算 CustomSize（这个函数还是保留吧，某些罕见的情况的确还是需要手动计算customSize的）
    calcCustomSize(numItems) {
        let t = this;
        if (!t.checkInited())
            return;
        if (!t._itemTmp)
            return console.error('Unset template item!');
        if (!t.renderEvent)
            return console.error('Unset Render-Event!');
        t._customSize = {};
        let temp = instantiate(t._itemTmp);
        t.content.addChild(temp);
        for (let n = 0; n < numItems; n++) {
            EventHandler.emitEvents([t.renderEvent], temp, n);
            if (nodeHeight(temp) != t._itemSize.height || nodeWidth(temp) != t._itemSize.width) {
                t._customSize[n] = t._sizeType ? nodeHeight(temp) : nodeWidth(temp);
            }
        }
        if (!Object.keys(t._customSize).length)
            t._customSize = null;
        temp.removeFromParent();
        if (temp.destroy)
            temp.destroy();
        return t._customSize;
    }
}

