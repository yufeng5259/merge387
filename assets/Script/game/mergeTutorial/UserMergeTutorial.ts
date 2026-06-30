import '../../LegacyGlobals';
export class UserMergeTutorial {
    public data: any;
    constructor(userId?: any) {
        this.data = {
            userId: userId,
            tutorialMap: {},
        }
    }

    updateData(data) {
        data = data || {}
        for (var key in data) {
            this.data[key] = data[key]
        }
        return this
    }

    getData() {
        let data = {}
        for (var key in this.data) {
            data[key] = this.data[key]
        }
        return data
    }

    setData(key, value) {
        this.data[key] = value
    }

    UserId() {
        return this.data.userId
    }

    TutorialMap() {
        return this.data.tutorialMap || {}
    }

    TutorialId(groupId) {
        return this.TutorialMap()[groupId]
    }

    SetTutorialId(groupId, id) {
        this.data.tutorialMap = this.data.tutorialMap || {}
        this.data.tutorialMap[groupId] = id
    }
}
