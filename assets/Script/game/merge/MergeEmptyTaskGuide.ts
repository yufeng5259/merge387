const MergeEmptyTaskGuide: any = {};

MergeEmptyTaskGuide.TaskEmptyMessageKey = 'Task_Empty_Msg';
MergeEmptyTaskGuide.ContainerPathFromTopUI = 'table/tutorialNode';
MergeEmptyTaskGuide.ContainerPathFromMergeUI = 'topUI/table/tutorialNode';
MergeEmptyTaskGuide.GuideOffsetY = 53;
MergeEmptyTaskGuide.ArrowPathFromTopUI = 'table/view/content/notesUI/notedialog/arrow4';
MergeEmptyTaskGuide.ArrowPathFromMergeUI = 'topUI/table/view/content/notesUI/notedialog/arrow4';
MergeEmptyTaskGuide.EventShowDelaySeconds = 5;

MergeEmptyTaskGuide.resolveLocalizedRichText = (text: any, i18n: any) => {
    if (text == null) return '';
    const rawText = String(text);
    if (!i18n || !i18n.sel) return rawText;
    try {
        const data = JSON.parse(rawText.trim());
        if (data && typeof data === 'object') return i18n.sel(data);
    } catch (e) {
    }
    return rawText;
};

MergeEmptyTaskGuide.getTaskEmptyMessage = (i18n: any) => {
    const text = i18n && i18n.t ? i18n.t(MergeEmptyTaskGuide.TaskEmptyMessageKey) : MergeEmptyTaskGuide.TaskEmptyMessageKey;
    return MergeEmptyTaskGuide.resolveLocalizedRichText(text, i18n).replace(/\\n/g, '\n');
};

MergeEmptyTaskGuide.hasOrders = (orders: any[]) => Array.isArray(orders) && orders.length > 0;
MergeEmptyTaskGuide.shouldHideForOrders = (orders: any[]) => MergeEmptyTaskGuide.hasOrders(orders);
MergeEmptyTaskGuide.shouldShowForOrders = (orders: any[]) => Array.isArray(orders) && orders.length === 0;
MergeEmptyTaskGuide.getOrdersLengthFromUserMerge = (userMerge: any) => {
    const orders = userMerge && userMerge.data && userMerge.data.orderData && userMerge.data.orderData.orders;
    const reminder = MergeEmptyTaskGuide.getOrderReminderLevel();
    if (reminder != null) {
        const playerLevel = MergeEmptyTaskGuide.getPlayerLevelForOrderReminder(userMerge);
        if (playerLevel != null && playerLevel > reminder) return -1;
    }
    return Array.isArray(orders) ? orders.length : -1;
};
MergeEmptyTaskGuide.getOrderReminderLevel = () => {
    if (typeof G === 'undefined' || !G.GameConstance) return null;
    const reminder = Number(G.GameConstance.orderReminder);
    return isFinite(reminder) ? reminder : null;
};
MergeEmptyTaskGuide.getPlayerLevelForOrderReminder = (userMerge: any) => {
    let level = typeof Game !== 'undefined' && Game.SUser?.Level ? Game.SUser.Level() : null;
    if ((level == null || level === '') && userMerge?.GetPlayerLevel) level = userMerge.GetPlayerLevel();
    if ((level == null || level === '') && userMerge?.data) level = userMerge.data.playerLevel;
    const numericLevel = Number(level);
    return isFinite(numericLevel) ? numericLevel : null;
};
MergeEmptyTaskGuide.shouldShowForUserMerge = (userMerge: any) => MergeEmptyTaskGuide.getOrdersLengthFromUserMerge(userMerge) === 0;

export default MergeEmptyTaskGuide;
