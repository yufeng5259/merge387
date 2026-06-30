import '../../../LegacyGlobals';

export default class SRUserData {
    static getData() {
        const req = new GameKit.ServerRequest("getUserData");
        req.SetCallBack((res: any) => {
            Game.SUser.updateData(res.userdata);
            if (SR && SR.SRMerge && SR.SRMerge.ApplyLatestLocalResourceShadow) {
                SR.SRMerge.ApplyLatestLocalResourceShadow("getUserData");
            }
        });
        return req;
    }

    static finishVideoAp() {
        const req = new GameKit.ServerRequest("finishVideoAp");
        return req;
    }

    static finishVideoCoin(byTip = false) {
        const req = new GameKit.ServerRequest("finishVideoCoin");
        req.SetRequestBody("byTip", !!byTip);
        return req;
    }

    static finishVideoSlotCoin6() {
        const req = new GameKit.ServerRequest("finishVideoSlotCoin6");
        return req;
    }

    static finishVideoShield() {
        const req = new GameKit.ServerRequest("finishVideoShield");
        return req;
    }

    static finishVideoPeterGift() {
        const req = new GameKit.ServerRequest("finishVideoPeterGift");
        return req;
    }

    static finishVideoLuckyDraw() {
        const req = new GameKit.ServerRequest("finishVideoLuckyDraw");
        return req;
    }

    static heartBeat() {
        const req = new GameKit.ServerRequest("heartBeat");
        req.SetSilence(true);
        return req;
    }

    static cashTaskGet(taskId: any) {
        const req = new GameKit.ServerRequest("cashTaskGet");
        req.SetRequestBody("taskId", taskId);
        return req;
    }

    static cashExchange(shopId: any) {
        const req = new GameKit.ServerRequest("cashExchange");
        req.SetRequestBody("shopId", shopId);
        return req;
    }

    static saveAvatarInfo(avatar: any, name: any) {
        const req = new GameKit.ServerRequest("setUserAvatar");
        req.SetRequestBody("avatar", avatar);
        req.SetRequestBody("name", name);
        return req;
    }
}

SR.SRUserData = SRUserData;
