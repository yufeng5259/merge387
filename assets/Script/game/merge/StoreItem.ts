import { _decorator, Component, Node, Sprite } from 'cc';
import { ContentModel } from '../items/ContentModel';

const { ccclass, property } = _decorator;

@ccclass('StoreItem')
export class StoreItem extends Component {
    @property(Sprite)
    public icon: Sprite | null = null;

    @property(Node)
    public addGrid: Node | null = null;

    @property(Node)
    public hole: Node | null = null;

    @property(ContentModel)
    public contentModel: ContentModel | null = null;

    start () {
    }
}

export default StoreItem;
