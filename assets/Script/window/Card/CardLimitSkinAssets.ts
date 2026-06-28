import { _decorator, Component, SpriteFrame } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CardLimitSkinAssets')
export class CardLimitSkinAssets extends Component {
    @property(SpriteFrame)
    public shopItemBg = null;
    @property(SpriteFrame)
    public desItemBg = null;
    @property(SpriteFrame)
    public cardBg = null;
    @property(SpriteFrame)
    public cardDiBg = null;
    @property(SpriteFrame)
    public subject_4_image = null;
    @property(SpriteFrame)
    public subject_4_image_open = null;
    @property(SpriteFrame)
    public subject_8_image = null;
    @property(SpriteFrame)
    public subject_8_image_open = null;
}


var CardLimitSkinAssetsSetting={}
CardLimitSkinAssetsSetting.isActive=false//是否开启限时卡牌
CardLimitSkinAssetsSetting.box = {
    '14':'subject_4_image',
    '14_open':'subject_4_image_open',
    '15':'subject_8_image',
    '15_open':'subject_8_image_open',
}
global.CardLimitSkinAssetsSetting = CardLimitSkinAssetsSetting
/**
 * Note: The original script has been commented out, due to the large number of changes in the script, there may be missing in the conversion, you need to convert it manually
 */
// cc.Class({
//     extends: cc.Component,
// 
//     properties: {
//         shopItemBg:{
//             default:null,
//             type:cc.SpriteFrame,
//             tooltip:'商店中背景图',
//         },
//         desItemBg:{
//             default:null,
//             type:cc.SpriteFrame,
//             tooltip:'箱子描述背景图',
//         },
//         cardBg:{
//             default:null,
//             type:cc.SpriteFrame,
//             tooltip:'卡片背景框',
//         },
//         cardDiBg:{
//             default:null,
//             type:cc.SpriteFrame,
//             tooltip:'卡片底图',
//         },
//         subject_4_image:{
//             default:null,
//             type:cc.SpriteFrame,
//             tooltip:'4张卡箱子图',
//         },
//         subject_4_image_open:{
//             default:null,
//             type:cc.SpriteFrame,
//             tooltip:'4张卡箱子打开图',
//         },
//         subject_8_image:{
//             default:null,
//             type:cc.SpriteFrame,
//             tooltip:'8张卡箱子图',
//         },
//         subject_8_image_open:{
//             default:null,
//             type:cc.SpriteFrame,
//             tooltip:'8张卡箱子打开图',
//         },
//     },
// });
// var CardLimitSkinAssetsSetting={}
// CardLimitSkinAssetsSetting.isActive=false//是否开启限时卡牌
// //限时卡牌箱子对应id
// CardLimitSkinAssetsSetting.box = {
//     '14':'subject_4_image',
//     '14_open':'subject_4_image_open',
//     '15':'subject_8_image',
//     '15_open':'subject_8_image_open',
// }
// global.CardLimitSkinAssetsSetting = CardLimitSkinAssetsSetting
