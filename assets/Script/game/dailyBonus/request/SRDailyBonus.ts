import '../../../LegacyGlobals';
const SRDailyBonus: any = {};

SRDailyBonus.doDailyBonus = function() {
    const req = new GameKit.ServerRequest('doDailyBonus');
    req.SetSilence(true);
    req.SetCallBack(() => {
        Game.SUserSlot.data.dailyBonusDid++;
        Game.SUserSlot.UpdateDailyBonus();

        Game.SUserSlot.data.slotData.dailyBonusCount.normal = Game.SUserSlot.data.slotData.dailyBonusCount.normal || 0;
        Game.SUserSlot.data.slotData.dailyBonusCount.normal += 1;

        if (GameMainWindow.instance != null) {
            GameMainWindow.instance.setMenuBadge();
        }
    });
    return req;
};

SR.SRDailyBonus = SRDailyBonus;

export default SRDailyBonus;
