import { _decorator, Button, Component, Enum, Node } from 'cc';

const { ccclass, executionOrder, property } = _decorator;

const AudioType = Enum({
    None: 0,
    OpenModal: 1,
    CloseModal: 2,
    TapButton: 3,
    LargeTransition: 4,
    SmallTransition: 5,
    Cancel: 6,
    Alert: 7,
    OK: 8,
    Slider: 9,
}) as any;

const Trigger = Enum({
    OnClick: 0,
    OnPress: 1,
    OnDrag: 2,
}) as any;

@ccclass('PlayAudio')
@executionOrder(-1)
export class PlayAudio extends Component {
    @property({ type: Trigger })
    public trigger = Trigger.OnClick;

    @property({ type: AudioType })
    public audioType = AudioType.None;

    onEnable() {
        if (this.trigger === Trigger.OnPress) {
            this.node.on(Node.EventType.TOUCH_START, this.onTouchSound, this);
        } else if (this.trigger === Trigger.OnClick) {
            this.node.on(Node.EventType.TOUCH_END, this.onTouchSound, this);
        } else if (this.trigger === Trigger.OnDrag) {
            this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchSound, this);
        }
    }

    onDisable() {
        this.node.targetOff(this);
    }

    PlaySound() {
        const soundName = this.GetSoundName(this.audioType);
        if (soundName == null) return;
        GameKit.SoundManager.playSound(soundName);
    }

    GetSoundName(type: any) {
        switch (type) {
            case AudioType.OpenModal:
                return 'se_open';
            case AudioType.CloseModal:
                return 'se_back';
            case AudioType.TapButton:
                return 'se_tap';
            case AudioType.LargeTransition:
                return 'se_confirm';
            case AudioType.SmallTransition:
                return 'se_ok';
            case AudioType.Cancel:
                return 'se_back';
            case AudioType.Alert:
                return 'se_alert';
            case AudioType.OK:
                return 'se_ok';
            case AudioType.Slider:
                return 'se_slider';
        }
        return null;
    }

    static playOpen() {
        GameKit.SoundManager.playSound('se_open');
    }

    static playClose() {
        GameKit.SoundManager.playSound('se_back');
    }

    static playOk() {
        GameKit.SoundManager.playSound('se_ok');
    }

    private onTouchSound() {
        const button = this.node.getComponent(Button);
        if (button && !button.interactable) return;
        this.PlaySound();
    }
}

export default PlayAudio;
