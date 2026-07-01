import { _decorator } from 'cc';
import StoryWindow from './StoryWindow';

const { ccclass } = _decorator;

@ccclass('GeneralStotyWindow')
export default class GeneralStotyWindow extends StoryWindow {
    public static windowPath = 'Story/GeneralStotyWindow';

    init() {
        return;
    }
}
