import { UIWindow } from '../../GameKit/ui/UIWindow';
import { ScrollViewTool } from '../../GameKit/ui/ScrollViewTool';
import List from '../../GameKit/ui/list/List';
import StoreItem from '../../game/merge/StoreItem';
const { ccclass, property, executeInEditMode } = cc._decorator
/**
 * Store界面
 * - 包含各类按钮的点击事件处理
 * merge时仓库界面
 * @class
 */
@ccclass
class StoreWindow extends UIWindow {

    static windowPath = "Merge/StoreWindow"
    @property(List)
    list = null
    @property(cc.Node)
    listBg = null
    @property(StoreItem)
    storeItemTemplete = null
    // id:-1 为添加格子 -2为空格 -3为锁定格子 >0为合并格子
    storeItems = []
    storeItemGroupSize = 4
    

    onShow(showParams) {
        this.storeItems=[]
        this.tempPutbackMergeData = []
        let metas = Meta.MetaManager.GetMetas(Meta.MetaType.MergeWharehouse)
        // console.log('metas',metas);
        for(let key in metas){
            this.storeItems.push({item:null})
        }
        this.updateStoreItems()
    }
    updateStoreItems(){
        let storeData = Game.SUserMerge.GetStoreData() || {}
        // console.log('storeData',storeData);
        let warehouseCapacity = Game.SUserMerge.GetWarehouseCapacity()
        let maxCount=this.storeItems.length
        // console.log(warehouseCapacity,maxCount);
        
        this.storeItems.forEach((item,index) => {
            if(index<warehouseCapacity){
                this.storeItems[index].item = storeData[index]
            }else if(index==warehouseCapacity&&warehouseCapacity<maxCount){
                this.storeItems[index].item = "add"
            }else{
                this.storeItems[index].item = "unlock"
            }
            
        })
        this.list.numItems = Math.ceil(this.storeItems.length / this.storeItemGroupSize)
        let row=this.list.numItems
        this.listBg.height = row*115
    }



    /** 点击事件：close */
    event_close() {
        if (Game.MergeTutorialManager && Game.MergeTutorialManager.EmitNodeClick) {
            Game.MergeTutorialManager.EmitNodeClick('backpack_close_button')
        }
        this.closeAnim(()=>{
            setTimeout(() => {
                GamePlay.instance.mergeRoot.mergeNodeUI.PlayWaitCreateAnimItems()
            }, 1);
        })
    }

    onItemRender(node, index) {
        let container = node.getChildByName("container")
        if (!container) {
            return
        }
        this.ensureStoreItemCount(container)
        for (let i = 0; i < this.storeItemGroupSize; i++) {
            let itemNode = container.children[i]
            let realIndex = index * this.storeItemGroupSize + i
            this.renderStoreItem(itemNode, realIndex)
        }
        for (let i = this.storeItemGroupSize; i < container.children.length; i++) {
            container.children[i].active = false
            container.children[i].off(cc.Node.EventType.TOUCH_END)
        }
    }

    ensureStoreItemCount(container) {
        while (container.children.length < this.storeItemGroupSize && this.storeItemTemplete && this.storeItemTemplete.node) {
            let itemNode = cc.instantiate(this.storeItemTemplete.node)
            itemNode.parent = container
        }
    }

    renderStoreItem(node, index) {
        if (!node) {
            return
        }
        node.off(cc.Node.EventType.TOUCH_END)
        if (index >= this.storeItems.length) {
            node.active = false
            return
        }

        node.active = true
        let item = node.getComponent(StoreItem)
        if (!item) {
            return
        }
        let addGrid = item.addGrid
        let icon = item.icon
        let hole = item.hole
        let contentModel = item.contentModel
        let itemData = this.storeItems[index].item
        if (contentModel) {
            contentModel.node.active = itemData == "add"
        }
        if (itemData == "add") {
            addGrid.active = true
            icon.node.active = false
            hole.active = false
            let meta = Meta.MetaManager.GetMeta(Meta.MetaType.MergeWharehouse, index + 1)
            if (meta && contentModel) {
                contentModel.show(meta.Price())
            }
        }
        else if (itemData == null) {
            addGrid.active = false
            icon.node.active = false
            hole.active = true
        }
        else if (itemData == "unlock") {
            addGrid.active = false
            icon.node.active = false
            hole.active = false
        } else {
            let arr = itemData.split('_');
            let mergeId = arr[0];
            let envStatus = arr[1];
            let addtionId = arr[2];
            icon.node.active = true
            hole.active = true
            addGrid.active = false
            icon.spriteFrame = GamePlay.instance.mergeRoot.mergeLevelNode.GetSpriteFrameByMergeId(mergeId);
        }
        node.on(cc.Node.EventType.TOUCH_END, () => {
            if (addGrid.active) {
                let meta = Meta.MetaManager.GetMeta(Meta.MetaType.MergeWharehouse, index + 1)
                if (!meta) {
                    return
                }
                let priceContent = meta.Price()
                if (Game.ContentCheck.CheckContent(priceContent)) {
                    let req = SR.SRMerge.UpgradeWarehouse(priceContent)
                    req.SetCallBack(res => {
                        this.updateStoreItems()
                    })
                    req.SetErrorCallBack(() => {
                        this.updateStoreItems()
                    })
                    req.Send()
                }
            } else if (icon.node.active) {
                let emptyPos = GamePlay.instance.mergeRoot.mergeLevelNode.getEmptyTilePos();
                if (emptyPos) {
                    let req = SR.SRMerge.MovePieceFromWarehouseToGrid(index)
                    req.SetCallBack(res => {
                        this.tempPutbackMergeData.push(itemData);
                        let pname = res.cellKey
                        GamePlay.instance.mergeRoot.mergeLevelNode.CreateFromWharehouse(pname, itemData);
                        this.updateStoreItems()
                    })
                    req.Send()
                } else {
                    GameKit.ShakeAnimTool.Shake(icon.node, 3);
                }
            }
            console.log('点击了仓库物品', index);
        })
    }
    update(){
        // this.listBg.height = this.list.content.node.height
        this.listBg.y=this.list.content.node.y
    }
}
