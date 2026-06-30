import '../../LegacyGlobals';
//用户金币

export class UserRecord {
    public data: any;

    constructor (userId?: any) {
        this.data = {
            userId: userId,

            apPaid: 0,                      //花费过的体力
            coinPaid: 0,                    //花费过的金币�?

            purchaseMoney: 0,               //充值总额
            purchaseTimes: 0,               //充值次�?
            purchaseMultipleTimes: 0,       //支付转盘次数
            adTimes: 0,                     //广告次数

            buildCount: 0,                  //建造次�?
            fixCount: 0,                    //修复次数
            attackCount: 0,                 //攻击次数
            attackSuccessCount: 0,          //攻击成功次数
            raidCount: 0,                   //偷取次数
            raicCoinsNum: 0,                //偷取总钱�?
            shieldCount: 0,                 //防御次数
            beAttackedCount: 0,             //被攻击次�?
            beRaidCount: 0,                 //被偷取次�?
            beRaidCoinsNum: 0,              //被偷取总钱�?

            taskCompleteCount: 0,           //任务完成次数

        }
    }

    createNew(dbdata) {
        
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

    //设置某项数据
    setData(key, value) {
        this.data[key] = value
    }

    UserId() {
        return this.data.userId
    }

    GetPurchaseMoney() {
        return this.data.purchaseMoney
    }

    GetPurchaseMoneyAvg() {
        return this.data.purchaseMoney / this.data.purchaseTimes
    }

    GetPurchaseCount() {

        if (this.data.purchaseMoney > 20) {
            AppKit.NativeWrap.callAdjustTrackEvent("累计付费大于20美金");
        } else if (this.data.purchaseMoney > 10) {
            AppKit.NativeWrap.callAdjustTrackEvent("累计付费大于10美金");
        } else if (this.data.purchaseMoney > 5) {
            AppKit.NativeWrap.callAdjustTrackEvent("累计付费大于5美金");
        }
        return this.data.purchaseTimes
    }

    AdTimes() {
        return this.data.adTimes
    }
}
