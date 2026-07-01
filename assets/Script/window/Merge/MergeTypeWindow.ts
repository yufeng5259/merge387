import { _decorator, instantiate, Label, Layout, Node, NodePool, ScrollView, UITransform, view, Widget } from 'cc';
import { UIWindow } from '../../GameKit/ui/UIWindow';
import { ScrollViewTool } from '../../GameKit/ui/ScrollViewTool';
import List from '../../GameKit/ui/list/List';
import StoreItem from '../../game/merge/StoreItem';
const { ccclass, property, executeInEditMode } = _decorator


let MergeItemType = {
    BASE: "base",//基础物品
    CAN_GENERATE: "can_generate",//可生成物品
    CAN_BUILD: "can_build",//可制作物品
    GENERATE_FROM: "generate_from",//产自from物品
    ADDITIONAL: "additional",//额外奖励物品
}
/**
 * Store界面
 * - 包含各类按钮的点击事件处理
 * merge时仓库界面
 * @class
 */
@ccclass
class MergeTypeWindow extends UIWindow {

    static windowPath = "Merge/MergeTypeWindow"
    @property(ScrollView)
    baseScrollView=null
    @property(Label)
    nameLabel = null
    /**type列表 */
    @property(Node)
    layoutbase = null
    /**产自from列表 */
    @property(Node)
    layoutfrom = null
    /**可生成列表 */
    @property(Node)
    layoutcangenerate = null
    /**可制作列表 */
    @property(Node)
    layoutcanbuild = null
    /**下一等级额外产出物品列表 */
    @property(Node)
    layoutadditional = null
    /**复制节点 */
    @property(Node)
    baseNodeItem = null
    baseItemNodePool = new NodePool()
    mergeId: any = null

    onLoad() {
        this.baseItemNodePool=new NodePool();
        
        let baseContent=GameKit.ControllerTable.GetNode(this.layoutbase, "content")
        while(baseContent.children.length>0){
            let child=baseContent.children[0];
            this.putBaseItemNode(child);
        }
    }

    onShow(showParams) {
        this.baseItemNodePool=new NodePool();
        let mergeId=showParams.mergeId;
        this.mergeId=mergeId;
        //当前选中物品meta
        let meta=Meta.MetaManager.GetMeta(Meta.MetaType.MergeElements,mergeId);
        this.nameLabel.string=meta.Name();
        //当前选中物品所属类型meta
        let typeMeta=Meta.MetaManager.GetMeta(Meta.MetaType.MergeType,meta.Type());
        //当前选中物品的产出数据meta，可能没有，没有则不显示产出layout
        let generateMeta=Meta.MergeGeneraterMeta.GetGenerateByMergeId(mergeId);
        // console.log(typeMeta,"typeMeta");
        //全部物品
        this.initBaseLayout(typeMeta,mergeId,2);
        //可产生物品，可以产生则显示，否则隐藏
        this.initlayoutcangenerate(generateMeta,3);
        //产自from列表
        this.initlayoutfrom(mergeId,typeMeta,generateMeta,3);
        //可制作物品
        this.initlayoutcanbuild(mergeId,3);
        //额外奖励
        this.initlayoutadditional(generateMeta,3);
    }
    /**初始化基础物品布局
     * 不显示隐藏，全部显示
     */
    initBaseLayout(typeMeta,mergeId,showBgIndex=2) {
        let baseContent=GameKit.ControllerTable.GetNode(this.layoutbase, "content")
        let titleLabel=GameKit.ControllerTable.GetComponent(this.layoutbase, "title",Label);
        // 先清理旧的节点
        while(baseContent.children.length>0){
            let child=baseContent.children[0];
            this.putBaseItemNode(child);
        }
        
        let levels = typeMeta.Levels();
        let levelsLength = levels.length;
        if(levelsLength===0){
            this.layoutbase.active=false;
            return;
        }
        this.layoutbase.active=true;

        let sid=mergeId;
        let selectIndex=levels.indexOf(sid);
        titleLabel.string=`第${selectIndex+1}级`

        // console.log(levels,"levels");
        // console.log("levelsLength:", levelsLength, "实际数据条数:", levels.length);
        
        this.createItemsBatch(levels, selectIndex, baseContent,10,5,true,null,showBgIndex, MergeItemType.BASE);
    }
    /**初始化可产生物品布局
     * 如果generateMeta没有值，则不显示可产生物品layout
     * 如果generateMeta有值，则显示可产生物品layout
     */
    initlayoutcangenerate(generateMeta,showBgIndex){
        // console.log(generateMeta,"generateMeta");
       if(!generateMeta){
          this.layoutcangenerate.active=false;
          return;
       }  

       let baseContent=GameKit.ControllerTable.GetNode(this.layoutcangenerate, "content")
        let titleLabel=GameKit.ControllerTable.GetComponent(this.layoutcangenerate, "title",Label);
        // 先清理旧的节点
        while(baseContent.children.length>0){
            let child=baseContent.children[0]
            this.putBaseItemNode(child);
        }
        // 构建每个产出物品的概率映射，用于显示百分比
        let outputArr = generateMeta.Output();
        let perMap = {};
        for(let i = 0; i < outputArr.length; i++){
            let item = outputArr[i];
            if(!item) continue;
            let parts = item.split('-');
            if(parts.length === 2){
                let itemId = parseInt(parts[0]);
                let probability = parseFloat(parts[1]);
                if(!isNaN(itemId) && !isNaN(probability)){
                    if(!perMap[itemId]){
                        perMap[itemId] = 0;
                    }
                    perMap[itemId] += probability;
                }
            }
        }
        // titleLabel.string=`可生成${outputIds.length}个物品`
       this.layoutcangenerate.active=true;
       let outputIds=Meta.MergeGeneraterMeta.GetOutputIdsByMergeId(generateMeta.MergeId());
       if(outputIds.length===0){
        this.layoutcangenerate.active=false;
        return;
       }
    //    console.log(outputIds,"outputIds");
       this.createItemsBatch(outputIds, 0, baseContent,10,5,false,perMap,showBgIndex, MergeItemType.CAN_GENERATE);
    }
    /**
     * 初始化可制作物品布局。
     * 数据来自 MergeCookingRecipe 表，当前棋子作为 toolId，展示所有配方产出物 ResultId。
     */
    initlayoutcanbuild(mergeId,showBgIndex){
        if(!this.layoutcanbuild){
            return;
        }
        let baseContent=GameKit.ControllerTable.GetNode(this.layoutcanbuild, "content")
        let titleLabel=GameKit.ControllerTable.GetComponent(this.layoutcanbuild, "title",Label);
        // 先清理旧的节点
        while(baseContent.children.length>0){
            let child=baseContent.children[0];
            this.putBaseItemNode(child);
        }

        if(!Meta.MergeCookingRecipeMeta){
            this.layoutcanbuild.active=false;
            return;
        }

        let recipes=Meta.MergeCookingRecipeMeta.GetRecipesByToolId(mergeId) || [];
        if(recipes.length===0){
            this.layoutcanbuild.active=false;
            return;
        }

        let resultIds=[];
        for(let i=0;i<recipes.length;i++){
            let resultId=recipes[i].ResultId();
            if(resultId && !resultIds.includes(resultId)){
                resultIds.push(resultId);
            }
        }

        if(resultIds.length===0){
            this.layoutcanbuild.active=false;
            return;
        }

        this.layoutcanbuild.active=true;
        this.createItemsBatch(resultIds, 0, baseContent,10,5,false,null,showBgIndex, MergeItemType.CAN_BUILD);
    }
    /**
     * 首先是当前物品是能产出的
     * 下一等级也能产出
     * 用当前物品的产出和下一等级物品的产出作比较，找出差异的物品去显示
     * 
     */
    initlayoutadditional(generateMeta,showBgIndex){
        if(!generateMeta){
            this.layoutadditional.active=false;
            return;
        }
        this.layoutadditional.active=true;
        let baseContent=GameKit.ControllerTable.GetNode(this.layoutadditional, "content")
        let titleLabel=GameKit.ControllerTable.GetComponent(this.layoutadditional, "title",Label);
        // 先清理旧的节点
        while(baseContent.children.length>0){
            let child=baseContent.children[0];
            this.putBaseItemNode(child);
        }
        let additionOutputIds=generateMeta.NextAdditionOutput();
        // console.log(additionOutputIds,"additionOutputIds");
        if(additionOutputIds.length===0){
            this.layoutadditional.active=false;
            return;
        }
        this.createItemsBatch(additionOutputIds, 0, baseContent, 10, 5, false, null, showBgIndex, MergeItemType.ADDITIONAL);

    }
    /**
     * 根据自身mergeId去generateMeta中遍历查找哪些物品能产出自身
     * 根据找到的物品去显示layoutfrom
     * @param {*}  
     */
    initlayoutfrom(mergeId,typeMeta,generateMeta,showBgIndex){
        let baseContent=GameKit.ControllerTable.GetNode(this.layoutfrom, "content")
        let titleLabel=GameKit.ControllerTable.GetComponent(this.layoutfrom, "title",Label);
        // 先清理旧的节点
        while(baseContent.children.length>0){
            let child=baseContent.children[0];
            this.putBaseItemNode(child);
        }
        
        // let generateMeta=Meta.MergeGeneraterMeta.GetGenerateByMergeId(mergeId);
        // let nextAdditionOutput=generateMeta.NextAdditionOutput();
        let gids = (Meta.MergeGeneraterMeta.GetAllMetaIdsByMergeId(mergeId) || []).slice();
        let levels = typeMeta.Levels();
        let mergeIdx = levels.indexOf(mergeId);
        if (mergeIdx > 0) {
            for (let i = 0; i < mergeIdx; i++) {
                let prevMergeId = levels[i];
                let gids1=Meta.MergeGeneraterMeta.GetAllMetaIdsByMergeId(prevMergeId);
                for(let j=0;j<gids1.length;j++){
                    let gid=gids1[j];
                    if(!gids.includes(gid)){
                        gids.push(gid);
                    }
                }
            }
        }
        let obtainedGids = gids.filter(id => this.hasGotMergeItem(id));
        let showGid = this.getHighestLevelMergeId(obtainedGids.length > 0 ? obtainedGids : gids);
        gids = showGid != null ? [showGid] : [];
        if(!gids||gids.length===0){
            this.layoutfrom.active=false;
            return;
        }
        // titleLabel.string=`产自${gids.length}个物品`
        // console.log(gids,"gids");
        this.createItemsBatch(gids, 0, baseContent,10,5,false,null,showBgIndex, MergeItemType.GENERATE_FROM);
        

    }
    
    /**
     * 批量创建节点，支持分帧加载优化
     * @param {Array} items - 要创建的数据数组
     * @param {Number} selectIndex - 选中的索引
     * @param {Node} baseContent - 父容器节点
     * @param {Number} threshold - 直接创建的阈值，默认10
     * @param {Number} batchSize - 每帧创建的节点数，默认5
     */
    createItemsBatch(items, selectIndex, baseContent, threshold = 10, batchSize = 5,needShowSelect=true,perMap=null,showBgIndex, listType = null) {
        let itemsLength = items.length;
        
        // 如果节点数量较少，直接创建
        if(itemsLength <= threshold) {
            // console.log("使用直接创建模式，数量:", itemsLength);
            for(let i=0; i<itemsLength; i++){
                this.createItemNode(items[i], i, selectIndex, baseContent,needShowSelect,perMap,showBgIndex, listType, i === itemsLength - 1);
            }
            // 延迟更新布局，避免卡顿
            this.scheduleOnce(() => {
                baseContent.getComponent(Layout).updateLayout();
                this.updateBaseScrollViewHeight(baseContent);
                // console.log(baseContent.children.length,"baseContent.children.length");
            }, 0);
        } else {
            // 节点数量较多时，使用分帧加载
            // console.log("使用分帧加载模式，总数量:", itemsLength);
            let currentIndex = 0;
            let createNextBatch = () => {
                let createdInThisBatch = 0;
                for(let i=0; i<batchSize && currentIndex<itemsLength; i++){
                    this.createItemNode(items[currentIndex], currentIndex, selectIndex, baseContent,needShowSelect,perMap,showBgIndex, listType, currentIndex === itemsLength - 1);
                    // node.getComponent(MergeItem).init(items[currentIndex]);
                    currentIndex++;
                    createdInThisBatch++;
                }
                // console.log(`批次创建完成: 当前索引=${currentIndex}, 本批创建=${createdInThisBatch}, 总数量=${itemsLength}`);
                
                if(currentIndex < itemsLength) {
                    // 继续创建下一批，使用scheduleOnce并绑定this确保能继续执行
                    let nextBatch = createNextBatch.bind(this);
                    this.scheduleOnce(nextBatch, 0);
                } else {
                    // 所有节点创建完成，更新布局
                    // console.log("所有节点创建完成，当前索引:", currentIndex, "总数量:", itemsLength);
                    this.scheduleOnce(() => {
                        baseContent.getComponent(Layout).updateLayout();
                        this.updateBaseScrollViewHeight(baseContent);
                        // console.log(baseContent.children.length,"baseContent.children.length");
                    }, 0);
                }
            };
            createNextBatch();
        }
    }

    updateBaseScrollViewHeight(baseContent) {
        if(baseContent){
            let innerLayout = baseContent.getComponent(Layout);
            if(innerLayout){
                this.updateSingleRowBaseContentPadding(baseContent, innerLayout);
                innerLayout.updateLayout();
            }
            let sectionLayout = baseContent.parent && baseContent.parent.getComponent(Layout);
            if(sectionLayout){
                sectionLayout.updateLayout();
            }
        }
        if(!this.baseScrollView || !this.baseScrollView.node || !this.baseScrollView.content){
            return;
        }
        let scrollContent = this.baseScrollView.content;
        let contentLayout = scrollContent.getComponent(Layout);
        if(contentLayout){
            contentLayout.updateLayout();
        }

        let scrollNode = this.baseScrollView.node;
        let viewNode = scrollNode.getChildByName("view");
        let bgNode = scrollNode.getChildByName("bg");
        let screenHeight = UIRoot.instance && UIRoot.instance.winSize ? UIRoot.instance.winSize.height : view.getVisibleSize().height;
        let maxHeight = Math.max(0, screenHeight - 160);
        let scrollContentTransform = scrollContent.getComponent(UITransform);
        let scrollContentHeight = scrollContentTransform ? scrollContentTransform.height : 0;
        let scrollHeight = Math.min(scrollContentHeight + 100, maxHeight);

        let scrollTransform = scrollNode.getComponent(UITransform)
        scrollTransform.height = scrollHeight;
        scrollNode.setPosition(scrollNode.position.x, (scrollTransform.anchorY - 0.5) * scrollHeight - 40, scrollNode.position.z);
        if(viewNode){
            let viewWidget = viewNode.getComponent(Widget);
            if(viewWidget){
                viewWidget.updateAlignment();
            }
        }
        if(bgNode){
            let bgTransform = bgNode.getComponent(UITransform)
            bgTransform.height = scrollHeight;
            bgNode.setPosition(bgNode.position.x, (bgTransform.anchorY - scrollTransform.anchorY) * scrollHeight, bgNode.position.z);
        }
    }

    updateSingleRowBaseContentPadding(baseContent, innerLayout) {
        if(!baseContent || !innerLayout || !baseContent.children){
            return;
        }
        if(innerLayout._mergeTypeOriginPaddingLeft === undefined){
            innerLayout._mergeTypeOriginPaddingLeft = innerLayout.paddingLeft;
        }

        let originPaddingLeft = innerLayout._mergeTypeOriginPaddingLeft || 0;
        innerLayout.paddingLeft = originPaddingLeft;

        let children = baseContent.children.filter(child => child && child.active);
        if(children.length === 0){
            return;
        }

        let firstChild = children[0];
        let itemWidth = firstChild.getComponent(UITransform).width * Math.abs(firstChild.scale.x || 1);
        if(itemWidth <= 0){
            return;
        }

        let paddingRight = innerLayout.paddingRight || 0;
        let spacingX = innerLayout.spacingX || 0;
        let availableWidth = baseContent.getComponent(UITransform).width - originPaddingLeft - paddingRight;
        let maxCountInRow = Math.max(1, Math.floor((availableWidth + spacingX) / (itemWidth + spacingX)));
        if(children.length > maxCountInRow){
            return;
        }

        let rowWidth = 0;
        children.forEach((child, index) => {
            rowWidth += child.getComponent(UITransform).width * Math.abs(child.scale.x || 1);
            if(index > 0){
                rowWidth += spacingX;
            }
        });

        innerLayout.paddingLeft = originPaddingLeft + Math.max(0, (availableWidth - rowWidth) / 2);
    }
    
    createItemNode(id,index,selectIndex,parent,needShowSelect=true,perMap=null,showBgIndex=2, listType = null, isLast = false) {
        let node=this.getBaseItemNode();
        node.parent=parent;
        // 记录来源类型，供后续逻辑/事件使用
        node._mergeItemType = listType;
        let hasGotItem = this.hasGotMergeItem(id);
        let meta=Meta.MetaManager.GetMeta(Meta.MetaType.MergeElements,id);
        // console.log(meta,"meta",id);
        
        let rewardNode=GameKit.ControllerTable.GetNode(node, "reward");
        let content=Game.Content.FromString(Game.Content.Types.MergeIcon+"=+"+id+"=1");
        let contentParams: any={
            
        }
        if(listType == MergeItemType.GENERATE_FROM){
            contentParams.infoBtnParams={
                canTouch:true,
                showInfoBtn:true,
                callback:()=>{
                    console.log("点击了物品",id);
                }
            }
        }else{
            contentParams.infoBtnParams={
                canTouch:false,
                showInfoBtn:false,
            }
        }
        if(listType == MergeItemType.CAN_BUILD){
            contentParams.infoBtnParams={
                canTouch:true,
                showInfoBtn:true,
                callback:()=>{
                    this.openCookingRecipeWindow(id);
                }
            }
            contentParams.iconParams={
                onlyCallback:true,
                callback:()=>{
                    this.openCookingRecipeWindow(id);
                }
            }
        }
        rewardNode.active = hasGotItem;
        if(hasGotItem){
            rewardNode.getComponent("ContentModel").show(content,contentParams);
        }
        let bg1=GameKit.ControllerTable.GetNode(node, "bg1");
        let bg2=GameKit.ControllerTable.GetNode(node, "bg2");
        let bg3=GameKit.ControllerTable.GetNode(node, "bg3");
        let icon_up=GameKit.ControllerTable.GetNode(node, "icon_up");
        if(icon_up){
            icon_up.active = listType == MergeItemType.ADDITIONAL && rewardNode.active;
        }
        let countNode=GameKit.ControllerTable.GetNode(node, "countNode");
        let countLabel=GameKit.ControllerTable.GetNode(node, "countLabel").getComponent(Label);
        bg1.active=bg2.active=bg3.active=false;
        let realBgIndex = hasGotItem ? showBgIndex : 1;
        let bgNode=GameKit.ControllerTable.GetNode(node, "bg"+realBgIndex);
        bgNode.active=true;
        let itemCount = this.getMergeLevelItemCount(id);
        countNode.active = itemCount > 0;
        countLabel.string = itemCount.toString();
        let arrow=GameKit.ControllerTable.GetNode(bgNode, "arrow");
        if(arrow){
            if(listType == MergeItemType.BASE){
                // base 组：最后一个隐藏 arrow，其余显示
                arrow.active = !isLast;
            }else{
                arrow.active=false;
            }
        }
        
        
        let rectFrame=GameKit.ControllerTable.GetNode(node,"rectFrame");
        // console.log(needShowSelect,"needShowSelect",selectIndex,"selectIndex");
        
        if(needShowSelect){
            rectFrame.active=index==selectIndex;
        }else{
            rectFrame.active=false;
        }

        let helpNode=GameKit.ControllerTable.GetNode(node,"help");
        let perLabel=GameKit.ControllerTable.GetComponent(node,"per_Label",Label);//百分比标签
        // if(index<=selectIndex){
        //     icon.node.active=true;
        //     helpNode.active=false
        // }else{
        //     icon.node.active=false;
        //     helpNode.active=false;
        // }
        // icon.node.active=true;
        helpNode.active=false

        // 处理百分比显示：有概率则显示百分比，没有则隐藏
        if(perLabel){
            if(perMap && perMap[id] != null){
                perLabel.node.active = true;
                // 配置中一般是0-1的小数，这里转成百分比
                let percent = perMap[id] * 100;
                perLabel.string = `${percent.toFixed(1)}%`;
            }else{
                perLabel.node.active = false;
            }
        }
        
    }

    hasGotMergeItem(id) {
        if(!Game.SUserMerge || !Game.SUserMerge.Data){
            return false;
        }
        let data = Game.SUserMerge.Data();
        let items = data && data.obtainedPieces ? data.obtainedPieces : [];
        return items.indexOf(id) !== -1 || items.indexOf(id.toString()) !== -1;
    }

    getHighestLevelMergeId(ids) {
        if(!ids || ids.length === 0){
            return null;
        }

        let bestId = ids[0];
        let bestLevel = -1;
        for(let i = 0; i < ids.length; i++){
            let id = ids[i];
            let meta = Meta.MetaManager.GetMeta(Meta.MetaType.MergeElements, id);
            if(!meta){
                continue;
            }
            let typeMeta = Meta.MetaManager.GetMeta(Meta.MetaType.MergeType, meta.Type());
            let levels = typeMeta ? typeMeta.Levels() : [];
            let level = levels.indexOf(id);
            if(level > bestLevel){
                bestLevel = level;
                bestId = id;
            }
        }
        return bestId;
    }

    getMergeLevelItemCount(id) {
        let mergeRoot = GamePlay.instance && GamePlay.instance.mergeRoot;
        let mergeLevelNode = mergeRoot && mergeRoot.mergeLevelNode;
        let count = 0;
        if(mergeLevelNode && mergeLevelNode.node){
            mergeLevelNode.node.children.forEach(child => {
                let mergeItem = child.getComponent("MergeItem");
                if(mergeItem && mergeItem.GetMergeId && mergeItem.GetMergeId() == id && mergeItem.IfCanMerge && mergeItem.IfCanMerge()&&!mergeItem.IsHalfSand()){
                    count++;
                }
            });
        }
        count += this.getStoreMergeItemCount(id);
        return count;
    }

    getStoreMergeItemCount(id) {
        if(!Game.SUserMerge || !Game.SUserMerge.GetStoreData){
            return 0;
        }
        let storeData = Game.SUserMerge.GetStoreData() || {};
        let count = 0;
        for(let key in storeData){
            let itemData = storeData[key];
            let itemId = this.parseMergeDataId(itemData);
            if(itemId == id){
                count++;
            }
        }
        return count;
    }

    parseMergeDataId(dataStr) {
        if(!dataStr || typeof dataStr !== "string"){
            return null;
        }
        let baseData = dataStr.split("=")[0];
        let arr = baseData.split("_");
        return parseInt(arr[0], 10);
    }

    onClickClose() {
        this.closeAnim()
    }

    openCookingRecipeWindow(resultId) {
        UIRoot.instance.openChildWindow("MergeCookingRecipeWindow", {
            resultId: resultId,
            toolId: this.mergeId,
            sourceWindow: this
        })
    }

    /**从对象池获取基础物品节点 */
    getBaseItemNode() {
        if(this.baseItemNodePool.size()>0){
            return this.baseItemNodePool.get();
        }
        return instantiate(this.baseNodeItem);
    }
    /**将基础物品节点放回对象池 */
    putBaseItemNode(node) {
        this.baseItemNodePool.put(node);
        // console.log(this.baseItemNodePool.size(),"baseItemNodePool");
        
    }
}
