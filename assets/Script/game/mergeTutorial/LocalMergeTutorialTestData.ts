const LocalMergeTutorialTestData: any = {}

LocalMergeTutorialTestData.OverrideP4 = false

LocalMergeTutorialTestData.MergeTutorialTriggers = {
    3040010: {
        id: 3040010,
        des: 'P4 first building local fallback',
        trigger_event: 'coin_reach',
        trigger_param: '',
        condition_type: 'building_coin_gate',
        condition_param: 'mapId=1;buildId=1;levels=1,2',
        first_step_id: 1040010,
        completion_report_id: 1040130,
        priority: 100,
        once: true,
        allow_during_forced: false,
        block_mode: 'force',
        enabled: true,
    },
}

LocalMergeTutorialTestData.MergeTutorialSteps = {
    1040010: {
        id: 1040010,
        type: 0,
        des: 'P4 tap town',
        next_id: 1040020,
        complete_type: 'node_click',
        complete_param: 'town_button',
        guide_id: 2040010,
        save_server: false,
    },
    1040020: {
        id: 1040020,
        type: 0,
        des: 'P4 tap first building',
        next_id: 1040030,
        complete_type: 'node_click',
        complete_param: 'mapId=1;buildId=1',
        guide_id: 2040020,
        save_server: false,
    },
    1040030: {
        id: 1040030,
        type: 0,
        des: 'P4 buy first building',
        next_id: 1040040,
        complete_type: 'node_click',
        complete_param: 'building_buy_button',
        guide_id: 2040030,
        save_server: false,
    },
    1040040: {
        id: 1040040,
        type: 0,
        des: 'P4 wait first building flow',
        next_id: 1040050,
        complete_type: 'flow_event',
        complete_param: 'town_upgrade_flow_done;mapId=1;buildId=1',
        guide_id: 0,
        save_server: false,
    },
    1040050: {
        id: 1040050,
        type: 0,
        des: 'P4 tap first building again',
        next_id: 1040060,
        complete_type: 'node_click',
        complete_param: 'mapId=1;buildId=1',
        guide_id: 2040050,
        save_server: false,
    },
    1040060: {
        id: 1040060,
        type: 0,
        des: 'P4 upgrade first building',
        next_id: 1040070,
        complete_type: 'node_click',
        complete_param: 'building_upgrade_button',
        guide_id: 2040060,
        save_server: false,
    },
    1040070: {
        id: 1040070,
        type: 0,
        des: 'P4 claim level reward',
        next_id: 1040080,
        complete_type: 'node_click',
        complete_param: 'level_reward_button',
        guide_id: 2040070,
        save_server: false,
    },
    1040080: {
        id: 1040080,
        type: 0,
        des: 'P4 wait upgrade flow',
        next_id: 1040090,
        complete_type: 'flow_event',
        complete_param: 'town_upgrade_flow_done;mapId=1;buildId=1',
        guide_id: 0,
        save_server: false,
    },
    1040090: {
        id: 1040090,
        type: 0,
        des: 'P4 back to board',
        next_id: 1040130,
        complete_type: 'node_click',
        complete_param: 'back_to_board_button',
        guide_id: 2040090,
        save_server: false,
    },
    1040130: {
        id: 1040130,
        type: 200,
        des: 'P4 end',
        next_id: 0,
        complete_type: 'none',
        complete_param: '',
        guide_id: 0,
        save_server: false,
    },
}

LocalMergeTutorialTestData.MergeTutorialGuides = {
    2040010: {
        id: 2040010,
        guide_type: 'click',
        target_type: 'node',
        target_from: 'town_button',
        dialog_text: '太好了,我们去海边看看,点击小镇按钮',
        dialog_rect: '0,-335,340,120',
        mask: true,
        highlight_type: 'node',
        highlight_param: 'town_button',
    },
    2040020: {
        id: 2040020,
        guide_type: 'click',
        target_type: 'node',
        target_from: 'mapId=1;buildId=1',
        dialog_text: '点击购买建筑',
        dialog_rect: '0,-335,340,120',
        mask: true,
        highlight_type: 'node',
        highlight_param: 'mapId=1;buildId=1',
    },
    2040030: {
        id: 2040030,
        guide_type: 'click',
        target_type: 'node',
        target_from: 'building_buy_button',
        dialog_text: '点击购买建筑',
        dialog_rect: '0,-335,340,120',
        mask: true,
        highlight_type: 'node',
        highlight_param: 'building_buy_button',
    },
    2040040: {
        id: 2040040,
        guide_type: 'none',
        target_type: 'none',
        dialog_text: '',
        mask: false,
        highlight_type: 'none',
        highlight_param: '',
    },
    2040050: {
        id: 2040050,
        guide_type: 'click',
        target_type: 'node',
        target_from: 'mapId=1;buildId=1',
        dialog_text: '你现在拥有了一个海边酒吧，现在来继续升级',
        dialog_rect: '0,-335,340,120',
        mask: true,
        highlight_type: 'node',
        highlight_param: 'mapId=1;buildId=1',
    },
    2040060: {
        id: 2040060,
        guide_type: 'click',
        target_type: 'node',
        target_from: 'building_upgrade_button',
        dialog_text: '点击升级建筑',
        dialog_rect: '0,-335,340,120',
        mask: true,
        highlight_type: 'node',
        highlight_param: 'building_upgrade_button',
    },
    2040070: {
        id: 2040070,
        guide_type: 'click',
        target_type: 'node',
        target_from: 'level_reward_button',
        dialog_text: '领取升级奖励',
        dialog_rect: '0,-335,340,120',
        mask: true,
        highlight_type: 'node',
        highlight_param: 'level_reward_button',
    },
    2040080: {
        id: 2040080,
        guide_type: 'none',
        target_type: 'none',
        dialog_text: '',
        mask: false,
        highlight_type: 'none',
        highlight_param: '',
    },
    2040090: {
        id: 2040090,
        guide_type: 'click',
        target_type: 'node',
        target_from: 'back_to_board_button',
        dialog_text: '让我们回到棋盘！赚取更多金币!',
        dialog_rect: '0,-335,340,120',
        mask: true,
        highlight_type: 'node',
        highlight_param: 'back_to_board_button',
    },
}

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

LocalMergeTutorialTestData.CloneData = function(data) {
    if (!data) return null
    return JSON.parse(JSON.stringify(data))
}

LocalMergeTutorialTestData.IsP4Id = function(id) {
    id = parseInt(id, 10)
    return id === 3040010 || id === 1040010 || id === 1040020 || id === 1040030 ||
        id === 1040040 || id === 1040050 || id === 1040060 || id === 1040070 ||
        id === 1040080 || id === 1040090 || id === 1040130 ||
        id === 2040010 || id === 2040020 || id === 2040030 || id === 2040040 ||
        id === 2040050 || id === 2040060 || id === 2040070 || id === 2040080 ||
        id === 2040090
}

LocalMergeTutorialTestData.GetMergeTutorialStep = function(id) {
    return this.CloneData(this.MergeTutorialSteps[id])
}

LocalMergeTutorialTestData.GetMergeTutorialGuide = function(id) {
    return this.CloneData(this.MergeTutorialGuides[id])
}

LocalMergeTutorialTestData.GetMergeTutorialTrigger = function(id) {
    return this.CloneData(this.MergeTutorialTriggers[id])
}

LocalMergeTutorialTestData.GetMergeTutorialTriggers = function() {
    return this.CloneData(this.MergeTutorialTriggers) || {}
}

export default LocalMergeTutorialTestData