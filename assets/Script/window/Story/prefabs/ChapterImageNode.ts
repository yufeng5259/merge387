import { _decorator, Component, easing, Label, Node, Sprite, SpriteFrame, tween, Tween, Vec3 } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('ChapterImageNode')
export class ChapterImageNode extends Component {
    @property(Sprite)
    public sp: Sprite | null = null;

    @property(Node)
    public leftTalkNode: Node | null = null;

    @property(Node)
    public rightTalkNode: Node | null = null;

    @property(Label)
    public ChapterNameLbl: Label | null = null;

    public data: any = null;
    public leftPosX = -300;
    public leftTargetPosX = 0;
    public rightPosX = 350;
    public rightTargetPosX = 0;
    public roleLoadTokens: Record<string, number> = { left: 0, right: 0 };
    public currentRoleIds: Record<string, any> = { left: null, right: null };
    public currentBodyResNames: Record<string, string | null> = { left: null, right: null };
    private _runtimeStateInited = false;

    public onLoad() {
        this.initRuntimeState();
    }

    public start() {
        this.init();
    }

    public initRuntimeState() {
        if (this._runtimeStateInited) {
            return;
        }
        this._runtimeStateInited = true;
        this.data = null;
        this.leftPosX = -300;
        this.leftTargetPosX = 0;
        this.rightPosX = 350;
        this.rightTargetPosX = 0;
        this.roleLoadTokens = { left: 0, right: 0 };
        this.currentRoleIds = { left: null, right: null };
        this.currentBodyResNames = { left: null, right: null };
    }

    public init() {
        this.initRuntimeState();
    }

    public showInfo(data: any) {
        this.initRuntimeState();
        this.data = data;
        this.init();
        this.clearTalkRoles();
        if (!data) {
            return;
        }
        console.log('绔犺妭', data.ChapterName());
        this.ChapterNameLbl.string = data.ChapterName() || 'error' + data.Id();

        const chapterImage = data.ChapterImage ? data.ChapterImage() : '';
        if (!chapterImage) {
            return;
        }

        const resName = 'res/Story/chapterImage/' + chapterImage;
        cce.loadRes(resName, SpriteFrame, (err: any, spriteFrame: SpriteFrame) => {
            if (err != null) {
                Logs.Warning(err);
                return;
            }
            this.sp.spriteFrame = spriteFrame;
        });
    }

    public showTalkRole(data: any, isLeft: boolean) {
        this.initRuntimeState();
        if (!data || !data.EId || !data.GetRoleMeata) {
            return;
        }

        const roleMeta = data.GetRoleMeata(data.EId());
        if (!roleMeta || !roleMeta.Body) {
            return;
        }

        const body = roleMeta.Body();
        if (!body) {
            return;
        }

        const targetNode = isLeft ? this.leftTalkNode : this.rightTalkNode;
        if (!targetNode) {
            return;
        }

        const sideKey = isLeft ? 'left' : 'right';
        const roleId = data.StoryUserID ? data.StoryUserID() : data.EId();
        const sameRole = this.currentRoleIds[sideKey] === roleId && this.hasRoleSprite(targetNode);
        const token = ++this.roleLoadTokens[sideKey];
        const resName = this.getBodyResName(body);
        const sameBody = this.currentBodyResNames[sideKey] === resName && sameRole;

        if (sameBody) {
            Tween.stopAllByTarget(targetNode);
            targetNode.setPosition(isLeft ? this.leftTargetPosX : this.rightTargetPosX, targetNode.position.y, targetNode.position.z);
            return;
        }

        cce.loadRes(resName, SpriteFrame, (err: any, spriteFrame: SpriteFrame | null) => {
            if (token !== this.roleLoadTokens[sideKey]) {
                return;
            }
            if (err || !spriteFrame) {
                Logs.Warning(err || ('load story body failed: ' + resName));
                return;
            }
            this.currentRoleIds[sideKey] = roleId;
            this.currentBodyResNames[sideKey] = resName;
            this.showRoleSprite(targetNode, spriteFrame, isLeft, sameRole);
        });
    }

    public getBodyResName(body: any) {
        let resName = String(body || '').replace(/\\/g, '/');
        resName = resName.replace(/\.(png|jpg|jpeg)$/i, '');
        if (resName.indexOf('res/') === 0) {
            return resName;
        }
        if (resName.indexOf('/') >= 0) {
            return 'res/' + resName;
        }
        return 'res/Town/avatar/' + resName;
    }

    public showRoleSprite(targetNode: Node, spriteFrame: SpriteFrame, isLeft: boolean, noMove: boolean) {
        Tween.stopAllByTarget(targetNode);
        targetNode.active = true;
        const targetX = isLeft ? this.leftTargetPosX : this.rightTargetPosX;
        targetNode.setPosition(noMove ? targetX : (isLeft ? this.leftPosX : this.rightPosX), targetNode.position.y, targetNode.position.z);

        const roleNode = this.getRoleSpriteNode(targetNode);
        this.clearGeneratedRoleChildren(targetNode, roleNode);
        roleNode.active = true;
        if (roleNode !== targetNode) {
            roleNode.setPosition(0, 0, roleNode.position.z);
        }

        const sprite = roleNode.getComponent(Sprite) || roleNode.addComponent(Sprite);
        sprite.spriteFrame = spriteFrame;

        if (noMove) {
            return;
        }
        tween(targetNode)
            .to(0.25, { position: new Vec3(targetX, targetNode.position.y, targetNode.position.z) }, { easing: easing.backOut })
            .start();
    }

    public hasRoleSprite(targetNode: Node) {
        const roleNode = this.getRoleSpriteNode(targetNode);
        const sprite = roleNode && roleNode.getComponent(Sprite);
        return !!(sprite && sprite.spriteFrame);
    }

    public clearTalkRoles() {
        this.clearRoleNode(this.leftTalkNode);
        this.clearRoleNode(this.rightTalkNode);
        this.currentRoleIds = { left: null, right: null };
        this.currentBodyResNames = { left: null, right: null };
    }

    public clearRoleNode(targetNode: Node | null) {
        if (!targetNode) {
            return;
        }
        Tween.stopAllByTarget(targetNode);
        targetNode.setPosition(0, targetNode.position.y, targetNode.position.z);
        const roleNode = this.getRoleSpriteNode(targetNode);
        this.clearGeneratedRoleChildren(targetNode, roleNode);
        const sprite = roleNode && roleNode.getComponent(Sprite);
        if (sprite) {
            sprite.spriteFrame = null;
        }
        if (roleNode) {
            roleNode.active = false;
        }
    }

    public getRoleSpriteNode(targetNode: Node | null) {
        if (!targetNode) {
            return null;
        }
        return targetNode.getChildByName('roleNode') || targetNode;
    }

    public clearGeneratedRoleChildren(targetNode: Node | null, keepNode: Node | null) {
        if (!targetNode) {
            return;
        }
        const children = targetNode.children ? targetNode.children.slice() : [];
        children.forEach((child) => {
            if (child === keepNode) {
                return;
            }
            if (child.name !== 'story_body') {
                return;
            }
            child.removeFromParent();
            child.destroy();
        });
    }
}
