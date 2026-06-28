import { _decorator, Component } from 'cc';
const { ccclass, menu, executeInEditMode, property } = _decorator;

@ccclass('TActivityPanelGetNodes')
@menu('Editor-Tools/TActivityPanelGetNodes')
@executeInEditMode
export class TActivityPanelGetNodes extends Component {
    @property
    public record = false;
    @property
    public check = false;
    @property
    public readStr = '';
    @property
    public read = false;

    start () {
    }

    update () {
        // if (CC_EDITOR && this.record) { 
            // this.record = false 
            // this.records = this.recordList() 
        // } 
        // if (CC_EDITOR && this.check) { 
            // this.check = false 
            // this.outputList() 
        // } 
        // if (CC_EDITOR && this.read) { 
            // this.read = false 
            // try { 
                // let param = JSON.parse(this.readStr) 
                // let rawNames = [] 
                // var _recNode = function(node) { 
                    // let nodes = node._children 
                    // nodes.forEach(n => { 
                        // CCTools.SetNodeByParam(n, param[n.name]) 
                        // rawNames.push(n.name) 
                        // if (n._children && n._children.length > 0) { 
                            // _recNode(n) 
                        // } 
                    // }); 
                // }.bind(this) 
                // _recNode(this.node) 
                // for (let name in param) { 
                    // if (rawNames.contains(name)) continue; 
                    // let nnode = new cc.Node(name) 
                    // nnode.parent = this.node 
                    // CCTools.SetNodeByParam(nnode, param[name]) 
                // } 
            // } catch(e) {Editor.log(e)} 
        // } 
    }

    recordList () {
        // let records = {} 
        // var _rec = function(node) { 
            // if (node.name == "RICHTEXT_CHILD" || node.name.contains("_TwoColor_child") || node.name.contains("_LabelShadow_child_")) return 
            // var re = {} 
            // re.active = node.active 
            // re.x = node.x 
            // re.y = node.y 
            // re.rotation = node.rotation 
            // re.anchorX = node.anchorX 
            // re.anchorY = node.anchorY 
            // re.skewX = node.skewX 
            // re.skewY = node.skewY 
            // re.scaleX = node.scaleX 
            // re.scaleY = node.scaleY 
            // re.width = node.width 
            // re.height = node.height 
            // re.color = this.recordColor(node.color) 
            // re.opacity = node.opacity 
            // let label = node.getComponent(cc.Label) || node.getComponent(cc.RichText) 
            // if (label) { 
                // re.label = {} 
                // re.label.string = label.string 
                // re.label.fontSize = label.fontSize 
                // re.label.lineHeight = label.lineHeight 
                // re.label.maxWidth = label.maxWidth 
                // re.label.maxLines = label.maxLines 
                // let labelOutline = node.getComponent(cc.LabelOutline) 
                // if (labelOutline) { 
                    // re.outline = {} 
                    // re.outline.color = this.recordColor(labelOutline.color) 
                    // re.outline.width = labelOutline.width 
                // } 
                // let labelShadow = node.getComponent("LabelShadow") 
                // if (labelShadow) { 
                    // re.shadow = {} 
                    // re.shadow.color = this.recordColor(labelShadow.color) 
                    // re.shadow.opacity = labelShadow.opacity 
                    // re.shadow.dx = labelShadow.dx 
                    // re.shadow.dy = labelShadow.dy 
                // } 
            // } 
            // let sprite = node.getComponent(cc.Sprite) || node.getComponent(cc.Sprite) 
            // if (sprite) { 
                // if (sprite.spriteFrame) { 
                    // re.sprite = {} 
                    // re.sprite.image = sprite.spriteFrame.name 
                // } 
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
                // re.loopMoveAnim.dis = loopMoveAnim.dis 
                // re.loopMoveAnim.disx = loopMoveAnim.disx 
                // re.loopMoveAnim.time = loopMoveAnim.time 
                // re.loopMoveAnim.delay = loopMoveAnim.delay 
            // } 
            // let rotateAnim = node.getComponent("RotateAnim") 
            // if (rotateAnim) { 
                // re.rotateAnim = {} 
                // re.rotateAnim.time = rotateAnim.time 
                // re.rotateAnim.delay = rotateAnim.delay 
                // re.rotateAnim.clockwise = rotateAnim.clockwise 
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
            // let skewAnim = node.getComponent("SkewAnim") 
            // if (skewAnim) { 
                // re.skewAnim = {} 
                // re.skewAnim.time = skewAnim.time 
                // re.skewAnim.delay = skewAnim.delay 
                // re.skewAnim.minX = skewAnim.minX 
                // re.skewAnim.maxX = skewAnim.maxX 
                // re.skewAnim.minY = skewAnim.minY 
                // re.skewAnim.maxY = skewAnim.maxY 
            // } 
            // let shakeAnim = node.getComponent("ShakeAnim") 
            // if (shakeAnim) { 
                // re.shakeAnim = {} 
                // re.shakeAnim.time = shakeAnim.time 
                // re.shakeAnim.delay = shakeAnim.delay 
                // re.shakeAnim.wait = shakeAnim.wait 
                // re.shakeAnim.degree = shakeAnim.degree 
            // } 
            // records[node.name] = re 
        // }.bind(this) 
        // var _recNode = function(node) { 
            // let nodes = node._children 
            // nodes.forEach(n => { 
                // _rec(n) 
                // if (n._children && n._children.length > 0) { 
                    // if (n.name.contains("_TwoColor_child")) return 
                    // _recNode(n) 
                // } 
            // }); 
        // }.bind(this) 
        // _recNode(this.node) 
        // return records 
    }

    outputList () {
        // let orecords = this.records 
        // let records = this.recordList() 
        // let result = {} 
        // for (let name in records) { 
            // let re = records[name] 
            // let node = orecords[name] 
            // let res = {} 
            // if (node) { 
                // if (re.active != node.active) res.active = re.active 
                // if (re.x != node.x) res.x = re.x 
                // if (re.y != node.y) res.y = re.y 
                // if (re.rotation != node.rotation) res.rotation = re.rotation 
                // if (re.anchorX != node.anchorX) res.anchorX = re.anchorX 
                // if (re.anchorY != node.anchorY) res.anchorY = re.anchorY 
                // if (re.skewX != node.skewX) res.skewX = re.skewX 
                // if (re.skewY != node.skewY) res.skewY = re.skewY 
                // if (re.scaleX != node.scaleX && re.scaleY != node.scaleY && re.scaleX == re.scaleY) { 
                    // res.scale = re.scaleX 
                // } else { 
                    // if (re.scaleX != node.scaleX) res.scaleX = re.scaleX 
                    // if (re.scaleY != node.scaleY) res.scaleY = re.scaleY 
                // } 
                // if (re.width != node.width) res.width = re.width 
                // if (re.height != node.height) res.height = re.height 
                // if (!this.colorSame(re.color, node.color)) res.color = this.parseColor(re.color) 
                // if (re.opacity != node.opacity) res.opacity = re.opacity 
                // if (re.label) { 
                    // res.label = {} 
                    // if (!node.label) { 
                        // res.label.string = {en:re.label.string, de:re.label.string, es:re.label.string, fr:re.label.string} 
                        // if (re.label.string == "BUY NOW") { 
                            // res.label.string = {en:"BUY NOW",es:"COMPRAR AHORA",de:"JETZT KAUFEN",fr:"ACHETER MAINTENANT"} 
                        // } 
                        // else if (re.label.string == "GO!") { 
                            // res.label.string = {en:"GO!",es:"¡IR!",de:"LOS!",fr:"ALLER!"} 
                        // } 
                        // res.label.fontSize = re.label.fontSize 
                        // res.label.lineHeight = re.label.lineHeight 
                        // res.label.maxWidth = re.label.maxWidth 
                        // res.label.maxLines = re.label.maxLines 
                    // } else { 
                        // if (re.label.string != node.label.string) res.label.string = {en:re.label.string, de:re.label.string, es:re.label.string, fr:re.label.string} 
                        // if (re.label.string == "BUY NOW") { 
                            // res.label.string = {en:"BUY NOW",es:"COMPRAR AHORA",de:"JETZT KAUFEN",fr:"ACHETER MAINTENANT"} 
                        // } 
                        // else if (re.label.string == "GO!") { 
                            // res.label.string = {en:"GO!",es:"¡IR!",de:"LOS!",fr:"ALLER!"} 
                        // } 
                        // if (re.label.fontSize != node.label.fontSize) res.label.fontSize = re.label.fontSize 
                        // if (re.label.lineHeight != node.label.lineHeight) res.label.lineHeight = re.label.lineHeight 
                        // if (re.label.maxWidth != node.label.maxWidth) res.label.maxWidth = re.label.maxWidth 
                        // if (re.label.maxLines != node.label.maxLines) res.label.maxLines = re.label.maxLines 
                        // if (Object.keys(res.label).length <= 0) delete res.label 
                    // } 
                // } 
                // if (re.outline) { 
                    // res.outline = {} 
                    // if (!node.outline) { 
                        // res.outline.color = this.parseColor(re.outline.color) 
                        // res.outline.width = re.outline.width 
                    // } else { 
                        // if (!this.colorSame(re.outline.color, node.outline.color)) res.outline.color = this.parseColor(re.outline.color) 
                        // if (re.outline.width != node.outline.width) res.outline.width = re.outline.width 
                        // if (Object.keys(res.outline).length <= 0) delete res.outline 
                    // } 
                // } 
                // if (re.shadow) { 
                    // res.shadow = {} 
                    // if (!node.shadow) { 
                        // res.shadow.color = this.parseColor(re.shadow.color) 
                        // res.shadow.opacity = re.shadow.opacity 
                        // res.shadow.dx = re.shadow.dx 
                        // res.shadow.dy = re.shadow.dy 
                    // } else { 
                        // if (!this.colorSame(re.shadow.color, node.shadow.color)) res.shadow.color = this.parseColor(re.shadow.color) 
                        // if (re.shadow.opacity != node.shadow.opacity) res.shadow.opacity = re.shadow.opacity 
                        // if (re.shadow.dx != node.shadow.dx) res.shadow.dx = re.shadow.dx 
                        // if (re.shadow.dy != node.shadow.dy) res.shadow.dy = re.shadow.dy 
                        // if (Object.keys(res.shadow).length <= 0) delete res.shadow 
                    // } 
                // } 
                // if (re.sprite) { 
                    // res.sprite = {} 
                    // if (!node.sprite) { 
                        // res.sprite.image = "https://cg-cdn.goldaxe.net/mergeTown/event/img/" + re.sprite.image + ".png" 
                    // } else { 
                        // if (re.sprite.image != node.sprite.image) res.sprite.image = "https://cg-cdn.goldaxe.net/mergeTown/event/img/" + re.sprite.image + ".png" 
                        // if (Object.keys(res.sprite).length <= 0) delete res.sprite 
                    // } 
                // } 
                // if (re.blinkAnim) { 
                    // res.blinkAnim = {} 
                    // if (!node.blinkAnim) { 
                        // res.blinkAnim.minAlpha = re.blinkAnim.minAlpha 
                        // res.blinkAnim.maxAlpha = re.blinkAnim.maxAlpha 
                        // res.blinkAnim.duration = re.blinkAnim.duration 
                        // res.blinkAnim.delay = re.blinkAnim.delay 
                    // } else { 
                        // if (re.blinkAnim.minAlpha != node.blinkAnim.minAlpha) res.blinkAnim.minAlpha = re.blinkAnim.minAlpha 
                        // if (re.blinkAnim.maxAlpha != node.blinkAnim.maxAlpha) res.blinkAnim.maxAlpha = re.blinkAnim.maxAlpha 
                        // if (re.blinkAnim.duration != node.blinkAnim.duration) res.blinkAnim.duration = re.blinkAnim.duration 
                        // if (re.blinkAnim.delay != node.blinkAnim.delay) res.blinkAnim.delay = re.blinkAnim.delay 
                        // if (Object.keys(res.blinkAnim).length <= 0) delete res.blinkAnim 
                    // } 
                // } 
                // if (re.moveAnim) { 
                    // res.moveAnim = {} 
                    // if (!node.moveAnim) { 
                        // res.moveAnim.dis = re.moveAnim.dis 
                        // res.moveAnim.disx = re.moveAnim.disx 
                        // res.moveAnim.time = re.moveAnim.time 
                        // res.moveAnim.delay = re.moveAnim.delay 
                    // } else { 
                        // if (re.moveAnim.dis != node.moveAnim.dis) res.moveAnim.dis = re.moveAnim.dis 
                        // if (re.moveAnim.disx != node.moveAnim.disx) res.moveAnim.disx = re.moveAnim.disx 
                        // if (re.moveAnim.time != node.moveAnim.time) res.moveAnim.time = re.moveAnim.time 
                        // if (re.moveAnim.delay != node.moveAnim.delay) res.moveAnim.delay = re.moveAnim.delay 
                        // if (Object.keys(res.moveAnim).length <= 0) delete res.moveAnim 
                    // } 
                // } 
                // if (re.loopMoveAnim) { 
                    // res.loopMoveAnim = {} 
                    // if (!node.loopMoveAnim) { 
                        // res.loopMoveAnim.disy = re.loopMoveAnim.disy 
                        // res.loopMoveAnim.disx = re.loopMoveAnim.disx 
                        // res.loopMoveAnim.time = re.loopMoveAnim.time 
                        // res.loopMoveAnim.delay = re.loopMoveAnim.delay 
                    // } else { 
                        // if (re.loopMoveAnim.disy != node.loopMoveAnim.disy) res.loopMoveAnim.disy = re.loopMoveAnim.disy 
                        // if (re.loopMoveAnim.disx != node.loopMoveAnim.disx) res.loopMoveAnim.disx = re.loopMoveAnim.disx 
                        // if (re.loopMoveAnim.time != node.loopMoveAnim.time) res.loopMoveAnim.time = re.loopMoveAnim.time 
                        // if (re.loopMoveAnim.delay != node.loopMoveAnim.delay) res.loopMoveAnim.delay = re.loopMoveAnim.delay 
                        // if (Object.keys(res.loopMoveAnim).length <= 0) delete res.loopMoveAnim 
                    // } 
                // } 
                // if (re.rotateAnim) { 
                    // res.rotateAnim = {} 
                    // if (!node.rotateAnim) { 
                        // res.rotateAnim.clockwise = re.rotateAnim.clockwise 
                        // res.rotateAnim.outDegree = re.rotateAnim.outDegree 
                        // res.rotateAnim.step = re.rotateAnim.step 
                        // res.rotateAnim.time = re.rotateAnim.time 
                        // res.rotateAnim.delay = re.rotateAnim.delay 
                    // } else { 
                        // if (re.rotateAnim.clockwise != node.rotateAnim.clockwise) res.rotateAnim.clockwise = re.rotateAnim.clockwise 
                        // if (re.rotateAnim.outDegree != node.rotateAnim.outDegree) res.rotateAnim.outDegree = re.rotateAnim.outDegree 
                        // if (re.rotateAnim.step != node.rotateAnim.step) res.rotateAnim.step = re.rotateAnim.step 
                        // if (re.rotateAnim.time != node.rotateAnim.time) res.rotateAnim.time = re.rotateAnim.time 
                        // if (re.rotateAnim.delay != node.rotateAnim.delay) res.rotateAnim.delay = re.rotateAnim.delay 
                        // if (Object.keys(res.rotateAnim).length <= 0) delete res.rotateAnim 
                    // } 
                // } 
                // if (re.scaleAnim) { 
                    // res.scaleAnim = {} 
                    // if (!node.scaleAnim) { 
                        // res.scaleAnim.minX = re.scaleAnim.minX 
                        // res.scaleAnim.maxX = re.scaleAnim.maxX 
                        // res.scaleAnim.minY = re.scaleAnim.minY 
                        // res.scaleAnim.maxY = re.scaleAnim.maxY 
                        // res.scaleAnim.time = re.scaleAnim.time 
                        // res.scaleAnim.delay = re.scaleAnim.delay 
                    // } else { 
                        // if (re.scaleAnim.minX != node.scaleAnim.minX) res.scaleAnim.minX = re.scaleAnim.minX 
                        // if (re.scaleAnim.maxX != node.scaleAnim.maxX) res.scaleAnim.maxX = re.scaleAnim.maxX 
                        // if (re.scaleAnim.minY != node.scaleAnim.minY) res.scaleAnim.minY = re.scaleAnim.minY 
                        // if (re.scaleAnim.maxY != node.scaleAnim.maxY) res.scaleAnim.maxY = re.scaleAnim.maxY 
                        // if (re.scaleAnim.time != node.scaleAnim.time) res.scaleAnim.time = re.scaleAnim.time 
                        // if (re.scaleAnim.delay != node.scaleAnim.delay) res.scaleAnim.delay = re.scaleAnim.delay 
                        // if (Object.keys(res.scaleAnim).length <= 0) delete res.scaleAnim 
                    // } 
                // } 
                // if (re.skewAnim) { 
                    // res.skewAnim = {} 
                    // if (!node.skewAnim) { 
                        // res.skewAnim.minX = re.skewAnim.minX 
                        // res.skewAnim.maxX = re.skewAnim.maxX 
                        // res.skewAnim.minY = re.skewAnim.minY 
                        // res.skewAnim.maxY = re.skewAnim.maxY 
                        // res.skewAnim.time = re.skewAnim.time 
                        // res.skewAnim.delay = re.skewAnim.delay 
                    // } else { 
                        // if (re.skewAnim.minX != node.skewAnim.minX) res.skewAnim.minX = re.skewAnim.minX 
                        // if (re.skewAnim.maxX != node.skewAnim.maxX) res.skewAnim.maxX = re.skewAnim.maxX 
                        // if (re.skewAnim.minY != node.skewAnim.minY) res.skewAnim.minY = re.skewAnim.minY 
                        // if (re.skewAnim.maxY != node.skewAnim.maxY) res.skewAnim.maxY = re.skewAnim.maxY 
                        // if (re.skewAnim.time != node.skewAnim.time) res.skewAnim.time = re.skewAnim.time 
                        // if (re.skewAnim.delay != node.skewAnim.delay) res.skewAnim.delay = re.skewAnim.delay 
                        // if (Object.keys(res.skewAnim).length <= 0) delete res.skewAnim 
                    // } 
                // } 
                // if (re.shakeAnim) { 
                    // res.shakeAnim = {} 
                    // if (!node.shakeAnim) { 
                        // res.shakeAnim.wait = re.shakeAnim.wait 
                        // res.shakeAnim.degree = re.shakeAnim.degree 
                        // res.shakeAnim.time = re.shakeAnim.time 
                        // res.shakeAnim.delay = re.shakeAnim.delay 
                    // } else { 
                        // if (re.shakeAnim.wait != node.shakeAnim.wait) res.shakeAnim.wait = re.shakeAnim.wait 
                        // if (re.shakeAnim.degree != node.shakeAnim.degree) res.shakeAnim.degree = re.shakeAnim.degree 
                        // if (re.shakeAnim.time != node.shakeAnim.time) res.shakeAnim.time = re.shakeAnim.time 
                        // if (re.shakeAnim.delay != node.shakeAnim.delay) res.shakeAnim.delay = re.shakeAnim.delay 
                        // if (Object.keys(res.shakeAnim).length <= 0) delete res.shakeAnim 
                    // } 
                // } 
            // } else { 
                // if (re.x != 0) res.x = re.x 
                // if (re.y != 0) res.y = re.y 
                // if (re.rotation != 0) res.rotation = re.rotation 
                // if (re.anchorX != 0.5) res.anchorX = re.anchorX 
                // if (re.anchorY != 0.5) res.anchorY = re.anchorY 
                // if (re.skewX != 0) res.skewX = re.skewX 
                // if (re.skewY != 0) res.skewY = re.skewY 
                // if (re.scaleX != 1 && re.scaleY != 1 && re.scaleX == re.scaleY) { 
                    // res.scale = re.scaleX 
                // } else { 
                    // if (re.scaleX != 1) res.scaleX = re.scaleX 
                    // if (re.scaleY != 1) res.scaleY = re.scaleY 
                // } 
                // if (re.width != 0) res.width = re.width 
                // if (re.height != 0) res.height = re.height 
                // if (!this.colorSame(re.color, cc.color(255,255,255,255))) res.color = this.parseColor(re.color) 
                // if (re.opacity != 255) res.opacity = re.opacity 
                // if (re.label) { 
                    // res.label = {} 
                    // res.label.string = {en:re.label.string, de:re.label.string, es:re.label.string, fr:re.label.string} 
                    // if (re.label.string == "BUY NOW") { 
                        // res.label.string = {en:"BUY NOW",es:"COMPRAR AHORA",de:"JETZT KAUFEN",fr:"ACHETER MAINTENANT"} 
                    // } 
                    // else if (re.label.string == "GO!") { 
                        // res.label.string = {en:"GO!",es:"¡IR!",de:"LOS!",fr:"ALLER!"} 
                    // } 
                    // res.label.fontSize = re.label.fontSize 
                    // res.label.lineHeight = re.label.lineHeight 
                    // res.label.maxWidth = re.label.maxWidth 
                    // res.label.maxLines = re.label.maxLines 
                // } 
                // if (re.outline) { 
                    // res.outline = {} 
                    // res.outline.color = this.parseColor(re.outline.color) 
                    // res.outline.width = re.outline.width 
                // } 
                // if (re.shadow) { 
                    // res.shadow = {} 
                    // res.shadow.color = this.parseColor(re.shadow.color) 
                    // res.shadow.opacity = re.shadow.opacity 
                    // res.shadow.dx = re.shadow.dx 
                    // res.shadow.dy = re.shadow.dy 
                // } 
                // if (re.sprite) { 
                    // res.sprite = {} 
                    // res.sprite.image = "https://cg-cdn.goldaxe.net/mergeTown/event/img/" + re.sprite.image + ".png" 
                // } 
                // if (re.blinkAnim) { 
                    // res.blinkAnim = {} 
                    // res.blinkAnim.minAlpha = re.blinkAnim.minAlpha 
                    // res.blinkAnim.maxAlpha = re.blinkAnim.maxAlpha 
                    // res.blinkAnim.duration = re.blinkAnim.duration 
                    // res.blinkAnim.delay = re.blinkAnim.delay 
                // } 
                // if (re.moveAnim) { 
                    // res.moveAnim = {} 
                    // res.moveAnim.dis = re.moveAnim.dis 
                    // res.moveAnim.disx = re.moveAnim.disx 
                    // res.moveAnim.time = re.moveAnim.time 
                    // res.moveAnim.delay = re.moveAnim.delay 
                // } 
                // if (re.loopMoveAnim) { 
                    // res.loopMoveAnim = {} 
                    // res.loopMoveAnim.disy = re.loopMoveAnim.disy 
                    // res.loopMoveAnim.disx = re.loopMoveAnim.disx 
                    // res.loopMoveAnim.time = re.loopMoveAnim.time 
                    // res.loopMoveAnim.delay = re.loopMoveAnim.delay 
                // } 
                // if (re.rotateAnim) { 
                    // res.rotateAnim = {} 
                    // res.rotateAnim.clockwise = re.rotateAnim.clockwise 
                    // res.rotateAnim.outDegree = re.rotateAnim.outDegree 
                    // res.rotateAnim.step = re.rotateAnim.step 
                    // res.rotateAnim.time = re.rotateAnim.time 
                    // res.rotateAnim.delay = re.rotateAnim.delay 
                // } 
                // if (re.scaleAnim) { 
                    // res.scaleAnim = {} 
                    // res.scaleAnim.minX = re.scaleAnim.minX 
                    // res.scaleAnim.maxX = re.scaleAnim.maxX 
                    // res.scaleAnim.minY = re.scaleAnim.minY 
                    // res.scaleAnim.maxY = re.scaleAnim.maxY 
                    // res.scaleAnim.time = re.scaleAnim.time 
                    // res.scaleAnim.delay = re.scaleAnim.delay 
                // } 
                // if (re.skewAnim) { 
                    // res.skewAnim = {} 
                    // res.skewAnim.minX = re.skewAnim.minX 
                    // res.skewAnim.maxX = re.skewAnim.maxX 
                    // res.skewAnim.minY = re.skewAnim.minY 
                    // res.skewAnim.maxY = re.skewAnim.maxY 
                    // res.skewAnim.time = re.skewAnim.time 
                    // res.skewAnim.delay = re.skewAnim.delay 
                // } 
                // if (re.shakeAnim) { 
                    // res.shakeAnim = {} 
                    // res.shakeAnim.wait = re.shakeAnim.wait 
                    // res.shakeAnim.degree = re.shakeAnim.degree 
                    // res.shakeAnim.time = re.shakeAnim.time 
                    // res.shakeAnim.delay = re.shakeAnim.delay 
                // } 
            // } 
            // if (Object.keys(res).length > 0) result[name] = res 
        // } 
        // Editor.log(JSON.stringify(result)) 
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

}


/**
 * Note: The original script has been commented out, due to the large number of changes in the script, there may be missing in the conversion, you need to convert it manually
 */
// cc.Class({
//     extends: cc.Component,
// 
//     editor: {
//         menu:"Editor-Tools/TActivityPanelGetNodes",
//         executeInEditMode: true,
//     }, 
// 
//     properties: {
//         record: false,
//         check: false,
// 
//         readStr: "",
//         read: false,
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
//         if (CC_EDITOR && this.record) {
//             this.record = false
//             this.records = this.recordList()
//         }
//         if (CC_EDITOR && this.check) {
//             this.check = false
//             this.outputList()
//         }
//         if (CC_EDITOR && this.read) {
//             this.read = false
//             try {
//                 let param = JSON.parse(this.readStr)
//         
//                 let rawNames = []
//                 var _recNode = function(node) {
//                     let nodes = node._children
//                     nodes.forEach(n => {
//                         CCTools.SetNodeByParam(n, param[n.name])
//                         rawNames.push(n.name)
//                         if (n._children && n._children.length > 0) {
//                             _recNode(n)
//                         }
//                     });
//                 }.bind(this)
//                 _recNode(this.node)
//                 
//                 for (let name in param) {
//                     if (rawNames.contains(name)) continue;
//                     let nnode = new cc.Node(name)
//                     nnode.parent = this.node
//                     CCTools.SetNodeByParam(nnode, param[name])
//                 }
//         
//             } catch(e) {Editor.log(e)}
//         }
//     },
// 
//     recordList() {
//         let records = {}
// 
//         var _rec = function(node) {
//             if (node.name == "RICHTEXT_CHILD" || node.name.contains("_TwoColor_child") || node.name.contains("_LabelShadow_child_")) return
//             var re = {}
//             re.active = node.active
//             re.x = node.x
//             re.y = node.y
//             re.rotation = node.rotation
//             re.anchorX = node.anchorX
//             re.anchorY = node.anchorY
//             re.skewX = node.skewX
//             re.skewY = node.skewY
//             re.scaleX = node.scaleX
//             re.scaleY = node.scaleY
//             re.width = node.width
//             re.height = node.height
//             re.color = this.recordColor(node.color)
//             re.opacity = node.opacity
// 
//             let label = node.getComponent(cc.Label) || node.getComponent(cc.RichText)
//             if (label) {
//                 re.label = {}
//                 re.label.string = label.string
//                 re.label.fontSize = label.fontSize
//                 re.label.lineHeight = label.lineHeight
//                 re.label.maxWidth = label.maxWidth
//                 re.label.maxLines = label.maxLines
// 
//                 let labelOutline = node.getComponent(cc.LabelOutline)
//                 if (labelOutline) {
//                     re.outline = {}
//                     re.outline.color = this.recordColor(labelOutline.color)
//                     re.outline.width = labelOutline.width
//                 }
//                 let labelShadow = node.getComponent("LabelShadow")
//                 if (labelShadow) {
//                     re.shadow = {}
//                     re.shadow.color = this.recordColor(labelShadow.color)
//                     re.shadow.opacity = labelShadow.opacity
//                     re.shadow.dx = labelShadow.dx
//                     re.shadow.dy = labelShadow.dy
//                 }
//             }
//             
//             let sprite = node.getComponent(cc.Sprite) || node.getComponent(cc.Sprite)
//             if (sprite) {
//                 if (sprite.spriteFrame) {
//                     re.sprite = {}
//                     re.sprite.image = sprite.spriteFrame.name
//                 }
//             }
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
//                 re.loopMoveAnim.dis = loopMoveAnim.dis
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
//                 re.rotateAnim.clockwise = rotateAnim.clockwise
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
//             let skewAnim = node.getComponent("SkewAnim")
//             if (skewAnim) {
//                 re.skewAnim = {}
//                 re.skewAnim.time = skewAnim.time
//                 re.skewAnim.delay = skewAnim.delay
//                 re.skewAnim.minX = skewAnim.minX
//                 re.skewAnim.maxX = skewAnim.maxX
//                 re.skewAnim.minY = skewAnim.minY
//                 re.skewAnim.maxY = skewAnim.maxY
//             }
// 
//             let shakeAnim = node.getComponent("ShakeAnim")
//             if (shakeAnim) {
//                 re.shakeAnim = {}
//                 re.shakeAnim.time = shakeAnim.time
//                 re.shakeAnim.delay = shakeAnim.delay
//                 re.shakeAnim.wait = shakeAnim.wait
//                 re.shakeAnim.degree = shakeAnim.degree
//             }
// 
//             records[node.name] = re
//         }.bind(this)
//         
//         var _recNode = function(node) {
//             let nodes = node._children
//             nodes.forEach(n => {
//                 _rec(n)
//                 if (n._children && n._children.length > 0) {
//                     if (n.name.contains("_TwoColor_child")) return
//                     _recNode(n)
//                 }
//             });
//         }.bind(this)
// 
//         _recNode(this.node)
// 
//         return records
//     },
// 
//     outputList() {
//         let orecords = this.records
//         let records = this.recordList()
//         let result = {}
//         for (let name in records) {
//             let re = records[name]
//             let node = orecords[name]
//             let res = {}
// 
//             if (node) {
//                 if (re.active != node.active) res.active = re.active
//                 if (re.x != node.x) res.x = re.x
//                 if (re.y != node.y) res.y = re.y
//                 if (re.rotation != node.rotation) res.rotation = re.rotation
//                 if (re.anchorX != node.anchorX) res.anchorX = re.anchorX
//                 if (re.anchorY != node.anchorY) res.anchorY = re.anchorY
//                 if (re.skewX != node.skewX) res.skewX = re.skewX
//                 if (re.skewY != node.skewY) res.skewY = re.skewY
//                 if (re.scaleX != node.scaleX && re.scaleY != node.scaleY && re.scaleX == re.scaleY) {
//                     res.scale = re.scaleX
//                 } else {
//                     if (re.scaleX != node.scaleX) res.scaleX = re.scaleX
//                     if (re.scaleY != node.scaleY) res.scaleY = re.scaleY
//                 }
//                 if (re.width != node.width) res.width = re.width
//                 if (re.height != node.height) res.height = re.height
//                 if (!this.colorSame(re.color, node.color)) res.color = this.parseColor(re.color)
//                 if (re.opacity != node.opacity) res.opacity = re.opacity
// 
//                 if (re.label) {
//                     res.label = {}
//                     if (!node.label) {
//                         res.label.string = {en:re.label.string, de:re.label.string, es:re.label.string, fr:re.label.string}
//                         if (re.label.string == "BUY NOW") {
//                             res.label.string = {en:"BUY NOW",es:"COMPRAR AHORA",de:"JETZT KAUFEN",fr:"ACHETER MAINTENANT"}
//                         }
//                         else if (re.label.string == "GO!") {
//                             res.label.string = {en:"GO!",es:"¡IR!",de:"LOS!",fr:"ALLER!"}
//                         }
//                         res.label.fontSize = re.label.fontSize
//                         res.label.lineHeight = re.label.lineHeight
//                         res.label.maxWidth = re.label.maxWidth
//                         res.label.maxLines = re.label.maxLines
//                     } else {
//                         if (re.label.string != node.label.string) res.label.string = {en:re.label.string, de:re.label.string, es:re.label.string, fr:re.label.string}
//                         if (re.label.string == "BUY NOW") {
//                             res.label.string = {en:"BUY NOW",es:"COMPRAR AHORA",de:"JETZT KAUFEN",fr:"ACHETER MAINTENANT"}
//                         }
//                         else if (re.label.string == "GO!") {
//                             res.label.string = {en:"GO!",es:"¡IR!",de:"LOS!",fr:"ALLER!"}
//                         }
//                         if (re.label.fontSize != node.label.fontSize) res.label.fontSize = re.label.fontSize
//                         if (re.label.lineHeight != node.label.lineHeight) res.label.lineHeight = re.label.lineHeight
//                         if (re.label.maxWidth != node.label.maxWidth) res.label.maxWidth = re.label.maxWidth
//                         if (re.label.maxLines != node.label.maxLines) res.label.maxLines = re.label.maxLines
//                         if (Object.keys(res.label).length <= 0) delete res.label
//                     }
//                 }
// 
//                 if (re.outline) {
//                     res.outline = {}
//                     if (!node.outline) {
//                         res.outline.color = this.parseColor(re.outline.color)
//                         res.outline.width = re.outline.width
//                     } else {
//                         if (!this.colorSame(re.outline.color, node.outline.color)) res.outline.color = this.parseColor(re.outline.color)
//                         if (re.outline.width != node.outline.width) res.outline.width = re.outline.width
//                         if (Object.keys(res.outline).length <= 0) delete res.outline
//                     }
//                 }
//                 if (re.shadow) {
//                     res.shadow = {}
//                     if (!node.shadow) {
//                         res.shadow.color = this.parseColor(re.shadow.color)
//                         res.shadow.opacity = re.shadow.opacity
//                         res.shadow.dx = re.shadow.dx
//                         res.shadow.dy = re.shadow.dy
//                     } else {
//                         if (!this.colorSame(re.shadow.color, node.shadow.color)) res.shadow.color = this.parseColor(re.shadow.color)
//                         if (re.shadow.opacity != node.shadow.opacity) res.shadow.opacity = re.shadow.opacity
//                         if (re.shadow.dx != node.shadow.dx) res.shadow.dx = re.shadow.dx
//                         if (re.shadow.dy != node.shadow.dy) res.shadow.dy = re.shadow.dy
//                         if (Object.keys(res.shadow).length <= 0) delete res.shadow
//                     }
//                 }
//                 if (re.sprite) {
//                     res.sprite = {}
//                     if (!node.sprite) {
//                         res.sprite.image = "https://cg-cdn.goldaxe.net/mergeTown/event/img/" + re.sprite.image + ".png"
//                     } else {
//                         if (re.sprite.image != node.sprite.image) res.sprite.image = "https://cg-cdn.goldaxe.net/mergeTown/event/img/" + re.sprite.image + ".png"
//                         if (Object.keys(res.sprite).length <= 0) delete res.sprite
//                     }
//                 }
//                 if (re.blinkAnim) {
//                     res.blinkAnim = {}
//                     if (!node.blinkAnim) {
//                         res.blinkAnim.minAlpha = re.blinkAnim.minAlpha
//                         res.blinkAnim.maxAlpha = re.blinkAnim.maxAlpha
//                         res.blinkAnim.duration = re.blinkAnim.duration
//                         res.blinkAnim.delay = re.blinkAnim.delay
//                     } else {
//                         if (re.blinkAnim.minAlpha != node.blinkAnim.minAlpha) res.blinkAnim.minAlpha = re.blinkAnim.minAlpha
//                         if (re.blinkAnim.maxAlpha != node.blinkAnim.maxAlpha) res.blinkAnim.maxAlpha = re.blinkAnim.maxAlpha
//                         if (re.blinkAnim.duration != node.blinkAnim.duration) res.blinkAnim.duration = re.blinkAnim.duration
//                         if (re.blinkAnim.delay != node.blinkAnim.delay) res.blinkAnim.delay = re.blinkAnim.delay
//                         if (Object.keys(res.blinkAnim).length <= 0) delete res.blinkAnim
//                     }
//                 }
//                 if (re.moveAnim) {
//                     res.moveAnim = {}
//                     if (!node.moveAnim) {
//                         res.moveAnim.dis = re.moveAnim.dis
//                         res.moveAnim.disx = re.moveAnim.disx
//                         res.moveAnim.time = re.moveAnim.time
//                         res.moveAnim.delay = re.moveAnim.delay
//                     } else {
//                         if (re.moveAnim.dis != node.moveAnim.dis) res.moveAnim.dis = re.moveAnim.dis
//                         if (re.moveAnim.disx != node.moveAnim.disx) res.moveAnim.disx = re.moveAnim.disx
//                         if (re.moveAnim.time != node.moveAnim.time) res.moveAnim.time = re.moveAnim.time
//                         if (re.moveAnim.delay != node.moveAnim.delay) res.moveAnim.delay = re.moveAnim.delay
//                         if (Object.keys(res.moveAnim).length <= 0) delete res.moveAnim
//                     }
//                 }
//                 if (re.loopMoveAnim) {
//                     res.loopMoveAnim = {}
//                     if (!node.loopMoveAnim) {
//                         res.loopMoveAnim.disy = re.loopMoveAnim.disy
//                         res.loopMoveAnim.disx = re.loopMoveAnim.disx
//                         res.loopMoveAnim.time = re.loopMoveAnim.time
//                         res.loopMoveAnim.delay = re.loopMoveAnim.delay
//                     } else {
//                         if (re.loopMoveAnim.disy != node.loopMoveAnim.disy) res.loopMoveAnim.disy = re.loopMoveAnim.disy
//                         if (re.loopMoveAnim.disx != node.loopMoveAnim.disx) res.loopMoveAnim.disx = re.loopMoveAnim.disx
//                         if (re.loopMoveAnim.time != node.loopMoveAnim.time) res.loopMoveAnim.time = re.loopMoveAnim.time
//                         if (re.loopMoveAnim.delay != node.loopMoveAnim.delay) res.loopMoveAnim.delay = re.loopMoveAnim.delay
//                         if (Object.keys(res.loopMoveAnim).length <= 0) delete res.loopMoveAnim
//                     }
//                 }
//                 if (re.rotateAnim) {
//                     res.rotateAnim = {}
//                     if (!node.rotateAnim) {
//                         res.rotateAnim.clockwise = re.rotateAnim.clockwise
//                         res.rotateAnim.outDegree = re.rotateAnim.outDegree
//                         res.rotateAnim.step = re.rotateAnim.step
//                         res.rotateAnim.time = re.rotateAnim.time
//                         res.rotateAnim.delay = re.rotateAnim.delay
//                     } else {
//                         if (re.rotateAnim.clockwise != node.rotateAnim.clockwise) res.rotateAnim.clockwise = re.rotateAnim.clockwise
//                         if (re.rotateAnim.outDegree != node.rotateAnim.outDegree) res.rotateAnim.outDegree = re.rotateAnim.outDegree
//                         if (re.rotateAnim.step != node.rotateAnim.step) res.rotateAnim.step = re.rotateAnim.step
//                         if (re.rotateAnim.time != node.rotateAnim.time) res.rotateAnim.time = re.rotateAnim.time
//                         if (re.rotateAnim.delay != node.rotateAnim.delay) res.rotateAnim.delay = re.rotateAnim.delay
//                         if (Object.keys(res.rotateAnim).length <= 0) delete res.rotateAnim
//                     }
//                 }
//                 if (re.scaleAnim) {
//                     res.scaleAnim = {}
//                     if (!node.scaleAnim) {
//                         res.scaleAnim.minX = re.scaleAnim.minX
//                         res.scaleAnim.maxX = re.scaleAnim.maxX
//                         res.scaleAnim.minY = re.scaleAnim.minY
//                         res.scaleAnim.maxY = re.scaleAnim.maxY
//                         res.scaleAnim.time = re.scaleAnim.time
//                         res.scaleAnim.delay = re.scaleAnim.delay
//                     } else {
//                         if (re.scaleAnim.minX != node.scaleAnim.minX) res.scaleAnim.minX = re.scaleAnim.minX
//                         if (re.scaleAnim.maxX != node.scaleAnim.maxX) res.scaleAnim.maxX = re.scaleAnim.maxX
//                         if (re.scaleAnim.minY != node.scaleAnim.minY) res.scaleAnim.minY = re.scaleAnim.minY
//                         if (re.scaleAnim.maxY != node.scaleAnim.maxY) res.scaleAnim.maxY = re.scaleAnim.maxY
//                         if (re.scaleAnim.time != node.scaleAnim.time) res.scaleAnim.time = re.scaleAnim.time
//                         if (re.scaleAnim.delay != node.scaleAnim.delay) res.scaleAnim.delay = re.scaleAnim.delay
//                         if (Object.keys(res.scaleAnim).length <= 0) delete res.scaleAnim
//                     }
//                 }
//                 if (re.skewAnim) {
//                     res.skewAnim = {}
//                     if (!node.skewAnim) {
//                         res.skewAnim.minX = re.skewAnim.minX
//                         res.skewAnim.maxX = re.skewAnim.maxX
//                         res.skewAnim.minY = re.skewAnim.minY
//                         res.skewAnim.maxY = re.skewAnim.maxY
//                         res.skewAnim.time = re.skewAnim.time
//                         res.skewAnim.delay = re.skewAnim.delay
//                     } else {
//                         if (re.skewAnim.minX != node.skewAnim.minX) res.skewAnim.minX = re.skewAnim.minX
//                         if (re.skewAnim.maxX != node.skewAnim.maxX) res.skewAnim.maxX = re.skewAnim.maxX
//                         if (re.skewAnim.minY != node.skewAnim.minY) res.skewAnim.minY = re.skewAnim.minY
//                         if (re.skewAnim.maxY != node.skewAnim.maxY) res.skewAnim.maxY = re.skewAnim.maxY
//                         if (re.skewAnim.time != node.skewAnim.time) res.skewAnim.time = re.skewAnim.time
//                         if (re.skewAnim.delay != node.skewAnim.delay) res.skewAnim.delay = re.skewAnim.delay
//                         if (Object.keys(res.skewAnim).length <= 0) delete res.skewAnim
//                     }
//                 }
//                 if (re.shakeAnim) {
//                     res.shakeAnim = {}
//                     if (!node.shakeAnim) {
//                         res.shakeAnim.wait = re.shakeAnim.wait
//                         res.shakeAnim.degree = re.shakeAnim.degree
//                         res.shakeAnim.time = re.shakeAnim.time
//                         res.shakeAnim.delay = re.shakeAnim.delay
//                     } else {
//                         if (re.shakeAnim.wait != node.shakeAnim.wait) res.shakeAnim.wait = re.shakeAnim.wait
//                         if (re.shakeAnim.degree != node.shakeAnim.degree) res.shakeAnim.degree = re.shakeAnim.degree
//                         if (re.shakeAnim.time != node.shakeAnim.time) res.shakeAnim.time = re.shakeAnim.time
//                         if (re.shakeAnim.delay != node.shakeAnim.delay) res.shakeAnim.delay = re.shakeAnim.delay
//                         if (Object.keys(res.shakeAnim).length <= 0) delete res.shakeAnim
//                     }
//                 }
//             } else {
//                 if (re.x != 0) res.x = re.x
//                 if (re.y != 0) res.y = re.y
//                 if (re.rotation != 0) res.rotation = re.rotation
//                 if (re.anchorX != 0.5) res.anchorX = re.anchorX
//                 if (re.anchorY != 0.5) res.anchorY = re.anchorY
//                 if (re.skewX != 0) res.skewX = re.skewX
//                 if (re.skewY != 0) res.skewY = re.skewY
//                 if (re.scaleX != 1 && re.scaleY != 1 && re.scaleX == re.scaleY) {
//                     res.scale = re.scaleX
//                 } else {
//                     if (re.scaleX != 1) res.scaleX = re.scaleX
//                     if (re.scaleY != 1) res.scaleY = re.scaleY
//                 }
//                 if (re.width != 0) res.width = re.width
//                 if (re.height != 0) res.height = re.height
//                 if (!this.colorSame(re.color, cc.color(255,255,255,255))) res.color = this.parseColor(re.color)
//                 if (re.opacity != 255) res.opacity = re.opacity
// 
//                 if (re.label) {
//                     res.label = {}
//                     res.label.string = {en:re.label.string, de:re.label.string, es:re.label.string, fr:re.label.string}
//                     if (re.label.string == "BUY NOW") {
//                         res.label.string = {en:"BUY NOW",es:"COMPRAR AHORA",de:"JETZT KAUFEN",fr:"ACHETER MAINTENANT"}
//                     }
//                     else if (re.label.string == "GO!") {
//                         res.label.string = {en:"GO!",es:"¡IR!",de:"LOS!",fr:"ALLER!"}
//                     }
//                     res.label.fontSize = re.label.fontSize
//                     res.label.lineHeight = re.label.lineHeight
//                     res.label.maxWidth = re.label.maxWidth
//                     res.label.maxLines = re.label.maxLines
//                 }
// 
//                 if (re.outline) {
//                     res.outline = {}
//                     res.outline.color = this.parseColor(re.outline.color)
//                     res.outline.width = re.outline.width
//                 }
//                 if (re.shadow) {
//                     res.shadow = {}
//                     res.shadow.color = this.parseColor(re.shadow.color)
//                     res.shadow.opacity = re.shadow.opacity
//                     res.shadow.dx = re.shadow.dx
//                     res.shadow.dy = re.shadow.dy
//                 }
//                 if (re.sprite) {
//                     res.sprite = {}
//                     res.sprite.image = "https://cg-cdn.goldaxe.net/mergeTown/event/img/" + re.sprite.image + ".png"
//                 }
//                 if (re.blinkAnim) {
//                     res.blinkAnim = {}
//                     res.blinkAnim.minAlpha = re.blinkAnim.minAlpha
//                     res.blinkAnim.maxAlpha = re.blinkAnim.maxAlpha
//                     res.blinkAnim.duration = re.blinkAnim.duration
//                     res.blinkAnim.delay = re.blinkAnim.delay
//                 }
//                 if (re.moveAnim) {
//                     res.moveAnim = {}
//                     res.moveAnim.dis = re.moveAnim.dis
//                     res.moveAnim.disx = re.moveAnim.disx
//                     res.moveAnim.time = re.moveAnim.time
//                     res.moveAnim.delay = re.moveAnim.delay
//                 }
//                 if (re.loopMoveAnim) {
//                     res.loopMoveAnim = {}
//                     res.loopMoveAnim.disy = re.loopMoveAnim.disy
//                     res.loopMoveAnim.disx = re.loopMoveAnim.disx
//                     res.loopMoveAnim.time = re.loopMoveAnim.time
//                     res.loopMoveAnim.delay = re.loopMoveAnim.delay
//                 }
//                 if (re.rotateAnim) {
//                     res.rotateAnim = {}
//                     res.rotateAnim.clockwise = re.rotateAnim.clockwise
//                     res.rotateAnim.outDegree = re.rotateAnim.outDegree
//                     res.rotateAnim.step = re.rotateAnim.step
//                     res.rotateAnim.time = re.rotateAnim.time
//                     res.rotateAnim.delay = re.rotateAnim.delay
//                 }
//                 if (re.scaleAnim) {
//                     res.scaleAnim = {}
//                     res.scaleAnim.minX = re.scaleAnim.minX
//                     res.scaleAnim.maxX = re.scaleAnim.maxX
//                     res.scaleAnim.minY = re.scaleAnim.minY
//                     res.scaleAnim.maxY = re.scaleAnim.maxY
//                     res.scaleAnim.time = re.scaleAnim.time
//                     res.scaleAnim.delay = re.scaleAnim.delay
//                 }
//                 if (re.skewAnim) {
//                     res.skewAnim = {}
//                     res.skewAnim.minX = re.skewAnim.minX
//                     res.skewAnim.maxX = re.skewAnim.maxX
//                     res.skewAnim.minY = re.skewAnim.minY
//                     res.skewAnim.maxY = re.skewAnim.maxY
//                     res.skewAnim.time = re.skewAnim.time
//                     res.skewAnim.delay = re.skewAnim.delay
//                 }
//                 if (re.shakeAnim) {
//                     res.shakeAnim = {}
//                     res.shakeAnim.wait = re.shakeAnim.wait
//                     res.shakeAnim.degree = re.shakeAnim.degree
//                     res.shakeAnim.time = re.shakeAnim.time
//                     res.shakeAnim.delay = re.shakeAnim.delay
//                 }
//             }
// 
//             if (Object.keys(res).length > 0) result[name] = res
//         }
//         Editor.log(JSON.stringify(result))
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
// });
