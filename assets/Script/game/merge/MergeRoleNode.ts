import { _decorator, Component, sp } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('MergeRoleNode')
export class MergeRoleNode extends Component {
    @property(sp.Skeleton)
    public ske: sp.Skeleton | null = null;

    @property
    public nameIdle = 'idle';

    @property
    public nameIdle2 = 'idle2';

    @property
    public nameHappy = 'happy';

    @property
    public nameLeave = 'leave';

    @property
    public nameShow = 'show';

    private _realtimeModeSkeleton: sp.Skeleton | null = null;
    private _roleSkeletonData: sp.SkeletonData | null = null;

    onLoad () {
        if (!this.ske) {
            this.ske = this.getComponent(sp.Skeleton);
        }
        this._ensureRealtimeMode();
    }

    start () {
    }

    _ensureRealtimeMode () {
        if (!this.ske || !this.ske.setAnimationCacheMode) return;
        if (this._realtimeModeSkeleton === this.ske) return;
        this.ske.setAnimationCacheMode(sp.Skeleton.AnimationCacheMode.REALTIME);
        this._realtimeModeSkeleton = this.ske;
    }

    setRoleSkeletonData (skeletonData: sp.SkeletonData | null) {
        if (!this.ske || !skeletonData) return false;
        this._ensureRealtimeMode();
        if (this._roleSkeletonData === skeletonData && this.ske.skeletonData === skeletonData) return false;
        this.ske.skeletonData = skeletonData;
        this.ske.clearTracks();
        this.ske.setToSetupPose();
        this._roleSkeletonData = skeletonData;
        return true;
    }

    _preparePlayback () {
        if (!this.ske) return;
        this._ensureRealtimeMode();
        this.ske.paused = false;
        this.ske.setCompleteListener(null);
    }

    _play (name: any, loop: any, nextName?: any, nextLoop?: any) {
        if (!this.ske || !name) return;
        this._preparePlayback();
        this.ske.setAnimation(0, name, !!loop);
        if (nextName) {
            this.ske.addAnimation(0, nextName, !!nextLoop);
        }
    }

    playIdle () {
        this._play(this.nameIdle, true);
    }

    playHappy () {
        this._play(this.nameHappy, false, this.nameIdle2, true);
    }

    playLeave (cb?: () => void) {
        if (!this.ske || !this.nameLeave) {
            if (cb) cb();
            return;
        }
        this._preparePlayback();
        let finished = false;
        const finish = () => {
            if (finished) return;
            finished = true;
            if (this.ske) this.ske.setCompleteListener(null);
            if (cb) cb();
        };
        const trackEntry = this.ske.setAnimation(0, this.nameLeave, false);
        if (trackEntry && this.ske.setTrackCompleteListener) {
            this.ske.setTrackCompleteListener(trackEntry, finish);
        } else {
            this.ske.setCompleteListener(finish);
        }
    }

    playShow () {
        this._play(this.nameShow, false, this.nameIdle, true);
    }

    playComplete () {
        this.playHappy();
    }
}

export default MergeRoleNode;
