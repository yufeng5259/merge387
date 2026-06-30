import { _decorator, Label, Node } from 'cc';
import { UIWindow } from "../../GameKit/ui/UIWindow";
import { UserInfoModel } from "../UserInfoModel";

import { UserVillage } from '../../game/village/UserVillage';
const { ccclass, property, executeInEditMode } = _decorator
@ccclass('OtherPlayerWindow')
export default class OtherPlayerWindow extends UIWindow{
    static windowPath = "Friends/OtherPlayerWindow"
    userInfo: any = null
    villageInfo: any = null
    enterA: any = null

    @property(UserInfoModel)
    userInfoModel = null

    @property(Node)
    userFb = null
    @property(Label)
    userId = null
    @property(Label)
    userMapId = null
    @property(Node)
    userInfoNode = null
    @property(Node)
    btnClose = null
    onShow(showParams){
        this.userInfo = showParams;
        this.userInfoNode.active =false;
        this.btnClose.active = false;
        this.enterA = this.node.getComponent("EnterCloseAnim");
        if (this.enterA) {
            this.enterA.e_playAwake = false;
        }
        var uid = this.userInfo.UserId()
        var req = SR.SRVillage.getPeopleUserVillage(uid);
        req.SetCallBack((res) => {
            let vil = new UserVillage(uid);
            vil.updateData(res.userVillage);
            this.userInfo.updateData({star: res.star});

            this.showCallBack(vil);
        });
        req.Send();

        this.userInfoModel.show(this.userInfo)
    }
    showCallBack(showParams){
        // console.log(showParams);
        this.villageInfo = showParams;

        this.userMapId.string = this.villageInfo.MapId();

        this.userInfoModel.show(this.userInfo)
        if (this.enterA) {
            this.enterA.e_playAwake = true;
            this.enterA.enterAnim(()=>{
                this.userInfoNode.active = true;
                this.btnClose.active = true;
            })
        } else {
            this.userInfoNode.active = true;
            this.btnClose.active = true;
        }
    }
    close_window(){
        this.closeAnim(()=>{
            // console.log("windowClose");
        })
    }
}
