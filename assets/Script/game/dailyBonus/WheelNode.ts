import { _decorator, Component, Label, Node } from 'cc';
const { ccclass, property } = _decorator;

const SE_spin_start = 'db_wheel_spin_start';
const SE_spin_loop = 'db_wheel_spin_loop';
const SE_spin_end = 'db_wheel_spin_end';

@ccclass('WheelNode')
export class WheelNode extends Component {
    @property(Node)
    public rotationRoot: Node | null = null;
    @property
    public isGold = false;
    @property(Node)
    public pendant: Node | null = null;
    @property(Node)
    public goldenWingLeft: Node | null = null;
    @property(Node)
    public goldenWingRight: Node | null = null;
    @property([Label])
    public nums: Label[] = [];

    public running = false;
    public maxSpeed = 800;
    public acce = 0;
    public speed = 0;
    public isAtten = false;
    public leftDegree = 0;
    public oldY = 85;
    public completeCallback: ((coinNum: any) => void) | null = null;
    public readyStop = false;
    public resultCoinNum: any = 0;

    onLoad() {
    }

    start() {
        const mapId = Game.SUserVillage.MapId();
        const rewardMeta = Meta.MetaManager.GetMeta(Meta.MetaType.DailyBonusReward, mapId);
        for (let i = 0; i < this.nums.length; i++) {
            const num = this.isGold ? rewardMeta.GetGold(i) : rewardMeta.GetNormal(i);
            if (this.nums[i]) this.nums[i].string = BigNumber.format(num);
        }
    }

    Clear() {
        this.running = false;
        this.speed = 0;
        if (this.rotationRoot && this.nums.length > 0) {
            this.rotationRoot.angle = (3 / this.nums.length) * 360;
        }
    }

    update(dt: any) {
        if (this.running) this.run(dt);
    }

    startRun(cb: any) {
        if (this.running) return;
        this.running = true;
        this.completeCallback = cb;
        this.speed = 1;
        this.acce = 0;
        this.readyStop = false;
        this.isAtten = false;
        Logs.Info('bonus start');
        GameKit.SoundManager.playSound(SE_spin_start);
        this.scheduleOnce(() => {
            GameKit.SoundManager.playSound(SE_spin_loop, true);
        }, 1);
    }

    stopRandom() {
        const index = Math.floor(Math.random() * this.nums.length);
        this.stopAt(index);
    }

    stopAt(index: any) {
        const targetIndex = Number(index) || 0;
        this.leftDegree = targetIndex * 45 + 360 * G.getRandomInt(8, 12);
        const mapId = Game.SUserVillage.MapId();
        const rewardMeta = Meta.MetaManager.GetMeta(Meta.MetaType.DailyBonusReward, mapId);
        this.resultCoinNum = this.isGold ? rewardMeta.GetGold(targetIndex) : rewardMeta.GetNormal(targetIndex);
        this.readyStop = true;
    }

    run(dt: any) {
        if (!this.rotationRoot) return;

        if (!this.isAtten) {
            if (this.speed < this.maxSpeed) {
                this.speed += this.acce * dt * 2;
                this.acce += 180 * dt;
                if (this.speed >= this.maxSpeed) this.speed = this.maxSpeed;
            } else if (this.readyStop && this.speed >= this.maxSpeed) {
                const rot = this.rotationRoot.angle;
                this.leftDegree -= GameKit.FuncTools.GetNormalAngles(rot);
                this.isAtten = true;
                this.scheduleOnce(() => {
                    GameKit.SoundManager.stopSound(SE_spin_loop);
                    GameKit.SoundManager.playSound(SE_spin_end);
                }, 2.5);
                return;
            }
        } else {
            this.speed -= this.speed * dt * 2;
            if (this.speed < this.leftDegree + 1) this.speed = this.leftDegree + 1;
        }

        let rotateDelta = this.speed * dt;
        if (this.isAtten) {
            if (this.leftDegree < rotateDelta) {
                rotateDelta = this.leftDegree;
                this.running = false;
                if (this.completeCallback) this.completeCallback(this.resultCoinNum);
            } else {
                this.leftDegree -= rotateDelta;
            }
        }
        this.rotationRoot.angle = GameKit.FuncTools.GetNormalAngles(this.rotationRoot.angle + rotateDelta);
    }

    showWheel() {
        this.node.active = true;
        this.node.setPosition(this.node.position.x, this.oldY, this.node.position.z);
        if (this.rotationRoot && this.nums.length > 0) {
            this.rotationRoot.angle = (3 / this.nums.length) * 360;
        }

        const enterCloseAnim = this.getComponent('EnterCloseAnim') as any;
        if (enterCloseAnim?.enterAnim) {
            enterCloseAnim.enterAnim(() => {
                this.showPendant();
                this.startMove();
            });
        } else {
            this.showPendant();
            this.startMove();
        }
    }

    showPendant() {
        if (this.pendant) this.pendant.active = true;
        if (this.goldenWingLeft) this.goldenWingLeft.angle = 0;
        if (this.goldenWingRight) this.goldenWingRight.angle = 0;
    }

    hideWheel(callback: any) {
        this.stopMove();
        const enterCloseAnim = this.getComponent('EnterCloseAnim') as any;
        const done = () => {
            this.node.active = false;
            if (callback) callback();
        };
        if (enterCloseAnim?.closeAnim) {
            enterCloseAnim.closeAnim(done);
        } else {
            done();
        }
    }

    startMove() {
    }

    stopMove() {
    }

    resetPos() {
        this.node.setPosition(this.node.position.x, this.oldY, this.node.position.z);
    }

    isRunning() {
        return this.running;
    }
}
