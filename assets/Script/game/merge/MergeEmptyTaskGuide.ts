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
    return Array.isArray(orders) ? orders.length : -1;
};
MergeEmptyTaskGuide.shouldShowForUserMerge = (userMerge: any) => MergeEmptyTaskGuide.getOrdersLengthFromUserMerge(userMerge) === 0;

export default MergeEmptyTaskGuide;
