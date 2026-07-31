import { _decorator, Component } from 'cc';
const { ccclass, menu, executeInEditMode, property } = _decorator;

let audioTypeS = {
    0:0,
    1:3,
    2:4,
    3:1,
    8:1,
}
let easeTypeS = {
    0:1,
    1:2,
    2:3,
    3:4,
    4:17,
    5:18,
    6:19,
    7:2,
    8:3,
    9:4,
    10:23,
    11:24,
    12:25,
    13:29,
    14:30,
    15:31,
    16:26,
    17:27,
    18:28,
    19:5,
    20:6,
    21:7,
    22:11,
    23:12,
    24:13,
    25:14,
    26:15,
    27:16,
    28:20,
    29:21,
    30:22,
    31:8,
    32:9,
    33:10,
    34:1,
}
let defCValues = ["_name", "_objFlags", "node", "__scriptAsset", "_enabled", "name","uuid","enabled","enabledInHierarchy","_isOnLoadCalled","_windowName"]
let ignoreNodeName = ["RICHTEXT_CHILD", "BACKGROUND_SPRITE", "TEXT_LABEL", "PLACEHOLDER_LABEL"]
@ccclass('TUIPrefabToJson')
@menu('Ex-Tools/TUIPrefabToJson')
@executeInEditMode
export class TUIPrefabToJson extends Component {
    @property
    public read = false;
    @property
    public readComponent = false;

    start () {
    }

    update () {
        // if (CC_EDITOR && this.read) { 
            // this.read = false 
            // this.rpn = 0 
            // let r = this.toJson() 
            // let p = [] 
            // let sp = [] 
            // let wnd = this.node.getComponent("UIWindow") 
            // if (wnd) { 
                // cc.require(wnd.__classname__).prototype.constructor.__props__.forEach(x => { 
                    // if (!defCValues.includes(x) && wnd[x]) { 
                        // if (wnd[x].__proto__.constructor.name == "Array") { 
                            // wnd[x].forEach((x2, ii) => { 
                                // if (x2.__proto__.constructor.name == "cc_SpriteFrame") { 
                                    // Editor.assetdb.queryUrlByUuid(x2.getTexture()._uuid, (_,res2) => { 
                                        // sp.push({key: x + (ii + 1).toString(), node: res2.replace("db://assets/","")}) 
                                        // this.rpn-- 
                                    // }) 
                                    // this.rpn++ 
                                // } 
                                // else if (x2 && x2.node) { 
                                    // p.push({key: x + (ii + 1).toString(), node: this.nodeParentPath(x2.node)}) 
                                // } 
                            // }) 
                        // } else if (wnd[x].__proto__.constructor.name == "cc_SpriteFrame") { 
                            // Editor.assetdb.queryUrlByUuid(wnd[x].getTexture()._uuid, (_,res2) => { 
                                // sp.push({key: x, node: res2.replace("db://assets/","")}) 
                                // this.rpn-- 
                            // }) 
                            // this.rpn++ 
                        // } else if (wnd[x] && wnd[x].node) { 
                            // p.push({key: x, node: this.nodeParentPath(wnd[x].node)}) 
                        // } 
                    // } 
                // }) 
            // } 
            // this.rpnI = setInterval(() => { 
                // if (this.rpn == 0) { 
                    // clearInterval(this.rpnI) 
                    // Editor.log(JSON.stringify({name: wnd?wnd.__classname__:this.node.name, props:p, sprites:sp, children:r})) 
                // } 
            // }, 200) 
        // } 
        // if (CC_EDITOR && this.readComponent) { 
            // this.readComponent = false 
            // this.rpn = 0 
            // let p = [] 
            // let sp = [] 
            // let wnd = this.node.getComponent(cc.Component) 
            // if (wnd) { 
                // cc.require(wnd.__classname__).prototype.constructor.__props__.forEach(x => { 
                    // if (!defCValues.includes(x) && wnd[x]) { 
                        // if (wnd[x].__proto__.constructor.name == "Array") { 
                            // wnd[x].forEach((x2, ii) => { 
                                // if (x2.__proto__.constructor.name == "cc_SpriteFrame") { 
                                    // Editor.assetdb.queryUrlByUuid(x2.getTexture()._uuid, (_,res2) => { 
                                        // sp.push({key: x + (ii + 1).toString(), node: res2.replace("db://assets/","")}) 
                                        // this.rpn-- 
                                    // }) 
                                    // this.rpn++ 
                                // } 
                                // else if (x2 && x2.node) { 
                                    // p.push({key: x + (ii + 1).toString(), node: this.nodeParentPath(x2.node)}) 
                                // } 
                            // }) 
                        // } else if (wnd[x].__proto__.constructor.name == "cc_SpriteFrame") { 
                            // Editor.assetdb.queryUrlByUuid(wnd[x].getTexture()._uuid, (_,res2) => { 
                                // sp.push({key: x, node: res2.replace("db://assets/","")}) 
                                // this.rpn-- 
                            // }) 
                            // this.rpn++ 
                        // } else if (wnd[x] && wnd[x].node) { 
                            // p.push({key: x, node: this.nodeParentPath(wnd[x].node)}) 
                        // } 
                    // } 
                // }) 
            // } 
            // this.rpnI = setInterval(() => { 
                // if (this.rpn == 0) { 
                    // clearInterval(this.rpnI) 
                    // Editor.log(JSON.stringify({name: wnd?wnd.__classname__:this.node.name, props:p, sprites:sp})) 
                // } 
            // }, 200) 
        // } 
    }

    toJson () {
        // let records = [] 
        // var _rec = function(node, parent) { 
            // if (ignoreNodeName.includes(node.name) || node.name.contains("_TwoColor_child") || node.name.contains("_LabelShadow_child_")) return 
            // var re = {} 
            // re.name = node.name 
            // re.active = node.active 
            // re.x = node.x 
            // re.y = node.y 
            // re.rotation = -node.rotation 
            // re.scaleX = node.scaleX 
            // re.scaleY = node.scaleY 
            // re.anchorX = node.anchorX 
            // re.anchorY = node.anchorY 
            // re.width = node.width 
            // re.height = node.height 
            // re.color = this.recordColor(node.color) 
            // re.opacity = node.opacity 
            // let widget = node.getComponent(cc.Widget) 
            // if (widget) { 
                // re.widget = {} 
                // widget.target = node.parent 
                // re.widget.enableTop = widget.isAlignTop 
                // re.widget.enableBottom = widget.isAlignBottom 
                // re.widget.enableLeft = widget.isAlignLeft 
                // re.widget.enableRight = widget.isAlignRight 
                // re.widget.top = Math.round(widget.top * 100) / 100 
                // re.widget.bottom = Math.round(widget.bottom * 100) / 100 
                // re.widget.left = Math.round(widget.left * 100) / 100 
                // re.widget.right = Math.round(widget.right * 100) / 100 
            // } 
            // let label = node.getComponent(cc.Label) || node.getComponent(cc.RichText) 
            // if (label) { 
                // re.label = {} 
                // if (node.getComponent(cc.RichText)) re.label.richText = true 
                // re.label.string = label.string 
                // re.label.fontSize = label.fontSize 
                // re.label.lineHeight = Math.round(label.lineHeight * 100 / label.fontSize) / 100 
                // re.label.alignment = label.horizontalAlign + label.verticalAlign * 3; 
                // if (re.label.richText) re.label.alignment = label.horizontalAlign + 3; 
                // re.label.overflow = label.overflow 
                // let labelOutline = node.getComponent(cc.LabelOutline) 
                // if (labelOutline) { 
                    // re.label.outline = {} 
                    // re.label.outline.color = this.recordColor(labelOutline.color) 
                    // re.label.outline.width = labelOutline.width / 2 
                // } 
                // let labelShadow = node.getComponent("LabelShadow") 
                // if (labelShadow) { 
                    // re.label.shadow = {} 
                    // re.label.shadow.color = this.recordColor(labelShadow.color) 
                    // re.label.shadow.opacity = labelShadow.opacity 
                    // re.label.shadow.dx = labelShadow.dx 
                    // re.label.shadow.dy = labelShadow.dy 
                // } 
                // let labelTwoColor = node.getComponent("LabelTwoColor") 
                // if (labelTwoColor) { 
                    // re.label.labelTwoColor = {} 
                    // re.label.labelTwoColor.colorBottom = this.recordColor(labelTwoColor.colorTo) 
                // } 
                // let labelLocalized = node.getComponent("LabelLocalized") 
                // if (labelLocalized) { 
                    // re.label.labelLocalized = {} 
                    // re.label.labelLocalized.key = labelLocalized.textKey 
                    // re.label.labelLocalized.isBold = labelLocalized.isBold 
                // } 
                // if (re.label.richText) { 
                    // let CCLabelMaxLines = node.getComponent("CCLabelMaxLines") 
                    // if (CCLabelMaxLines) { 
                        // re.label.maxLines = CCLabelMaxLines.maxLines 
                    // } 
                // } 
            // } 
            // let sprite = node.getComponent(cc.Sprite) 
            // if (sprite) { 
                // re.sprite = {} 
                // if (sprite.spriteFrame) { 
                    // Editor.assetdb.queryUrlByUuid(sprite.spriteFrame.getTexture()._uuid, (_,res2) => { 
                        // re.sprite.image = res2.replace("db://assets/","") 
                        // this.rpn-- 
                    // }) 
                    // this.rpn++ 
                // } 
                // re.sprite.type = sprite.type 
            // } 
            // let editBox = node.getComponent(cc.EditBox) 
            // if (editBox) { 
                // re.editBox = {} 
                // re.editBox.fontSize = editBox.fontSize 
                // re.editBox.lineHeight = Math.round(editBox.lineHeight * 100 / editBox.fontSize) / 100 
                // re.editBox.fontColor = this.recordColor(editBox.fontColor) 
                // re.editBox.placeholder = editBox.placeholder 
                // re.editBox.placeholderFontSize = editBox.placeholderFontSize 
                // re.editBox.placeholderFontColor = this.recordColor(editBox.placeholderFontColor) 
                // re.editBox.maxLength = editBox.maxLength 
                // re.editBox.textChanged = "" 
                // editBox.textChanged.forEach(x => { 
                    // re.editBox.textChanged += x.handler + ":" + x.customEventData + ";" 
                // }) 
                // re.editBox.editingDidEnded = "" 
                // editBox.editingDidEnded.forEach(x => { 
                    // re.editBox.editingDidEnded += x.handler + ":" + x.customEventData + ";" 
                // }) 
            // } 
            // let button = node.getComponent(cc.Button) 
            // if (button) { 
                // re.button = {} 
                // if (button.clickEvents.length > 0) { 
                    // re.button.events = "" 
                    // button.clickEvents.forEach(x => { 
                        // re.button.events += x.handler + ":" + x.customEventData + ";" 
                    // }) 
                // } 
                // re.button.interactable = button.interactable 
            // } 
            // let mask = node.getComponent(cc.Mask) 
            // if (mask) { 
                // re.mask = {} 
                // if (mask.spriteFrame) { 
                    // Editor.assetdb.queryUrlByUuid(mask.spriteFrame.getTexture()._uuid, (_,res2) => { 
                        // re.mask.spriteFrame = res2.replace("db://assets/","") 
                        // this.rpn-- 
                    // }) 
                    // this.rpn++ 
                // } 
            // } 
            // let LongScreenFit = node.getComponent("LongScreenFit") 
            // if (LongScreenFit) { 
                // re.LongScreenFit = true 
            // } 
            // let PlayAudio = node.getComponent("PlayAudio") 
            // if (PlayAudio) { 
                // re.PlayAudio = {} 
                // re.PlayAudio.audioType = audioTypeS[PlayAudio.audioType] 
                // re.PlayAudio.trigger = PlayAudio.trigger 
            // } 
            // let ControllerTable = node.getComponent("ControllerTable") 
            // if (ControllerTable) { 
                // re.ControllerTable = {} 
                // ControllerTable.controllers.forEach(x => { 
                    // if(x) re.ControllerTable[x.name] = this.nodeParentPath(x) 
                // }) 
                // ControllerTable.keyControllers.forEach(x => { 
                    // if (x.key) re.ControllerTable[x.key] = this.nodeParentPath(x.node) 
                // }) 
            // } 
            // let UserInfoModel = node.getComponent("UserInfoModel") 
            // if (UserInfoModel) { 
                // re.ControllerTable = re.ControllerTable || {} 
                // if (UserInfoModel.avatarSprite) re.ControllerTable.avatarSprite = this.nodeParentPath(UserInfoModel.avatarSprite.node) 
                // if (UserInfoModel.labelName) re.ControllerTable.labelName = this.nodeParentPath(UserInfoModel.labelName.node) 
                // if (UserInfoModel.labelAp) re.ControllerTable.labelAp = this.nodeParentPath(UserInfoModel.labelAp.node) 
                // if (UserInfoModel.spriteApFull) re.ControllerTable.spriteApFull = this.nodeParentPath(UserInfoModel.spriteApFull.node) 
                // if (UserInfoModel.labelApFull) re.ControllerTable.labelApFull = this.nodeParentPath(UserInfoModel.labelApFull.node) 
                // if (UserInfoModel.labelApRemain) re.ControllerTable.labelApRemain = this.nodeParentPath(UserInfoModel.labelApRemain.node) 
                // if (UserInfoModel.energyFullAnim) re.ControllerTable.energyFullAnim = this.nodeParentPath(UserInfoModel.energyFullAnim.node) 
                // if (UserInfoModel.btnApAdd) re.ControllerTable.btnApAdd = this.nodeParentPath(UserInfoModel.btnApAdd.node) 
                // if (UserInfoModel.labelCoin) re.ControllerTable.labelCoin = this.nodeParentPath(UserInfoModel.labelCoin.node) 
                // if (UserInfoModel.btnCoinAdd) re.ControllerTable.btnCoinAdd = this.nodeParentPath(UserInfoModel.btnCoinAdd.node) 
                // if (UserInfoModel.spriteCoin) re.ControllerTable.spriteCoin = this.nodeParentPath(UserInfoModel.spriteCoin.node) 
                // if (UserInfoModel.labelStar) re.ControllerTable.labelStar = this.nodeParentPath(UserInfoModel.labelStar.node) 
                // if (UserInfoModel.shields) re.ControllerTable.shields = this.nodeParentPath(UserInfoModel.shields.node) 
                // if (UserInfoModel.spVip) re.ControllerTable.spVip = this.nodeParentPath(UserInfoModel.spVip.node) 
            // } 
            // let ContentModel = node.getComponent("ContentModel") 
            // if (ContentModel) { 
                // re.ControllerTable = re.ControllerTable || {} 
                // if (ContentModel.icon) re.ControllerTable.icon = this.nodeParentPath(ContentModel.icon.node) 
                // if (ContentModel.count) re.ControllerTable.count = this.nodeParentPath(ContentModel.count.node) 
                // if (ContentModel.countBignum) re.ControllerTable.countBignum = this.nodeParentPath(ContentModel.countBignum.node) 
                // if (ContentModel.countX) re.ControllerTable.countX = this.nodeParentPath(ContentModel.countX.node) 
                // if (ContentModel.countWithColor) re.ControllerTable.countWithColor = this.nodeParentPath(ContentModel.countWithColor.node) 
                // if (ContentModel.labelName) re.ControllerTable.labelName = this.nodeParentPath(ContentModel.labelName.node) 
                // if (ContentModel.desc) re.ControllerTable.desc = this.nodeParentPath(ContentModel.desc.node) 
            // } 
            // let CardModel = node.getComponent("CardModel") 
            // if (CardModel) { 
                // re.ControllerTable = re.ControllerTable || {} 
                // if (CardModel.sp_border_normal) re.ControllerTable.sp_border_normal = this.nodeParentPath(CardModel.sp_border_normal.node) 
                // if (CardModel.sp_border_golden) re.ControllerTable.sp_border_golden = this.nodeParentPath(CardModel.sp_border_golden.node) 
                // if (CardModel.sp_card) re.ControllerTable.sp_card = this.nodeParentPath(CardModel.sp_card.node) 
                // if (CardModel.label_name) re.ControllerTable.label_name = this.nodeParentPath(CardModel.label_name.node) 
                // if (CardModel.sp_title_bg) re.ControllerTable.sp_title_bg = this.nodeParentPath(CardModel.sp_title_bg.node) 
                // if (CardModel.layout_rare) re.ControllerTable.layout_rare = this.nodeParentPath(CardModel.layout_rare.node) 
                // if (CardModel.label_more_count) re.ControllerTable.label_more_count = this.nodeParentPath(CardModel.label_more_count.node) 
                // if (CardModel.label_lock) re.ControllerTable.label_lock = this.nodeParentPath(CardModel.label_lock.node) 
            // } 
            // let EnterCloseAnim = node.getComponent("EnterCloseAnim") 
            // if (EnterCloseAnim) { 
                // re.EnterCloseAnim = {} 
                // re.EnterCloseAnim.enterAnimType = EnterCloseAnim.enterAnimType 
                // re.EnterCloseAnim.e_playAwake = EnterCloseAnim.e_playAwake 
                // re.EnterCloseAnim.e_AnimTime = EnterCloseAnim.e_AnimTime 
                // re.EnterCloseAnim.e_DelayTime = EnterCloseAnim.e_DelayTime 
                // re.EnterCloseAnim.e_easeType = easeTypeS[EnterCloseAnim.e_easeType] 
                // re.EnterCloseAnim.e_alpha = EnterCloseAnim.e_alpha 
                // re.EnterCloseAnim.e_scaleX = EnterCloseAnim.e_scale.x 
                // re.EnterCloseAnim.e_scaleY = EnterCloseAnim.e_scale.y 
                // re.EnterCloseAnim.e_dx = EnterCloseAnim.e_dx 
                // re.EnterCloseAnim.e_dy = EnterCloseAnim.e_dy 
                // re.EnterCloseAnim.e_width = EnterCloseAnim.e_width 
                // re.EnterCloseAnim.e_height = EnterCloseAnim.e_height 
                // re.EnterCloseAnim.e_rotAngle = EnterCloseAnim.e_rotAngle 
                // re.EnterCloseAnim.closeAnimType = EnterCloseAnim.closeAnimType 
                // re.EnterCloseAnim.c_AnimTime = EnterCloseAnim.c_AnimTime 
                // re.EnterCloseAnim.c_DelayTime = EnterCloseAnim.c_DelayTime 
                // re.EnterCloseAnim.c_easeType = easeTypeS[EnterCloseAnim.c_easeType] 
                // re.EnterCloseAnim.c_alpha = EnterCloseAnim.c_alpha 
                // re.EnterCloseAnim.c_scaleX = EnterCloseAnim.c_scale.x 
                // re.EnterCloseAnim.c_scaleY = EnterCloseAnim.c_scale.y 
                // re.EnterCloseAnim.c_dx = EnterCloseAnim.c_dx 
                // re.EnterCloseAnim.c_dy = EnterCloseAnim.c_dy 
                // re.EnterCloseAnim.c_width = EnterCloseAnim.c_width 
                // re.EnterCloseAnim.c_height = EnterCloseAnim.c_height 
                // re.EnterCloseAnim.c_rotAngle = EnterCloseAnim.c_rotAngle 
            // } 
            // let ScrollViewItem = node.getComponent("ScrollViewItem") 
            // if (ScrollViewItem) { 
                // re.ScrollViewItem = true 
            // } 
            // let ScrollViewTool = node.getComponent("ScrollViewTool") 
            // if (ScrollViewTool) { 
                // re.ScrollViewTool = {} 
                // re.ScrollViewTool.item = this.nodeParentPath(ScrollViewTool.item.node) 
                // re.ScrollViewTool.startPos = ScrollViewTool.startPos 
                // re.ScrollViewTool.maxReuse = ScrollViewTool.maxReuse 
                // re.ScrollViewTool.centerOnChild = ScrollViewTool.centerOnChild 
                // re.ScrollViewTool.testNumber = ScrollViewTool.testNumber 
            // } 
            // let scrollView = node.getComponent(cc.ScrollView) 
            // if (scrollView) { 
                // re.scrollView = {} 
                // re.scrollView.content = this.nodeParentPath(scrollView.content) 
                // re.scrollView.horizontal = scrollView.horizontal 
                // re.scrollView.vertical = scrollView.vertical 
                // re.scrollView.inertia = scrollView.inertia 
                // re.scrollView.brake = scrollView.brake 
                // re.scrollView.elastic = scrollView.elastic 
                // re.scrollView.bounceDuration = scrollView.bounceDuration 
                // re.scrollView.horizontalScrollBar = this.nodeParentPath(scrollView.horizontalScrollBar?scrollView.horizontalScrollBar.node:null) 
                // re.scrollView.horizontalScrollBarAutoHide = scrollView.horizontalScrollBar?scrollView.horizontalScrollBar.enableAutoHide:false 
                // re.scrollView.verticalScrollBar = this.nodeParentPath(scrollView.verticalScrollBar?scrollView.verticalScrollBar.node:null) 
                // re.scrollView.verticalScrollBarAutoHide = scrollView.verticalScrollBar?scrollView.verticalScrollBar.enableAutoHide:false 
                // re.scrollView.scrollEvents = "" 
                // scrollView.scrollEvents.forEach(x => { 
                    // re.scrollView.scrollEvents += x.handler + ":" + x.customEventData + ";" 
                // }) 
            // } 
            // let scrollbar = node.getComponent(cc.Scrollbar) 
            // if (scrollbar) { 
                // re.scrollbar = {} 
                // re.scrollbar.direction = scrollbar.direction 
                // re.scrollbar.handle = this.nodeParentPath(scrollbar.handle.node) 
            // } 
            // let UITabContainer = node.getComponent("UITabContainer") 
            // if (UITabContainer) { 
                // re.UITabContainer = {} 
                // re.UITabContainer.tabs = "" 
                // UITabContainer.tabs.forEach(x => { 
                    // re.UITabContainer.tabs += this.nodeParentPath(x.node) + ";" 
                // }) 
            // } 
            // let UITabNode = node.getComponent("UITabNode") 
            // if (UITabNode) { 
                // re.UITabNode = {} 
                // re.UITabNode.enabledNode = this.nodeParentPath(UITabNode.enabledNode.node) 
                // re.UITabNode.disabledNode = this.nodeParentPath(UITabNode.disabledNode.node) 
            // } 
            // let blinkAnim = node.getComponent("BlinkAnim") 
            // if (blinkAnim) { 
                // re.blinkAnim = {} 
                // re.blinkAnim.minAlpha = blinkAnim.minAlpha 
                // re.blinkAnim.maxAlpha = blinkAnim.maxAlpha 
                // re.blinkAnim.duration = blinkAnim.duration 
                // re.blinkAnim.delay = blinkAnim.delay 
            // } 
            // let moveAnim = node.getComponent("MoveAnim") 
            // if (moveAnim) { 
                // re.moveAnim = {} 
                // re.moveAnim.dis = moveAnim.dis 
                // re.moveAnim.disx = moveAnim.disx 
                // re.moveAnim.time = moveAnim.time 
                // re.moveAnim.delay = moveAnim.delay 
            // } 
            // let loopMoveAnim = node.getComponent("LoopMoveAnim") 
            // if (loopMoveAnim) { 
                // re.loopMoveAnim = {} 
                // re.loopMoveAnim.disy = loopMoveAnim.disy 
                // re.loopMoveAnim.disx = loopMoveAnim.disx 
                // re.loopMoveAnim.time = loopMoveAnim.time 
                // re.loopMoveAnim.delay = loopMoveAnim.delay 
            // } 
            // let rotateAnim = node.getComponent("RotateAnim") 
            // if (rotateAnim) { 
                // re.rotateAnim = {} 
                // re.rotateAnim.time = rotateAnim.time 
                // re.rotateAnim.delay = rotateAnim.delay 
                // re.rotateAnim.clockwise = !rotateAnim.clockwise 
                // re.rotateAnim.outDegree = rotateAnim.outDegree 
                // re.rotateAnim.step = rotateAnim.step 
            // } 
            // let scaleAnim = node.getComponent("ScaleAnim") 
            // if (scaleAnim) { 
                // re.scaleAnim = {} 
                // re.scaleAnim.time = scaleAnim.time 
                // re.scaleAnim.delay = scaleAnim.delay 
                // re.scaleAnim.minX = scaleAnim.minX 
                // re.scaleAnim.maxX = scaleAnim.maxX 
                // re.scaleAnim.minY = scaleAnim.minY 
                // re.scaleAnim.maxY = scaleAnim.maxY 
            // } 
            // let shakeAnim = node.getComponent("ShakeAnim") 
            // if (shakeAnim) { 
                // re.shakeAnim = {} 
                // re.shakeAnim.time = shakeAnim.time 
                // re.shakeAnim.delay = Math.max(shakeAnim.delay, shakeAnim.wait) 
                // re.shakeAnim.degree = shakeAnim.degree 
            // } 
            // let numAnim = node.getComponent("NumAnim") 
            // if (numAnim) { 
                // re.numAnim = {} 
                // re.numAnim.time = numAnim.duration 
                // re.numAnim.fromValue = numAnim.fromValue 
                // re.numAnim.toValue = numAnim.toValue 
                // re.numAnim.playTime = numAnim.playTime 
                // re.numAnim.currentValue = numAnim.currentValue 
            // } 
            // if (!parent) records.push(re) 
            // else parent.children.push(re) 
            // return re 
        // }.bind(this) 
        // var _recNode = function(node, parent) { 
            // let nodes = node._children 
            // nodes.forEach((n) => { 
                // let re = _rec(n, parent) 
                // if (re && n._children && n._children.length > 0) { 
                    // re.children = [] 
                    // if (ignoreNodeName.includes(node.name) || node.name.contains("_TwoColor_child") || node.name.contains("_LabelShadow_child_")) return 
                    // _recNode(n, re) 
                // } 
            // }); 
        // }.bind(this) 
        // _recNode(this.node) 
        // return records 
    }

    colorSame (c1: any, c2: any) {
        // return c1.r==c2.r && c1.g==c2.g && c1.b==c2.b 
    }

    parseColor (c: any) {
        // return [c.r, c.g, c.b] 
    }

    recordColor (c: any) {
        // return {r:c.r, g:c.g, b:c.b} 
    }

    nodeParentPath (node: any) {
        // if (node == null) return "" 
        // let path = "" 
        // let p = node 
        // while(p != this.node) { 
            // path = path.length == 0? p.name :  p.name + "/" + path 
            // p = p.parent 
        // } 
        // return path 
    }

}


/**
 * 注意：已把原脚本注释，由于脚本变动过大，转换的时候可能有遗落，需要自行手动转换
 */
// var audioTypeS = {
//     0:0,
//     1:3,
//     2:4,
//     3:1,
//     8:1,
// }
// var easeTypeS = {
//     0:1,
//     1:2,
//     2:3,
//     3:4,
//     4:17,
//     5:18,
//     6:19,
//     7:2,
//     8:3,
//     9:4,
//     10:23,
//     11:24,
//     12:25,
//     13:29,
//     14:30,
//     15:31,
//     16:26,
//     17:27,
//     18:28,
//     19:5,
//     20:6,
//     21:7,
//     22:11,
//     23:12,
//     24:13,
//     25:14,
//     26:15,
//     27:16,
//     28:20,
//     29:21,
//     30:22,
//     31:8,
//     32:9,
//     33:10,
//     34:1,
// }
// var defCValues = ["_name", "_objFlags", "node", "__scriptAsset", "_enabled", "name","uuid","enabled","enabledInHierarchy","_isOnLoadCalled","_windowName"]
// var ignoreNodeName = ["RICHTEXT_CHILD", "BACKGROUND_SPRITE", "TEXT_LABEL", "PLACEHOLDER_LABEL"]
// 
// cc.Class({
//     extends: cc.Component,
// 
//     editor: {
//         menu:"Ex-Tools/TUIPrefabToJson",
//         executeInEditMode: true,
//     }, 
// 
//     properties: {
//         read: false,
//         readComponent: false,
//     },
// 
//     // LIFE-CYCLE CALLBACKS:
// 
//     // onLoad () {},
// 
//     start () {
// 
//     },
// 
//     update() {
//         if (CC_EDITOR && this.read) {
//             this.read = false
//             this.rpn = 0
//             let r = this.toJson()
//             let p = []
//             let sp = []
//             let wnd = this.node.getComponent("UIWindow")
//             if (wnd) {
//                 cc.require(wnd.__classname__).prototype.constructor.__props__.forEach(x => {
//                     if (!defCValues.includes(x) && wnd[x]) {
//                         if (wnd[x].__proto__.constructor.name == "Array") {
//                             wnd[x].forEach((x2, ii) => {
//                                 if (x2.__proto__.constructor.name == "cc_SpriteFrame") {
//                                     Editor.assetdb.queryUrlByUuid(x2.getTexture()._uuid, (_,res2) => {
//                                         sp.push({key: x + (ii + 1).toString(), node: res2.replace("db://assets/","")})
//                                         this.rpn--
//                                     })
//                                     this.rpn++
//                                 }
//                                 else if (x2 && x2.node) {
//                                     p.push({key: x + (ii + 1).toString(), node: this.nodeParentPath(x2.node)})
//                                 }
//                             })
//                         } else if (wnd[x].__proto__.constructor.name == "cc_SpriteFrame") {
//                             Editor.assetdb.queryUrlByUuid(wnd[x].getTexture()._uuid, (_,res2) => {
//                                 sp.push({key: x, node: res2.replace("db://assets/","")})
//                                 this.rpn--
//                             })
//                             this.rpn++
//                         } else if (wnd[x] && wnd[x].node) {
//                             p.push({key: x, node: this.nodeParentPath(wnd[x].node)})
//                         }
//                     }
//                 })
//             }
// 
//             this.rpnI = setInterval(() => {
//                 if (this.rpn == 0) {
//                     clearInterval(this.rpnI)
//                     Editor.log(JSON.stringify({name: wnd?wnd.__classname__:this.node.name, props:p, sprites:sp, children:r}))
//                 }
//             }, 200)
//         }
//         if (CC_EDITOR && this.readComponent) {
//             this.readComponent = false
//             this.rpn = 0
//             let p = []
//             let sp = []
//             let wnd = this.node.getComponent(cc.Component)
//             if (wnd) {
//                 cc.require(wnd.__classname__).prototype.constructor.__props__.forEach(x => {
//                     if (!defCValues.includes(x) && wnd[x]) {
//                         if (wnd[x].__proto__.constructor.name == "Array") {
//                             wnd[x].forEach((x2, ii) => {
//                                 if (x2.__proto__.constructor.name == "cc_SpriteFrame") {
//                                     Editor.assetdb.queryUrlByUuid(x2.getTexture()._uuid, (_,res2) => {
//                                         sp.push({key: x + (ii + 1).toString(), node: res2.replace("db://assets/","")})
//                                         this.rpn--
//                                     })
//                                     this.rpn++
//                                 }
//                                 else if (x2 && x2.node) {
//                                     p.push({key: x + (ii + 1).toString(), node: this.nodeParentPath(x2.node)})
//                                 }
//                             })
//                         } else if (wnd[x].__proto__.constructor.name == "cc_SpriteFrame") {
//                             Editor.assetdb.queryUrlByUuid(wnd[x].getTexture()._uuid, (_,res2) => {
//                                 sp.push({key: x, node: res2.replace("db://assets/","")})
//                                 this.rpn--
//                             })
//                             this.rpn++
//                         } else if (wnd[x] && wnd[x].node) {
//                             p.push({key: x, node: this.nodeParentPath(wnd[x].node)})
//                         }
//                     }
//                 })
//             }
//             
//             this.rpnI = setInterval(() => {
//                 if (this.rpn == 0) {
//                     clearInterval(this.rpnI)
//                     Editor.log(JSON.stringify({name: wnd?wnd.__classname__:this.node.name, props:p, sprites:sp}))
//                 }
//             }, 200)
//         }
//     },
// 
//     toJson() {
//         let records = []
// 
//         var _rec = function(node, parent) {
//             if (ignoreNodeName.includes(node.name) || node.name.contains("_TwoColor_child") || node.name.contains("_LabelShadow_child_")) return
//             var re = {}
//             re.name = node.name
//             re.active = node.active
//             re.x = node.x
//             re.y = node.y
//             re.rotation = -node.rotation
//             re.scaleX = node.scaleX
//             re.scaleY = node.scaleY
//             re.anchorX = node.anchorX
//             re.anchorY = node.anchorY
//             re.width = node.width
//             re.height = node.height
//             re.color = this.recordColor(node.color)
//             re.opacity = node.opacity
// 
//             let widget = node.getComponent(cc.Widget)
//             if (widget) {
//                 re.widget = {}
//                 widget.target = node.parent
//                 re.widget.enableTop = widget.isAlignTop
//                 re.widget.enableBottom = widget.isAlignBottom
//                 re.widget.enableLeft = widget.isAlignLeft
//                 re.widget.enableRight = widget.isAlignRight
//                 re.widget.top = Math.round(widget.top * 100) / 100
//                 re.widget.bottom = Math.round(widget.bottom * 100) / 100
//                 re.widget.left = Math.round(widget.left * 100) / 100
//                 re.widget.right = Math.round(widget.right * 100) / 100
//             }
// 
//             let label = node.getComponent(cc.Label) || node.getComponent(cc.RichText)
//             if (label) {
//                 re.label = {}
//                 if (node.getComponent(cc.RichText)) re.label.richText = true
//                 re.label.string = label.string
//                 re.label.fontSize = label.fontSize
//                 re.label.lineHeight = Math.round(label.lineHeight * 100 / label.fontSize) / 100
//                 re.label.alignment = label.horizontalAlign + label.verticalAlign * 3;
//                 if (re.label.richText) re.label.alignment = label.horizontalAlign + 3;
//                 re.label.overflow = label.overflow
// 
//                 let labelOutline = node.getComponent(cc.LabelOutline)
//                 if (labelOutline) {
//                     re.label.outline = {}
//                     re.label.outline.color = this.recordColor(labelOutline.color)
//                     re.label.outline.width = labelOutline.width / 2
//                 }
// 
//                 let labelShadow = node.getComponent("LabelShadow")
//                 if (labelShadow) {
//                     re.label.shadow = {}
//                     re.label.shadow.color = this.recordColor(labelShadow.color)
//                     re.label.shadow.opacity = labelShadow.opacity
//                     re.label.shadow.dx = labelShadow.dx
//                     re.label.shadow.dy = labelShadow.dy
//                 }
// 
//                 let labelTwoColor = node.getComponent("LabelTwoColor")
//                 if (labelTwoColor) {
//                     re.label.labelTwoColor = {}
//                     re.label.labelTwoColor.colorBottom = this.recordColor(labelTwoColor.colorTo)
//                 }
//                 
//                 let labelLocalized = node.getComponent("LabelLocalized")
//                 if (labelLocalized) {
//                     re.label.labelLocalized = {}
//                     re.label.labelLocalized.key = labelLocalized.textKey
//                     re.label.labelLocalized.isBold = labelLocalized.isBold
//                 }
// 
//                 if (re.label.richText) {
//                     let CCLabelMaxLines = node.getComponent("CCLabelMaxLines")
//                     if (CCLabelMaxLines) {
//                         re.label.maxLines = CCLabelMaxLines.maxLines
//                     }
//                 }
//             }
//             
//             let sprite = node.getComponent(cc.Sprite)
//             if (sprite) {
//                 re.sprite = {}
//                 if (sprite.spriteFrame) {
//                     Editor.assetdb.queryUrlByUuid(sprite.spriteFrame.getTexture()._uuid, (_,res2) => {
//                         re.sprite.image = res2.replace("db://assets/","")
//                         this.rpn--
//                     })
//                     this.rpn++
//                 }
//                 re.sprite.type = sprite.type
//             }
//             
//             let editBox = node.getComponent(cc.EditBox)
//             if (editBox) {
//                 re.editBox = {}
//                 re.editBox.fontSize = editBox.fontSize
//                 re.editBox.lineHeight = Math.round(editBox.lineHeight * 100 / editBox.fontSize) / 100
//                 re.editBox.fontColor = this.recordColor(editBox.fontColor)
//                 re.editBox.placeholder = editBox.placeholder
//                 re.editBox.placeholderFontSize = editBox.placeholderFontSize
//                 re.editBox.placeholderFontColor = this.recordColor(editBox.placeholderFontColor)
//                 re.editBox.maxLength = editBox.maxLength
//                 re.editBox.textChanged = ""
//                 editBox.textChanged.forEach(x => {
//                     re.editBox.textChanged += x.handler + ":" + x.customEventData + ";"
//                 })
//                 re.editBox.editingDidEnded = ""
//                 editBox.editingDidEnded.forEach(x => {
//                     re.editBox.editingDidEnded += x.handler + ":" + x.customEventData + ";"
//                 })
//             }
// 
//             let button = node.getComponent(cc.Button)
//             if (button) {
//                 re.button = {}
//                 if (button.clickEvents.length > 0) {
//                     re.button.events = ""
//                     button.clickEvents.forEach(x => {
//                         re.button.events += x.handler + ":" + x.customEventData + ";"
//                     })
//                 }
//                 re.button.interactable = button.interactable
//             }
// 
//             let mask = node.getComponent(cc.Mask)
//             if (mask) {
//                 re.mask = {}
//                 if (mask.spriteFrame) {
//                     Editor.assetdb.queryUrlByUuid(mask.spriteFrame.getTexture()._uuid, (_,res2) => {
//                         re.mask.spriteFrame = res2.replace("db://assets/","")
//                         this.rpn--
//                     })
//                     this.rpn++
//                 }
//             }
// 
//             let LongScreenFit = node.getComponent("LongScreenFit")
//             if (LongScreenFit) {
//                 re.LongScreenFit = true
//             }
// 
//             let PlayAudio = node.getComponent("PlayAudio")
//             if (PlayAudio) {
//                 re.PlayAudio = {}
//                 re.PlayAudio.audioType = audioTypeS[PlayAudio.audioType]
//                 re.PlayAudio.trigger = PlayAudio.trigger
//             }
// 
//             let ControllerTable = node.getComponent("ControllerTable")
//             if (ControllerTable) {
//                 re.ControllerTable = {}
//                 ControllerTable.controllers.forEach(x => {
//                     if(x) re.ControllerTable[x.name] = this.nodeParentPath(x)
//                 })
//                 ControllerTable.keyControllers.forEach(x => {
//                     if (x.key) re.ControllerTable[x.key] = this.nodeParentPath(x.node)
//                 })
//             }
//             
//             let UserInfoModel = node.getComponent("UserInfoModel")
//             if (UserInfoModel) {
//                 re.ControllerTable = re.ControllerTable || {}
//                 if (UserInfoModel.avatarSprite) re.ControllerTable.avatarSprite = this.nodeParentPath(UserInfoModel.avatarSprite.node)
//                 if (UserInfoModel.labelName) re.ControllerTable.labelName = this.nodeParentPath(UserInfoModel.labelName.node)
//                 if (UserInfoModel.labelAp) re.ControllerTable.labelAp = this.nodeParentPath(UserInfoModel.labelAp.node)
//                 if (UserInfoModel.spriteApFull) re.ControllerTable.spriteApFull = this.nodeParentPath(UserInfoModel.spriteApFull.node)
//                 if (UserInfoModel.labelApFull) re.ControllerTable.labelApFull = this.nodeParentPath(UserInfoModel.labelApFull.node)
//                 if (UserInfoModel.labelApRemain) re.ControllerTable.labelApRemain = this.nodeParentPath(UserInfoModel.labelApRemain.node)
//                 if (UserInfoModel.energyFullAnim) re.ControllerTable.energyFullAnim = this.nodeParentPath(UserInfoModel.energyFullAnim.node)
//                 if (UserInfoModel.btnApAdd) re.ControllerTable.btnApAdd = this.nodeParentPath(UserInfoModel.btnApAdd.node)
//                 if (UserInfoModel.labelCoin) re.ControllerTable.labelCoin = this.nodeParentPath(UserInfoModel.labelCoin.node)
//                 if (UserInfoModel.btnCoinAdd) re.ControllerTable.btnCoinAdd = this.nodeParentPath(UserInfoModel.btnCoinAdd.node)
//                 if (UserInfoModel.spriteCoin) re.ControllerTable.spriteCoin = this.nodeParentPath(UserInfoModel.spriteCoin.node)
//                 if (UserInfoModel.labelStar) re.ControllerTable.labelStar = this.nodeParentPath(UserInfoModel.labelStar.node)
//                 if (UserInfoModel.shields) re.ControllerTable.shields = this.nodeParentPath(UserInfoModel.shields.node)
//                 if (UserInfoModel.spVip) re.ControllerTable.spVip = this.nodeParentPath(UserInfoModel.spVip.node)
//             }
//             
//             let ContentModel = node.getComponent("ContentModel")
//             if (ContentModel) {
//                 re.ControllerTable = re.ControllerTable || {}
//                 if (ContentModel.icon) re.ControllerTable.icon = this.nodeParentPath(ContentModel.icon.node)
//                 if (ContentModel.count) re.ControllerTable.count = this.nodeParentPath(ContentModel.count.node)
//                 if (ContentModel.countBignum) re.ControllerTable.countBignum = this.nodeParentPath(ContentModel.countBignum.node)
//                 if (ContentModel.countX) re.ControllerTable.countX = this.nodeParentPath(ContentModel.countX.node)
//                 if (ContentModel.countWithColor) re.ControllerTable.countWithColor = this.nodeParentPath(ContentModel.countWithColor.node)
//                 if (ContentModel.labelName) re.ControllerTable.labelName = this.nodeParentPath(ContentModel.labelName.node)
//                 if (ContentModel.desc) re.ControllerTable.desc = this.nodeParentPath(ContentModel.desc.node)
//             }
//             
//             let CardModel = node.getComponent("CardModel")
//             if (CardModel) {
//                 re.ControllerTable = re.ControllerTable || {}
//                 if (CardModel.sp_border_normal) re.ControllerTable.sp_border_normal = this.nodeParentPath(CardModel.sp_border_normal.node)
//                 if (CardModel.sp_border_golden) re.ControllerTable.sp_border_golden = this.nodeParentPath(CardModel.sp_border_golden.node)
//                 if (CardModel.sp_card) re.ControllerTable.sp_card = this.nodeParentPath(CardModel.sp_card.node)
//                 if (CardModel.label_name) re.ControllerTable.label_name = this.nodeParentPath(CardModel.label_name.node)
//                 if (CardModel.sp_title_bg) re.ControllerTable.sp_title_bg = this.nodeParentPath(CardModel.sp_title_bg.node)
//                 if (CardModel.layout_rare) re.ControllerTable.layout_rare = this.nodeParentPath(CardModel.layout_rare.node)
//                 if (CardModel.label_more_count) re.ControllerTable.label_more_count = this.nodeParentPath(CardModel.label_more_count.node)
//                 if (CardModel.label_lock) re.ControllerTable.label_lock = this.nodeParentPath(CardModel.label_lock.node)
//             }
// 
//             let EnterCloseAnim = node.getComponent("EnterCloseAnim")
//             if (EnterCloseAnim) {
//                 re.EnterCloseAnim = {}
//                 re.EnterCloseAnim.enterAnimType = EnterCloseAnim.enterAnimType
//                 re.EnterCloseAnim.e_playAwake = EnterCloseAnim.e_playAwake
//                 re.EnterCloseAnim.e_AnimTime = EnterCloseAnim.e_AnimTime
//                 re.EnterCloseAnim.e_DelayTime = EnterCloseAnim.e_DelayTime
//                 re.EnterCloseAnim.e_easeType = easeTypeS[EnterCloseAnim.e_easeType]
//                 re.EnterCloseAnim.e_alpha = EnterCloseAnim.e_alpha
//                 re.EnterCloseAnim.e_scaleX = EnterCloseAnim.e_scale.x
//                 re.EnterCloseAnim.e_scaleY = EnterCloseAnim.e_scale.y
//                 re.EnterCloseAnim.e_dx = EnterCloseAnim.e_dx
//                 re.EnterCloseAnim.e_dy = EnterCloseAnim.e_dy
//                 re.EnterCloseAnim.e_width = EnterCloseAnim.e_width
//                 re.EnterCloseAnim.e_height = EnterCloseAnim.e_height
//                 re.EnterCloseAnim.e_rotAngle = EnterCloseAnim.e_rotAngle
//                 re.EnterCloseAnim.closeAnimType = EnterCloseAnim.closeAnimType
//                 re.EnterCloseAnim.c_AnimTime = EnterCloseAnim.c_AnimTime
//                 re.EnterCloseAnim.c_DelayTime = EnterCloseAnim.c_DelayTime
//                 re.EnterCloseAnim.c_easeType = easeTypeS[EnterCloseAnim.c_easeType]
//                 re.EnterCloseAnim.c_alpha = EnterCloseAnim.c_alpha
//                 re.EnterCloseAnim.c_scaleX = EnterCloseAnim.c_scale.x
//                 re.EnterCloseAnim.c_scaleY = EnterCloseAnim.c_scale.y
//                 re.EnterCloseAnim.c_dx = EnterCloseAnim.c_dx
//                 re.EnterCloseAnim.c_dy = EnterCloseAnim.c_dy
//                 re.EnterCloseAnim.c_width = EnterCloseAnim.c_width
//                 re.EnterCloseAnim.c_height = EnterCloseAnim.c_height
//                 re.EnterCloseAnim.c_rotAngle = EnterCloseAnim.c_rotAngle
//             }
// 
//             let ScrollViewItem = node.getComponent("ScrollViewItem")
//             if (ScrollViewItem) {
//                 re.ScrollViewItem = true
//             }
// 
//             let ScrollViewTool = node.getComponent("ScrollViewTool")
//             if (ScrollViewTool) {
//                 re.ScrollViewTool = {}
//                 re.ScrollViewTool.item = this.nodeParentPath(ScrollViewTool.item.node)
//                 re.ScrollViewTool.startPos = ScrollViewTool.startPos
//                 re.ScrollViewTool.maxReuse = ScrollViewTool.maxReuse
//                 re.ScrollViewTool.centerOnChild = ScrollViewTool.centerOnChild
//                 re.ScrollViewTool.testNumber = ScrollViewTool.testNumber
//             }
// 
//             let scrollView = node.getComponent(cc.ScrollView)
//             if (scrollView) {
//                 re.scrollView = {}
//                 re.scrollView.content = this.nodeParentPath(scrollView.content)
//                 re.scrollView.horizontal = scrollView.horizontal
//                 re.scrollView.vertical = scrollView.vertical
//                 re.scrollView.inertia = scrollView.inertia
//                 re.scrollView.brake = scrollView.brake
//                 re.scrollView.elastic = scrollView.elastic
//                 re.scrollView.bounceDuration = scrollView.bounceDuration
//                 re.scrollView.horizontalScrollBar = this.nodeParentPath(scrollView.horizontalScrollBar?scrollView.horizontalScrollBar.node:null)
//                 re.scrollView.horizontalScrollBarAutoHide = scrollView.horizontalScrollBar?scrollView.horizontalScrollBar.enableAutoHide:false
//                 re.scrollView.verticalScrollBar = this.nodeParentPath(scrollView.verticalScrollBar?scrollView.verticalScrollBar.node:null)
//                 re.scrollView.verticalScrollBarAutoHide = scrollView.verticalScrollBar?scrollView.verticalScrollBar.enableAutoHide:false
//                 re.scrollView.scrollEvents = ""
//                 scrollView.scrollEvents.forEach(x => {
//                     re.scrollView.scrollEvents += x.handler + ":" + x.customEventData + ";"
//                 })
// 
//             }
// 
//             let scrollbar = node.getComponent(cc.Scrollbar)
//             if (scrollbar) {
//                 re.scrollbar = {}
//                 re.scrollbar.direction = scrollbar.direction
//                 re.scrollbar.handle = this.nodeParentPath(scrollbar.handle.node)
//             }
// 
//             let UITabContainer = node.getComponent("UITabContainer")
//             if (UITabContainer) {
//                 re.UITabContainer = {}
//                 re.UITabContainer.tabs = ""
//                 UITabContainer.tabs.forEach(x => {
//                     re.UITabContainer.tabs += this.nodeParentPath(x.node) + ";"
//                 })
//             }
// 
//             let UITabNode = node.getComponent("UITabNode")
//             if (UITabNode) {
//                 re.UITabNode = {}
//                 re.UITabNode.enabledNode = this.nodeParentPath(UITabNode.enabledNode.node)
//                 re.UITabNode.disabledNode = this.nodeParentPath(UITabNode.disabledNode.node)
//             }
// 
// 
//             let blinkAnim = node.getComponent("BlinkAnim")
//             if (blinkAnim) {
//                 re.blinkAnim = {}
//                 re.blinkAnim.minAlpha = blinkAnim.minAlpha
//                 re.blinkAnim.maxAlpha = blinkAnim.maxAlpha
//                 re.blinkAnim.duration = blinkAnim.duration
//                 re.blinkAnim.delay = blinkAnim.delay
//             }
// 
//             let moveAnim = node.getComponent("MoveAnim")
//             if (moveAnim) {
//                 re.moveAnim = {}
//                 re.moveAnim.dis = moveAnim.dis
//                 re.moveAnim.disx = moveAnim.disx
//                 re.moveAnim.time = moveAnim.time
//                 re.moveAnim.delay = moveAnim.delay
//             }
//             
//             let loopMoveAnim = node.getComponent("LoopMoveAnim")
//             if (loopMoveAnim) {
//                 re.loopMoveAnim = {}
//                 re.loopMoveAnim.disy = loopMoveAnim.disy
//                 re.loopMoveAnim.disx = loopMoveAnim.disx
//                 re.loopMoveAnim.time = loopMoveAnim.time
//                 re.loopMoveAnim.delay = loopMoveAnim.delay
//             }
// 
//             let rotateAnim = node.getComponent("RotateAnim")
//             if (rotateAnim) {
//                 re.rotateAnim = {}
//                 re.rotateAnim.time = rotateAnim.time
//                 re.rotateAnim.delay = rotateAnim.delay
//                 re.rotateAnim.clockwise = !rotateAnim.clockwise
//                 re.rotateAnim.outDegree = rotateAnim.outDegree
//                 re.rotateAnim.step = rotateAnim.step
//             }
// 
//             let scaleAnim = node.getComponent("ScaleAnim")
//             if (scaleAnim) {
//                 re.scaleAnim = {}
//                 re.scaleAnim.time = scaleAnim.time
//                 re.scaleAnim.delay = scaleAnim.delay
//                 re.scaleAnim.minX = scaleAnim.minX
//                 re.scaleAnim.maxX = scaleAnim.maxX
//                 re.scaleAnim.minY = scaleAnim.minY
//                 re.scaleAnim.maxY = scaleAnim.maxY
//             }
// 
//             let shakeAnim = node.getComponent("ShakeAnim")
//             if (shakeAnim) {
//                 re.shakeAnim = {}
//                 re.shakeAnim.time = shakeAnim.time
//                 re.shakeAnim.delay = Math.max(shakeAnim.delay, shakeAnim.wait)
//                 re.shakeAnim.degree = shakeAnim.degree
//             }
// 
//             let numAnim = node.getComponent("NumAnim")
//             if (numAnim) {
//                 re.numAnim = {}
//                 re.numAnim.time = numAnim.duration
//                 re.numAnim.fromValue = numAnim.fromValue
//                 re.numAnim.toValue = numAnim.toValue
//                 re.numAnim.playTime = numAnim.playTime
//                 re.numAnim.currentValue = numAnim.currentValue
//             }
// 
//             if (!parent) records.push(re)
//             else parent.children.push(re)
//             return re
//         }.bind(this)
//         
//         var _recNode = function(node, parent) {
//             let nodes = node._children
//             nodes.forEach((n) => {
//                 let re = _rec(n, parent)
//                 if (re && n._children && n._children.length > 0) {
//                     re.children = []
//                     if (ignoreNodeName.includes(node.name) || node.name.contains("_TwoColor_child") || node.name.contains("_LabelShadow_child_")) return
//                     _recNode(n, re)
//                 }
//             });
//         }.bind(this)
// 
//         _recNode(this.node)
// 
//         return records
//     },
// 
//     colorSame(c1, c2) {
//         return c1.r==c2.r && c1.g==c2.g && c1.b==c2.b
//     },
//     parseColor(c) {
//         return [c.r, c.g, c.b]
//     },
//     recordColor(c) {
//         return {r:c.r, g:c.g, b:c.b}
//     },
//     nodeParentPath(node) {
//         if (node == null) return ""
//         let path = ""
//         let p = node
//         while(p != this.node) {
//             path = path.length == 0? p.name :  p.name + "/" + path
//             p = p.parent
//         }
//         return path
//     },
// });
