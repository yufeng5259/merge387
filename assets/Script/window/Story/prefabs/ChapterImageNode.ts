import { _decorator, Component, Sprite, Node, Label } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ChapterImageNode')
export class ChapterImageNode extends Component {
    @property(Sprite)
    public sp = null;
    @property(Node)
    public leftTalkNode = null;
    @property(Node)
    public rightTalkNode = null;
    @property(Label)
    public ChapterNameLbl = null;

    onLoad () {
        // this.initRuntimeState(); 
    }

    start () {
        // this.init(); 
    }

    initRuntimeState () {
        // if (this._runtimeStateInited) return; 
        // this._runtimeStateInited = true; 
        // this.data = null; 
        // this.leftPosX = -300; 
        // this.leftTargetPosX = 0; 
        // this.rightPosX = 350; 
        // this.rightTargetPosX = 0; 
        // this.roleLoadTokens = {left: 0, right: 0}; 
        // this.currentRoleIds = {left: null, right: null}; 
        // this.currentBodyResNames = {left: null, right: null}; 
    }

    init () {
        // this.initRuntimeState(); 
    }

    showInfo (data: any) {
        // this.initRuntimeState(); 
        // this.data = data; 
        // this.init(); 
        // this.clearTalkRoles(); 
        // if (!data) return; 
        // console.log("章节", data.ChapterName()); 
        // this.ChapterNameLbl.string= data.ChapterName()||"error"+data.Id(); 
        // var chapterImage = data.ChapterImage ? data.ChapterImage() : ""; 
        // if (!chapterImage) return; 
        // var self = this; 
        // var resName = "res/Story/chapterImage/" + chapterImage; 
        // cce.loadRes(resName, cc.SpriteFrame, function(err, spriteFrame) { 
            // if (err != null) { 
                // Logs.Warning(err); 
                // return; 
            // } 
            // self.sp.spriteFrame = spriteFrame; 
        // }); 
    }

    showTalkRole (data: any, isLeft: any) {
        // this.initRuntimeState(); 
        // if (!data || !data.EId || !data.GetRoleMeata) return; 
        // var roleMeta = data.GetRoleMeata(data.EId()); 
        // if (!roleMeta || !roleMeta.Body) return; 
        // var body = roleMeta.Body(); 
        // if (!body) return; 
        // var targetNode = isLeft ? this.leftTalkNode : this.rightTalkNode; 
        // if (!targetNode) return; 
        // var sideKey = isLeft ? "left" : "right"; 
        // var roleId = data.StoryUserID ? data.StoryUserID() : data.EId(); 
        // var sameRole = this.currentRoleIds[sideKey] === roleId && this.hasRoleSprite(targetNode); 
        // var token = ++this.roleLoadTokens[sideKey]; 
        // var resName = this.getBodyResName(body); 
        // var sameBody = this.currentBodyResNames[sideKey] === resName && sameRole; 
        // var self = this; 
        // if (sameBody) { 
            // targetNode.stopAllActions(); 
            // targetNode.x = isLeft ? this.leftTargetPosX : this.rightTargetPosX; 
            // return; 
        // } 
        // cce.loadRes(resName, cc.SpriteFrame, function(err, spriteFrame) { 
            // if (token !== self.roleLoadTokens[sideKey]) return; 
            // if (err || !spriteFrame) { 
                // if (typeof Logs !== "undefined" && Logs.Warning) { 
                    // Logs.Warning(err || ("load story body failed: " + resName)); 
                // } 
                // return; 
            // } 
            // self.currentRoleIds[sideKey] = roleId; 
            // self.currentBodyResNames[sideKey] = resName; 
            // self.showRoleSprite(targetNode, spriteFrame, isLeft, sameRole); 
        // }); 
    }

    getBodyResName (body: any) {
        // var resName = String(body || "").replace(/\\/g, "/"); 
        // resName = resName.replace(/\.(png|jpg|jpeg)$/i, ""); 
        // if (resName.indexOf("res/") === 0) return resName; 
        // if (resName.indexOf("/") >= 0) return "res/" + resName; 
        // return "res/Town/avatar/" + resName; 
    }

    showRoleSprite (targetNode: any, spriteFrame: any, isLeft: any, noMove: any) {
        // targetNode.stopAllActions(); 
        // targetNode.active = true; 
        // var targetX = isLeft ? this.leftTargetPosX : this.rightTargetPosX; 
        // targetNode.x = noMove ? targetX : (isLeft ? this.leftPosX : this.rightPosX); 
        // var roleNode = this.getRoleSpriteNode(targetNode); 
        // this.clearGeneratedRoleChildren(targetNode, roleNode); 
        // roleNode.active = true; 
        // if (roleNode !== targetNode) { 
            // roleNode.x = 0; 
            // roleNode.y = 0; 
        // } 
        // var sprite = roleNode.getComponent(cc.Sprite) || roleNode.addComponent(cc.Sprite); 
        // sprite.spriteFrame = spriteFrame; 
        // if (noMove) return; 
        // targetNode.runAction(cc.moveTo(0.25, cc.v2(targetX, targetNode.y)).easing(cc.easeBackOut())); 
    }

    hasRoleSprite (targetNode: any) {
        // var roleNode = this.getRoleSpriteNode(targetNode); 
        // var sprite = roleNode && roleNode.getComponent(cc.Sprite); 
        // return !!(sprite && sprite.spriteFrame); 
    }

    clearTalkRoles () {
        // this.clearRoleNode(this.leftTalkNode); 
        // this.clearRoleNode(this.rightTalkNode); 
        // this.currentRoleIds = {left: null, right: null}; 
        // this.currentBodyResNames = {left: null, right: null}; 
    }

    clearRoleNode (targetNode: any) {
        // if (!targetNode) return; 
        // targetNode.stopAllActions(); 
        // targetNode.x = 0; 
        // var roleNode = this.getRoleSpriteNode(targetNode); 
        // this.clearGeneratedRoleChildren(targetNode, roleNode); 
        // var sprite = roleNode && roleNode.getComponent(cc.Sprite); 
        // if (sprite) { 
            // sprite.spriteFrame = null; 
        // } 
        // if (roleNode) { 
            // roleNode.active = false; 
        // } 
    }

    getRoleSpriteNode (targetNode: any) {
        // if (!targetNode) return null; 
        // return targetNode.getChildByName("roleNode") || targetNode; 
    }

    clearGeneratedRoleChildren (targetNode: any, keepNode: any) {
        // if (!targetNode) return; 
        // var children = targetNode.children ? targetNode.children.slice() : []; 
        // children.forEach(function(child) { 
            // if (child === keepNode) return; 
            // if (child.name !== "story_body") return; 
            // child.removeFromParent(false); 
            // child.destroy(); 
        // }); 
    }

}


/**
 * Note: The original script has been commented out, due to the large number of changes in the script, there may be missing in the conversion, you need to convert it manually
 */
// cc.Class({
//     extends: cc.Component,
// 
//     properties: {
//         sp: cc.Sprite,
//         leftTalkNode: cc.Node,
//         rightTalkNode: cc.Node,
//         ChapterNameLbl:cc.Label,
//     },
// 
//     onLoad() {
//         this.initRuntimeState();
//     },
// 
//     start() {
//         this.init();
//     },
// 
//     initRuntimeState() {
//         if (this._runtimeStateInited) return;
//         this._runtimeStateInited = true;
//         this.data = null;
//         this.leftPosX = -300;
//         this.leftTargetPosX = 0;
//         this.rightPosX = 350;
//         this.rightTargetPosX = 0;
//         this.roleLoadTokens = {left: 0, right: 0};
//         this.currentRoleIds = {left: null, right: null};
//         this.currentBodyResNames = {left: null, right: null};
//     },
// 
//     init() {
//         this.initRuntimeState();
//     },
// 
//     showInfo(data) {
//         this.initRuntimeState();
//         this.data = data;
//         this.init();
//         this.clearTalkRoles();
//         if (!data) return;
//         console.log("章节", data.ChapterName());
//         this.ChapterNameLbl.string= data.ChapterName()||"error"+data.Id();
//         var chapterImage = data.ChapterImage ? data.ChapterImage() : "";
//         if (!chapterImage) return;
// 
//         var self = this;
//         var resName = "res/Story/chapterImage/" + chapterImage;
//         cce.loadRes(resName, cc.SpriteFrame, function(err, spriteFrame) {
//             if (err != null) {
//                 Logs.Warning(err);
//                 return;
//             }
//             self.sp.spriteFrame = spriteFrame;
//         });
//     },
// 
//     showTalkRole(data, isLeft) {
//         this.initRuntimeState();
//         if (!data || !data.EId || !data.GetRoleMeata) return;
// 
//         var roleMeta = data.GetRoleMeata(data.EId());
//         if (!roleMeta || !roleMeta.Body) return;
// 
//         var body = roleMeta.Body();
//         if (!body) return;
// 
//         var targetNode = isLeft ? this.leftTalkNode : this.rightTalkNode;
//         if (!targetNode) return;
// 
//         var sideKey = isLeft ? "left" : "right";
//         var roleId = data.StoryUserID ? data.StoryUserID() : data.EId();
//         var sameRole = this.currentRoleIds[sideKey] === roleId && this.hasRoleSprite(targetNode);
//         var token = ++this.roleLoadTokens[sideKey];
//         var resName = this.getBodyResName(body);
//         var sameBody = this.currentBodyResNames[sideKey] === resName && sameRole;
//         var self = this;
// 
//         if (sameBody) {
//             targetNode.stopAllActions();
//             targetNode.x = isLeft ? this.leftTargetPosX : this.rightTargetPosX;
//             return;
//         }
// 
//         cce.loadRes(resName, cc.SpriteFrame, function(err, spriteFrame) {
//             if (token !== self.roleLoadTokens[sideKey]) return;
//             if (err || !spriteFrame) {
//                 if (typeof Logs !== "undefined" && Logs.Warning) {
//                     Logs.Warning(err || ("load story body failed: " + resName));
//                 }
//                 return;
//             }
//             self.currentRoleIds[sideKey] = roleId;
//             self.currentBodyResNames[sideKey] = resName;
//             self.showRoleSprite(targetNode, spriteFrame, isLeft, sameRole);
//         });
//     },
// 
//     getBodyResName(body) {
//         var resName = String(body || "").replace(/\\/g, "/");
//         resName = resName.replace(/\.(png|jpg|jpeg)$/i, "");
//         if (resName.indexOf("res/") === 0) return resName;
//         if (resName.indexOf("/") >= 0) return "res/" + resName;
//         return "res/Town/avatar/" + resName;
//     },
// 
//     showRoleSprite(targetNode, spriteFrame, isLeft, noMove) {
//         targetNode.stopAllActions();
//         targetNode.active = true;
//         var targetX = isLeft ? this.leftTargetPosX : this.rightTargetPosX;
//         targetNode.x = noMove ? targetX : (isLeft ? this.leftPosX : this.rightPosX);
// 
//         var roleNode = this.getRoleSpriteNode(targetNode);
//         this.clearGeneratedRoleChildren(targetNode, roleNode);
//         roleNode.active = true;
//         if (roleNode !== targetNode) {
//             roleNode.x = 0;
//             roleNode.y = 0;
//         }
// 
//         var sprite = roleNode.getComponent(cc.Sprite) || roleNode.addComponent(cc.Sprite);
//         sprite.spriteFrame = spriteFrame;
// 
//         if (noMove) return;
//         targetNode.runAction(cc.moveTo(0.25, cc.v2(targetX, targetNode.y)).easing(cc.easeBackOut()));
//     },
// 
//     hasRoleSprite(targetNode) {
//         var roleNode = this.getRoleSpriteNode(targetNode);
//         var sprite = roleNode && roleNode.getComponent(cc.Sprite);
//         return !!(sprite && sprite.spriteFrame);
//     },
// 
//     clearTalkRoles() {
//         this.clearRoleNode(this.leftTalkNode);
//         this.clearRoleNode(this.rightTalkNode);
//         this.currentRoleIds = {left: null, right: null};
//         this.currentBodyResNames = {left: null, right: null};
//     },
// 
//     clearRoleNode(targetNode) {
//         if (!targetNode) return;
//         targetNode.stopAllActions();
//         targetNode.x = 0;
//         var roleNode = this.getRoleSpriteNode(targetNode);
//         this.clearGeneratedRoleChildren(targetNode, roleNode);
//         var sprite = roleNode && roleNode.getComponent(cc.Sprite);
//         if (sprite) {
//             sprite.spriteFrame = null;
//         }
//         if (roleNode) {
//             roleNode.active = false;
//         }
//     },
// 
//     getRoleSpriteNode(targetNode) {
//         if (!targetNode) return null;
//         return targetNode.getChildByName("roleNode") || targetNode;
//     },
// 
//     clearGeneratedRoleChildren(targetNode, keepNode) {
//         if (!targetNode) return;
//         var children = targetNode.children ? targetNode.children.slice() : [];
//         children.forEach(function(child) {
//             if (child === keepNode) return;
//             if (child.name !== "story_body") return;
//             child.removeFromParent(false);
//             child.destroy();
//         });
//     },
// });
