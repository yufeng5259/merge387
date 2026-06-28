import { _decorator, Component } from 'cc';
const { ccclass, property, executeInEditMode } = _decorator;

@ccclass('ObjectItemT')
export class ObjectItemT {
    @property
    public layerName = '';
    @property
    public objectName = '';
}


@ccclass('AutoTiledmap')
@executeInEditMode
export class AutoTiledmap extends Component {
    @property
    public do;
    @property([ObjectItemT])
    public keyControllers = [];
    @property
    public mapPath;
    @property
    public itemPrefab;

    loadTileMap () {
        // this.tmx=this.node.getComponent(cc.TiledMap) 
        // let layerSize=this.tmx.getMapSize() 
        // let tileSize = this.tmx._tileSize; 
        // let w=layerSize.width*tileSize.width 
        // let h=layerSize.height*tileSize.height 
        // this.tmx.node.width=w 
        // this.tmx.node.height=h 
        // this.tmx.node.x=-this.tmx.node.width/2 
        // this.tmx.node.y=-this.tmx.node.height/2 
        // this.tmx.node.anchorX=0 
        // this.tmx.node.anchorY=0 
        // this.keyControllers.forEach(element => { 
            // let layer=this.tmx.getLayer(element.layerName) 
            // layer.node.removeAllChildren() 
        // }); 
        // this.tmx.node.parent.getChildByName("builds").node.removeAllChildren() 
        // this.keyControllers.forEach(element => { 
            // let buildobjGroup=this.tmx.getObjectGroup(element.objectName) 
            // let objects = buildobjGroup.getObjects(); 
            // let objNode=this.tmx.node.parent.getChildByName("builds") 
            // this.createBuild(buildobjGroup,objNode) 
        // }); 
        // CC_EDITOR && Editor.log("地图数据生成完成") 
    }

    initCoverTree (layer: any, parent: any) {
        // let layerSize=layer._layerSize 
        // let tileSize = this.tmx._tileSize; 
        // for (let i = 0; i < layerSize.width; i++) { 
            // for (let j = 0; j < layerSize.height; j++) { 
                // let index=Math.floor(i)+Math.floor(j)*layerSize.width 
                // let tileGid=layer._tiles[index] 
                // if(tileGid!=0){ 
                    // let lv=this.tmx._tileProperties[tileGid].level 
                    // if(lv<2)continue ///1级地块是默认的 
                    // let nd=cc.instantiate(this.itemPrefab) 
                    // nd.parent=parent 
                    // let pp=layer.getPositionAt(i,j) 
                    // nd.x=pp.x+tileSize.width/2 
                    // nd.y=pp.y 
                    // nd.name="tree_"+index 
                    // nd.zIndex=Math.floor(this.tmx.node.height-nd.y) 
                // } 
            // } 
        // } 
    }

    createBuild (buildobjGroup: any, layer: any) {
        // let objects = buildobjGroup.getObjects(); 
        // let mapSize = this.tmx._mapSize; 
        // let tileSize = this.tmx._tileSize; 
        // objects.forEach(element => { 
            // let nd=cc.instantiate(this.itemPrefab) 
            // nd.parent=layer.node 
            // let posIdxX = element.offset.x / tileSize.width * 2; 
            // let posIdxY = element.offset.y / tileSize.height; 
            // nd.x = tileSize.width / 2 * (mapSize.width + posIdxX - posIdxY); 
            // nd.y = tileSize.height / 2 * (mapSize.height * 2 - posIdxX - posIdxY); 
            // nd.name=element.name?element.name:'obj_'+element.id 
            // CC_EDITOR && Editor.log(nd.name) 
            // nd.zIndex=Math.floor(this.node.height-nd.y) 
        // }); 
    }

}


/**
 * Note: The original script has been commented out, due to the large number of changes in the script, there may be missing in the conversion, you need to convert it manually
 */
// var ObjectItemT = cc.Class({
//     name: 'ObjectItemT',
//     properties: {
//         layerName : "",//放置的层级名称
//         objectName : "",//tilemap的对象名称
//     }
// });
// cc.Class({
//     extends: cc.Component,
//     editor: {
//         executeInEditMode: true,
//     }, 
//     properties: {
//         do: {
//             get () {
//                 return false;
//             },
//             set (value) {
//                 CC_EDITOR && this.loadTileMap()
//             }
//         },
//         keyControllers: {
//             default: [],
//             type: ObjectItemT,
//         },
//         mapPath:{default:'',tooltip:'tmx所在文件夹路径'},
//         itemPrefab:{type:cc.Prefab,default:null,tooltip:'地块'},
//     },
//     loadTileMap(){
//         this.tmx=this.node.getComponent(cc.TiledMap)
// 
//         let layerSize=this.tmx.getMapSize()
//         let tileSize = this.tmx._tileSize;
//         let w=layerSize.width*tileSize.width
//         let h=layerSize.height*tileSize.height
//         this.tmx.node.width=w
//         this.tmx.node.height=h
// 
//         this.tmx.node.x=-this.tmx.node.width/2
//         this.tmx.node.y=-this.tmx.node.height/2
//         this.tmx.node.anchorX=0
//         this.tmx.node.anchorY=0
// 
//         this.keyControllers.forEach(element => {
//             let layer=this.tmx.getLayer(element.layerName)
//             layer.node.removeAllChildren()
//         });
//         //删除子对象
//         this.tmx.node.parent.getChildByName("builds").node.removeAllChildren()
// 
//         this.keyControllers.forEach(element => {
//             let buildobjGroup=this.tmx.getObjectGroup(element.objectName)
//             let objects = buildobjGroup.getObjects();
//             let objNode=this.tmx.node.parent.getChildByName("builds")
//             this.createBuild(buildobjGroup,objNode)
//         });
//         //this.initCoverTree(this.tmx.getLayer('builds'),this.tmx.getLayer('builds').node)
//         CC_EDITOR && Editor.log("地图数据生成完成")
//     },
//     initCoverTree(layer,parent){
//         let layerSize=layer._layerSize
//         let tileSize = this.tmx._tileSize;
//         for (let i = 0; i < layerSize.width; i++) {
//             for (let j = 0; j < layerSize.height; j++) {
//                 let index=Math.floor(i)+Math.floor(j)*layerSize.width
//                 let tileGid=layer._tiles[index]
//                 if(tileGid!=0){
//                     let lv=this.tmx._tileProperties[tileGid].level
//                     if(lv<2)continue ///1级地块是默认的
//                     // Editor.log(lv,i,j);
//                     // this.coverMap[i+"_"+j]={col:i,row:j,index:index,gid:tileGid,lv:this.tmx._tileProperties[tileGid].level}
//                     let nd=cc.instantiate(this.itemPrefab)
//                     nd.parent=parent
//                     let pp=layer.getPositionAt(i,j)
//                     nd.x=pp.x+tileSize.width/2
//                     nd.y=pp.y
//                     nd.name="tree_"+index
//                     nd.zIndex=Math.floor(this.tmx.node.height-nd.y)
//                     //nd.getChildByName("sp").getComponent(cc.Sprite).spriteFrame=this.treeAssetFrame
//                 }
//             }
//         }
//     },
//     //创建建筑物
//     createBuild(buildobjGroup,layer){
//         let objects = buildobjGroup.getObjects();
//         let mapSize = this.tmx._mapSize;
//         let tileSize = this.tmx._tileSize;
//         objects.forEach(element => {
//             let nd=cc.instantiate(this.itemPrefab)
//             nd.parent=layer.node
// 
//             let posIdxX = element.offset.x / tileSize.width * 2;
//             let posIdxY = element.offset.y / tileSize.height;
//             nd.x = tileSize.width / 2 * (mapSize.width + posIdxX - posIdxY);
//             nd.y = tileSize.height / 2 * (mapSize.height * 2 - posIdxX - posIdxY);
//             nd.name=element.name?element.name:'obj_'+element.id
//             CC_EDITOR && Editor.log(nd.name)
//             nd.zIndex=Math.floor(this.node.height-nd.y)
//         });
//     },
// });
