// @ts-nocheck
import * as cc from 'cc';

const { _decorator, CCBoolean, CCString } = cc;
const { ccclass, property, menu } = _decorator;

var DoType = cc.Enum({
    All: 0,
    Sprite: 1,
    Spine: 2,
})

/**
 * 一个批量导入build-spf的工具
 * - [用法] 写入build-name和5个load-name,导入1-5的sp/sp_dam/sp_shadow
 * - [要求] 命名格式为 name1, name1_dam, name1_shadow,部分公用组件不导入
 * - [注意] 成功后请手动删除脚本组件
 */
@ccclass('TLoadBuilding')
@menu("Editor-Tools/TLoadBuilding")
export class TLoadBuilding extends cc.Component {
    @property({tooltip:"建筑物文件夹名称"})
    private build_name = ""

    @property({tooltip:"建筑物最大等级"})
    private buildMaxLevel = 5

    @property({ type: CCString, tooltip:"动画文件名称,后续在完善目前没有需求" })
    private build_anim_name_list = []

    @property({ type:DoType })
    private doType = DoType.Sprite

    @property({ type: CCBoolean })
    private get do() { return false }
    private set do(v: boolean) {
        if (typeof CC_EDITOR !== 'undefined' && CC_EDITOR) this.load_Build()
    }

    private load_Build() {
        //获得levelNode
        this.node.width=this.node.height = 180;
        this.node.scale = 1;
        let ln:cc.Node = this.node.getChildByName("levelNode");
        let lock1:cc.Node=this.node.getChildByName("lockIcon");
        lock1.active = true;
        let lockNode:cc.Node = this.node.getChildByName("lockIcon").getChildByName("mask");
        let lvNode:cc.Node = this.node.getChildByName("lockIcon").getChildByName("lv");
        let lvBg:cc.Node = this.node.getChildByName("lockIcon").getChildByName("bg");
        let pyc = this.node.getComponent(cc.PolygonCollider);
        if(!pyc){
            pyc = this.node.addComponent(cc.PolygonCollider);
            pyc.points = [
                new cc.Vec2(0, 0),
                new cc.Vec2(0, 100),
                new cc.Vec2(100, 100),
                new cc.Vec2(100, 0),
            ];
        }
        pyc.enabled = true;
        let coinBarNode:cc.Node = this.node.getChildByName("coinBar")
        new Promise((res, rej) => {
            let loadResNum = 0;
            let allResNum = 0
            if (this.doType == DoType.All || this.doType == DoType.Sprite) {
                //设置建筑物
                new Array(this.buildMaxLevel).fill(0).forEach((no_use_value, index) => {
                    [
                        `${index + 1}`,
                        `${index + 1}z`,
                    ].forEach(spf_name => {
                        //----spf_name= 1
                        //----spf_name= 1z
                        let uuid = Editor.assetdb.remote.urlToUuid(`db://assets/resources/res/village/buildPrefabs/${this.build_name}/res/${spf_name}.png/${spf_name}`)
                        if (uuid) {
                            allResNum++
                            cc.assetManager.loadAny(uuid, (err, spf: cc.SpriteFrame) => {
                                loadResNum++

                                let hparent = /z/g.test(spf_name)
                                    ? ln.getChildByName(`level${index + 1}`).getChildByName("handle_dam")
                                    : ln.getChildByName(`level${index + 1}`).getChildByName("handle")
                                if (hparent.getChildByName(spf_name) != null) {
                                    hparent.getChildByName(spf_name).getComponent(cc.Sprite).spriteFrame = spf;
                                    hparent.getChildByName(spf_name).getComponent(cc.Sprite).sizeMode = cc.Sprite.SizeMode.RAW;
                                    hparent.getChildByName(spf_name).getComponent(cc.Sprite).trim = false;
                                } else {
                                    let n = new cc.Node(spf_name)
                                    n.addComponent(cc.Sprite).spriteFrame = spf;
                                    n.parent = hparent;
                                    n.getComponent(cc.Sprite).sizeMode = cc.Sprite.SizeMode.RAW;
                                    n.getComponent(cc.Sprite).trim = false;
                                }
                                if (loadResNum == allResNum) {
                                    Editor.log(`${this.build_name} load:over`);
                                    res()
                                }
                            })
                        }
                    })
                })
                //设置云朵
                let uuid = Editor.assetdb.remote.urlToUuid(`db://assets/resources/res/village/texture/lockbuilding.png/lockbuilding`)
                if (uuid) {
                    allResNum++;
                    cc.assetManager.loadAny(uuid, (err, cloundx: cc.SpriteFrame) => {
                        loadResNum++
                        Editor.log("设置云朵:over");
                        lockNode.getComponent(cc.Sprite).spriteFrame = cloundx;
                        lockNode.getComponent(cc.Sprite).sizeMode = cc.Sprite.SizeMode.RAW;
                        lockNode.getComponent(cc.Sprite).trim = false;
                        lockNode.opacity =150;
                    })
                }
                //设置lv
                uuid = Editor.assetdb.remote.urlToUuid(`db://assets/LiveData/PoetsenOne-Regular.ttf`)
                if (uuid) {
                    allResNum++;
                    cc.assetManager.loadAny(uuid, (err, ttf: cc.Font) => {
                        loadResNum++;
                        let lvLab = lvNode.getComponent(cc.Label);
                        let lvlabOut = lvLab.getComponent(cc.LabelOutline);
                        lvNode.y = -20;
                        lvNode.x = 0;
                        lvNode.width=62;
                        lvNode.height=30;
                        lvLab.font = ttf;
                        lvLab.fontSize = 20;
                        lvLab.lineHeight = 30;
                        lvNode.color = new cc.Color(255,255,255,255);
                        //#717DAD
                        if(!lvlabOut){
                            lvlabOut = lvNode.addComponent(cc.LabelOutline);
                        }
                        lvlabOut.color=new cc.Color(113,125,173,255);
                        lvlabOut.width =3;
                        Editor.log("设置文本:over");

                    })
                }
                //设置锁的bg
                uuid = Editor.assetdb.remote.urlToUuid(`db://assets/resources/res/village/texture/lockBG.png/lockBG`)
                if (uuid) {
                    allResNum++;
                    cc.assetManager.loadAny(uuid, (err, sbg: cc.SpriteFrame) => {
                        loadResNum++;
                        lvBg.width=70;
                        lvBg.height=85;
                        lvBg.y = -6.7;
                        lvBg.x = 0;
                        lvBg.getComponent(cc.Sprite).spriteFrame = sbg;
                        lvBg.getComponent(cc.Sprite).sizeMode = cc.Sprite.SizeMode.RAW;
                        lvBg.getComponent(cc.Sprite).trim = false;
                        if (loadResNum == allResNum) {
                            Editor.log("设置锁的bg:over");
                            res()
                        }
                    })
                }
                //
                if(coinBarNode){
                    coinBarNode.active = false;
                }

            }
            if (loadResNum == allResNum) {
                Editor.log(`${this.build_name} load:over`)
                res()
            }
        })
    }

}
