import { _decorator, Component, SpriteFrame } from 'cc';
const { ccclass, property, executeInEditMode } = _decorator;

@ccclass('ObjectItem')
export class ObjectItem {
    @property
    public layerName = '';
    @property
    public objectName = '';
    @property
    public tileSetName = 0;
}


@ccclass('AutoLoadTiledmap')
@executeInEditMode
export class AutoLoadTiledmap extends Component {
    @property
    public do;
    @property([ObjectItem])
    public keyControllers = [];
    @property
    public mapPath;
    @property
    public itemPrefab;
    @property
    public treeAssetFrame;
    @property
    public raidTargetPrefab;
    @property
    public attackTargetPrefab;
    @property(SpriteFrame)
    public brokenCell = null;

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
        // this.keyControllers.forEach(element => { 
            // let layer=this.tmx.getLayer(element.layerName) 
            // let buildobjGroup=this.tmx.getObjectGroup(element.objectName) 
            // let objects = buildobjGroup.getObjects(); 
            // Editor.log(element.layerName+element.tileSetName) 
            // this.createTree(buildobjGroup,layer,element.tileSetName) 
        // }); 
        // this.townNode=this.node.parent.getComponent("TownNode") 
        // if(!this.townNode){ 
            // Editor.log("TownNode不存在") 
            // return 
        // } 
        // this.townNode.itemPrefab=this.itemPrefab 
        // this.townNode.raidTargets=[] 
        // this.townNode.attackTargets=[] 
        // this.townNode.fixButtons=[] 
        // let buttonLayer=null 
        // if(this.tmx.node.getChildByName("buttonLayer")){ 
            // buttonLayer=this.tmx.node.getChildByName("buttonLayer") 
        // }else{ 
            // buttonLayer=new cc.Node() 
            // buttonLayer.name="buttonLayer" 
            // buttonLayer.anchorX=0 
            // buttonLayer.anchorY=0 
            // buttonLayer.parent=this.tmx.node 
        // } 
        // buttonLayer.removeAllChildren() 
        // this.initRaidTargets(buttonLayer) 
        // this.initAttackTargets(buttonLayer) 
        // this.initCoverTree(this.tmx.getLayer('cover'),this.tmx.getLayer('build').node) 
        // this.townNode.brokenCell=this.brokenCell 
        // Editor.log("地图数据生成完成") 
    }

    initRaidTargets (parent: any) {
        // let count=4 
        // for (let index = 0; index <count; index++) { 
            // let nd=cc.instantiate(this.raidTargetPrefab) 
            // nd.name='raidTarget'+(index+1) 
            // nd.parent=parent 
            // let eventHandler=new cc.Component.EventHandler() 
            // eventHandler.target=this.townNode.node 
            // eventHandler.component='TownNode' 
            // eventHandler.handler='onClickRaid' 
            // eventHandler.customEventData=(index+1) 
            // nd.getComponent(cc.Button).clickEvents[0]=eventHandler 
            // nd.x=this.tmx.node.width/2 
            // nd.y=this.tmx.node.height/2 
            // this.townNode.raidTargets.push(nd) 
            // nd.active=false 
        // } 
    }

    initAttackTargets (parent: any) {
        // let count=5 
        // for (let index = 0; index <count; index++) { 
            // let nd=cc.instantiate(this.attackTargetPrefab) 
            // nd.name='attackTarget'+(index+1) 
            // nd.parent=parent 
            // let eventHandler=new cc.Component.EventHandler() 
            // eventHandler.target=this.townNode.node 
            // eventHandler.component='TownNode' 
            // eventHandler.handler='onClickAttack' 
            // eventHandler.customEventData=(index+1) 
            // nd.getComponent(cc.Button).clickEvents[0]=eventHandler 
            // nd.x=this.tmx.node.width/2 
            // nd.y=this.tmx.node.height/2 
            // this.townNode.attackTargets.push(nd) 
            // nd.active=false 
        // } 
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
                    // nd.getChildByName("sp").getComponent(cc.Sprite).spriteFrame=this.treeAssetFrame 
                // } 
            // } 
        // } 
    }

    getTilesetURL (array: any, tilesetGID: any) {
        // for (let index = 0; index < array.length; index++) { 
            // const element = array[index]; 
            // if(element.getAttribute('id')==tilesetGID){ 
                // return element.getElementsByTagName('image')[0].getAttribute('source') 
            // } 
        // } 
        // return null 
    }

    createTile (layer: any, parent: any, tileSetName: any) {
        // parent.removeAllChildren() 
        // let layerSize=layer._layerSize 
        // let tileSize = layer._mapTileSize; 
        // Editor.log(JSON.stringify(layer._texGrids)) 
        // Editor.log(layer._tileset.firstGid); 
        // for (let i = 0; i < layerSize.width; i++) { 
            // for (let j = 0; j < layerSize.height; j++) { 
                // let index=Math.floor(i)+Math.floor(j)*layerSize.width 
                // let tileGid=layer._tiles[index] 
                // if(tileGid!=0){ 
                    // let gid=tileGid-layer._tileset.firstGid 
                    // let texGrid=layer._textures[gid] 
                    // let tex = new cc.SpriteFrame(layer._texture, cc.rect(texGrid.x, texGrid.y, texGrid.width, texGrid.height)); 
                    // let nd=cc.instantiate(this.itemPrefab) 
                    // nd.parent=parent 
                    // let pp=layer.getPositionAt(i,j) 
                    // nd.x=pp.x+tileSize.width/2 
                    // nd.y=pp.y 
                    // nd.name=layer._layerName+"_"+index 
                    // nd.zIndex=Math.floor(this.tmx.node.height-nd.y) 
                    // nd.getChildByName("sp").getComponent(cc.Sprite).spriteFrame=tex 
                // } 
            // } 
        // } 
    }

    createTree (buildobjGroup: any, layer: any, tileSetName: any) {
        // let objects = buildobjGroup.getObjects(); 
        // let mapSize = this.tmx._mapSize; 
        // let tileSize = this.tmx._tileSize; 
        // let mapInfo=buildobjGroup._mapInfo 
        // let tileSet=mapInfo._tilesets.find((n)=>n.name==tileSetName) 
        // let firstGid=tileSet?tileSet.firstGid:0 
        // let xmlStr=mapInfo._tsxMap[tileSetName+'.tsx'] 
        // let xmlParser = new cc.SAXParser(); 
        // let selTilesetXML = xmlParser._parseXML(xmlStr); 
        // let tiles = selTilesetXML.getElementsByTagName('tile'); 
        // objects.forEach(element => { 
            // let nd=cc.instantiate(this.itemPrefab) 
            // nd.parent=layer.node 
            // let posIdxX = element.offset.x / tileSize.width * 2; 
            // let posIdxY = element.offset.y / tileSize.height; 
            // nd.x = tileSize.width / 2 * (mapSize.width + posIdxX - posIdxY); 
            // nd.y = tileSize.height / 2 * (mapSize.height * 2 - posIdxX - posIdxY); 
            // nd.name=element.name?element.name:'obj_'+element.id 
            // Editor.log(nd.name) 
            // nd.zIndex=Math.floor(this.node.height-nd.y) 
            // if(tileSetName!=""){ 
                // let tilesetGID=element.gid-firstGid 
                // let tileURL=this.getTilesetURL(tiles,tilesetGID) 
                // if(!tileURL)return 
                // let infos=tileURL.split('/') 
                // let resName=infos[infos.length-1].split('.')[0] 
                // let url=`${this.mapPath}/${tileSetName}/${resName}.png/${resName}` 
                // Editor.log(url) 
                // let uuid=Editor.remote.assetdb.urlToUuid(url) 
                // cc.assetManager.loadAny({ type: "uuid", uuid: uuid }, function(err, spriteFrame){ 
                    // if (err) { 
                        // cc.error(err.message || err); 
                        // return; 
                    // } 
                    // this.getChildByName("sp").getComponent(cc.Sprite).spriteFrame=spriteFrame 
                // }.bind(nd)); 
            // }else{ 
                // let tilePos=this.openglToTile(nd.position) 
            // } 
        // }); 
    }

    createElement (parent: any) {
        // let nd=cc.instantiate(this.itemPrefab) 
        // nd.parent=parent 
        // let posIdxX = element.offset.x / tileSize.width * 2; 
        // let posIdxY = element.offset.y / tileSize.height; 
        // nd.x = tileSize.width / 2 * (mapSize.width + posIdxX - posIdxY); 
        // nd.y = tileSize.height / 2 * (mapSize.height * 2 - posIdxX - posIdxY); 
        // nd.name=element.id 
        // nd.zIndex=Math.floor(this.node.height-nd.y) 
    }

    tileToOpengl (point: any) {
        // let mapSize = this.tmx.getMapSize(); 
        // let tileSize = this.tmx.getTileSize(); 
        // let x = point.x * tileSize.width + Math.floor(point.y % 2) * tileSize.width / 2; 
        // let y = (mapSize.height - (point.y + 1)) * tileSize.height / 2 - tileSize.height / 2; 
        // return cc.v2(x, y); 
    }

    openglToTile (point: any) {
        // let mapSize = this.tmx.getMapSize(); 
        // let tileSize = this.tmx.getTileSize(); 
        // let x = Math.floor(mapSize.height - point.y / tileSize.height + point.x / tileSize.width - mapSize.width / 2);   
        // let y = Math.floor(mapSize.height - point.y / tileSize.height - point.x / tileSize.width + mapSize.width / 2);   
        // return cc.v2(x, y); 
    }

}


/**
 * Note: The original script has been commented out, due to the large number of changes in the script, there may be missing in the conversion, you need to convert it manually
 */
// var ObjectItem = cc.Class({
//     name: 'ObjectItem',
//     properties: {
//         layerName : "",//放置的层级名称
//         objectName : "",//tilemap的对象名称
//         tileSetName:"" , //tilemap中资源集名称  ，图片集每张图片都是从0开始 此名称同文件夹名称
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
//             type: ObjectItem,
//         },
//         mapPath:{default:'',tooltip:'tmx所在文件夹路径'},
//         itemPrefab:{type:cc.Prefab,default:null,tooltip:'地块'},
//         treeAssetFrame:{type:cc.SpriteFrame,default:null,tooltip:"未开发区域树的资源"},
//         raidTargetPrefab:{type:cc.Prefab,default:null,tooltip:'偷取瞄准对象'},
//         attackTargetPrefab:{type:cc.Prefab,default:null,tooltip:'攻击瞄准对象'},
//         brokenCell:cc.SpriteFrame,//破坏的地块
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
//         // Editor.log(tileSize,layerSize)
// 
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
// 
//         this.keyControllers.forEach(element => {
//             let layer=this.tmx.getLayer(element.layerName)
//             let buildobjGroup=this.tmx.getObjectGroup(element.objectName)
//             let objects = buildobjGroup.getObjects();
//             Editor.log(element.layerName+element.tileSetName)
//             this.createTree(buildobjGroup,layer,element.tileSetName)
//         });
// 
//         // let bgLayer=this.tmx.getLayer('bg')
//         // this.createTile(bgLayer,bgLayer.node)
// 
//         // Editor.log(bgLayer._layerName)
// 
//         this.townNode=this.node.parent.getComponent("TownNode")
//         if(!this.townNode){
//             Editor.log("TownNode不存在")
//             return
//         }
//         this.townNode.itemPrefab=this.itemPrefab
//         this.townNode.raidTargets=[]
//         this.townNode.attackTargets=[]
//         this.townNode.fixButtons=[]
// 
//         let buttonLayer=null
//         if(this.tmx.node.getChildByName("buttonLayer")){
//             buttonLayer=this.tmx.node.getChildByName("buttonLayer")
//         }else{
//             buttonLayer=new cc.Node()
//             buttonLayer.name="buttonLayer"
//             buttonLayer.anchorX=0
//             buttonLayer.anchorY=0
//             buttonLayer.parent=this.tmx.node
//         }
//         buttonLayer.removeAllChildren()
//         
// 
//         this.initRaidTargets(buttonLayer)
//         this.initAttackTargets(buttonLayer)
//         // this.initFixButton(buttonLayer)
//         this.initCoverTree(this.tmx.getLayer('cover'),this.tmx.getLayer('build').node)
// 
//         this.townNode.brokenCell=this.brokenCell
// 
//         Editor.log("地图数据生成完成")
//     },
//     //偷取按钮
//     initRaidTargets(parent){
//         let count=4
//         for (let index = 0; index <count; index++) {
//             let nd=cc.instantiate(this.raidTargetPrefab)
//             nd.name='raidTarget'+(index+1)
//             nd.parent=parent
//             let eventHandler=new cc.Component.EventHandler()
//             eventHandler.target=this.townNode.node
//             eventHandler.component='TownNode'
//             eventHandler.handler='onClickRaid'
//             eventHandler.customEventData=(index+1)
//             nd.getComponent(cc.Button).clickEvents[0]=eventHandler
//             nd.x=this.tmx.node.width/2
//             nd.y=this.tmx.node.height/2
//             this.townNode.raidTargets.push(nd)
//             nd.active=false
//         }
// 
//     },
//     //攻击按钮
//     initAttackTargets(parent){
//         let count=5
//         for (let index = 0; index <count; index++) {
//             let nd=cc.instantiate(this.attackTargetPrefab)
//             nd.name='attackTarget'+(index+1)
//             nd.parent=parent
// 
//             let eventHandler=new cc.Component.EventHandler()
//             eventHandler.target=this.townNode.node
//             eventHandler.component='TownNode'
//             eventHandler.handler='onClickAttack'
//             eventHandler.customEventData=(index+1)
//             nd.getComponent(cc.Button).clickEvents[0]=eventHandler
//             nd.x=this.tmx.node.width/2
//             nd.y=this.tmx.node.height/2
//             this.townNode.attackTargets.push(nd)
//             nd.active=false
//         }
//     },
//     // //维修按钮
//     // initFixButton(parent){
//     //     this.townNode.fixButtonPrefab=this.fixButtonPrefab
//     //     // let count=5
//     //     // for (let index = 0; index <count; index++) {
//     //     //     let nd=cc.instantiate(this.fixButtonPrefab)
//     //     //     nd.name='fixButton'+(index+1)
//     //     //     nd.parent=parent
// 
//     //     //     let eventHandler=new cc.Component.EventHandler()
//     //     //     eventHandler.target=this.townNode.node
//     //     //     eventHandler.component='TownNode'
//     //     //     eventHandler.handler='onClickFix'
//     //     //     eventHandler.customEventData=(index+1)
//     //     //     nd.getComponent(cc.Button).clickEvents[0]=eventHandler
//     //     //     nd.x=this.tmx.node.width/2
//     //     //     nd.y=this.tmx.node.height/2
//     //     //     this.townNode.fixButtons.push(nd)
//     //     //     nd.active=false
//     //     // }
//     // },
//     //地块上放置的树
//     initCoverTree(layer,parent){
//         let layerSize=layer._layerSize
//         let tileSize = this.tmx._tileSize;
//         // Editor.log(JSON.stringify(this.tmx._tileProperties))
//         // Editor.log(this.tmx._tileProperties);
//         for (let i = 0; i < layerSize.width; i++) {
//             for (let j = 0; j < layerSize.height; j++) {
//                 let index=Math.floor(i)+Math.floor(j)*layerSize.width
//                 // let tile=layer.getTiledTileAt(i,j,true)
//                 let tileGid=layer._tiles[index]
//                 if(tileGid!=0){
//                     // Editor.log(tileGid);
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
//                     nd.getChildByName("sp").getComponent(cc.Sprite).spriteFrame=this.treeAssetFrame
//                 }
//             }
//         }
//     },
//     getTilesetURL(array,tilesetGID){
//         for (let index = 0; index < array.length; index++) {
//             const element = array[index];
//             if(element.getAttribute('id')==tilesetGID){
//                 return element.getElementsByTagName('image')[0].getAttribute('source')
//             }
//         }
//         return null
//     },
//     createTile(layer,parent,tileSetName){
//         parent.removeAllChildren()
//         let layerSize=layer._layerSize
//         let tileSize = layer._mapTileSize;
//         Editor.log(JSON.stringify(layer._texGrids))
//         Editor.log(layer._tileset.firstGid);
// 
//         for (let i = 0; i < layerSize.width; i++) {
//             for (let j = 0; j < layerSize.height; j++) {
//                 let index=Math.floor(i)+Math.floor(j)*layerSize.width
//                 // let tile=layer.getTiledTileAt(i,j,true)
//                 let tileGid=layer._tiles[index]
//                 if(tileGid!=0){
//                     let gid=tileGid-layer._tileset.firstGid
//                     let texGrid=layer._textures[gid]
//                     let tex = new cc.SpriteFrame(layer._texture, cc.rect(texGrid.x, texGrid.y, texGrid.width, texGrid.height));
//                     // let nd = new cc.Node('sp');
//                     // let nd=cc.instantiate(this.itemPrefab)
//                     // nd.parent = parent;
//                     // let sp = nd.addComponent(cc.Sprite);
//                     // sp.spriteFrame = tex;
//                     // Editor.log(texGrid);
//                     // let lv=this.tmx._tileProperties[tileGid].level
//                     // if(lv<2)continue ///1级地块是默认的
//                     // // Editor.log(lv,i,j);
//                     // // this.coverMap[i+"_"+j]={col:i,row:j,index:index,gid:tileGid,lv:this.tmx._tileProperties[tileGid].level}
//                     let nd=cc.instantiate(this.itemPrefab)
//                     nd.parent=parent
//                     let pp=layer.getPositionAt(i,j)
//                     nd.x=pp.x+tileSize.width/2
//                     nd.y=pp.y
//                     nd.name=layer._layerName+"_"+index
//                     nd.zIndex=Math.floor(this.tmx.node.height-nd.y)
//                     nd.getChildByName("sp").getComponent(cc.Sprite).spriteFrame=tex
//                 }
//             }
//         }
//     },
//     //随机摆放的树或其他装饰物
//     createTree(buildobjGroup,layer,tileSetName){
//         let objects = buildobjGroup.getObjects();
//         let mapSize = this.tmx._mapSize;
//         let tileSize = this.tmx._tileSize;
//         let mapInfo=buildobjGroup._mapInfo
//         let tileSet=mapInfo._tilesets.find((n)=>n.name==tileSetName)
//         let firstGid=tileSet?tileSet.firstGid:0
// 
//         // Editor.log(tileSetName,'+++',layer._textures);
// 
//         let xmlStr=mapInfo._tsxMap[tileSetName+'.tsx']
//         let xmlParser = new cc.SAXParser();
//         let selTilesetXML = xmlParser._parseXML(xmlStr);
//         let tiles = selTilesetXML.getElementsByTagName('tile');
//         // Editor.log(JSON.stringify(mapInfo._tsxMap));
//         objects.forEach(element => {
//             let nd=cc.instantiate(this.itemPrefab)
//             nd.parent=layer.node
//             let posIdxX = element.offset.x / tileSize.width * 2;
//             let posIdxY = element.offset.y / tileSize.height;
//             nd.x = tileSize.width / 2 * (mapSize.width + posIdxX - posIdxY);
//             nd.y = tileSize.height / 2 * (mapSize.height * 2 - posIdxX - posIdxY);
//             nd.name=element.name?element.name:'obj_'+element.id
//             Editor.log(nd.name)
//             // nd.setSiblingIndex(Math.floor(this.node.height-nd.y))
//             nd.zIndex=Math.floor(this.node.height-nd.y)
//             if(tileSetName!=""){
//                 
//                 let tilesetGID=element.gid-firstGid
//                 let tileURL=this.getTilesetURL(tiles,tilesetGID)
//                 // Editor.log(tilesetGID,'tileURL',tileURL);
//                 if(!tileURL)return
//                 let infos=tileURL.split('/')
//                 let resName=infos[infos.length-1].split('.')[0]
// 
// 
//                 // let t=layer._textures[parseInt(resName)]
//                 // Editor.log(resName);
// 
//                 let url=`${this.mapPath}/${tileSetName}/${resName}.png/${resName}`
//                 Editor.log(url)
//                 let uuid=Editor.remote.assetdb.urlToUuid(url)
//                 // Editor.log(uuid,'xxxx',resName,element.gid,url);
//                 // let t=layer._textures[parseInt(resName)]
//     
//                 cc.assetManager.loadAny({ type: "uuid", uuid: uuid }, function(err, spriteFrame){
//                     if (err) {
//                         cc.error(err.message || err);
//                         return;
//                     }
//                     // Editor.log(spriteFrame);
//                     this.getChildByName("sp").getComponent(cc.Sprite).spriteFrame=spriteFrame
//                 }.bind(nd));
//             }else{
//                 let tilePos=this.openglToTile(nd.position)
// 
//                 // Editor.log('xxxx',tilePos);
//                 
//             }
//         });
//     },
//     createElement(parent){
//         let nd=cc.instantiate(this.itemPrefab)
//         nd.parent=parent
//         let posIdxX = element.offset.x / tileSize.width * 2;
//         let posIdxY = element.offset.y / tileSize.height;
//         nd.x = tileSize.width / 2 * (mapSize.width + posIdxX - posIdxY);
//         nd.y = tileSize.height / 2 * (mapSize.height * 2 - posIdxX - posIdxY);
//         nd.name=element.id
//         // nd.setSiblingIndex(Math.floor(this.node.height-nd.y))
//         nd.zIndex=Math.floor(this.node.height-nd.y)
//     },
//     tileToOpengl(point) {
//         let mapSize = this.tmx.getMapSize();
//         let tileSize = this.tmx.getTileSize();
//         let x = point.x * tileSize.width + Math.floor(point.y % 2) * tileSize.width / 2;
//         let y = (mapSize.height - (point.y + 1)) * tileSize.height / 2 - tileSize.height / 2;
//         
//         return cc.v2(x, y);
//     },
//     openglToTile(point) {
//         let mapSize = this.tmx.getMapSize();
//         let tileSize = this.tmx.getTileSize();
// 
//         // this._mapTileSize.width / 2 * ( this._layerSize.width + x - y - 1),
//         // this._mapTileSize.width / 2 *x+this._mapTileSize.width / 2 *this._layerSize.width+this._mapTileSize.width / 2 *(-y)-this._mapTileSize.width / 2 
//         //     this._mapTileSize.height / 2 * (( this._layerSize.height * 2 - x - y) - 2)
//         // let y = Math.floor((mapSize.height - 2 - ((2 * Math.floor(point.y) / Math.floor(tileSize.height)))));
//         // let x = Math.floor(point.x / tileSize.width - (y % 2) / 2);
//         // x=Math.floor(((point.x-(this.tmx.node.width/2))/mapSize.width)+((this.tmx.node.height-point.y)/mapSize.height))
// 
//         // let mapSize = this._tileMap.getMapSize();
//         // let tileSize = this._tileMap.getTileSize();
//         // let y = Math.floor((mapSize.height - 2 - ((2 * Math.floor(point.y) / Math.floor(tileSize.height)))));
//         // let x = Math.floor(point.x / tileSize.width - (y % 2) / 2);
// 
//         let x = Math.floor(mapSize.height - point.y / tileSize.height + point.x / tileSize.width - mapSize.width / 2);  
//         let y = Math.floor(mapSize.height - point.y / tileSize.height - point.x / tileSize.width + mapSize.width / 2);  
//         
//         return cc.v2(x, y);
//     },
// });
