const MergeTutorialBusinessAdapter: any = {}

MergeTutorialBusinessAdapter.GetBoardBuildButtonNodes = function(owner) {
    var mergeUI = owner.GetMergeUI ? owner.GetMergeUI() : null
    if (!mergeUI) return []
    var nodes = []
    var addNode = function(node) {
        if (node && nodes.indexOf(node) < 0) nodes.push(node)
    }
    addNode(mergeUI.buildButton)
    addNode(mergeUI.hammerButton)
    if (mergeUI.noteDialog) addNode(mergeUI.noteDialog.node || mergeUI.noteDialog)
    if (mergeUI.bottomUI && mergeUI.bottomUI.getChildByName) {
        addNode(mergeUI.bottomUI.getChildByName('build_btn'))
        addNode(mergeUI.bottomUI.getChildByName('chuizi'))
    }
    if (mergeUI.topUI && owner.GetNodeByPath) {
        addNode(owner.GetNodeByPath(mergeUI.topUI, 'table/view/content/notesUI/notedialog'))
    }
    return nodes
}

MergeTutorialBusinessAdapter.GetMainForcedTutorialBoardMapButton = function(owner) {
    var nodes = owner.GetBoardBuildButtonNodes ? owner.GetBoardBuildButtonNodes() : []
    for (var i = 0; i < nodes.length; i++) {
        if (owner.IsNodeActive(nodes[i])) return nodes[i]
    }
    return nodes.length > 0 ? nodes[0] : null
}

MergeTutorialBusinessAdapter.GetBoardBuildButtonGuideTargetNode = function(owner) {
    var mergeUI = owner.GetMergeUI ? owner.GetMergeUI() : null
    if (!mergeUI) return null
    var getBottomNode = function(name) {
        return mergeUI.bottomUI && mergeUI.bottomUI.getChildByName
            ? mergeUI.bottomUI.getChildByName(name)
            : null
    }
    var candidates = [
        getBottomNode('chuizi'),
        mergeUI.hammerButton,
        getBottomNode('build_btn'),
        mergeUI.buildButton,
    ]
    for (var i = 0; i < candidates.length; i++) {
        if (owner.IsNodeActive(candidates[i])) return candidates[i]
    }
    return null
}

MergeTutorialBusinessAdapter.RefreshBoardBuildButtonVisibility = function(owner) {
    var nodes = owner.GetBoardBuildButtonNodes ? owner.GetBoardBuildButtonNodes() : []
    if (nodes.length <= 0) return
    if (!owner.ShouldShowBoardBuildButton()) {
        for (var i = 0; i < nodes.length; i++) nodes[i].active = false
        var hiddenMergeUI = owner.GetMergeUI ? owner.GetMergeUI() : null
        if (hiddenMergeUI && hiddenMergeUI.UpdateNotesUIVisibleSafe) hiddenMergeUI.UpdateNotesUIVisibleSafe()
        else if (hiddenMergeUI && hiddenMergeUI._updateNotesUIVisible) hiddenMergeUI._updateNotesUIVisible()
        return
    }
    var mergeUI = owner.GetMergeUI ? owner.GetMergeUI() : null
    if (mergeUI && mergeUI.RefreshUpgradeButtonVisible) {
        mergeUI.RefreshUpgradeButtonVisible()
    } else if (mergeUI && mergeUI._updateUpgradeButtonVisible &&
        typeof Game !== 'undefined' && Game.SUserMap && Game.SUserMap.IsRedPoint) {
        mergeUI._updateUpgradeButtonVisible(Game.SUserMap.IsRedPoint())
    } else {
        nodes[0].active = true
    }
    if (mergeUI && mergeUI.UpdateNotesUIVisibleSafe) mergeUI.UpdateNotesUIVisibleSafe()
    else if (mergeUI && mergeUI._updateNotesUIVisible) mergeUI._updateNotesUIVisible()
}

MergeTutorialBusinessAdapter.ShouldShowBoardBuildButton = function(owner) {
    return !owner.ShouldHideMainForcedTutorialControls()
}

MergeTutorialBusinessAdapter.ShouldShowStoreButton = function(owner) {
    return !owner.ShouldHideMainForcedTutorialControls()
}

MergeTutorialBusinessAdapter.ShouldShowShopEntryButton = function(owner) {
    return !owner.ShouldHideMainForcedTutorialControls()
}

MergeTutorialBusinessAdapter.HideMainForcedTutorialSellButton = function(owner) {
    var mergeUI = owner.GetMergeUI ? owner.GetMergeUI() : null
    var mergeDes = mergeUI && mergeUI.mergeDes ? mergeUI.mergeDes : null
    if (mergeDes && mergeDes.sellButton) mergeDes.sellButton.active = false
}

MergeTutorialBusinessAdapter.RefreshMainShopEntryVisibility = function(owner) {
    var gameMainWindow = typeof GameMainWindow !== 'undefined'
        ? GameMainWindow
        : (typeof global !== 'undefined' ? global.GameMainWindow : null)
    if (gameMainWindow && gameMainWindow.instance && gameMainWindow.instance.refreshShopEntryVisibility) {
        gameMainWindow.instance.refreshShopEntryVisibility()
    }
}

MergeTutorialBusinessAdapter.RefreshMainForcedTutorialHiddenControls = function(owner) {
    owner.RefreshBoardBuildButtonVisibility()
    var mergeUI = owner.GetMergeUI ? owner.GetMergeUI() : null
    if (mergeUI && mergeUI.storeButton) mergeUI.storeButton.active = owner.ShouldShowStoreButton()
    owner.RefreshMainShopEntryVisibility()
    if (owner.ShouldHideMainForcedTutorialControls()) owner.HideMainForcedTutorialSellButton()
}

MergeTutorialBusinessAdapter.BindNodeClickTargetIfNeeded = function(owner, stepMeta) {
    if (!stepMeta || !stepMeta.CompleteType || stepMeta.CompleteType() !== owner.CompleteTypes.NodeClick) return
    if (owner.NormalizeOrderParam(stepMeta.CompleteParam()) !== 'item_shop_button') return
    var shopWnd = owner.GetWindowInstance ? owner.GetWindowInstance('ShopWindow') : null
    if (shopWnd && shopWnd.bindMergeTutorialNodeClick) shopWnd.bindMergeTutorialNodeClick()
}

MergeTutorialBusinessAdapter.GetHighestLvNormalMergeItem = function(owner) {
    var levelNode = owner.GetMergeLevelNode ? owner.GetMergeLevelNode() : null
    return levelNode && levelNode.GetHighestLvNormalMergeItem
        ? levelNode.GetHighestLvNormalMergeItem()
        : null
}

export default MergeTutorialBusinessAdapter
