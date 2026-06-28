
//用户道具

class UserItems {

    constructor (userId) {
        this.data = {
            userId: userId,

            items: {},            //道具列表
        }
    }

    //更新数据
    updateData(data) {
        for (var key in data) {
            this.data[key] = data[key]
        }
        return this
    }

    //获得数据
    getData() {
        let data = {}
        for (var key in this.data) {
            data[key] = this.data[key]
        }
        return data
    }

    getItems() {
        return this.data.items
    }

    getNum(itemId) {
        return this.data.items[itemId] || 0
    }

    getContent(itemId) {
        return new Game.Content(Game.Content.Types.Item, itemId, this.getNum(itemId))
    }
    //是否在活动中
    IsActive(StartTime,EndTime) {
        let currentTime = GameKit.TimeUtil.getCurrentTime()
        return (currentTime >= StartTime && currentTime <= EndTime)
    }
    ToolIsActive(id){
        let isAcive=false
        let key="tool_"+id
        if (Object.hasOwnProperty.call(this.getItems(), key)) {
            let end_time=this.getItems()[key]
            // end_time=1639388221
            isAcive=this.IsActive(0,end_time)
        }
        return isAcive
    }
    //获取本地已经激活的活动
    getDymicActiveToolList(){
        const obj=JSON.parse(JSON.stringify(this.getItems()))
        const actives=[]
        for (const key in obj) {
            if (Object.hasOwnProperty.call(obj, key)) {
                let end_time = obj[key];
                if(key.indexOf("tool_")>-1){
                    const toolId=parseInt(key.split("_")[1])
                    // end_time=1639388221
                    const isActive=this.IsActive(0,end_time)
                    if(isActive){
                        let data=null
                        switch(toolId){
                            case 1:
                                data=UserItems.GetToolData(969999,"CoincrazyOpenWindow","Coincrazy","CoincrazyOpenWindow",end_time)
                            break;
                            case 2:
                                data=UserItems.GetToolData(969998,"VillageManiaOpenWindow","VillageMania","VillageManiaOpenWindow",end_time)
                            break;
                            case 3:
                                data=UserItems.GetToolData(969997,"VillageBoomOpenWindow","VillageBoom","VillageBoomOpenWindow",end_time)
                            break;
                            case 4:
                                console.log("气球数据");
                                
                            break;
                            case 5:
                                data=UserItems.GetToolData(969995,"CardsBoomOpenWindow","cardsBoom","CardsBoomOpenWindow",end_time)
                            break;
                            case 6:
                                let para={"image":{"y":11,"x":0},"close":{"y":296,"active":true,"x":277},"button":{"y":-327,"width":312},"labelButton":{"label":{"string":{"en":"ENJOY!","de":"GENIESSEN!","es":"DISFRUTAR!","fr":"PROFITEZ"}},"y":-2.8,"width":220,"height":60},"timer":{"y":-402,"outline":{"color":[132,15,200],"width":2}},"message_shadow":{"y":-56,"width":430,"height":120,"label":{"string":{"en":"<color=#ffffff><outline color=#840fc8 width=3>To get all rewards Complete all levels within the time allotted!</outline></color>","de":"<color=#ffffff><outline color=#840fc8 width=3>To get all rewards Complete all levels within the time allotted!</outline></color>","es":"<color=#ffffff><outline color=#840fc8 width=3>To get all rewards Complete all levels within the time allotted!</outline></color>","fr":"<color=#ffffff><outline color=#840fc8 width=3>To get all rewards Complete all levels within the time allotted!</outline></color>"},"fontSize":36,"maxWidth":430,"lineHeight":40}},"message":{"y":-221,"width":430,"height":150,"label":{"fontSize":40,"maxWidth":430,"lineHeight":50,"string":{"en":"<color=#fff550><outline color=#9e0101 width=3>Win great rewards\nEVEN FASTER !\n</outline></color>","de":"<color=#fff550><outline color=#9e0101 width=3>Win great rewards\nEVEN FASTER !\n</outline></color>","es":"<color=#fff550><outline color=#9e0101 width=3>Win great rewards\nEVEN FASTER !\n</outline></color>","fr":"<color=#fff550><outline color=#9e0101 width=3>Win great rewards\nEVEN FASTER !\n</outline></color>"}}}}
                                data=UserItems.GetToolData(969994,"BetBlast","betBlast","ActivityGameShowWindow",end_time,'bet_bg_blast',para)
                            break;
                        }
                        if(data){
                            actives.push(data)
                        }
                    }
                }
            }
        }
        return actives
    }
}

//1:限时老虎机双倍金币道具（金蛋）  2:限时建造村庄折扣（木槌） 3:限时村庄完成建造奖励(石锤),4:气球活动,5:卡牌加倍 6:老虎机加倍
UserItems.ToolType={
    GoldEgg:1,
    Muchui:2,
    ShiChui:3,
    Balloon:4,
    CardsBoom:5,
    BetBlast:6,

}

UserItems.GetToolData=function(id,name,icon,panel,end_time,image=null,param={}){
    // 1546313047 2019-1-1 11:24:07
    const data={
        description: name,
        enable_trigger: "mapId>0",
        end_time: end_time,
        finish_time: end_time,
        help_key: undefined,
        icon: icon,
        icon_goto: "panel",
        id: id,
        image: image,
        name: name,
        panel: panel,
        param: param,
        prepare_time: 1546313047,
        shop_id: undefined,
        shop_ids: undefined,
        shortName: name,
        start_time: 1546313047,
        subType: 6,
        type: 3,
        dymic:true,
        user_time: null,
    }
    return data
}

window.Game.UserItems = UserItems