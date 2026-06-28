import { _decorator, Component } from 'cc';

const { ccclass } = _decorator;

@ccclass('BackGroundManager')
export class BackGroundManager extends Component {
    public static instance: BackGroundManager | null = null;

    onLoad(): void {
        BackGroundManager.instance = this;
    }

    onDestroy(): void {
        if (BackGroundManager.instance === this) {
            BackGroundManager.instance = null;
        }
    }

    showMenu(): void {
    }

    showGame(): void {
    }
}

export default BackGroundManager;
