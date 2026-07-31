import { _decorator, Component, Label } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('NumAnim')
export class NumAnim extends Component {
    @property(Label)
    public targetLabel: Label | null = null;

    private playing = false;
    private fromValue = 0;
    private toValue = 0;
    private playTime = 0;
    private currentValue = 0;
    private duration = 0;

    public update(dt: number): void {
        if (!this.playing) {
            return;
        }

        this.playTime += dt;
        const ratio = this.duration > 0 ? this.playTime / this.duration : 1;
        this.currentValue = Math.floor(Math.lerp(this.fromValue, this.toValue, ratio));
        if (this.playTime >= this.duration) {
            this.playTime = this.duration;
            this.playing = false;
            this.currentValue = this.toValue;
        }

        this.setValue(this.currentValue);
    }

    public playAnim(from: number | null | undefined, to: number, duration: number): void {
        if (duration <= 0) {
            this.setCurrentValue(to);
            return;
        }

        this.playing = true;
        this.fromValue = from == null ? this.currentValue : from;
        this.toValue = to;
        this.playTime = 0;
        this.duration = duration;
        this.setValue(this.fromValue);
    }

    public setValue(value: number): void {
        const label = this.targetLabel || this.getComponent(Label);
        if (label) {
            label.string = GameKit.StringUtil.formatNumber(value);
        }
    }

    public getCurrentValue(): number {
        return this.currentValue;
    }

    public setCurrentValue(v: number): void {
        this.currentValue = v;
        this.setValue(this.currentValue);
    }

    public stopAt(value: number): void {
        this.playing = false;
        this.playTime = 0;
        this.duration = 0;
        this.fromValue = value;
        this.toValue = value;
        this.setCurrentValue(value);
    }
}

export default NumAnim;
