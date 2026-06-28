
//道具

class Item {

    constructor () {
        this.data = {
            itemId: 0,
        }
    }

    //更新数据
    updateData(data) {
        if (data == null) return
        for (let key in data) {
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

    //设置某项数据
    setData(key, value) {
        this.data[key] = value
        return this
    }
}
//返回6倍活动数据
Item.getBets = function(){
    var x = []
    var a = Game.SUserItems.getItems();
    var meta = Game.ActivityManager.GetActiveActivity(Meta.ActivityMeta.Types.Pay,Meta.ActivityMeta.SubTypes.CongRats)
    if(meta){
        var o = Game.SUserActivity.GetActivityData(meta.Id())
        if(o){
           for (let index = 31; index < 37; index++) {
                const element = a[index];
                if(element){
                    var xx = {}
                    xx[index] = {"count":element,"time":o[index]?o[index]:0,"itemId":index}
                    x.push(xx)
                }
            }
            x.sort((a,b)=>{
                var aa = Object.keys(a)[0]
                var bb = Object.keys(b)[0]
                return bb - aa
            }) 
        }else{
            // console.log("活动数据不存在"+meta.Id())
        }
        
    }else{
        // console.log("活动静态数据不存在")
    }
    return x;
}
Item.getBetsTime = function(){
    return Game.Item.getBets().length>0?Game.Item.getBets()[0]:0
}
window.Game.Item = Item