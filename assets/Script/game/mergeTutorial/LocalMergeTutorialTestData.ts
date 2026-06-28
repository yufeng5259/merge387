const LocalMergeTutorialTestData: any = {}

LocalMergeTutorialTestData.TutorialOrders = {
    tutorial_order_test_1: {
        claimed: false,
        orderId: 900001,
        isTutorialOrder: true,
        tutorialOrderKey: 'tutorial_order_test_1',
        rewards: [
            {
                cid: 0,
                type: 1,
                count: 12,
            },
        ],
        roleName: 'pig',
        completed: false,
        slotIndex: 0,
        matchedCells: {
            102103: [],
        },
        requiredPieces: {
            102103: 1,
        },
        activityRewards: [],
        additionRewards: [],
    },
}

LocalMergeTutorialTestData.GetTutorialOrder = function(key) {
    var order = this.TutorialOrders[key]
    if (!order) return null
    return JSON.parse(JSON.stringify(order))
}

export default LocalMergeTutorialTestData
