import { _decorator, Component, EditBox, Node, tween, Vec3 } from 'cc';
import { ScrollViewTool } from '../../GameKit/ui/ScrollViewTool';
import { UserInfoModel } from '../UserInfoModel';

const { ccclass, property } = _decorator;

type FriendMap = Record<string, any>;
type FriendItemInit = (index: number, id: string, node: Node, friendData: any) => void;

@ccclass('FriendsModel')
export default class FriendsModel extends Component {
    public friend_list: FriendMap = {};
    public name_list: string[] = [];

    @property(ScrollViewTool)
    public svt: ScrollViewTool | null = null;

    @property(Node)
    public no_friends: Node | null = null;

    @property(EditBox)
    public edit_box: EditBox | null = null;

    @property(Node)
    public sp_search_end: Node | null = null;

    private f_svt: FriendItemInit = () => {};

    public init(f_svt: FriendItemInit, friend_list: FriendMap = Game.SUser.FriendsList()): void {
        this.f_svt = f_svt || (() => {});
        this.friend_list = friend_list || {};
        this.name_list = [];

        for (const id in this.friend_list) {
            this.name_list.push(this.friend_list[id].Name());
        }

        if (this.sp_search_end) this.sp_search_end.active = false;
        this.create_svt();
    }

    public create_svt(): void {
        const id_list: string[] = [];
        for (const id in this.friend_list) {
            id_list.push(id);
        }

        if (this.no_friends) this.no_friends.active = this.name_list.length === 0;
        if (!this.svt) return;

        this.svt.setItem(id_list, (index, id, node) => {
            const friend_data = this.friend_list[id];
            const userinfo = GameKit.ControllerTable.GetNode(node, 'userinfo').getComponent(UserInfoModel);
            if (userinfo) userinfo.show(friend_data);
            this.f_svt(index, String(id), node, friend_data);
        });
    }

    public event_search_change_key(): void {
        if (this.sp_search_end) this.sp_search_end.active = false;
    }

    public event_search(): void {
        if (!this.edit_box || !this.svt) return;

        const key = this.edit_box.string;
        const matcher = new RegExp(`${key}`, 'i');
        let count = 0;

        this.name_list.forEach((name, index) => {
            const item = this.svt?.items[index];
            if (!item) return;

            item.active = matcher.test(name);
            if (item.active) count += 1;
        });

        if (this.no_friends) this.no_friends.active = count === 0;
        this.playSearchEndAnim();
    }

    private playSearchEndAnim(): void {
        if (!this.sp_search_end) return;

        this.sp_search_end.setScale(Vec3.ZERO);
        this.sp_search_end.active = true;
        tween(this.sp_search_end)
            .to(0.5, { scale: Vec3.ONE }, { easing: 'backOut' })
            .start();
    }
}
